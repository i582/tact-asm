import {spawn} from "child_process"
import {globSync} from "fs"
import * as path from "path"

interface TestResult {
    file: string
    success: boolean
    error?: string
    duration?: number
}

class Mutex {
    private mutex = Promise.resolve()

    async lock(): Promise<() => void> {
        let resolve: () => void
        const promise = new Promise<void>(res => {
            resolve = res
        })
        const prev = this.mutex
        this.mutex = promise
        await prev
        return resolve!
    }
}

class ProgressBar {
    private current: number = 0
    private readonly total: number
    private readonly width: number = 40
    private readonly startTime: number

    constructor(total: number) {
        this.total = total
        this.startTime = Date.now()
    }

    update(current: number) {
        this.current = current
        const percentage = Math.round((this.current / this.total) * 100)
        const filled = Math.round((this.width * this.current) / this.total)
        const bar = "█".repeat(filled) + "-".repeat(this.width - filled)

        // Calculate ETA
        const elapsed = Date.now() - this.startTime
        const avgTimePerItem = elapsed / this.current
        const remaining = this.total - this.current
        const eta = Math.round((avgTimePerItem * remaining) / 1000)

        process.stdout.write(
            `\r[${bar}] ${percentage}% (${this.current}/${this.total}) ETA: ${eta}s`,
        )
    }

    finish() {
        const totalTime = (Date.now() - this.startTime) / 1000
        process.stdout.write(`\nCompleted in ${totalTime.toFixed(1)}s\n`)
    }
}

const consoleMutex = new Mutex()

async function findTsFiles(directory: string): Promise<string[]> {
    return globSync(`**/*.ts`, {
        cwd: `${__dirname}/${directory}`,
    }).map(it => `${__dirname}/${directory}/${it}`)
}

async function runTest(file: string): Promise<TestResult> {
    return new Promise(resolve => {
        const TEST_TIMEOUT = 30000 // 30 seconds timeout
        const startTime = Date.now()

        const nodeProcess = spawn("node", ["-r", "@swc-node/register", "--no-warnings", file], {
            stdio: ["ignore", "pipe", "pipe"],
            env: {
                ...process.env,
                TS_NODE_TRANSPILE_ONLY: "true",
                SWC_NODE_PROJECT: "tsconfig.json",
            },
        })

        let output = ""
        let error = ""
        let timeoutId: NodeJS.Timeout

        timeoutId = setTimeout(() => {
            nodeProcess.kill()
            resolve({
                file: path.basename(file),
                success: false,
                error: "Test timed out after 30 seconds",
                duration: Date.now() - startTime,
            })
        }, TEST_TIMEOUT)

        nodeProcess.stdout.on("data", data => {
            output += data.toString()
        })

        nodeProcess.stderr.on("data", data => {
            error += data.toString()
        })

        nodeProcess.on("error", err => {
            clearTimeout(timeoutId)
            resolve({
                file: path.basename(file),
                success: false,
                error: err.message,
                duration: Date.now() - startTime,
            })
        })

        nodeProcess.on("close", code => {
            clearTimeout(timeoutId)
            resolve({
                file: path.basename(file),
                success: code === 0,
                error: error || undefined,
                duration: Date.now() - startTime,
            })
        })
    })
}

async function runTestsWithLimit(
    files: string[],
    limit: number,
    progressBar: ProgressBar,
    completedTests: {count: number},
): Promise<TestResult[]> {
    const results: TestResult[] = []
    const inProgress = new Set<Promise<void>>()
    const slowTests: TestResult[] = []

    for (const file of files) {
        while (inProgress.size >= limit) {
            await Promise.race(inProgress)
        }

        const testPromise = (async () => {
            const result = await runTest(file)
            results.push(result)

            if (result.duration && result.duration > 2000) {
                slowTests.push(result)
            }

            const unlock = await consoleMutex.lock()
            completedTests.count++
            progressBar.update(completedTests.count)

            if (!result.success && result.error) {
                process.stdout.write(`\n\x1b[31m✗ ${result.file}\x1b[0m\n`)
                process.stdout.write("\x1b[31m" + result.error.trim() + "\x1b[0m\n")
            }
            unlock()
        })()

        inProgress.add(testPromise)
        testPromise.then(() => inProgress.delete(testPromise))
    }

    await Promise.all(inProgress)

    if (slowTests.length > 0) {
        console.log("\nSlow Tests (>2s):")
        console.log("=================")
        slowTests
            .sort((a, b) => (b.duration || 0) - (a.duration || 0))
            .forEach(r => {
                console.log(`\x1b[33m${r.file}: ${(r.duration || 0) / 1000}s\x1b[0m`)
            })
    }

    return results
}

async function runAllTests() {
    const testFiles = await findTsFiles("../src/testing/out")
    console.log(`Found ${testFiles.length} test files to run\n`)

    const cpuCount = 20 // os.cpus().length
    const MAX_PARALLEL = Math.min(cpuCount, 18)

    const progressBar = new ProgressBar(testFiles.length)
    const completedTests = {count: 0}
    progressBar.update(0)

    console.log(`Running tests in parallel using ${MAX_PARALLEL} workers`)
    const results = await runTestsWithLimit(testFiles, MAX_PARALLEL, progressBar, completedTests)
    progressBar.finish()

    const successful = results.filter(r => r.success).length
    const failed = results.length - successful

    console.log("\nTest Results:")
    console.log("=============")
    console.log(`Total tests:   ${results.length}`)
    console.log(`\x1b[32mSuccessful:    ${successful}\x1b[0m`)
    console.log(`\x1b[31mFailed:        ${failed}\x1b[0m`)

    if (failed > 0) {
        console.log("\nFailed Tests Summary:")
        console.log("===================")
        results
            .filter(r => !r.success)
            .forEach(r => {
                console.log(`\x1b[31m${r.file}\x1b[0m`)
            })
    }

    return failed === 0
}

runAllTests()
    .then(success => {
        process.exit(success ? 0 : 1)
    })
    .catch(error => {
        console.error("Error running tests:", error)
        process.exit(1)
    })

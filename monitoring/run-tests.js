const fs = require('node:fs')
const path = require('node:path')
const cypress = require('cypress')

async function main() {
  const results = await cypress.run({ browser: 'electron' })
  if (results.failures) {
    throw new Error(results.message || `Cypress could not run (${results.failures} errors)`)
  }

  const summary = {
    generatedAt: new Date().toISOString(),
    status: results.status,
    browser: results.browser?.displayName || results.browser?.name || 'unknown',
    totalTests: results.totalTests,
    totalPassed: results.totalPassed,
    totalFailed: results.totalFailed,
    totalPending: results.totalPending,
    totalSkipped: results.totalSkipped,
    totalDurationMs: results.totalDuration,
    specs: (results.runs || []).map((run) => ({
      spec: run.spec.relative,
      tests: run.stats.tests,
      passes: run.stats.passes,
      failures: run.stats.failures,
      pending: run.stats.pending,
      skipped: run.stats.skipped,
      durationMs: run.stats.duration
    }))
  }

  const outputDir = path.join(__dirname, '..', 'results')
  fs.mkdirSync(outputDir, { recursive: true })
  fs.writeFileSync(path.join(outputDir, 'results.json'), JSON.stringify(summary, null, 2))
  console.log(`Results saved to ${path.join(outputDir, 'results.json')}`)
  process.exitCode = results.totalFailed ? 1 : 0
}

main().catch((error) => {
  console.error(error)
  process.exitCode = 1
})

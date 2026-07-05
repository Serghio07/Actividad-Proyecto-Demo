const http = require('node:http')
const fs = require('node:fs')
const path = require('node:path')

const port = Number(process.env.METRICS_PORT || 9464)
const resultsFile = path.join(__dirname, '..', 'results', 'results.json')
const escapeLabel = (value) => String(value).replaceAll('\\', '\\\\').replaceAll('"', '\\"').replaceAll('\n', '\\n')

function metric(name, help, value, labels = {}) {
  const list = Object.entries(labels).map(([key, item]) => `${key}="${escapeLabel(item)}"`).join(',')
  return `# HELP ${name} ${help}\n# TYPE ${name} gauge\n${name}${list ? `{${list}}` : ''} ${Number(value) || 0}`
}

function render() {
  if (!fs.existsSync(resultsFile)) {
    return `${metric('cypress_exporter_up', 'Whether the exporter is running.', 1)}\n${metric('cypress_results_available', 'Whether results exist.', 0)}\n`
  }
  const data = JSON.parse(fs.readFileSync(resultsFile, 'utf8'))
  const labels = { browser: data.browser || 'unknown' }
  const lines = [
    metric('cypress_exporter_up', 'Whether the exporter is running.', 1),
    metric('cypress_results_available', 'Whether results exist.', 1),
    metric('cypress_run_timestamp_seconds', 'Timestamp of the latest run.', Date.parse(data.generatedAt) / 1000),
    metric('cypress_tests_total', 'Tests in the latest run.', data.totalTests, labels),
    metric('cypress_tests_passed', 'Passed tests in the latest run.', data.totalPassed, labels),
    metric('cypress_tests_failed', 'Failed tests in the latest run.', data.totalFailed, labels),
    metric('cypress_tests_skipped', 'Skipped tests in the latest run.', data.totalSkipped, labels),
    metric('cypress_run_duration_seconds', 'Latest run duration.', data.totalDurationMs / 1000, labels),
    metric('cypress_run_success', 'Whether the latest run passed.', data.totalFailed === 0 ? 1 : 0, labels)
  ]
  for (const spec of data.specs || []) {
    lines.push(metric('cypress_spec_duration_seconds', 'Spec duration.', spec.durationMs / 1000, { spec: spec.spec }))
    lines.push(metric('cypress_spec_tests_failed', 'Failed tests by spec.', spec.failures, { spec: spec.spec }))
  }
  return `${lines.join('\n')}\n`
}

http.createServer((request, response) => {
  if (request.url !== '/metrics') {
    response.writeHead(200)
    return response.end('Cypress exporter: /metrics\n')
  }
  try {
    response.writeHead(200, { 'Content-Type': 'text/plain; version=0.0.4' })
    response.end(render())
  } catch (error) {
    response.writeHead(500)
    response.end(`${error.message}\n`)
  }
}).listen(port, '0.0.0.0', () => console.log(`Metrics: http://localhost:${port}/metrics`))

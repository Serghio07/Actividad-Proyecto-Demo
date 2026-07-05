$ErrorActionPreference = 'Stop'

$version = '2.55.1'
$archive = Join-Path $PSScriptRoot "prometheus-$version.windows-amd64.zip"
$extractDir = Join-Path $PSScriptRoot "prometheus-$version.windows-amd64"
$downloadUrl = "https://github.com/prometheus/prometheus/releases/download/v$version/prometheus-$version.windows-amd64.zip"

if (-not (Test-Path $extractDir)) {
    if (-not (Test-Path $archive)) {
        Invoke-WebRequest -Uri $downloadUrl -OutFile $archive
    }

    Expand-Archive -Path $archive -DestinationPath $PSScriptRoot -Force
}

$prometheusExe = Join-Path $extractDir 'prometheus.exe'
$configFile = Join-Path $PSScriptRoot 'prometheus.yml'

if (-not (Test-Path $prometheusExe)) {
    throw "No se encontró prometheus.exe en $extractDir"
}

& $prometheusExe --config.file=$configFile --storage.tsdb.path=$(Join-Path $extractDir 'data')
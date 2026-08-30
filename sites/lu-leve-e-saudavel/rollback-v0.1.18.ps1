param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectPath
)

$ErrorActionPreference = "Stop"
$IndexPath = Join-Path $ProjectPath "index.html"
$BackupPath = Join-Path $ProjectPath "index.html.v0.1.17.bak"

if (Test-Path $BackupPath) {
    Copy-Item $BackupPath $IndexPath -Force
}

Remove-Item (Join-Path $ProjectPath "price-countup.css") -Force -ErrorAction SilentlyContinue
Remove-Item (Join-Path $ProjectPath "price-countup.js") -Force -ErrorAction SilentlyContinue
Set-Content -Path (Join-Path $ProjectPath "VERSION") -Value "v0.1.17" -Encoding UTF8

Write-Host "Rollback da v0.1.18 concluído."

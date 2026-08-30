param(
    [Parameter(Mandatory=$true)]
    [string]$ProjectPath
)

$ErrorActionPreference = "Stop"
$PatchDir = Split-Path -Parent $MyInvocation.MyCommand.Path
$IndexPath = Join-Path $ProjectPath "index.html"
$BackupPath = Join-Path $ProjectPath "index.html.v0.1.17.bak"

if (-not (Test-Path $ProjectPath)) {
    throw "ProjectPath não encontrado: $ProjectPath"
}

if (-not (Test-Path $IndexPath)) {
    throw "index.html não encontrado em: $ProjectPath"
}

if (-not (Test-Path $BackupPath)) {
    Copy-Item $IndexPath $BackupPath
}

Copy-Item (Join-Path $PatchDir "price-countup.css") (Join-Path $ProjectPath "price-countup.css") -Force
Copy-Item (Join-Path $PatchDir "price-countup.js") (Join-Path $ProjectPath "price-countup.js") -Force

$html = Get-Content $IndexPath -Raw

if ($html -notmatch 'price-countup\.css') {
    $cssTag = '    <link rel="stylesheet" href="price-countup.css">'
    if ($html -match '</head>') {
        $html = $html -replace '</head>', "$cssTag`r`n</head>"
    } else {
        throw "Não foi possível localizar </head> no index.html"
    }
}

if ($html -notmatch 'price-countup\.js') {
    $jsTag = '    <script src="price-countup.js" defer></script>'
    if ($html -match '</body>') {
        $html = $html -replace '</body>', "$jsTag`r`n</body>"
    } else {
        throw "Não foi possível localizar </body> no index.html"
    }
}

Set-Content -Path $IndexPath -Value $html -Encoding UTF8
Set-Content -Path (Join-Path $ProjectPath "VERSION") -Value "v0.1.18" -Encoding UTF8

$ChangelogPath = Join-Path $ProjectPath "CHANGELOG.md"
$Entry = @"
## v0.1.18
- Preços passam de R$ 0,00 ao valor real quando entram na viewport.
- Animação ocorre uma vez por preço, com pequeno stagger entre itens próximos.
- Respeita prefers-reduced-motion e não altera o valor final exibido.

"@

if (Test-Path $ChangelogPath) {
    $current = Get-Content $ChangelogPath -Raw
    if ($current -notmatch '## v0\.1\.18') {
        Set-Content -Path $ChangelogPath -Value ($Entry + $current) -Encoding UTF8
    }
}

Write-Host "v0.1.18 aplicada com sucesso em: $ProjectPath"

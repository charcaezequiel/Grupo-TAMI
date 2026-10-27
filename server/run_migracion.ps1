if (-not $env:DATABASE_URL) {
  Write-Error "Definí DATABASE_URL antes de ejecutar este script."
  exit 1
}
Set-Location $PSScriptRoot
node scripts/migrar-rbac-seguridad.js

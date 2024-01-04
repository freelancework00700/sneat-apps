$location = Get-Location
Set-Location -Path $PSScriptRoot/../src
pnpm run nx build sneat-app --source-map=true --base-href=/pwa/
#pnpm run nx build sneat-app --source-map=true
rm -rf $PSScriptRoot/../websites/sneat.app/pwa
copy-item $PSScriptRoot/../src/dist/apps/sneat-app $PSScriptRoot/../websites/sneat.app/pwa -force -recurse
Set-Location -Path $PSScriptRoot/..
#$pwaIndexHtml = 'websites/sneat.app/pwa/index.html'
#(Get-Content $pwaIndexHtml) -replace '<base href="/"', '<base href="/pwa/"' | Out-File -encoding UTF8 $pwaIndexHtml
Set-Location -Path $PSScriptRoot/../websites
firebase deploy --only hosting:sneat-eu
Set-Location -Path $location

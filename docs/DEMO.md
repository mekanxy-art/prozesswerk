# Portfolio-Demo

Der vollständige Next.js-Code und eine statische Portfolio-Demonstration erfüllen unterschiedliche Zwecke. Die Demo zeigt die öffentlichen Seiten einschließlich Menü, Leistungsnavigation, Prozessbeispielen und FAQ. Anfrageformular, Admin, Datenbank und Versand sind dort deaktiviert bzw. nicht enthalten.

Der Export wird aus einem lokal gebauten, laufenden Vorschauserver erstellt:

```powershell
$env:PROZESSWERK_BUILD_DIR = '.next-demo'
npm run build
$env:PORT = '3110'
$env:APP_ORIGIN = 'http://127.0.0.1:3110'
$env:SITE_URL = 'http://127.0.0.1:3110'
npm start
```

In einem zweiten Terminal (Chromium oder lokal vorhandenes Chrome):

```powershell
$env:TEST_BASE_URL = 'http://127.0.0.1:3110'
$env:TEST_BROWSER_CHANNEL = 'chromium'
$env:DEMO_OUTPUT = 'demo-export'
npx playwright install chromium
node scripts/export-demo.mjs
python -m http.server 3111 --bind 127.0.0.1 --directory demo-export
```

Den Export unter http://127.0.0.1:3111 ansehen. Er enthält keine Server Actions, Formulartoken oder Datenbankzugänge. Generierte Dateien gehören nicht in den Quellcode-Commit. Der vollständige Anwendungscode bleibt unabhängig davon startbar. Ein öffentlicher Demo-Link wird erst nach erfolgreicher Veröffentlichung in der README ergänzt.

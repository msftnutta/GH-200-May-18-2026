# GH-200-May-18-2026 — World Clock & Weather

A modern Node.js + Express web app showing local time and current weather (with emoji) for ~20 cities worldwide. Tailwind CSS UI with dark/light theme toggle, Jest unit tests, and CI/CD to Azure App Service via GitHub Actions (OIDC).

> Originally created for GH-200 training on May 18, 2026.

## Stack

- Node.js 20, Express 4, EJS
- Tailwind CSS (CLI build), `prefers-color-scheme` + manual toggle
- Azure Maps **Current Conditions** API for weather
- Jest + Supertest for unit / integration tests
- GitHub Actions → Azure App Service (Linux)

## Local development

```powershell
# 1. Install
npm install

# 2. Configure
Copy-Item .env.example .env
# Edit .env and set AZURE_MAPS_KEY=<your key>

# 3. Build CSS once (or use the watcher)
npm run build:css
# npm run dev:css    # in another terminal, watch mode

# 4. Run
npm run dev          # nodemon
# or
npm start
```

Open http://localhost:3000.

`GET /healthz` returns `{ "status": "ok" }` (used as a health probe).

## Tests

```powershell
npm test
```

Tests do **not** hit the network — the weather service is mocked and the route tests use Supertest.

## Azure setup (one-time)

1. **Azure Maps**: create an *Azure Maps account*, grab the **Primary Key**.
2. **App Service**:
   - Create a Resource Group, e.g. `rg-worldclock`.
   - Create an App Service Plan (Linux, Node 20 LTS). Free **F1** is fine to start; **B1** if you want always-on.
   - Create a Web App on that plan.
   - In **Configuration → Application settings**, add:
     - `AZURE_MAPS_KEY` = *your Azure Maps primary key*
     - `WEBSITE_RUN_FROM_PACKAGE` = `1` (recommended for zip deploys)
   - In **Configuration → General settings**, set **Startup Command**: `node src/server.js`

## GitHub Actions: OIDC to Azure (no secrets)

1. Create an Entra **App registration** and a service principal; assign **Contributor** on the Web App (or RG).
2. Add a **Federated credential** on the app registration:
   - Issuer: `https://token.actions.githubusercontent.com`
   - Subject: `repo:<owner>/<repo>:ref:refs/heads/main`
   - Audience: `api://AzureADTokenExchange`
3. In your GitHub repo, add **Secrets** (Settings → Secrets and variables → Actions):
   - `AZURE_CLIENT_ID` — app registration (client) ID
   - `AZURE_TENANT_ID` — Entra tenant ID
   - `AZURE_SUBSCRIPTION_ID` — subscription ID
   - `AZURE_WEBAPP_NAME` — name of the Web App resource
4. Push to `main` — the CI/CD workflow at `.github/workflows/ci-cd.yml` builds, tests, and deploys.

## Project structure

```
src/
  app.js              # Express app factory (exported for tests)
  server.js           # Entry point (listens on PORT)
  routes/index.js     # GET /, GET /healthz
  services/weather.js # Azure Maps client + in-memory cache
  utils/iconMap.js    # iconCode → emoji
  data/cities.js      # Predefined cities
views/
  index.ejs           # Main page
  partials/header.ejs
public/
  css/input.css       # Tailwind source
  css/styles.css      # Built (gitignored)
  js/theme.js         # Dark/light toggle
  js/clock.js         # 1s tick using Intl.DateTimeFormat
tests/
  iconMap.test.js
  weather.test.js
  routes.test.js
.github/workflows/ci-cd.yml
```

## Customizing the city list

Edit `src/data/cities.js`. Each entry needs an IANA `timezone` plus `lat` / `lon` for the Azure Maps weather lookup.

[![CI / CD](https://github.com/msftnutta/GH-200-May-18-2026/actions/workflows/ci-cd.yml/badge.svg?branch=main)](https://github.com/msftnutta/GH-200-May-18-2026/actions/workflows/ci-cd.yml)

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
  utils/projection.js # Equirectangular projection + continent paths
  data/cities.js      # Predefined cities (with continent grouping)
views/
  index.ejs           # Main page (world map + grouped sections)
  partials/header.ejs
public/
  css/input.css       # Tailwind source
  css/styles.css      # Built (gitignored)
  js/theme.js         # Dark/light toggle
  js/clock.js         # 1s tick using Intl.DateTimeFormat
  js/map.js           # World-map markers + callout
tests/
  iconMap.test.js
  weather.test.js
  routes.test.js
.github/
  dependabot.yml              # npm / actions / docker update PRs
  workflows/
    ci-cd.yml                 # Orchestrator (calls reusables)
    _build.yml                # Reusable: install + Tailwind build
    _test.yml                 # Reusable: Jest tests
    _publish-image.yml        # Reusable: Docker build + push to GHCR
    _deploy.yml               # Reusable: Azure App Service deploy
Dockerfile
.dockerignore
```

## Customizing the city list

Edit `src/data/cities.js`. Each entry needs an IANA `timezone` plus `lat` / `lon` for the Azure Maps weather lookup.

---

# 📘 GH-200 Day 1 — Training Recap

A condensed reference for the GitHub Actions (GH-200) session this repo was built during.

## 🧠 1. Big Picture

Focus: **GitHub Actions for CI/CD automation**, demonstrated by building a real app end-to-end.

Core ideas:
- Use **GitHub Copilot** to plan and generate applications.
- Build a full app → test → automate → deploy.
- Understand **workflow files (YAML)**.
- Learn how **runners execute jobs**.
- Use **GitHub Actions** as the automation engine.

> Key takeaway: GitHub Actions = automation engine that runs your build, test, and deployment steps when something happens (push, PR, schedule, manual…).

## 🧪 2. Demo Walkthrough (end-to-end)

What was built (this repo):
- **Node.js + Express** web app showing local time & weather for cities worldwide.
- **Azure Maps** Current Conditions API for weather data.
- **Tailwind CSS** for a modern UI, with **dark/light theme** toggle.
- **World map view** with hover/click callouts (later enhancement).
- **Jest** unit + integration tests.
- **GitHub Actions** → build, test, publish Docker image to GHCR, (gated) deploy to **Azure App Service**.

## 🤖 3. GitHub Copilot Usage

Demonstrated:
- Planning application structure (asking clarifying questions before coding).
- Generating boilerplate, services, tests, and CI/CD configs.
- Switching between **planning mode** and **agent / autopilot mode**.

Copilot is great for proposing structure, frameworks, and pipelines — but **you still validate decisions** (runtime compatibility, Azure support, security implications).

## ⚙️ 4. GitHub Actions — Core Concepts

### Workflow basics
A workflow has **triggers** (`on:`), **jobs**, and each job has **steps**. Steps usually call reusable **actions**.

```yaml
on:
  push:
    branches: [main]
jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - run: npm ci
      - run: npm test
```

### 1. Triggers (`on:`)
- `push`, `pull_request`, `workflow_dispatch`, `schedule`, `release`, `repository_dispatch`, …
- Use **specific branch filters** (e.g., `['main']`, `['feature/*']`) rather than wildcards like `['**']` in production — it avoids noisy / unintended runs.

### 2. Jobs
- Logical groupings (build, test, publish, deploy).
- Run in parallel by default; chain with `needs:` for ordering.

### 3. Runners
Machines that execute jobs (essentially VMs):
- **GitHub-hosted** — managed, ephemeral, free minutes on public repos.
- **Self-hosted** — your own machine (e.g., labelled `[self-hosted, surface-laptop]`); useful for compliance, special hardware, or private network access.
- **Larger runners** — more CPU / RAM for heavy builds.

> Compliance tip: some teams require build OS = production OS.

### 4. Steps & actions
Steps are tasks (`run:` shell commands or `uses:` an action). Common actions: `actions/checkout`, `actions/setup-node`, `docker/login-action`, `azure/login`, `actions/upload-artifact`.

### 5. CI/CD flow in this repo
`build` ∥ `test` → (approval) → `publish-image` (GHCR) → (approval) → `deploy` (Azure App Service).

### 6. Reusable workflows
This repo uses `workflow_call` reusable workflows (`_build.yml`, `_test.yml`, `_publish-image.yml`, `_deploy.yml`) wired together by `ci-cd.yml`. Benefits: single source of truth, easier reuse across repos.

### 7. Artifacts & Packages
- **Artifacts** — share files between jobs / download from a run (`actions/upload-artifact`, `actions/download-artifact`).
- **GitHub Packages** — publish npm / container / Maven / NuGet packages. This repo publishes a Docker image to **GHCR** (`ghcr.io/<owner>/<repo>`).

### 8. Secrets & security
- Never hardcode credentials — use **GitHub Secrets** (repo or environment scoped).
- Prefer **OIDC federated credentials** over long-lived secrets for cloud login.
- Used here for Azure login + `AZURE_MAPS_KEY`.

### 9. Environments & approvals
**Environments** (Settings → Environments) gate jobs with **required reviewers**, wait timers, and branch protections. This repo gates **publish-image** behind `publish-approval` and **deploy** behind `production`.

### 10. YAML rules
Indentation matters; one wrong space breaks the file. The Actions tab surfaces parse errors with line numbers — read them carefully.

## 🔍 5. Debugging Lessons From the Session

Real failures encountered live (and fixed):
- Missing / mis-scoped secrets.
- **CodeQL** — “Advanced configurations cannot be processed when default setup is enabled” → either disable default setup OR remove the advanced workflow.
- Reusable-workflow permission errors (`actions: read` not granted by caller).
- `github.*` context cannot be used as a default for `workflow_call` inputs.
- YAML indentation slips.

> CI/CD pipelines will fail often — debugging *is* the job.

## 🧪 6. Labs & Learning Resources

### Core labs
- [Create and run a basic GitHub Actions workflow](https://learn.microsoft.com/en-us/training/modules/github-actions-automate-tasks/3-exercise-create-container-action)
- [Create the CI workflow on GitHub](https://learn.microsoft.com/en-us/training/modules/github-actions-ci/3-exercise-ci-workflow-github)

### Additional labs
- [Deploy web app to Azure](https://learn.microsoft.com/en-us/training/modules/github-actions-cd/3-create-workflow-deploy-azure)
- [Publish to GitHub Packages](https://learn.microsoft.com/en-us/training/modules/github-actions-packages/3-exercise-github-packages-docker-registry)

### Repo reference
- [GH-200 training repository](https://github.com/msftnutta/GH-200-May-18-2026)

### Extra learning
- [Git version control (Azure Animations)](https://azureanimations.github.io/github/git-version-control)
- [GitHub Actions certification page](https://learn.microsoft.com/en-us/credentials/certifications/github-actions/?practice-assessment-type=certification)

## 🎯 7. Exam Tips

From the trainer:
- Mostly **multiple-choice**, with some **scenario-based** questions.
- Focus on **understanding YAML** — know what each block does.
- Use the **official practice test** on the certification page.

Key topics to focus on:
- Workflow structure (triggers, jobs, steps, runners).
- Triggers: `push` vs `pull_request`, branch / path filters.
- Runner types (hosted vs self-hosted vs larger).
- Secrets, OIDC, and environments.
- CI/CD flow + artifacts + packages.
- Reusable workflows (`workflow_call`) and composite actions.

> Practical tip: if you can build a simple pipeline from scratch, you can pass.

## 💡 8. Real-World Use Cases

1. **CI** — tests + lint on every commit / PR.
2. **CD** — deploy to Azure App Service, Kubernetes, Container Apps, Functions.
3. **Automation tasks** — auto-format, label PRs, generate docs.
4. **Multi-team integration** — backend release triggers frontend integration pipeline (via `repository_dispatch` / `workflow_call`).
5. **Scheduled jobs** — nightly tests, regression suites at off-peak hours (`schedule: cron`).
6. **Security scanning** — **CodeQL** (default setup is one click), **Dependabot** for dependency updates + security advisories.
7. **Container build pipeline** — build image, push to GHCR / ACR, deploy.
8. **Event-driven automation** — trigger pipelines via API / webhook; e.g., DB migration completes → trigger tests.

## 🔑 Final Takeaways

- GitHub Actions is **central to modern DevOps**.
- Don’t memorize — understand **structure**, **flow**, and **debugging**.
- *Implementation matters more than theory* — the session was hands-on for a reason.

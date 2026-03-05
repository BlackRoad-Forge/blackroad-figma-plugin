[![Deploy](https://github.com/blackboxprogramming/blackroad-figma-plugin/actions/workflows/auto-deploy.yml/badge.svg)](https://github.com/blackboxprogramming/blackroad-figma-plugin/actions/workflows/auto-deploy.yml)
[![Security Scan](https://github.com/blackboxprogramming/blackroad-figma-plugin/actions/workflows/security-scan.yml/badge.svg)](https://github.com/blackboxprogramming/blackroad-figma-plugin/actions/workflows/security-scan.yml)
[![Self-Healing](https://github.com/blackboxprogramming/blackroad-figma-plugin/actions/workflows/self-healing.yml/badge.svg)](https://github.com/blackboxprogramming/blackroad-figma-plugin/actions/workflows/self-healing.yml)

# BlackRoad Figma Plugin

**BlackRoad Brand System** - Design system enforcement for Figma.

## Features

- 10 brand colors with hex values
- Fibonacci spacing scale (8, 13, 21, 34, 55, 89, 144)
- Golden Ratio gradient (135deg with stops at 38.2% and 61.8%)
- SF Pro Display typography with 1.618 line height
- One-click component library generation
- Logo, palette, and spacing guide creation

## Installation

1. Open Figma Desktop
2. Go to **Plugins** > **Development** > **Import plugin from manifest**
3. Select `manifest.json` from this repository
4. The plugin appears under **Plugins** > **BlackRoad Brand System**

## Usage

1. Select a frame or component
2. Run **Plugins** > **BlackRoad Brand System**
3. Apply colors, gradients, spacing, or generate a full component library

### Quick Actions

| Action | Description |
|---|---|
| **Apply Color** | Set any brand color on selected objects |
| **Create Palette** | Generate a color palette frame |
| **Create Gradient** | Apply Golden Ratio gradient |
| **Create Spacing Guide** | Fibonacci spacing visualization |
| **Create Logo** | Generate the BlackRoad logo |
| **Create Library** | Full component library (Colors + Spacing + Logo) |

## Architecture

```
blackroad-figma-plugin/
  manifest.json          # Figma plugin manifest (API 1.0.0)
  code.js                # Plugin logic (color, spacing, gradient, logo)
  ui.html                # Plugin UI panel (400x600)
  worker/
    index.js             # Cloudflare Worker (health, brand API, tasks)
    wrangler.toml        # Worker configuration
  .github/
    workflows/
      auto-deploy.yml    # CI/CD to Cloudflare Pages / Railway
      security-scan.yml  # CodeQL + dependency scanning
      self-healing.yml   # Health monitoring + auto-rollback
      automerge.yml      # Dependabot auto-approve + merge
    dependabot.yml       # Automated dependency updates
```

## Cloudflare Worker API

The worker handles long-running tasks and serves the brand API.

| Endpoint | Method | Description |
|---|---|---|
| `/` | GET | Worker status |
| `/api/health` | GET | Health check |
| `/api/brand` | GET | Full brand data (colors, spacing, typography, gradient) |
| `/api/brand/colors` | GET | Brand colors |
| `/api/brand/spacing` | GET | Fibonacci spacing scale |
| `/api/tasks` | POST | Queue long-running tasks (generate-tokens, validate-brand, export-styles) |

## CI/CD Workflows

All GitHub Actions are **pinned to specific commit hashes** for supply-chain security.

- **Auto Deploy**: Detects service type (static/NextJS/Worker/Docker/Node/Python), deploys to Cloudflare Pages or Railway
- **Security Scan**: Weekly CodeQL analysis + dependency auditing on PRs
- **Self-Healing**: Health monitoring every 6 hours, auto-rollback on failure, issue creation
- **Automerge**: Auto-approves and merges Dependabot patch/minor updates

## Deployment

### Cloudflare Worker

```bash
npm run deploy:worker
```

### Required Secrets

| Secret | Service |
|---|---|
| `CLOUDFLARE_API_TOKEN` | Cloudflare |
| `CLOUDFLARE_ACCOUNT_ID` | Cloudflare |
| `RAILWAY_TOKEN` | Railway |
| `DEPLOY_URL` | Health check target |

---

## License & Copyright

**Copyright (c) 2024-2026 BlackRoad OS, Inc. All Rights Reserved.**

**CEO & Sole Stockholder:** Alexa Louise Amundson

**PROPRIETARY AND CONFIDENTIAL** - This software is NOT open source.

### Usage Restrictions

- **Permitted:** Testing, evaluation, and educational purposes
- **Prohibited:** Commercial use, resale, or redistribution without written permission

### Enterprise Scale

Designed to support 30,000 AI Agents and 30,000 human employees.

### Contact

For commercial licensing: **blackroad.systems@gmail.com**

See [LICENSE](LICENSE) for complete terms.

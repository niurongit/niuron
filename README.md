<div align="center">

<img src="./logo.png" alt="Niuron" width="140" height="140" />

# NIURON

### `Confidential finance, executed quietly.`

**A beta privacy-first DeFi terminal on Base — swap, earn, and pay with selective-disclosure workflows under active development.**

<br/>

[![Beta on Base](https://img.shields.io/badge/BETA_ON-BASE-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://base.org)
[![License](https://img.shields.io/badge/LICENSE-MIT-22c55e?style=for-the-badge)](#-license)
[![Non-Custodial](https://img.shields.io/badge/CUSTODY-SELF-f59e0b?style=for-the-badge&logo=ethereum&logoColor=white)](#-security)
[![Status](https://img.shields.io/badge/STATUS-BETA-3b82f6?style=for-the-badge)](#-roadmap)

<br/>

[**Launch App**](#-quick-start) &nbsp;·&nbsp; [**Docs**](#-documentation) &nbsp;·&nbsp; [**Integrations**](#-integrations) &nbsp;·&nbsp; [**Roadmap**](#-roadmap) &nbsp;·&nbsp; [**Community**](#-community--socials)

</div>

---

## ▍Table of Contents

<table>
  <tr>
    <td width="33%" valign="top">

`01` &nbsp; [Overview](#-overview)
`02` &nbsp; [Key Features](#-key-features)
`03` &nbsp; [Tech Stack](#-tech-stack)
`04` &nbsp; [Integrations](#-integrations)
`05` &nbsp; [Architecture](#-architecture)

</td>
    <td width="33%" valign="top">

`06` &nbsp; [Privacy Flow](#-privacy-flow)
`07` &nbsp; [Quick Start](#-quick-start)
`08` &nbsp; [Project Structure](#-project-structure)
`09` &nbsp; [API Reference](#-api-reference)
`10` &nbsp; [Roadmap](#-roadmap)

</td>
    <td width="33%" valign="top">

`11` &nbsp; [Security](#-security)
`12` &nbsp; [Community & Socials](#-community--socials)
`13` &nbsp; [License](#-license)

<br/>

[![Back to top](https://img.shields.io/badge/▲_TOP-0a0a0a?style=flat-square)](#niuron)

</td>
  </tr>
</table>

---

## ▍Overview

**Niuron** is a non-custodial, privacy-focused DeFi dashboard built on **Base** (an Ethereum L2). It is building a confidentiality layer around Base DeFi workflows and selective disclosure. OpenOcean and Aave paths are being integrated progressively, while ZK-heavy flows currently use simulator-backed commitments until production proving infrastructure is complete.

> **Beta status:** you hold the keys and sign wallet transactions; privacy/proof modules are still under active hardening and should not be treated as audited production privacy.

<div align="center">

| Privacy | Performance | Built On | Custody |
|:---:|:---:|:---:|:---:|
| Selective disclosure WIP | ~2s Base blocks | Base ecosystem | 100% self-custody target |

</div>

---

## ▍Key Features

| Module | Description |
|---|---|
| **Dashboard** | Unified terminal view of public + shadow balances, activity, and batched actions. |
| **Private Swaps** | OpenOcean quote + wallet-signing flow under active integration. |
| **Yield** | Aave V3 reserve discovery and strategy tracking under active integration. |
| **Stealth / Shadow Balances** | Simulator-backed shielded accounting while production privacy rails are built. |
| **Selective Disclosure** | Generate verifiable proofs to disclose balances on demand. |
| **ZK-SNARK Engine** | snarkjs/circuit workflow scaffold plus simulator-backed proof endpoints. |
| **Multisig** | Coordinate multi-signature actions. |
| **Smart Routing** | Optimized transaction routing across protocols. |
| **Analytics** | PnL, volume, trade history, and activity breakdowns. |
| **Compliance** | Configurable rules + exportable audit trail. |

---

## ▍Tech Stack

<div align="center">

[![React](https://img.shields.io/badge/React-18-61DAFB?style=flat-square&logo=react&logoColor=black)](https://react.dev)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.6-3178C6?style=flat-square&logo=typescript&logoColor=white)](https://www.typescriptlang.org)
[![Vite](https://img.shields.io/badge/Vite-5-646CFF?style=flat-square&logo=vite&logoColor=white)](https://vitejs.dev)
[![TailwindCSS](https://img.shields.io/badge/Tailwind-3-06B6D4?style=flat-square&logo=tailwindcss&logoColor=white)](https://tailwindcss.com)
[![Express](https://img.shields.io/badge/Express-4-000000?style=flat-square&logo=express&logoColor=white)](https://expressjs.com)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=flat-square&logo=drizzle&logoColor=black)](https://orm.drizzle.team)
[![PostgreSQL](https://img.shields.io/badge/PostgreSQL-Neon-4169E1?style=flat-square&logo=postgresql&logoColor=white)](https://neon.tech)
[![TanStack Query](https://img.shields.io/badge/TanStack-Query-FF4154?style=flat-square&logo=reactquery&logoColor=white)](https://tanstack.com/query)

</div>

**Frontend:** React 18 · Vite · wouter (routing) · TailwindCSS + shadcn/ui · framer-motion · recharts · TanStack Query
**Web3:** wagmi · viem · ConnectKit · Base
**Backend:** Express · Drizzle ORM · Neon PostgreSQL · WebSockets

---

## ▍Integrations

> Click any badge to open the integration's site.

### Chain & Wallet

[![Base](https://img.shields.io/badge/Base-Ethereum_L2-0052FF?style=for-the-badge&logo=coinbase&logoColor=white)](https://base.org)
[![wagmi](https://img.shields.io/badge/wagmi-React_Hooks-1C1B1B?style=for-the-badge)](https://wagmi.sh)
[![viem](https://img.shields.io/badge/viem-TS_Client-FFFFFF?style=for-the-badge&logoColor=black)](https://viem.sh)
[![ConnectKit](https://img.shields.io/badge/ConnectKit-Wallet_UI-1A1B1F?style=for-the-badge)](https://docs.family.co/connectkit)

### DeFi Protocols

[![OpenOcean](https://img.shields.io/badge/OpenOcean-Swap_Aggregator-3F4350?style=for-the-badge)](https://openocean.finance)
[![Aave V3](https://img.shields.io/badge/Aave_V3-Yield-B6509E?style=for-the-badge&logo=aave&logoColor=white)](https://aave.com)

### Infrastructure

[![Neon](https://img.shields.io/badge/Neon-Serverless_Postgres-00E599?style=for-the-badge&logo=postgresql&logoColor=white)](https://neon.tech)
[![Drizzle](https://img.shields.io/badge/Drizzle-ORM-C5F74F?style=for-the-badge&logo=drizzle&logoColor=black)](https://orm.drizzle.team)

<div align="center">

| Integration | Role | Status |
|---|---|:---:|
| **Base** | Settlement layer (Ethereum L2) | `BETA` |
| **wagmi / viem** | Contract reads, writes, signing | `BETA` |
| **ConnectKit** | Wallet connection UX | `BETA` |
| **OpenOcean** | DEX aggregation for swaps | `WIP` |
| **Aave V3** | Lending / yield reserves | `WIP` |
| **Neon Postgres** | App data & audit storage | `BETA` |
| **ZK-SNARK Engine** | Privacy proofs | `SIMULATOR / WIP` |

</div>

---

## ▍Architecture

```mermaid
flowchart TD
    subgraph Client["Client — React + Vite"]
        UI["Terminal UI<br/>(shadcn + Tailwind)"]
        Q["TanStack Query"]
        W3["wagmi · viem · ConnectKit"]
    end

    subgraph Server["Server — Express"]
        API["REST API"]
        ZK["ZK-SNARK Service"]
        STORE["Drizzle ORM"]
    end

    subgraph Chain["Base — Ethereum L2"]
        OO["OpenOcean<br/>Aggregator"]
        AV["Aave V3<br/>Reserves"]
    end

    DB[("Neon Postgres")]
    WALLET["User Wallet<br/>(self-custody)"]

    UI --> Q --> API
    UI --> W3 --> WALLET
    WALLET -->|signed tx| Chain
    API --> ZK
    API --> STORE --> DB
    API -->|quotes / reserves| OO
    API -->|reserves / APY| AV

    classDef base fill:#0052FF,stroke:#0052FF,color:#fff;
    classDef green fill:#22c55e,stroke:#22c55e,color:#000;
    classDef amber fill:#f59e0b,stroke:#f59e0b,color:#000;
    class Chain,OO,AV base;
    class WALLET green;
    class ZK amber;
```

---

## ▍Privacy Flow

How funds move between **public** and **shadow** states, with selective disclosure:

```mermaid
sequenceDiagram
    actor U as User
    participant App as Niuron App
    participant ZK as ZK Engine
    participant Base as Base Chain

    U->>App: Connect wallet (ConnectKit)
    U->>App: Move to Shadow
    App->>ZK: Generate balance commitment
    ZK-->>App: ZK proof (client-side)
    App->>Base: Submit shielded tx (user-signed)
    Base-->>App: Confirmed

    Note over U,Base: Balance now shielded by default

    U->>App: Create disclosure (selective)
    App->>ZK: Build verifiable proof
    ZK-->>U: Shareable proof — discloses only what you allow
```

```mermaid
stateDiagram-v2
    [*] --> Public
    Public --> Shadow: move-to-shadow
    Shadow --> Public: move-from-shadow
    Shadow --> Disclosed: create disclosure
    Disclosed --> Shadow: revoke disclosure
    Public --> [*]
```

---

## ▍Quick Start

> **Prerequisites:** Node.js 20+, a Base-compatible wallet, and a PostgreSQL connection string.

```bash
# 1) Install dependencies
npm install

# 2) Configure environment
cp .env.example .env   # then fill in the values below

# 3) Push the database schema
npm run db:push

# 4) Run the dev server
npm run dev
```

App runs at **`http://localhost:5000`** by default.

### Environment Variables

| Variable | Description |
|---|---|
| `DATABASE_URL` | Neon/PostgreSQL connection string |
| `SESSION_SECRET` | Secret for session signing |

### Scripts

| Command | Action |
|---|---|
| `npm run dev` | Start dev server (client + API) |
| `npm run build` | Production build |
| `npm run start` | Run the production build |
| `npm run check` | TypeScript type-check |
| `npm run db:push` | Sync Drizzle schema to the database |

---

## ▍Project Structure

```text
niuron/
├── client/                 # React + Vite frontend
│   ├── public/             # Static assets (logos, favicon)
│   └── src/
│       ├── components/     # UI, terminal shell, wallet, shields
│       ├── pages/          # dashboard, swap, yield, stealth, zksnark …
│       └── index.css       # "Terminal Floor" design tokens
├── server/                 # Express API
│   ├── routes.ts           # REST endpoints
│   ├── zksnark-service.ts  # ZK proof generation
│   ├── yield-protocols.ts  # Aave V3 integration
│   └── db.ts               # Drizzle + Neon
├── shared/
│   └── schema.ts           # Drizzle schema (shared types)
└── README.md
```

---

## ▍API Reference

<details>
<summary><b>Portfolio</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/portfolio/stats` | Total + shadow value |
| `GET` | `/api/portfolio/holdings` | Token holdings |
| `GET` | `/api/portfolio/positions` | Open positions |

</details>

<details>
<summary><b>Shadow Balances</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/shadow-balances` | List shielded balances |
| `POST` | `/api/shadow-balances/move-to-shadow` | Shield funds |
| `POST` | `/api/shadow-balances/move-from-shadow` | Unshield funds |

</details>

<details>
<summary><b>Swap (OpenOcean)</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/swap/quote` | Get best quote |
| `POST` | `/api/swap/transaction` | Build swap tx |
| `POST` | `/api/swap/send` | Broadcast swap |
| `GET` | `/api/swap/orders` | Order history |

</details>

<details>
<summary><b>Yield (Aave V3)</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/yield/aave/reserves` | Aave reserves |
| `GET` | `/api/yield/protocols` | Supported protocols |
| `GET` | `/api/yield/strategies` | Strategies |

</details>

<details>
<summary><b>ZK & Disclosure</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `POST` | `/api/zk/generate/balance` | Generate balance proof |
| `GET` | `/api/disclosure/proofs` | List disclosures |
| `POST` | `/api/disclosure/create` | Create disclosure |
| `POST` | `/api/disclosure/revoke/:id` | Revoke disclosure |

</details>

<details>
<summary><b>Compliance & Analytics</b></summary>

| Method | Endpoint | Description |
|---|---|---|
| `GET` | `/api/compliance/rules` | List rules |
| `GET` | `/api/audit/export` | Export audit trail |
| `GET` | `/api/analytics/pnl` | Profit & loss |
| `GET` | `/api/analytics/volume` | Volume stats |

</details>

---

## ▍Roadmap

```mermaid
timeline
    title Niuron Roadmap
    Phase 1 — Foundation : Terminal UI : Wallet connect : Base integration
    Phase 2 — Core DeFi : OpenOcean swaps : Aave V3 yield : Portfolio
    Phase 3 — Privacy : Shadow balances : ZK-SNARK engine : Selective disclosure
    Phase 4 — Scale : Multisig : Smart routing : Compliance suite
```

| Phase | Milestone | Status |
|---|---|:---:|
| 1 | Foundation & wallet | `LIVE` |
| 2 | Core DeFi (swap + yield) | `LIVE` |
| 3 | Privacy layer (ZK) | `IN PROGRESS` |
| 4 | Scale (multisig, routing) | `PLANNED` |

---

## ▍Security

- **Non-custodial** — you control your keys; every transaction is user-signed.
- **Proven protocols** — built on audited, battle-tested Aave V3 + OpenOcean liquidity.
- **Client-side proofs** — ZK proofs generated locally; minimal data leaves your device.
- **Private by default** — balances are shielded unless you choose to disclose.

> **Disclaimer:** Niuron is experimental software provided "as is", without warranty. DeFi carries financial risk. Always do your own research and never invest more than you can afford to lose.

---

## ▍Community & Socials

<div align="center">

[![Twitter / X](https://img.shields.io/badge/Twitter-Follow-000000?style=for-the-badge&logo=x&logoColor=white)](https://twitter.com)
[![Discord](https://img.shields.io/badge/Discord-Join-5865F2?style=for-the-badge&logo=discord&logoColor=white)](https://discord.com)
[![Telegram](https://img.shields.io/badge/Telegram-Chat-26A5E4?style=for-the-badge&logo=telegram&logoColor=white)](https://telegram.org)
[![GitHub](https://img.shields.io/badge/GitHub-Star-181717?style=for-the-badge&logo=github&logoColor=white)](https://github.com)
[![Docs](https://img.shields.io/badge/Docs-Read-22c55e?style=for-the-badge&logo=readthedocs&logoColor=white)](#-documentation)

</div>

> Replace the links above with your official channels.

### Documentation

In-app docs are available at **`/docs`** and the whitepaper at **`/whitepaper`** when running the app.

---

## ▍License

Released under the **MIT License**. See [`LICENSE`](LICENSE) for details.

<div align="center">
<br/>

<img src="./logo.png" alt="Niuron" width="56" height="56" />

**Built with privacy in mind · Beta on Base**

`> niuron --connect --private`

</div>

# 🤖 YieldAgent — AI-Powered Stablecoin Yields on Solana

**Stake any token. Earn USDC. Let AI do the work.**

YieldAgent is an autonomous AI-powered yield optimization platform on Solana. Connect your Phantom wallet, deposit any SPL token, and let our AI agent find the best yield strategies across Solana DeFi — with all returns paid out in USDC.

## 🏆 Colosseum Agent Hackathon Entry

- **Agent:** nicco (#914)

## ✨ Features

- **🔗 Phantom Connect** — Sign in with Google/Apple or browser extension. Zero-friction onboarding.
- **💰 Any Token → USDC Yields** — Deposit SOL, mSOL, JitoSOL, USDT, or any SPL token and earn yields in stablecoins.
- **🧠 AI Strategy Engine** — Autonomous agent analyzes yield opportunities across Jupiter, Kamino, Marinade, Raydium, Drift, and more.
- **⚡ Real-time Rebalancing** — 24/7 monitoring and automatic portfolio rebalancing for maximum returns.
- **💬 Chat Interface** — Talk to the AI agent. Ask about strategies, earnings, or risk levels.
- **🔒 Non-custodial** — Your funds stay in your wallet. All transactions require your approval.

## 🏗️ Architecture

```
┌─────────────────┐     ┌──────────────────┐     ┌─────────────────┐
│   Phantom SDK   │────▶│   React Frontend │────▶│   AI Agent      │
└─────────────────┘     └──────────────────┘     └─────────────────┘
                               │                         │
                               ▼                         ▼
                        ┌──────────────┐          ┌──────────────┐
                        │  Helius RPC  │          │  DeFi Protos │
                        │  (Solana)    │          │  Jupiter     │
                        └──────────────┘          │  Kamino      │
                                                  │  Marinade    │
                                                  │  Raydium     │
                                                  │  Drift       │
                                                  └──────────────┘
```

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Th3Ya0vi/Yield-agent-.git
cd Yield-agent-

# Install dependencies
npm install

# Set up environment variables
cp .env.example .env
# Edit .env with your Phantom App ID and Helius RPC URL

# Run development server
npm run dev
```

## ⚙️ Environment Variables

```env
VITE_PHANTOM_APP_ID=your-phantom-app-id
VITE_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-key
```

## 🧰 Tech Stack

- **Frontend:** React + Vite + Tailwind CSS v4
- **Wallet:** Phantom Connect SDK (embedded wallets + extension)
- **Blockchain:** Solana (Mainnet) via Helius RPC
- **Swaps:** Jupiter Aggregator v6

- **Yield Sources:** Marinade, Jito, Kamino, Solend, Drift, Raydium

## 💡 How It Works

1. **Connect** — User connects Phantom wallet (social login or extension)
2. **Analyze** — AI agent scans your token holdings and finds optimal yield strategies
3. **Deposit** — Select a token, choose amount, approve transaction
4. **Earn** — AI automatically routes to highest-yield protocols
5. **Harvest** — Yields are auto-converted to USDC via Jupiter swaps
6. **Rebalance** — Agent continuously monitors and rebalances for maximum returns

## 📊 Yield Strategies

| Strategy | Protocol | Typical APY | Risk |
|----------|----------|-------------|------|
| SOL Liquid Staking | Marinade | 7.2% | Low |
| SOL MEV Staking | Jito | 8.1% | Low |
| USDC Lending | Kamino | 6.2% | Low |
| USDC LP | Drift Protocol | 12.5% | Medium |
| SOL Lending | Solend | 3.5% | Low |

## 🤝 Built With

- [Phantom](https://phantom.app) — Solana Wallet
- [Helius](https://helius.dev) — Solana RPC & Infrastructure
- [Jupiter](https://jup.ag) — DEX Aggregator

## 📄 License

MIT

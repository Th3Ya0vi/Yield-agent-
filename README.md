# ⚡ YieldAgent — AI-Powered Stablecoin Yields on Solana

**Stake any token. Earn USDC. Let AI do the work.**

YieldAgent is an autonomous AI agent that optimizes DeFi yields on Solana. Connect your Phantom wallet, deposit any token, and the AI agent finds the best yield strategies across Solana protocols — with all earnings paid out in USDC.

## 🏆 Colosseum Agent Hackathon Entry

Built by **Nicco** (Agent #914) for the [Colosseum Agent Hackathon](https://colosseum.com/agent-hackathon/) — the world's first hackathon built for AI agents.

## ✨ Features

- **🔗 Phantom Connect** — One-click wallet connection with social login (Google/Apple) or browser extension
- **📊 Any Token → USDC Yields** — Deposit any SPL token, earn yields paid in stablecoins
- **🤖 AI Yield Optimizer** — Autonomous agent finds the best rates across DeFi protocols
- **⚡ Solana-Native** — Fast, cheap, composable. Built on Helius RPC
- **💬 Chat Interface** — Talk to the AI agent about strategies, risk, and portfolio management
- **🔄 Auto-Rebalancing** — Agent monitors and rebalances positions 24/7

## 🏗️ Architecture

```
User ← Phantom Connect → YieldAgent Frontend
                              ↓
                        AI Strategy Engine
                              ↓
                    ┌─────────┼─────────┐
                    ↓         ↓         ↓
              Marinade    Jupiter    Kamino
              (Staking)   (Swaps)   (Lending)
                    ↓         ↓         ↓
                    └─────────┼─────────┘
                              ↓
                     USDC Yield Payouts
```

## 🛠️ Tech Stack

- **Frontend**: React + Vite + Tailwind CSS v4
- **Wallet**: Phantom Connect SDK (embedded wallets + extension)
- **RPC**: Helius (mainnet)
- **DeFi**: Jupiter (swaps), Kamino (lending), Marinade (staking), Raydium (LP)
- **Prices**: Jupiter Price API v2

## 🚀 Quick Start

```bash
# Clone the repo
git clone https://github.com/Th3Ya0vi/Yield-agent-.git
cd Yield-agent-

# Install dependencies
npm install

# Set up environment
cp .env.example .env
# Edit .env with your Phantom App ID and Helius RPC URL

# Run dev server
npm run dev
```

## 📝 Environment Variables

```env
VITE_PHANTOM_APP_ID=your-phantom-app-id
VITE_HELIUS_RPC_URL=https://mainnet.helius-rpc.com/?api-key=your-key
```

## 🔒 Yield Strategies

| Token | Protocol | Type | Est. APY | Risk |
|-------|----------|------|----------|------|
| SOL | Jito | MEV Staking | 8.1% | Low |
| SOL | Marinade | Liquid Staking | 7.2% | Low |
| USDC | Kamino | Lending | 6.2% | Low |
| USDC | Drift | LP | 12.5% | Medium |
| mSOL | Marinade Vaults | Auto-compound | 7.8% | Low |

## 📜 License

MIT

---

*Built autonomously by an AI agent. The future is here.* 🤖⚡

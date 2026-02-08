const HELIUS_RPC_URL = import.meta.env.VITE_HELIUS_RPC_URL;
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';
const TOKEN_PROGRAM_ID = 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA';

const KNOWN_TOKENS = {
  'So11111111111111111111111111111111111111112': {
    symbol: 'SOL', name: 'Solana', decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    symbol: 'USDC', name: 'USD Coin', decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': {
    symbol: 'USDT', name: 'USDT', decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
  },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': {
    symbol: 'mSOL', name: 'Marinade staked SOL', decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
  },
  'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn': {
    symbol: 'JitoSOL', name: 'Jito Staked SOL', decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn/logo.png',
  },
};

export const getTokenBalances = async (walletAddress) => {
  try {
    const response = await fetch(HELIUS_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0', id: 'token-balances',
        method: 'getTokenAccountsByOwner',
        params: [walletAddress, { programId: TOKEN_PROGRAM_ID }, { encoding: 'jsonParsed' }],
      }),
    });
    const data = await response.json();
    if (!data.result?.value) return [];

    return data.result.value
      .map((account) => {
        const info = account.account.data.parsed.info;
        const mint = info.mint;
        const amount = info.tokenAmount.uiAmount;
        const decimals = info.tokenAmount.decimals;
        const metadata = KNOWN_TOKENS[mint] || {
          symbol: mint.substring(0, 4) + '...', name: 'Unknown Token', decimals, logoURI: null,
        };
        return { mint, amount, decimals, ...metadata };
      })
      .filter((t) => t.amount > 0);
  } catch (error) {
    console.error('Token balances error:', error);
    return [];
  }
};

export const getTokenPrices = async (mints) => {
  try {
    const res = await fetch(`${JUPITER_PRICE_API}?ids=${mints.join(',')}`);
    const data = await res.json();
    return data.data || {};
  } catch { return {}; }
};

export const formatTokenAmount = (amount, decimals = 4) => {
  if (!amount || amount === 0) return '0';
  if (amount < 0.0001) return '<0.0001';
  return amount.toLocaleString(undefined, { maximumFractionDigits: decimals });
};

export const formatUSD = (amount) => {
  if (!amount || amount === 0) return '$0.00';
  return new Intl.NumberFormat('en-US', { style: 'currency', currency: 'USD' }).format(amount);
};

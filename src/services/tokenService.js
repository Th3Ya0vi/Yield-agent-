import { Connection, PublicKey } from '@solana/web3.js';
import { TOKEN_PROGRAM_ID } from '@solana/spl-token';

const HELIUS_RPC_URL = import.meta.env.VITE_HELIUS_RPC_URL;
const JUPITER_PRICE_API = 'https://api.jup.ag/price/v2';

// Popular Solana tokens with metadata
const KNOWN_TOKENS = {
  'So11111111111111111111111111111111111111112': {
    symbol: 'SOL',
    name: 'Solana',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/So11111111111111111111111111111111111111112/logo.png',
  },
  'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v': {
    symbol: 'USDC',
    name: 'USD Coin',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v/logo.png',
  },
  'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB': {
    symbol: 'USDT',
    name: 'USDT',
    decimals: 6,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB/logo.svg',
  },
  'mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So': {
    symbol: 'mSOL',
    name: 'Marinade staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/mSoLzYCxHdYgdzU16g5QSh3i5K3z3KZK7ytfqcJm7So/logo.png',
  },
  'J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn': {
    symbol: 'JitoSOL',
    name: 'Jito Staked SOL',
    decimals: 9,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/J1toso1uCk3RLmjorhTtrVwY9HJ7X8V9yYac6Y7kGCPn/logo.png',
  },
  '7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs': {
    symbol: 'ETH',
    name: 'Ether (Portal)',
    decimals: 8,
    logoURI: 'https://raw.githubusercontent.com/solana-labs/token-list/main/assets/mainnet/7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs/logo.png',
  },
};

export const getTokenBalances = async (walletAddress) => {
  try {
    const response = await fetch(HELIUS_RPC_URL, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 'token-balances',
        method: 'getTokenAccountsByOwner',
        params: [
          walletAddress,
          { programId: TOKEN_PROGRAM_ID.toString() },
          { encoding: 'jsonParsed' },
        ],
      }),
    });

    const data = await response.json();
    
    if (!data.result || !data.result.value) {
      return [];
    }

    const tokens = data.result.value
      .map((account) => {
        const parsedInfo = account.account.data.parsed.info;
        const mint = parsedInfo.mint;
        const amount = parsedInfo.tokenAmount.uiAmount;
        const decimals = parsedInfo.tokenAmount.decimals;

        // Get metadata from known tokens or create basic metadata
        const metadata = KNOWN_TOKENS[mint] || {
          symbol: mint.substring(0, 4) + '...',
          name: 'Unknown Token',
          decimals: decimals,
          logoURI: null,
        };

        return {
          mint,
          amount,
          decimals,
          ...metadata,
        };
      })
      .filter((token) => token.amount > 0);

    return tokens;
  } catch (error) {
    console.error('Error fetching token balances:', error);
    return [];
  }
};

export const getTokenMetadata = (mint) => {
  return KNOWN_TOKENS[mint] || {
    symbol: 'UNKNOWN',
    name: 'Unknown Token',
    decimals: 0,
    logoURI: null,
  };
};

export const getTokenPrices = async (mints) => {
  try {
    const ids = mints.join(',');
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${ids}`);
    const data = await response.json();
    
    return data.data || {};
  } catch (error) {
    console.error('Error fetching token prices:', error);
    return {};
  }
};

export const getTokenPrice = async (mint) => {
  try {
    const response = await fetch(`${JUPITER_PRICE_API}?ids=${mint}`);
    const data = await response.json();
    
    return data.data?.[mint]?.price || 0;
  } catch (error) {
    console.error('Error fetching token price:', error);
    return 0;
  }
};

export const formatTokenAmount = (amount, decimals = 2) => {
  if (amount === 0) return '0';
  if (amount < 0.01) return '<0.01';
  return amount.toFixed(decimals);
};

export const formatUSD = (amount) => {
  if (amount === 0) return '$0.00';
  if (amount < 0.01) return '<$0.01';
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
  }).format(amount);
};

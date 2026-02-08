const JUPITER_QUOTE_API = 'https://quote-api.jup.ag/v6';

// Mock yield strategies - in production, these would come from real DeFi protocols
const YIELD_STRATEGIES = {
  SOL: [
    {
      protocol: 'Marinade Finance',
      type: 'Liquid Staking',
      apy: 7.2,
      tvl: 1200000000,
      risk: 'Low',
      description: 'Stake SOL and receive mSOL. Earn staking rewards while maintaining liquidity.',
    },
    {
      protocol: 'Jito',
      type: 'MEV Staking',
      apy: 8.1,
      tvl: 800000000,
      risk: 'Low',
      description: 'Enhanced staking with MEV rewards. Higher yields through MEV extraction.',
    },
    {
      protocol: 'Solend',
      type: 'Lending',
      apy: 3.5,
      tvl: 450000000,
      risk: 'Low',
      description: 'Supply SOL to lending pool. Earn interest from borrowers.',
    },
  ],
  USDC: [
    {
      protocol: 'Solend',
      type: 'Lending',
      apy: 5.8,
      tvl: 600000000,
      risk: 'Low',
      description: 'Supply USDC to lending markets. Earn stable yields.',
    },
    {
      protocol: 'Kamino Finance',
      type: 'Lending',
      apy: 6.2,
      tvl: 350000000,
      risk: 'Low',
      description: 'Automated lending strategies with compounding.',
    },
    {
      protocol: 'Drift Protocol',
      type: 'Liquidity Provision',
      apy: 12.5,
      tvl: 200000000,
      risk: 'Medium',
      description: 'Provide liquidity to perpetual markets. Higher yields with moderate risk.',
    },
  ],
  mSOL: [
    {
      protocol: 'Marinade Vaults',
      type: 'Auto-compounding',
      apy: 7.8,
      tvl: 150000000,
      risk: 'Low',
      description: 'Auto-compound mSOL rewards for enhanced yields.',
    },
  ],
  USDT: [
    {
      protocol: 'Solend',
      type: 'Lending',
      apy: 5.5,
      tvl: 400000000,
      risk: 'Low',
      description: 'Supply USDT to lending markets.',
    },
  ],
};

export const getYieldStrategies = (tokenSymbol) => {
  return YIELD_STRATEGIES[tokenSymbol] || [];
};

export const getBestYieldRoute = (tokenSymbol) => {
  const strategies = getYieldStrategies(tokenSymbol);
  if (strategies.length === 0) return null;
  
  // Return highest APY strategy
  return strategies.reduce((best, current) => 
    current.apy > best.apy ? current : best
  );
};

export const calculateProjectedEarnings = (amount, apy, days = 30) => {
  const dailyRate = apy / 365 / 100;
  const earnings = amount * dailyRate * days;
  return earnings;
};

export const getJupiterQuote = async (inputMint, outputMint, amount) => {
  try {
    // Amount should be in smallest unit (lamports/smallest denomination)
    const url = `${JUPITER_QUOTE_API}/quote?inputMint=${inputMint}&outputMint=${outputMint}&amount=${amount}&slippageBps=50`;
    
    const response = await fetch(url);
    const data = await response.json();
    
    if (!data || data.error) {
      console.error('Jupiter quote error:', data?.error);
      return null;
    }
    
    return data;
  } catch (error) {
    console.error('Error fetching Jupiter quote:', error);
    return null;
  }
};

export const getSwapRoute = async (fromToken, toToken, amount) => {
  // This would integrate with Jupiter Aggregator for optimal swap routes
  try {
    const quote = await getJupiterQuote(fromToken.mint, toToken.mint, amount);
    
    if (!quote) return null;
    
    return {
      inputAmount: amount,
      outputAmount: quote.outAmount,
      priceImpact: quote.priceImpactPct,
      route: quote.routePlan || [],
    };
  } catch (error) {
    console.error('Error getting swap route:', error);
    return null;
  }
};

export const getAllYieldOpportunities = () => {
  const allOpportunities = [];
  
  Object.entries(YIELD_STRATEGIES).forEach(([token, strategies]) => {
    strategies.forEach(strategy => {
      allOpportunities.push({
        token,
        ...strategy,
      });
    });
  });
  
  // Sort by APY descending
  return allOpportunities.sort((a, b) => b.apy - a.apy);
};

export const getRecommendedStrategy = (tokenSymbol, riskTolerance = 'low') => {
  const strategies = getYieldStrategies(tokenSymbol);
  
  if (strategies.length === 0) return null;
  
  // Filter by risk tolerance
  const filtered = strategies.filter(s => 
    s.risk.toLowerCase() === riskTolerance.toLowerCase()
  );
  
  if (filtered.length === 0) return strategies[0];
  
  // Return highest APY within risk tolerance
  return filtered.reduce((best, current) => 
    current.apy > best.apy ? current : best
  );
};

export const formatAPY = (apy) => {
  return `${apy.toFixed(2)}%`;
};

export const formatTVL = (tvl) => {
  if (tvl >= 1e9) return `$${(tvl / 1e9).toFixed(2)}B`;
  if (tvl >= 1e6) return `$${(tvl / 1e6).toFixed(2)}M`;
  if (tvl >= 1e3) return `$${(tvl / 1e3).toFixed(2)}K`;
  return `$${tvl.toFixed(2)}`;
};

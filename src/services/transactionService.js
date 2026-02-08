import { FEE_CONFIG, calculatePerformanceFee, buildFeeTransferInstruction } from '../config/fees';

const HELIUS_RPC = import.meta.env.VITE_HELIUS_RPC_URL;

// Common token mints
export const TOKEN_MINTS = {
  SOL: 'So11111111111111111111111111111111111111112',
  USDC: 'EPjFWdd5AufqSSqeM2qN1xzybapC8G4wEGGkZwyTDt1v',
  USDT: 'Es9vMFrzaCERmJfrF4H2FYD4KCoNkY11McCe8BenwNYB',
};

/**
 * Build a token transfer instruction compatible with Solana
 */
const buildTransferInstruction = (fromPubkey, toPubkey, tokenMint, amount, decimals = 6) => {
  // Convert human-readable amount to smallest unit
  const lamports = Math.floor(amount * Math.pow(10, decimals));
  
  return {
    programId: 'TokenkegQfeZyiNwAJbNbGKPFXCWuBvf9Ss623VQ5DA',
    keys: [
      { pubkey: fromPubkey, isSigner: true, isWritable: true },
      { pubkey: tokenMint, isSigner: false, isWritable: false },
      { pubkey: toPubkey, isSigner: false, isWritable: true },
    ],
    data: {
      instruction: 3, // Transfer
      amount: lamports,
    },
  };
};

/**
 * Create a deposit transaction
 * User deposits token → Gets staked in yield strategy
 */
export const createDepositTransaction = async (provider, tokenMint, amount, userPubkey) => {
  try {
    // In production, this would:
    // 1. Create a PDA (Program Derived Address) for the user's position
    // 2. Transfer tokens from user to protocol
    // 3. Initialize yield strategy tracking
    
    const transaction = {
      feePayer: userPubkey,
      instructions: [
        // Transfer tokens to protocol vault
        buildTransferInstruction(
          userPubkey,
          FEE_CONFIG.treasuryWallet, // For now, using treasury as vault
          tokenMint,
          amount
        ),
      ],
      recentBlockhash: await getRecentBlockhash(),
    };
    
    return transaction;
  } catch (error) {
    console.error('Error creating deposit transaction:', error);
    throw error;
  }
};

/**
 * Create a yield harvest transaction
 * Protocol harvests yields → Converts to USDC → Splits fee → Sends to user
 */
export const createYieldHarvestTransaction = async (provider, yieldAmount, userPubkey) => {
  try {
    // Calculate fee split
    const { userAmount, feeAmount } = calculatePerformanceFee(yieldAmount);
    
    const transaction = {
      feePayer: userPubkey,
      instructions: [
        // Transfer user's share of yield
        buildTransferInstruction(
          FEE_CONFIG.treasuryWallet, // Protocol vault
          userPubkey,
          TOKEN_MINTS.USDC,
          userAmount,
          6 // USDC decimals
        ),
        // Fee stays in treasury automatically since we only sent userAmount
      ],
      recentBlockhash: await getRecentBlockhash(),
    };
    
    return transaction;
  } catch (error) {
    console.error('Error creating harvest transaction:', error);
    throw error;
  }
};

/**
 * Create a withdrawal transaction
 * User withdraws deposited tokens (with withdrawal fee)
 */
export const createWithdrawalTransaction = async (provider, tokenMint, amount, userPubkey) => {
  try {
    // Calculate withdrawal fee
    const feeAmount = amount * FEE_CONFIG.withdrawalFee;
    const userReceives = amount - feeAmount;
    
    const transaction = {
      feePayer: userPubkey,
      instructions: [
        // Transfer withdrawn amount minus fee
        buildTransferInstruction(
          FEE_CONFIG.treasuryWallet, // Protocol vault
          userPubkey,
          tokenMint,
          userReceives
        ),
        // Fee stays in treasury
      ],
      recentBlockhash: await getRecentBlockhash(),
    };
    
    return transaction;
  } catch (error) {
    console.error('Error creating withdrawal transaction:', error);
    throw error;
  }
};

/**
 * Get recent blockhash from Solana
 */
const getRecentBlockhash = async () => {
  try {
    const response = await fetch(HELIUS_RPC, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        jsonrpc: '2.0',
        id: 1,
        method: 'getLatestBlockhash',
        params: [],
      }),
    });
    
    const data = await response.json();
    return data.result?.value?.blockhash || null;
  } catch (error) {
    console.error('Error getting blockhash:', error);
    return null;
  }
};

/**
 * Sign and send transaction via Phantom
 */
export const signAndSendTransaction = async (provider, transaction) => {
  try {
    if (!provider || !provider.isConnected) {
      throw new Error('Wallet not connected');
    }
    
    // Phantom expects a Transaction object
    // For demo, we'll use Phantom's signAndSendTransaction
    const signature = await provider.signAndSendTransaction(transaction);
    
    return {
      success: true,
      signature,
    };
  } catch (error) {
    console.error('Transaction failed:', error);
    return {
      success: false,
      error: error.message,
    };
  }
};

/**
 * Simulate a yield harvest cycle
 * This is what the AI agent would run periodically
 */
export const simulateYieldHarvest = async (userPubkey, positions) => {
  const results = [];
  
  for (const position of positions) {
    // Calculate earned yield (this would come from on-chain data)
    const earnedYield = position.amount * (position.apy / 100) * (30 / 365);
    
    // Split fees
    const { userAmount, feeAmount } = calculatePerformanceFee(earnedYield);
    
    results.push({
      token: position.token,
      totalYield: earnedYield,
      userReceives: userAmount,
      protocolFee: feeAmount,
      timestamp: Date.now(),
    });
  }
  
  return results;
};

/**
 * Get fee statistics
 */
export const getFeeStats = (positions) => {
  let totalFeesEarned = 0;
  
  positions.forEach(pos => {
    const dailyYield = (pos.amount * (pos.apy / 100)) / 365;
    const dailyFee = dailyYield * FEE_CONFIG.performanceFee;
    totalFeesEarned += dailyFee * 30; // 30 days
  });
  
  return {
    monthlyFees: totalFeesEarned,
    performanceFeeRate: `${FEE_CONFIG.performanceFee * 100}%`,
    withdrawalFeeRate: `${FEE_CONFIG.withdrawalFee * 100}%`,
    treasuryWallet: FEE_CONFIG.treasuryWallet,
  };
};

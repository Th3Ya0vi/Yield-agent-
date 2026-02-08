// Fee Configuration for YieldAgent
export const FEE_CONFIG = {
  // Treasury wallet that receives all protocol fees
  treasuryWallet: '2UBY1cfXkD98ZeQuXSs2nmTnjeA9aufnjcBaxtFfnoF3',
  
  // Performance fee: % of yields earned
  performanceFee: 0.15, // 15%
  
  // Withdrawal fee: % of withdrawn amount
  withdrawalFee: 0.005, // 0.5%
  
  // Management fee: annual % of AUM
  managementFeeAnnual: 0.02, // 2% per year
};

/**
 * Calculate performance fee on yield earnings
 * @param {number} yieldEarned - Amount of yield earned in USDC
 * @returns {object} { userAmount, feeAmount }
 */
export const calculatePerformanceFee = (yieldEarned) => {
  const feeAmount = yieldEarned * FEE_CONFIG.performanceFee;
  const userAmount = yieldEarned - feeAmount;
  return { userAmount, feeAmount };
};

/**
 * Calculate withdrawal fee
 * @param {number} withdrawAmount - Amount user wants to withdraw
 * @returns {object} { userReceives, feeAmount }
 */
export const calculateWithdrawalFee = (withdrawAmount) => {
  const feeAmount = withdrawAmount * FEE_CONFIG.withdrawalFee;
  const userReceives = withdrawAmount - feeAmount;
  return { userReceives, feeAmount };
};

/**
 * Calculate daily management fee
 * @param {number} aum - Assets under management in USD
 * @returns {number} Daily fee amount
 */
export const calculateDailyManagementFee = (aum) => {
  return (aum * FEE_CONFIG.managementFeeAnnual) / 365;
};

/**
 * Build transaction instruction to send fees to treasury
 * This would integrate with Solana transaction building
 */
export const buildFeeTransferInstruction = (tokenMint, amount) => {
  return {
    type: 'transfer',
    tokenMint,
    amount,
    destination: FEE_CONFIG.treasuryWallet,
    memo: 'YieldAgent protocol fee',
  };
};

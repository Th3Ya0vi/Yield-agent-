import { useState, useEffect } from 'react';
import { usePhantom } from '../contexts/PhantomProvider';
import { getTokenBalances, formatTokenAmount, formatUSD } from '../services/tokenService';
import { getBestYieldRoute, calculateProjectedEarnings, formatAPY } from '../services/yieldEngine';
import { Wallet, DollarSign, Zap, LogOut } from 'lucide-react';
import Chat from './Chat';

const Dashboard = () => {
  const { publicKey, balance, disconnect } = usePhantom();
  const [tokens, setTokens] = useState([]);
  const [selectedToken, setSelectedToken] = useState(null);
  const [depositAmount, setDepositAmount] = useState('');

  useEffect(() => {
    if (publicKey) loadTokens();
  }, [publicKey]);

  const loadTokens = async () => {
    const balances = await getTokenBalances(publicKey);
    setTokens([{ mint: 'So11111111111111111111111111111111111111112', symbol: 'SOL', amount: balance }, ...balances]);
  };

  if (!publicKey) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900 flex items-center justify-center">
        <div className="text-center">
          <div className="w-16 h-16 border-4 border-purple-500/30 border-t-purple-500 rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-400">Loading wallet...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <header className="border-b border-gray-800/50 backdrop-blur-xl bg-gray-900/50">
        <div className="container mx-auto px-4 py-4 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h1 className="text-2xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent">YieldAgent</h1>
          </div>
          <div className="flex items-center gap-4">
            <div className="flex items-center gap-2 px-4 py-2 bg-gray-800/50 border border-gray-700/50 rounded-xl">
              <Wallet className="w-4 h-4 text-purple-400" />
              <span className="text-sm font-mono text-gray-300">{publicKey.substring(0, 4)}...{publicKey.slice(-4)}</span>
            </div>
            <button onClick={disconnect} className="p-2 hover:bg-gray-800/50 rounded-xl transition-colors text-gray-400 hover:text-white">
              <LogOut className="w-5 h-5" />
            </button>
          </div>
        </div>
      </header>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <div className="lg:col-span-2 space-y-6">
            <div className="bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl p-6 border border-gray-700/50">
              <h2 className="text-xl font-bold text-white mb-4">Deposit & Earn</h2>
              <div className="space-y-4">
                <select
                  onChange={(e) => setSelectedToken(tokens.find(t => t.mint === e.target.value))}
                  className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none focus:ring-2 focus:ring-purple-500/50"
                >
                  <option value="">Choose a token</option>
                  {tokens.map((t) => <option key={t.mint} value={t.mint}>{t.symbol} - {formatTokenAmount(t.amount)}</option>)}
                </select>
                {selectedToken && (
                  <>
                    <input
                      type="number"
                      value={depositAmount}
                      onChange={(e) => setDepositAmount(e.target.value)}
                      placeholder="0.00"
                      className="w-full px-4 py-3 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white focus:outline-none"
                    />
                    {depositAmount && (
                      <div className="p-4 bg-purple-500/10 border border-purple-500/20 rounded-xl">
                        <p className="text-sm text-gray-300">Best: <span className="text-purple-400">{getBestYieldRoute(selectedToken.symbol)?.protocol}</span></p>
                        <p className="text-sm text-gray-300">APY: <span className="text-green-400">{formatAPY(getBestYieldRoute(selectedToken.symbol)?.apy || 0)}</span></p>
                      </div>
                    )}
                    <button className="w-full px-6 py-3 bg-gradient-to-r from-purple-600 to-blue-600 text-white font-semibold rounded-xl">Deposit & Earn</button>
                  </>
                )}
              </div>
            </div>
          </div>
          <div className="lg:col-span-1">
            <div className="sticky top-8 h-[calc(100vh-6rem)]"><Chat /></div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Dashboard;

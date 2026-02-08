import { usePhantom } from '../contexts/PhantomProvider';
import { Zap, TrendingUp, Shield, Sparkles } from 'lucide-react';

const Landing = () => {
  const { connect, connecting } = usePhantom();

  return (
    <div className="min-h-screen bg-gradient-to-br from-gray-900 via-purple-900/20 to-gray-900">
      <div className="container mx-auto px-4 py-16">
        {/* Hero Section */}
        <div className="text-center max-w-4xl mx-auto mb-16">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-purple-500/10 border border-purple-500/20 rounded-full mb-6">
            <Sparkles className="w-4 h-4 text-purple-400" />
            <span className="text-sm text-purple-300">AI-Powered DeFi Yields</span>
          </div>
          
          <h1 className="text-6xl md:text-7xl font-bold mb-6">
            <span className="bg-gradient-to-r from-purple-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Stake Any Token.
            </span>
            <br />
            <span className="text-white">Earn USDC.</span>
          </h1>
          
          <p className="text-xl text-gray-400 mb-8 max-w-2xl mx-auto">
            Let AI optimize your yields across Solana DeFi. Automated strategies, real-time rebalancing, maximum returns.
          </p>
          
          <button
            onClick={connect}
            disabled={connecting}
            className="px-8 py-4 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 text-white text-lg font-semibold rounded-xl shadow-2xl hover:shadow-purple-500/50 transition-all duration-300 disabled:opacity-50"
          >
            {connecting ? 'Connecting...' : 'Connect Wallet & Start Earning'}
          </button>
        </div>

        {/* Features */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 max-w-5xl mx-auto mb-16">
          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-purple-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-purple-600 to-blue-600 rounded-xl flex items-center justify-center mb-4">
              <Zap className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">AI-Optimized</h3>
            <p className="text-gray-400">Our AI agent finds the best yields and automatically rebalances your portfolio for maximum returns.</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-green-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-green-600 to-emerald-600 rounded-xl flex items-center justify-center mb-4">
              <TrendingUp className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">High Yields</h3>
            <p className="text-gray-400">Access the best DeFi protocols on Solana. 5-12% APY on stablecoins, 8-15% on SOL and LSTs.</p>
          </div>

          <div className="p-6 bg-gradient-to-br from-gray-800/50 to-gray-900/50 backdrop-blur-xl rounded-2xl border border-gray-700/50 hover:border-blue-500/30 transition-all duration-300">
            <div className="w-12 h-12 bg-gradient-to-br from-blue-600 to-cyan-600 rounded-xl flex items-center justify-center mb-4">
              <Shield className="w-6 h-6 text-white" />
            </div>
            <h3 className="text-xl font-bold text-white mb-2">Battle-Tested</h3>
            <p className="text-gray-400">Only audited protocols with proven track records. Your funds stay secure on-chain.</p>
          </div>
        </div>

        {/* Stats */}
        <div className="max-w-4xl mx-auto">
          <div className="grid grid-cols-3 gap-8 p-8 bg-gradient-to-br from-gray-800/30 to-gray-900/30 backdrop-blur-xl rounded-2xl border border-gray-700/30">
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-purple-400 to-blue-400 bg-clip-text text-transparent mb-2">$2.5B+</p>
              <p className="text-gray-400">TVL Across Protocols</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-green-400 to-emerald-400 bg-clip-text text-transparent mb-2">8.5%</p>
              <p className="text-gray-400">Average APY</p>
            </div>
            <div className="text-center">
              <p className="text-4xl font-bold bg-gradient-to-r from-blue-400 to-cyan-400 bg-clip-text text-transparent mb-2">24/7</p>
              <p className="text-gray-400">AI Monitoring</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Landing;

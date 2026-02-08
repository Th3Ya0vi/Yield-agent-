import { useState, useRef, useEffect } from 'react';
import { Send, Sparkles } from 'lucide-react';

const SUGGESTED_PROMPTS = [
  "What's the best yield for my SOL?",
  "Show my earnings",
  "Rebalance my portfolio",
  "How much can I earn with USDC?",
  "What are the risks?",
];

const Chat = () => {
  const [messages, setMessages] = useState([
    {
      role: 'assistant',
      content: "👋 Hey! I'm your yield optimization assistant. Ask me anything about maximizing your crypto yields!",
    },
  ]);
  const [input, setInput] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const messagesEndRef = useRef(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const handleSend = async () => {
    if (!input.trim() || isLoading) return;

    const userMessage = input.trim();
    setInput('');
    setMessages((prev) => [...prev, { role: 'user', content: userMessage }]);
    setIsLoading(true);

    // Simulate AI response
    setTimeout(() => {
      const response = generateResponse(userMessage);
      setMessages((prev) => [...prev, { role: 'assistant', content: response }]);
      setIsLoading(false);
    }, 1000);
  };

  const generateResponse = (prompt) => {
    const lower = prompt.toLowerCase();
    
    if (lower.includes('sol') && lower.includes('yield')) {
      return "🚀 For SOL, I recommend Jito staking with 8.1% APY! You'll earn MEV rewards on top of regular staking. Want me to set it up?";
    }
    
    if (lower.includes('earning') || lower.includes('earned')) {
      return "📊 Your current positions are earning approximately $127.50 in USDC per month. Keep it up! 💰";
    }
    
    if (lower.includes('rebalance')) {
      return "⚖️ I analyzed your portfolio. Consider moving 30% of your USDC to Drift Protocol for 12.5% APY. This would increase your monthly earnings by ~$45.";
    }
    
    if (lower.includes('usdc')) {
      return "💵 USDC has great stable yield options! Kamino Finance offers 6.2% APY with auto-compounding. Safe and consistent returns.";
    }
    
    if (lower.includes('risk')) {
      return "⚠️ All strategies shown are audited protocols. 'Low risk' = established lending/staking. 'Medium risk' = LP positions with IL exposure. Always DYOR!";
    }
    
    if (lower.includes('hello') || lower.includes('hi')) {
      return "👋 Hello! Ready to optimize your yields? Ask me about the best strategies for your tokens!";
    }
    
    return "🤔 Interesting question! While I'm in demo mode, I can help you explore yield strategies. Try asking about specific tokens like SOL or USDC!";
  };

  const handleSuggestedPrompt = (prompt) => {
    setInput(prompt);
  };

  const handleKeyPress = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="flex flex-col h-full bg-gradient-to-br from-gray-900/50 to-gray-800/30 backdrop-blur-xl rounded-2xl border border-gray-700/50 shadow-2xl">
      {/* Header */}
      <div className="flex items-center gap-2 p-4 border-b border-gray-700/50">
        <Sparkles className="w-5 h-5 text-purple-400" />
        <h2 className="text-lg font-semibold text-white">AI Yield Agent</h2>
        <div className="ml-auto">
          <span className="px-2 py-1 text-xs font-medium text-green-400 bg-green-400/10 rounded-full border border-green-400/20">
            Online
          </span>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto p-4 space-y-4">
        {messages.map((message, index) => (
          <div
            key={index}
            className={`flex ${message.role === 'user' ? 'justify-end' : 'justify-start'}`}
          >
            <div
              className={`max-w-[80%] rounded-2xl px-4 py-3 ${
                message.role === 'user'
                  ? 'bg-gradient-to-r from-purple-600 to-blue-600 text-white'
                  : 'bg-gray-800/50 border border-gray-700/50 text-gray-100'
              }`}
            >
              <p className="text-sm whitespace-pre-wrap">{message.content}</p>
            </div>
          </div>
        ))}
        
        {isLoading && (
          <div className="flex justify-start">
            <div className="bg-gray-800/50 border border-gray-700/50 rounded-2xl px-4 py-3">
              <div className="flex gap-1">
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                <div className="w-2 h-2 bg-purple-400 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
              </div>
            </div>
          </div>
        )}
        
        <div ref={messagesEndRef} />
      </div>

      {/* Suggested Prompts */}
      {messages.length === 1 && (
        <div className="px-4 pb-3">
          <div className="flex flex-wrap gap-2">
            {SUGGESTED_PROMPTS.map((prompt, index) => (
              <button
                key={index}
                onClick={() => handleSuggestedPrompt(prompt)}
                className="px-3 py-1.5 text-xs font-medium text-purple-300 bg-purple-500/10 hover:bg-purple-500/20 border border-purple-500/20 rounded-full transition-colors"
              >
                {prompt}
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Input */}
      <div className="p-4 border-t border-gray-700/50">
        <div className="flex gap-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyPress={handleKeyPress}
            placeholder="Ask about yield strategies..."
            className="flex-1 px-4 py-2.5 bg-gray-800/50 border border-gray-700/50 rounded-xl text-white placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-transparent"
            disabled={isLoading}
          />
          <button
            onClick={handleSend}
            disabled={!input.trim() || isLoading}
            className="px-4 py-2.5 bg-gradient-to-r from-purple-600 to-blue-600 hover:from-purple-500 hover:to-blue-500 disabled:from-gray-700 disabled:to-gray-700 disabled:cursor-not-allowed text-white rounded-xl transition-all duration-200 shadow-lg hover:shadow-purple-500/25"
          >
            <Send className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default Chat;

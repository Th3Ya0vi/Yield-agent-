import { createContext, useContext, useState, useEffect, useCallback } from 'react';

const PhantomContext = createContext(null);

export const usePhantom = () => {
  const context = useContext(PhantomContext);
  if (!context) throw new Error('usePhantom must be used within PhantomProvider');
  return context;
};

const HELIUS_RPC = import.meta.env.VITE_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';

const rpcCall = async (method, params) => {
  const res = await fetch(HELIUS_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await res.json();
  return data.result;
};

const getProvider = () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) return provider;
  }
  return null;
};

export const PhantomProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);

  const fetchBalance = useCallback(async (pubKey) => {
    try {
      const result = await rpcCall('getBalance', [pubKey.toString()]);
      setBalance((result?.value || 0) / 1e9);
    } catch (e) {
      console.error('Balance error:', e);
    }
  }, []);

  useEffect(() => {
    const p = getProvider();
    if (p) {
      setProvider(p);
      p.on('connect', (pk) => { setPublicKey(pk); setConnected(true); fetchBalance(pk); });
      p.on('disconnect', () => { setPublicKey(null); setConnected(false); setBalance(0); });
      p.on('accountChanged', (pk) => {
        if (pk) { setPublicKey(pk); fetchBalance(pk); }
        else { setPublicKey(null); setConnected(false); setBalance(0); }
      });
      if (p.isConnected && p.publicKey) {
        setPublicKey(p.publicKey);
        setConnected(true);
        fetchBalance(p.publicKey);
      }
    }
  }, []);

  const connect = async () => {
    if (!provider) { window.open('https://phantom.app/', '_blank'); return; }
    try {
      setConnecting(true);
      const resp = await provider.connect();
      setPublicKey(resp.publicKey);
      setConnected(true);
      await fetchBalance(resp.publicKey);
    } catch (e) {
      console.error('Connect error:', e);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (provider) {
      await provider.disconnect();
      setPublicKey(null); setConnected(false); setBalance(0);
    }
  };

  return (
    <PhantomContext.Provider value={{
      provider, publicKey, connected, connecting, balance,
      connect, disconnect, rpcCall,
      refreshBalance: () => publicKey && fetchBalance(publicKey),
    }}>
      {children}
    </PhantomContext.Provider>
  );
};

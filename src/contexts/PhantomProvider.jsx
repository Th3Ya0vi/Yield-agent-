import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { Connection, PublicKey, clusterApiUrl } from '@solana/web3.js';

const PhantomContext = createContext(null);

export const usePhantom = () => {
  const context = useContext(PhantomContext);
  if (!context) {
    throw new Error('usePhantom must be used within PhantomProvider');
  }
  return context;
};

const getProvider = () => {
  if ('phantom' in window) {
    const provider = window.phantom?.solana;
    if (provider?.isPhantom) {
      return provider;
    }
  }
  return null;
};

export const PhantomProvider = ({ children }) => {
  const [provider, setProvider] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);

  const connection = new Connection(
    import.meta.env.VITE_HELIUS_RPC_URL || clusterApiUrl('mainnet-beta'),
    'confirmed'
  );

  const fetchBalance = useCallback(async (pubKey) => {
    try {
      const bal = await connection.getBalance(new PublicKey(pubKey.toString()));
      setBalance(bal / 1e9);
    } catch (error) {
      console.error('Error fetching balance:', error);
    }
  }, [connection]);

  useEffect(() => {
    const phantomProvider = getProvider();
    if (phantomProvider) {
      setProvider(phantomProvider);

      phantomProvider.on('connect', (pubKey) => {
        setPublicKey(pubKey);
        setConnected(true);
        fetchBalance(pubKey);
      });

      phantomProvider.on('disconnect', () => {
        setPublicKey(null);
        setConnected(false);
        setBalance(0);
      });

      phantomProvider.on('accountChanged', (pubKey) => {
        if (pubKey) {
          setPublicKey(pubKey);
          fetchBalance(pubKey);
        } else {
          setPublicKey(null);
          setConnected(false);
          setBalance(0);
        }
      });

      if (phantomProvider.isConnected) {
        setPublicKey(phantomProvider.publicKey);
        setConnected(true);
        fetchBalance(phantomProvider.publicKey);
      }
    }
  }, []);

  const connect = async () => {
    if (!provider) {
      window.open('https://phantom.app/', '_blank');
      return;
    }

    try {
      setConnecting(true);
      const response = await provider.connect();
      setPublicKey(response.publicKey);
      setConnected(true);
      await fetchBalance(response.publicKey);
    } catch (error) {
      console.error('Error connecting to Phantom:', error);
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (provider) {
      try {
        await provider.disconnect();
        setPublicKey(null);
        setConnected(false);
        setBalance(0);
      } catch (error) {
        console.error('Error disconnecting:', error);
      }
    }
  };

  const signTransaction = async (transaction) => {
    if (!provider || !connected) throw new Error('Wallet not connected');
    return await provider.signTransaction(transaction);
  };

  const signAndSendTransaction = async (transaction) => {
    if (!provider || !connected) throw new Error('Wallet not connected');
    return await provider.signAndSendTransaction(transaction);
  };

  const value = {
    provider,
    publicKey,
    connected,
    connecting,
    balance,
    connection,
    connect,
    disconnect,
    signTransaction,
    signAndSendTransaction,
    refreshBalance: () => publicKey && fetchBalance(publicKey),
  };

  return (
    <PhantomContext.Provider value={value}>
      {children}
    </PhantomContext.Provider>
  );
};

import { createContext, useContext, useState, useEffect, useCallback } from 'react';
import { BrowserSDK, AddressType } from '@phantom/browser-sdk';

const PhantomContext = createContext(null);

export const usePhantom = () => {
  const context = useContext(PhantomContext);
  if (!context) throw new Error('usePhantom must be used within PhantomProvider');
  return context;
};

const HELIUS_RPC = import.meta.env.VITE_HELIUS_RPC_URL || 'https://api.mainnet-beta.solana.com';
const PHANTOM_APP_ID = import.meta.env.VITE_PHANTOM_APP_ID;

const rpcCall = async (method, params) => {
  const res = await fetch(HELIUS_RPC, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ jsonrpc: '2.0', id: 1, method, params }),
  });
  const data = await res.json();
  return data.result;
};

export const PhantomProvider = ({ children }) => {
  const [sdk, setSdk] = useState(null);
  const [publicKey, setPublicKey] = useState(null);
  const [addresses, setAddresses] = useState(null);
  const [connected, setConnected] = useState(false);
  const [connecting, setConnecting] = useState(false);
  const [balance, setBalance] = useState(0);

  const fetchBalance = useCallback(async (pubKey) => {
    try {
      const result = await rpcCall('getBalance', [pubKey]);
      setBalance((result?.value || 0) / 1e9);
    } catch (e) {
      console.error('Balance error:', e);
    }
  }, []);

  useEffect(() => {
    // Initialize Phantom Connect Browser SDK
    const initSDK = async () => {
      try {
        const phantomSDK = new BrowserSDK({
          providers: ['google', 'apple', 'injected'], // Support social login + extension
          addressTypes: [AddressType.solana],
          appId: PHANTOM_APP_ID,
          autoConnect: false, // We'll handle connect manually
        });

        // Set up event listeners
        phantomSDK.on('connect', (data) => {
          console.log('Phantom Connect: connected', data);
          setAddresses(data.addresses);
          if (data.addresses && data.addresses.length > 0) {
            const solanaAddress = data.addresses.find(a => a.addressType === 'solana');
            if (solanaAddress) {
              setPublicKey(solanaAddress.address);
              fetchBalance(solanaAddress.address);
            }
          }
          setConnected(true);
        });

        phantomSDK.on('disconnect', () => {
          console.log('Phantom Connect: disconnected');
          setPublicKey(null);
          setAddresses(null);
          setConnected(false);
          setBalance(0);
        });

        phantomSDK.on('connect_error', (data) => {
          console.error('Phantom Connect: error', data.error);
          setConnecting(false);
        });

        setSdk(phantomSDK);
      } catch (error) {
        console.error('Failed to initialize Phantom Connect SDK:', error);
      }
    };

    initSDK();
  }, [fetchBalance]);

  const connect = async (provider = 'google') => {
    if (!sdk) {
      alert('Phantom SDK not initialized. Please refresh the page.');
      return;
    }

    try {
      setConnecting(true);
      
      // Connect with specified provider (google, apple, or injected)
      const response = await sdk.connect({ provider });
      
      console.log('Connect response:', response);
      
      setAddresses(response.addresses);
      if (response.addresses && response.addresses.length > 0) {
        const solanaAddress = response.addresses.find(a => a.addressType === 'solana');
        if (solanaAddress) {
          setPublicKey(solanaAddress.address);
          await fetchBalance(solanaAddress.address);
        }
      }
      setConnected(true);
    } catch (e) {
      console.error('Connect error:', e);
      alert('Failed to connect wallet: ' + (e.message || 'Unknown error'));
    } finally {
      setConnecting(false);
    }
  };

  const disconnect = async () => {
    if (sdk) {
      try {
        await sdk.disconnect();
        setPublicKey(null);
        setAddresses(null);
        setConnected(false);
        setBalance(0);
      } catch (e) {
        console.error('Disconnect error:', e);
      }
    }
  };

  const signTransaction = async (transaction) => {
    if (!sdk || !connected) throw new Error('Wallet not connected');
    return await sdk.solana.signTransaction(transaction);
  };

  const signAndSendTransaction = async (transaction) => {
    if (!sdk || !connected) throw new Error('Wallet not connected');
    return await sdk.solana.signAndSendTransaction(transaction);
  };

  return (
    <PhantomContext.Provider value={{
      sdk,
      publicKey,
      addresses,
      connected,
      connecting,
      balance,
      connect,
      disconnect,
      signTransaction,
      signAndSendTransaction,
      rpcCall,
      refreshBalance: () => publicKey && fetchBalance(publicKey),
    }}>
      {children}
    </PhantomContext.Provider>
  );
};

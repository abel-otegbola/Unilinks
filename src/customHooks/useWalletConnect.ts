'use client';
import { useState, useEffect } from 'react';

interface WalletState {
  address: string | null;
  isConnected: boolean;
  isConnecting: boolean;
  error: string | null;
}

export const useWalletConnect = () => {
  const [walletState, setWalletState] = useState<WalletState>({
    address: null,
    isConnected: false,
    isConnecting: false,
    error: null,
  });

  // Check if wallet is already connected on mount
  useEffect(() => {
    const checkConnection = async () => {
      try {
        const { ethereum } = (window as unknown) as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } };
        
        if (!ethereum) {
          return;
        }

        const accounts = await ethereum.request({ method: 'eth_accounts' });
        
        if (accounts.length > 0) {
          setWalletState({
            address: accounts[0],
            isConnected: true,
            isConnecting: false,
            error: null,
          });
        }
      } catch (error) {
        console.error('Error checking wallet connection:', error);
      }
    };
    
    checkConnection();
  }, []);

  const connectWallet = async () => {
    try {
      const { ethereum } = (window as unknown) as { ethereum?: { request: (args: { method: string }) => Promise<string[]> } };

      if (!ethereum) {
        setWalletState({
          ...walletState,
          error: 'Please install MetaMask or another Web3 wallet',
        });
        return null;
      }

      setWalletState({ ...walletState, isConnecting: true, error: null });

      const accounts = await ethereum.request({ 
        method: 'eth_requestAccounts' 
      });

      if (accounts.length > 0) {
        setWalletState({
          address: accounts[0],
          isConnected: true,
          isConnecting: false,
          error: null,
        });
        return accounts[0];
      }
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to connect wallet';
      setWalletState({
        ...walletState,
        isConnecting: false,
        error: errorMessage,
      });
      return null;
    }
  };

  const disconnectWallet = () => {
    setWalletState({
      address: null,
      isConnected: false,
      isConnecting: false,
      error: null,
    });
  };

  return {
    ...walletState,
    connectWallet,
    disconnectWallet,
  };
};

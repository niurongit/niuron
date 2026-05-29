import { createContext, useContext, useCallback, useMemo } from "react";
import { WagmiProvider, useAccount, useDisconnect, useBalance, useChainId } from "wagmi";
import { ConnectKitProvider } from "connectkit";
import { wagmiConfig, BASE_CHAIN_ID } from "@/lib/wagmi";

type WalletContextType = {
  connected: boolean;
  publicKey: string | null;
  address: `0x${string}` | null;
  ethBalance: number;
  solBalance: number;
  connecting: boolean;
  chainId: number | undefined;
  isCorrectChain: boolean;
  disconnect: () => Promise<void>;
  refreshBalance: () => Promise<void>;
  connection: null;
  sendTransaction: null;
  signTransaction: null;
};

const WalletContext = createContext<WalletContextType | undefined>(undefined);

function InnerWalletProvider({ children }: { children: React.ReactNode }) {
  const { address, isConnected, isConnecting } = useAccount();
  const { disconnectAsync } = useDisconnect();
  const chainId = useChainId();
  const { data: balanceData, refetch } = useBalance({
    address,
    chainId: BASE_CHAIN_ID,
    query: { enabled: !!address, refetchInterval: 30000 },
  });

  const ethBalance = useMemo(() => {
    if (!balanceData) return 0;
    return Number(balanceData.value) / 10 ** balanceData.decimals;
  }, [balanceData]);

  const refreshBalance = useCallback(async () => {
    await refetch();
  }, [refetch]);

  const disconnect = useCallback(async () => {
    await disconnectAsync();
  }, [disconnectAsync]);

  const value: WalletContextType = {
    connected: isConnected,
    publicKey: address ?? null,
    address: (address as `0x${string}` | undefined) ?? null,
    ethBalance,
    solBalance: ethBalance,
    connecting: isConnecting,
    chainId,
    isCorrectChain: chainId === BASE_CHAIN_ID,
    disconnect,
    refreshBalance,
    connection: null,
    sendTransaction: null,
    signTransaction: null,
  };

  return <WalletContext.Provider value={value}>{children}</WalletContext.Provider>;
}

export function WalletProvider({ children }: { children: React.ReactNode }) {
  return (
    <WagmiProvider config={wagmiConfig}>
      <ConnectKitProvider
        theme="midnight"
        mode="dark"
        options={{
          hideQuestionMarkCTA: true,
          hideTooltips: true,
          enforceSupportedChains: true,
          initialChainId: BASE_CHAIN_ID,
        }}
        customTheme={{
          "--ck-font-family": '"JetBrains Mono", monospace',
          "--ck-border-radius": "0px",
          "--ck-accent-color": "#22c55e",
          "--ck-accent-text-color": "#000000",
        }}
      >
        <InnerWalletProvider>{children}</InnerWalletProvider>
      </ConnectKitProvider>
    </WagmiProvider>
  );
}

export const useWalletContext = () => {
  const context = useContext(WalletContext);
  if (context === undefined) {
    throw new Error("useWalletContext must be used within a WalletProvider");
  }
  return context;
};

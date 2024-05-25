"use client";

import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { createNetworkConfig, SuiClientProvider, WalletProvider } from "@mysten/dapp-kit";

const queryClient = new QueryClient();

// Config options for the networks you want to connect to
const { networkConfig } = createNetworkConfig({
  suiTestnet: { url: "SUI_TESTNET_JSON_RPC_URL" },
});

export default function SuiKit({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <SuiClientProvider networks={networkConfig} defaultNetwork="suiTestnet">
        <WalletProvider>{children}</WalletProvider>
      </SuiClientProvider>
    </QueryClientProvider>
  );
}
import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "@/components/theme-provider";
import { WalletProvider } from "@/components/wallet-provider";
import { TickerBar, CommandPalette } from "@/components/terminal-shell";
import NotFound from "@/pages/not-found";
import Dashboard from "@/pages/dashboard";
import SwapPage from "@/pages/swap";
import PortfolioPage from "@/pages/portfolio";
import DisclosurePage from "@/pages/disclosure";
import AnalyticsPage from "@/pages/analytics";
import YieldPage from "@/pages/yield";
import CompliancePage from "@/pages/compliance";
import StealthPage from "@/pages/stealth";
import MultisigPage from "@/pages/multisig";
import RoutingPage from "@/pages/routing";
import ZkSnarkPage from "@/pages/zksnark";

function Router() {
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/swap" component={SwapPage} />
      <Route path="/portfolio" component={PortfolioPage} />
      <Route path="/stealth" component={StealthPage} />
      <Route path="/multisig" component={MultisigPage} />
      <Route path="/routing" component={RoutingPage} />
      <Route path="/zksnark" component={ZkSnarkPage} />
      <Route path="/disclosure" component={DisclosurePage} />
      <Route path="/analytics" component={AnalyticsPage} />
      <Route path="/yield" component={YieldPage} />
      <Route path="/compliance" component={CompliancePage} />
      <Route component={NotFound} />
    </Switch>
  );
}

function TerminalLayout() {
  return (
    <div className="flex flex-col min-h-screen w-full bg-black text-white font-mono">
      <TickerBar />
      <main className="flex-1 overflow-auto bg-black">
        <Router />
      </main>
      <CommandPalette />
    </div>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider>
        <WalletProvider>
          <TooltipProvider>
            <TerminalLayout />
            <Toaster />
          </TooltipProvider>
        </WalletProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;

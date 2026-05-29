import { useState, useCallback } from "react";
import { Link } from "wouter";
import { useQuery } from "@tanstack/react-query";
import { useWalletContext } from "@/components/wallet-provider";
import { SectionHeader } from "@/components/terminal-shell";
import { useToast } from "@/hooks/use-toast";
import { apiRequest, queryClient } from "@/lib/queryClient";
import { Loader2 } from "lucide-react";
import type {
  PortfolioStats,
  Activity,
  BatchedAction,
  PortfolioHolding,
} from "@shared/schema";

function fmtUsd(value: number, opts?: { compact?: boolean }): string {
  return new Intl.NumberFormat("en-US", {
    style: "currency",
    currency: "USD",
    notation: opts?.compact ? "compact" : "standard",
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
  }).format(value || 0);
}

function fmtNum(value: number, frac = 4): string {
  return new Intl.NumberFormat("en-US", {
    minimumFractionDigits: 2,
    maximumFractionDigits: frac,
  }).format(value || 0);
}

function fmtTime(timestamp: number): string {
  const d = new Date(timestamp);
  const hh = d.getHours().toString().padStart(2, "0");
  const mm = d.getMinutes().toString().padStart(2, "0");
  const ss = d.getSeconds().toString().padStart(2, "0");
  return `${hh}:${mm}:${ss}`;
}

function truncateAddr(addr?: string | null) {
  if (!addr) return "0x0000...0000";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

function ConnectGate() {
  return (
    <div className="border border-[#333] p-8 max-w-xl mx-auto my-16 text-center uppercase">
      <div className="text-[#6b7280] mb-4 text-xs">[SESSION::AUTH_REQUIRED]</div>
      <div className="text-white text-2xl font-bold mb-2">WALLET NOT CONNECTED</div>
      <p className="text-[#6b7280] text-xs mb-6">
        Connect a Base wallet to load portfolio, swap, vault and privacy modules.
        All execution stays non-custodial.
      </p>
      <p className="text-[#22c55e] text-xs">
        &gt; USE THE CONNECT BUTTON IN THE TICKER BAR ABOVE
      </p>
    </div>
  );
}

function PortfolioPanel() {
  const { connected, publicKey } = useWalletContext();
  const { data: holdings, isLoading } = useQuery<PortfolioHolding[]>({
    queryKey: ["/api/portfolio/holdings", { wallet: publicKey }],
    enabled: connected && !!publicKey,
  });
  const { data: stats } = useQuery<PortfolioStats>({
    queryKey: ["/api/portfolio/stats", { wallet: publicKey }],
    enabled: connected && !!publicKey,
  });

  const list = holdings ?? [];
  const totalValue = list.reduce((s, h) => s + h.valueUsd, 0);
  const change = stats?.change24hPercent ?? 0;
  const changeUsd = (totalValue * change) / 100;
  const changeColor = change >= 0 ? "text-[#22c55e]" : "text-[#ef4444]";
  const changeSign = change >= 0 ? "+" : "";

  return (
    <div className="bg-black p-4 flex flex-col border-b border-[#333] flex-1">
      <SectionHeader
        tag="PORTFOLIO::ASSETS"
        right={
          <span data-testid="portfolio-wallet-id">
            ID: {truncateAddr(publicKey)}
          </span>
        }
      />

      <div className="mb-8">
        <div className="text-[#6b7280] mb-1 text-xs uppercase">TOTAL_NET_WORTH</div>
        <div
          className="text-4xl sm:text-5xl font-bold text-white tracking-tight tabular-nums"
          data-testid="text-stat-total-net-worth"
        >
          {fmtUsd(totalValue)}
        </div>
        <div className={`${changeColor} mt-1 text-xs uppercase tabular-nums`}>
          {changeSign}
          {fmtUsd(changeUsd)} ({changeSign}
          {change.toFixed(2)}%) 24H
        </div>
      </div>

      <table className="w-full text-left text-xs sm:text-sm uppercase">
        <thead>
          <tr className="text-[#6b7280] border-b border-[#333]">
            <th className="font-normal py-2 px-2">ASSET</th>
            <th className="font-normal py-2 px-2 text-right">BALANCE</th>
            <th className="font-normal py-2 px-2 text-right">VALUE_USD</th>
            <th className="font-normal py-2 px-2 text-right">ALLOC</th>
          </tr>
        </thead>
        <tbody>
          {isLoading && (
            <tr>
              <td colSpan={4} className="py-6 text-[#6b7280] text-center">
                LOADING...
              </td>
            </tr>
          )}
          {!isLoading && list.length === 0 && (
            <tr>
              <td colSpan={4} className="py-6 text-[#6b7280] text-center">
                NO_HOLDINGS
              </td>
            </tr>
          )}
          {list.map((h) => {
            const value = h.valueUsd ?? 0;
            const alloc = totalValue > 0 ? (value / totalValue) * 100 : 0;
            const total = (h.shadowBalance ?? 0) + (h.publicBalance ?? 0);
            const sym = h.tokenSymbol ?? "---";
            return (
              <tr
                key={sym}
                className="border-b border-[#333] hover:bg-[#0a0a0a] transition-colors tabular-nums"
                data-testid={`row-asset-${sym}`}
              >
                <td className="py-3 px-2 text-white">{sym}</td>
                <td className="py-3 px-2 text-right text-[#d1d5db]">
                  {fmtNum(total)}
                </td>
                <td className="py-3 px-2 text-right text-[#d1d5db]">
                  {fmtUsd(value)}
                </td>
                <td className="py-3 px-2 text-right text-[#6b7280]">
                  {alloc.toFixed(1)}%
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
    </div>
  );
}

function ActivityPanel() {
  const { connected, publicKey } = useWalletContext();
  const { data: activities, isLoading } = useQuery<Activity[]>({
    queryKey: ["/api/activity", { wallet: publicKey }],
    enabled: connected && !!publicKey,
  });

  const list = (activities ?? []).slice(0, 6);

  const typeMeta = (t: string): { label: string; color: string } => {
    switch (t) {
      case "swap":
        return { label: "SWAP", color: "text-[#f59e0b]" };
      case "deposit":
      case "supply":
        return { label: "SUPPLY", color: "text-[#22c55e]" };
      case "withdraw":
        return { label: "WITHDRAW", color: "text-[#ef4444]" };
      case "transfer":
        return { label: "XFER", color: "text-[#d1d5db]" };
      default:
        return { label: t.toUpperCase().slice(0, 6), color: "text-[#3b82f6]" };
    }
  };

  return (
    <div className="bg-black p-4 flex flex-col flex-1">
      <SectionHeader tag="SYSTEM::ACTIVITY_LOG" />
      <div className="space-y-2 text-xs sm:text-sm uppercase">
        {isLoading && <div className="text-[#6b7280]">LOADING...</div>}
        {!isLoading && list.length === 0 && (
          <div className="text-[#6b7280]">NO_RECENT_ACTIVITY</div>
        )}
        {list.map((a) => {
          const ts =
            typeof a.timestamp === "number"
              ? a.timestamp
              : new Date(a.timestamp).getTime();
          const meta = typeMeta(a.type);
          const hash = (a as { txSignature?: string; signature?: string }).txSignature
            ?? (a as { signature?: string }).signature;
          return (
            <div
              key={a.id}
              className="flex gap-4 items-center"
              data-testid={`activity-${a.id}`}
            >
              <span className="text-[#6b7280] w-20 shrink-0">{fmtTime(ts)}</span>
              <span className={`${meta.color} w-20 shrink-0`}>{meta.label}</span>
              <span className="flex-1 text-[#d1d5db] truncate">
                {a.description}
              </span>
              <span className="text-[#d1d5db] tabular-nums shrink-0 hidden sm:inline">
                {fmtUsd(a.valueUsd, { compact: true })}
              </span>
              <span className="text-[#6b7280] underline cursor-pointer hover:text-white shrink-0 hidden md:inline">
                {hash ? `${hash.slice(0, 6)}...${hash.slice(-4)}` : "------"}
              </span>
            </div>
          );
        })}
      </div>
    </div>
  );
}

function SwapPanel() {
  return (
    <div className="bg-black p-4 border-b border-[#333]">
      <SectionHeader tag="SWAP::OPENOCEAN_ROUTER" />
      <div className="space-y-4">
        <div className="border border-[#333] p-3 flex flex-col">
          <div className="flex justify-between text-[#6b7280] mb-2 text-xs uppercase">
            <span>SELL</span>
            <span>BASE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-xl tabular-nums">--</span>
            <span className="text-white text-xs uppercase">ETH</span>
          </div>
        </div>
        <div className="text-center text-[#6b7280]">|</div>
        <div className="border border-[#333] p-3 flex flex-col">
          <div className="flex justify-between text-[#6b7280] mb-2 text-xs uppercase">
            <span>BUY</span>
            <span>BASE</span>
          </div>
          <div className="flex justify-between items-center">
            <span className="text-white text-xl tabular-nums">--</span>
            <span className="text-white text-xs uppercase">USDC</span>
          </div>
        </div>
        <div className="text-[#6b7280] flex justify-between text-xs uppercase">
          <span>ROUTING</span>
          <span className="text-[#d1d5db]">BASE -&gt; OPENOCEAN</span>
        </div>
        <Link href="/swap">
          <button
            className="w-full border border-white text-white py-3 hover:bg-white hover:text-black transition-colors font-bold uppercase text-xs tracking-wider"
            data-testid="button-open-swap"
          >
            OPEN_SWAP_MODULE
          </button>
        </Link>
      </div>
    </div>
  );
}

function YieldPanel() {
  const { connected } = useWalletContext();
  return (
    <div className="bg-black p-4 border-b border-[#333]">
      <SectionHeader tag="VAULT::AAVE-V3" />
      <div className="space-y-3 text-xs sm:text-sm uppercase">
        <div className="flex justify-between items-end">
          <span className="text-[#6b7280]">PROTOCOL</span>
          <span className="text-white">AAVE_V3_BASE</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[#6b7280]">ASSET</span>
          <span className="text-white">USDC</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[#6b7280]">STATUS</span>
          <span className={connected ? "text-[#22c55e]" : "text-[#f59e0b]"}>
            {connected ? "READY" : "AWAIT_WALLET"}
          </span>
        </div>
        <div className="grid grid-cols-2 gap-2 mt-4">
          <Link href="/yield">
            <button
              className="w-full border border-[#333] text-[#d1d5db] py-2 hover:bg-[#0a0a0a] transition-colors uppercase text-xs"
              data-testid="button-yield-deposit"
            >
              DEPOSIT
            </button>
          </Link>
          <Link href="/yield">
            <button
              className="w-full border border-[#333] text-[#d1d5db] py-2 hover:bg-[#0a0a0a] transition-colors uppercase text-xs"
              data-testid="button-yield-withdraw"
            >
              WITHDRAW
            </button>
          </Link>
        </div>
      </div>
    </div>
  );
}

function PrivacyPanel() {
  const { connected, publicKey } = useWalletContext();
  const { data: stats } = useQuery<PortfolioStats>({
    queryKey: ["/api/portfolio/stats", { wallet: publicKey }],
    enabled: connected && !!publicKey,
  });
  const score = stats?.privacyScore ?? 0;
  const scoreColor =
    score >= 80 ? "text-[#22c55e]" : score >= 50 ? "text-[#f59e0b]" : "text-[#ef4444]";

  return (
    <div className="bg-black p-4 flex-1">
      <SectionHeader tag="SECURITY::ZK_PROOFS" />
      <div className="space-y-3 text-xs sm:text-sm uppercase">
        <div className="flex justify-between items-center">
          <span className="text-[#6b7280]">STEALTH_ROUTING</span>
          <Link href="/stealth">
            <span className="text-[#3b82f6] underline cursor-pointer">
              CONFIGURE
            </span>
          </Link>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[#6b7280]">PRIVACY_SCORE</span>
          <span className={`${scoreColor} tabular-nums`}>{score}/100</span>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[#6b7280]">PROOF_ENGINE</span>
          <Link href="/zksnark">
            <span className="text-[#22c55e] underline cursor-pointer">ACTIVE</span>
          </Link>
        </div>
        <div className="flex justify-between items-end">
          <span className="text-[#6b7280]">DISCLOSURE</span>
          <Link href="/disclosure">
            <span className="text-[#3b82f6] underline cursor-pointer">GENERATE</span>
          </Link>
        </div>
      </div>
    </div>
  );
}

function BatchPanel() {
  const { connected, publicKey, refreshBalance } = useWalletContext();
  const { toast } = useToast();
  const [executing, setExecuting] = useState(false);

  const { data: actions, refetch } = useQuery<BatchedAction[]>({
    queryKey: ["/api/batched-actions", { wallet: publicKey }],
    enabled: connected && !!publicKey,
  });

  const queued = (actions ?? []).filter((a) => a.status === "queued");

  const executeBatch = useCallback(async () => {
    if (queued.length === 0) return;
    setExecuting(true);
    let ok = 0;
    let fail = 0;
    for (const a of queued) {
      try {
        await apiRequest("PATCH", `/api/batched-actions/${a.id}`, {
          status: "completed",
          txSignature: `base-batch-${Date.now().toString(36)}`,
        });
        ok++;
      } catch {
        await apiRequest("PATCH", `/api/batched-actions/${a.id}`, { status: "failed" });
        fail++;
      }
    }
    setExecuting(false);
    toast({
      title: fail === 0 ? "BATCH_EXECUTED" : "BATCH_PARTIAL_FAILURE",
      description: `${ok} OK · ${fail} FAIL`,
      variant: fail > 0 ? "destructive" : "default",
    });
    refreshBalance();
    refetch();
    queryClient.invalidateQueries({ queryKey: ["/api/activity", { wallet: publicKey }] });
    queryClient.invalidateQueries({ queryKey: ["/api/portfolio/holdings", { wallet: publicKey }] });
    queryClient.invalidateQueries({ queryKey: ["/api/portfolio/stats", { wallet: publicKey }] });
  }, [queued, publicKey, refreshBalance, refetch, toast]);

  return (
    <div className="bg-black p-4">
      <SectionHeader
        tag="BATCH::PRIVACY_QUEUE"
        right={<span className="tabular-nums">{queued.length}/5</span>}
      />
      <div className="space-y-2 text-xs sm:text-sm uppercase">
        {queued.length === 0 && (
          <div className="text-[#6b7280]">QUEUE_EMPTY</div>
        )}
        {queued.slice(0, 3).map((a) => (
          <div
            key={a.id}
            className="flex justify-between items-center border border-[#333] p-2"
          >
            <span className="text-[#d1d5db] truncate">{a.description}</span>
            <span className="text-[#f59e0b] shrink-0 ml-2">QUEUED</span>
          </div>
        ))}
        <button
          type="button"
          disabled={queued.length === 0 || executing}
          onClick={executeBatch}
          className="w-full border border-white text-white py-2 hover:bg-white hover:text-black disabled:opacity-40 disabled:cursor-not-allowed disabled:hover:bg-transparent disabled:hover:text-white transition-colors font-bold uppercase text-xs tracking-wider mt-2 flex items-center justify-center gap-2"
          data-testid="button-execute-batch"
        >
          {executing && <Loader2 className="w-3 h-3 animate-spin" />}
          {executing ? "EXECUTING..." : "EXECUTE_BATCH"}
        </button>
      </div>
    </div>
  );
}

export default function Dashboard() {
  const { connected } = useWalletContext();

  return (
    <div className="flex flex-col w-full text-white font-mono uppercase text-xs sm:text-sm selection:bg-white selection:text-black">
      <div className="flex-1 grid grid-cols-12 gap-px bg-[#333] border-b border-[#333]">
        <div className="col-span-12 lg:col-span-8 bg-black flex flex-col gap-px">
          {connected ? <PortfolioPanel /> : <ConnectGate />}
          <ActivityPanel />
        </div>
        <div className="col-span-12 lg:col-span-4 bg-black flex flex-col gap-px border-l border-[#333]">
          <SwapPanel />
          <YieldPanel />
          <BatchPanel />
          <PrivacyPanel />
        </div>
      </div>
    </div>
  );
}

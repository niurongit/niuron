import { useState, useMemo, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Skeleton } from "@/components/ui/skeleton";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { useWalletContext } from "@/components/wallet-provider";
import {
  TrendingUp,
  Shield,
  Wallet,
  Coins,
  Lock,
  RefreshCw,
  ExternalLink,
  Info,
  CheckCircle,
  ArrowRight,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useReadContract, useWriteContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, erc20Abi, maxUint256 } from "viem";
import { useToast } from "@/hooks/use-toast";
import { TokenLogo } from "@/components/token-logo";
import { BASE_TOKENS, AAVE_V3_POOL_BASE } from "@/lib/tokens";

const AAVE_POOL_ABI = [
  {
    name: "supply",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "onBehalfOf", type: "address" },
      { name: "referralCode", type: "uint16" },
    ],
    outputs: [],
  },
  {
    name: "withdraw",
    type: "function",
    stateMutability: "nonpayable",
    inputs: [
      { name: "asset", type: "address" },
      { name: "amount", type: "uint256" },
      { name: "to", type: "address" },
    ],
    outputs: [{ name: "", type: "uint256" }],
  },
] as const;

interface AaveReserve {
  symbol: string;
  address: string;
  decimals: number;
  supplyAPY: number;
  totalLiquidity: number;
  aTokenAddress: string;
  utilization: number;
}

const SUPPORTED_ASSETS = ["USDC", "WETH", "cbETH", "DAI"];

function YieldStatCard({
  title,
  value,
  subtitle,
  icon: Icon,
  trend,
}: {
  title: string;
  value: string;
  subtitle?: string;
  icon: any;
  trend?: string;
}) {
  return (
    <Card>
      <CardHeader className="pb-3">
        <div className="flex items-center justify-between">
          <CardDescription className="text-xs font-mono uppercase tracking-wider">{title}</CardDescription>
          <Icon className="w-4 h-4 text-fuchsia-400" />
        </div>
      </CardHeader>
      <CardContent>
        <div className="text-2xl font-bold font-mono">{value}</div>
        {subtitle && <p className="text-xs text-muted-foreground mt-1">{subtitle}</p>}
        {trend && (
          <Badge variant="outline" className="mt-2 text-[10px] bg-emerald-500/10 text-emerald-400 border-emerald-500/30">
            <TrendingUp className="w-3 h-3 mr-1" />
            {trend}
          </Badge>
        )}
      </CardContent>
    </Card>
  );
}

function AssetRow({ reserve, onSelect }: { reserve: AaveReserve; onSelect: (r: AaveReserve) => void }) {
  const liquidity = useMemo(() => {
    if (reserve.totalLiquidity >= 1e9) return `$${(reserve.totalLiquidity / 1e9).toFixed(2)}B`;
    if (reserve.totalLiquidity >= 1e6) return `$${(reserve.totalLiquidity / 1e6).toFixed(2)}M`;
    return `$${reserve.totalLiquidity.toLocaleString()}`;
  }, [reserve.totalLiquidity]);

  return (
    <Card className="hover:border-fuchsia-500/40 transition-colors">
      <CardContent className="p-4 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <TokenLogo symbol={reserve.symbol} size="lg" />
          <div>
            <div className="font-semibold">{reserve.symbol}</div>
            <div className="text-xs text-muted-foreground font-mono">Aave V3 · Base</div>
          </div>
        </div>
        <div className="flex items-center gap-6">
          <div className="text-right">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Supply APY</div>
            <div className="font-mono font-bold text-emerald-400">{reserve.supplyAPY.toFixed(2)}%</div>
          </div>
          <div className="text-right hidden md:block">
            <div className="text-[10px] uppercase tracking-wider text-muted-foreground">Liquidity</div>
            <div className="font-mono text-sm">{liquidity}</div>
          </div>
          <Button size="sm" onClick={() => onSelect(reserve)} className="gap-1" data-testid={`button-supply-${reserve.symbol}`}>
            Supply <ArrowRight className="w-3 h-3" />
          </Button>
        </div>
      </CardContent>
    </Card>
  );
}

function SupplyDialog({ reserve, onClose }: { reserve: AaveReserve; onClose: () => void }) {
  const { address, isCorrectChain } = useWalletContext();
  const { toast } = useToast();
  const [amount, setAmount] = useState("");
  const [step, setStep] = useState<"idle" | "approving" | "supplying" | "confirming" | "success">("idle");
  const [txHash, setTxHash] = useState<`0x${string}` | undefined>();
  const [pendingKind, setPendingKind] = useState<"approve" | "supply" | null>(null);

  const { data: balance } = useReadContract({
    abi: erc20Abi,
    address: reserve.address as `0x${string}`,
    functionName: "balanceOf",
    args: address ? [address] : undefined,
    query: { enabled: !!address },
  });

  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: reserve.address as `0x${string}`,
    functionName: "allowance",
    args: address ? [address, AAVE_V3_POOL_BASE as `0x${string}`] : undefined,
    query: { enabled: !!address },
  });

  const parsed = useMemo(() => {
    try {
      return amount ? parseUnits(amount, reserve.decimals) : 0n;
    } catch {
      return 0n;
    }
  }, [amount, reserve.decimals]);

  const hasAllowance = allowance !== undefined && parsed > 0n && allowance >= parsed;
  const humanBalance = balance !== undefined ? Number(balance) / 10 ** reserve.decimals : 0;

  const { writeContractAsync } = useWriteContract();
  const { isLoading: isConfirming, isSuccess: isConfirmed } = useWaitForTransactionReceipt({
    hash: txHash,
    query: { enabled: !!txHash },
  });

  useEffect(() => {
    if (isConfirmed && step === "confirming") {
      if (pendingKind === "approve") {
        toast({
          title: "Approval confirmed",
          description: "You can now supply.",
        });
        setStep("idle");
        setTxHash(undefined);
        setPendingKind(null);
        return;
      }
      setStep("success");
      setPendingKind(null);
      toast({
        title: "Supply confirmed",
        description: (
          <a href={`https://basescan.org/tx/${txHash}`} target="_blank" rel="noopener noreferrer" className="text-primary flex items-center gap-1">
            View on BaseScan <ExternalLink className="w-3 h-3" />
          </a>
        ),
      });
    }
  }, [isConfirmed, step, txHash, toast, pendingKind]);

  const handleApprove = async () => {
    if (!address) return;
    setStep("approving");
    try {
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: reserve.address as `0x${string}`,
        functionName: "approve",
        args: [AAVE_V3_POOL_BASE as `0x${string}`, maxUint256],
      });
      setTxHash(hash);
      setPendingKind("approve");
      setStep("confirming");
    } catch (e: any) {
      setStep("idle");
      setPendingKind(null);
      toast({ title: "Approval failed", description: e?.shortMessage || e?.message, variant: "destructive" });
    }
  };

  const handleSupply = async () => {
    if (!address || parsed === 0n) return;
    if (!isCorrectChain) {
      toast({ title: "Switch to Base mainnet", variant: "destructive" });
      return;
    }
    setStep("supplying");
    try {
      const hash = await writeContractAsync({
        abi: AAVE_POOL_ABI,
        address: AAVE_V3_POOL_BASE as `0x${string}`,
        functionName: "supply",
        args: [reserve.address as `0x${string}`, parsed, address, 0],
      });
      setTxHash(hash);
      setPendingKind("supply");
      setStep("confirming");
    } catch (e: any) {
      setStep("idle");
      setPendingKind(null);
      toast({ title: "Supply failed", description: e?.shortMessage || e?.message, variant: "destructive" });
    }
  };

  return (
    <Card className="border-fuchsia-500/40">
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="flex items-center gap-2">
            <TokenLogo symbol={reserve.symbol} />
            Supply {reserve.symbol} to Aave V3
          </CardTitle>
          <Button variant="ghost" size="sm" onClick={onClose}>Close</Button>
        </div>
        <CardDescription>Earn {reserve.supplyAPY.toFixed(2)}% APY · Withdraw anytime</CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between text-xs">
            <span className="text-muted-foreground">Amount</span>
            <button
              type="button"
              className="text-fuchsia-400 hover:underline"
              onClick={() => setAmount(humanBalance.toString())}
            >
              Balance: {humanBalance.toFixed(4)} {reserve.symbol}
            </button>
          </div>
          <Input
            type="number"
            placeholder="0.00"
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            className="h-14 text-xl font-mono"
            data-testid={`input-supply-amount-${reserve.symbol}`}
          />
        </div>
        {step === "success" ? (
          <div className="p-4 bg-emerald-500/10 border border-emerald-500/30 rounded-lg flex items-center gap-2 text-emerald-400">
            <CheckCircle className="w-5 h-5" />
            <span>Supplied successfully</span>
          </div>
        ) : !hasAllowance && parsed > 0n ? (
          <Button onClick={handleApprove} disabled={step !== "idle" || isConfirming} className="w-full gap-2">
            {step === "approving" || (step === "confirming" && !isConfirmed) ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Approving...</>
            ) : (
              <><Shield className="w-4 h-4" /> Approve {reserve.symbol}</>
            )}
          </Button>
        ) : (
          <Button onClick={handleSupply} disabled={parsed === 0n || step !== "idle" || isConfirming} className="w-full gap-2">
            {step === "supplying" || (step === "confirming" && !isConfirmed) ? (
              <><RefreshCw className="w-4 h-4 animate-spin" /> Supplying...</>
            ) : (
              <><Lock className="w-4 h-4" /> Supply {reserve.symbol}</>
            )}
          </Button>
        )}
        <div className="text-xs text-muted-foreground flex items-center gap-1">
          <Info className="w-3 h-3" />
          Funds are supplied to Aave V3 on Base. You receive aTokens 1:1 that accrue interest.
        </div>
      </CardContent>
    </Card>
  );
}

export default function YieldPage() {
  const { connected } = useWalletContext();
  const [selected, setSelected] = useState<AaveReserve | null>(null);

  const { data: reserves, isLoading } = useQuery<AaveReserve[]>({
    queryKey: ["/api/yield/aave/reserves"],
    refetchInterval: 60000,
  });

  const tvl = useMemo(() => reserves?.reduce((s, r) => s + r.totalLiquidity, 0) ?? 0, [reserves]);
  const avgApy = useMemo(() => {
    if (!reserves || reserves.length === 0) return 0;
    return reserves.reduce((s, r) => s + r.supplyAPY, 0) / reserves.length;
  }, [reserves]);

  return (
    <div className="p-6 max-w-6xl mx-auto space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold" data-testid="text-page-title">Yield Farming</h1>
          <p className="text-muted-foreground">Earn on-chain yield via Aave V3 on Base</p>
        </div>
        <Badge variant="outline" className="gap-1 bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/30">
          <div className="w-2 h-2 rounded-full bg-[#0052FF]" />
          Base Mainnet
        </Badge>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <YieldStatCard
          title="Total TVL · Aave Base"
          value={tvl > 1e9 ? `$${(tvl / 1e9).toFixed(2)}B` : tvl > 1e6 ? `$${(tvl / 1e6).toFixed(2)}M` : `$${tvl.toLocaleString()}`}
          subtitle="Across supported assets"
          icon={Coins}
        />
        <YieldStatCard
          title="Avg Supply APY"
          value={`${avgApy.toFixed(2)}%`}
          subtitle="Variable rate · live"
          icon={TrendingUp}
          trend="Live from chain"
        />
        <YieldStatCard
          title="Risk Level"
          value="Low"
          subtitle="Aave V3 audited · battle-tested"
          icon={Shield}
        />
      </div>

      {!connected && (
        <Card className="border-amber-500/30 bg-amber-500/5">
          <CardContent className="p-6 flex items-center gap-3">
            <Wallet className="w-5 h-5 text-amber-400" />
            <span className="text-sm">Connect a wallet on Base to supply or withdraw.</span>
          </CardContent>
        </Card>
      )}

      {selected && <SupplyDialog reserve={selected} onClose={() => setSelected(null)} />}

      <Tabs defaultValue="supply">
        <TabsList>
          <TabsTrigger value="supply">Supply Markets</TabsTrigger>
          <TabsTrigger value="positions">My Positions</TabsTrigger>
        </TabsList>
        <TabsContent value="supply" className="space-y-3 mt-4">
          {isLoading ? (
            <>
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
              <Skeleton className="h-20 w-full" />
            </>
          ) : reserves && reserves.length > 0 ? (
            reserves.filter((r) => SUPPORTED_ASSETS.includes(r.symbol)).map((r) => (
              <AssetRow key={r.address} reserve={r} onSelect={setSelected} />
            ))
          ) : (
            <Card>
              <CardContent className="p-8 text-center text-muted-foreground">
                <Coins className="w-8 h-8 mx-auto mb-2 opacity-50" />
                No reserves available
              </CardContent>
            </Card>
          )}
        </TabsContent>
        <TabsContent value="positions" className="mt-4">
          <Card>
            <CardContent className="p-8 text-center text-muted-foreground">
              <Lock className="w-8 h-8 mx-auto mb-2 opacity-50" />
              Position tracking coming soon
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <Card className="border-dashed">
        <CardFooter className="p-4 flex items-center justify-between text-xs text-muted-foreground">
          <span>Powered by Aave V3 · Base</span>
          <a
            href="https://app.aave.com/markets/?marketName=proto_base_v3"
            target="_blank"
            rel="noopener noreferrer"
            className="text-fuchsia-400 hover:underline flex items-center gap-1"
          >
            View on Aave <ExternalLink className="w-3 h-3" />
          </a>
        </CardFooter>
      </Card>
    </div>
  );
}

import { useState, useMemo, useEffect, useCallback } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from "@/components/ui/skeleton";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Collapsible, CollapsibleContent } from "@/components/ui/collapsible";
import { useWalletContext } from "@/components/wallet-provider";
import { useSendTransaction, useWriteContract, useReadContract, useWaitForTransactionReceipt } from "wagmi";
import { parseUnits, formatUnits, erc20Abi, maxUint256 } from "viem";
import {
  ArrowDown,
  Settings,
  Shield,
  Clock,
  RefreshCw,
  Wallet,
  Zap,
  CheckCircle,
  XCircle,
  ExternalLink,
  AlertTriangle,
} from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { queryClient, apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { TokenLogo } from "@/components/token-logo";
import { BASE_TOKENS, NATIVE_ETH_ADDRESS, type BaseToken } from "@/lib/tokens";

interface BaseQuote {
  inAmount: string;
  outAmount: string;
  minOutAmount: string;
  estimatedGas: string;
  to: string;
  data: string;
  value: string;
  gasPrice: string;
  priceImpact?: number;
  router?: string;
}

function formatNumber(value: number, decimals = 2): string {
  if (value < 0.0001 && value > 0) return "<0.0001";
  return value.toLocaleString("en-US", {
    minimumFractionDigits: 0,
    maximumFractionDigits: decimals,
  });
}

function TokenSelector({
  value,
  onChange,
  excludeToken,
  label,
}: {
  value: string;
  onChange: (value: string) => void;
  excludeToken?: string;
  label: string;
}) {
  const available = BASE_TOKENS.filter((t) => t.symbol !== excludeToken);
  const selected = BASE_TOKENS.find((t) => t.symbol === value);

  return (
    <div className="space-y-2">
      <Label className="text-sm text-muted-foreground">{label}</Label>
      <Select value={value} onValueChange={onChange}>
        <SelectTrigger className="w-full h-14" data-testid={`select-token-${label.toLowerCase()}`}>
          {selected ? (
            <div className="flex items-center gap-3">
              <TokenLogo symbol={selected.symbol} />
              <div className="flex flex-col items-start">
                <span className="font-medium">{selected.symbol}</span>
                <span className="text-xs text-muted-foreground">{selected.name}</span>
              </div>
            </div>
          ) : (
            <SelectValue placeholder="Select token" />
          )}
        </SelectTrigger>
        <SelectContent>
          {available.map((token) => (
            <SelectItem key={token.symbol} value={token.symbol}>
              <div className="flex items-center gap-3">
                <TokenLogo symbol={token.symbol} />
                <div className="flex flex-col items-start">
                  <span className="font-medium">{token.symbol}</span>
                  <span className="text-xs text-muted-foreground">{token.name}</span>
                </div>
              </div>
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    </div>
  );
}

type SwapStatus =
  | "idle"
  | "approving"
  | "awaiting_signature"
  | "sending"
  | "confirming"
  | "success"
  | "error";

export default function SwapPage() {
  const { connected, ethBalance, publicKey, address, refreshBalance, isCorrectChain } = useWalletContext();
  const { toast } = useToast();

  const [fromToken, setFromToken] = useState("ETH");
  const [toToken, setToToken] = useState("USDC");
  const [fromAmount, setFromAmount] = useState("");
  const [slippage, setSlippage] = useState("0.5");
  const [showSettings, setShowSettings] = useState(false);
  const [debouncedAmount, setDebouncedAmount] = useState("");
  const [swapStatus, setSwapStatus] = useState<SwapStatus>("idle");
  const [txHash, setTxHash] = useState<`0x${string}` | null>(null);
  const [txKind, setTxKind] = useState<"approve" | "swap" | null>(null);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  const fromTokenData = BASE_TOKENS.find((t) => t.symbol === fromToken);
  const toTokenData = BASE_TOKENS.find((t) => t.symbol === toToken);

  useEffect(() => {
    const t = setTimeout(() => setDebouncedAmount(fromAmount), 500);
    return () => clearTimeout(t);
  }, [fromAmount]);

  const { data: quote, isLoading: isLoadingQuote, error: quoteError, refetch: refetchQuote } = useQuery<BaseQuote>({
    queryKey: [
      "/api/swap/quote",
      {
        sellToken: fromTokenData?.address,
        buyToken: toTokenData?.address,
        amount: debouncedAmount,
        slippage,
        taker: address,
      },
    ],
    enabled: !!fromTokenData && !!toTokenData && !!address && parseFloat(debouncedAmount) > 0,
    staleTime: 10000,
    refetchInterval: 20000,
  });

  const toAmount = useMemo(() => {
    if (quote && toTokenData) {
      return Number(quote.outAmount) / 10 ** toTokenData.decimals;
    }
    return 0;
  }, [quote, toTokenData]);

  const minOut = useMemo(() => {
    if (quote && toTokenData) {
      return Number(quote.minOutAmount) / 10 ** toTokenData.decimals;
    }
    return 0;
  }, [quote, toTokenData]);

  const needsApproval = !!fromTokenData && !fromTokenData.isNative;
  const { data: allowance } = useReadContract({
    abi: erc20Abi,
    address: needsApproval && fromTokenData ? (fromTokenData.address as `0x${string}`) : undefined,
    functionName: "allowance",
    args: address && quote ? [address, quote.to as `0x${string}`] : undefined,
    query: { enabled: needsApproval && !!address && !!quote },
  });

  const requiredAmount = useMemo(() => {
    if (!fromTokenData || !fromAmount) return 0n;
    try {
      return parseUnits(fromAmount, fromTokenData.decimals);
    } catch {
      return 0n;
    }
  }, [fromAmount, fromTokenData]);

  const hasAllowance = !needsApproval || (allowance !== undefined && allowance >= requiredAmount);

  const { writeContractAsync } = useWriteContract();
  const { sendTransactionAsync } = useSendTransaction();
  const { data: receipt, isLoading: isConfirming } = useWaitForTransactionReceipt({
    hash: txHash ?? undefined,
    query: { enabled: !!txHash },
  });

  useEffect(() => {
    if (receipt && swapStatus === "confirming") {
      if (receipt.status === "success") {
        if (txKind === "approve") {
          // approval confirmed — return to idle so user can sign the swap
          refreshBalance();
          queryClient.invalidateQueries({ queryKey: ["allowance"] });
          toast({
            title: "Approval confirmed",
            description: "You can now execute the swap.",
          });
          setSwapStatus("idle");
          setTxHash(null);
          setTxKind(null);
          return;
        }
        setSwapStatus("success");
        refreshBalance();
        toast({
          title: "Swap successful!",
          description: (
            <div className="flex flex-col gap-1">
              <span>Swapped {fromAmount} {fromToken} → ~{formatNumber(toAmount, 6)} {toToken}</span>
              <a
                href={`https://basescan.org/tx/${txHash}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-primary flex items-center gap-1 text-xs"
              >
                View on BaseScan <ExternalLink className="w-3 h-3" />
              </a>
            </div>
          ),
        });
        setFromAmount("");
        queryClient.invalidateQueries({ queryKey: ["/api/portfolio/holdings", { wallet: publicKey }] });
        queryClient.invalidateQueries({ queryKey: ["/api/portfolio/stats", { wallet: publicKey }] });
        queryClient.invalidateQueries({ queryKey: ["/api/activity", { wallet: publicKey }] });
        setTimeout(() => {
          setSwapStatus("idle");
          setTxHash(null);
          setTxKind(null);
        }, 5000);
      } else {
        setSwapStatus("error");
        setErrorMessage(txKind === "approve" ? "Approval reverted on-chain" : "Transaction reverted on-chain");
        setTimeout(() => {
          setSwapStatus("idle");
          setTxHash(null);
          setTxKind(null);
          setErrorMessage(null);
        }, 5000);
      }
    }
  }, [receipt, swapStatus, txKind]);

  const executeApprove = useCallback(async () => {
    if (!fromTokenData || !quote) return false;
    try {
      setSwapStatus("approving");
      const hash = await writeContractAsync({
        abi: erc20Abi,
        address: fromTokenData.address as `0x${string}`,
        functionName: "approve",
        args: [quote.to as `0x${string}`, maxUint256],
      });
      setTxHash(hash);
      setTxKind("approve");
      setSwapStatus("confirming");
      // wait one round; the user can press swap again after confirmation
      return true;
    } catch (e: any) {
      setSwapStatus("error");
      setErrorMessage(e?.shortMessage || e?.message || "Approval failed");
      setTimeout(() => {
        setSwapStatus("idle");
        setErrorMessage(null);
      }, 4000);
      return false;
    }
  }, [fromTokenData, quote, writeContractAsync]);

  const executeSwap = useCallback(async () => {
    if (!connected || !fromTokenData || !toTokenData || !address || !quote) {
      toast({
        title: "Cannot execute swap",
        description: "Connect wallet and wait for a fresh quote.",
        variant: "destructive",
      });
      return;
    }
    if (!isCorrectChain) {
      toast({ title: "Wrong network", description: "Switch to Base mainnet first.", variant: "destructive" });
      return;
    }
    if (!hasAllowance) {
      await executeApprove();
      return;
    }
    try {
      setErrorMessage(null);
      setSwapStatus("awaiting_signature");
      const hash = await sendTransactionAsync({
        to: quote.to as `0x${string}`,
        data: quote.data as `0x${string}`,
        value: BigInt(quote.value || "0"),
      });
      setTxHash(hash);
      setTxKind("swap");
      setSwapStatus("confirming");

      apiRequest("POST", "/api/swap", {
        walletAddress: address,
        fromToken: fromTokenData.address,
        toToken: toTokenData.address,
        fromAmount: parseFloat(fromAmount),
        toAmount,
        slippage: parseFloat(slippage),
        isPrivate: true,
        txSignature: hash,
        status: "confirmed",
      }).catch(() => undefined);
    } catch (e: any) {
      const msg = e?.shortMessage || e?.message || "Swap failed";
      setSwapStatus("error");
      setErrorMessage(msg.includes("User rejected") ? "Transaction was cancelled" : msg.slice(0, 120));
      toast({ title: "Swap failed", description: msg, variant: "destructive" });
      setTimeout(() => {
        setSwapStatus("idle");
        setErrorMessage(null);
      }, 5000);
    }
  }, [connected, fromTokenData, toTokenData, address, quote, hasAllowance, isCorrectChain, sendTransactionAsync, fromAmount, toAmount, slippage, executeApprove, toast]);

  const handleQueueForBatch = async () => {
    const amount = parseFloat(fromAmount);
    if (!connected || !fromTokenData || !toTokenData || !address || isNaN(amount) || amount <= 0) {
      toast({ title: "Cannot queue swap", description: "Enter a valid amount first", variant: "destructive" });
      return;
    }
    try {
      await apiRequest("POST", "/api/batched-actions", {
        walletAddress: address,
        actionType: "swap",
        description: `Swap ${fromAmount} ${fromToken} → ${toToken}`,
        amount,
        token: fromToken,
        metadata: {
          fromToken: fromTokenData.address,
          toToken: toTokenData.address,
          fromAmount: amount,
          toAmount,
          slippage: parseFloat(slippage),
        },
      });
      toast({ title: "Swap queued", description: "Added to the private batch queue" });
      setFromAmount("");
      queryClient.invalidateQueries({ queryKey: ["/api/batched-actions", { wallet: address }] });
    } catch {
      toast({ title: "Failed to queue swap", variant: "destructive" });
    }
  };

  const swapTokens = () => {
    const t = fromToken;
    setFromToken(toToken);
    setToToken(t);
    setFromAmount("");
  };

  const maxAmount = fromToken === "ETH" ? Math.max(0, ethBalance - 0.002) : 0;

  const getButton = () => {
    switch (swapStatus) {
      case "approving":
        return (<><RefreshCw className="w-5 h-5 animate-spin" /> Approving...</>);
      case "awaiting_signature":
        return (<><Wallet className="w-5 h-5 animate-pulse" /> Confirm in Wallet...</>);
      case "sending":
        return (<><RefreshCw className="w-5 h-5 animate-spin" /> Sending...</>);
      case "confirming":
        return (<><RefreshCw className="w-5 h-5 animate-spin" /> Confirming on Base...</>);
      case "success":
        return (<><CheckCircle className="w-5 h-5" /> Swap Successful!</>);
      case "error":
        return (<><XCircle className="w-5 h-5" /> Swap Failed</>);
      default:
        if (!hasAllowance) return (<><Shield className="w-5 h-5" /> Approve {fromToken}</>);
        return (<><Zap className="w-5 h-5" /> Swap Now</>);
    }
  };

  const isDisabled = !fromAmount || toAmount <= 0 || swapStatus !== "idle" || !quote || isLoadingQuote || isConfirming;

  return (
    <div className="p-6 max-w-lg mx-auto">
      <div className="mb-6">
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Private Swap</h1>
        <p className="text-muted-foreground">Trade tokens on Base · Best-route aggregation</p>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between gap-4 pb-4">
          <div className="flex items-center gap-2">
            <Shield className="w-5 h-5 text-primary" />
            <CardTitle className="text-lg">Swap</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" onClick={() => setShowSettings(!showSettings)} data-testid="button-swap-settings">
              <Settings className="w-4 h-4" />
            </Button>
            <Button variant="ghost" size="icon" onClick={() => refetchQuote()} disabled={isLoadingQuote} data-testid="button-refresh-prices">
              <RefreshCw className={`w-4 h-4 ${isLoadingQuote ? "animate-spin" : ""}`} />
            </Button>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <Collapsible open={showSettings}>
            <CollapsibleContent className="pb-4">
              <div className="p-4 bg-muted/50 rounded-md space-y-3">
                <div className="flex items-center justify-between">
                  <Label className="text-sm">Slippage Tolerance</Label>
                  <div className="flex items-center gap-2">
                    {["0.1", "0.5", "1.0"].map((val) => (
                      <Button key={val} variant={slippage === val ? "default" : "outline"} size="sm" onClick={() => setSlippage(val)} data-testid={`button-slippage-${val}`}>
                        {val}%
                      </Button>
                    ))}
                    <Input type="number" value={slippage} onChange={(e) => setSlippage(e.target.value)} className="w-16 h-8 text-center" data-testid="input-slippage-custom" />
                  </div>
                </div>
              </div>
            </CollapsibleContent>
          </Collapsible>

          {!connected ? (
            <div className="text-center py-8" data-testid="container-connect-wallet">
              <Wallet className="w-12 h-12 text-muted-foreground mx-auto mb-4" />
              <h3 className="text-lg font-medium mb-2">Connect Wallet</h3>
              <p className="text-muted-foreground text-sm">Connect on Base to start swapping</p>
            </div>
          ) : (
            <>
              <div className="space-y-2">
                <TokenSelector value={fromToken} onChange={setFromToken} excludeToken={toToken} label="From" />
                <div className="relative">
                  <Input
                    type="number"
                    placeholder="0.00"
                    value={fromAmount}
                    onChange={(e) => setFromAmount(e.target.value)}
                    className="h-16 text-2xl font-mono pr-20"
                    data-testid="input-from-amount"
                  />
                  {fromToken === "ETH" && maxAmount > 0 && (
                    <Button variant="ghost" size="sm" className="absolute right-2 top-1/2 -translate-y-1/2 text-xs" onClick={() => setFromAmount(maxAmount.toString())} data-testid="button-max-amount">
                      MAX
                    </Button>
                  )}
                </div>
                {fromToken === "ETH" && (
                  <p className="text-xs text-muted-foreground">Balance: {ethBalance.toFixed(4)} ETH</p>
                )}
              </div>

              <div className="flex justify-center">
                <Button variant="outline" size="icon" className="rounded-full" onClick={swapTokens} data-testid="button-swap-direction">
                  <ArrowDown className="w-4 h-4" />
                </Button>
              </div>

              <div className="space-y-2">
                <TokenSelector value={toToken} onChange={setToToken} excludeToken={fromToken} label="To" />
                <div className="h-16 bg-muted/50 rounded-md flex items-center justify-between px-4">
                  {isLoadingQuote && parseFloat(fromAmount) > 0 ? (
                    <div className="flex items-center gap-2">
                      <Skeleton className="h-8 w-24" />
                      <span className="text-xs text-muted-foreground">Getting quote...</span>
                    </div>
                  ) : (
                    <span className="text-2xl font-mono text-muted-foreground" data-testid="text-to-amount">
                      {toAmount > 0 ? formatNumber(toAmount, 6) : "0.00"}
                    </span>
                  )}
                  {quote && (
                    <Badge variant="outline" className="text-xs gap-1">
                      <Zap className="w-3 h-3" />
                      {quote.router || "Aggregator"}
                    </Badge>
                  )}
                </div>
                {minOut > 0 && (
                  <p className="text-xs text-muted-foreground">Min received: {formatNumber(minOut, 6)} {toToken}</p>
                )}
              </div>

              {quoteError && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  Failed to get quote. Try a different amount.
                </div>
              )}

              {errorMessage && (
                <div className="p-3 bg-destructive/10 border border-destructive/20 rounded-md flex items-center gap-2 text-sm text-destructive">
                  <AlertTriangle className="w-4 h-4" />
                  {errorMessage}
                </div>
              )}

              {quote && (
                <div className="space-y-2 pt-3 border-t text-xs text-muted-foreground">
                  <div className="flex justify-between">
                    <span>Rate</span>
                    <span className="font-mono">
                      1 {fromToken} = {formatNumber(toAmount / Math.max(parseFloat(fromAmount || "0"), 1e-9), 6)} {toToken}
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> Est. Gas</span>
                    <span className="font-mono">
                      {quote.estimatedGas ? formatUnits(BigInt(quote.estimatedGas) * BigInt(quote.gasPrice || "0"), 18).slice(0, 8) : "—"} ETH
                    </span>
                  </div>
                  <div className="flex justify-between">
                    <span className="flex items-center gap-1"><Shield className="w-3 h-3 text-primary" /> Privacy Batch</span>
                    <Badge variant="outline" className="text-[10px]">~2 min</Badge>
                  </div>
                </div>
              )}

              <div className="grid grid-cols-2 gap-2 pt-2">
                <Button variant="outline" onClick={handleQueueForBatch} disabled={!fromAmount || !quote || isLoadingQuote} data-testid="button-queue-batch">
                  <Clock className="w-4 h-4 mr-2" /> Queue Private
                </Button>
                <Button onClick={executeSwap} disabled={isDisabled} className="gap-2" data-testid="button-execute-swap">
                  {getButton()}
                </Button>
              </div>
            </>
          )}
        </CardContent>
      </Card>
    </div>
  );
}

import { ConnectKitButton } from "connectkit";
import { Copy, ExternalLink, AlertTriangle, LogOut, Wallet } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useWalletContext } from "@/components/wallet-provider";
import { useToast } from "@/hooks/use-toast";
import { useSwitchChain } from "wagmi";
import { BASE_CHAIN_ID } from "@/lib/wagmi";

function truncate(a: string) {
  return `${a.slice(0, 6)}...${a.slice(-4)}`;
}

const baseBtn =
  "uppercase text-[11px] tracking-wider font-mono font-bold px-3 py-1.5 border transition-colors inline-flex items-center gap-2";

export function WalletButton() {
  const { ethBalance, isCorrectChain } = useWalletContext();
  const { toast } = useToast();
  const { switchChain } = useSwitchChain();

  return (
    <ConnectKitButton.Custom>
      {({ isConnected, isConnecting, show, address }) => {
        if (!isConnected || !address) {
          return (
            <button
              type="button"
              onClick={show}
              disabled={isConnecting}
              className={`${baseBtn} border-white text-white bg-black hover:bg-white hover:text-black disabled:opacity-50`}
              data-testid="button-connect-wallet"
            >
              <span className="text-[#22c55e]">&gt;</span>
              {isConnecting ? "CONNECTING..." : "CONNECT_WALLET"}
            </button>
          );
        }

        if (!isCorrectChain) {
          return (
            <button
              type="button"
              onClick={() => switchChain({ chainId: BASE_CHAIN_ID })}
              className={`${baseBtn} border-[#f59e0b] text-[#f59e0b] hover:bg-[#f59e0b] hover:text-black`}
              data-testid="button-switch-chain"
            >
              <AlertTriangle className="h-3 w-3" />
              SWITCH_TO_BASE
            </button>
          );
        }

        const copyAddress = () => {
          navigator.clipboard.writeText(address);
          toast({ title: "ADDRESS_COPIED", description: truncate(address) });
        };
        const openExplorer = () => {
          window.open(`https://basescan.org/address/${address}`, "_blank");
        };

        return (
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <button
                type="button"
                className={`${baseBtn} border-[#333] text-white bg-black hover:bg-[#0a0a0a]`}
                data-testid="button-wallet-menu"
              >
                <span className="w-1.5 h-1.5 bg-[#22c55e] animate-term-blink" />
                <span>{truncate(address)}</span>
                <span className="text-[#6b7280] tabular-nums">
                  {ethBalance < 0.0001 ? ethBalance.toFixed(6) : ethBalance.toFixed(4)} ETH
                </span>
              </button>
            </DropdownMenuTrigger>
            <DropdownMenuContent
              align="end"
              className="w-56 bg-black border border-[#333] font-mono text-xs uppercase p-0"
            >
              <DropdownMenuItem onClick={copyAddress} data-testid="button-copy-address" className="rounded-none">
                <Copy className="h-3 w-3 mr-2" />
                COPY_ADDRESS
              </DropdownMenuItem>
              <DropdownMenuItem onClick={openExplorer} data-testid="button-view-explorer" className="rounded-none">
                <ExternalLink className="h-3 w-3 mr-2" />
                VIEW_ON_BASESCAN
              </DropdownMenuItem>
              <DropdownMenuSeparator className="bg-[#333]" />
              <DropdownMenuItem onClick={show} data-testid="button-wallet-info" className="rounded-none">
                <Wallet className="h-3 w-3 mr-2" />
                WALLET_INFO
              </DropdownMenuItem>
              <DropdownMenuItem
                onClick={() => show?.()}
                data-testid="button-disconnect"
                className="rounded-none text-[#ef4444]"
              >
                <LogOut className="h-3 w-3 mr-2" />
                MANAGE / DISCONNECT
              </DropdownMenuItem>
            </DropdownMenuContent>
          </DropdownMenu>
        );
      }}
    </ConnectKitButton.Custom>
  );
}

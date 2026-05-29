import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Send, Construction, ExternalLink } from "lucide-react";

export default function StealthPage() {
  return (
    <div className="p-6 max-w-3xl mx-auto space-y-6">
      <div>
        <h1 className="text-3xl font-bold" data-testid="text-page-title">Stealth Pay</h1>
        <p className="text-muted-foreground">Anonymous on-chain payments via stealth addresses</p>
      </div>

      <Card className="border-amber-500/30 bg-amber-500/5">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Construction className="w-5 h-5 text-amber-400" />
            <CardTitle>Coming Soon on Base</CardTitle>
          </div>
          <CardDescription>
            Stealth payments are being re-implemented for Base using ERC-5564 stealth addresses
            (compatible with Umbra-style flows). The previous Solana light-protocol implementation
            does not apply on EVM.
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            <div className="p-4 rounded-lg border bg-background/40">
              <Send className="w-5 h-5 text-fuchsia-400 mb-2" />
              <div className="text-sm font-semibold">One-time addresses</div>
              <div className="text-xs text-muted-foreground">Sender generates a fresh recipient address per payment.</div>
            </div>
            <div className="p-4 rounded-lg border bg-background/40">
              <Badge variant="outline" className="mb-2 text-[10px]">ERC-5564</Badge>
              <div className="text-sm font-semibold">Standard compliant</div>
              <div className="text-xs text-muted-foreground">Uses the audited stealth-address EIP shared with Umbra.</div>
            </div>
            <div className="p-4 rounded-lg border bg-background/40">
              <Badge variant="outline" className="mb-2 text-[10px] bg-[#0052FF]/10 text-[#0052FF] border-[#0052FF]/30">Base</Badge>
              <div className="text-sm font-semibold">Cheap to claim</div>
              <div className="text-xs text-muted-foreground">L2 gas keeps stealth claims affordable.</div>
            </div>
          </div>
          <Button asChild variant="outline" className="gap-2">
            <a href="https://eips.ethereum.org/EIPS/eip-5564" target="_blank" rel="noopener noreferrer">
              Read ERC-5564 spec <ExternalLink className="w-4 h-4" />
            </a>
          </Button>
        </CardContent>
      </Card>
    </div>
  );
}

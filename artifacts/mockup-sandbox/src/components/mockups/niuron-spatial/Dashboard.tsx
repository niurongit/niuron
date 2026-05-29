import React from "react";
import { ArrowRightLeft, Shield, LineChart, Activity, Fingerprint, Layers, ChevronDown, Plus, Send, Zap, Lock, Settings } from "lucide-react";
import "./_group.css";

export function Dashboard() {
  return (
    <div className="spatial-vault-theme">
      {/* Background Ambience */}
      <div className="spatial-bg" />
      <div className="spatial-radial-lines" />
      
      {/* Orbit Rings */}
      <div className="orbit-ring" style={{ width: "600px", height: "600px" }} />
      <div className="orbit-ring" style={{ width: "900px", height: "900px", borderStyle: "dotted", opacity: 0.5 }} />
      <div className="orbit-ring" style={{ width: "1200px", height: "1200px", borderColor: "rgba(140, 150, 255, 0.1)" }} />

      {/* Top Left: Navigation Constellation */}
      <div className="absolute top-10 left-10 z-20 flex gap-6 text-sm tracking-wide text-[#8A8B9C]">
        <div className="flex items-center gap-2 text-[#F0F0F5] cursor-pointer hover:text-white transition-colors">
          <div className="w-1.5 h-1.5 rounded-full bg-[#8C96FF] shadow-[0_0_8px_#8C96FF]"></div>
          Vault
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-[#F0F0F5] transition-colors">
          <div className="w-1 h-1 rounded-full bg-[#8A8B9C]"></div>
          Multisig
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-[#F0F0F5] transition-colors">
          <div className="w-1 h-1 rounded-full bg-[#8A8B9C]"></div>
          Zk-Proofs
        </div>
        <div className="flex items-center gap-2 cursor-pointer hover:text-[#F0F0F5] transition-colors">
          <div className="w-1 h-1 rounded-full bg-[#8A8B9C]"></div>
          Ledger
        </div>
      </div>

      {/* Top Right: Identity / Wallet */}
      <div className="absolute top-10 right-10 z-20">
        <div className="spatial-panel p-2 pl-4 pr-3 flex items-center gap-4 !static !transform-none !border-white/10 hover:!border-[rgba(140,150,255,0.3)]">
          <div className="flex flex-col">
            <span className="text-xs text-[#8A8B9C] uppercase tracking-widest mb-0.5">Identity</span>
            <span className="text-sm font-mono tracking-tight text-[#F0F0F5]">0x7Fb...9A21</span>
          </div>
          <div className="h-8 w-px bg-white/10"></div>
          <div className="flex items-center gap-2 text-sm text-[#8A8B9C]">
            <div className="w-2 h-2 rounded-full bg-blue-500 shadow-[0_0_8px_rgba(59,130,246,0.5)]"></div>
            Base
          </div>
          <ChevronDown className="w-4 h-4 text-[#8A8B9C]" />
        </div>
      </div>

      {/* Center Core: Portfolio */}
      <div className="spatial-core" style={{ width: "380px", height: "380px" }}>
        <div className="text-center">
          <h2 className="spatial-heading text-2xl text-[#8A8B9C] mb-2 tracking-wide italic">Net Worth</h2>
          <div className="font-mono text-5xl tracking-tighter text-white mb-2 tabular-nums">
            $142,854.20
          </div>
          <div className="text-sm text-emerald-400 font-mono flex items-center justify-center gap-1">
            <Plus className="w-3 h-3" /> $3,240.50 (2.3%) 24h
          </div>
        </div>

        <div className="mt-8 w-full px-10 space-y-3">
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8A8B9C]">ETH</span>
            <span className="font-mono text-[#F0F0F5]">14.50 <span className="text-[#8A8B9C] text-xs">($49,300)</span></span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8A8B9C]">USDC</span>
            <span className="font-mono text-[#F0F0F5]">65,200.00 <span className="text-[#8A8B9C] text-xs">($65,200)</span></span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8A8B9C]">cbETH</span>
            <span className="font-mono text-[#F0F0F5]">4.20 <span className="text-[#8A8B9C] text-xs">($14,800)</span></span>
          </div>
          <div className="flex justify-between items-center text-sm">
            <span className="text-[#8A8B9C]">wstETH</span>
            <span className="font-mono text-[#F0F0F5]">3.85 <span className="text-[#8A8B9C] text-xs">($13,554)</span></span>
          </div>
        </div>
      </div>

      {/* Station 1: Swap (Top Left Orbit) */}
      <div className="spatial-panel p-6" style={{ top: "20%", left: "15%", width: "340px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <ArrowRightLeft className="w-4 h-4 text-[#8C96FF]" />
          </div>
          <h3 className="spatial-heading text-xl text-white">Private Swap</h3>
        </div>
        
        <div className="space-y-4">
          <div className="p-3 rounded-xl bg-black/40 border border-white/5 relative">
            <div className="text-xs text-[#8A8B9C] mb-1">Pay</div>
            <div className="flex justify-between items-center">
              <input type="text" className="bg-transparent font-mono text-2xl w-32 outline-none text-white tabular-nums" defaultValue="5,000" />
              <div className="flex items-center gap-2 spatial-button px-3 py-1 rounded-full text-sm cursor-pointer">
                USDC <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="text-xs text-[#8A8B9C] mt-2 font-mono">Bal: 65,200.00</div>
          </div>

          <div className="absolute left-1/2 top-[47%] -translate-x-1/2 -translate-y-1/2 z-10 w-8 h-8 rounded-full bg-[#0A0A1F] border border-white/10 flex items-center justify-center cursor-pointer hover:bg-white/5">
            <ArrowRightLeft className="w-3 h-3 text-[#8A8B9C] rotate-90" />
          </div>

          <div className="p-3 rounded-xl bg-black/40 border border-white/5">
            <div className="text-xs text-[#8A8B9C] mb-1">Receive</div>
            <div className="flex justify-between items-center">
              <input type="text" className="bg-transparent font-mono text-2xl w-32 outline-none text-white tabular-nums" defaultValue="1.468" readOnly />
              <div className="flex items-center gap-2 spatial-button px-3 py-1 rounded-full text-sm cursor-pointer">
                ETH <ChevronDown className="w-3 h-3" />
              </div>
            </div>
            <div className="text-xs text-[#8A8B9C] mt-2 flex justify-between">
              <span>Route: OpenOcean (Private)</span>
              <span className="font-mono">1 ETH = 3,405.99 USDC</span>
            </div>
          </div>

          <button className="w-full spatial-button-primary py-3 rounded-xl font-medium tracking-wide text-sm flex items-center justify-center gap-2">
            <Lock className="w-4 h-4" />
            Execute Stealth Swap
          </button>
        </div>
      </div>

      {/* Station 2: Yield (Top Right Orbit) */}
      <div className="spatial-panel p-6" style={{ top: "25%", right: "12%", width: "320px" }}>
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-lg bg-white/5 border border-white/10">
              <Zap className="w-4 h-4 text-emerald-400" />
            </div>
            <h3 className="spatial-heading text-xl text-white">Yield Engine</h3>
          </div>
          <div className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2 py-1 rounded-full border border-emerald-400/20">
            4.2% APY
          </div>
        </div>

        <div className="space-y-5">
          <div>
            <div className="text-sm text-[#8A8B9C] mb-1">Supplied (Aave V3 Base)</div>
            <div className="text-2xl font-mono text-white tabular-nums">40,000.00 <span className="text-sm text-[#8A8B9C]">USDC</span></div>
          </div>

          <div>
            <div className="text-sm text-[#8A8B9C] mb-1">Accrued Earnings</div>
            <div className="text-xl font-mono text-emerald-400 tabular-nums">+$142.50</div>
          </div>

          <div className="flex gap-3">
            <button className="flex-1 spatial-button py-2 rounded-lg text-sm font-medium">Supply</button>
            <button className="flex-1 spatial-button py-2 rounded-lg text-sm font-medium">Withdraw</button>
          </div>
        </div>
      </div>

      {/* Station 3: Privacy (Bottom Left Orbit) */}
      <div className="spatial-panel p-6" style={{ bottom: "15%", left: "18%", width: "340px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Shield className="w-4 h-4 text-purple-400" />
          </div>
          <h3 className="spatial-heading text-xl text-white">Privacy Status</h3>
        </div>

        <div className="space-y-4">
          <div className="flex items-center justify-between p-3 rounded-lg bg-white/5 border border-white/5">
            <div className="flex items-center gap-3">
              <Fingerprint className="w-4 h-4 text-[#8A8B9C]" />
              <span className="text-sm">Stealth Routing</span>
            </div>
            <div className="w-10 h-5 bg-purple-500/20 rounded-full relative border border-purple-500/30 cursor-pointer shadow-[0_0_10px_rgba(168,85,247,0.2)]">
              <div className="absolute right-1 top-1 w-3 h-3 bg-purple-400 rounded-full"></div>
            </div>
          </div>

          <div className="p-3 rounded-lg bg-black/40 border border-white/5 space-y-3">
            <div className="flex justify-between text-sm">
              <span className="text-[#8A8B9C]">zk-Proof Status</span>
              <span className="text-emerald-400 flex items-center gap-1"><div className="w-1.5 h-1.5 rounded-full bg-emerald-400"></div> Valid</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8A8B9C]">Anonymity Set</span>
              <span className="font-mono text-white tabular-nums">14,205</span>
            </div>
            <div className="flex justify-between text-sm">
              <span className="text-[#8A8B9C]">Next Rotation</span>
              <span className="font-mono text-white tabular-nums">02:14:00</span>
            </div>
          </div>
        </div>
      </div>

      {/* Station 4: Activity (Bottom Right Orbit) */}
      <div className="spatial-panel p-6" style={{ bottom: "12%", right: "15%", width: "360px" }}>
        <div className="flex items-center gap-3 mb-6">
          <div className="p-2 rounded-lg bg-white/5 border border-white/10">
            <Activity className="w-4 h-4 text-[#8A8B9C]" />
          </div>
          <h3 className="spatial-heading text-xl text-white">Recent Telemetry</h3>
        </div>

        <div className="space-y-4">
          <div className="flex gap-4">
            <div className="mt-1"><ArrowRightLeft className="w-3.5 h-3.5 text-[#8A8B9C]" /></div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">Swapped USDC for ETH</span>
                <span className="text-[#8A8B9C] text-xs font-mono">2m ago</span>
              </div>
              <div className="text-xs font-mono text-[#8C96FF]">Tx: 0x8a9...b4f2</div>
            </div>
          </div>
          
          <div className="h-px bg-white/5 w-full"></div>

          <div className="flex gap-4">
            <div className="mt-1"><Zap className="w-3.5 h-3.5 text-[#8A8B9C]" /></div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">Supplied USDC to Aave</span>
                <span className="text-[#8A8B9C] text-xs font-mono">1h ago</span>
              </div>
              <div className="text-xs font-mono text-[#8C96FF]">Tx: 0x11c...9d01</div>
            </div>
          </div>

          <div className="h-px bg-white/5 w-full"></div>

          <div className="flex gap-4 opacity-60">
            <div className="mt-1"><Shield className="w-3.5 h-3.5 text-[#8A8B9C]" /></div>
            <div className="flex-1">
              <div className="flex justify-between text-sm mb-1">
                <span className="text-white">zk-Proof Generated</span>
                <span className="text-[#8A8B9C] text-xs font-mono">5h ago</span>
              </div>
              <div className="text-xs font-mono text-[#8A8B9C]">Local verification</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

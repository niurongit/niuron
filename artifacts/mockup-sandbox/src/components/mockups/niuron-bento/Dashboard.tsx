import React, { useState } from "react";
import { 
  Briefcase, 
  ArrowRightLeft, 
  TrendingUp, 
  Shield, 
  Users, 
  BarChart3, 
  FileText, 
  Lock, 
  LogOut,
  ChevronDown,
  ArrowRight,
  Activity,
  Zap
} from "lucide-react";
import "./_group.css";

const MOCK_DATA = {
  portfolio: {
    total: "$124,592.40",
    delta: "+$1,240.50 (1.01%)",
    assets: [
      { symbol: "USDC", balance: "45,000.00", value: "$45,000.00", share: 36 },
      { symbol: "ETH", balance: "18.45", value: "$62,730.00", share: 50 },
      { symbol: "cbETH", balance: "2.10", value: "$7,350.00", share: 6 },
      { symbol: "wstETH", balance: "2.50", value: "$9,512.40", share: 8 },
    ]
  },
  yield: {
    protocol: "Aave V3",
    supplied: "$45,000.00",
    asset: "USDC",
    apy: "4.24%",
    accrued: "+$12.40"
  },
  privacy: {
    anonymitySet: 124,
    status: "Active",
    recentProofs: 3
  },
  activity: [
    { type: "Swap", desc: "10,000 USDC → 2.94 ETH", time: "2h ago", hash: "0x8fa...4b2" },
    { type: "Supply", desc: "Added 25,000 USDC to Aave", time: "5h ago", hash: "0x2c1...9f0" },
    { type: "Stealth", desc: "Received via stealth address", time: "1d ago", hash: "0x9ed...1a7" },
  ]
};

export function Dashboard() {
  const [navHovered, setNavHovered] = useState(false);

  return (
    <div className="bento-root text-[var(--bento-text)]">
      <div className="bento-noise" />

      {/* Slim Contextual Side Rail */}
      <nav 
        className="w-20 hover:w-64 transition-all duration-400 ease-in-out bg-[var(--bento-tile)] border-r border-[var(--bento-border)] flex flex-col justify-between py-8 z-10 sticky top-0 h-screen overflow-hidden group"
        onMouseEnter={() => setNavHovered(true)}
        onMouseLeave={() => setNavHovered(false)}
      >
        <div className="px-6 flex flex-col gap-10">
          <div className="flex items-center gap-4 text-[var(--bento-text)] whitespace-nowrap">
            <div className="w-8 h-8 rounded-full bg-[var(--bento-text)] flex-shrink-0 flex items-center justify-center">
              <span className="text-white font-medium bento-heading text-sm">N</span>
            </div>
            <span className="bento-heading text-xl font-medium tracking-tight opacity-0 group-hover:opacity-100 transition-opacity duration-300">Niuron</span>
          </div>

          <div className="flex flex-col gap-4">
            <NavItem icon={<Briefcase size={20} />} label="Portfolio" active />
            <NavItem icon={<ArrowRightLeft size={20} />} label="Swap" />
            <NavItem icon={<TrendingUp size={20} />} label="Yield" />
            <NavItem icon={<Shield size={20} />} label="Privacy" />
            <NavItem icon={<Users size={20} />} label="Multisig" />
            <NavItem icon={<BarChart3 size={20} />} label="Analytics" />
            <NavItem icon={<FileText size={20} />} label="Compliance" />
          </div>
        </div>

        <div className="px-6 flex flex-col gap-4">
          <NavItem icon={<Lock size={20} />} label="zkSNARK" />
          <NavItem icon={<LogOut size={20} />} label="Disconnect" />
        </div>
      </nav>

      {/* Main Content */}
      <main className="flex-1 p-8 lg:p-12 overflow-y-auto max-h-screen">
        <div className="max-w-[1200px] mx-auto flex flex-col gap-8">
          
          {/* Top Header */}
          <header className="flex items-center justify-between">
            <h1 className="bento-heading text-4xl font-medium text-[var(--bento-text)]">Good morning.</h1>
            <div className="flex items-center gap-3 bg-[var(--bento-tile)] border border-[var(--bento-border)] px-4 py-2 rounded-full shadow-sm">
              <div className="w-2 h-2 rounded-full bg-blue-500" />
              <span className="text-sm font-medium">Base</span>
              <span className="text-[var(--bento-border)]">|</span>
              <span className="text-sm font-medium text-[var(--bento-text-muted)]">0x7Fb...4A2</span>
              <ChevronDown size={14} className="text-[var(--bento-text-muted)] ml-1" />
            </div>
          </header>

          {/* Bento Grid */}
          <div className="grid grid-cols-12 auto-rows-[140px] gap-6">
            
            {/* Portfolio Overview (Large Tile) */}
            <div className="col-span-12 lg:col-span-8 row-span-3 bento-tile rounded-3xl p-8 flex flex-col">
              <div className="flex justify-between items-start mb-8">
                <div>
                  <h2 className="text-sm font-medium text-[var(--bento-text-muted)] uppercase tracking-wider mb-2">Net Worth</h2>
                  <div className="bento-heading text-6xl font-medium mb-2">{MOCK_DATA.portfolio.total}</div>
                  <div className="text-[var(--bento-accent-green)] text-sm font-medium">{MOCK_DATA.portfolio.delta}</div>
                </div>
                <button className="text-xs font-medium border border-[var(--bento-border)] px-4 py-2 rounded-full hover:bg-[var(--bento-bg)] transition-colors">
                  View Full Ledger
                </button>
              </div>

              <div className="flex-1">
                <div className="grid grid-cols-4 gap-4 text-xs font-medium text-[var(--bento-text-muted)] pb-3 border-b border-[var(--bento-border)] mb-4">
                  <div className="col-span-1">Asset</div>
                  <div className="col-span-1 text-right">Balance</div>
                  <div className="col-span-1 text-right">Value</div>
                  <div className="col-span-1 text-right">Allocation</div>
                </div>
                <div className="flex flex-col gap-3">
                  {MOCK_DATA.portfolio.assets.map((asset) => (
                    <div key={asset.symbol} className="grid grid-cols-4 gap-4 items-center text-sm">
                      <div className="col-span-1 font-medium">{asset.symbol}</div>
                      <div className="col-span-1 text-right">{asset.balance}</div>
                      <div className="col-span-1 text-right">{asset.value}</div>
                      <div className="col-span-1 flex items-center justify-end gap-2">
                        <span>{asset.share}%</span>
                        <div className="w-16 h-1.5 bg-[var(--bento-bg)] rounded-full overflow-hidden">
                          <div 
                            className="h-full bg-[var(--bento-text)] rounded-full" 
                            style={{ width: `${asset.share}%` }}
                          />
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Privacy Panel (Medium Tile) */}
            <div className="col-span-12 lg:col-span-4 row-span-2 bento-tile rounded-3xl p-8 bg-[#1A1A18] text-[#F7F4EE] relative overflow-hidden flex flex-col justify-between">
              {/* Decorative elements */}
              <div className="absolute -top-12 -right-12 w-48 h-48 bg-white/5 rounded-full blur-2xl" />
              
              <div className="relative z-10 flex justify-between items-start">
                <Shield size={24} className="text-[var(--bento-bg)] opacity-80" />
                <div className="flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full backdrop-blur-sm">
                  <div className="w-1.5 h-1.5 rounded-full bg-[var(--bento-accent-green)]" />
                  <span className="text-xs font-medium tracking-wide">STEALTH ACTIVE</span>
                </div>
              </div>

              <div className="relative z-10">
                <h3 className="bento-heading text-2xl font-medium mb-1">Privacy Shield</h3>
                <p className="text-sm opacity-60 mb-6 font-light">Your routing path is fully obfuscated.</p>
                
                <div className="grid grid-cols-2 gap-4">
                  <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="text-xs opacity-50 mb-1">Anonymity Set</div>
                    <div className="bento-heading text-xl">{MOCK_DATA.privacy.anonymitySet}</div>
                  </div>
                  <div className="bg-white/5 p-4 rounded-2xl backdrop-blur-sm border border-white/5">
                    <div className="text-xs opacity-50 mb-1">zk-Proofs</div>
                    <div className="bento-heading text-xl">{MOCK_DATA.privacy.recentProofs}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Swap Surface (Tall Tile) */}
            <div className="col-span-12 lg:col-span-4 row-span-3 bento-tile rounded-3xl p-8 flex flex-col justify-between relative overflow-hidden">
              <div className="absolute top-0 right-0 p-8 opacity-5">
                <ArrowRightLeft size={120} strokeWidth={1} />
              </div>
              
              <div>
                <h3 className="bento-heading text-2xl font-medium mb-6">Swap</h3>
                
                <div className="flex flex-col gap-4 relative">
                  <div className="bg-[var(--bento-bg)] p-4 rounded-2xl border border-[var(--bento-border)]">
                    <div className="flex justify-between text-xs font-medium text-[var(--bento-text-muted)] mb-2">
                      <span>Pay</span>
                      <span>Balance: 45,000.00</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <input type="text" value="10,000" readOnly className="bg-transparent text-2xl font-medium outline-none w-1/2 bento-heading" />
                      <div className="bg-white px-3 py-1.5 rounded-full border border-[var(--bento-border)] text-sm font-medium flex items-center gap-1 shadow-sm">
                        USDC <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>

                  <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-10 h-10 bg-white border border-[var(--bento-border)] rounded-full flex items-center justify-center shadow-sm z-10 hover:bg-[var(--bento-bg)] cursor-pointer transition-colors">
                    <ArrowRightLeft size={16} className="text-[var(--bento-text-muted)] rotate-90" />
                  </div>

                  <div className="bg-[var(--bento-bg)] p-4 rounded-2xl border border-[var(--bento-border)]">
                    <div className="flex justify-between text-xs font-medium text-[var(--bento-text-muted)] mb-2">
                      <span>Receive</span>
                      <span>Balance: 18.45</span>
                    </div>
                    <div className="flex justify-between items-center">
                      <input type="text" value="2.941" readOnly className="bg-transparent text-2xl font-medium outline-none w-1/2 bento-heading text-[var(--bento-accent-green)]" />
                      <div className="bg-white px-3 py-1.5 rounded-full border border-[var(--bento-border)] text-sm font-medium flex items-center gap-1 shadow-sm">
                        ETH <ChevronDown size={14} />
                      </div>
                    </div>
                  </div>
                </div>

                <div className="mt-4 px-2 flex justify-between text-xs font-medium text-[var(--bento-text-muted)]">
                  <span className="flex items-center gap-1">Route <ArrowRight size={10}/> OpenOcean</span>
                  <span>1 ETH = $3,400.00</span>
                </div>
              </div>

              <button className="w-full bg-[var(--bento-text)] text-white py-4 rounded-full font-medium mt-6 shadow-md hover:bg-[#2A2A28] transition-colors">
                Review Swap
              </button>
            </div>

            {/* Yield Surface (Medium Tile) */}
            <div className="col-span-12 lg:col-span-4 row-span-2 bento-tile rounded-3xl p-8 flex flex-col justify-between bg-[#F2EDE4]">
              <div>
                <div className="flex justify-between items-start mb-6">
                  <h3 className="bento-heading text-2xl font-medium">Yield</h3>
                  <div className="bg-white border border-[var(--bento-border)] px-3 py-1 rounded-full text-xs font-medium flex items-center gap-1.5">
                    <Zap size={12} className="text-[var(--bento-accent-terra)]" /> {MOCK_DATA.yield.protocol}
                  </div>
                </div>
                
                <div className="mb-4">
                  <div className="text-sm font-medium text-[var(--bento-text-muted)] mb-1">Supplied Position</div>
                  <div className="flex items-end gap-2">
                    <span className="bento-heading text-3xl font-medium">{MOCK_DATA.yield.supplied}</span>
                    <span className="text-sm font-medium pb-1">USDC</span>
                  </div>
                </div>

                <div className="flex items-center gap-6">
                  <div>
                    <div className="text-xs font-medium text-[var(--bento-text-muted)] mb-1">Current APY</div>
                    <div className="text-lg font-medium text-[var(--bento-accent-green)]">{MOCK_DATA.yield.apy}</div>
                  </div>
                  <div>
                    <div className="text-xs font-medium text-[var(--bento-text-muted)] mb-1">Accrued</div>
                    <div className="text-lg font-medium">{MOCK_DATA.yield.accrued}</div>
                  </div>
                </div>
              </div>
            </div>

            {/* Recent Activity (Medium/Wide Tile) */}
            <div className="col-span-12 lg:col-span-4 row-span-2 bento-tile rounded-3xl p-8 flex flex-col">
              <div className="flex justify-between items-center mb-6">
                <h3 className="bento-heading text-xl font-medium flex items-center gap-2">
                  <Activity size={18} />
                  Ledger
                </h3>
                <span className="text-xs font-medium text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] cursor-pointer transition-colors">See all</span>
              </div>
              
              <div className="flex flex-col gap-4 flex-1 justify-center">
                {MOCK_DATA.activity.map((item, i) => (
                  <div key={i} className="flex justify-between items-center">
                    <div>
                      <div className="text-sm font-medium mb-0.5">{item.desc}</div>
                      <div className="text-xs text-[var(--bento-text-muted)] font-medium">{item.time} &middot; {item.hash}</div>
                    </div>
                    <div className="bg-[var(--bento-bg)] text-[var(--bento-text-muted)] text-[10px] uppercase font-bold tracking-wider px-2 py-1 rounded-md">
                      {item.type}
                    </div>
                  </div>
                ))}
              </div>
            </div>

          </div>
        </div>
      </main>
    </div>
  );
}

// Helper components
function NavItem({ icon, label, active = false }: { icon: React.ReactNode, label: string, active?: boolean }) {
  return (
    <div className={`flex items-center gap-4 px-2 py-2 rounded-xl cursor-pointer transition-all duration-300 whitespace-nowrap ${active ? 'bg-[var(--bento-bg)] text-[var(--bento-text)]' : 'text-[var(--bento-text-muted)] hover:text-[var(--bento-text)] hover:bg-[var(--bento-bg)]'}`}>
      <div className="flex-shrink-0 w-8 flex justify-center">{icon}</div>
      <span className="text-sm font-medium opacity-0 group-hover:opacity-100 transition-opacity duration-300">{label}</span>
    </div>
  );
}

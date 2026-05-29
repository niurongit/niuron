import React from 'react';
import './_group.css';

export function Dashboard() {
  return (
    <div className="terminal-theme min-h-screen w-full flex flex-col uppercase text-xs sm:text-sm selection:bg-white selection:text-black">
      {/* Ticker */}
      <div className="border-b border-[#333] flex items-center px-4 py-1.5 whitespace-nowrap overflow-hidden text-[#6b7280]">
        <span className="text-white font-bold mr-4">NIURON_SYS</span>
        <span className="mr-8">ETH/USD 3402.15 <span className="text-[#22c55e]">+1.2%</span></span>
        <span className="mr-8">USDC/USD 1.00 <span className="text-[#f59e0b]">0.0%</span></span>
        <span className="mr-8">CBETH/USD 3540.21 <span className="text-[#22c55e]">+1.1%</span></span>
        <span className="mr-8">WSTETH/USD 3980.55 <span className="text-[#22c55e]">+1.3%</span></span>
        <span className="mr-8">NETWORK: BASE_MAINNET</span>
        <span className="mr-8">BLOCK: 14590212</span>
        <span className="mr-8">GAS: 0.001 GWEI</span>
      </div>

      {/* Main Content */}
      <div className="flex-1 grid grid-cols-12 gap-px bg-[#333] border-b border-[#333]">
        {/* Left Col - Portfolio & Activity */}
        <div className="col-span-12 lg:col-span-8 bg-black flex flex-col gap-px">
          {/* Portfolio */}
          <div className="flex-1 bg-black p-4 flex flex-col border-b border-[#333]">
            <div className="mb-4 text-[#6b7280] flex justify-between items-center">
              <span>[PORTFOLIO::ASSETS]</span>
              <span>ID: 0x7Fb...9a2C</span>
            </div>
            
            <div className="mb-8">
              <div className="text-[#6b7280] mb-1">TOTAL_NET_WORTH</div>
              <div className="text-4xl sm:text-5xl font-bold text-white tracking-tight">$142,850.22</div>
              <div className="text-[#22c55e] mt-1">+ $2,450.00 (24H)</div>
            </div>

            <div className="w-full">
              <table className="w-full text-left">
                <thead>
                  <tr className="text-[#6b7280] border-b border-[#333]">
                    <th className="font-normal py-2 px-2">ASSET</th>
                    <th className="font-normal py-2 px-2 text-right">BALANCE</th>
                    <th className="font-normal py-2 px-2 text-right">VALUE_USD</th>
                    <th className="font-normal py-2 px-2 text-right">ALLOC</th>
                  </tr>
                </thead>
                <tbody>
                  <tr className="border-b border-[#333] hover:bg-[#111] transition-colors cursor-pointer">
                    <td className="py-3 px-2 text-white">USDC</td>
                    <td className="py-3 px-2 text-right">45,000.00</td>
                    <td className="py-3 px-2 text-right">$45,000.00</td>
                    <td className="py-3 px-2 text-right">31.5%</td>
                  </tr>
                  <tr className="border-b border-[#333] hover:bg-[#111] transition-colors cursor-pointer">
                    <td className="py-3 px-2 text-white">ETH</td>
                    <td className="py-3 px-2 text-right">12.5000</td>
                    <td className="py-3 px-2 text-right">$42,526.87</td>
                    <td className="py-3 px-2 text-right">29.8%</td>
                  </tr>
                  <tr className="border-b border-[#333] hover:bg-[#111] transition-colors cursor-pointer">
                    <td className="py-3 px-2 text-white">cbETH</td>
                    <td className="py-3 px-2 text-right">8.2000</td>
                    <td className="py-3 px-2 text-right">$29,029.72</td>
                    <td className="py-3 px-2 text-right">20.3%</td>
                  </tr>
                  <tr className="border-b border-[#333] hover:bg-[#111] transition-colors cursor-pointer">
                    <td className="py-3 px-2 text-white">wstETH</td>
                    <td className="py-3 px-2 text-right">6.6000</td>
                    <td className="py-3 px-2 text-right">$26,271.63</td>
                    <td className="py-3 px-2 text-right">18.4%</td>
                  </tr>
                </tbody>
              </table>
            </div>
          </div>

          {/* Activity */}
          <div className="flex-1 bg-black p-4 flex flex-col">
            <div className="mb-4 text-[#6b7280]">
              <span>[SYSTEM::ACTIVITY_LOG]</span>
            </div>
            <div className="space-y-2 font-mono text-xs sm:text-sm">
              <div className="flex gap-4">
                <span className="text-[#6b7280]">14:02:11</span>
                <span className="text-[#f59e0b] w-16">SWAP</span>
                <span className="flex-1 text-[#d1d5db]">1.5 ETH -&gt; 5,103.22 USDC via OPENOCEAN</span>
                <span className="text-[#6b7280] underline cursor-pointer hover:text-white">0x8f2a...c31b</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#6b7280]">11:45:00</span>
                <span className="text-[#22c55e] w-16">SUPPLY</span>
                <span className="flex-1 text-[#d1d5db]">5,000 USDC -&gt; AAVE V3 BASE</span>
                <span className="text-[#6b7280] underline cursor-pointer hover:text-white">0x1a9b...442f</span>
              </div>
              <div className="flex gap-4">
                <span className="text-[#6b7280]">09:12:44</span>
                <span className="text-[#3b82f6] w-16">SHIELD</span>
                <span className="flex-1 text-[#d1d5db]">OBFUSCATE 10 ETH (ANON_SET: 1024)</span>
                <span className="text-[#6b7280] underline cursor-pointer hover:text-white">0x55ca...09d1</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Col - Actions */}
        <div className="col-span-12 lg:col-span-4 bg-black flex flex-col gap-px border-l border-[#333]">
          
          {/* Swap */}
          <div className="bg-black p-4 border-b border-[#333]">
            <div className="mb-4 text-[#6b7280]">
              <span>[SWAP::OPENOCEAN_ROUTER]</span>
            </div>
            
            <div className="space-y-4">
              <div className="border border-[#333] p-3 flex flex-col">
                <div className="flex justify-between text-[#6b7280] mb-2">
                  <span>SELL</span>
                  <span>BAL: 12.5 ETH</span>
                </div>
                <div className="flex justify-between items-center">
                  <input type="text" className="bg-transparent text-white text-xl outline-none w-1/2 placeholder-[#333]" placeholder="0.0" defaultValue="1.5" />
                  <span className="text-white">ETH</span>
                </div>
              </div>

              <div className="text-center text-[#6b7280]">|</div>

              <div className="border border-[#333] p-3 flex flex-col">
                <div className="flex justify-between text-[#6b7280] mb-2">
                  <span>BUY</span>
                  <span>BAL: 45,000 USDC</span>
                </div>
                <div className="flex justify-between items-center">
                  <input type="text" className="bg-transparent text-white text-xl outline-none w-1/2 placeholder-[#333]" placeholder="0.0" defaultValue="5,103.22" readOnly />
                  <span className="text-white">USDC</span>
                </div>
              </div>

              <div className="text-[#6b7280] flex justify-between">
                <span>RATE</span>
                <span className="text-[#d1d5db]">1 ETH = 3,402.15 USDC</span>
              </div>
              <div className="text-[#6b7280] flex justify-between">
                <span>ROUTING</span>
                <span className="text-[#d1d5db]">BASE -&gt; OPENOCEAN</span>
              </div>

              <button className="w-full border border-white text-white py-3 hover:bg-white hover:text-black transition-colors font-bold mt-2">
                EXECUTE_SWAP
              </button>
            </div>
          </div>

          {/* Yield */}
          <div className="bg-black p-4 border-b border-[#333]">
            <div className="mb-4 text-[#6b7280]">
              <span>[VAULT::AAVE-V3]</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-end">
                <span className="text-[#6b7280]">SUPPLIED_USDC</span>
                <span className="text-white text-xl">25,000.00</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[#6b7280]">CURRENT_APY</span>
                <span className="text-[#22c55e]">4.24%</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[#6b7280]">ACCRUED</span>
                <span className="text-[#22c55e]">+142.50</span>
              </div>
              
              <div className="grid grid-cols-2 gap-2 mt-4">
                <button className="border border-[#333] text-[#d1d5db] py-2 hover:bg-[#111] transition-colors">DEPOSIT</button>
                <button className="border border-[#333] text-[#d1d5db] py-2 hover:bg-[#111] transition-colors">WITHDRAW</button>
              </div>
            </div>
          </div>

          {/* Privacy */}
          <div className="bg-black p-4 flex-1">
            <div className="mb-4 text-[#6b7280]">
              <span>[SECURITY::ZK_PROOFS]</span>
            </div>
            
            <div className="space-y-3">
              <div className="flex justify-between items-center">
                <span className="text-[#6b7280]">STEALTH_ROUTING</span>
                <div className="flex items-center gap-2">
                  <span className="text-[#22c55e]">ACTIVE</span>
                  <div className="w-8 h-4 border border-[#22c55e] flex items-center p-[1px]">
                    <div className="w-3 h-3 bg-[#22c55e] ml-auto"></div>
                  </div>
                </div>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[#6b7280]">ANONYMITY_SET</span>
                <span className="text-white">1,024 TXs</span>
              </div>
              <div className="flex justify-between items-end">
                <span className="text-[#6b7280]">PROOF_STATUS</span>
                <span className="text-[#22c55e]">VERIFIED</span>
              </div>
            </div>
          </div>

        </div>
      </div>

      {/* Command Palette */}
      <div className="bg-black border-t border-[#333] p-4 flex items-center gap-4 text-lg">
        <span className="text-[#22c55e] font-bold">&gt;</span>
        <input 
          type="text" 
          className="bg-transparent border-none outline-none text-white w-full placeholder-[#333]" 
          placeholder="TYPE /COMMAND OR ADDRESS (E.G. /SWAP, /YIELD, /STEALTH, /ANALYTICS)" 
          autoFocus 
        />
        <div className="flex gap-2 text-[#6b7280] text-xs">
          <span>[TAB] COMPLETE</span>
          <span>[ENTER] EXEC</span>
        </div>
      </div>
    </div>
  );
}
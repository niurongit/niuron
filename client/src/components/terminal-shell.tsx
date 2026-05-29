import { useEffect, useMemo, useRef, useState } from "react";
import { useLocation } from "wouter";
import { useBlockNumber } from "wagmi";
import { useWalletContext } from "@/components/wallet-provider";
import { WalletButton } from "@/components/wallet-button";

const ROUTES: { cmd: string; path: string; label: string }[] = [
  { cmd: "/dashboard", path: "/", label: "DASHBOARD" },
  { cmd: "/home", path: "/", label: "DASHBOARD" },
  { cmd: "/swap", path: "/swap", label: "SWAP::OPENOCEAN" },
  { cmd: "/yield", path: "/yield", label: "VAULT::AAVE-V3" },
  { cmd: "/portfolio", path: "/portfolio", label: "PORTFOLIO" },
  { cmd: "/stealth", path: "/stealth", label: "STEALTH_PAY" },
  { cmd: "/multisig", path: "/multisig", label: "MULTISIG" },
  { cmd: "/routing", path: "/routing", label: "PRIVATE_ROUTING" },
  { cmd: "/zksnark", path: "/zksnark", label: "ZK_PROOFS" },
  { cmd: "/disclosure", path: "/disclosure", label: "DISCLOSURE" },
  { cmd: "/analytics", path: "/analytics", label: "ANALYTICS" },
  { cmd: "/compliance", path: "/compliance", label: "COMPLIANCE" },
];

function truncate(addr?: string | null) {
  if (!addr) return "---";
  return `${addr.slice(0, 6)}...${addr.slice(-4)}`;
}

export function TickerBar() {
  const { connected, publicKey, isCorrectChain } = useWalletContext();
  const { data: blockNumber } = useBlockNumber({ watch: true, query: { refetchInterval: 12000 } });

  const items = [
    { k: "NIURON_SYS", v: "v1.0β", strong: true },
    { k: "NET", v: isCorrectChain ? "BASE_MAINNET" : "WRONG_CHAIN", tone: isCorrectChain ? "ok" : "warn" },
    { k: "BLOCK", v: blockNumber ? blockNumber.toString() : "----", tone: "muted" },
    { k: "WALLET", v: connected ? truncate(publicKey) : "DISCONNECTED", tone: connected ? "ok" : "muted" },
    { k: "STATUS", v: connected ? "ONLINE" : "STANDBY", tone: connected ? "ok" : "warn" },
    { k: "MODE", v: "PRIVATE", tone: "info" },
  ] as const;

  const toneClass = (tone?: string) => {
    if (tone === "ok") return "text-[#22c55e]";
    if (tone === "warn") return "text-[#f59e0b]";
    if (tone === "info") return "text-[#3b82f6]";
    if (tone === "muted") return "text-[#6b7280]";
    return "text-white";
  };

  return (
    <div
      className="border-b border-[#333] flex items-center px-4 py-1.5 whitespace-nowrap overflow-x-auto text-[#6b7280] uppercase text-[11px] sm:text-xs gap-x-6 bg-black sticky top-0 z-50"
      data-testid="terminal-ticker"
    >
      {items.map((it) => (
        <span key={it.k} className="flex items-center gap-1.5 shrink-0">
          <span className="text-[#6b7280]">{it.k}</span>
          <span className={`${(it as { strong?: boolean }).strong ? "font-bold text-white" : toneClass((it as { tone?: string }).tone)}`}>
            {it.v}
          </span>
        </span>
      ))}
      <div className="flex-1" />
      <div className="shrink-0">
        <WalletButton />
      </div>
    </div>
  );
}

export function CommandPalette() {
  const [, navigate] = useLocation();
  const [location] = useLocation();
  const inputRef = useRef<HTMLInputElement>(null);
  const [value, setValue] = useState("");
  const [open, setOpen] = useState(false);
  const [active, setActive] = useState(0);

  const suggestions = useMemo(() => {
    const q = value.trim().toLowerCase();
    const unique = ROUTES.filter((r, i, arr) => arr.findIndex((x) => x.path === r.path) === i);
    if (!q) return unique;
    return ROUTES.filter(
      (r) =>
        r.cmd.toLowerCase().includes(q) ||
        r.label.toLowerCase().includes(q) ||
        r.path.toLowerCase().includes(q.replace(/^\//, ""))
    ).slice(0, 12);
  }, [value]);

  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      const target = e.target as HTMLElement | null;
      const isTyping =
        target && (target.tagName === "INPUT" || target.tagName === "TEXTAREA" || target.isContentEditable);
      if (e.key === "/" && !isTyping) {
        e.preventDefault();
        inputRef.current?.focus();
        setOpen(true);
      }
      if (e.key === "Escape") {
        setOpen(false);
        inputRef.current?.blur();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, []);

  const exec = (cmd?: string) => {
    const target = (cmd ?? suggestions[active]?.cmd ?? value).trim();
    if (!target) return;
    const match =
      ROUTES.find((r) => r.cmd.toLowerCase() === target.toLowerCase()) ??
      ROUTES.find((r) => r.cmd.toLowerCase().startsWith(target.toLowerCase())) ??
      ROUTES.find((r) => r.path === target);
    if (match) {
      navigate(match.path);
      setValue("");
      setOpen(false);
      inputRef.current?.blur();
    }
  };

  const onKeyDown = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      exec();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      setActive((a) => Math.min(a + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActive((a) => Math.max(a - 1, 0));
    } else if (e.key === "Tab") {
      e.preventDefault();
      const s = suggestions[active];
      if (s) setValue(s.cmd);
    }
  };

  const currentLabel =
    ROUTES.find((r) => r.path === location)?.label ?? "UNKNOWN";

  return (
    <div className="bg-black border-t border-[#333] relative" data-testid="terminal-command-palette">
      {open && suggestions.length > 0 && (
        <div className="absolute left-0 right-0 bottom-full border-t border-x border-[#333] bg-black max-h-64 overflow-y-auto z-50">
          {suggestions.map((s, i) => (
            <button
              key={s.cmd}
              type="button"
              onMouseDown={(e) => {
                e.preventDefault();
                exec(s.cmd);
              }}
              onMouseEnter={() => setActive(i)}
              className={`w-full text-left px-4 py-2 flex items-center gap-4 text-xs uppercase border-b border-[#1a1a1a] ${
                i === active ? "bg-[#0f0f0f] text-white" : "text-[#d1d5db] hover:bg-[#0a0a0a]"
              }`}
              data-testid={`cmd-suggestion-${s.cmd.slice(1)}`}
            >
              <span className="text-[#22c55e] w-32">{s.cmd}</span>
              <span className="text-[#6b7280] flex-1">{s.label}</span>
              <span className="text-[#6b7280]">{s.path}</span>
            </button>
          ))}
        </div>
      )}
      <div className="flex items-center gap-3 px-4 py-3 text-sm uppercase">
        <span className="text-[#22c55e] font-bold">&gt;</span>
        <span className="text-[#6b7280] hidden md:inline">
          [{currentLabel}]
        </span>
        <input
          ref={inputRef}
          type="text"
          value={value}
          onChange={(e) => {
            setValue(e.target.value);
            setOpen(true);
            setActive(0);
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 120)}
          onKeyDown={onKeyDown}
          spellCheck={false}
          autoComplete="off"
          className="bg-transparent border-none outline-none text-white flex-1 placeholder-[#333] min-w-0"
          placeholder="TYPE /COMMAND  (E.G. /SWAP, /YIELD, /STEALTH, /PORTFOLIO)"
          data-testid="input-command"
        />
        <div className="hidden lg:flex gap-3 text-[#6b7280] text-[10px]">
          <span>[/] FOCUS</span>
          <span>[TAB] COMPLETE</span>
          <span>[ENTER] EXEC</span>
          <span>[ESC] BLUR</span>
        </div>
      </div>
    </div>
  );
}

export function SectionHeader({
  tag,
  right,
}: {
  tag: string;
  right?: React.ReactNode;
}) {
  return (
    <div className="flex items-center justify-between mb-4 uppercase text-xs text-[#6b7280]">
      <span data-testid={`section-${tag.replace(/[^a-z0-9]/gi, "-").toLowerCase()}`}>
        [{tag}]
      </span>
      {right && <span>{right}</span>}
    </div>
  );
}

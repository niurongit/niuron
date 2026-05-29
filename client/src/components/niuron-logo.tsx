import logoUrl from "@assets/Desain_tanpa_judul_(65)_1779967155592.png";

interface NiuronLogoProps {
  className?: string;
  size?: "sm" | "md" | "lg" | "xl";
  glow?: boolean;
}

const sizeClasses = {
  sm: "w-6 h-6",
  md: "w-8 h-8",
  lg: "w-12 h-12",
  xl: "w-16 h-16",
};

export function NiuronLogo({ className = "", size = "md", glow = true }: NiuronLogoProps) {
  return (
    <div className={`relative inline-flex ${sizeClasses[size]} ${className}`}>
      {glow && (
        <div
          aria-hidden
          className="absolute inset-0 rounded-xl opacity-60 blur-xl"
          style={{
            background:
              "conic-gradient(from 180deg, #b026ff, #ff2bd6, #ff7a2b, #ffe92b, #2bff8a, #2bbcff, #b026ff)",
          }}
        />
      )}
      <img
        src={logoUrl}
        alt="Niuron"
        className="relative w-full h-full object-contain drop-shadow-[0_0_8px_rgba(176,38,255,0.45)]"
      />
    </div>
  );
}

export function NiuronLogoWithText({ className = "", collapsed = false }: { className?: string; collapsed?: boolean }) {
  if (collapsed) {
    return <NiuronLogo size="sm" />;
  }
  return (
    <div className={`flex items-center gap-3 ${className}`}>
      <NiuronLogo size="md" />
      <div className="flex flex-col leading-none">
        <span className="font-mono font-extrabold text-lg tracking-tight bg-gradient-to-r from-fuchsia-400 via-pink-400 to-amber-300 bg-clip-text text-transparent">
          NIURON
        </span>
        <span className="text-[10px] font-mono uppercase tracking-[0.25em] text-muted-foreground mt-1">
          private.finance
        </span>
      </div>
    </div>
  );
}

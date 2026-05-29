const TOKEN_LOGOS: Record<string, string> = {
  ETH: "https://assets.coingecko.com/coins/images/279/large/ethereum.png",
  WETH: "https://assets.coingecko.com/coins/images/2518/large/weth.png",
  USDC: "https://assets.coingecko.com/coins/images/6319/large/usdc.png",
  USDbC: "https://assets.coingecko.com/coins/images/31164/large/baseusdc.jpg",
  DAI: "https://assets.coingecko.com/coins/images/9956/large/Badge_Dai.png",
  cbETH: "https://assets.coingecko.com/coins/images/27008/large/cbeth.png",
  CBETH: "https://assets.coingecko.com/coins/images/27008/large/cbeth.png",
  AAVE: "https://assets.coingecko.com/coins/images/12645/large/aave-token-round.png",
};

export function getTokenLogo(symbol: string): string | null {
  return TOKEN_LOGOS[symbol] || null;
}

interface TokenLogoProps {
  symbol: string;
  size?: "xs" | "sm" | "md" | "lg" | "xl";
  className?: string;
}

export function TokenLogo({ symbol, size = "md", className = "" }: TokenLogoProps) {
  const sizeClasses = {
    xs: "w-4 h-4",
    sm: "w-5 h-5",
    md: "w-8 h-8",
    lg: "w-10 h-10",
    xl: "w-12 h-12",
  };
  
  const textSizes = {
    xs: "text-[8px]",
    sm: "text-[10px]",
    md: "text-xs",
    lg: "text-sm",
    xl: "text-base",
  };
  
  const logoUrl = TOKEN_LOGOS[symbol];
  
  return (
    <div className={`${sizeClasses[size]} relative ${className}`}>
      {logoUrl ? (
        <>
          <img 
            src={logoUrl} 
            alt={`${symbol} logo`}
            className={`${sizeClasses[size]} rounded-full object-cover`}
            onError={(e) => {
              e.currentTarget.style.display = 'none';
              const fallback = e.currentTarget.nextElementSibling;
              if (fallback) {
                (fallback as HTMLElement).classList.remove('hidden');
              }
            }}
          />
          <div className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center ${textSizes[size]} font-bold hidden`}>
            {symbol.slice(0, 2)}
          </div>
        </>
      ) : (
        <div className={`${sizeClasses[size]} rounded-full bg-muted flex items-center justify-center ${textSizes[size]} font-bold`}>
          {symbol.slice(0, 2)}
        </div>
      )}
    </div>
  );
}

export { TOKEN_LOGOS };

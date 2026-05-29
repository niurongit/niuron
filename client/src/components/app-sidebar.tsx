import { Link, useLocation } from "wouter";
import {
  LayoutDashboard,
  ArrowLeftRight,
  PieChart,
  Shield,
  BarChart3,
  Coins,
  ClipboardCheck,
  Globe,
  Send,
  Users,
  Route,
  ExternalLink,
  Code2,
  Terminal,
} from "lucide-react";
import { SiX, SiGithub } from "react-icons/si";
import {
  Sidebar,
  SidebarContent,
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  SidebarMenu,
  SidebarMenuItem,
  SidebarHeader,
  SidebarFooter,
  useSidebar,
} from "@/components/ui/sidebar";
import { NiuronLogo, NiuronLogoWithText } from "@/components/niuron-logo";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

function BaseLogo({ className }: { className?: string }) {
  return (
    <svg viewBox="0 0 111 111" className={className} fill="currentColor" xmlns="http://www.w3.org/2000/svg">
      <path
        d="M54.921 110.034C85.359 110.034 110.034 85.402 110.034 55.017C110.034 24.6319 85.359 0 54.921 0C26.0432 0 2.35281 22.1714 0 50.3923H72.8467V59.6416H3.9565e-07C2.35281 87.8625 26.0432 110.034 54.921 110.034Z"
        fill="#0052FF"
      />
    </svg>
  );
}

const socialLinks = [
  { name: "X (Twitter)", url: "#", icon: SiX },
  { name: "Website", url: "#", icon: Globe },
  { name: "GitHub", url: "#", icon: SiGithub },
];

const mainNavItems = [
  { title: "Dashboard", url: "/", icon: LayoutDashboard, description: "Overview & stats" },
  { title: "Private Swap", url: "/swap", icon: ArrowLeftRight, description: "Trade tokens privately" },
  { title: "Stealth Pay", url: "/stealth", icon: Send, description: "Anonymous payments" },
  { title: "Multi-Sig", url: "/multisig", icon: Users, description: "Shared wallets" },
  { title: "Private Routing", url: "/routing", icon: Route, description: "ZK transaction routing" },
  { title: "Portfolio", url: "/portfolio", icon: PieChart, description: "Track your assets" },
  { title: "Analytics", url: "/analytics", icon: BarChart3, description: "Performance metrics" },
];

const defiNavItems = [
  { title: "Yield Farming", url: "/yield", icon: Coins, description: "Earn rewards" },
  { title: "Disclosure", url: "/disclosure", icon: Shield, description: "Selective proofs" },
  { title: "Compliance", url: "/compliance", icon: ClipboardCheck, description: "Audit controls" },
  { title: "ZK Dev Tools", url: "/zksnark", icon: Code2, description: "Build zkSNARK proofs" },
];

interface NavLinkProps {
  item: { title: string; url: string; icon: React.ComponentType<{ className?: string }>; description: string };
  isActive: boolean;
  isCollapsed: boolean;
}

function NavLink({ item, isActive, isCollapsed }: NavLinkProps) {
  return (
    <Tooltip>
      <TooltipTrigger asChild>
        <Link
          href={item.url}
          data-testid={`nav-${item.title.toLowerCase().replace(/\s+/g, "-")}`}
          className={`
            group/item relative flex items-center w-full rounded-lg transition-all duration-200 overflow-hidden
            ${isCollapsed ? "justify-center p-2" : "gap-3 px-3 py-2.5"}
            ${isActive
              ? "bg-gradient-to-r from-fuchsia-500/15 via-violet-500/10 to-transparent text-foreground border border-fuchsia-500/30 shadow-[0_0_18px_-2px_rgba(217,70,239,0.35)]"
              : "border border-transparent hover:border-sidebar-accent/60 hover:bg-sidebar-accent/30"
            }
          `}
        >
          {isActive && (
            <span
              aria-hidden
              className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-[3px] rounded-r-full bg-gradient-to-b from-fuchsia-400 via-violet-400 to-amber-300"
            />
          )}
          <div
            className={`
              flex items-center justify-center rounded-md transition-all duration-200
              ${isCollapsed ? "h-7 w-7" : "h-7 w-7"}
              ${isActive
                ? "bg-gradient-to-br from-fuchsia-500 via-violet-500 to-amber-400 text-white shadow-[0_0_12px_rgba(217,70,239,0.5)]"
                : "bg-sidebar-accent/40 text-muted-foreground group-hover/item:bg-sidebar-accent group-hover/item:text-foreground group-hover/item:scale-110"
              }
            `}
          >
            <item.icon className="h-3.5 w-3.5" />
          </div>
          {!isCollapsed && (
            <>
              <span
                className={`font-mono text-[13px] tracking-tight ${
                  isActive ? "font-semibold text-foreground" : "font-medium text-sidebar-foreground/80"
                }`}
              >
                {item.title}
              </span>
              {isActive && (
                <div className="absolute right-2.5 flex items-center gap-1">
                  <div className="w-1 h-1 rounded-full bg-fuchsia-400 animate-pulse" />
                </div>
              )}
            </>
          )}
        </Link>
      </TooltipTrigger>
      <TooltipContent side="right" className="flex flex-col gap-0.5 font-mono">
        <span className="font-semibold text-xs">{item.title}</span>
        <span className="text-muted-foreground text-[10px]">{item.description}</span>
      </TooltipContent>
    </Tooltip>
  );
}

export function AppSidebar() {
  const [location] = useLocation();
  const { state } = useSidebar();
  const isCollapsed = state === "collapsed";

  return (
    <Sidebar
      collapsible="icon"
      className="border-r border-sidebar-border/60 bg-sidebar/95 backdrop-blur-xl"
    >
      {/* Brand header with subtle gradient glow */}
      <SidebarHeader className={`relative ${isCollapsed ? "p-3" : "p-4"} border-b border-sidebar-border/40`}>
        <div
          aria-hidden
          className="absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-fuchsia-500/50 to-transparent"
        />
        {isCollapsed ? (
          <div className="flex justify-center">
            <NiuronLogo size="sm" />
          </div>
        ) : (
          <NiuronLogoWithText />
        )}
      </SidebarHeader>

      <SidebarContent className={`${isCollapsed ? "px-1.5" : "px-2.5"} pt-3`}>
        <SidebarGroup>
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground/60 mb-2 flex items-center gap-2">
              <span className="text-fuchsia-400">›</span> Main
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {mainNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink item={item} isActive={location === item.url} isCollapsed={isCollapsed} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        <SidebarGroup className="mt-5">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground/60 mb-2 flex items-center gap-2">
              <span className="text-amber-400">›</span> DeFi & Privacy
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            <SidebarMenu className="space-y-0.5">
              {defiNavItems.map((item) => (
                <SidebarMenuItem key={item.title}>
                  <NavLink item={item} isActive={location === item.url} isCollapsed={isCollapsed} />
                </SidebarMenuItem>
              ))}
            </SidebarMenu>
          </SidebarGroupContent>
        </SidebarGroup>

        {/* Network status block */}
        <SidebarGroup className="mt-auto pt-5">
          {!isCollapsed && (
            <SidebarGroupLabel className="px-3 text-[9px] font-mono font-bold uppercase tracking-[0.25em] text-muted-foreground/60 mb-2 flex items-center gap-2">
              <span className="text-emerald-400">›</span> Network
            </SidebarGroupLabel>
          )}
          <SidebarGroupContent>
            {isCollapsed ? (
              <Tooltip>
                <TooltipTrigger asChild>
                  <div
                    className="mx-auto p-2 rounded-lg bg-[#0052FF] shadow-[0_0_15px_rgba(0,82,255,0.5)] cursor-default"
                    data-testid="sidebar-network-status"
                  >
                    <BaseLogo className="h-5 w-5 text-white" />
                  </div>
                </TooltipTrigger>
                <TooltipContent side="right">
                  <div className="flex items-center gap-2 font-mono text-xs">
                    <div className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                    <span>Base Mainnet</span>
                  </div>
                </TooltipContent>
              </Tooltip>
            ) : (
              <div
                className="mx-1 p-3 rounded-xl border border-sidebar-border/60 bg-gradient-to-br from-sidebar-accent/20 via-sidebar/60 to-transparent backdrop-blur-sm relative overflow-hidden"
                data-testid="sidebar-network-status"
              >
                <div
                  aria-hidden
                  className="absolute -top-10 -right-10 w-24 h-24 rounded-full bg-gradient-to-br from-[#0052FF]/30 to-[#0052FF]/10 blur-2xl"
                />
                <div className="flex items-center gap-3 relative">
                  <div className="relative">
                    <div className="p-2 rounded-lg bg-[#0052FF] shadow-[0_0_15px_rgba(0,82,255,0.5)]">
                      <BaseLogo className="h-4 w-4 text-white" />
                    </div>
                    <div className="absolute -bottom-0.5 -right-0.5 w-2.5 h-2.5 rounded-full bg-emerald-400 border-2 border-sidebar animate-pulse" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sidebar-foreground uppercase tracking-wider">
                        Base
                      </span>
                      <Badge
                        variant="outline"
                        className="text-[9px] px-1.5 py-0 h-4 font-mono bg-emerald-500/10 text-emerald-400 border-emerald-500/30"
                      >
                        LIVE
                      </Badge>
                    </div>
                    <span className="text-[10px] font-mono text-muted-foreground uppercase tracking-wider">
                      mainnet · L2
                    </span>
                  </div>
                </div>
              </div>
            )}
          </SidebarGroupContent>
        </SidebarGroup>
      </SidebarContent>

      <SidebarFooter
        className={`border-t border-sidebar-border/40 ${isCollapsed ? "p-2" : "p-3 space-y-3"}`}
      >
        <div className={`flex items-center gap-1 ${isCollapsed ? "flex-col" : "justify-center"}`}>
          {socialLinks.map((social) => (
            <Tooltip key={social.name}>
              <TooltipTrigger asChild>
                <Button
                  variant="ghost"
                  size="icon"
                  asChild
                  className={`rounded-lg hover:bg-sidebar-accent hover:scale-110 hover:text-fuchsia-400 transition-all duration-200 ${
                    isCollapsed ? "h-8 w-8" : "h-8 w-8"
                  }`}
                  data-testid={`social-${social.name.toLowerCase().replace(/[^a-z]/g, "")}`}
                >
                  <a href={social.url} target="_blank" rel="noopener noreferrer" className="flex items-center justify-center">
                    <social.icon className="h-3.5 w-3.5" />
                  </a>
                </Button>
              </TooltipTrigger>
              <TooltipContent side={isCollapsed ? "right" : "top"} className="flex items-center gap-1.5 font-mono text-xs">
                <span>{social.name}</span>
                <ExternalLink className="h-3 w-3 text-muted-foreground" />
              </TooltipContent>
            </Tooltip>
          ))}
        </div>

        {!isCollapsed && (
          <div className="flex items-center justify-between px-2 py-2 rounded-lg bg-sidebar-accent/20 border border-sidebar-border/40">
            <div className="flex items-center gap-1.5">
              <Terminal className="h-3 w-3 text-fuchsia-400" />
              <span className="text-[10px] font-mono font-semibold uppercase tracking-wider text-muted-foreground">
                niuron
              </span>
            </div>
            <Badge
              variant="secondary"
              className="text-[9px] px-1.5 py-0 font-mono bg-fuchsia-500/10 text-fuchsia-300 border-fuchsia-500/20"
            >
              v1.0β
            </Badge>
          </div>
        )}
      </SidebarFooter>
    </Sidebar>
  );
}

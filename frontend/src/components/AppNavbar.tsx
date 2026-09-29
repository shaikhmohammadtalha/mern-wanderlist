import type { ReactNode } from "react";
import { Plus, User2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { SidebarTrigger, useSidebar } from "@/components/ui/sidebar";
import { useAuth } from "@/context/AuthContext";
import { cn } from "@/lib/utils";
import Logo from "./Logo";
import NavLinks from "./NavLinks";

interface AppNavbarProps {
  /** The <SearchBar /> — passed as a slot so its props aren't re-declared here */
  search: ReactNode;
  onAddDestination: () => void;
}

/**
 * One layout, two modes (breakpoint = xl, 1280px — same as the sidebar's
 * mobile breakpoint in use-mobile.ts):
 *
 *  < xl : [trigger][logo]              [user]
 *         [search ...................... ]
 *  ≥ xl : [trigger][logo?][nav]  [add][search][user]
 */
export default function AppNavbar({
  search,
  onAddDestination,
}: AppNavbarProps) {
  const { open } = useSidebar();
  const { setIsAuth } = useAuth();
  const username = localStorage.getItem("username") || "User";

  const handleSignOut = () => {
    localStorage.removeItem("token");
    localStorage.removeItem("username");
    setIsAuth?.(false);
  };

  return (
    <header className="sticky top-0 z-50 w-full shrink-0 border-b bg-background/90 shadow-sm backdrop-blur-md">
      <div className="flex min-w-0 flex-wrap items-center gap-x-2 gap-y-2 px-3 py-2 xl:h-16 xl:flex-nowrap xl:gap-3 xl:px-4 xl:py-0">
        <SidebarTrigger className="shrink-0" />

        {/* On xl the docked sidebar already shows the logo, so hide it here while it's open */}
        <Logo className={cn(open && "xl:hidden")} />

        <NavLinks variant="bar" className="hidden xl:flex" />

        <button
          type="button"
          onClick={onAddDestination}
          className="ml-auto hidden shrink-0 items-center gap-2 whitespace-nowrap rounded-md bg-primary/10 px-3 py-2 text-sm font-medium text-primary transition-colors hover:bg-primary/20 xl:flex"
        >
          <Plus className="h-4 w-4" />
          Add Destination
        </button>

        {/* Below xl this wraps onto its own full-width row */}
        <div className="order-last w-full min-w-0 xl:order-none xl:w-auto xl:max-w-[360px] xl:flex-1">
          {search}
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              aria-label={`Open ${username} menu`}
              className="ml-auto flex h-9 shrink-0 items-center gap-2 rounded-md px-2 text-sm font-medium hover:bg-primary/10 hover:text-primary xl:ml-0 xl:px-3"
            >
              <User2 className="h-5 w-5" />
              <span className="hidden max-w-32 truncate xl:inline">
                {username}
              </span>
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
            side="bottom"
            align="end"
            className="w-40 rounded-md border p-2 shadow-md"
          >
            <DropdownMenuItem onClick={handleSignOut}>
              Sign out
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}

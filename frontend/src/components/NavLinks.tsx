import { NavLink } from "react-router-dom";
import { useSidebar } from "@/components/ui/sidebar";
import { cn } from "@/lib/utils";

const NAV_ITEMS = [
  { to: "/", label: "Map", end: true },
  { to: "/destinations", label: "All Destinations", end: false },
  { to: "/stats", label: "Stats", end: false },
] as const;

interface NavLinksProps {
  /** "bar" = horizontal tabs (navbar), "list" = vertical list (sidebar drawer) */
  variant: "bar" | "list";
  /** Caller controls display/visibility, e.g. "hidden xl:flex" or "xl:hidden" */
  className?: string;
}

export default function NavLinks({ variant, className }: NavLinksProps) {
  const { isMobile, setOpen, setOpenMobile } = useSidebar();

  const handleNavigate = (to: string) => {
    if (isMobile) setOpenMobile(false);
    else if (to === "/destinations") setOpen(false);
  };

  const linkClass = (isActive: boolean) =>
    variant === "bar"
      ? cn(
          "inline-flex items-center whitespace-nowrap rounded-md border-b-2 px-3 py-2 text-sm font-medium transition-colors",
          isActive
            ? "border-primary text-primary"
            : "border-transparent text-muted-foreground hover:bg-primary/10 hover:text-foreground",
        )
      : cn(
          "rounded-md px-2 py-1.5 text-sm transition-colors",
          isActive
            ? "bg-primary/10 font-medium text-primary"
            : "text-muted-foreground hover:bg-primary/10 hover:text-foreground",
        );

  return (
    <nav
      aria-label="Primary navigation"
      className={cn(
        variant === "bar" ? "items-center gap-1" : "flex flex-col gap-1",
        className,
      )}
    >
      {NAV_ITEMS.map(({ to, label, end }) => (
        <NavLink
          key={to}
          to={to}
          end={end}
          onClick={() => handleNavigate(to)}
          className={({ isActive }) => linkClass(isActive)}
        >
          {label}
        </NavLink>
      ))}
    </nav>
  );
}

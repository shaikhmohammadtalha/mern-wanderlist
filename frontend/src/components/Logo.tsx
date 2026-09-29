import { NavLink } from "react-router-dom";
import { MapPin } from "lucide-react";
import { cn } from "@/lib/utils";

export default function Logo({ className }: { className?: string }) {
  return (
    <NavLink
      to="/"
      className={cn(
        "flex min-w-0 items-center gap-2 transition-colors hover:text-primary",
        className,
      )}
    >
      <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground">
        <MapPin className="h-4 w-4" />
      </span>
      <span className="truncate font-semibold">WanderList</span>
    </NavLink>
  );
}

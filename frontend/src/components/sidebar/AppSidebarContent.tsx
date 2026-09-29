import { ChevronDown, Plus } from "lucide-react";
import DestinationCard from "../destinations/DestinationCard";
import type { Destination } from "@/types/destination";
import {
  SidebarGroup,
  SidebarGroupContent,
  SidebarGroupLabel,
  useSidebar,
} from "@/components/ui/sidebar";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "../ui/collapsible";

export interface AppSidebarContentProps {
  destinations: Destination[];
  onDelete?: (id: string) => void;
  onEdit?: (id: string, updates: Partial<Destination>) => void;
  onFocus?: (id: string) => void;
  onAddDestination?: () => void;
}

export default function AppSidebarContent({
  destinations,
  onDelete,
  onEdit,
  onFocus,
  onAddDestination,
}: AppSidebarContentProps) {
  const { setOpenMobile } = useSidebar();

  return (
    <Collapsible defaultOpen className="group/collapsible">
      <SidebarGroup>
        <SidebarGroupLabel asChild>
          <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2">
            <span className="text-sm font-semibold">Destinations</span>
            <ChevronDown className="ml-auto h-4 w-4 transition-transform group-data-[state=open]/collapsible:rotate-180" />
          </CollapsibleTrigger>
        </SidebarGroupLabel>

        <CollapsibleContent>
          <SidebarGroupContent className="my-2 flex flex-col gap-2">
            {/* The navbar has this button from xl up */}
            <button
              type="button"
              className="mx-2 flex items-center gap-2 rounded-md px-2 py-1 text-sm font-medium text-primary hover:bg-primary/10 xl:hidden"
              onClick={() => {
                setOpenMobile(false);
                onAddDestination?.();
              }}
            >
              <Plus className="h-4 w-4" /> Add Destination
            </button>

            {destinations.map((d) => (
              <DestinationCard
                key={d.id}
                {...d}
                onDelete={onDelete}
                onEdit={onEdit}
                onFocus={() => {
                  onFocus?.(d.id);
                  setOpenMobile(false); // reveal the map on mobile
                }}
              />
            ))}
          </SidebarGroupContent>
        </CollapsibleContent>
      </SidebarGroup>
    </Collapsible>
  );
}

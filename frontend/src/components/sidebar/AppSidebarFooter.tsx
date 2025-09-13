import {
	SidebarFooter,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuButton,
} from "@/components/ui/sidebar";
import { User2, ChevronUp } from "lucide-react";
import {
	DropdownMenu,
	DropdownMenuTrigger,
	DropdownMenuContent,
	DropdownMenuItem,
} from "../ui/dropdown-menu";
import { useAuth } from "@/context/AuthContext";

export default function AppSidebarFooter() {
	const username = localStorage.getItem("username") || "User";
	const { setIsAuth } = useAuth();

	return (
		<SidebarFooter>
			<SidebarMenu>
				<SidebarMenuItem>
					<DropdownMenu>
						<DropdownMenuTrigger asChild>
							<SidebarMenuButton>
								<User2 className="w-4 h-4 mr-2" /> {username}
								<ChevronUp className="ml-auto w-4 h-4" />
							</SidebarMenuButton>
						</DropdownMenuTrigger>

						<DropdownMenuContent
							side="top"
							align="end"
							className="w-[--radix-popper-anchor-width]"
						>
							<DropdownMenuItem
								onClick={() => {
									localStorage.removeItem("token");
									localStorage.removeItem("username");
									setIsAuth(false);
									// Make sure setIsAuth is accessible in this component
								}}
							>
								<span>Sign out</span>
							</DropdownMenuItem>
						</DropdownMenuContent>
					</DropdownMenu>
				</SidebarMenuItem>
			</SidebarMenu>
		</SidebarFooter>
	);
}

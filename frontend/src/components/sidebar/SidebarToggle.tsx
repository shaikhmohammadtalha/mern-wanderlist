interface SidebarToggleProps {
	isOpen: boolean;
	onToggle: () => void;
}

export default function SidebarToggle({
	isOpen,
	onToggle,
}: SidebarToggleProps) {
	if (isOpen) return null;
	return (
		<button
			onClick={onToggle}
			className="fixed top-4 left-4 z-50 bg-primary hover:bg-primary/40
             text-white p-3 rounded-full shadow-lg transition-colors"
		>
			☰
		</button>
	);
}

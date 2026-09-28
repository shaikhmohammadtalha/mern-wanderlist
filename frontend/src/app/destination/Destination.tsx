import DestinationCard from "@/components/destinations/DestinationCard";
import type { Destination } from "@/types/destination";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { categoryDot } from "@/components/map/markerIcons";

interface DestinationsPageProps {
	destinations: Destination[];
	onDelete?: (id: string) => void;
	onEdit?: (id: string, updates: Partial<Destination>) => void;
	onFocus?: (id: string) => void;
}

export default function DestinationsPage({
	destinations,
	onDelete,
	onEdit,
	onFocus,
}: DestinationsPageProps) {
	const grouped = destinations.reduce<Record<string, Destination[]>>(
		(acc, d) => {
			if (!acc[d.category]) acc[d.category] = [];
			acc[d.category].push(d);
			return acc;
		},
		{}
	);

	if (destinations.length === 0) {
		return (
			<div className="p-6 text-center text-muted-foreground">
				<p className="text-lg">No destinations yet.</p>
				<p className="text-sm mt-2">
					Add some from the map or sidebar to get started!
				</p>
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<h1 className="text-3xl font-extrabold tracking-tight text-foreground mb-6">
				All Destinations
			</h1>

			<Accordion type="multiple" className="space-y-4">
				{Object.entries(grouped).map(([category, dests]) => {
					const visited = dests.filter((d) => d.visited);
					const planned = dests.filter((d) => !d.visited);

					return (
						<AccordionItem
							key={category}
							value={category}
							className="rounded-lg border border-border bg-card shadow-sm"
						>
							<AccordionTrigger className="px-4 py-3 text-left text-lg font-semibold hover:bg-accent/50">
								<div className="flex items-center gap-2">
									<span
										className={`w-3 h-3 rounded-full ${categoryDot[category as keyof typeof categoryDot]}`}
									/>
									{category} ({dests.length})
								</div>
							</AccordionTrigger>
							<AccordionContent className="px-4 pb-6">
								{/* Inner accordion: visited & planned */}
								<Accordion
									type="multiple"
									defaultValue={["visited", "planned"]}
									className="space-y-4"
								>
									{/* Visited */}
									<AccordionItem
										value="visited"
										className="rounded border border-border bg-card"
									>
										<AccordionTrigger className="px-3 py-2 text-base font-medium hover:bg-accent/30">
											Visited ({visited.length})
										</AccordionTrigger>
										<AccordionContent>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
												{visited.map((d) => (
													<DestinationCard
														key={d.id}
														{...d}
														onDelete={onDelete}
														onEdit={onEdit}
														onFocus={() => onFocus?.(d.id)}
													/>
												))}
											</div>
										</AccordionContent>
									</AccordionItem>

									{/* Planned */}
									<AccordionItem
										value="planned"
										className="rounded border border-border bg-card"
									>
										<AccordionTrigger className="px-3 py-2 text-base font-medium hover:bg-accent/30">
											Planned ({planned.length})
										</AccordionTrigger>
										<AccordionContent>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 mt-4">
												{planned.map((d) => (
													<DestinationCard
														key={d.id}
														{...d}
														onDelete={onDelete}
														onEdit={onEdit}
														onFocus={() => onFocus?.(d.id)}
													/>
												))}
											</div>
										</AccordionContent>
									</AccordionItem>
								</Accordion>
							</AccordionContent>
						</AccordionItem>
					);
				})}
			</Accordion>
		</div>
	);
}
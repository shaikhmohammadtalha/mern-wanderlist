import DestinationCard from "@/components/destinations/DestinationCard";
import type { Destination } from "@/types/destination";
import {
	Accordion,
	AccordionItem,
	AccordionTrigger,
	AccordionContent,
} from "@/components/ui/accordion";
import { categoryTailwind } from "@/components/map/markerIcons";

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
			<div className="p-6 text-center text-gray-500">
				No destinations yet. Add some from the map or sidebar!
			</div>
		);
	}

	return (
		<div className="p-6 max-w-7xl mx-auto">
			<Accordion type="multiple" className="space-y-4">
				{Object.entries(grouped).map(([category, dests]) => {
					const visited = dests.filter((d) => d.visited);
					const planned = dests.filter((d) => !d.visited);
					const categoryClass =
						categoryTailwind[category as keyof typeof categoryTailwind] ||
						"bg-gray-100 text-gray-800";

					return (
						<AccordionItem
							key={category}
							value={category}
							className={`border rounded-lg shadow-sm mb-6 ${categoryClass}`}
						>
							<AccordionTrigger className="px-4 py-2 text-lg font-semibold">
								{category}
							</AccordionTrigger>
							<AccordionContent className="px-4 pb-6 space-y-6">
								{/* Inner accordion: auto open visited & planned */}
								<Accordion
									type="multiple"
									defaultValue={["visited", "planned"]}
									className="space-y-4"
								>
									{/* Visited */}
									<AccordionItem
										value="visited"
										className={`px-2 py-2 border rounded-lg shadow-sm mb-4 ${categoryClass}`}
									>
										<AccordionTrigger className="px-3 py-1 text-base font-medium">
											Visited ({visited.length})
										</AccordionTrigger>
										<AccordionContent>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
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
										className={`px-2 py-2 border rounded-lg shadow-sm mb-4 ${categoryClass}`}
									>
										<AccordionTrigger className="px-3 py-1 text-base font-medium">
											Planned ({planned.length})
										</AccordionTrigger>
										<AccordionContent>
											<div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 mt-4">
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

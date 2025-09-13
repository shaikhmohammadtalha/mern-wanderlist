import {
	Card,
	CardHeader,
	CardContent,
	CardTitle,
	CardDescription,
} from "@/components/ui/card";
import type { Destination } from "@/types/destination";
import {
	BarChart,
	Bar,
	XAxis,
	YAxis,
	Tooltip,
	ResponsiveContainer,
	PieChart,
	Pie,
	Cell,
} from "recharts";
import { categoryTailwind } from "@/components/map/markerIcons";

interface StatsPageProps {
	destinations: Destination[];
}

export default function StatsPage({ destinations }: StatsPageProps) {
	const totalCount = destinations.length;
	const visitedCount = destinations.filter((d) => d.visited).length;
	const plannedCount = totalCount - visitedCount;

	const data = [
		{ name: "Visited", value: visitedCount },
		{ name: "Planned", value: plannedCount },
	];

	const COLORS = ["#16a34a", "#1d4ed8"]; // Tailwind: green-700 / blue-700

	const categoryCounts = destinations.reduce<
		Record<string, { visited: number; planned: number }>
	>((acc, d) => {
		const key = d.category;
		if (!acc[key]) acc[key] = { visited: 0, planned: 0 };
		if (d.visited) acc[key].visited += 1;
		else acc[key].planned += 1;
		return acc;
	}, {});

	const categoryData = Object.entries(categoryCounts).map(
		([category, counts]) => ({
			category,
			...counts,
		})
	);

	return (
		<div className="p-6 space-y-6">
			<h1 className="text-2xl font-bold">Your Travel Stats</h1>

			<div className="grid grid-cols-1 2xl:grid-cols-2 gap-6">
				{/* Travel Overview Card */}
				<Card>
					<CardHeader className="text-center">
						<CardTitle>Travel Overview</CardTitle>
						<CardDescription>
							Visited vs Planned destinations and category breakdown
						</CardDescription>
					</CardHeader>

					<CardContent className="flex flex-col md:flex-row items-center md:items-start gap-6">
						{/* Left: Pie Chart */}
						<div className="flex flex-col items-center">
							<PieChart width={200} height={200}>
								<Pie
									data={data}
									dataKey="value"
									cx="50%"
									cy="50%"
									outerRadius={80}
								>
									{data.map((_, index) => (
										<Cell key={`cell-${index}`} fill={COLORS[index]} />
									))}
								</Pie>
								<Tooltip />
							</PieChart>

							<div className="flex justify-center gap-4 mt-3">
								<p className="text-sm font-medium bg-green-200 text-green-800 px-2 py-1 rounded-md">
									Visited
								</p>
								<p className="text-sm font-medium bg-blue-200 text-blue-800 px-2 py-1 rounded-md">
									Planned
								</p>
							</div>
						</div>

						{/* Right: Totals + Category Breakdown */}
						<div className="flex flex-col space-y-3">
							{/* Totals */}
							<div className="flex items-center gap-4 mt-2">
								<p className="text-lg font-medium bg-green-200 text-green-800 px-2 py-1 rounded-md w-max shadow-sm">
									Visited – {visitedCount}
								</p>
								<p className="text-lg font-medium bg-blue-200 text-blue-800 px-2 py-1 rounded-md w-max shadow-sm">
									Planned – {plannedCount}
								</p>
								<p className="text-lg font-medium bg-gray-200 text-gray-800 px-2 py-1 rounded-md w-max shadow-sm">
									Total – {totalCount}
								</p>
							</div>

							{/* Categories */}
							<div className="mt-4">
								<h3 className="text-sm font-semibold mb-3">By Category:</h3>
								<div className="flex flex-wrap gap-3">
									{Object.entries(categoryCounts).map(([category, counts]) => {
										const tailwindClasses =
											categoryTailwind[
												category as keyof typeof categoryTailwind
											] || "bg-gray-100 text-gray-800";

										return (
											<div
												key={category}
												className={`flex flex-col items-center justify-center px-4 py-3 rounded-lg shadow-sm border ${tailwindClasses} min-w-[90px]`}
											>
												<span className="font-medium text-sm">{category}</span>
												<span className="text-xs text-muted-foreground mt-1 text-center">
													Visited: {counts.visited} | Planned: {counts.planned}
												</span>
											</div>
										);
									})}
								</div>
							</div>
						</div>
					</CardContent>
				</Card>

				{/* Bar Chart Card */}
				<Card>
					<CardHeader className="text-center">
						<CardTitle>Travel Categories</CardTitle>
						<CardDescription>
							Overview of visited and planned destinations per category
						</CardDescription>
					</CardHeader>

					<CardContent>
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={categoryData}>
								<XAxis dataKey="category" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Bar dataKey="visited" stackId="a" fill={COLORS[0]} />
								<Bar dataKey="planned" stackId="a" fill={COLORS[1]} />
							</BarChart>
						</ResponsiveContainer>

						{/* Custom Legend */}
						<div className="flex justify-center items-center gap-4 mt-2">
							<p className="text-lg font-medium bg-green-200 text-green-800 px-2 py-1 rounded-md w-max shadow-sm">
								Visited
							</p>
							<p className="text-lg font-medium bg-blue-200 text-blue-800 px-2 py-1 rounded-md w-max shadow-sm">
								Planned
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}

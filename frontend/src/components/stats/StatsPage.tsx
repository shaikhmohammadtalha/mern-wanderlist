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
import { categoryDot } from "@/components/map/markerIcons";

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

	const COLORS = ["#0d9488", "#f59e0b"]; // teal / amber

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
		<div className="p-6 max-w-7xl mx-auto space-y-8">
			{/* Page title */}
			<h1 className="text-3xl font-extrabold tracking-tight text-foreground">
				Your Travel Stats
			</h1>

			<div className="grid grid-cols-1 xl:grid-cols-2 gap-6">
				{/* Travel Overview Card */}
				<Card className="shadow-md border-0">
					<CardHeader className="text-center">
						<CardTitle className="text-xl font-bold">
							Travel Overview
						</CardTitle>
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
										<Cell
											key={`cell-${index}`}
											fill={COLORS[index]}
										/>
									))}
								</Pie>
								<Tooltip />
							</PieChart>

							<div className="flex justify-center gap-4 mt-3">
								<p className="text-sm font-medium bg-primary/10 text-primary px-2 py-1 rounded-md">
									Visited
								</p>
								<p className="text-sm font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-md">
									Planned
								</p>
							</div>
						</div>

						{/* Right: Totals + Category Breakdown */}
						<div className="flex flex-col space-y-3">
							{/* Totals */}
							<div className="flex items-center gap-4 mt-2">
								<p className="text-lg font-medium bg-primary/10 text-primary px-2 py-1 rounded-md w-max shadow-sm">
									Visited – {visitedCount}
								</p>
								<p className="text-lg font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-md w-max shadow-sm">
									Planned – {plannedCount}
								</p>
								<p className="text-lg font-medium bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300 px-2 py-1 rounded-md w-max shadow-sm">
									Total – {totalCount}
								</p>
							</div>

							{/* Categories */}
							<div className="mt-4">
								<h3 className="text-sm font-semibold mb-3">
									By Category:
								</h3>
								<div className="flex flex-wrap gap-3">
									{Object.entries(
										categoryCounts
									).map(([category, counts]) => {
										return (
											<div
												key={category}
												className="flex flex-col items-center justify-center px-4 py-3 rounded-lg border border-border bg-card shadow-sm min-w-[90px]"
											>
												<span
													className={`inline-block w-2 h-2 rounded-full mb-1 ${categoryDot[category as keyof typeof categoryDot]}`}
												/>
												<span className="font-medium text-sm">
													{category}
												</span>
												<span className="text-xs text-muted-foreground mt-1 text-center">
													Visited:{" "}
													{counts.visited} |{" "}
													Planned: {counts.planned}
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
				<Card className="shadow-md border-0">
					<CardHeader className="text-center">
						<CardTitle className="text-xl font-bold">
							Travel Categories
						</CardTitle>
						<CardDescription>
							Overview of visited and planned destinations per
							category
						</CardDescription>
					</CardHeader>

					<CardContent>
						<ResponsiveContainer width="100%" height={250}>
							<BarChart data={categoryData}>
								<XAxis dataKey="category" />
								<YAxis allowDecimals={false} />
								<Tooltip />
								<Bar
									dataKey="visited"
									stackId="a"
									fill={COLORS[0]}
								/>
								<Bar
									dataKey="planned"
									stackId="a"
									fill={COLORS[1]}
								/>
							</BarChart>
						</ResponsiveContainer>

						{/* Custom Legend */}
						<div className="flex justify-center items-center gap-4 mt-2">
							<p className="text-lg font-medium bg-primary/10 text-primary px-2 py-1 rounded-md w-max shadow-sm">
								Visited
							</p>
							<p className="text-lg font-medium bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400 px-2 py-1 rounded-md w-max shadow-sm">
								Planned
							</p>
						</div>
					</CardContent>
				</Card>
			</div>
		</div>
	);
}
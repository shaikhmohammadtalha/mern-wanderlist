import * as React from "react";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, List, Search } from "lucide-react";
import { useAuth } from "@/context/AuthContext";

interface OnboardingTourProps {
	open: boolean;
	onOpenChange: (open: boolean) => void;
}

interface TourStep {
	title: string;
	description: string;
	icon: React.ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStep[] = [
	{
		title: "Welcome to WanderList!",
		description: "Let's take a quick tour to see how to use the app.",
		icon: MapPin,
	},
	{
		title: "Explore the Map",
		description: "Click anywhere on the map to drop a pin and add a new destination.",
		icon: MapPin,
	},
	{
		title: "Manage Your Destinations",
		description: "Your destinations live in the sidebar. Edit, delete, or focus on any.",
		icon: List,
	},
	{
		title: "Search Anywhere",
		description: "Search any location in the world to jump there instantly.",
		icon: Search,
	},
	{
		title: "Track Your Progress",
		description: "See your visited vs planned trips on the Stats page.",
		icon: TrendingUp,
	},
];

export default function OnboardingTour({
	open,
	onOpenChange,
}: OnboardingTourProps) {
	const [step, setStep] = React.useState(0);
	const { isAuth } = useAuth();

	if (!isAuth) {
		onOpenChange(false);
		return null;
	}

	const isLastStep = step === TOUR_STEPS.length - 1;
	const currentStep = TOUR_STEPS[step];
	const IconComponent = currentStep.icon;

	const handleNext = () => {
		if (isLastStep) {
			localStorage.setItem("wanderlist_onboarding_done", "1");
			onOpenChange(false);
		} else {
			setStep((prev) => prev + 1);
		}
	};

	const handleSkip = () => {
		localStorage.setItem("wanderlist_onboarding_done", "1");
		onOpenChange(false);
	};

	return (
		<Dialog open={open} onOpenChange={onOpenChange}>
			<DialogTrigger asChild>
				<div />
			</DialogTrigger>
			<DialogContent className="w-full max-w-sm">
				<DialogHeader className="space-y-2">
					<DialogTitle className="text-lg font-semibold">
						{currentStep.title}
					</DialogTitle>
					<DialogDescription>{currentStep.description}</DialogDescription>
				</DialogHeader>

				<div className="flex h-12 w-full items-center justify-center bg-accent/10 rounded-lg">
					<IconComponent className="h-6 w-6 text-accent-foreground" />
				</div>

				<DialogFooter className="flex flex-col sm:flex-row sm:justify-end space-y-3 sm:space-y-0 sm:space-x-2">
					{!isLastStep && (
						<Button variant="outline" size="sm" onClick={handleSkip}>
							Skip
						</Button>
					)}
					<Button
						variant="default"
						size="sm"
						onClick={handleNext}
						className={isLastStep ? "w-full sm:w-auto" : ""}
					>
						{isLastStep ? "Got it!" : "Next"}
					</Button>
				</DialogFooter>
			</DialogContent>
		</Dialog>
	);
}
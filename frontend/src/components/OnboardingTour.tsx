import { useState, type ComponentType } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { MapPin, TrendingUp, List, Search } from "lucide-react";

interface OnboardingTourProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

interface TourStep {
  title: string;
  description: string;
  icon: ComponentType<{ className?: string }>;
}

const TOUR_STEPS: TourStep[] = [
  {
    title: "Welcome to WanderList!",
    description: "Let's take a quick tour to see how to use the app.",
    icon: MapPin,
  },
  {
    title: "Explore the Map",
    description:
      "Click anywhere on the map to drop a pin and add a new destination.",
    icon: MapPin,
  },
  {
    title: "Manage Your Destinations",
    description:
      "Your destinations live in the sidebar. Edit, delete, or focus on any.",
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
  const [step, setStep] = useState(0);

  const { title, description, icon: Icon } = TOUR_STEPS[step];
  const isLastStep = step === TOUR_STEPS.length - 1;

  const finish = () => onOpenChange(false);
  const handleNext = () => (isLastStep ? finish() : setStep((s) => s + 1));

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-sm">
        <DialogHeader className="space-y-2">
          <DialogTitle className="text-lg font-semibold">{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>

        <div className="flex h-12 w-full items-center justify-center rounded-lg bg-accent/10">
          <Icon className="h-6 w-6 text-accent-foreground" />
        </div>

        <DialogFooter className="flex flex-col space-y-3 sm:flex-row sm:justify-end sm:space-x-2 sm:space-y-0">
          {!isLastStep && (
            <Button variant="outline" size="sm" onClick={finish}>
              Skip
            </Button>
          )}
          <Button
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

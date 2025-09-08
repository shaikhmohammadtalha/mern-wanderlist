export const CATEGORIES = [
	"Adventure",
	"Food",
	"Relaxation",
	"Cultural",
	"Nature",
	"None", // default
] as const;

export type Category = (typeof CATEGORIES)[number];

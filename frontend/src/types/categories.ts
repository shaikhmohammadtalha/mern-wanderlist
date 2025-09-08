export const CATEGORIES = [
	"None",
	"Adventure",
	"Food",
	"Relaxation",
	"Cultural",
	"Nature",
] as const;

export type Category = (typeof CATEGORIES)[number];

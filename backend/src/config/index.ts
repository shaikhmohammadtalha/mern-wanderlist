import { config } from "dotenv";
config();

export const secrets = {
	port: process.env.PORT || 5000,
	jwtSecret: process.env.JWT_SECRET || "changeme",
	mongoUri: process.env.MONGO_URI || "",
	nodeEnv: process.env.NODE_ENV || "development",
	frontendUrl: process.env.FRONTEND_URL
		? process.env.FRONTEND_URL.split(",")
		: [],
};

export const corsOptions = {
	origin: (
		origin: string | undefined,
		callback: (err: Error | null, allow?: boolean) => void
	) => {
		if (origin) {
			console.log("CORS check for origin:", origin);
		} else {
			console.log(
				"CORS check: no origin (likely health check or server-to-server)"
			);
		}

		if (!origin) return callback(null, true); // allow server-to-server

		const allowed = secrets.frontendUrl.some((o) => {
			if (o.includes("*")) {
				// turn wildcard into regex
				const regex = new RegExp("^" + o.replace("*", ".*") + "$");
				return regex.test(origin);
			}
			return o === origin;
		});

		if (allowed) {
			console.log("✅ Allowed by CORS:", origin);
			callback(null, true);
		} else {
			console.warn("❌ Blocked by CORS:", origin);
			callback(new Error("Not allowed by CORS"));
		}
	},
	methods: "GET,HEAD,PUT,PATCH,POST,DELETE",
	credentials: true,
};

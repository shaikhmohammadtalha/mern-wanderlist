import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";
import { secrets } from "../config";

export interface AuthRequest extends Request {
	user?: { id: string };
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
): void => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			res.status(401).json({ message: "No token, authorization denied" });
			return;
		}

		const decoded = jwt.verify(token, secrets.jwtSecret) as {
			id: string;
		};
		req.user = { id: decoded.id };

		next();
	} catch {
		res.status(401).json({ message: "Invalid token" });
	}
};

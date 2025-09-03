import { Request, Response, NextFunction } from "express";
import jwt from "jsonwebtoken";

export interface AuthRequest extends Request {
	user?: { id: string };
}

export const authMiddleware = (
	req: AuthRequest,
	res: Response,
	next: NextFunction
) => {
	try {
		const token = req.header("Authorization")?.replace("Bearer ", "");

		if (!token) {
			return res
				.status(401)
				.json({ message: "No token, authorization denied" });
		}

		const decoded = jwt.verify(token, process.env.JWT_SECRET as string) as {
			id: string;
		};
		req.user = { id: decoded.id };

		next();
	} catch (err) {
		res.status(401).json({ message: "Invalid token" });
	}
};

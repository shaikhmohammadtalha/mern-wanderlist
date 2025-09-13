import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, (req: AuthRequest, res: Response) => {
	res.json({
		message: "Protected route accessed successfully!",
		user: req.user,
	});
});

export default router;

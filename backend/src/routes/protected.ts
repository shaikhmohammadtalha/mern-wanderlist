import { Router } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";

const router = Router();

router.get("/", authMiddleware, (req: AuthRequest, res) => {
	res.json({
		message: "Protected route accessed successfully!",
		user: req.user,
	});
});

export default router;

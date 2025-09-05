import { Router } from "express";

const router = Router();

router.get("/", (req, res) => {
	res.json({ message: "WanderList API is running 🚀" });
});

export default router;

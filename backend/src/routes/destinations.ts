import { Router, Response } from "express";
import { authMiddleware, AuthRequest } from "../middleware/auth";
import {
	addDestination,
	getDestinations,
	updateDestination,
	deleteDestination,
} from "../controllers/destination.controller";

const router = Router();

router.post("/", authMiddleware, (req: AuthRequest, res: Response) =>
	addDestination(req, res)
);
router.get("/", authMiddleware, (req: AuthRequest, res: Response) =>
	getDestinations(req, res)
);
router.patch("/:id", authMiddleware, (req: AuthRequest, res: Response) =>
	updateDestination(req, res)
);
router.delete("/:id", authMiddleware, (req: AuthRequest, res: Response) =>
	deleteDestination(req, res)
);

export default router;

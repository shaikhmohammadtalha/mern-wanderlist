import { Router } from "express";
import { authMiddleware } from "../middleware/auth";
import {
	addDestination,
	getDestinations,
	updateDestination,
	deleteDestination,
} from "../controllers/destination.controller";

const router = Router();

router.post("/", authMiddleware, addDestination);
router.get("/", authMiddleware, getDestinations);
router.patch("/:id", authMiddleware, updateDestination);
router.delete("/:id", authMiddleware, deleteDestination);

export default router;

import { Router, Request, Response } from "express";
import { signup, login } from "../controllers/auth.controller";

const authRoutes = Router();

authRoutes.post("/signup", (req: Request, res: Response) => signup(req, res));
authRoutes.post("/login", (req: Request, res: Response) => login(req, res));

export default authRoutes;

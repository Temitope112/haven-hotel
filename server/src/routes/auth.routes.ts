import { Router } from "express";
import {
  login,
  register,
} from "../controllers/auth.controller.js";
import {
  authenticate,
  type AuthenticatedRequest,
} from "../middleware/auth.middleware.js";

const router = Router();

router.post("/register", register);

router.post("/login", login);

router.get("/me", authenticate, (req: AuthenticatedRequest, res) => {
  res.status(200).json({
    success: true,
    user: req.user,
  });
});

export default router;
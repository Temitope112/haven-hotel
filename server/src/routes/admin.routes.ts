import {
  Router,
} from "express";

import {
  getAdminOverview,
} from "../controllers/admin.controller.js";

import {
  authenticateToken,
} from "../middleware/auth.middleware.js";

import {
  requireAdmin,
} from "../middleware/admin.middleware.js";

const router = Router();

router.use(
  authenticateToken,
);

router.use(
  requireAdmin,
);

router.get(
  "/overview",
  getAdminOverview,
);

export default router;
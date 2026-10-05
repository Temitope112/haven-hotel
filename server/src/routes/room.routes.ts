import { Router } from "express";
import {
  getRoomById,
  getRooms,
} from "../controllers/room.controller.js";

const router = Router();

router.get("/", getRooms);

router.get("/:id", getRoomById);

export default router;
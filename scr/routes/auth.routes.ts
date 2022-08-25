import express from "express";
const router = express.Router();
import validateResource from "../middleware/validateresource";
import { createSessionSchema } from "../schema/auth.schema";
import {
  createSessionHandler,
  refreshAccessTokenHandler,
} from "../controller/auth.control";

router.post(
  "/api/session",
  validateResource(createSessionSchema),
  createSessionHandler
);
router.post("/api/session/refresh", refreshAccessTokenHandler);
export default router;

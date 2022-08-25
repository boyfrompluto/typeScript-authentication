import express from "express";
import {
  createUserHandler,
  verifyUserHandler,
  forgotUserPasswordHandler,
  resetUserPasswordHandler,
  getCurrentUserHandler,
} from "../controller/user.control";
import requireUser from "../middleware/requireUser";
import validateResource from "../middleware/validateresource";
import {
  createUserSchema,
  verifyUserSchema,
  forgotUserPasswordSchema,
  resetUserPasswordSchema,
} from "../schema/user.schema";
const router = express.Router();

router.post(
  "/api/users",
  validateResource(createUserSchema),
  createUserHandler
);

router.post(
  "/api/users/forgotpassword",
  validateResource(forgotUserPasswordSchema),
  forgotUserPasswordHandler
);
router.post(
  "/api/users/reset/:id/:resetToken",
  validateResource(resetUserPasswordSchema),
  resetUserPasswordHandler
);
router.post(
  "/api/users/verify/:id/:verificationToken",
  validateResource(verifyUserSchema),
  verifyUserHandler
);
router.get("/api/users/me", requireUser, getCurrentUserHandler);

export default router;

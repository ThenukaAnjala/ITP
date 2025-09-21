import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import {
  login,
  registerEmployeeManager,
  registerInitialAdmin,
} from "../controllers/authController.js";

const router = express.Router();

router.post(
  "/login",
  [body("email").isEmail(), body("password").isString().isLength({ min: 1 })],
  login
);

router.post(
  "/admin/register",
  protect,
  authorizeRoles(ROLES.ADMIN),
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("rePassword").custom((v, { req }) => v === req.body.password),
  ],
  registerEmployeeManager
);

router.post(
  "/register-admin",
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
  ],
  registerInitialAdmin
);

export default router;

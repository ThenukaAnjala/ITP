import express from "express";
import { body } from "express-validator";
import { protect } from "../middleware/auth.js";
import { authorizeRoles } from "../middleware/roles.js";
import { ROLES } from "../models/User.js";
import {
  getAllUsers,
  registerUser,
  updateUser,
  deleteUser,
} from "../controllers/userController.js";

const router = express.Router();
const MANAGERS = [ROLES.ADMIN, ROLES.EMPLOYEE_MANAGER];

router.get("/", protect, authorizeRoles(...MANAGERS), getAllUsers);

router.post(
  "/",
  protect,
  authorizeRoles(...MANAGERS),
  [
    body("firstName").notEmpty(),
    body("lastName").notEmpty(),
    body("email").isEmail(),
    body("password").isLength({ min: 6 }),
    body("role").isIn([
      ROLES.EMPLOYEE,
      ROLES.INVENTORY_MANAGER,
      ROLES.TICKET_MANAGER,
    ]),
  ],
  registerUser
);

router.patch("/:id", protect, authorizeRoles(...MANAGERS), updateUser);

router.delete("/:id", protect, authorizeRoles(...MANAGERS), deleteUser);

export default router;


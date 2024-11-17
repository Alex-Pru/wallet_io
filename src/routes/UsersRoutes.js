import express from "express";
import UsersController from "../controllers/UsersController.js";
import { isAuthenticated } from "../middlewares/Authentication.js";

const router = express.Router();

router.put("/update", isAuthenticated, UsersController.userUpdateHandler);
router.delete("/remove", isAuthenticated, UsersController.deleteUserHandler);

export default router;

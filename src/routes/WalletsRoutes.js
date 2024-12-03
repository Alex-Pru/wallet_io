import express from "express";
import WalletsController from "../controllers/WalletsController.js";
import { isAuthenticated } from "../middlewares/Authentication.js";
import roleAuthorizationMiddleware from "../middlewares/roleAuthorizationMiddleware.js";

const router = express.Router();

router.post("/", isAuthenticated, WalletsController.createWalletHandler);
router.post(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("owner"),
  WalletsController.addUserToWalletHandler
);
router.get("/", isAuthenticated, WalletsController.getWalletsByUserHandler);
router.get(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("viewer"),
  WalletsController.getWalletDetailsHandler
);
router.put(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("owner"),
  WalletsController.updateWalletHandler
);
router.put(
  "/:walletId/changeUser",
  isAuthenticated,
  roleAuthorizationMiddleware("owner"),
  WalletsController.updateUserWalletRelationHandler
);
router.delete(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("owner"),
  WalletsController.removeWalletHandler
);
router.delete(
  "/:walletId/removeUser",
  isAuthenticated,
  roleAuthorizationMiddleware("owner"),
  WalletsController.removeUserFromWalletHandler
);
router.delete(
  "/:walletId/leaveWallet",
  isAuthenticated,
  roleAuthorizationMiddleware("viewer"),
  WalletsController.userLeaveWalletHandler
);

export default router;

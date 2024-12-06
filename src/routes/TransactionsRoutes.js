import express from "express";
import TransactionsController from "../controllers/TransactionsController.js";
import { isAuthenticated } from "../middlewares/Authentication.js";
import roleAuthorizationMiddleware from "../middlewares/roleAuthorizationMiddleware.js";

const router = express.Router();

router.post(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.createTransactionHandler
);
router.post(
  "/category/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.createCategoryHandler
);
router.get(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("viewer"),
  TransactionsController.getTransactionsPerWalletHandler
);
router.put(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.updateTransactionHandler
);
router.put(
  "/updateCategory/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.updateCategoryHandler
);
router.delete(
  "/deleteCategory/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.deleteCategoryHandler
);
router.delete(
  "/:walletId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.deleteTransactionHandler
);

export default router;

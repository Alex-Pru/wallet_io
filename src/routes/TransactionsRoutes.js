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
  roleAuthorizationMiddleware("participant"),
  TransactionsController.getTransactionsPerWalletHandler
);
router.put(
  "/:transactionId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.updateTransactionHandler
);
router.put(
  "/updateCategory/:categoryId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.updateCategoryHandler
);
router.delete(
  "/deleteCategory/:categoryId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.deleteCategoryHandler
);
router.delete(
  "/:transactionId",
  isAuthenticated,
  roleAuthorizationMiddleware("participant"),
  TransactionsController.deleteTransactionHandler
);

export default router;

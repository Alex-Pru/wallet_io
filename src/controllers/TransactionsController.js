import TransactionsModel from "../models/TransactionsModel.js";
import transactionMapper from "../utils/TransactionMapper.js";
import HttpError from "../utils/HttpError.js";

export default class TransactionsController {
  static async createCategoryHandler(req, res, next) {
    try {
      const { walletId } = req.params;
      const { newCategory } = req.body;

      newCategory.wallet = walletId;

      const categoryId = await TransactionsModel.createCategory(newCategory);

      if (!categoryId) {
        throw new HttpError("Failed to create category", 500);
      }

      return res.status(201).json({ categoryId });
    } catch (err) {
      next(err);
    }
  }

  static async deleteCategoryHandler(req, res, next) {
    try {
      const { categoryId } = req.body;

      const deleted = await TransactionsModel.deleteCategory(categoryId);

      if (!deleted) {
        throw new HttpError("Failed to delete category", 500);
      }

      return res.status(200).json({ message: "Category deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async updateCategoryHandler(req, res, next) {
    try {
      const { categoryId, updatedFields } = req.body;

      const updated = await TransactionsModel.updateCategory(
        categoryId,
        updatedFields
      );

      if (!updated) {
        throw new HttpError("Failed to update category", 500);
      }

      return res.status(200).json({ message: "Category updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async createTransactionHandler(req, res, next) {
    try {
      const { user } = req;
      const { walletId } = req.params;
      const { newTransaction } = req.body;

      newTransaction.walletId = walletId;
      newTransaction.userId = user.id;

      const formattedNewTransaction = transactionMapper(newTransaction);

      const transactionId = await TransactionsModel.createTransaction(
        formattedNewTransaction
      );

      if (!transactionId) {
        throw new HttpError("Failed to create transaction", 500);
      }

      const transaction = await TransactionsModel.getTransactionById(
        transactionId[0]
      );

      return res.status(201).json(transaction);
    } catch (err) {
      next(err);
    }
  }

  static async deleteTransactionHandler(req, res, next) {
    try {
      const { transactionId } = req.query;
      if (
        transactionId === "" ||
        transactionId == null ||
        transactionId == undefined
      ) {
        throw new HttpError("A transaction is expected", 400);
      }
      const deleted = await TransactionsModel.deleteTransaction(transactionId);

      if (!deleted) {
        throw new HttpError("Failed to delete transaction", 500);
      }

      return res
        .status(200)
        .json({ message: "Transaction deleted successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async updateTransactionHandler(req, res, next) {
    try {
      const { transactionId } = req.query;
      const { updatedFields } = req.body;

      if (!transactionId) {
        throw new HttpError("An transaction to update is expected", 400);
      }

      const formattedEditTransaction = transactionMapper(updatedFields);

      const updated = await TransactionsModel.updateTransaction(
        transactionId,
        formattedEditTransaction
      );

      if (!updated) {
        throw new HttpError("Failed to update transaction", 500);
      }

      const updatedTransaction = await TransactionsModel.getTransactionById(
        transactionId
      );

      return res.status(200).json(updatedTransaction);
    } catch (err) {
      next(err);
    }
  }

  static async getTransactionsPerWalletHandler(req, res, next) {
    try {
      const { walletId } = req.params;
      const { startDate, endDate } = req.query;

      const transactions = await TransactionsModel.getTransactionsFromWallet(
        walletId,
        startDate,
        endDate
      );

      if (!transactions) {
        throw new HttpError("Failed to fetch transactions", 500);
      }

      return res.status(200).json(transactions);
    } catch (err) {
      next(err);
    }
  }
}

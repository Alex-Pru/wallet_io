import TransactionsModel from "../models/TransactionsModel.js";
import transactionMapper from "../utils/TransactionMapper.js";

export default class TransactionsController {
  static async createCategoryHandler(req, res) {
    const { walletId } = req.params;
    const { newCategory } = req.body;

    newCategory.wallet = walletId;

    const { error, categoryId } = await TransactionsModel.createCategory(
      newCategory
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(categoryId);
  }

  static async deleteCategoryHandler(req, res) {
    const { categoryId } = req.body;

    const { error, deleted } = await TransactionsModel.deleteCategory(
      categoryId
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(deleted);
  }

  static async updateCategoryHandler(req, res) {
    const { categoryId, updatedFields } = req.body;

    const { error, updated } = await TransactionsModel.updateCategory(
      categoryId,
      updatedFields
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(updated);
  }

  static async createTransactionHandler(req, res) {
    const { user } = req;
    const { walletId } = req.params;
    const { newTransaction } = req.body;

    newTransaction.walletId = walletId;
    newTransaction.userId = user.id;

    const formattedNewTransaction = transactionMapper(newTransaction);

    const { error, transactionId } = await TransactionsModel.createTransaction(
      formattedNewTransaction
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(transactionId);
  }

  static async deleteTransactionHandler(req, res) {
    const { transactionId } = req.params;

    const { error, deleted } = await TransactionsModel.deleteTransaction(
      transactionId
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(deleted);
  }

  static async updateTransactionHandler(req, res) {
    const { transactionId } = req.params;
    const { updatedFields } = req.body;

    const formattedEditTransaction = transactionMapper(updatedFields);

    const { error, updated } = await TransactionsModel.updateTransaction(
      transactionId,
      formattedEditTransaction
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(updated);
  }

  static async getTransactionsPerWalletHandler(req, res) {
    const { walletId } = req.params;
    const { startDate, endDate } = req.query;

    const { error, transactions } =
      await TransactionsModel.getTransactionsFromWallet(
        walletId,
        startDate,
        endDate
      );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(transactions);
  }
}

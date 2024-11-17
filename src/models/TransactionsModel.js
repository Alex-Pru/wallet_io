import knex from "knex";
import { connection } from "../db/connection.js";
import errorObject from "../utils/Errors.js";

export default class TransactionsModel {
  static async createCategory(newCategory) {
    let categoryId;
    try {
      categoryId = await connection("categories").insert({
        wallet_id: newCategory.wallet,
        name: newCategory.name,
        description: newCategory.description,
      });
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return { categoryId };
  }

  static async deleteCategory(categoryId) {
    let removedRows;
    try {
      removedRows = await connection("categories")
        .where({ id: categoryId })
        .delete();
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return removedRows ? { deleted: true } : { deleted: false };
  }

  static async updateCategory(categoryId, updatedFields) {
    let updatedRows;
    try {
      updatedRows = await connection("categories")
        .where({ id: categoryId })
        .update(updatedFields);
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return updatedRows ? { updated: true } : { updated: false };
  }

  static async createTransaction(newTransaction) {
    let transactionId;

    newTransaction.updated_at = null;

    try {
      transactionId = await connection("transactions").insert(newTransaction);
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return { transactionId };
  }

  static async updateTransaction(transactionId, updatedFields) {
    let updatedRows;
    try {
      updatedRows = await connection("transactions")
        .where({ id: transactionId })
        .update(updatedFields);
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return updatedRows ? { updated: true } : { updated: false };
  }

  static async deleteTransaction(transactionId) {
    let removedRows;
    try {
      removedRows = await connection("transactions")
        .where({ id: transactionId })
        .delete();
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return removedRows ? { deleted: true } : { deleted: false };
  }

  static async getTransactionsFromWallet(
    walletId,
    startDate = knex.raw("DATE_FORMAT(NOW(), '%Y-%m-01')"),
    endingDate = knex.raw("CURDATE()")
  ) {
    let transactions;
    try {
      transactions = await connection("transactions")
        .innerJoin("users", "transactions.user_id", "users.id")
        .innerJoin("wallets", "transactions.wallet_id", "wallets.id")
        .leftJoin("categories", "transactions.category_id", "categories.id")
        .where({ wallet_id: walletId })
        .whereBetween("date", [startDate, endingDate])
        .select(
          "transactions.type",
          "transactions.amount",
          "transactions.title",
          "transactions.description",
          "transactions.date",
          "transactions.created_at",
          "users.name AS userName",
          "wallets.name AS walletName",
          "categories.name AS categoryName"
        );
    } catch (err) {
      return { error: errorObject.failedToFetchTransactions };
    }

    return { transactions };
  }
}

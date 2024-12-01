import knex from "knex";
import { connection } from "../db/connection.js";
import HttpError from "../utils/HttpError.js";

export default class TransactionsModel {
  static async createCategory(newCategory) {
    try {
      const categoryId = await connection("categories").insert({
        wallet_id: newCategory.wallet,
        name: newCategory.name,
        description: newCategory.description,
      });
      return categoryId;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to create category", 500);
    }
  }

  static async deleteCategory(categoryId) {
    try {
      const removedRows = await connection("categories")
        .where({ id: categoryId })
        .delete();
      return removedRows ? true : false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to delete category", 500);
    }
  }

  static async updateCategory(categoryId, updatedFields) {
    try {
      const updatedRows = await connection("categories")
        .where({ id: categoryId })
        .update(updatedFields);
      return updatedRows ? true : false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to update category", 500);
    }
  }

  static async createTransaction(newTransaction) {
    try {
      newTransaction.updated_at = null;
      const transactionId = await connection("transactions").insert(
        newTransaction
      );
      return transactionId;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to create transaction", 500);
    }
  }

  static async updateTransaction(transactionId, updatedFields) {
    try {
      const updatedRows = await connection("transactions")
        .where({ id: transactionId })
        .update(updatedFields);
      return updatedRows ? true : false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to update transaction", 500);
    }
  }

  static async deleteTransaction(transactionId) {
    try {
      const removedRows = await connection("transactions")
        .where({ id: transactionId })
        .delete();
      return removedRows ? true : false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to delete transaction", 500);
    }
  }

  static async getTransactionById(transactionId) {
    try {
      const newTransaction = await connection("transactions")
        .where({ id: transactionId })
        .first();

      return newTransaction;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch transaction", 500);
    }
  }

  static async getTransactionsFromWallet(
    walletId,
    startDate = knex.raw("DATE_FORMAT(NOW(), '%Y-%m-01')"),
    endingDate = knex.raw("CURDATE()")
  ) {
    try {
      const transactions = await connection("transactions")
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
      return transactions;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch transactions", 500);
    }
  }
}

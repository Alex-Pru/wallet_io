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

    const transactionObject = {
      wallet_id: newTransaction.walletId,
      user_id: newTransaction.userId,
      type: newTransaction.type,
      amount: newTransaction.amount,
      title: newTransaction.title,
      date: newTransaction.date,
      category_id: newTransaction.categoryId,
      credit_card_id: newTransaction.creditCardId,
      installments: newTransaction.installments,
      current_installment: newTransaction.currentInstallment,
      updated_at: null,
    };

    try {
      transactionId = await connection("transactions").insert(
        transactionObject
      );
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
}

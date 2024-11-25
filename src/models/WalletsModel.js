import { connection } from "../db/connection.js";
import HttpError from "../utils/HttpError.js";

export default class WalletsModel {
  static async createWallet(newWallet) {
    try {
      const walletId = await connection("wallets").insert({
        name: newWallet.name,
        description: newWallet.description,
        update_at: null,
      });
      return walletId;
    } catch (err) {
      throw new HttpError("Failed to create wallet", 500);
    }
  }

  static async getWalletsByUserId(userId) {
    try {
      const wallets = await connection("wallet_users")
        .join("wallets", "wallet_users.wallet_id", "=", "wallets.id")
        .where("wallet_users.user_id", userId)
        .select("wallets.*, wallet_users.role");
      return wallets;
    } catch (err) {
      throw new HttpError("Failed to fetch wallets by user ID", 500);
    }
  }

  static async removeWallet(walletId) {
    try {
      const removed = await connection("wallets")
        .where({ id: walletId })
        .delete();
      return removed ? true : false;
    } catch (err) {
      throw new HttpError("Failed to remove wallet", 500);
    }
  }

  static async getAllUsersByWallet(walletId) {
    try {
      const usersList = await connection("wallet_users")
        .join("users", "wallet_users.user_id", "=", "users.id")
        .where("wallet_users.wallet_id", walletId)
        .select(
          "users.name, users.email, wallet_users.added_at, wallet_users.role"
        );
      return usersList;
    } catch (err) {
      throw new HttpError("Failed to fetch users by wallet", 500);
    }
  }

  static async updateWallet(walletId, updatedFields) {
    try {
      const updatedRows = await connection("wallets")
        .where({ id: walletId })
        .update(updatedFields);
      return updatedRows ? true : false;
    } catch (err) {
      throw new HttpError("Failed to update wallet", 500);
    }
  }

  static async addUserToWallet(newUser, walletId) {
    try {
      const relationCreated = await connection("wallet_users").insert({
        wallet_id: walletId,
        user_id: newUser.id,
        role: newUser.role,
      });

      if (!relationCreated[0]) {
        throw new HttpError("Failed to add user to wallet", 400);
      }

      return true;
    } catch (err) {
      throw new HttpError("Failed to add user to wallet", 500);
    }
  }

  static async removeUserFromWallet(userId, walletId) {
    try {
      const removedRows = await connection("wallet_users")
        .where({ user_id: userId, wallet_id: walletId })
        .delete();
      return removedRows ? true : false;
    } catch (err) {
      throw new HttpError("Failed to remove user from wallet", 500);
    }
  }

  static async updateUserWalletRelation(userId, walletId, role) {
    try {
      const updatedRows = await connection("wallet_users")
        .where({
          user_id: userId,
          wallet_id: walletId,
        })
        .update({ role });
      return updatedRows ? true : false;
    } catch (err) {
      throw new HttpError("Failed to update user-wallet relation", 500);
    }
  }

  static async getUserWalletRole(userId, walletId) {
    try {
      const role = await connection("wallet_users")
        .where({ user_id: userId, wallet_id: walletId })
        .select("role");
      return role;
    } catch (err) {
      throw new HttpError("Failed to fetch user wallet role", 500);
    }
  }

  static async getWalletDetails(walletId) {
    try {
      const walletDetails = await connection("transactions")
        .where({ wallet_id: walletId })
        .whereBetween("date", [
          knex.raw("DATE_FORMAT(NOW(), '%Y-%m-01')"),
          knex.raw("LAST_DAY(NOW())"),
        ])
        .select(
          knex.raw(
            'SUM(CASE WHEN type = "income" THEN amount ELSE 0 END) AS totalIncomes'
          ),
          knex.raw(
            'SUM(CASE WHEN type = "expense" THEN amount ELSE 0 END) AS totalExpenses'
          )
        );
      return walletDetails;
    } catch (err) {
      throw new HttpError("Failed to fetch wallet details", 500);
    }
  }
}

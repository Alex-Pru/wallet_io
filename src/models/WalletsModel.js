import { connection } from "../db/connection.js";
import errorObject from "../utils/Errors.js";

export default class WalletsModel {
  static async createWallet(newWallet) {
    let walletId;
    try {
      walletId = await connection("wallets").insert({
        name: newWallet.name,
        description: newWallet.description,
        update_at: null,
      });
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return { walletId };
  }

  static async getWalletsByUserId(userId) {
    let wallets;
    try {
      wallets = await connection("wallet_users")
        .join("wallets", "wallet_users.wallet_id", "=", "wallets.id")
        .where("wallet_users.user_id", userId)
        .select("wallets.*, wallet_users.role");
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return { wallets };
  }

  static async removeWallet(walletId) {
    let removed;
    try {
      removed = await connection("wallets").where({ id: walletId }).delete();
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return removed ? { removed: true } : { removed: false };
  }

  static async getAllUsersByWallet(walletId) {
    let usersList;
    try {
      usersList = await connection("wallet_users")
        .join("users", "wallet_users.user_id", "=", "users.id")
        .where("wallet_users.wallet_id", walletId)
        .select(
          "users.name, users.email, wallet_users.added_at, wallet_users.role"
        );
    } catch (err) {
      return { error: errorObject.fetchUserFail };
    }

    return { usersList };
  }

  static async updateWallet(walletId, updatedFields) {
    let updatedRows;
    try {
      updatedRows = await connection("wallets")
        .where({ id: walletId })
        .update(updatedFields);
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return updatedRows ? { updated: true } : { updated: false };
  }

  static async addUserToWallet(newUser, walletId) {
    let relationCreated;
    try {
      relationCreated = await connection("wallet_users").insert({
        wallet_id: walletId,
        user_id: newUser.id,
        role: newUser.role,
      });
    } catch (err) {
      return;
    }

    if (!relationCreated[0]) {
      return { error: errorObject.failedToAddUser };
    }

    return relationCreated ? { addedUser: true } : { addedUser: false };
  }

  static async removeUserFromWallet(userId, walletId) {
    let removedRows;
    try {
      removedRows = await connection("wallet_users")
        .where({ user_id: userId, wallet_id: walletId })
        .delete();
    } catch (err) {
      return { error: errorObject.failedToRemoveUser };
    }

    return removedRows ? { removed: true } : { removed: false };
  }

  static async updateUserWalletRelation(userId, walletId, role) {
    let updatedRows;
    try {
      updatedRows = await connection("wallet_users")
        .where({
          user_id: userId,
          wallet_id: walletId,
        })
        .update({ role });
    } catch (err) {
      return { error: errorObject.failedToUpdateUserWalletRelation };
    }

    return updatedRows ? { updated: true } : { updated: false };
  }

  static async getUserWalletRole(userId, walletId) {
    let role;
    try {
      role = await connection("wallet_users")
        .where({ user_id: userId, wallet_id: walletId })
        .select("role");
    } catch (err) {
      return { error: errorObject.internalServerError };
    }

    return { role };
  }

  static async getWalletDetails(walletId) {
    let walletDetails;
    try {
      walletDetails = await connection("transactions")
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
    } catch (err) {
      return { error: errorObject.failedToFetchWalletDetails };
    }

    return { walletDetails };
  }
}

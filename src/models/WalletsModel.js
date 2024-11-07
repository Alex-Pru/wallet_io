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

  static async addUsers(newUsers) {
    let relationsCreated;
    try {
      relationsCreated = await connection("wallet_users").insert(newUsers);
    } catch (err) {
      return;
    }

    if (relationsCreated[0] !== newUsers.length) {
      return { error: errorObject.failedToAddUsers };
    }

    return relationsCreated ? { addedUsers: true } : { addedUsers: false };
  }

  static async removeUser(user) {
    let removedRows;
    try {
      removedRows = await connection("wallet_users")
        .where({ user_id: user.id, wallet_id: user.walletId })
        .delete();
    } catch (err) {
      return { error: errorObject.failedToRemoveUser };
    }

    return removedRows ? { removed: true } : { removed: false };
  }
}

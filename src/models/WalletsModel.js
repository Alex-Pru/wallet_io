import { connection } from "../db/connection.js";
import HttpError from "../utils/HttpError.js";

export default class WalletsModel {
  static async createWallet(newWallet) {
    const today = new Date().toISOString().slice(0, 10);
    try {
      const walletId = await connection("wallets").insert({
        name: newWallet.name,
        description: newWallet.description,
        created_at: today,
        updated_at: null,
      });
      return walletId;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to create wallet", 500);
    }
  }

  static async getWalletById(walletId) {
    try {
      const wallet = await connection("wallets")
        .where({ id: walletId })
        .first();

      wallet.created_at = wallet.created_at.toISOString().split("T")[0];
      wallet.updated_at = wallet.updated_at
        ? wallet.updated_at.toISOString().split("T")[0]
        : null;
      return wallet;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch wallet", 500);
    }
  }

  static async getWalletsByUserId(userId) {
    try {
      const wallets = await connection("wallet_users")
        .join("wallets", "wallet_users.wallet_id", "=", "wallets.id")
        .where("wallet_users.user_id", userId)
        .select(
          "wallets.id",
          "wallets.name",
          "wallets.description",
          "wallets.created_at",
          "wallets.updated_at",
          "wallet_users.role"
        );
      return wallets ? wallets : [];
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch wallets by user", 500);
    }
  }

  static async removeWallet(walletId) {
    try {
      const removed = await connection("wallets")
        .where({ id: walletId })
        .delete();
      return removed ? true : false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to remove wallet", 500);
    }
  }

  static async getAllUsersByWallet(walletId) {
    try {
      const usersList = await connection("wallet_users")
        .join("users", "wallet_users.user_id", "=", "users.id")
        .where("wallet_users.wallet_id", walletId)
        .select(
          "users.id",
          "users.name",
          "users.email",
          "wallet_users.added_at",
          "wallet_users.role"
        );
      return usersList;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch users by wallet", 500);
    }
  }

  static async getNumberOfUsersByWallet(walletId) {
    try {
      const numberOfUser = await connection("wallet_users")
        .where("wallet_users.wallet_id", walletId)
        .count("* as usersNumber");

      return Number(numberOfUser[0].usersNumber);
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch the number of users", 500);
    }
  }

  static async updateWallet(walletId, updatedFields) {
    const today = new Date().toISOString().slice(0, 10);
    updatedFields.updated_at = today;
    try {
      const updatedRows = await connection("wallets")
        .where({ id: walletId })
        .update(updatedFields);
      return updatedRows ? true : false;
    } catch (err) {
      console.log(err);
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

      if (
        relationCreated[0] === false ||
        relationCreated[0] === null ||
        relationCreated[0] === undefined
      ) {
        throw new HttpError("Failed to add user to wallet", 400);
      }

      return true;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to add user to wallet", 500);
    }
  }

  static async removeMultipleWallets(walletsIdList) {
    if (walletsIdList === 0) return true;
    try {
      const removedRows = await connection("wallets")
        .whereIn("id", walletsIdList)
        .delete();

      return walletsIdList.length === removedRows;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to remove multiple wallets", 500);
    }
  }

  static async removeUserFromWallet(userId, walletId) {
    try {
      const removedRows = await connection("wallet_users")
        .where({ user_id: userId, wallet_id: walletId })
        .delete();
      return removedRows ? true : false;
    } catch (err) {
      console.log(err);
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
      console.log(err);
      throw new HttpError("Failed to update user-wallet relation", 500);
    }
  }

  static async getUserByIdFromWallet(userId, walletId) {
    try {
      const user = await connection("wallet_users as ws")
        .join("users", "ws.user_id", "=", "users.id")
        .where("ws.wallet_id", walletId) // Substitua walletId pelo valor da variável
        .andWhere("ws.user_id", userId) // Substitua userId pelo valor da variável
        .select("ws.role", "users.*") // Retorna todas as colunas de ambas as tabelas
        .first();

      return user || false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to get user from wallet", 500);
    }
  }

  static async getUserWalletRole(userId, walletId) {
    try {
      const role = await connection("wallet_users")
        .where({ user_id: userId, wallet_id: walletId })
        .first("role");
      return role;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch user wallet role", 500);
    }
  }

  static async getWalletDetails(walletId) {
    try {
      const walletDetails = await connection("wallets")
        .where("wallets.id", walletId) // Filtra pela carteira
        .first();

      // Retorna o primeiro registro ou null
      return walletDetails || null;
    } catch (err) {
      console.error(err);
      throw new HttpError("Failed to fetch wallet details", 500);
    }
  }
}

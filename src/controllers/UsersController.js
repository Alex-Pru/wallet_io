import express from "express";
import UsersModel from "../models/UsersModel.js";
import HttpError from "../utils/HttpError.js";
import WalletsModel from "../models/WalletsModel.js";

export default class UsersController {
  static async userUpdateHandler(req, res, next) {
    try {
      const { user } = req;
      const { updateFields } = req.body;

      // Validação básica
      if (!user.id) {
        throw new HttpError("User ID is required", 400);
      }

      if (!updateFields || Object.keys(updateFields).length === 0) {
        throw new HttpError("Update fields are required", 400);
      }

      const updated = await UsersModel.updateUser(user.id, updateFields);

      if (!updated) {
        throw new HttpError("Failed to update user", 500);
      }

      const updatedUser = await UsersModel.getUserById(user.id);

      return res.status(200).json(updatedUser);
    } catch (err) {
      next(err);
    }
  }

  static async getUserData(req, res, next) {
    try {
      const { user } = req;

      return res.status(200).json(user);
    } catch (err) {
      next(err);
    }
  }

  static async deleteUserHandler(req, res, next) {
    try {
      const { user } = req;

      // Validação básica
      if (!user.id) {
        throw new HttpError("User ID is required", 400);
      }

      const walletsToExclude = [];

      const userWallets = await WalletsModel.getWalletsByUserId(user.id);

      for (const wallet of userWallets) {
        const numberOfUsers = await WalletsModel.getNumberOfUsersByWallet(
          wallet.id
        );

        if (numberOfUsers === 1 || numberOfUsers === 0)
          walletsToExclude.push(wallet.id);
      }

      const removedWallets = await WalletsModel.removeMultipleWallets(
        walletsToExclude
      );

      if (!removedWallets)
        throw new HttpError("Failed to delete empty wallets", 500);

      const deleted = await UsersModel.removeUser(user.id);

      if (!deleted) {
        throw new HttpError("Failed to delete user", 500);
      }

      // Remover sessões associadas no banco
      const sessionStore = req.sessionStore; // Connect-session-knex usa sessionStore
      if (sessionStore && typeof sessionStore.destroy === "function") {
        await new Promise((resolve, reject) => {
          sessionStore.destroy(req.sessionID, (err) => {
            if (err)
              return reject(new HttpError("Failed to destroy session", 500));
            resolve();
          });
        });
      }

      // Destruir a sessão ativa no cliente
      req.session.destroy((err) => {
        if (err) {
          throw new HttpError("Failed to destroy session", 500);
        }

        res.clearCookie("connect.sid"); // Limpar o cookie da sessão
        return res.status(200).json({ message: "User deleted successfully" });
      });
    } catch (err) {
      next(err);
    }
  }
}

import WalletsModel from "../models/WalletsModel.js";
import HttpError from "../utils/HttpError.js";

export default class WalletsController {
  static async createWalletHandler(req, res, next) {
    try {
      const { user } = req;
      const { newWallet } = req.body;

      const walletId = await WalletsModel.createWallet(newWallet);

      if (!walletId) {
        throw new HttpError("Failed to create wallet", 500);
      }

      await WalletsModel.addUserToWallet({
        userId: user.id,
        walletId: walletId[0],
        role: "owner",
      });

      return res.status(201).json({ message: "Wallet created successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async getWalletsByUserHandler(req, res, next) {
    try {
      const { user } = req;

      const { wallets } = await WalletsModel.getWalletsByUserId(user.id);

      return res.status(200).json(wallets);
    } catch (err) {
      next(err);
    }
  }

  static async removeWalletHandler(req, res, next) {
    try {
      const { walletId } = req.params;

      const removed = await WalletsModel.removeWallet(walletId);

      if (!removed) {
        throw new HttpError("Failed to remove wallet", 500);
      }

      return res.status(200).json({ message: "Wallet removed successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async addUserToWalletHandler(req, res, next) {
    try {
      const { newUser } = req.body;
      const { walletId } = req.params;

      const addedUser = await WalletsModel.addUserToWallet(newUser, walletId);

      if (!addedUser) {
        throw new HttpError("Failed to add user to wallet", 500);
      }

      return res
        .status(200)
        .json({ message: "User added to wallet successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async removeUserFromWalletHandler(req, res, next) {
    try {
      const { walletId } = req.params;
      const { id: userId } = req.query;

      const removed = await WalletsModel.removeUserFromWallet(userId, walletId);

      if (!removed) {
        throw new HttpError("Failed to remove user from wallet", 500);
      }

      return res
        .status(200)
        .json({ message: "User removed from wallet successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async updateUserWalletRelationHandler(req, res, next) {
    try {
      const { walletId } = req.params;
      const { id: userId } = req.query;
      const { role } = req.body;

      const updated = await WalletsModel.updateUserWalletRelation(
        userId,
        walletId,
        role
      );

      if (!updated) {
        throw new HttpError("Failed to update user-wallet relation", 500);
      }

      return res
        .status(200)
        .json({ message: "User-wallet relation updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async updateWalletHandler(req, res, next) {
    try {
      const { walletId } = req.params;
      const { updatedFields } = req.body;

      const updated = await WalletsModel.updateWallet(walletId, updatedFields);

      if (!updated) {
        throw new HttpError("Failed to update wallet", 500);
      }

      return res.status(200).json({ message: "Wallet updated successfully" });
    } catch (err) {
      next(err);
    }
  }

  static async getWalletDetailsHandler(req, res, next) {
    try {
      const { walletId } = req.params;

      const walletDetails = await WalletsModel.getWalletDetails(walletId);

      return res.status(200).json(walletDetails);
    } catch (err) {
      next(err);
    }
  }
}

import TransactionsModel from "../models/TransactionsModel.js";
import UsersModel from "../models/UsersModel.js";
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

      await WalletsModel.addUserToWallet({ ...user, role: "owner" }, walletId);

      const createdWallet = await WalletsModel.getWalletById(walletId[0]);

      return res.status(201).json(createdWallet);
    } catch (err) {
      next(err);
    }
  }

  static async getWalletsByUserHandler(req, res, next) {
    try {
      const { user } = req;

      const wallets = await WalletsModel.getWalletsByUserId(user.id);

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

      const user = await UsersModel.getUsersByEmail([newUser.email]);
      const isAlreadyInWallet = await WalletsModel.getUserByIdFromWallet(
        user[0].id,
        walletId
      );

      if (isAlreadyInWallet)
        throw new HttpError("User is already in wallet", 400);

      const addedUser = await WalletsModel.addUserToWallet(
        { id: user[0].id, role: newUser.role },
        walletId
      );

      if (!addedUser) {
        throw new HttpError("Failed to add user to wallet", 500);
      }

      const userWithRole = await WalletsModel.getUserByIdFromWallet(
        user[0].id,
        Number(walletId)
      );

      return res.status(200).json(userWithRole);
    } catch (err) {
      next(err);
    }
  }

  static async removeUserFromWalletHandler(req, res, next) {
    try {
      const { walletId } = req.params;
      const { id: userId } = req.query;
      const { user } = req;

      if (Number(userId) === user.id) {
        throw new HttpError("To leave a wallet, go to the home screen", 400);
      }

      if (!userId) {
        throw new HttpError("An user id must be provided", 400);
      }

      const removed = await WalletsModel.removeUserFromWallet(userId, walletId);

      const usersFromWallet = await WalletsModel.getNumberOfUsersByWallet(
        walletId
      );

      if (usersFromWallet === 0) {
        await WalletsModel.removeWallet(walletId);
      }

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

  static async userLeaveWalletHandler(req, res, next) {
    try {
      const { walletId } = req.params;
      const { user } = req;

      const removed = await WalletsModel.removeUserFromWallet(
        user.id,
        walletId
      );

      const usersFromWallet = await WalletsModel.getNumberOfUsersByWallet(
        walletId
      );

      if (usersFromWallet === 0) {
        await WalletsModel.removeWallet(walletId);
      }

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
      const { user } = req;
      const { walletId } = req.params;
      const { id: userId } = req.query;
      const { role } = req.body;

      if (Number(userId) === user.id) {
        throw new HttpError(
          "You may not change your own relation to a wallet",
          400
        );
      }

      const updated = await WalletsModel.updateUserWalletRelation(
        userId,
        walletId,
        role
      );

      if (!updated) {
        throw new HttpError("Failed to update user-wallet relation", 500);
      }

      const updatedUser = await WalletsModel.getUserByIdFromWallet(
        userId,
        walletId
      );

      return res.status(200).json(updatedUser);
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

      const changedWallet = await WalletsModel.getWalletById(walletId);

      return res.status(200).json(changedWallet);
    } catch (err) {
      next(err);
    }
  }

  static async getWalletDetailsHandler(req, res, next) {
    try {
      const { walletId } = req.params;

      const walletDetails = await WalletsModel.getWalletDetails(walletId);

      const categories = await TransactionsModel.getCategoriesByWallet(
        walletId
      );

      const users = await WalletsModel.getAllUsersByWallet(walletId);

      return res.status(200).json({ ...walletDetails, categories, users });
    } catch (err) {
      next(err);
    }
  }
}

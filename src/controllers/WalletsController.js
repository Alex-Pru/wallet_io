import WalletsModel from "../models/WalletsModel.js";

export default class WalletsController {
  static async createWalletHandler(req, res) {
    const { user, body } = req;

    const { error: createWalletError, walletId } =
      await WalletsModel.createWallet(body);

    if (createWalletError) {
      return res
        .status(createWalletError.status)
        .json({ message: createWalletError.message });
    }

    const { error: relateUserToWalletError } =
      await WalletsModel.addUserToWallet({
        userId: user.id,
        walletId: walletId[0],
        role: "owner",
      });

    if (relateUserToWalletError) {
      return res
        .status(relateUserToWalletError.status)
        .json({ message: relateUserToWalletError.message });
    }

    return res.status(201).json("Wallet created successfully");
  }

  static async getWalletsByUserHandler(req, res) {
    const { user } = req;

    const { error, wallets } = await WalletsModel.getWalletsByUserId(user.id);

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(wallets);
  }

  static async removeWalletHandler(req, res) {
    const { walletId } = req.params;

    const { error: walletRemoveError, removed } =
      await WalletsModel.removeWallet(walletId);

    if (walletRemoveError) {
      return res
        .status(walletRemoveError.status)
        .json({ message: walletRemoveError.message });
    }

    return res.status(200).json(removed);
  }

  static async addUserToWalletHandler(req, res) {
    const { newUser } = req.body;
    const { walletId } = req.params;

    const { error: relateUserWalletError, addedUser } =
      await WalletsModel.addUserToWallet(newUser, walletId);

    if (relateUserWalletError) {
      return res
        .status(relateUserWalletError.status)
        .json({ message: relateUserWalletError.message });
    }

    return res.status(200).json(addedUser);
  }

  static async removeUserFromWalletHandler(req, res) {
    const { walletId } = req.params;
    const { id: userId } = req.query;

    const { error, removed } = await WalletsModel.removeUserFromWallet(
      userId,
      walletId
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(removed);
  }

  static async updateUserWalletRelationHandler(req, res) {
    const { walletId } = req.params;
    const { id: userId } = req.query;
    const { role } = req.body;

    const { error, updated } = await WalletsModel.updateUserWalletRelation(
      userId,
      walletId,
      role
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(updated);
  }

  static async updateWalletHandler(req, res) {
    const { walletId } = req.params;
    const { updatedFields } = req.body;

    const { error, updated } = await WalletsModel.updateWallet(
      walletId,
      updatedFields
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(updated);
  }

  static async getWalletDetailsHandler(req, res) {
    const { walletId } = req.params;

    const { error, walletDetails } = await WalletsModel.getWalletDetails(
      walletId
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json(walletDetails);
  }
}

import express from "express";
import UsersModel from "../models/UsersModel.js";
import HttpError from "../utils/HttpError.js";

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

      const deleted = await UsersModel.removeUser(user.id);

      if (!deleted) {
        throw new HttpError("Failed to delete user", 500);
      }

      return res.status(200).json({ message: "User deleted successfully" });
    } catch (err) {
      next(err);
    }
  }
}

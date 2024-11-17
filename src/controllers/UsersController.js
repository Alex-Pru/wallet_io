import express from "express";
import UsersModel from "../models/UsersModel.js";

export default class UsersController {
  static async userUpdateHandler(req, res) {
    const { updateFields, user } = req;

    const { error, updated } = await UsersModel.updateUser(
      user.id,
      updateFields
    );

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json("Updated User successfully");
  }

  static async deleteUserHandler(req, res) {
    const { user } = req;
    const { error, deleted } = await UsersModel.removeUser(user.id);

    if (error) {
      return res.status(error.status).json({ message: error.message });
    }

    return res.status(200).json("User deleted successfully");
  }
}

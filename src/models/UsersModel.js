import { connection } from "../db/connection.js";
import HttpError from "../utils/HttpError.js";

export default class UsersModel {
  static async getUserByGoogleId(googleId) {
    try {
      const user = await connection("users")
        .where({ google_id: googleId })
        .first();
      return user;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch user by Google ID", 500);
    }
  }

  static async getUserById(id) {
    try {
      const user = await connection("users").where({ id }).first();
      return user;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch user by ID", 500);
    }
  }

  static async insertNewUser(userObject) {
    try {
      const userId = await connection("users").insert({
        google_id: userObject.googleId,
        name: userObject.name,
        email: userObject.email,
        updated_at: null,
      });
      return userId;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to insert new user", 500);
    }
  }

  static async removeUser(userId) {
    try {
      const result = await connection("users").where({ id: userId }).delete();
      return result ? true : false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to remove user", 500);
    }
  }

  static async updateUser(userId, updatedFields) {
    try {
      const updatedRows = await connection("users")
        .where({ id: userId })
        .update({ ...updatedFields, updated_at: connection.fn.now() });
      return updatedRows ? true : false;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to update user", 500);
    }
  }

  static async getUsersByEmail(emails) {
    try {
      const usersIDs = await connection("users")
        .select("id")
        .whereIn("email", emails);
      return usersIDs;
    } catch (err) {
      console.log(err);
      throw new HttpError("Failed to fetch users by email", 500);
    }
  }
}

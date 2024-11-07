import { connection } from "../db/connection.js";
import errorObject from "../utils/Errors.js";

export default class UsersModel {
  static async getUserByGoogleId(googleId) {
    let user;
    try {
      user = await connection("users").where({ google_id: googleId }).first();
    } catch (err) {
      return { error: errorObject.fetchUserFail };
    }
    return { user };
  }

  static async getUserById(id) {
    let user;
    try {
      user = await connection("users").where({ id }).first();
    } catch (err) {
      return { error: errorObject.fetchUserFail };
    }

    return { user };
  }

  static async insertNewUser(userObject) {
    let userId;
    try {
      userId = await connection("users").insert({
        google_id: userObject.googleId,
        name: userObject.name,
        email: userObject.email,
        updated_at: null,
      });
    } catch (err) {
      return { error: errorObject.internalServerError };
    }
    return { userId };
  }

  static async removeUser(userId) {
    let result;
    try {
      result = await connection("users").where({ id: userId }).delete();
    } catch (err) {
      switch (err.message) {
        case "Failed to delete user":
          return { error: errorObject.failedToDelete };
          break;
        default:
          return { error: errorObject.internalServerError };
          break;
      }
    }
    return result ? { deleted: true } : { deleted: false };
  }

  static async updateUser(userId, updatedFields) {
    let updatedRows;
    try {
      updatedRows = await connection("users")
        .where({ id: userId })
        .update(updatedFields);
    } catch (err) {
      return { error: errorObject.internalServerError };
    }
    return updatedRows ? { updated: true } : { updated: false };
  }

  static async getUsersByEmail(emails) {
    let usersIDs;
    try {
      usersIDs = await connection("users")
        .select("id")
        .whereIn("email", emails);
    } catch (err) {
      return { error: errorObject.fetchUserFail };
    }

    return { usersIDs };
  }
}

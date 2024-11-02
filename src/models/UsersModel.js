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
}

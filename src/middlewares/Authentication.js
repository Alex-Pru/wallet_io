import errorObject from "../utils/Errors.js";

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  res
    .status(errorObject.userNotAuthorized.status)
    .send(errorObject.userNotAuthorized.message);
}

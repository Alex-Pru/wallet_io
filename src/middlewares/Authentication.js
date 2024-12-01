import HttpError from "../utils/HttpError.js";

export function isAuthenticated(req, res, next) {
  if (req.isAuthenticated()) {
    return next();
  }
  const error = new HttpError("Authenticate to proceeed", 403);
  return next(error);
}

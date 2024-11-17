import express from "express";
import errorObject from "../utils/Errors.js";

const roleAuthorizationMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const { user } = req;
    const { walletId } = req.params;

    const { error: userRoleError, role } = await WalletsModel.getUserWalletRole(
      user.id,
      walletId
    );

    if (userRoleError) {
      return res
        .status(userRoleError.status)
        .json({ message: userRoleError.message });
    }

    const rolesHierarchy = ["viewer", "participant", "owner"];
    const userRoleIndex = rolesHierarchy.indexOf(role);
    const requiredRoleIndex = rolesHierarchy.indexOf(requiredRole);

    if (userRoleIndex === -1 || requiredRoleIndex === -1) {
      return res
        .status(errorObject.unauthorizedRole.status)
        .json({ message: "Invalid role in request or user role." });
    }

    if (userRoleIndex < requiredRoleIndex) {
      return res
        .status(errorObject.unauthorizedRole.status)
        .json({ message: errorObject.unauthorizedRole.message });
    }

    next();
  };
};

export default roleAuthorizationMiddleware;

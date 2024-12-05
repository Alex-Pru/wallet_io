import express from "express";
import WalletsModel from "../models/WalletsModel.js";
import HttpError from "../utils/HttpError.js";

const roleAuthorizationMiddleware = (requiredRole) => {
  return async (req, res, next) => {
    const { user } = req;
    const { walletId } = req.params;

    try {
      // Obtém o papel do usuário na carteira
      const { role } = await WalletsModel.getUserWalletRole(user.id, walletId);

      // Verifica se a função retornou uma role válida
      const rolesHierarchy = ["viewer", "participant", "owner"];
      const userRoleIndex = rolesHierarchy.indexOf(role);
      const requiredRoleIndex = rolesHierarchy.indexOf(requiredRole);

      if (userRoleIndex === -1 || requiredRoleIndex === -1) {
        const error = new HttpError(
          "Invalid role in request or user role.",
          401
        );
        throw error;
      }

      // Verifica se o papel do usuário é suficiente para a ação requisitada
      if (userRoleIndex < requiredRoleIndex) {
        const error = new HttpError("Role not authorized to action", 401);
        throw error;
      }

      // Role autorizada, passa para o próximo middleware ou rota
      next();
    } catch (err) {
      // Encaminha o erro para o middleware global de erros
      next(err);
    }
  };
};

export default roleAuthorizationMiddleware;

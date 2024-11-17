const errorObject = {
  fetchUserFail: {
    message: "Failed To Fetch Users",
    status: 500,
  },
  internalServerError: {
    message: "Internal Server Error",
    status: 500,
  },
  failedToDelete: {
    message: "Failed To Delete",
    status: 500,
  },
  failedToAddUser: {
    message: "Failed to Add User To Wallet",
    status: 500,
  },
  failedToRemoveUser: {
    message: "Failed to Remove User From Wallet",
    status: 500,
  },
  userNotAuthorized: {
    message: "Not Authorized, Login to Proceed",
    status: 401,
  },
  unauthorizedRole: {
    message: "Your role is not authorized to do that",
    status: 401,
  },
  failedToFetchTransactions: {
    message: "Failed to fetch transactions",
    status: 500,
  },
  failedToFetchWalletDetails: {
    message: "Failed to fetch wallet details",
    status: 500,
  },
  failedToUpdateUserWalletRelation: {
    message: "Failed to update user relation to wallet",
    status: 500,
  },
};

export default errorObject;

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
  failedToAddUsers: {
    message: "Failed to Add Users To Wallet",
    status: 500,
  },
  failedToRemoveUser: {
    message: "Failed to Remove User From Wallet",
    status: 500,
  },
};

export default errorObject;

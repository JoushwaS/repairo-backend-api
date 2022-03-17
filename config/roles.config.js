const allRoles = {
  admin: [
    "*",

    "createUser",

    "updateUserAccountImage",
    "getAllUsers",
    "UpdateUserAccountLocation",
    "updateUserAccountDetails",
    "createService",
    "UserInfoDetails",
  ],
  user: ["UpdateUserAccountLocation"],
  expert: ["UpdateUserAccountLocation"],
};
const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
module.exports = {
  roles,
  roleRights,
};

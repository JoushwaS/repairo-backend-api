const allRoles = {
  admin: [
    "*",

    "createUser",

    "updateUserAccountImage",
    "getAllUsers",
    "UpdateUserAccountLocation",
    "updateUserAccountDetails",

    "UserInfoDetails",
  ],
  user: ["UpdateUserAccountLocation"],
};
const roles = Object.keys(allRoles);
const roleRights = new Map(Object.entries(allRoles));
module.exports = {
  roles,
  roleRights,
};

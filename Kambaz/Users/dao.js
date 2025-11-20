import { v4 as uuidv4 } from "uuid";
import model from "./model.js";
export default function UsersDao(db) {
  // let { users } = db;
  const createUser = (user) => {
    const { _id, ...userData } = user;
    const newUser = {
      ...userData,
      role: user.role || "STUDENT", // Default role
    };
    return model.create(newUser);
  };
  const findAllUsers = () => model.find();
  const findUserById = (userId) => model.findById(userId);
  const findUserByUsername = (username) =>
    model.findOne({ username: username });
  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password });

  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });
  const deleteUser = (userId) => model.findByIdAndDelete({ _id: userId });
  const findUsersByRole = (role) => model.find({ role: role });
  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i"); // 'i' makes it case-insensitive
    return model.find({
      $or: [{ firstName: { $regex: regex } }, { lastName: { $regex: regex } }],
    });
  };

  return {
    createUser,
    findAllUsers,
    findUserById,
    findUserByUsername,
    findUserByCredentials,
    updateUser,
    deleteUser,
    findUsersByRole,
    findUsersByPartialName,
  };
}

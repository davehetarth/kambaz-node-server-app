import model from "./model.js";
import { v4 as uuidv4 } from "uuid";

// FIX 1: Removed the unnecessary 'db' parameter from the function signature.
export default function UsersDao() {
  // CRITICAL FIX: The line 'let { users } = db;' is now removed, stopping the crash.

  const createUser = (user) => {
    // Ensures a unique string ID is generated for MongoDB persistence
    const newUser = { ...user, _id: user._id || uuidv4() };
    return model.create(newUser);
  };

  // FIX 2: Added .lean() to all read operations for safe JSON serialization
  const findAllUsers = () => model.find().lean();
  const findUserById = (userId) => model.findById(userId).lean();
  const findUserByUsername = (username) =>
    model.findOne({ username: username }).lean();
  const findUserByCredentials = (username, password) =>
    model.findOne({ username, password }).lean();

  const updateUser = (userId, user) =>
    model.updateOne({ _id: userId }, { $set: user });

  const deleteUser = (userId) => model.findByIdAndDelete(userId);

  const findUsersByRole = (role) => model.find({ role: role }).lean();

  const findUsersByPartialName = (partialName) => {
    const regex = new RegExp(partialName, "i");
    return model
      .find({
        $or: [
          { firstName: { $regex: regex } },
          { lastName: { $regex: regex } },
        ],
      })
      .lean();
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

// Path: full-stack-basic\react-and-express-itemlist\backend\src\database\database_operations_user.js

import bcyptjs from "bcryptjs";
import { db } from "./prisma/prismaClient.js";

// Register User
export async function registerUser(name, password, email, isAdmin = false) {
  if (!name || !password || !email) {
    throw new Error("Name, password, and email are required");
  }

  // Check if user already exists
  const existingUser = await getUserByEmail(email);
  if (existingUser) {
    throw new Error("User already exists");
  }

  return await db.user.create({
    data: { name, password: await bcyptjs.hash(password, 10), email, isAdmin },
  });
}

// Login User
export async function loginUser(email, password) {
  if (!email || !password) {
    throw new Error("Email and password are required");
  }

  // Check if user exists
  const existingUser = await getUserByEmail(email);
  if (!existingUser) {
    throw new Error("User does not exist");
  }

  // Check if password is correct
  const isPasswordCorrect = await bcyptjs.compare(
    password,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Password is incorrect");
  }

  return existingUser;
}

// Read
export async function getUserByEmail(email) {
  if (!email) {
    throw new Error("Email is required");
  }

  return await db.user.findUnique({ where: { email } });
}

// Read
export async function getUserById(id) {
  if (!id) {
    throw new Error("ID is required");
  }

  return await db.user.findUnique({ where: { id } });
}


// UpdatePassword
export async function updateUserPassword(id, oldPassword, newPassword) {

  if (!id || !oldPassword || !newPassword) {
    throw new Error("ID, oldPassword, and newPassword are required");
  }

  // Check if user exists
  const existingUser = await getUserById(id);
  if (!existingUser) {
    throw new Error("User does not exist");
  }

  // Check if password is correct
  const isPasswordCorrect = await bcyptjs.compare(
    oldPassword,
    existingUser.password
  );
  if (!isPasswordCorrect) {
    throw new Error("Password is incorrect");
  }

  return await db.user.update({
    where: { id },
    data: { password: await bcyptjs.hash(newPassword, 10) },
  });
}
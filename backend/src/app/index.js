// path: backend\src\app\index.js

import express from "express";
import asyncHandler from "express-async-handler";
import { db } from "../database/prisma/prismaClient.js";


const app = express();

app.use(express.json()); // Add this line to parse incoming JSON data

// Get all Items
app.get("/items", asyncHandler(async (req, res) => {
  console.log("☆☆☆☆ GET /items");
  const items = await db.item.findMany();
  res.json(items);
}));

export default app;

import express from "express";
import {
  getAllCategories,
  postCategory,
  updateCategory,
  deleteCategory
} from "../controllers/CategoryController.js";

const categoryRouter = express.Router();

// GET all categories
categoryRouter.get("/", getAllCategories);

// POST a new category
categoryRouter.post("/", postCategory);

// PUT update a category by categoryId
categoryRouter.put("/:categoryId", updateCategory);

// DELETE a category by categoryId
categoryRouter.delete("/:categoryId", deleteCategory);

export default categoryRouter;


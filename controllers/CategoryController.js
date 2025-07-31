import Category from "../models/Category.js";

// GET all categories
export async function getAllCategories(req, res) {
  try {
    const categories = await Category.find();
    res.status(200).json(categories);
  } catch (err) {
    res.status(500).json({ msg: "Failed to fetch categories", error: err.message });
  }
}

// POST create new category
export async function postCategory(req, res) {
  if (!req.user) return res.status(401).json({ msg: "Please login first" });
  if (req.user.role !== "Admin") return res.status(403).json({ msg: "You are not admin" });
 
  const { categoryName } = req.body;

  try {
    // Get the last categoryId from DB
    const lastCategory = await Category.find().sort({ categoryId: -1 }).limit(1);
    let categoryId;

    if (lastCategory.length === 0) {
      categoryId = "C001";
    } else {
      const lastId = lastCategory[0].categoryId;
      const nextNum = parseInt(lastId.substring(1)) + 1;
      categoryId = "C" + nextNum.toString().padStart(3, "0");
    }
 
    const category = new Category({ categoryId, categoryName });
    await category.save();

    res.status(201).json({ msg: "Category created", category });
  } catch (err) {
    res.status(500).json({ msg: "Failed to create category", error: err.message });
  }
}

// PUT update category by categoryId
export async function updateCategory(req, res) {
  if (!req.user) return res.status(401).json({ msg: "Please login first" });
  if (req.user.role !== "Admin") return res.status(403).json({ msg: "You are not admin" });

  const id = req.params.categoryId;
  const { categoryName } = req.body;

  try {
    const updated = await Category.findOneAndUpdate(
      { categoryId: id },
      { categoryName },
      { new: true }
    );

    if (!updated) return res.status(404).json({ msg: "Category not found" });

    res.status(200).json({ msg: "Category updated", category: updated });
  } catch (err) {
    res.status(500).json({ msg: "Failed to update category", error: err.message });
  }
}

// DELETE category by categoryId
export async function deleteCategory(req, res) {
  if (!req.user) return res.status(401).json({ msg: "Please login first" });
  if (req.user.role !== "Admin") return res.status(403).json({ msg: "You are not admin" });

  const id = req.params.categoryId;

  try {
    const result = await Category.deleteOne({ categoryId: id });
    if (result.deletedCount === 0)
      return res.status(404).json({ msg: "Category not found" });

    res.status(200).json({ msg: "Category deleted" });
  } catch (err) {
    res.status(500).json({ msg: "Failed to delete category", error: err.message });
  }
}

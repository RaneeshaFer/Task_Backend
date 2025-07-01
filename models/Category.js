import mongoose from "mongoose";

const categorySchema = new mongoose.Schema({
  categoryId: {
    type: String,
    required: true,
    unique: true
  },
  categoryName: {
    type: String,
    required: true
  }
});

const Category = mongoose.model("Category", categorySchema);
export default Category;

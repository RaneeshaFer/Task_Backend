import express from "express";
import {
  getAllTasks,
  postTask,
  deleteTask,
  updateTask,
  getTasksByCategory 
} from "../controllers/TaskController.js";

const taskRouter = express.Router();

// ✅ GET all tasks
taskRouter.get("/", getAllTasks);

// ✅ POST new task
taskRouter.post("/", postTask);

// ✅ DELETE task by taskId
taskRouter.delete("/:taskId", deleteTask);

// ✅ PUT (update) task by taskId
taskRouter.put("/:taskId", updateTask);
taskRouter.get('/byCategory/:categoryId', getTasksByCategory);




export default taskRouter;

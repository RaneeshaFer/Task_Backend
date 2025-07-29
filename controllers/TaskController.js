import Task from "../models/Task.js";
import Category from "../models/Category.js";

// ✅ Get All Tasks

export const getAllTasks = async (req, res) => {
  try {
    // Fetch tasks with category details populated
    const tasks = await Task.find().populate('category');
    res.status(200).json(tasks);
  } catch (error) {
    res.status(500).json({ msg: 'Failed to fetch tasks', error: error.message });
  }
};


// ✅ Create Task
export async function postTask(req, res) {
  if (req.user==null) {
    res.json({ msg: "Please Login First" });
    return;
  }

  if (req.user.role !== "Admin") {
    res.json({ msg: "You are not admin" });
    return;
  }

  let lastTaskId = await Task.find().sort({ taskId: -1 }).limit(1);
  let taskId = "";

  if (lastTaskId.length === 0) {
    taskId = "T001";
  } else {
    lastTaskId = lastTaskId[0].taskId;
    taskId ="T" +(parseInt(lastTaskId.substring(1)) + 1).toString().padStart(3, "0");
  }

  const taskData = req.body;
  taskData.taskId = taskId;

  let task = new Task(taskData);

  await task.save().then(() => {
      res.json({ msg: "Task added successfully!" });
    })
    .catch(() => {
      res.json({ msg: "Failed to add task" });
    });
}

// ✅ Delete Task
export async function deleteTask(req, res) {
  if (!req.user) {
    res.json({ msg: "Please Login First" });
    return;
  }

  if (req.user.role !== "Admin") {
    res.json({ msg: "You are not an admin" });
    return;
  }

  const id = req.params.taskId;

  await Task.deleteOne({ taskId: id })
    .then(() => {
      res.json({ msg: "Task Deleted" });
    })
    .catch((err) => {
      res.json({ msg: err.message });
    });
}

// ✅ Update Task
export async function updateTask(req, res) {
  if (!req.user) {
    res.json({ msg: "Please Login First" });
    return;
  }

  if (req.user.role !== "Admin") {
    res.json({ msg: "You are not admin" });
    return;
  }

  try {
    const id = req.params.taskId;
    const data = req.body;

    await Task.updateOne({ taskId: id }, data)
      .then(() => {
        res.json({ msg: "Task Updated" });
      })
      .catch((err) => {
        res.json({ msg: err.message });
      });
  } catch (error) {
    res.json({ msg: error.message });
  }
}


export async function getTasksByCategory(req, res) {
  try {
    const { categoryId } = req.params;

    // ✅ Find the Category's ObjectId using the categoryId string (e.g., "C001")
    const category = await Category.findOne({ categoryId });

    if (!category) {
      return res.status(404).json({ msg: "Category not found" });
    }

    // ✅ Find tasks using the category's _id (ObjectId)
    const tasks = await Task.find({ category: category._id }).populate("category");

    res.status(200).json(tasks);
  } catch (err) {
    res.status(500).json({ msg: "Error fetching tasks by category", error: err.message });
  }
}


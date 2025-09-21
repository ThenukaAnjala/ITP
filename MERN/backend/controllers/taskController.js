// src/controllers/taskController.js
import Task from "../models/Task.js";

// ➕ Create Task
export const createTask = async (req, res) => {
  try {
    const { title, description, assignedTo, dueDate } = req.body;

    const task = await Task.create({
      title,
      description,
      assignedTo,
      dueDate,
      createdBy: req.user._id, // Employee Manager who created
    });

    res.status(201).json(task);
  } catch (err) {
    console.error("Create Task Error:", err);
    res.status(500).json({ message: "Failed to create task" });
  }
};

// 📋 Get all tasks (for Manager)
export const getTasks = async (req, res) => {
  try {
    const tasks = await Task.find().populate("assignedTo", "firstName lastName email");
    res.json(tasks);
  } catch (err) {
    console.error("Get Tasks Error:", err);
    res.status(500).json({ message: "Failed to fetch tasks" });
  }
};

// 📋 Get logged-in Rubber Tapper’s tasks
export const getMyTasks = async (req, res) => {
  try {
    const tasks = await Task.find({ assignedTo: req.user._id }).populate(
      "assignedTo",
      "firstName lastName email"
    );
    res.json(tasks);
  } catch (err) {
    console.error("Get MyTasks Error:", err);
    res.status(500).json({ message: "Failed to fetch your tasks" });
  }
};


// ✏️ Update Task
export const updateTask = async (req, res) => {
  try {
    const task = await Task.findById(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });

    if (req.user.role === "employee") {
      if (String(task.assignedTo) !== String(req.user._id)) {
        return res.status(403).json({ message: "Not authorized" });
      }

      const { status, action } = req.body;

      if (action === "START") {
       task.status = "IN_PROGRESS";
       task.history.push({ action: "START", at: new Date() }); // ✅ fixed
}

      if (action === "PAUSE") {
       task.history.push({ action: "PAUSE", at: new Date() }); // ✅ fixed
}

if (action === "STOP") {
  task.status = status || "DONE";
  task.history.push({ action: "STOP", at: new Date() }); // ✅ fixed
}


      await task.save();
      return res.json(task);
    }

    if (req.user.role === "employeeManager") {
      const updated = await Task.findByIdAndUpdate(req.params.id, req.body, {
        new: true,
      });
      return res.json(updated);
    }

    res.status(403).json({ message: "Not authorized" });
  } catch (err) {
    console.error("Update Task Error:", err);
    res.status(500).json({ message: "Failed to update task" });
  }
};

// ❌ Delete Task
export const deleteTask = async (req, res) => {
  try {
    const task = await Task.findByIdAndDelete(req.params.id);
    if (!task) return res.status(404).json({ message: "Task not found" });
    res.json({ message: "Task deleted" });
  } catch (err) {
    console.error("Delete Task Error:", err);
    res.status(500).json({ message: "Failed to delete task" });
  }
};

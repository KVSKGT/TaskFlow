import Task from "../models/Task.js";

// @desc   Create a task
// @route  POST /api/tasks
// @access Private
export const createTask = async (req, res, next) => {
  try {
    const { title, description, status, priority, dueDate } = req.body;

    if (!title) {
      const err = new Error("Title is required");
      err.statusCode = 400;
      throw err;
    }

    const task = await Task.create({
      user: req.user._id,
      title,
      description,
      status,
      priority,
      dueDate,
    });

    res.status(201).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc   Get all tasks for logged-in user (filter + search + sort + paginate)
// @route  GET /api/tasks?status=&priority=&search=&sortBy=&order=&page=&limit=
// @access Private
export const getTasks = async (req, res, next) => {
  try {
    const { status, priority, search, sortBy, order, page = 1, limit = 10 } = req.query;

    // Always scope to the logged-in user
    const query = { user: req.user._id };

    if (status) query.status = status;
    if (priority) query.priority = priority;
    if (search) {
      // simple case-insensitive title search
      query.title = { $regex: search, $options: "i" };
    }

    // Sorting
    const sortField = ["dueDate", "priority", "createdAt", "title"].includes(sortBy)
      ? sortBy
      : "createdAt";
    const sortOrder = order === "asc" ? 1 : -1;

    const pageNum = Math.max(parseInt(page), 1);
    const limitNum = Math.max(parseInt(limit), 1);
    const skip = (pageNum - 1) * limitNum;

    const [tasks, total] = await Promise.all([
      Task.find(query)
        .sort({ [sortField]: sortOrder })
        .skip(skip)
        .limit(limitNum),
      Task.countDocuments(query),
    ]);

    res.status(200).json({
      success: true,
      count: tasks.length,
      total,
      page: pageNum,
      totalPages: Math.ceil(total / limitNum),
      tasks,
    });
  } catch (error) {
    next(error);
  }
};

// @desc   Get single task
// @route  GET /api/tasks/:id
// @access Private
export const getTask = async (req, res, next) => {
  try {
    const task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc   Update a task
// @route  PUT /api/tasks/:id
// @access Private
export const updateTask = async (req, res, next) => {
  try {
    let task = await Task.findOne({ _id: req.params.id, user: req.user._id });
    if (!task) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }

    const { title, description, status, priority, dueDate } = req.body;
    if (title !== undefined) task.title = title;
    if (description !== undefined) task.description = description;
    if (status !== undefined) task.status = status;
    if (priority !== undefined) task.priority = priority;
    if (dueDate !== undefined) task.dueDate = dueDate;

    await task.save();
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc   Mark task as completed (convenience endpoint)
// @route  PATCH /api/tasks/:id/complete
// @access Private
export const completeTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndUpdate(
      { _id: req.params.id, user: req.user._id },
      { status: "Done" },
      { new: true }
    );
    if (!task) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, task });
  } catch (error) {
    next(error);
  }
};

// @desc   Delete a task
// @route  DELETE /api/tasks/:id
// @access Private
export const deleteTask = async (req, res, next) => {
  try {
    const task = await Task.findOneAndDelete({ _id: req.params.id, user: req.user._id });
    if (!task) {
      const err = new Error("Task not found");
      err.statusCode = 404;
      throw err;
    }
    res.status(200).json({ success: true, message: "Task deleted" });
  } catch (error) {
    next(error);
  }
};

// @desc   Get analytics summary for the logged-in user
// @route  GET /api/tasks/analytics/summary
// @access Private
export const getAnalytics = async (req, res, next) => {
  try {
    const userId = req.user._id;

    // Use aggregation for an efficient single-query summary
    const result = await Task.aggregate([
      { $match: { user: userId } },
      {
        $group: {
          _id: "$status",
          count: { $sum: 1 },
        },
      },
    ]);

    const counts = { Todo: 0, "In Progress": 0, Done: 0 };
    result.forEach((r) => {
      counts[r._id] = r.count;
    });

    const total = counts.Todo + counts["In Progress"] + counts.Done;
    const completionPercentage = total > 0 ? Math.round((counts.Done / total) * 100) : 0;

    res.status(200).json({
      success: true,
      analytics: {
        total,
        completed: counts.Done,
        pending: counts.Todo + counts["In Progress"],
        inProgress: counts["In Progress"],
        todo: counts.Todo,
        completionPercentage,
      },
    });
  } catch (error) {
    next(error);
  }
};

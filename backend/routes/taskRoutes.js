import express from "express";
import {
  createTask,
  getTasks,
  getTask,
  updateTask,
  completeTask,
  deleteTask,
  getAnalytics,
} from "../controllers/taskController.js";
import { protect } from "../middleware/auth.js";

const router = express.Router();

router.use(protect); // every task route requires a logged-in user

// IMPORTANT: /analytics/summary must come before /:id
// otherwise Express treats "analytics" as an :id value
router.get("/analytics/summary", getAnalytics);

router.route("/").get(getTasks).post(createTask);
router.route("/:id").get(getTask).put(updateTask).delete(deleteTask);
router.patch("/:id/complete", completeTask);

export default router;

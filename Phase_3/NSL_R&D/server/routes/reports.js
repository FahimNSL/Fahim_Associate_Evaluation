import express from "express";
import {
  createReport,
  getReports,
  updateReport,
  deleteReport,
} from "../controllers/reportController.js";

const router = express.Router();

router.post("/", createReport);
router.get("/", getReports);
router.put("/:id", updateReport);
router.delete("/:id", deleteReport);

export default router;

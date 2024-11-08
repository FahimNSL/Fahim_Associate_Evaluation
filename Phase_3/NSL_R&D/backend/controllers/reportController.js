import Report from "../models/Report.js";
import mongoose from "mongoose";
export const createReport = async (req, res) => {
  try {
      const {
          title,
          project,
          author,
          description,
          accuracy,
          status,
          researchPapers,
      } = req.body;

      const files = req.files.map(file => ({
        filename: file.filename,
        path: file.path,
        size: file.size,
        mimeType: file.mimetype,
      }));

      // Check for required fields
      if (!title || !project || !author || !description) {
          return res.status(400).json({ error: "Title, project, author, and description are required." });
      }

      // Validate accuracy if provided
      if (accuracy !== undefined && (accuracy < 0 || accuracy > 100)) {
          return res.status(400).json({ error: "Accuracy must be between 0 and 100." });
      }

      // Validate status if provided
      const validStatuses = ["draft", "in-review", "completed"];
      if (status && !validStatuses.includes(status)) {
          return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
      }

      // Create the report
      const report = new Report({
          title,
          project: new mongoose.Types.ObjectId(project),
          author: new mongoose.Types.ObjectId(author),
          description,
          accuracy,
          status: status || "draft",
          files, // This should be correct if files are properly formed
          researchPapers,
      });

      await report.save();
      res.status(201).json(report);
  } catch (error) {
      console.error("Error creating report:", error);
      console.error("Error Details:", error.errors); // Log specific validation errors
      res.status(500).json({ error: "Failed to create report." });
  }
};



export const getReports = async (req, res) => {
  const { project } = req.params; // Get project ID from route parameter
  try {
    const reports = await Report.find({ project }).populate("project author");
    res.json(reports);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};
export const getSingleReport = async (req, res) => {
  try {
    const { report: reportId } = req.params;
    console.log(`Fetching report with ID: ${reportId}`);

    const report = await Report.findById(reportId).populate("project author");

    console.log({report})
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }
    res.json(report);
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};  

export const updateReport = async (req, res) => {
  try {
    const report = await Report.findByIdAndUpdate(req.params.id, req.body, {
      new: true,
    });
    res.json(report);
  } catch (error) {
    res.status(400).json({ error: error.message });
  }
};

export const deleteReport = async (req, res) => {
  try {
    await Report.findByIdAndDelete(req.params.id);
    res.json({ message: "Report deleted" });
  } catch (error) {
    res.status(500).json({ error: error.message });
  }
};



export const editReport = async (req, res) => {
  try {
    const { id } = req.params;
    const {
      title,
      project,
      author,
      description,
      accuracy,
      status,
      researchPapers,
    } = req.body;

    console.log("body", req.body)
    const files = req.files ? req.files.map(file => ({
      filename: file.filename,
      path: file.path,
      size: file.size,
      mimeType: file.mimetype,
    })) : [];

    // Validate required fields
    if (!title || !project || !author || !description) {
      return res.status(400).json({ error: "Title, project, author, and description are required." });
    }

    // Validate accuracy if provided
    if (accuracy !== undefined && (accuracy < 0 || accuracy > 100)) {
      return res.status(400).json({ error: "Accuracy must be between 0 and 100." });
    }

    // Validate status if provided
    const validStatuses = ["draft", "in-review", "completed"];
    if (status && !validStatuses.includes(status)) {
      return res.status(400).json({ error: `Status must be one of: ${validStatuses.join(", ")}` });
    }

    // Find the report by ID and update it
    const report = await Report.findById(id);
    if (!report) {
      return res.status(404).json({ error: "Report not found." });
    }

    // Update fields only if they are provided
    report.title = title || report.title;
    report.project = project ? new mongoose.Types.ObjectId(project) : report.project;
    report.author = author ? new mongoose.Types.ObjectId(author) : report.author;
    report.description = description || report.description;
    report.accuracy = accuracy !== undefined ? accuracy : report.accuracy;
    report.status = status || report.status;
    report.researchPapers = researchPapers || report.researchPapers;
    
    // Append new files if provided
    if (files.length > 0) {
      report.files.push(...files);
    }

    await report.save();
    res.status(200).json(report);
  } catch (error) {
    console.error("Error updating report:", error);
    res.status(500).json({ error: "Failed to update report." });
  }
};

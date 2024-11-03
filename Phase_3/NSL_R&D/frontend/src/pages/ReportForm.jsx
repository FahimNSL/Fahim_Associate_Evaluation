import { useState, useEffect } from "react";
import { useNavigate, useParams, useLocation } from "react-router-dom";
import {
  Box,
  Typography,
  TextField,
  Button,
  Paper,
  MenuItem,
  Grid,
  CircularProgress,
} from "@mui/material";
import { api, useCreateReportMutation, useEditReportMutation } from "../store/api";
import { useAuth } from "../contexts/AuthContext";
import { toast } from "react-toastify";

export default function ReportForm() {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams();
  const location = useLocation();
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    accuracy: "",
    status: "draft",
    project: location.state?.projectId || "",
    author: user?._id,
  });

  const [files, setFiles] = useState([]);
  const { data: report } = api.useGetReportQuery(id, { skip: !id });
  const [createReport, { isLoading: isLoadingCreate }] = useCreateReportMutation();
  const [updateReport, { isLoading: isLoadingUpdate }] = useEditReportMutation();

  const isLoading = isLoadingCreate || isLoadingUpdate;

  useEffect(() => {
    if (report) {
      setFormData({
        title: report.title,
        description: report.description,
        accuracy: report.accuracy || "",
        status: report.status,
        project: report.project._id,
        author: report.author._id,
      });
      setFiles(
        report.files?.map(file => (typeof file === 'string' ? { name: file } : file)) || []
      );
    }
  }, [report]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    const formDataObj = new FormData();
    Object.keys(formData).forEach((key) => {
      formDataObj.append(key, formData[key]);
    });
    files.forEach((file) => {
      formDataObj.append("files", file);
    });
    if (formData.accuracy) {
      formDataObj.set("accuracy", Number(formData.accuracy));
    }

    const updatedData = {
      ...formData,
      files: files.map((file) => (typeof file === "string" ? file : file.name)),
    };

    try {
      if (id) {
        await updateReport({ id, updatedData }).unwrap();
        toast.success("Report updated successfully");
        navigate(`/projects/${formData.project}`);
      } else {
        await createReport(formDataObj).unwrap();
        toast.success("Report created successfully");
        navigate(`/projects/${formData.project}`);
      }
    } catch (error) {
      console.error("Failed to save report:", error);
    }
  };

  return (
    <Box component="form" onSubmit={handleSubmit} sx={{ maxWidth: 600, mx: "auto", my: 4 }}>
      <Typography variant="h4" sx={{ mb: 4, textAlign: 'center', color: 'primary.main' }}>
        {id ? "Edit Report" : "New Report"}
      </Typography>
      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
        <Grid container spacing={3}>
          <Grid item xs={12}>
            <TextField
              fullWidth
              label="Title"
              value={formData.title}
              onChange={(e) => setFormData({ ...formData, title: e.target.value })}
              required
              variant="outlined"
              sx={{ bgcolor: 'background.default' }}
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              fullWidth
              multiline
              rows={4}
              label="Description"
              value={formData.description}
              onChange={(e) => setFormData({ ...formData, description: e.target.value })}
              required
              variant="outlined"
              sx={{ bgcolor: 'background.default' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              type="number"
              label="Accuracy (%)"
              value={formData.accuracy}
              onChange={(e) => setFormData({ ...formData, accuracy: e.target.value })}
              inputProps={{ min: 0, max: 100 }}
              variant="outlined"
              sx={{ bgcolor: 'background.default' }}
            />
          </Grid>
          <Grid item xs={12} sm={6}>
            <TextField
              fullWidth
              select
              label="Status"
              value={formData.status}
              onChange={(e) => setFormData({ ...formData, status: e.target.value })}
              required
              variant="outlined"
              sx={{ bgcolor: 'background.default' }}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="in-review">In Review</MenuItem>
              <MenuItem value="completed">Completed</MenuItem>
            </TextField>
          </Grid>
          <Grid item xs={12}>
            <input
              type="file"
              multiple
              onChange={(e) => setFiles(Array.from(e.target.files))}
              style={{ display: "none" }}
              id="file-input"
            />
            <label htmlFor="file-input">
              <Button variant="outlined" component="span" fullWidth>
                Upload Files
              </Button>
            </label>
            {files.length > 0 && (
              <Typography sx={{ mt: 1 }}>
                Selected files: {files.map((f) => f.name).join(", ")}
              </Typography>
            )}
          </Grid>
          <Grid item xs={12}>
            <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
              <Button onClick={() => navigate(-1)} disabled={isLoading} variant="outlined">
                Cancel
              </Button>
              <Button
                type="submit"
                variant="contained"
                disabled={isLoading}
                startIcon={isLoading ? <CircularProgress size={20} /> : null}
              >
                {isLoading ? "Processing..." : id ? "Update" : "Create"} Report
              </Button>
            </Box>
          </Grid>
        </Grid>
      </Paper>
    </Box>
  );
}

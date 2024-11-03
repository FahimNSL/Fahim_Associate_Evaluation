
import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import mongoose from "mongoose";
import authRoutes from "./routes/auth.js";
import projectRoutes from "./routes/projects.js";
import reportRoutes from "./routes/reports.js";
import userRoutes from "./routes/users.js";




dotenv.config();

const app = express();

app.use(cors({
  origin: "http://localhost:5173",
  methods: ["GET", "POST", "PUT", "DELETE", "OPTIONS"],
  allowedHeaders: ["Content-Type", "Authorization"],
  credentials: true, // If you're dealing with cookies or authentication
}));



app.options("*", cors());

const corsOptions = {
  origin: 'http://localhost:5173', // Replace with your client-side domain
  credentials: true,
};
app.use(cors(corsOptions));
app.use(cors());
app.options("*", cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));
app.use(function (req, res, next) {
  // console.log("loggg", req.url);

  // Website you wish to allow to connect

  res.setHeader('Access-Control-Allow-Origin', "http://localhost:5173");
  // res.setHeader('Content-Security-Policy', 'script-src http://localhost:3000')
  // Request methods you wish to allow
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS, PUT, PATCH, DELETE, delete');

  // Request headers you wish to allow
  res.setHeader('Access-Control-Allow-Headers', 'X-Requested-With,Content-Type,Authorization,Accept,filename');

  // Set to true if you need the website to include cookies in the requests sent
  // to the API (e.g. in case you use sessions)
  res.setHeader('Access-Control-Allow-Credentials', true);

  // Pass to next layer of middleware
  next();
});




// Routes
app.use("/api/auth", authRoutes);
app.use("/api/projects", projectRoutes);
app.use("/api/reports", reportRoutes);
app.use("/api/users", userRoutes);

// MongoDB connection
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => console.log("Connected to MongoDB"))
  .catch((err) => console.error("MongoDB connection error:", err));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});

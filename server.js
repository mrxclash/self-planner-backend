const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");
const bodyParser = require("body-parser");
const plannerRoutes = require("./routes/plannerRoutes");
require("dotenv").config();

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(bodyParser.json());

// Routes
app.use("/api", plannerRoutes);

// MongoDB Connection
mongoose
	.connect(process.env.MONGO_URI)
	.then(() => {
		console.log("MongoDB connected");
		app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));
	})
	.catch((err) => console.error("MongoDB connection error:", err));

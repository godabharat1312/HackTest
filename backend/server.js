const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const User = require("./models/User");
const authRoutes = require("./routes/authRoutes");
const authMiddleware = require("./middleware/authMiddleware");
const questionRoutes = require("./routes/questionRoutes");
const codeRoutes = require("./routes/codeRoutes");
const cassandraClient = require("./config/cassandra");
require("dotenv").config();

const app = express();

app.use(cors());
app.use(express.json());
app.use("/api", authRoutes);
app.use("/api", questionRoutes);
app.use("/api/code", codeRoutes);


// Connect to MongoDB
mongoose
    .connect(process.env.MONGO_URI)
    .then(() => {
        console.log("✅ MongoDB Connected Successfully");
    })
    .catch((err) => {
        console.log("❌ MongoDB Connection Error");
        console.log(err);
    });
// Connect to Cassandra
cassandraClient.connect()
    .then(() => {
        console.log("✅ Cassandra Connected Successfully");
    })
    .catch((err) => {
        console.log("❌ Cassandra Connection Error");
        console.log(err);
    });

const PORT = 5000;

// Home Route
app.get("/", (req, res) => {
    res.send("HackTest Backend is Running 🚀");
});

// Test Route
app.get("/api/test", (req, res) => {
    res.json({
        success: true,
        message: "API is working successfully!",
    });
});
app.get("/api/dashboard", authMiddleware, (req, res) => {
    res.json({
        success: true,
        message: "Welcome to your Dashboard!",
        user: req.user,
    });
});





app.listen(PORT, () => {
    console.log(`Server running on http://localhost:${PORT}`);
});
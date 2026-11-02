const express = require("express");
const router = express.Router();
const authMiddleware = require("../middleware/authMiddleware");
const {
    getQuestions,
    createQuestion
} = require("../controllers/questionController");



router.get("/questions", authMiddleware, getQuestions);
router.post("/questions", authMiddleware, createQuestion);

module.exports = router;
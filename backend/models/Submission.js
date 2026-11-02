const mongoose = require("mongoose");

const submissionSchema = new mongoose.Schema({
    userId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User",
        required: true,
    },

    passed: {
        type: Number,
        required: true,
    },

    total: {
        type: Number,
        required: true,
    },

    score: {
        type: Number,
        required: true,
    },

    submittedAt: {
        type: Date,
        default: Date.now,
    },
});

module.exports = mongoose.model("Submission", submissionSchema);
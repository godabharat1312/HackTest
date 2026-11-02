const mongoose = require("mongoose");

const questionSchema = new mongoose.Schema({
    title: {
        type: String,
        required: true,
    },
    order: {
        type: Number,
        required: true,
        default: 1,
    },

    description: {
        type: String,
        required: true,
    },

    difficulty: {
        type: String,
        required: true,
    },

    inputFormat: {
        type: String,
        required: true,
    },

    outputFormat: {
        type: String,
        required: true,
    },

    sampleInput: {
        type: String,
        required: true,
    },

    sampleOutput: {
        type: String,
        required: true,
    },
    testCases: [
        {
            input: {
                type: String,
                required: true,
            },
            expectedOutput: {
                type: String,
                required: true,
            },
        },
    ],
});

module.exports = mongoose.model("Question", questionSchema);
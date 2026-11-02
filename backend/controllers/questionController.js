const Question = require("../models/Question");

const getQuestions = async (req, res) => {
    try {

        const questions = await Question.find();

        res.json({
            success: true,
            questions,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch questions",
        });
    }
};


const createQuestion = async (req, res) => {
    try {

        const {
            title,
            description,
            difficulty,
            inputFormat,
            outputFormat,
            sampleInput,
            sampleOutput,
            testCases,
        } = req.body;

        const question = new Question({
            title,
            description,
            difficulty,
            inputFormat,
            outputFormat,
            sampleInput,
            sampleOutput,
            testCases,
        });

        await question.save();

        res.json({
            success: true,
            message: "Question created successfully",
            question,
        });

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Failed to create question",
        });
    }
};



module.exports = {
    getQuestions,
    createQuestion,
};
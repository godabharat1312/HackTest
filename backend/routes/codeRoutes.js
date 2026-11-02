const express = require("express");
const router = express.Router();
const fs = require("fs");
const path = require("path");
const { exec, spawn } = require("child_process");
const Question = require("../models/Question");
const Submission = require("../models/Submission");
const authMiddleware = require("../middleware/authMiddleware");
const cassandraClient = require("../config/cassandra");

router.post("/run", (req, res) => {

    const { code, language, input } = req.body;

    console.log("Language:", language);
    console.log("Input:", input);
    console.log("Code:", code);

    if (language !== "cpp") {
        return res.json({
            success: false,
            message: "For now, only C++ is supported",
        });
    }

    const fileName = path.join(__dirname, "temp.cpp");
    const exeName = path.join(__dirname, "temp.exe");

    // Save user's C++ code
    fs.writeFileSync(fileName, code);

    // Compile C++ code
    exec(
        `g++ "${fileName}" -o "${exeName}"`,
        (compileError, stdout, stderr) => {

            if (compileError) {

                console.log("Compilation Error:", stderr);

                return res.json({
                    success: false,
                    message: "Compilation Error",
                    output: stderr,
                });
            }

            console.log("Compilation successful");

            // Run compiled program
            const child = spawn(exeName);

            let programOutput = "";
            let programError = "";

            child.stdout.on("data", (data) => {
                programOutput += data.toString();
            });

            child.stderr.on("data", (data) => {
                programError += data.toString();
            });

            // Send input to C++ program
            child.stdin.write(input || "");
            child.stdin.end();

            child.on("close", (exitCode) => {

                if (exitCode !== 0) {

                    console.log("Runtime Error:", programError);

                    return res.json({
                        success: false,
                        message: "Runtime Error",
                        output: programError ||
                            `Program exited with code ${exitCode}`,
                    });
                }

                console.log("Program Output:", programOutput);

                res.json({
                    success: true,
                    message: "Code executed successfully",
                    output: programOutput,
                });
            });
        }
    );
});
router.post("/submit",authMiddleware, async (req, res) => {
    try {
        const { code, language, questionId } = req.body;

        if (!req.user) {
            return res.status(401).json({
                success: false,
                message: "Please log in first",
            });
        }


        if (language !== "cpp") {
            return res.json({
                success: false,
                message: "For now, only C++ is supported",
            });
        }

        const question = await Question.findById(questionId);

        if (!question) {
            return res.json({
                success: false,
                message: "Question not found",
            });
        }

        const testCases = question.testCases;

        console.log("Number of test cases:", testCases.length);

        const fileName = path.join(__dirname, "submit.cpp");
        const exeName = path.join(__dirname, "submit.exe");

        fs.writeFileSync(fileName, code);

        // Compile the code
        exec(
            `g++ "${fileName}" -o "${exeName}"`,
            (compileError, stdout, stderr) => {

                if (compileError) {
                    return res.json({
                        success: false,
                        message: "Compilation Error",
                        output: stderr,
                    });
                }

                const results = [];

                runTestCase(0);

                function runTestCase(index) {

                    // All test cases completed
                    if (index >= testCases.length) {

                        const passedCount = results.filter(
                            (result) => result.passed
                        ).length;

                        return res.json({
                            success: passedCount === testCases.length,
                            message:
                                passedCount === testCases.length
                                    ? "All test cases passed"
                                    : "Some test cases failed",
                            passed: passedCount,
                            total: testCases.length,
                            results: results,
                        });
                    }

                    const testCase = testCases[index];

                    console.log(`Running Test Case ${index + 1}`);

                    const child = spawn(exeName);

                    let programOutput = "";
                    let programError = "";

                    child.stdout.on("data", (data) => {
                        programOutput += data.toString();
                    });

                    child.stderr.on("data", (data) => {
                        programError += data.toString();
                    });

                    // Send test case input
                    child.stdin.write(testCase.input);
                    child.stdin.end();

                    child.on("close", (exitCode) => {

                        // Runtime Error
                        if (exitCode !== 0) {

                            results.push({
                                testCase: index + 1,
                                passed: false,
                                message: "Runtime Error",
                                expected: testCase.expectedOutput.trim(),
                                actual: programError,
                            });

                            return runTestCase(index + 1);
                        }

                        const actualOutput = programOutput.trim();
                        const expectedOutput =
                            testCase.expectedOutput.trim();

                        const passed =
                            actualOutput === expectedOutput;

                        console.log(`Test Case ${index + 1}`);
                        console.log("Expected:", expectedOutput);
                        console.log("Actual:", actualOutput);
                        console.log("Passed:", passed);

                        results.push({
                            testCase: index + 1,
                            passed: passed,
                            message: passed
                                ? "Passed"
                                : "Wrong Answer",
                            expected: expectedOutput,
                            actual: actualOutput,
                        });

                        // Move to next test case
                        runTestCase(index + 1);
                    });
                }
            }
        );

    } catch (error) {

        console.log(error);

        res.status(500).json({
            success: false,
            message: "Server Error",
        });
    }
});

router.post("/save-result", authMiddleware, async (req, res) => {
    console.log("SAVE RESULT API CALLED");

    try {
        const { passed, total } = req.body;

        // 1. Save result in MongoDB
        const submission = new Submission({
            userId: req.user.userId,
            passed: passed,
            total: total,
            score: passed,
        });

        await submission.save();

        console.log("MongoDB: Result saved successfully");

        // 2. Save result in Cassandra
        let cassandraSaved = false;

        try {
            const query = `
                INSERT INTO default_keyspace.user_submissions
                (user_id, submitted_at, question_id, code,
                 language, passed, total, score)
                VALUES (?, ?, ?, ?, ?, ?, ?, ?)
            `;

            await cassandraClient.execute(
                query,
                [
                    String(req.user.userId),
                    new Date(),
                    "overall-test",
                    null,
                    null,
                    passed,
                    total,
                    passed,
                ],
                { prepare: true }
            );

            cassandraSaved = true;
            console.log("Cassandra: Result saved successfully");

        } catch (cassandraError) {
            console.log("Cassandra Save Error:", cassandraError);
        }

        // 3. Send response
        res.json({
            success: true,
            message: "Result saved successfully",
            submission: submission,
            cassandraSaved: cassandraSaved,
        });

    } catch (error) {
        console.log("Save Result Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to save result",
        });
    }
});

router.get("/submissions", authMiddleware, async (req, res) => {
    try {
        const submissions = await Submission.find({
            userId: req.user.userId,
        }).sort({ submittedAt: -1 });

        res.json({
            success: true,
            submissions: submissions,
        });

    } catch (error) {
        console.log("Fetch Submissions Error:", error);

        res.status(500).json({
            success: false,
            message: "Failed to fetch submissions",
        });
    }
});
module.exports = router;
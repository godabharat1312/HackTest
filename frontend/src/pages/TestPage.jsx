import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

function TestPage() {
    const [timeLeft, setTimeLeft] = useState(60 * 60);
    const [questions, setQuestions] = useState([]);
    const [loading, setLoading] = useState(true);

    const [code, setCode] = useState(["", ""]);
    const [output, setOutput] = useState("");
    const [input, setInput] = useState("");
    const [language, setLanguage] = useState("cpp");

    const [submitResult, setSubmitResult] = useState(null);
    const [submitting, setSubmitting] = useState(false);

    const [currentQuestion, setCurrentQuestion] = useState(0);
    const [question1Solved, setQuestion1Solved] = useState(false);

    const navigate = useNavigate();

    // Timer
    useEffect(() => {
        const timer = setInterval(() => {
            setTimeLeft((prev) => {
                if (prev <= 1) {
                    clearInterval(timer);
                    return 0;
                }

                return prev - 1;
            });
        }, 1000);

        return () => clearInterval(timer);
    }, []);

    // Get questions from backend
    useEffect(() => {
        const fetchQuestions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/questions",
                    {
                        method: "GET",
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                console.log("Questions:", data);

                if (data.success) {
                    setQuestions(data.questions);
                }
            } catch (error) {
                console.log("Error fetching questions:", error);
            } finally {
                setLoading(false);
            }
        };

        fetchQuestions();
    }, []);

    // Timer display
    const minutes = Math.floor(timeLeft / 60);
    const seconds = timeLeft % 60;

    // Run Code
    const handleRunCode = async () => {
        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/code/run",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        code: code[currentQuestion],
                        language: language,
                        input: input,
                    }),
                }
            );

            const data = await response.json();

            console.log("Run Code Response:", data);

            if (data.success) {
                setOutput(data.output);
            } else {
                setOutput(data.message);
            }
        } catch (error) {
            console.log("Run Code Error:", error);
            setOutput("Something went wrong");
        }
    };

    // Submit Code
    const handleSubmitCode = async () => {
        try {
            setSubmitting(true);

            const token = localStorage.getItem("token");

            const question = questions[currentQuestion];

            const response = await fetch(
                "http://localhost:5000/api/code/submit",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${localStorage.getItem("token")}`,
                    },
                    body: JSON.stringify({
                        code: code[currentQuestion],
                        language: language,
                        questionId: question._id,
                    }),
                }
            );

            const data = await response.json();
            if (data.success && currentQuestion === 0) {
                setQuestion1Solved(true);
            }

            console.log("Submit response:", data);

            setSubmitResult(data);
            if (
                currentQuestion === 0 &&
                data.passed !== undefined &&
                data.total !== undefined &&
                data.passed === data.total
            ) {
                setQuestion1Solved(true);
            }

        } catch (error) {
            console.log("Submission error:", error);

            setSubmitResult({
                success: false,
                message: "Submission failed",
            });
        } finally {
            setSubmitting(false);
        }
    };

    // Finish Test
    const handleFinishTest = async () => {
        const confirmFinish = window.confirm(
            "Are you sure you want to finish the test?"
        );

        if (!confirmFinish) {
            return;
        }

        try {
            const token = localStorage.getItem("token");

            const response = await fetch(
                "http://localhost:5000/api/code/save-result",
                {
                    method: "POST",
                    headers: {
                        "Content-Type": "application/json",
                        Authorization: `Bearer ${token}`,
                    },
                    body: JSON.stringify({
                        passed: submitResult?.passed || 0,
                        total: submitResult?.total || 0,
                    }),
                }
            );

            const data = await response.json();

            console.log("Save Result Response:", data);

            if (data.success) {
                navigate("/result", {
                    state: {
                        passed: submitResult?.passed || 0,
                        total: submitResult?.total || 0,
                    },
                });
            }
        } catch (error) {
            console.log("Finish Test Error:", error);
        }
    };

    return (
        <div>
            <h1>HackTest Coding Round</h1>

            {/* Timer */}
            <h2>
                Time Left: {minutes}:
                {seconds.toString().padStart(2, "0")}
            </h2>

            {/* Question Navigation */}
            {!loading && questions.length > 0 && (
                <div>
                    <button
                        onClick={() => {
                            setCurrentQuestion(0);
                            setCode("");
                            setOutput("");
                            setInput("");
                            setSubmitResult(null);
                        }}
                    >
                        Question 1
                    </button>

                    <button
                        disabled={!question1Solved}
                        onClick={() => {
                            setCurrentQuestion(1);
                            setCode("");
                            setOutput("");
                            setInput("");
                            setSubmitResult(null);
                        }}
                    >
                        {question1Solved
                            ? "Question 2"
                            : "Question 2 🔒"}
                    </button>
                </div>
            )}

            <br />

            {/* Loading */}
            {loading && <p>Loading questions...</p>}

            {/* No Questions */}
            {!loading && questions.length === 0 && (
                <p>No questions available.</p>
            )}

            {/* Current Question */}
            {!loading && questions.length > 0 && (
                <div>
                    {(() => {
                        const question = questions[currentQuestion];

                        return (
                            <div key={question._id}>
                                <h3>
                                    Question {currentQuestion + 1}
                                </h3>

                                <h4>{question.title}</h4>

                                <p>{question.description}</p>

                                <h4>Input Format</h4>
                                <p>{question.inputFormat}</p>

                                <h4>Output Format</h4>
                                <p>{question.outputFormat}</p>

                                <h4>Sample Input</h4>
                                <pre>{question.sampleInput}</pre>

                                <h4>Sample Output</h4>
                                <pre>{question.sampleOutput}</pre>

                                {/* Code Editor */}
                                <h3>Your Code</h3>

                                <select
                                    value={language}
                                    onChange={(e) =>
                                        setLanguage(e.target.value)
                                    }
                                >
                                    <option value="cpp">
                                        C++
                                    </option>

                                    <option value="python">
                                        Python
                                    </option>

                                    <option value="javascript">
                                        JavaScript
                                    </option>
                                </select>

                                <br />
                                <br />

                                <textarea
                                    value={code}
                                    onChange={(e) => {
                                        const newCode = [...code];
                                        newCode[currentQuestion] = e.target.value;
                                        setCode(newCode);
                                    }}
                                    placeholder="Write your code here..."
                                    rows="20"
                                    cols="80"
                                />

                                {/* Custom Input */}
                                <h3>Custom Input</h3>

                                <textarea
                                    value={input}
                                    onChange={(e) =>
                                        setInput(e.target.value)
                                    }
                                    placeholder="Enter input here..."
                                    rows="5"
                                    cols="80"
                                />

                                <br />
                                <br />

                                {/* Run Code */}
                                <button onClick={handleRunCode}>
                                    Run Code
                                </button>

                                {/* Output */}
                                <h3>Output</h3>

                                <pre>{output}</pre>

                                <br />

                                {/* Submit Code */}
                                <button
                                    disabled={submitting}
                                    onClick={handleSubmitCode}
                                >
                                    {submitting
                                        ? "Submitting..."
                                        : "Submit Code"}
                                </button>

                                {/* Submission Result */}
                                {submitResult && (
                                    <div>
                                        <h3>
                                            Submission Result
                                        </h3>

                                        <h4>
                                            {submitResult.passed} /{" "}
                                            {submitResult.total}{" "}
                                            Test Cases Passed
                                        </h4>

                                        {submitResult.results &&
                                            submitResult.results.map(
                                                (result) => (
                                                    <div
                                                        key={
                                                            result.testCase
                                                        }
                                                    >
                                                        {result.passed
                                                            ? "✅"
                                                            : "❌"}{" "}
                                                        Test Case{" "}
                                                        {
                                                            result.testCase
                                                        }{" "}
                                                        —{" "}
                                                        {
                                                            result.message
                                                        }
                                                    </div>
                                                )
                                            )}
                                    </div>
                                )}
                            </div>
                        );
                    })()}
                </div>
            )}

            <br />

            {/* Finish Test */}
            <button onClick={handleFinishTest}>
                Finish Test
            </button>
        </div>
    );
}

export default TestPage;

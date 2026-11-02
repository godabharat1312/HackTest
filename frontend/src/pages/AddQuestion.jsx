import { useState } from "react";

function AddQuestion() {

    const [message, setMessage] = useState("");

    async function handleAddQuestion() {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({
                title: "Find Maximum Element",

                description:
                    "Given an array of integers, find and return the maximum element in the array.",

                difficulty: "Easy",

                inputFormat:
                    "The first line contains an integer N. The second line contains N integers.",

                outputFormat:
                    "Print the maximum element in the array.",

                sampleInput:
                    "5\n1 5 3 2 4",

                sampleOutput:
                    "5",
                testCases: [
                    {
                        input: "5\n1 5 3 2 4",
                        expectedOutput: "5",
                    },
                    {
                        input: "4\n10 2 8 6",
                        expectedOutput: "10",
                    },
                    {
                        input: "3\n-5 -2 -10",
                        expectedOutput: "-2",
                    },
                ],
            }),
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {
            setMessage("Question added successfully!");
        } else {
            setMessage(data.message);
        }
    }
    async function handleAddQuestion2() {

        const token = localStorage.getItem("token");

        const response = await fetch("http://localhost:5000/api/questions", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: `Bearer ${token}`,
            },
            body: JSON.stringify({

                title: "Count Vowels in a String",

                description:
                    "Given a string, count the number of vowels (a, e, i, o, u) present in the string. Both uppercase and lowercase vowels should be counted.",

                difficulty: "Easy",

                inputFormat:
                    "The input contains a string.",

                outputFormat:
                    "Print the total number of vowels in the string.",

                sampleInput:
                    "HackTest",

                sampleOutput:
                    "2",

                testCases: [
                    {
                        input: "hello",
                        expectedOutput: "2",
                    },
                    {
                        input: "Programming",
                        expectedOutput: "3",
                    },
                    {
                        input: "AEIOU",
                        expectedOutput: "5",
                    },
                    {
                        input: "HackTest Platform",
                        expectedOutput: "5",
                    },
                    {
                        input: "xyz",
                        expectedOutput: "0",
                    },
                ],
            }),
        });

        const data = await response.json();

        console.log(data);

        if (data.success) {
            setMessage("Question 2 added successfully!");
        } else {
            setMessage(data.message);
        }
    }

    return (
        <div>

            <h1>Add Question</h1>

            <button onClick={handleAddQuestion}>
                Add First Question
            </button>
            <button onClick={handleAddQuestion2}>
                Add Second Question
            </button>

            {message && <p>{message}</p>}

        </div>
    );
}


export default AddQuestion;
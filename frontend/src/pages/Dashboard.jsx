import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import "../styles/Dashboard.css";

function Dashboard() {
    const navigate = useNavigate();
    const [user, setUser] = useState(null);
    const [submissions, setSubmissions] = useState([]);
    function handleLogout() {
        localStorage.removeItem("token");
        navigate("/login");
    }

    useEffect(() => {
        fetchDashboard();
    }, []);
    useEffect(() => {
        const fetchSubmissions = async () => {
            try {
                const token = localStorage.getItem("token");

                const response = await fetch(
                    "http://localhost:5000/api/code/submissions",
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );

                const data = await response.json();

                if (data.success) {
                    setSubmissions(data.submissions);
                }

            } catch (error) {
                console.log("Fetch Submissions Error:", error);
            }
        };

        fetchSubmissions();
    }, []);



    async function fetchDashboard() {

        const token = localStorage.getItem("token");

        try {

            const response = await fetch("http://localhost:5000/api/dashboard", {
                method: "GET",
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });

            const data = await response.json();

            if (data.success) {
                setUser(data.user);
            } else {
                console.log(data.message);
            }

        } catch (error) {
            console.error(error);
        }
    }

    return (
        <div>
            {user && <h2>Welcome, {user.email}</h2>}
            <h1>Dashboard</h1>
            <div className="submission-history">

                <h2>Submission History</h2>

                {submissions.length === 0 ? (
                    <p>No submissions yet.</p>
                ) : (
                    <table className="submission-table">
                        <thead>
                            <tr>
                                <th>Date</th>
                                <th>Passed</th>
                                <th>Total</th>
                                <th>Score</th>
                            </tr>
                        </thead>

                        <tbody>
                            {submissions.map((submission) => (
                                <tr key={submission._id}>
                                    <td>
                                        {new Date(
                                            submission.submittedAt
                                        ).toLocaleString()}
                                    </td>

                                    <td>{submission.passed}</td>

                                    <td>{submission.total}</td>

                                    <td>
                                        {submission.score} / {submission.total}
                                    </td>
                                </tr>
                            ))}
                        </tbody>
                    </table>
                )}

            </div>
            <button onClick={handleLogout}>
                Logout
            </button>
            <button onClick={() => navigate("/test")}>
                Start Coding Test
            </button>
        </div>
    );
}

export default Dashboard;
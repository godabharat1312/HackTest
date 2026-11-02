import { useLocation, useNavigate } from "react-router-dom";

function ResultPage() {
    const location = useLocation();
    const navigate = useNavigate();

    const passed = location.state?.passed || 0;
    const total = location.state?.total || 0;
    const failed = total - passed;

    return (
        <div>
            <h1>Test Completed 🎉</h1>

            <h2>Your Result</h2>

            <p>Total Test Cases: {total}</p>

            <p>Test Cases Passed: {passed}</p>

            <p>Test Cases Failed: {failed}</p>

            <h2>
                Score: {passed} / {total}
            </h2>

            <button onClick={() => navigate("/dashboard")}>
                Go to Dashboard
            </button>
        </div>
    );
}

export default ResultPage;
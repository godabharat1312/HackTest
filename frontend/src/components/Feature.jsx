import "../styles/feature.css";

function Features() {
    return (
        <section className="features">

            <h2>Why Choose HackTest?</h2>

            <div className="feature-container">

                <div className="feature-card">
                    <h3>💻 Live Code Editor</h3>
                    <p>Write and execute code directly in your browser.</p>
                </div>

                <div className="feature-card">
                    <h3>⏱️ Timed Assessments</h3>
                    <p>Experience coding challenges with real contest timers.</p>
                </div>

                <div className="feature-card">
                    <h3>🧪 Automatic Test Cases</h3>
                    <p>Instant evaluation with hidden and visible test cases.</p>
                </div>

                <div className="feature-card">
                    <h3>🏆 Leaderboards</h3>
                    <p>Compare your performance with other participants.</p>
                </div>

            </div>

        </section>
    );
}

export default Features;
import "../styles/howitworks.css";

function HowItWorks() {
    return (
        <section className="how-it-works">

            <h2>How It Works</h2>

            <div className="steps">

                <div className="step">
                    <div className="circle">1</div>
                    <h3>Create Account</h3>
                    <p>Register and create your HackTest account.</p>
                </div>

                <div className="step">
                    <div className="circle">2</div>
                    <h3>Join Contest</h3>
                    <p>Select an available coding contest.</p>
                </div>

                <div className="step">
                    <div className="circle">3</div>
                    <h3>Solve Problems</h3>
                    <p>Write and submit your solutions.</p>
                </div>

                <div className="step">
                    <div className="circle">4</div>
                    <h3>View Results</h3>
                    <p>See your score and ranking instantly.</p>
                </div>

            </div>

        </section>
    );
}

export default HowItWorks;
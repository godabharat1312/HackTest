import Feature from "../components/Feature"
import Navbar from "../components/Navbar";
import Hero from "../components/Hero";
import HowItWorks from "../components/HowItWorks";
import { useState } from "react";

function Home() {
    const [message, setMessage] = useState("");
    async function testBackend() {

    try {

        const response = await fetch("http://localhost:5000/api/test");

        const data = await response.json();

        console.log(data);

        setMessage(data.message);

    } catch (error) {

        console.error(error);

    }

}
    return (
        <div>

            <Navbar />
            <Hero />
            <button onClick={testBackend}>
                Test Backend Connection
            </button>
            <p>{message}</p>
            <Feature />
            <HowItWorks />
        </div>
    );
}

export default Home;
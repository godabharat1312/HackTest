import { BrowserRouter, Routes, Route } from "react-router-dom";

import Home from "../pages/Home";
import Login from "../pages/Login";
import Register from "../pages/Register";
import Dashboard from "../pages/Dashboard";
import TestPage from "../pages/TestPage";
import ProtectedRoute from "../components/ProtectedRoute";
import AddQuestion from "../pages/AddQuestion";
import Result from "../pages/Result";

function Router() {
    return (
        <BrowserRouter>

            <Routes>

                <Route path="/" element={<Home />} />

                <Route path="/login" element={<Login />} />

                <Route path="/register" element={<Register />} />
                <Route path="/result" element={<Result />} />
                <Route
                    path="/dashboard"
                    element={
                        <ProtectedRoute>
                            <Dashboard />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/test"
                    element={
                        <ProtectedRoute>
                            <TestPage />
                        </ProtectedRoute>
                    }
                />
                <Route
                    path="/add-question"
                    element={
                        <ProtectedRoute>
                            <AddQuestion />
                        </ProtectedRoute>
                    }
                />


            </Routes>

        </BrowserRouter>
    );
}

export default Router;
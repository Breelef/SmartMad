import React, { useState } from "react";
import {RecipeButton} from "../components/find_opskrifter_knap.js";
import { useNavigate } from "react-router-dom";

export const LoginPage = () => {
    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");
    const navigate = useNavigate();

    const handleLogin = (e) => {
        e.preventDefault();

        if (username === "admin" && password === "admin") {
            localStorage.setItem("token", "fake-token");
            navigate("/udfyld-til-opskrift");
        } else {
            alert("Forkert brugernavn eller password");
        }
    };


    return (
        <div className="flex justify-center items-center min-h-screen bg-blue-900">
            <div className="bg-white rounded-lg p-6 w-80 shadow-lg">
                <h1 className="text-center text-3xl font-bold mb-6 text-teal-500">SmartOpskrift</h1>
                <h2 className="text-center text-xl font-semibold mb-4">Login</h2>
                <form onSubmit={handleLogin} className="space-y-4">
                    <div>
                        <label className="block text-blue-900 font-semibold mb-1">Brugernavn</label>
                        <input
                            type="text"
                            placeholder="Brugernavn"
                            value={username}
                            onChange={(e) => setUsername(e.target.value)}
                            className="w-full px-3 py-2 border rounded-md bg-gray-200 text-blue-900"
                        />
                </div>
                <div>
                    <label className="block text-blue-900 font-semibold mb-1">Kodeord</label>
                    <input
                        type="password"
                        placeholder="Kodeord"
                        value={password}
                        onChange={(e) => setPassword(e.target.value)}
                        className="w-full px-3 py-2 border rounded-md bg-gray-200 text-blue-900"
                    />
                </div>
                <RecipeButton type="submit">Login</RecipeButton>
            </form>
            </div>
    </div>
    );
}

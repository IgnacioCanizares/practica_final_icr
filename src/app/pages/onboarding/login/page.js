"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";
import { useRouter } from 'next/navigation';

export default function Login() {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [message, setMessage] = useState("");
    const router = useRouter();

    const handleLogin = async (e) => {
        e.preventDefault();
        try {
            const response = await axios.post("https://bildy-rpmaya.koyeb.app/api/user/login", {
                email,
                password,
            });
            const token = response.data.token;
            localStorage.setItem("jwt", token);
            setMessage("Inicio de sesión exitoso. Token guardado.");
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push("/pages/clients");
        } catch (error) {
            setMessage("Error al iniciar sesión: " + error.response?.data?.message || error.message);
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">Iniciar Sesión</h1>
                <form onSubmit={handleLogin} className="space-y-6">
                    {/* Email Input */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Email</label>
                        <input
                            type="email"
                            value={email}
                            onChange={(e) => setEmail(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Password Input */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">Contraseña</label>
                        <input
                            type="password"
                            value={password}
                            onChange={(e) => setPassword(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                        />
                    </div>
                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Iniciar Sesión
                    </button>
                </form>
                {/* Message */}
                {message && (
                    <p className="mt-4 text-sm text-center text-green-500">{message}</p>
                )}
                {/* Link Home */}
                <div className="mt-6 text-center">
                    <Link href="../../../">
                        <button
                            type="button"
                            className="bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Volver a Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

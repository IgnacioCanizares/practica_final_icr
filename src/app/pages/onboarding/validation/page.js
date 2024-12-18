"use client";
/* Imports */
import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Validate() {
    /* Variables */
    const [code, setCode] = useState("");
    const [message, setMessage] = useState("");

    /* Funciones */
    const handleValidation = async (e) => {
        e.preventDefault(); /* Evita que se recargue la página */

        const token = localStorage.getItem("jwtRegister"); /* Obtiene el token del localStorage */

        try {
            const response = await axios.put(
                "https://bildy-rpmaya.koyeb.app/api/user/validation",
                { code },
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            ); /* Se hace una petición PUT a la API */
            setMessage("Código validado correctamente."); /* Éxito */
        } catch (error) {
            setMessage(
                "Error al validar el código: " +
                    (error.response?.data?.message || error.message)
            ); /* Error */
        }
    };

    return (
        <div className="flex min-h-screen items-center justify-center bg-gray-100">
            <div className="w-full max-w-md bg-white p-8 shadow-lg rounded-lg">
                {/* Título */}
                <h1 className="text-2xl font-bold mb-6 text-center text-gray-700">
                    Validar Correo
                </h1>

                {/* Formulario */}
                <form onSubmit={handleValidation} className="space-y-6">
                    {/* Input Código */}
                    <div>
                        <label className="block text-gray-700 font-semibold mb-2">
                            Código de Validación:
                        </label>
                        <input
                            type="text"
                            value={code}
                            onChange={(e) => setCode(e.target.value)}
                            required
                            className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                            placeholder="Introduce el código"
                        />
                    </div>

                    {/* Botón Validar */}
                    <button
                        type="submit"
                        className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
                    >
                        Validar
                    </button>
                </form>

                {/* Mensaje de respuesta */}
                {message && (
                    <p className="mt-4 text-sm text-center text-green-500">
                        {message}
                    </p>
                )}

                {/* Botón Home */}
                <div className="mt-6 text-center">
                    <Link href="../../../">
                        <button
                            type="button"
                            className="w-full bg-gray-300 hover:bg-gray-400 text-gray-700 font-semibold py-2 px-4 rounded-lg transition duration-200"
                        >
                            Volver a Home
                        </button>
                    </Link>
                </div>
            </div>
        </div>
    );
}

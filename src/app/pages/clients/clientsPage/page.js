"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function ClientsPage() {
    const [clients, setClients] = useState([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchClients = async () => {
            const token = localStorage.getItem("jwt");
            try {
                const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClients(response.data);
            } catch (error) {
                setError("Error al cargar clientes: " + (error.response?.data?.message || error.message));
            } finally {
                setLoading(false);
            }
        };
        fetchClients();
    }, []);

    if (loading) return <p className="text-center text-lg font-semibold">Cargando...</p>;
    if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-gray-100 min-h-screen">
            {/* Si no hay clientes */}
            {!clients.length ? (
                <div className="flex flex-col items-center justify-center h-full">
                    <h1 className="text-3xl font-bold mb-4 text-gray-700">¡No hay clientes aún!</h1>
                    <p className="text-lg text-gray-500 mb-6">
                        Parece que aún no has agregado ningún cliente. Comienza creando uno.
                    </p>
                    <button
                        type="button"
                        onClick={() => router.push("create")}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
                    >
                        Crear Cliente
                    </button>
                </div>
            ) : (
                // Lista de clientes si existen
                <>
                    <h1 className="text-3xl font-bold mb-6 text-center text-blue-600">Clientes</h1>
                    <div className="flex justify-end mb-4">
                        <button
                            type="button"
                            onClick={() => router.push("create")}
                            className="bg-green-600 hover:bg-green-700 text-white px-4 py-2 rounded-md shadow-md transition duration-200"
                        >
                            Crear Cliente
                        </button>
                    </div>
                    <ul className="grid gap-4">
                        {clients.map((client) => (
                            <li
                                key={client._id}
                                className="bg-white p-4 rounded-md shadow-lg hover:shadow-xl transition duration-200"
                            >
                                <p className="text-lg font-semibold text-gray-700">
                                    <strong>Id:</strong> {client._id}
                                </p>
                                <p className="text-lg font-semibold text-gray-700">
                                    <strong>Nombre:</strong> {client.name}
                                </p>
                                <Link
                                    href={`${client._id}`}
                                    className="text-blue-500 hover:text-blue-700 font-medium transition duration-200"
                                >
                                    Ver detalles
                                </Link>
                            </li>
                        ))}
                    </ul>
                </>
            )}
        </div>
    );
}

"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useRouter } from "next/navigation";

export default function ClientDetails({ params }) {
    const { id } = params; // Accede al parámetro `id` desde `params`
    const [client, setClient] = useState(null);
    const [projects, setProjects] = useState([]); // Estado para proyectos asociados
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const [deleting, setDeleting] = useState(false); // Estado para mostrar progreso de eliminación
    const router = useRouter(); // Hook para manejar navegación

    // Obtener detalles del cliente
    useEffect(() => {
        if (!id) return;

        const fetchClient = async () => {
            const token = localStorage.getItem("jwt");
            try {
                const response = await axios.get(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClient(response.data);
            } catch (err) {
                setError("Error al cargar cliente: " + (err.response?.data?.message || err.message));
                console.error(err);
            } finally {
                setLoading(false);
            }
        };

        fetchClient();
    }, [id]);

    // Obtener proyectos del cliente
    useEffect(() => {
        if (!id) return;

        const fetchProjects = async () => {
            const token = localStorage.getItem("jwt");
            try {
                const response = await axios.get(`https://bildy-rpmaya.koyeb.app/api/project/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProjects(response.data);
            } catch (err) {
                setError("Error al cargar proyectos: " + (err.response?.data?.message || err.message));
                console.error(err);
            }
        };

        fetchProjects();
    }, [id]);

    // Eliminar cliente
    const handleDeleteClient = async () => {
        const confirmDelete = window.confirm("¿Estás seguro de que quieres eliminar este cliente?");
        if (!confirmDelete) return;

        setDeleting(true); // Muestra el progreso de eliminación
        const token = localStorage.getItem("jwt");
        try {
            await axios.delete(`https://bildy-rpmaya.koyeb.app/api/client/${id}`, {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            alert("Cliente eliminado exitosamente.");
            router.push("/pages/clients/clientsPage"); // Redirige a la lista de clientes
        } catch (err) {
            setError("Error al eliminar cliente: " + (err.response?.data?.message || err.message));
            console.error(err);
        } finally {
            setDeleting(false);
        }
    };

    if (loading) return <p className="text-center text-lg font-semibold">Cargando datos del cliente...</p>;
    if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;

    return (
        <div className="min-h-screen bg-gray-100 p-6 flex flex-col items-center">
            {/* Botón para volver */}
            <button
                onClick={() => router.push("/pages/clients/clientsPage")}
                className="self-start mb-6 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition"
            >
                ← Volver a la lista de clientes
            </button>

            <h1 className="text-4xl font-bold text-blue-600 mb-6">Detalles del Cliente</h1>
            {client ? (
                <div className="bg-white p-6 rounded-lg shadow-md w-full max-w-lg">
                    <div className="mb-4">
                        <h2 className="text-2xl font-semibold text-gray-800">{client.name}</h2>
                        <p className="text-gray-500">CIF: {client.cif}</p>
                    </div>
                    <div className="border-t pt-4 mb-6">
                        <h3 className="text-lg font-semibold text-gray-700">Dirección</h3>
                        <p className="text-gray-600">
                            {client.address.street}, {client.address.number}
                        </p>
                        <p className="text-gray-600">
                            {client.address.postal}, {client.address.city}, {client.address.province}
                        </p>
                    </div>

                    {/* Botón para Crear Proyecto */}
                    <button
                        onClick={() => router.push(`/pages/projects/createProject?clientId=${id}`)}
                        className="w-full px-4 py-2 bg-green-600 text-white rounded-lg hover:bg-green-700 transition mb-4"
                    >
                        ➕ Crear Proyecto para este Cliente
                    </button>

                    {/* Botón para Eliminar Cliente */}
                    <button
                        onClick={handleDeleteClient}
                        className={`w-full px-4 py-2 bg-red-600 text-white rounded-lg hover:bg-red-700 transition ${
                            deleting ? "opacity-50 cursor-not-allowed" : ""
                        }`}
                        disabled={deleting}
                    >
                        {deleting ? "Eliminando..." : "🗑️ Eliminar Cliente"}
                    </button>
                </div>
            ) : (
                <p className="text-center text-gray-500 text-lg">Cliente no encontrado.</p>
            )}

            {/* Lista de Proyectos Asociados */}
            <div className="mt-10 w-full max-w-4xl bg-white p-6 rounded-lg shadow-md">
                <h2 className="text-2xl font-bold mb-4">Proyectos Asociados</h2>
                {projects.length > 0 ? (
                    <ul className="space-y-4">
                        {projects.map((project) => (
                            <li
                                key={project._id}
                                className="flex justify-between items-center border-b pb-2"
                            >
                                <div>
                                    <p className="font-semibold text-gray-800">{project.name}</p>
                                    <p className="text-gray-600">Código: {project.projectCode}</p>
                                </div>
                                <button
                                    onClick={() => router.push(`/pages/projects/${project._id}`)}
                                    className="px-3 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 transition"
                                >
                                    Ver Detalles
                                </button>
                            </li>
                        ))}
                    </ul>
                ) : (
                    <p className="text-gray-500 text-lg">No hay proyectos asociados a este cliente.</p>
                )}
            </div>
        </div>
    );
}

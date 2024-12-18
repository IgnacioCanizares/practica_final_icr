"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function ProjectDetails({ params }) {
    const { id } = params; // Obtenemos el ID del proyecto de los parámetros
    const [project, setProject] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");
    const router = useRouter();

    useEffect(() => {
        const fetchProject = async () => {
            const token = localStorage.getItem("jwt");
            if (!token) {
                setError("Token no encontrado. Inicia sesión.");
                setLoading(false);
                return;
            }

            try {
                const response = await axios.get(`https://bildy-rpmaya.koyeb.app/api/project/one/${id}`, {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProject(response.data);
            } catch (err) {
                setError("Error al cargar proyecto: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        if (id) {
            fetchProject();
        } else {
            setError("El ID del proyecto es inválido.");
            setLoading(false);
        }
    }, [id]);

    if (loading) return <p className="text-center text-lg font-semibold">Cargando detalles del proyecto...</p>;
    if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg">
            {/* Botón para volver */}
            <button
                onClick={() => router.push("/pages/projects/projectList")}
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ← Volver a la lista de proyectos
            </button>

            {/* Botón para añadir un albarán */}
            <button
                onClick={() => router.push(`/pages/projects/${id}/createDeliveryNote`)} // Redirige a la creación de albaranes
                className="mb-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Añadir Albarán
            </button>

            {/* Botón para acceder a la lista de albaranes */}
            <button
                onClick={() => router.push(`/pages/projects/${id}/deliveryNoteList`)} // Redirige a la lista de albaranes
                className="mb-4 ml-4 px-4 py-2 bg-yellow-500 text-white rounded hover:bg-yellow-600"
            >
                Ver Albaranes
            </button>

            <h1 className="text-2xl font-bold mb-4">Detalles del Proyecto</h1>
            {project ? (
                <div>
                    <p><strong>Código:</strong> {project.projectCode}</p>
                    <p><strong>Nombre:</strong> {project.name}</p>
                    <p><strong>Cliente:</strong> {project.clientId}</p>
                    <p><strong>Código Interno:</strong> {project.code}</p>
                    <p><strong>Fecha de creación:</strong> {new Date(project.createdAt).toLocaleDateString()}</p>
                    <p><strong>Descripción:</strong> {project.description || "Sin descripción"}</p>
                </div>
            ) : (
                <p>Proyecto no encontrado.</p>
            )}
        </div>
    );
}

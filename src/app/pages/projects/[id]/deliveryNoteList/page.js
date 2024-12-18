"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation"; // Accedemos a los parámetros de la URL
import axios from "axios";

export default function DeliveryNoteList() {
    const { id } = useParams(); // Obtenemos el id del proyecto de la URL
    const [deliveryNotes, setDeliveryNotes] = useState([]); // Estado para almacenar la lista de albaranes
    const [loading, setLoading] = useState(true); // Estado para controlar el estado de carga
    const [error, setError] = useState(""); // Estado para gestionar los errores
    const router = useRouter(); // Para redirigir después de realizar alguna acción

    useEffect(() => {
        const fetchDeliveryNotes = async () => {
            const token = localStorage.getItem("jwt");
            if (!token) {
                setError("Token no encontrado. Inicia sesión.");
                setLoading(false);
                return;
            }

            try {
                // Hacemos la solicitud para obtener los albaranes del proyecto especificado
                const response = await axios.get(
                    `https://bildy-rpmaya.koyeb.app/api/deliverynote/project/${id}`,
                    {
                        headers: {
                            Authorization: `Bearer ${token}`,
                        },
                    }
                );
                setDeliveryNotes(response.data); // Almacenamos los albaranes en el estado
            } catch (err) {
                setError("Error al cargar los albaranes: " + (err.response?.data?.message || err.message));
            } finally {
                setLoading(false);
            }
        };

        fetchDeliveryNotes(); // Llamamos a la función para obtener los albaranes
    }, [id]);

    if (loading) return <p className="text-center text-lg font-semibold">Cargando albaranes...</p>;
    if (error) return <p className="text-center text-lg text-red-500">{error}</p>;

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Lista de Albaranes</h1>
            <button
                onClick={() => router.push(`/pages/projects/${id}`)} // Volver a la página del proyecto
                className="mb-4 px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
            >
                ← Volver al proyecto
            </button>

            <button
                onClick={() => router.push(`/projects/${id}/createDeliveryNote`)} // Crear un nuevo albarán
                className="mb-4 ml-4 px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600"
            >
                Añadir Albarán
            </button>

            {/* Si no hay albaranes */}
            {deliveryNotes.length === 0 ? (
                <p>No hay albaranes para este proyecto.</p>
            ) : (
                <ul>
                    {deliveryNotes.map((deliveryNote) => (
                        <li
                            key={deliveryNote._id}
                            className="mb-4 p-4 border border-gray-300 rounded-md hover:bg-gray-50"
                        >
                            <div>
                                <h3 className="font-semibold">Albarán {deliveryNote._id}</h3>
                                <p><strong>Cliente:</strong> {deliveryNote.clientId}</p>
                                <p><strong>Formato:</strong> {deliveryNote.format}</p>
                                <p><strong>Fecha de trabajo:</strong> {new Date(deliveryNote.workdate).toLocaleDateString()}</p>
                                <p><strong>Descripción:</strong> {deliveryNote.description}</p>

                                
                            </div>
                        </li>
                    ))}
                </ul>
            )}
        </div>
    );
}

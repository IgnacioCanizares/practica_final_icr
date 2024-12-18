"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { useSearchParams, useRouter } from "next/navigation";

export default function CreateProject() {
    const router = useRouter();
    const searchParams = useSearchParams(); // Para obtener el clientId de la URL
    const clientId = searchParams.get("clientId");

    const [formData, setFormData] = useState({
        name: "",
        projectCode: "",
        email: "",
        address: {
            street: "",
            number: "",
        },
        code: "",
        clientId: clientId || "",
    });

    const [message, setMessage] = useState("");
    const [isPopupVisible, setIsPopupVisible] = useState(false);
    const [loadingClient, setLoadingClient] = useState(true);
    const [error, setError] = useState("");
    const [projectId, setProjectId] = useState(""); // Aquí guardamos el projectId

    useEffect(() => {
        if (!clientId) return;

        const fetchClientData = async () => {
            const token = localStorage.getItem("jwt");
            try {
                const response = await axios.get(
                    `https://bildy-rpmaya.koyeb.app/api/client/${clientId}`,
                    { headers: { Authorization: `Bearer ${token}` } }
                );

                const clientData = response.data;
                setFormData((prev) => ({
                    ...prev,
                    email: clientData.email || "",
                    address: {
                        street: clientData.address?.street || "",
                        number: clientData.address?.number || "",
                    },
                }));
            } catch (err) {
                setError("Error al cargar los datos del cliente: " + (err.response?.data?.message || err.message));
            } finally {
                setLoadingClient(false);
            }
        };

        fetchClientData();
    }, [clientId]);

    const handleChange = (e) => {
        const { name, value } = e.target;
        if (name.startsWith("address.")) {
            const key = name.split(".")[1];
            setFormData((prev) => ({
                ...prev,
                address: {
                    ...prev.address,
                    [key]: value,
                },
            }));
        } else {
            setFormData((prev) => ({ ...prev, [name]: value }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault(); 
        const token = localStorage.getItem("jwt");

        try {
            const response = await axios.post(
                "https://bildy-rpmaya.koyeb.app/api/project",
                formData,
                { headers: { Authorization: `Bearer ${token}` } }
            );

            // Imprimo la respuesta de la API en la consola para depurar
            console.log("Respuesta de la API:", response);

            
            const createdProject = response.data; // Guardo la respuesta de la API

            if (createdProject && createdProject._id) { // Compruebo que se ha creado el proyecto correctamente y que tiene _id
                setProjectId(createdProject._id); // Usar _id
                setMessage("Proyecto creado exitosamente.");
                setIsPopupVisible(true); // Mostrar el popup de éxito
            } else {
                setMessage("El ID del proyecto no está disponible.");
            }
        } catch (err) {
            console.error("Error al crear proyecto:", err);
            setMessage("Error al crear proyecto: " + (err.response?.data?.message || err.message));
        }
    };

    if (loadingClient) return <p className="text-center text-lg font-semibold">Cargando datos del cliente...</p>;
    if (error) return <p className="text-center text-lg font-semibold text-red-500">{error}</p>;

    return (
        <div className="p-4 bg-gray-50">
            <h1 className="text-2xl font-bold mb-6">Crear Proyecto</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label className="block text-sm font-semibold">Nombre del Proyecto</label>
                    <input
                        type="text"
                        name="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold">Identificador del Proyecto</label>
                    <input
                        type="text"
                        name="projectCode"
                        value={formData.projectCode}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold">Correo Electrónico</label>
                    <input
                        type="email"
                        name="email"
                        value={formData.email}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold">Calle</label>
                    <input
                        type="text"
                        name="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold">Número</label>
                    <input
                        type="text"
                        name="address.number"
                        value={formData.address.number}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <div>
                    <label className="block text-sm font-semibold">Código Interno del Proyecto</label>
                    <input
                        type="text"
                        name="code"
                        value={formData.code}
                        onChange={handleChange}
                        required
                        className="w-full mt-1 px-3 py-2 border rounded-md focus:ring-2 focus:ring-blue-500"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Crear Proyecto
                </button>
            </form>

            {isPopupVisible && (
                <div className="fixed inset-0 bg-black bg-opacity-50 flex justify-center items-center z-50">
                    <div className="bg-white rounded-lg p-6 w-11/12 sm:w-96 relative">
                        <button
                            className="absolute top-2 right-2 text-gray-500 text-2xl"
                            onClick={() => setIsPopupVisible(false)}
                        >
                            &times;
                        </button>
                        <h2 className="text-xl font-bold text-green-600 text-center">✅ Proyecto Creado</h2>
                        <p className="text-center mt-4">{message}</p>
                        <div className="mt-6 flex flex-col space-y-3">
                            <button
                                className="bg-blue-500 text-white py-2 px-4 rounded-md hover:bg-blue-600"
                                onClick={() => router.push("/pages/projects/projectList")}
                            >
                                Ir a la Lista de Proyectos
                            </button>
                            {projectId && (
                                <button
                                    className="bg-green-500 text-white py-2 px-4 rounded-md hover:bg-green-600"
                                    onClick={() => router.push(`/pages/projects/${projectId}/createDeliveryNote`)}
                                >
                                    Crear Albarán
                                </button>
                            )}
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}

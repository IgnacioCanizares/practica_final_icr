
"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { useParams } from "next/navigation"; // Usamos useParams para obtener el id
import axios from "axios";

export default function CreateDeliveryNote() {
    const { id } = useParams(); 
    const [clients, setClients] = useState([]);
    const [deliveryNote, setDeliveryNote] = useState({
        clientId: "",
        projectId: id, // Aquí le pasamos el id del proyecto directamente
        format: "material", // o "hours", por defecto material
        material: "",
        hours: 0,
        description: "",
        workdate: "",
    });
    const [error, setError] = useState("");
    const token = localStorage.getItem("jwt");
    const router = useRouter();

    // Obtener los clientes disponibles
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setClients(response.data);
            } catch (error) {
                setError("Error fetching clients: " + (error.response?.data?.message || error.message));
            }
        };

        fetchClients();
    }, [token]);

    const handleInputChange = (e) => { // Función para manejar los cambios en los inputs del formulario 
        const { name, value } = e.target; // Obtenemos el nombre y el valor del input que ha cambiado
        setDeliveryNote((prev) => ({ // Actualizamos el estado del albarán con el nuevo valor
            ...prev, // Mantenemos los valores anteriores
            [name]: value, // Actualizamos el valor del input que ha cambiado
        }));
    };

    const handleSubmit = async (e) => {
        e.preventDefault();

        
        const formattedWorkDate = new Date(deliveryNote.workdate); // Convierto la fecha a un objeto Date
        if (isNaN(formattedWorkDate)) { // Compruebo si la fecha es válida, isNaN devuelve true si la fecha no es válida
            setError("Fecha de trabajo inválida.");
            return;
        }

        if (deliveryNote.format === "material" && !deliveryNote.material) { // Compruebo si el material está vacío
            setError("Debe especificar el material.");
            return;
        }

        if (deliveryNote.format === "hours" && (isNaN(deliveryNote.hours) || deliveryNote.hours <= 0)) { // Compruebo si las horas son válidas y mayores que 0 si el formato es horas 
            setError("Debe especificar un número válido de horas.");
            return;
        }

        try {
            console.log("Datos que se enviarán al crear el albarán:", deliveryNote); // Para depurar

            const response = await axios.post(
                "https://bildy-rpmaya.koyeb.app/api/deliverynote",
                deliveryNote,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            alert("Albarán creado correctamente");
            router.push(`/pages/projects/${id}/deliveryNoteList`); // Redirige a la página de detalles del proyecto
        } catch (error) {
            setError("Error creando el albarán: " + (error.response?.data?.message || error.message));
        }
    };

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Crear Albarán para Proyecto</h1>
            {error && <div className="text-red-500 mb-4">{error}</div>}

            <form onSubmit={handleSubmit}>
                {/* Select Cliente */}
                <div className="mb-4">
                    <label htmlFor="clientId" className="block text-sm font-medium text-gray-700">
                        Cliente
                    </label>
                    <select
                        id="clientId"
                        name="clientId"
                        value={deliveryNote.clientId}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="">Seleccione un cliente</option>
                        {clients.map((client) => (
                            <option key={client._id} value={client._id}>
                                {client.name}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Select Formato */}
                <div className="mb-4">
                    <label htmlFor="format" className="block text-sm font-medium text-gray-700">
                        Formato
                    </label>
                    <select
                        id="format"
                        name="format"
                        value={deliveryNote.format}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    >
                        <option value="material">Material</option>
                        <option value="hours">Horas</option>
                    </select>
                </div>

                {/* Material or Hours */}
                {deliveryNote.format === "material" ? (
                    <div className="mb-4">
                        <label htmlFor="material" className="block text-sm font-medium text-gray-700">
                            Material
                        </label>
                        <input
                            type="text"
                            id="material"
                            name="material"
                            value={deliveryNote.material}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                ) : (
                    <div className="mb-4">
                        <label htmlFor="hours" className="block text-sm font-medium text-gray-700">
                            Horas
                        </label>
                        <input
                            type="number"
                            id="hours"
                            name="hours"
                            value={deliveryNote.hours}
                            onChange={handleInputChange}
                            className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                        />
                    </div>
                )}

                {/* Descripción */}
                <div className="mb-4">
                    <label htmlFor="description" className="block text-sm font-medium text-gray-700">
                        Descripción
                    </label>
                    <textarea
                        id="description"
                        name="description"
                        value={deliveryNote.description}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                {/* Fecha de trabajo */}
                <div className="mb-4">
                    <label htmlFor="workdate" className="block text-sm font-medium text-gray-700">
                        Fecha de trabajo
                    </label>
                    <input
                        type="date"
                        id="workdate"
                        name="workdate"
                        value={deliveryNote.workdate}
                        onChange={handleInputChange}
                        className="mt-1 block w-full p-2 border border-gray-300 rounded-md"
                    />
                </div>

                <button
                    type="submit"
                    className="w-full py-2 px-4 bg-blue-500 text-white rounded-md"
                >
                    Crear Albarán
                </button>
            </form>
        </div>
    );
}

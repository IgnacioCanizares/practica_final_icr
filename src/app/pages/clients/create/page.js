"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import axios from "axios";

export default function CreateClient() {
    const router = useRouter();
    // Estado para almacenar los datos del formulario
    const [formData, setFormData] = useState({
        name: "",
        cif: "",
        address: {
            street: "",
            number: "",
            postal: "",
            city: "",
            province: "",
        },
    });
    const [message, setMessage] = useState(""); // Estado para mostrar mensaje de éxito/error
    const [isPopupVisible, setIsPopupVisible] = useState(false); // Estado para mostrar/ocultar la ventana emergente
    const [newClientId, setNewClientId] = useState(null); // Estado para almacenar el ID del cliente creado (para redirigir a la página de creación de proyecto)


    const handleChange = (e) => {
        const { name, value } = e.target; // Captura el input que disparó el evento onChange y su valor 
        if (name.startsWith("address.")) { // Si el input pertenece a la dirección del cliente, actualiza el estado de la dirección
            const key = name.split(".")[1];
            setFormData((prev) => ({ // Actualiza el estado del formulario
                ...prev,  // Mantiene los valores actuales del formulario (name, cif) y actualiza la dirección
                address: {
                    ...prev.address, // Mantiene los valores actuales de la dirección y actualiza el campo correspondiente
                    [key]: value, // Actualiza el campo correspondiente (street, number, postal, city, province)
                },
            }));
        } else { // Si no, actualiza el estado del formulario
            setFormData((prev) => ({
                ...prev, // Mantiene los valores actuales del formulario (address) y actualiza el campo correspondiente
                [name]: value, // Actualiza el campo correspondiente (name, cif)
            }));
        }
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
        try {
            const response = await axios.post(
                "https://bildy-rpmaya.koyeb.app/api/client",
                formData,
                {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                }
            );
            setMessage("Cliente creado exitosamente.");
            setNewClientId(response.data._id); // Guarda el ID del cliente creado
            setIsPopupVisible(true); // Muestra la ventana emergente
        } catch (err) {
            setMessage("Error al crear cliente: " + (err.response?.data?.message || err.message));
            setIsPopupVisible(true);
        }
    };

    return (
        <div className="p-6 bg-white shadow-lg rounded-lg relative">
            <h1 className="text-2xl font-semibold mb-6">Crear Cliente</h1>
            <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                    <label htmlFor="name" className="block text-sm font-medium text-gray-700">Nombre:</label>
                    <input
                        type="text"
                        name="name"
                        id="name"
                        value={formData.name}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="cif" className="block text-sm font-medium text-gray-700">CIF:</label>
                    <input
                        type="text"
                        name="cif"
                        id="cif"
                        value={formData.cif}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                <h2 className="text-lg font-semibold mt-6">Dirección</h2>
                <div>
                    <label htmlFor="address.street" className="block text-sm font-medium text-gray-700">Calle:</label>
                    <input
                        type="text"
                        name="address.street"
                        id="address.street"
                        value={formData.address.street}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="address.number" className="block text-sm font-medium text-gray-700">Número:</label>
                    <input
                        type="number"
                        name="address.number"
                        id="address.number"
                        value={formData.address.number}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="address.postal" className="block text-sm font-medium text-gray-700">Código Postal:</label>
                    <input
                        type="number"
                        name="address.postal"
                        id="address.postal"
                        value={formData.address.postal}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="address.city" className="block text-sm font-medium text-gray-700">Ciudad:</label>
                    <input
                        type="text"
                        name="address.city"
                        id="address.city"
                        value={formData.address.city}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>
                <div>
                    <label htmlFor="address.province" className="block text-sm font-medium text-gray-700">Provincia:</label>
                    <input
                        type="text"
                        name="address.province"
                        id="address.province"
                        value={formData.address.province}
                        onChange={handleChange}
                        required
                        className="mt-1 p-2 border border-gray-300 rounded-md w-full"
                    />
                </div>

                <button
                    type="submit"
                    className="mt-6 bg-blue-600 text-white py-2 px-4 rounded-md hover:bg-blue-700"
                >
                    Crear Cliente
                </button>
            </form>

            {/* Modal flotante con fondo oscuro */}
            {isPopupVisible && (
                <div className="fixed inset-0 bg-gray-900 bg-opacity-75 flex justify-center items-center z-50">
                    <div className="bg-white p-6 rounded-lg shadow-lg w-full sm:w-96 relative">
                        <span
                            className="absolute top-2 right-2 text-2xl cursor-pointer"
                            onClick={() => setIsPopupVisible(false)}
                        >
                            &times;
                        </span>
                        <h2 className="text-xl font-semibold mb-4 text-center">{message}</h2>
                        {newClientId && (
                            <div className="flex space-x-4 justify-center">
                                <button
                                    onClick={() => {
                                        setIsPopupVisible(false);
                                        router.push(`/pages/projects/createProject?clientId=${newClientId}`); // Redirige a la página de creación de proyecto con el ID del cliente, clave-valor
                                    }}
                                    className="bg-green-600 text-white py-2 px-4 rounded-md hover:bg-green-700"
                                >
                                    Crear proyecto para este cliente
                                </button>
                                <button
                                    onClick={() => {
                                        setIsPopupVisible(false);
                                        router.push(`/pages/clients/clientsPage`);
                                    }}
                                    className="bg-gray-400 text-white py-2 px-4 rounded-md hover:bg-gray-500"
                                >
                                    Volver a lista de clientes
                                </button>
                            </div>
                        )}
                    </div>
                </div>
            )}
        </div>
    );
}

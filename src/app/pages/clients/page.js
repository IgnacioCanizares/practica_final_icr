"use client";

import { useEffect, useState } from "react";
import axios from "axios";
import { UserIcon } from "@heroicons/react/20/solid";

export default function Main() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // Suponiendo que el token se encuentra en el localStorage
  const token = localStorage.getItem("jwt");

  // Función para obtener los datos del usuario
  const fetchUserData = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (err) {
      setError(
        "Error al cargar los datos del usuario: " + (err.response?.data?.message || err.message)
      );
    } finally {
      setLoading(false);
    }
  };

  // Llamada a fetchUserData cuando el componente se monte
  useEffect(() => {
    if (token) {
      fetchUserData();
    } else {
      setError("No se encontró un token válido.");
      setLoading(false);
    }
  }, [token]);

  // Si se está cargando, mostramos un mensaje de carga
  if (loading) {
    return <div className="text-center mt-10">Cargando información del usuario...</div>;
  }

  // Si hay un error, mostramos el mensaje de error
  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="flex flex-col items-center justify-center h-screen bg-gray-100">
      <div className="bg-white p-8 rounded-lg shadow-lg w-80 text-center">
        <div className="flex justify-center mb-4">
          <UserIcon className="h-12 w-12 text-blue-500" />
        </div>
        <h1 className="text-3xl font-bold text-gray-800 mb-4">Bienvenido, {userData?.name}</h1> {/* El operador ?. permite acceder a las propiedades de un objeto de manera segura, evitando errores si alguna de las propiedades del objeto es null o undefined. */}
        <p className="text-lg text-gray-600">Te damos la bienvenida a la plataforma.</p>
        <p className="text-md text-gray-500 mt-4">Tu correo electrónico: {userData?.email}</p>
      </div>
    </div>
  );
}

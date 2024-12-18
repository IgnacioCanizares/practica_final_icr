"use client";

import { useState, useEffect } from "react";
import { useRouter } from "next/navigation"; // Importar useRouter para redirigir
import axios from "axios";

export default function Perfil() {
  const [userData, setUserData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  const router = useRouter(); // Para redirigir al inicio de sesión
  const token = localStorage.getItem("jwt");

  // Función para obtener los datos del perfil
  const fetchUserProfile = async () => {
    try {
      setLoading(true);
      const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/user", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      setUserData(response.data);
    } catch (err) {
      setError("Error al cargar los datos del perfil: " + (err.response?.data?.message || err.message));
    } finally {
      setLoading(false);
    }
  };

  // Función para cerrar sesión
  const handleLogout = () => {
    localStorage.removeItem("jwt"); // Elimina el token del localStorage
    router.push("/pages/onboarding/login"); // Redirige a la página de inicio de sesión
  };

  // Llamada a fetchUserProfile cuando el componente se monte
  useEffect(() => {
    if (token) {
      fetchUserProfile();
    } else {
      setError("No se encontró un token válido.");
      setLoading(false);
    }
  }, [token]);

  // Renderizar contenido dependiendo del estado
  if (loading) {
    return <div className="text-center mt-10">Cargando perfil...</div>;
  }

  if (error) {
    return <div className="text-center mt-10 text-red-500">{error}</div>;
  }

  return (
    <div className="container mx-auto p-4">
      <h1 className="text-3xl font-bold mb-6">Perfil de {userData?.name} {userData?.surnames}</h1>
      
      <div className="bg-white p-6 rounded-lg shadow-lg">
        <div className="mb-4">
          <strong>Nombre:</strong> <span>{userData?.name}</span>
        </div>
        <div className="mb-4">
          <strong>Email:</strong> <span>{userData?.email}</span>
        </div>
        <div className="mb-4">
          <strong>NIF:</strong> <span>{userData?.nif}</span>
        </div>
      </div>

      {/* Botón de Cerrar Sesión */}
      <button
        onClick={handleLogout}
        className="mt-6 bg-red-500 hover:bg-red-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
      >
        Cerrar Sesión
      </button>
    </div>
  );
}

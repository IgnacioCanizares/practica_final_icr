"use client";

import { useEffect } from "react";
import { useRouter } from "next/navigation";
import Link from "next/link";

export default function Home() {
  const router = useRouter();

  // Verifica si existe el token al cargar el componente
  useEffect(() => {
    const token = localStorage.getItem("jwt"); // Busca el token JWT en localStorage
    if (token) {
      router.push("/pages/clients/clientsPage"); // Redirige a la página principal si hay token
    }
  }, [router]);

  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-md rounded-lg p-8 w-full max-w-md text-center">
        <h1 className="text-3xl font-bold mb-6 text-gray-800">Inicio</h1>
        
        <nav className="space-y-4">
          <Link
            href="/pages/onboarding/login"
            className="block bg-green-500 hover:bg-green-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Iniciar Sesión
          </Link>
          <Link
            href="/pages/onboarding/register"
            className="block bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 px-4 rounded-lg transition duration-200"
          >
            Registro
          </Link>
        </nav>
      </div>
    </div>
  );
}

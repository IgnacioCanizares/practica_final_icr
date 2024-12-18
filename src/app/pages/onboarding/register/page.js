"use client";
import React from 'react';
import Link from 'next/link';
import {useState} from 'react';
import axios from 'axios';
import { useRouter } from 'next/navigation';

export default function Register(){
    /* Variables */

    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [message, setMessage] = useState('');
    const router = useRouter();


    const handleRegister = async (e) => {
        e.preventDefault(); /* Evita que se recargue la página */
        try {
            const response = await axios.post("https://bildy-rpmaya.koyeb.app/api/user/register", { /* Se hace una petición POST a la API para registrar un usuario */
                email,
                password,
            });

            const token = response.data.token; /* Se obtiene el token de la respuesta */
            
            localStorage.setItem("jwtRegister", token);

            setMessage("Usuario registrado correctamente. Token de verificación: " + token); /* Si se registra correctamente, se muestra un mensaje de éxito */
            await new Promise(resolve => setTimeout(resolve, 2000));
            router.push("/pages/onboarding/validation"); /* Redirige a la página de validación */
        }
        catch (error) {
            setMessage("Error al registrar el usuario" + error.response?.data?.message || error.message); /* Si hay un error, se muestra el mensaje de error */
        }
    };
    
    return (
        <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-8">
        <h1 className="text-2xl font-semibold text-center mb-6 text-gray-800">
          Registro de Usuario
        </h1>
        <form onSubmit={handleRegister} className="space-y-4">
          {/* Campo de Email */}
          <div>
            <label className="block text-gray-700 mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              placeholder="Ingresa tu email"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Campo de Contraseña */}
          <div>
            <label className="block text-gray-700 mb-1">Contraseña</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Ingresa tu contraseña"
              className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
              required
            />
          </div>

          {/* Botones */}
          <div className="flex flex-col gap-3">
            <button
              type="submit"
              className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg"
            >
              Registrarse
            </button>

            <Link href="../../../">
              <button
                type="button"
                className="w-full bg-gray-200 hover:bg-gray-300 text-gray-700 font-semibold py-2 rounded-lg"
              >
                Volver a Inicio
              </button>
            </Link>
          </div>
        </form>

        {/* Mensaje */}
        {message && (
          <p className="mt-4 text-center text-sm text-gray-700">{message}</p>
        )}
      </div>
    </div>
    )
}
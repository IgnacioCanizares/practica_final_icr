"use client"; // Indica que este codigo se ejecutará en el navegador

import { useState, useEffect } from "react"; // Importamos los hooks de React
import { ChevronLeftIcon, ChevronRightIcon, UserIcon } from '@heroicons/react/20/solid'; // Importamos los iconos de flecha y usuario
import Link from "next/link"; // Importamos el componente Link de Next.js, para enlaces que no recargan la página
import axios from "axios"; // Importamos axios para hacer peticiones HTTP
import Image from "next/image"; // Importamos el componente Image de Next.js
import logo from "../../images/logo.png"; // Importamos la imagen del logo

export default function Layout({ children }) { // Definimos el componente Layout que recibe un children como prop (para renderizar el contenido)

    // Definimos los estados
    const [isSidebarOpen, setIsSidebarOpen] = useState(true); // Estado para controlar si la barra lateral está abierta o cerrada
    const [userData, setUserData] = useState({}); // Estado para almacenar los datos del usuario
    const [loading, setLoading] = useState(true); // Estado para controlar si la pagina esta cargando
    const [error, setError] = useState(""); // Estado para almacenar errores 

    const token = localStorage.getItem("jwt"); // Obtenemos el token del localStorage, de inicio de sesión

    // Función para obtener los datos del usuario desde la API
    const fetchUserData = async () => {
        try {
            setLoading(true); // Indicamos que la página está cargando
            const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/user", { // Hacemos la petición a la API
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data); // Almacenamos los datos del usuario en el estado userData
        } catch (error) { // En caso de error
            setError("Error al cargar usuario: " + (error.response?.data?.message || error.message)); // Mostramos el mensaje de error en la página, si lo hay
        } finally {
            setLoading(false); // Indicamos que la página ha terminado de cargar
        }
    };

    /* 
        useEffect: Este efecto se ejecuta cuando el componente se monta o cuando el valor de token cambia. 
        Si token está disponible, se llama a la función fetchUserData para cargar los datos del usuario. 
    */
    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token]);


    return (
        <div className="flex h-screen bg-gray-100"> {/* Contenedor flexible de pantalla completa con fondo gris claro */}
            {/* Sidebar. Si sideBar esta open, la anchura es 64, si no es 0. Transicion de 300 ms */}
            <div
                className={`${
                    isSidebarOpen ? "w-64" : "w-0"
                } transition-all duration-300 bg-gray-200 p-4 overflow-y-auto h-full fixed top-0 left-0 z-20`}
            >
                {/* Botón para abrir/cerrar la barra lateral */}
                <button
                    onClick={() => setIsSidebarOpen(!isSidebarOpen)}
                    className={`absolute top-4 left-${isSidebarOpen ? "64" : "0"} p-2 bg-blue-500 text-white rounded-r-lg`}
                >
                    {isSidebarOpen ? (
                        <ChevronLeftIcon className="h-5 w-5" />
                    ) : (
                        <ChevronRightIcon className="h-5 w-5" />
                    )}
                </button>

                {/* Logo */}
                <div className="flex justify-center mb-6 mt-2"> {/* Flexbox con justificación centrada y margen inferior de 6 y superior de 2 */}
                    <Link href="/pages/clients"> {/* Enlace a la página de clientes */}
                        <Image src={logo} alt="Logo" width={120} height={50} priority className="object-contain cursor-pointer" /> {/* Imagen del logo */}
                    </Link>
                </div>

                {/* Menú */}
                <div className="mt-10"> {/* Margen superior de 10 */}
                    <ul className="mt-6">
                        <li>
                            <Link
                                href="/pages/clients/clientsPage"
                                className="block py-2 text-lg text-blue-600 hover:bg-gray-200 px-4 rounded-md"
                            >
                                Clientes
                            </Link>
                        </li>
                        <li>
                            <Link
                                href="/pages/projects/projectList"
                                className="block py-2 text-lg text-blue-600 hover:bg-gray-200 px-4 rounded-md"
                            >
                                Proyectos
                            </Link>
                        </li>
                    </ul>
                </div>
            </div>

            {/* Navbar superior */}
            <div className="fixed top-0 right-0 left-0 bg-white shadow-md flex justify-end items-center p-4 z-10"> 
                <Link href="/pages/clients/profile">
                    <UserIcon className="h-6 w-6 text-green-600 cursor-pointer" />
                </Link>
            </div>

            {/* Contenido principal */}
            <div
                className={`flex-1 bg-gray-100 p-4 ${
                    isSidebarOpen ? "ml-64" : ""
                } mt-16 transition-all duration-300`}
            >
                {children}
            </div>
        </div>
    );
}

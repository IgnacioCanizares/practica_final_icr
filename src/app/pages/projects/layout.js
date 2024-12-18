"use client";

import { useState, useEffect } from "react";
import { ChevronLeftIcon, ChevronRightIcon, UserIcon } from '@heroicons/react/20/solid';
import Link from "next/link";
import axios from "axios";
import Image from "next/image";
import logo from "../../images/logo.png";

export default function Layout({ children }) {
    const [isSidebarOpen, setIsSidebarOpen] = useState(true);
    const [userData, setUserData] = useState({});
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState("");

    const token = localStorage.getItem("jwt");

    const fetchUserData = async () => {
        try {
            setLoading(true);
            const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/user", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setUserData(response.data);
        } catch (error) {
            setError("Error al cargar usuario: " + (error.response?.data?.message || error.message));
        } finally {
            setLoading(false);
        }
    };

    useEffect(() => {
        if (token) {
            fetchUserData();
        }
    }, [token]);

    return (
        <div className="flex h-screen bg-gray-100">
            {/* Sidebar */}
            <div
                className={`${
                    isSidebarOpen ? "w-64" : "w-0"
                } transition-all duration-300 bg-gray-200 p-4 overflow-y-auto h-full fixed top-0 left-0 z-20`}
            >
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
                <div className="flex justify-center mb-6 mt-2">
                    <Link href="/pages/clients">
                        <Image src={logo} alt="Logo" width={120} height={50} priority className="object-contain cursor-pointer" />
                    </Link>
                </div>

                {/* Menú */}
                <div className="mt-10">
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

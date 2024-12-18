"use client";

import { useState, useEffect } from "react";
import axios from "axios";
import { ChevronDownIcon, ChevronUpIcon } from '@heroicons/react/20/solid'; // Importamos los iconos de Heroicons, flecha hacia arriba y hacia abajo
import Link from "next/link";

export default function ProjectsList() {
    const [projects, setProjects] = useState([]);
    const [searchTerm, setSearchTerm] = useState(""); // Para almacenar el término de búsqueda del usuario 
    const [selectedProjects, setSelectedProjects] = useState([]); // Para almacenar los proyectos seleccionados por el usuario
    const [sortField, setSortField] = useState("projectCode");  // Para almacenar el campo por el que se está ordenando la tabla de proyectos
    const [sortDirection, setSortDirection] = useState("asc"); // Para almacenar la dirección del ordenamiento de la tabla 
    const [clients, setClients] = useState({}); // Para almacenar información de los clientes

    const token = localStorage.getItem("jwt");

    // Función para obtener los proyectos
    useEffect(() => {
        const fetchProjects = async () => {
            try {
                const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/project", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                setProjects(response.data);
            } catch (error) {
                console.error("Error fetching projects:", error);
            }
        };

        fetchProjects();
    }, []);

    // Función para obtener la información de los clientes
    useEffect(() => {
        const fetchClients = async () => {
            try {
                const response = await axios.get("https://bildy-rpmaya.koyeb.app/api/client", {
                    headers: {
                        Authorization: `Bearer ${token}`,
                    },
                });
                // Transformamos la lista de clientes a un objeto de fácil acceso por ID. acc es el acumulador y client es el cliente actual
                const clientMap = response.data.reduce((acc, client) => { 
                    acc[client._id] = client; 
                    return acc;
                }, {});
                setClients(clientMap); // Guardamos el objeto de clientes en el estado clients 
            } catch (error) {
                console.error("Error fetching clients:", error);
            }
        };

        fetchClients();
    }, []);

    const handleSearchChange = (e) => {
        setSearchTerm(e.target.value); // Actualizamos el término de búsqueda con el valor del input de la barra de búsqueda
    };

    const handleSelectProject = (projectId) => { // Función para seleccionar un proyecto 
        setSelectedProjects((prevSelected) => 
            prevSelected.includes(projectId) // añadimos o eliminamos el projectId de la lista de proyectos seleccionados
                ? prevSelected.filter((project) => project !== projectId)  
                : [...prevSelected, projectId] // Si el proyecto ya está seleccionado, lo eliminamos, si no, lo añadimos 
        );
    };

    const handleSelectAll = () => { // Función para seleccionar todos los proyectos
        if (selectedProjects.length === projects.length) { // Si todos los proyectos están seleccionados, deseleccionamos todos
            setSelectedProjects([]);
        } else { 
            setSelectedProjects(projects.map((project) => project._id)); // Si no, seleccionamos todos los proyectos
        }
    };

    const handleSort = (field) => { // Función para ordenar la tabla de proyectos
        const direction = sortField === field && sortDirection === "asc" ? "desc" : "asc"; // Si el campo por el que se está ordenando es el mismo que el campo actual y la dirección es ascendente, cambiamos a descendente, si no, cambiamos a ascendente
        setSortField(field); // Actualizamos el campo por el que se está ordenando
        setSortDirection(direction);    // Actualizamos la dirección del ordenamiento
    };

    // Filtramos los proyectos según el término de búsqueda y los ordenamos según el campo y dirección de ordenamiento
    const filteredProjects = projects 
        .filter((project) => // .filter() devuelve un array con los elementos que cumplen la condición
            Object.values(project).some((value) => // Object.values() devuelve un array con los valores de las propiedades de un objeto. de aqui sacamos los valores de cada proyecto
                String(value).toLowerCase().includes(searchTerm.toLowerCase()) // Comprobamos si el valor del proyecto incluye el término de búsqueda, ignorando mayúsculas y minúsculas
            )
        )
        .sort((a, b) => { // .sort() ordena los elementos de un array según una función de comparación 
            if (sortDirection === "asc") { // Si la dirección del ordenamiento es ascendente
                return a[sortField] > b[sortField] ? 1 : -1;
            } else { // Si la dirección del ordenamiento es descendente
                return a[sortField] < b[sortField] ? 1 : -1; 
            }
        });

    return (
        <div className="p-6 bg-white rounded-lg shadow-lg">
            <h1 className="text-2xl font-semibold mb-4">Lista de Proyectos</h1>

            {/* Barra de búsqueda */}
            <div className="mb-4">
                <input
                    type="text"
                    className="p-2 w-full border border-gray-300 rounded-md"
                    placeholder="Buscar proyectos..."
                    value={searchTerm}
                    onChange={handleSearchChange}
                />
            </div>

            {/* Botón seleccionar todos */}
            <div className="mb-4">
                <button
                    onClick={handleSelectAll}
                    className="px-4 py-2 bg-blue-500 text-white rounded-md"
                >
                    {selectedProjects.length === projects.length ? "Desmarcar todos" : "Seleccionar todos"}
                </button>
            </div>

            {/* Tabla de proyectos */}
            <table className="w-full table-auto border-collapse">
                <thead>
                    <tr>
                        <th>
                            <input
                                type="checkbox"
                                checked={selectedProjects.length === projects.length}
                                onChange={handleSelectAll}
                            />
                        </th>
                        <th>
                            <button
                                
                                onClick={() => handleSort("projectCode")}
                                className="flex items-center space-x-2"
                            >
                                <span>Código</span>
                                {sortField === "projectCode" && (sortDirection === "asc" ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />)}
                            </button>
                        </th>
                        <th>
                            <button
                                onClick={() => handleSort("createdAt")}
                                className="flex items-center space-x-2"
                            >
                                <span>Fecha</span>
                                {sortField === "createdAt" && (sortDirection === "asc" ? <ChevronUpIcon className="w-5 h-5" /> : <ChevronDownIcon className="w-5 h-5" />)}
                            </button>
                        </th>
                        <th>
                            <span>Nombre</span>
                        </th>
                        <th>
                            <span>Cliente</span>
                        </th>
                        <th>
                            <span>Código Interno</span>
                        </th>
                    </tr>
                </thead>
                <tbody>
                    {filteredProjects.map((project) => (
                        <tr key={project._id} className="border-b hover:bg-gray-100">
                            <td>
                                <input
                                    type="checkbox"
                                    checked={selectedProjects.includes(project._id)}
                                    onChange={() => handleSelectProject(project._id)}
                                />
                            </td>
                            <td>{project.projectCode}</td>
                            <td>{new Date(project.createdAt).toLocaleDateString()}</td> {/* Convertimos la fecha de creación a un formato legible */}
                            <td>{project.name}</td>
                            <td>{clients[project.clientId]?.name || "Desconocido"}</td>
                            <td>{project.code}</td>
                            <td>
                                <Link
                                    href={`/pages/projects/${project._id}`}
                                    className="text-blue-600 hover:underline"
                                >
                                    Ver detalles
                                </Link>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    );
}

"use client";

import { useState } from "react";
import axios from "axios";
import Link from "next/link";

export default function Delete() {
    const [message, setMessage] = useState("");

    const handleDelete = async (e) => {
        e.preventDefault();
        const token = localStorage.getItem("jwt");
        try {
            const response = await axios.delete("https://bildy-rpmaya.koyeb.app/api/user/delete", {
                headers: {
                    Authorization: `Bearer ${token}`,
                },
            });
            setMessage("Usuario eliminado correctamente");
        } catch (error) {
            setMessage("Error al eliminar el usuario: " + error.response?.data?.message || error.message);
        }
    };

    return (
        <div>
            <h1>Eliminar Cuenta</h1>
            <form onSubmit={handleDelete}>
                <button type="submit">Eliminar</button>
                <Link href="../../../">    
                    <button type="button">Home</button>
                </Link>
            </form>
            {message && <p>{message}</p>}
        </div>
    );
}
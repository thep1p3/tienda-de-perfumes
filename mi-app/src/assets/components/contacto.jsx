import React from 'react';
import { Link } from 'react-router-dom';

export default function Contacto() {
    const enviar = (e) => {
        e.preventDefault();
        alert('Enviado');
    };

    return (
        <form onSubmit={enviar}>
            <label htmlFor="name">Nombre</label>
            <input id="name" type="text" required />

            <label htmlFor="email">Email</label>
            <input id="email" type="email" required />

            <button type="submit">Enviar</button>
        </form>
    );
}
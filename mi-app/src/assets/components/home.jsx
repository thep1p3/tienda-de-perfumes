import React from 'react';
import { Link } from 'react-router-dom';

export default function Home() {
    return (
        <div>
            <h1>Bienvenido a la tienda de perfumes</h1>
            <p>hola primerea pagina</p>
            <Link to="/contacto">ir a Contacto</Link>
        </div>
    );
    }
import React from 'react'
//Se importan los estilos del componente
import './styles/Welcome.css'

const Welcome = ({ username }) => (
    <div className="">
        <div className="Fitness-User-Info">
            <h1>Welcome to Rick y Morty API</h1>
            <p>https://rickandmortyapi.com/</p>
        </div>
    </div>
)

export default Welcome
import React from 'react'
import './styles/AddImg.css'
//se debe instalar primero (npm i react-router-dom --save en consola)
import { Link } from 'react-router-dom'

//Función de flecha para usar el componente de función
const AddImg = (props) => (
    //Se anexa un Link de react-route-dom
    //to=redireccionamiento
    <Link to={props.to}>
        <img src={props.img} className="img-add" alt={props.alt} width={props.width} />
    </Link>
)

export default AddImg
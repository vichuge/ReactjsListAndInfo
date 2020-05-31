import React from 'react'
import ReactDOM from 'react-dom'
import 'bootstrap/dist/css/bootstrap.css'
//Importación de App.js
import App from './components/App'

//Se toma el elemento root de public/index.html para su modificación
const container = document.getElementById('root')

//Se renderiza App.js
ReactDOM.render(<App/>,container)
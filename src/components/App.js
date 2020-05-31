//Técnicamente este script es una tabla de direcciones (routes.php en laravel)

import React from 'react'
import { BrowserRouter, Route, Switch } from 'react-router-dom'

//Páginas
import Home from '../pages/Home'
import NotFound from '../pages/NotFound'
import Ficha from '../pages/Ficha'


const App = () => (
    <BrowserRouter>
        <Switch>
            <Route exact path="/:page?" component={Home} />
            <Route exact path="/character/id/:userId" component={Ficha} />
            <Route component={NotFound} />
            
        </Switch>

    </BrowserRouter>
)

export default App
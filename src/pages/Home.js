import React from 'react'

//Componentes
import Welcome from '../components/Welcome'
import List from '../components/List'
import Loading from '../components/Loading'
import NavBar from '../components/NavBar'
import Footer from '../components/Footer'
import { Link } from 'react-router-dom'
import arrowLeft from '../images/arrowleft.png';
import arrowRight from '../images/arrowright.png'

//import Button from '@material-ui/core/Button';

class Home extends React.Component {

    //Se declara el state
    state = {
        data: [],
        loading: true,
        error: null
    }

    //función que llama al fetchlist al momento de montar el componente
    async componentDidMount() {
        await this.fetchList()

    }

    //función que llama al fechtlist al momento de actualizar el componente
    async componentDidUpdate() {
        await this.fetchList()
    }

    //función asíncrona que llama el listado de la API
    fetchList = async () => {
        try {
            //aqui se pone la api
            //En App.js se declara una variable por GET, si esta no existe (undefined) se le asigna 1
            if (typeof this.props.match.params.page === 'undefined')
                this.props.match.params.page = '1'
            //Se toman los datos de la API
            let res = await fetch(`https://rickandmortyapi.com/api/character/?page=${this.props.match.params.page}`)
            //Se asignan a un JSON
            let data = await res.json()

            //Se asginan las variables al state
            this.setState({
                data,
                loading: false
            })
            //En caso de algún error se detiene la animación loading y se muestra el error
        } catch (error) {
            this.setState({
                loading: false,
                error
            })
        }

    }

    render() {
        //Si loading es true, entonces se muestra la animación de loading
        if (this.state.loading)
            return <Loading />
        return (
            <div>
                <NavBar></NavBar>
                <div className="row">

                    <div className="col-12">
                        <Welcome
                            username="Raul"
                        />
                    </div>
                    <div className="col-12">
                        <div className="row">
                            <div className="col-6">
                                {
                                    this.state.data.info.prev != null ?
                                        <Link to={"/" + this.state.data.info.prev.slice(-1)} /*onClick={this.scrollTo}*/>
                                            <img src={arrowLeft} className="img-add" alt="back" width="100px" />
                                        </Link> : ''
                                }
                            </div>
                            <div className="col-6">
                                {
                                    this.state.data.info.next != null ?
                                        <Link to={"/" + this.state.data.info.next.slice(-1)} /*onClick={this.scrollTo}*/>
                                            <img src={arrowRight} className="img-add" alt="next" width="100px" />
                                        </Link> : ''
                                }

                            </div>
                        </div>

                    </div>
                    <div className="col-12">
                        <List
                            lista={this.state.data.results}
                        />
                    </div>

                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default Home
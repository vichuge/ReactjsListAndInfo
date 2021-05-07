import React from 'react'
import Loading from '../components/Loading'
import '../components/styles/Ficha.css'
import NavBar from '../components/NavBar'
import AddImg from '../components/AddImg'
import Footer from '../components/Footer'

//Material-ui
import { makeStyles } from '@material-ui/core/styles'
import List from '@material-ui/core/List'
import ListItem from '@material-ui/core/ListItem'
import ListItemText from '@material-ui/core/ListItemText'
import ListItemAvatar from '@material-ui/core/ListItemAvatar'
import Avatar from '@material-ui/core/Avatar'
//Icons
/*import ImageIcon from '@material-ui/icons/Image'
import WorkIcon from '@material-ui/icons/Work'
import BeachAccessIcon from '@material-ui/icons/BeachAccess'*/
import {Wc, Place, Language, Pets, Person} from '@material-ui/icons'
import Divider from '@material-ui/core/Divider'
import arrowLeft from '../images/arrowleft.png'

class Ficha extends React.Component {


    //Se declara el state
    state = {
        data: [],
        loading: true,
        error: null,
        sUseStyles: null
    }


    //función que llama al fetchlist al momento de montar el componente
    async componentDidMount() {

        await this.fetchFicha()
    }

    fetchFicha = async () => {
        try {
            //aqui se pone la API para tomar los datos de un solo personaje
            let res = await fetch(`https://rickandmortyapi.com/api/character/${this.props.match.params.userId}`)
            let data = await res.json()

            //Material-ui
            const useStyles = makeStyles((theme) => ({
                root: {
                    width: '100%',
                    maxWidth: 360,
                    //backgroundColor: theme.palette.background.paper,
                },
            }));

            //Los datos se asignan al state
            this.setState({
                data,
                loading: false,
                error: null,
                sUseStyles: useStyles
            })



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

        //Material-ui
        const classes = this.state.sUseStyles


        let id = this.props.match.params.userId
        let pageValue = Math.trunc(id / 20) + 1
        return (
            <div className="ficha">
                <NavBar></NavBar>
                <div className="container">
                    <div className="row first">
                        <div className="col-12">
                            <AddImg
                                img={arrowLeft}
                                alt="back-image"
                                to={"/" + pageValue}
                                width="50px"
                            />
                        </div>
                    </div>
                    <div className="row img-row">
                        <div className="col-12">
                            <img src={this.state.data.image} className="ficha-image" alt="card" />
                        </div>

                    </div>
                    <div className="row">
                        <div className="col-12 Datos">
                            <h1>{this.state.data.name}</h1>
                        </div>
                    </div>
                    <div className="row">
                        <div className="col-12">
                            <List className={classes.root}>
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Person />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={this.state.data.status} secondary="Status" />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Pets />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={this.state.data.species} secondary="Species" />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Wc />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={this.state.data.gender} secondary="Gender" />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Language />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={this.state.data.origin.name} secondary="Origin" />
                                </ListItem>
                                <Divider variant="inset" component="li" />
                                <ListItem>
                                    <ListItemAvatar>
                                        <Avatar>
                                            <Place />
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText primary={this.state.data.location.name} secondary="Location" />
                                </ListItem>
                            </List>
                        </div>
                    </div>
                </div>
                <Footer></Footer>
            </div>
        )
    }
}

export default Ficha
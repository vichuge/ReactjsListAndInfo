import React from 'react'
import './styles/Card.css'
import { Link } from 'react-router-dom'

//Componente de clase
class Card extends React.Component {

    render() {
        const { idp, title, description, img, leftColor, rightColor } = this.props
        return (
            <Link to={`/character/id/${idp}`}>
                <div className="card mx-auto Fitness-Card"
                    style={{
                        backgroundImage: `url(/images/circles.png), linear-gradient(to right, ${leftColor}, ${rightColor})`
                    }}
                >
                    <div className="card-body">
                        <div className="row center">
                            <div className="col-5">
                                <img src={img} className="image-card" alt="card" width="100px" />
                            </div>
                            <div className="col-7 Fitness-Card-Info">
                                <h1>{title}</h1>
                                <h4>{description}</h4>
                            </div>
                        </div>
                    </div>
                </div>
            </Link>
        )
    }
}

export default Card
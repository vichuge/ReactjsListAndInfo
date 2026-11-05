import { Link } from 'react-router-dom'
import StateMessage from '../components/StateMessage'
import img404 from '../images/404.png'

export default function NotFound() {
  return (
    <StateMessage
      title="Página no encontrada"
      image={<img src={img404} alt="" className="state__image" width="480" height="320" />}
      action={
        <Link to="/" className="btn">
          Volver al inicio
        </Link>
      }
    >
      Parece que este portal te llevó a una dimensión que no existe.
    </StateMessage>
  )
}

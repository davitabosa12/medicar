import Medico from './Medico';
import Horario from './Horario';
interface Agenda{
    id: number,
    dia: string,
    medico: Medico,
    horarios: string[]

}

export default Agenda;
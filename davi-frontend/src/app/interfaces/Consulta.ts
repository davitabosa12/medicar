import Medico from './Medico';
import Horario from './horario';
interface Consulta {
    id: number,
    dia: string,
    horario: Horario,
    data_agendamento: string,
    medico: Medico
}

export default Consulta;
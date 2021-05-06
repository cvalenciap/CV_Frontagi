import { BandejaAsistenciaComponent } from "./views/bandeja-asistencia/bandeja-asistencia.component";
import { DetalleAsistenciaComponent } from "./views/detalle-asistencia/detalle-asistencia.component";
import {DetalleSesionEmpleado}  from './views/detalle-sesion/detalle-sesion-empleado'
export const BandejaAsistenciaRoutes = [
    // Module routes
    {path: '', component: BandejaAsistenciaComponent},
    {path: 'detalle/:codigoCapacitacion', component: DetalleAsistenciaComponent},
    {path: 'detalle/sesion/:codigoCapacitacion', component: DetalleSesionEmpleado}
];
import { BandejaSeguimientoProgramaComponent } from "./views/bandeja-seguimiento-programa.component";
import { DetalleProgramacionComponent } from "./views/detalle-programacion.component";

export const BandejaSeguimientoProgramaRoutes = [
    {path: '', component: BandejaSeguimientoProgramaComponent} ,   
    {path: 'listaVer/:codigo', component: DetalleProgramacionComponent}
];    
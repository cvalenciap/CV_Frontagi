import { BandejaEvaluacionesComponent } from "./views/bandeja-evaluaciones/bandeja-evaluaciones.component";
import { DetalleEvaluacionesComponent } from "./views/detalle-evaluaciones/detalle-evaluaciones.component";

export const BandejaEvaluacionesRoutes = [
    // Module routes
    {path: '', component: BandejaEvaluacionesComponent},
    {path: 'detalle/:codigoCapacitacion', component: DetalleEvaluacionesComponent}
];
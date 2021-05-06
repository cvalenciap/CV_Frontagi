import { BandejaSeguimientoPlanAuditoriaComponent } from "./views/bandeja-seguimiento-plan-auditoria.component";
import { DetallePlanAuditoriaComponent } from "./views/detalle-plan-auditoria.component";


export const BandejaSeguimientoPlanAuditoriaRoutes = [
    {path: '', component: BandejaSeguimientoPlanAuditoriaComponent} ,   
    {path: 'listaVer/:codigo', component: DetallePlanAuditoriaComponent}
];    
import { BandejaPlanComponent } from "./views/bandeja-plan/bandeja-plan.component";
import { RegistroPlanAuditoriaComponent } from "./views/registro-plan-auditoria/registro-plan-auditoria.component";
import { EditarAreaNormaComponent } from "./views/anadir_norma/editarAreaNorma.component";

export const PlanAuditoriaRoutes = [
    {path: '', component: BandejaPlanComponent},
    {path:'registrar',component:RegistroPlanAuditoriaComponent},
    {path:'editar/:codigo',component:RegistroPlanAuditoriaComponent},
    {path:'registrar/agregarnorma', component:EditarAreaNormaComponent}
];
import { ProgramacionComponent } from "./views/programacion/programacion.component";
import { RegistroProgramacionComponent } from "./views/registro-programacion/registro-programacion.component";

export const ProgramacionRoutes = [
    // Module routes
    {path: '', component: ProgramacionComponent},
    {path:'registrar',component:RegistroProgramacionComponent},
    {path: 'editar/:codigo', component: RegistroProgramacionComponent}
];
import { ProgramarCapacitacionComponent } from "./views/bandeja-programacion/programar-capacitacion.component";
import { RegistrarProgramacionComponent } from "./views/registrar-programacion/registrar-programacion.component";

export const ProgramarCapacitacionRoutes = [
    // Module routes
    {path: '', component: ProgramarCapacitacionComponent},
    {path: 'registrar', component: RegistrarProgramacionComponent},
    {path: 'editar/:codigo', component: RegistrarProgramacionComponent}
];
import { BandejaRegistroHallazgosComponent } from "./views/bandeja-registro-hallazgos/bandeja-registro-hallazgos.component";
import { RegistroHallazgosComponent } from "./views/registro-hallazgos/registro-hallazgos.component";

export const RegistroHallazgoRoutes = [
    // Module routes
    {path: '', component: BandejaRegistroHallazgosComponent},
    {path: 'editar/:codigo', component:RegistroHallazgosComponent}
];
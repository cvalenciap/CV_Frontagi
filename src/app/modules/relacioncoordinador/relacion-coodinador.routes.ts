import { BandejaRelacionCoordinadorComponent } from "./views/bandeja-relacion-coordinador.component";
import { RegistroRelacionCoordinadorComponent } from "./views/registro-relacion-coordinador.component";

export const BandejaRelacionCoordinadorRoutes = [
    {path: '', component: BandejaRelacionCoordinadorComponent},
    {path: 'nuevo', component: RegistroRelacionCoordinadorComponent},
    {path: 'editar/:idRelacion', component: RegistroRelacionCoordinadorComponent}
];
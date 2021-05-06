import { BandejaListaVerificacionComponent } from "./views/bandeja-lista-verificacion/bandeja-lista-verificacion.component";
import { RegistroListaVerificacionComponent } from "./views/registro-lista-verificacion/registro-lista-verificacion.component";

export const ListaVerificacionRoutes = [
    // Module routes
    {path: '', component: BandejaListaVerificacionComponent},
    {path: 'editar/:codigo', component: RegistroListaVerificacionComponent}
];
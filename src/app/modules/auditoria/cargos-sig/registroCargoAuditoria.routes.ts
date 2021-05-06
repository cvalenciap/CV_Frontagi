import { EditarCargoAuditoriaComponent } from './views/editarCargoAuditoria.component';
import { ListaCargoAuditoriaComponent } from './views/listaCargoAuditoria.component';

export const RegistroCargosRoutes = [
    // Module routes
    {path: '', component: ListaCargoAuditoriaComponent},
    {path: 'registrar', component: EditarCargoAuditoriaComponent},
    {path: 'editar/:codigo', component: EditarCargoAuditoriaComponent}
];
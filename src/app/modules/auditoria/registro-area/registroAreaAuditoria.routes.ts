import { EditarAreaAuditoriaComponent } from './views/editarAreaAuditoria.component';
import { ListaAreaAuditoriaComponent } from './views/listaAreaAuditoria.component';

export const RegistroAreaAuditoriaRoutes = [
    // Module routes
    {path: '', component: ListaAreaAuditoriaComponent},
    {path: 'registrar', component: EditarAreaAuditoriaComponent},
    {path: 'editar/:codigo', component: EditarAreaAuditoriaComponent}
];
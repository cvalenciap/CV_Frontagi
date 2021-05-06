import { EditarAreaNormaComponent } from './views/editarAreaNorma.component';
import { ListaAreaNormaComponent } from './views/listaAreaNorma.component';

export const RegistroAreaNormaRoutes = [
    // Module routes
    {path: '', component: ListaAreaNormaComponent},
    {path: 'registrar', component: EditarAreaNormaComponent},
    {path: 'editar/:codigo', component: EditarAreaNormaComponent}
];
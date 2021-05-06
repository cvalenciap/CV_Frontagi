import { NoConformidadListaComponent } from './views/lista.component';
import { NoConformidadEditarComponent } from './views/editar.component';

export const NoConformidadRoutes = [
    {path: '', component: NoConformidadListaComponent},
    {path: 'editar', component: NoConformidadEditarComponent}
];

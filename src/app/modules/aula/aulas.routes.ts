import {AulasListaComponent} from './views/lista.component';
import {AulasEditarComponent} from './views/editar.component';

export const AulasRoutes = [
    // Module routes
    {path: '', component: AulasListaComponent},
    {path: 'registrar', component: AulasEditarComponent},
    {path: 'editar/:codigo', component: AulasEditarComponent}
];

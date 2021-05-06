import {RegistroAuditorListaComponent} from './views/bandeja-ficha/lista.component';
import {RegistroAuditorNuevoComponent} from './views/registro-ficha/registro-ficha.component';
import {EditarRegistroAuditorNuevoComponent} from './views/editar-ficha/editar-ficha.component';


export const RegistroAuditorRoutes = [
    // Module routes
    {path: '', component: RegistroAuditorListaComponent},
    {path: 'registrar', component: RegistroAuditorNuevoComponent},
    {path: 'editar', component: EditarRegistroAuditorNuevoComponent}
];

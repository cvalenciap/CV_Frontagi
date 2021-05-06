import {CursosListaComponent} from './views/lista-curso.component';
import { CursoEditarComponent } from 'src/app/modules/curso/views/editar.component';
//import { AgregarSesionComponents } from 'src/app/modules/curso/modals/agregar-sesion.component';
//import {AulasEditarComponent} from './views/editar.component';

export const CursosRoutes = [
    // Module routes
    {path: '', component: CursosListaComponent},
    {path: 'registrar', component: CursoEditarComponent},
    //{path: 'sesion', component: AgregarSesionComponents}
    {path: 'editar/:codigo', component: CursoEditarComponent}
];

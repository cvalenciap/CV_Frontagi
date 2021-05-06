import {ParametrosListaComponent} from './views/lista.component';
import {ParametrosEditarComponent} from './views/editar.component';
import {EditarParametroComponent} from './views/editarparametro.component';

export const ParametrosRoutes = [
  // Module routes
  {path: '', component: ParametrosListaComponent},
  {path: 'registrar', component: ParametrosEditarComponent},
  {path: 'editar/:codigo', component: ParametrosEditarComponent},
  {path: 'registrar/agregar', component: EditarParametroComponent},
  {path: 'editar/agregar/:codigo', component: EditarParametroComponent}
];


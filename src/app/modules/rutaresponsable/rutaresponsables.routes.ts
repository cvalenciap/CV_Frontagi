import {RutaResponsablesListaComponent} from './views/lista.component';
import {RutaResponsablesEditarComponent} from './views/editar.component';
import {EditarResponsableComponent} from './views/editarresponsable.component';

export const RutaResponsablesRoutes = [
    // Module routes
    {path: '', component: RutaResponsablesListaComponent},
    {path: 'registrar', component: RutaResponsablesEditarComponent},
    {path: 'editar/:id', component: RutaResponsablesEditarComponent}//,
  //{path: 'registrar/registrar1', component: EditarResponsableComponent},
  //{path: 'editar/:codigo', component: EditarResponsableComponent}

];

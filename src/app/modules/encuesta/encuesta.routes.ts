import {EncuestaComponent} from './views/lista.component';
import {EncuestaEditarComponent} from './views/editar.component';
import { VistaPreviaComponent } from './views/encuesta-vistaprevia.component';

export const EncuestaRoutes = [
    // Module routes
    {path: '', component: EncuestaComponent},
   {path: 'registrar', component: EncuestaEditarComponent},
    {path: 'editar/:codigo', component: EncuestaEditarComponent},
    {path: 'vistaprevia/:codigo', component: VistaPreviaComponent}
];

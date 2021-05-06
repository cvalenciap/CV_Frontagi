import {InstructoresListaComponent} from './views/lista.component';
import {InstructoresEditarComponent} from './views/editar.component';

export const InstructoresRoutes = [
    // Module routes
    {path: '', component: InstructoresListaComponent},
    {path: 'registrar', component: InstructoresEditarComponent},
    {path: 'editar/:codigo', component: InstructoresEditarComponent}
];

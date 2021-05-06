import {BancoPreguntasListaComponent} from './views/bandeja-preguntas/lista.component';
import {RegistroPreguntaNuevoComponent} from './views/registro-pregunta/registro-pregunta.component';
import {EditarRegistroPreguntaComponent} from './views/editar-pregunta/editar-pregunta.component';


export const BancosPreguntasRoutes = [
    // Module routes
    {path: '', component: BancoPreguntasListaComponent},
    {path: 'registrar', component: RegistroPreguntaNuevoComponent},
    /* {path: 'editar/:codigo', component: EditarRegistroPreguntaComponent} */
    {path: 'editar/:codigo', component: RegistroPreguntaNuevoComponent}
];
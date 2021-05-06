import {PreguntaCursoListaComponent} from './views/bandeja-preguntas/lista.component';

import {RegistroNuevoCursoAlternativoComponent} from './views/registro-preguntas/registro-pregunta.component';
import { RegistroNuevoCursoVFComponent } from './views/registro-preguntas-vf/registro-pregunta-vf.component';
import { RegistroNuevaPreguntaRelacionalComponent } from './views/registro-pregunta-relacional/registro-pregunta-relacional.component';
import {RegistroPreguntaCursoComponent} from './views/registro-preguntas/registro-pregunta-curso.component';
//C:\Users\GMD\Documents\DANTE\Proyecto Web\src\app\modules\capacitacion\pregunta-curso\views\bandeja-preguntas\lista.component.ts
export const PreguntaCursoRoutes = [
    // Module routes
    {path: '', component: PreguntaCursoListaComponent},
    {path: 'registrar-alternativa', component: RegistroNuevoCursoAlternativoComponent},
    {path: 'registrar-vf', component: RegistroNuevoCursoVFComponent},
    {path: 'registrar-relacional',component: RegistroNuevaPreguntaRelacionalComponent},
    {path: 'registrar-pregunta',component: RegistroPreguntaCursoComponent},
    {path: 'editar/:codigo',component: RegistroPreguntaCursoComponent}
  //  {path: 'editar/:codigo', component: RegistroAuditorEditarComponent}
];
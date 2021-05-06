
import { EvaluacionEditorComponent } from "./evaluacion-editor/evaluacion-editor.component";
import { RegistrarEvaluacionComponent} from "./registrar-evaluacion/registrar-evaluacion.component";
        
export const EvaluacionEditorRoutes = [
    // Module routes
    {path: '', component: EvaluacionEditorComponent}
    ,
    {path:'evaluar/:codigo',component:RegistrarEvaluacionComponent},
    {path: 'editar/:codigo', component: RegistrarEvaluacionComponent}

     
];    


import { FichaAuditorComponent } from "./lista-ficha-auditor/ficha-auditor.component";
import { RegistrarFichaAuditorComponent } from "./registrar-ficha-auditor/registrar-ficha-auditor.component";


export const FichaAuditorRoutes = [
    // Module routes
    {path: '', component: FichaAuditorComponent},         
    {path:'nuevo',component:RegistrarFichaAuditorComponent},
    {path: 'editar/:codigo', component:RegistrarFichaAuditorComponent }

      
];    
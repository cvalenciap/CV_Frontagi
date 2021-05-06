import { RegistrarBandejaRevisionComponent } from "./registrar-bandeja-revision/registrar-bandeja-revision.component";
import { BandejaRevisionAuditoriaComponent } from "./lista-bandeja-revision/bandeja-revision-auditoria.component";
import { ListaVerificacionEquipoComponent } from "./lista-verificacion-equipo/lista-verificacion-equipo.component";
import { EnviarInformeComponent } from "./enviar-informe/enviar-informe.component";
import { ListaVerificacionResponsableComponent } from "./lista-verificacion-responsable/lista-verificacion-responsable.component";



export const BandejaRevisionAuditoriaRoutes = [
    // Module routes
    {path: '', component: BandejaRevisionAuditoriaComponent},   
    {path: 'listaVer/:codigo', component: ListaVerificacionEquipoComponent},
    {path: 'listaVerAuditor/:codigo', component: ListaVerificacionResponsableComponent},
    {path: 'enviarInforme/:codigo', component: EnviarInformeComponent}
     
    
    
];    
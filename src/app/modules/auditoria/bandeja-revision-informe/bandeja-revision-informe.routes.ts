
import { BandejaRevisionInformeComponent } from "./lista-bandeja-revision-informe/bandeja-revision-informe.component";
import { ListaVerificarInformeComponent } from "./lista-verificar-informe/lista-verificar-informe.component";
import { ImpresionInformeComponent } from "./lista-verificar-informe/impresion-informe/impresion-informe.component";

export const BandejaRevisionInformeRoutes = [
    // Module routes
    {path: '', component: BandejaRevisionInformeComponent}  , 
    {path:'verificar/:codigo',component:ListaVerificarInformeComponent},
    {path:'verificar/:codigo/imprimir',component:ImpresionInformeComponent}   
 
];    
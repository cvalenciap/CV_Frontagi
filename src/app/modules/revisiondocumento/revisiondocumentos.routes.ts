import { RevisarDocumentoComponent } from "src/app/modules/revisiondocumento/views/revisar.component";
import { RegistrarRevisionDocumentoComponent } from "src/app/modules/revisiondocumento/views/registrar-revision-documento.component";
import { TabGroupAnimationsExample } from "src/app/modules/tabs/views/tab-group-animations-example";
import { ACCIONES, NOMBREPAGINA } from "src/app/constants/general/general.constants";




export const RevisionDocumentosRoutes = [
  // Module routes
  {path: '', component: RevisarDocumentoComponent},
  {path: 'registrar-revision-documento', component: RegistrarRevisionDocumentoComponent,data:{nArchivo:NOMBREPAGINA.REVISION}},
///:id
  //{path: 'editar-revision-documento', component: RegistrarRevisionDocumentoComponent,data:{nArchivo:NOMBREPAGINA.REVISION,accion:ACCIONES.EDITAR}}
];


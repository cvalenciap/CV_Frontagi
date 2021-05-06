
import { RegistrarRevisionDocumentoComponent } from "src/app/modules/revisiondocumento/views/registrar-revision-documento.component";
import { TabGroupAnimationsExample } from "src/app/modules/tabs/views/tab-group-animations-example";
import { ACCIONES, NOMBREPAGINA } from "src/app/constants/general/general.constants";
import { RevisarDocumentoComponent1 } from "./views/revisar.component";
import { RegistrarRevisionDocumentoComponent1 } from "src/app/modules/alcmigracion/views/registrar-revision-documento.component";
import { HistoricoComponent } from "../alcmigracion/components/historico.component";
import { HistoricoDetalleComponent } from "./components/historico-detalle.component"



export const RevisionDocumentosRoutes1 = [
  // Module routes
  {path: '', component: RevisarDocumentoComponent1},
  {path: 'registrar-migracion-documento', component: RegistrarRevisionDocumentoComponent1,data:{nArchivo:NOMBREPAGINA.REVISION,accion:ACCIONES.NUEVO}},
///:id
{path: 'registrar-migracion-documento/:codigo', component: RegistrarRevisionDocumentoComponent1,data:{nArchivo:NOMBREPAGINA.REVISION,accion:ACCIONES.EDITAR}},
{path: 'historico-documento', component: HistoricoComponent},
{path: 'historico-documento-detalle', component: HistoricoDetalleComponent}
];



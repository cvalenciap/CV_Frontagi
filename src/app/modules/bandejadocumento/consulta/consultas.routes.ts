import { BandejaMenuConsultasComponent } from "src/app/modules/bandejadocumento/consulta/consultas/menuConsultas.component";
import { BandejaSolicitudConsultasComponent } from "src/app/modules/bandejadocumento/consulta/consultas/consultas.component";
import { BandejaDescargaMasivaDocComponent } from "src/app/modules/bandejadocumento/consulta/consultas/bandejaDescargaMasivaDoc.component";
import { BandejaReporteDocCanceladosComponent } from "src/app/modules/bandejadocumento/consulta/consultas/reporteDocCancelados.component";
import { BandejaConocimientoRevisionDocComponent } from "src/app/modules/bandejadocumento/consulta/consultas/bandejaConocimientoRevisionDoc.component";
import { BandejaSeguimientoDocsComponent } from "src/app/modules/bandejadocumento/consulta/consultas/bandejaSeguimientoDocumentos.component";
import { BandejaReporteTransaccionDocComponent } from "src/app/modules/bandejadocumento/consulta/consultas/reporteTransaccionDocumentos.component";
import { SubirArchivoComponents } from "src/app/modules/bandejadocumento/consulta/consultas/subir-archivo.component";
import { TareaConocimientoComponent } from "src/app/modules/tareapendiente/views/tarea-conocimiento/tareaconocimiento.component";
import { EditarBandejaSeguimientoDocumentos } from "./consultas/editarBandejaSeguimientoDocumentos.component";
import { NOMBREPAGINA, ACCIONES } from "src/app/constants/general/general.constants";
import { ProgramacionCargaDocComponent } from "src/app/modules/bandejadocumento/consulta/consultas/programacion-carga-doc.component";

export const ConsultasRoutes = [
  {path: '', component: BandejaMenuConsultasComponent},
  {path: 'bajarVideosPlantillas', component: BandejaSolicitudConsultasComponent},
  {path: 'descargaMasivaDocumentos', component: BandejaDescargaMasivaDocComponent},
  {path: 'reporteDocumentoCancelados', component: BandejaReporteDocCanceladosComponent},
  {path: 'reporteConocimientoRevision', component: BandejaConocimientoRevisionDocComponent},
  {path: 'seguimientoDocumento', component: BandejaSeguimientoDocsComponent},
  {path: 'seguimientoDocumento/detalle', component:EditarBandejaSeguimientoDocumentos,data:{nArchivo:NOMBREPAGINA.SEGUIMIENTOREVISION,accion:ACCIONES.EDITAR}},
  {path: 'reporteTransaccionDocumentos', component: BandejaReporteTransaccionDocComponent},
  {path: 'bandeja-documento-modales-subir-archivo', component: SubirArchivoComponents},
  {path: 'ConocimientoRevision', component: TareaConocimientoComponent},
  {path: 'ConocimientoRevision', component: TareaConocimientoComponent},
  {path: 'programacion', component: ProgramacionCargaDocComponent},
  
];
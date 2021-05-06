import { TareaPendienteComponent } from 'src/app/modules/tareapendiente/views/tareapendiente.component';
import { TareaAprobacionSolComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion-solicitud/tareaaprobacionsol.component';
import { TareaElaboracionComponent } from 'src/app/modules/tareapendiente/views/tarea-elaboracion/tareaelaboracion.component';
import { TareaConsensoComponent } from 'src/app/modules/tareapendiente/views/tarea-consenso/tareaconsenso.component';
import { TareaAprobacionComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion/tareaaprobacion.component';
import { TareaHomologacionComponent } from 'src/app/modules/tareapendiente/views/tarea-homologacion/tareahomologacion.component';
import { TareaConocimientoComponent } from 'src/app/modules/tareapendiente/views/tarea-conocimiento/tareaconocimiento.component';
import { AprobacionSolicitudRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion-solicitud/aprobacionsolicitud-registro.component';
import { ListaCancelacionesComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/listacancelaciones.component';
import { SolicitudCancelacionComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/solicitud-cancelacion/solicitudcancelacion.component';
import { AprobacionCancelacionComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/aprobacion-cancelacion/aprobacioncancelacion.component';
import { CancelaSolicitudComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/cancela-solicitud/cancelasolicitud.component';
import { BlankLayoutComponent } from 'src/app/components/common/layouts/blankLayout.component';
import { RegistroSolicitudCancelComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/solicitud-cancelacion/registrosolicitudcancel.component';
import { TareaElaboracionRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-elaboracion/tareaelaboracion-registro.component';
import { RegistroAprobacionCancelComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/aprobacion-cancelacion/registroaprobacioncancel.component';
import { RegistroCancelaSolicitudComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/cancela-solicitud/registrocancelasolicitud.component';
import { CopiaImpresionComponent } from 'src/app/modules/tareapendiente/views/tarea-copia-impresion/copiaimpresion.component';
import { RegistroCopiaImpresionComponent } from 'src/app/modules/tareapendiente/views/tarea-copia-impresion/registrocopiaimpresion.component';
import { TareaConsensoRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-consenso/tareaconsenso-registro.component';
import { TareaAprobacionRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion/tareaaprobacion-registro.component';
import { TareaHomologacionRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-homologacion/tareahomologacion-registro.component';
//import { PERMISOS } from 'src/app/constants/general/general.constants';
import { ContenedorNuevoDocGoogleDocsComponent } from 'src/app/modules/tareapendiente/views/tarea-elaboracion/tareaelaboracion-nuevo-doc.component';
import { ContenedorNuevoDocGoogleDocsConsenComponent } from 'src/app/modules/tareapendiente/views/tarea-consenso/tareaconsenso-nuevo-doc.component';
import { ContenedorNuevoDocGoogleDocsAprobComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion/tareaaprobacion-nuevo-doc.component';
import { ContenedorNuevoDocGoogleDocsHomologComponent } from 'src/app/modules/tareapendiente/views/tarea-homologacion/tareahomologacion-nuevo-doc.component';
import { NOMBREPAGINA, ACCIONES } from 'src/app/constants/general/general.constants';

export const TareaPendienteRoutes = [
  // Module routes
 
  {path: '', component: TareaPendienteComponent},
  {path: 'NuevoDocGoogleDocs/:idRevision/:idDocumento', component: ContenedorNuevoDocGoogleDocsComponent},
  {path: 'NuevoDocGoogleDocsConsenso/:idRevision/:idDocumento', component: ContenedorNuevoDocGoogleDocsConsenComponent},
  {path: 'NuevoDocGoogleDocsAprob/:idRevision/:idDocumento', component: ContenedorNuevoDocGoogleDocsAprobComponent},
  {path: 'NuevoDocGoogleDocsHomolog/:idRevision/:idDocumento', component: ContenedorNuevoDocGoogleDocsHomologComponent},
  //{path: 'NuevoDocGoogleDocs', component: ContenedorNuevoDocGoogleDocsComponent},
  {path: 'AprobarSolicitud', component: TareaAprobacionSolComponent},
  {path: 'ElaborarRevisionRegistro', component: TareaElaboracionRegistroComponent,data:{nArchivo:NOMBREPAGINA.ELABORACIONREVISION,accion:ACCIONES.EDITAR}},
  {path: 'ElaborarRevision', component: TareaElaboracionComponent},
  {path: 'ConsensuarRevision', component: TareaConsensoComponent},  
  {path: 'ConsensuarRevisionRegistro', component: TareaConsensoRegistroComponent,data:{nArchivo:NOMBREPAGINA.CONSENSOREVISION,accion:ACCIONES.EDITAR}},
  {path: 'AprobarRevision', component: TareaAprobacionComponent},
  {path: 'AprobarRevisionRegistro', component: TareaAprobacionRegistroComponent,data:{nArchivo:NOMBREPAGINA.APROBACIONREVISION,accion:ACCIONES.EDITAR}},
  {path: 'HomologarRevision', component: TareaHomologacionComponent},
  {path: 'HomologarRevisionRegistro', component: TareaHomologacionRegistroComponent,data:{nArchivo:NOMBREPAGINA.HOMOLOGACIONREVISION,accion:ACCIONES.EDITAR}},
  {path: 'ConocimientoRevision', component: TareaConocimientoComponent},
  {path: 'AprobarSolicitud/detalle', component: AprobacionSolicitudRegistroComponent,data:{nArchivo:NOMBREPAGINA.APROSOLICITUDREVISION,accion:ACCIONES.EDITAR}},
  {path: 'cancelaciones', component: BlankLayoutComponent,
  children: [
   {path: '', component: ListaCancelacionesComponent},
   {path: 'SolicitudCancel', component: SolicitudCancelacionComponent},
   {path: 'SolicitudCancel/registro', component: RegistroSolicitudCancelComponent},
   {path: 'AprobacionCancel', component: AprobacionCancelacionComponent},
    {path: 'AprobacionCancel/registro', component: RegistroAprobacionCancelComponent},
   {path: 'CancelaSolicitud', component: CancelaSolicitudComponent},
    {path: 'CancelaSolicitud/registro', component: RegistroCancelaSolicitudComponent}
  ] 
  },
  {path: 'CopiaImpresion', component: BlankLayoutComponent,
  children: [
    {path: '', component: CopiaImpresionComponent},
   {path: 'actualizar/:codigo', component: RegistroCopiaImpresionComponent},
  ] 
  }
  
];

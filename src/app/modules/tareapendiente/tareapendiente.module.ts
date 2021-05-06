import {NgModule/*,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA*/} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { DemoMaterialModule } from 'src/app/modules/tabs/tabs.module';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { TareaPendienteComponent } from './views/tareapendiente.component';
import { TreeModule } from 'angular-tree-component';
import { TareaAprobacionSolComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion-solicitud/tareaaprobacionsol.component';
import { TareaElaboracionComponent } from 'src/app/modules/tareapendiente/views/tarea-elaboracion/tareaelaboracion.component';
import { TareaConsensoComponent } from 'src/app/modules/tareapendiente/views/tarea-consenso/tareaconsenso.component';
import { TareaAprobacionComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion/tareaaprobacion.component';
import { TareaHomologacionComponent } from 'src/app/modules/tareapendiente/views/tarea-homologacion/tareahomologacion.component';
import { TareaConocimientoComponent } from 'src/app/modules/tareapendiente/views/tarea-conocimiento/tareaconocimiento.component';
import { BusquedaConocimientoComponent } from 'src/app/modules/tareapendiente/modals/tarea-conocimiento/busqueda-conocimiento.component';
import { AprobacionSolicitudRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion-solicitud/aprobacionsolicitud-registro.component';
import { BandejaDocumentosModule } from 'src/app/modules/bandejadocumento/bandejadocumentos.module';
import { ListaCancelacionesComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/listacancelaciones.component';
import { SolicitudCancelacionComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/solicitud-cancelacion/solicitudcancelacion.component';
import { AprobacionCancelacionComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/aprobacion-cancelacion/aprobacioncancelacion.component';
import { CancelaSolicitudComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/cancela-solicitud/cancelasolicitud.component';
import { RegistroSolicitudCancelComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/solicitud-cancelacion/registrosolicitudcancel.component';
import { BusquedaSolicitudCancelComponent } from 'src/app/modules/tareapendiente/modals/tarea-cancelacion/busqueda-solicitud-cancel.component';
import { TabGroupTareaComponent } from 'src/app/modules/tareapendiente/component/tab-group-tarea';
import { FaseRegistroComponent } from 'src/app/modules/tareapendiente/component/fase-registro.component';
import { TareaElaboracionRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-elaboracion/tareaelaboracion-registro.component';
import { RegistroAprobacionCancelComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/aprobacion-cancelacion/registroaprobacioncancel.component';
import { RegistroCancelaSolicitudComponent } from 'src/app/modules/tareapendiente/views/tarea-cancelacion/cancela-solicitud/registrocancelasolicitud.component';
import { CopiaImpresionComponent } from 'src/app/modules/tareapendiente/views/tarea-copia-impresion/copiaimpresion.component';
import { RegistroCopiaImpresionComponent } from 'src/app/modules/tareapendiente/views/tarea-copia-impresion/registrocopiaimpresion.component';
import { TareaConsensoRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-consenso/tareaconsenso-registro.component';
import { TareaAprobacionRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion/tareaaprobacion-registro.component';
import { TareaHomologacionRegistroComponent } from 'src/app/modules/tareapendiente/views/tarea-homologacion/tareahomologacion-registro.component';
import { MotivoRechazoComponent } from 'src/app/modules/tareapendiente/modals/tarea-aprobacion-solicitud/motivo-rechazo.component';
import { BusquedaAprobacionSolicitudComponent } from 'src/app/modules/tareapendiente/modals/tarea-aprobacion-solicitud/busqueda-aprobacion-solicitud.component';
import { BusquedaAprobacionRevisionComponent } from 'src/app/modules/tareapendiente/modals/tarea-aprobar-revision/busqueda-aprobacion-revision.component';
import { ContenedorNuevoDocGoogleDocsComponent } from 'src/app/modules/tareapendiente/views/tarea-elaboracion/tareaelaboracion-nuevo-doc.component';
import { DocGoogleDocs } from 'src/app/modules/google-docs/views/doc-google-docs.component';
import {AlertModule} from 'ngx-bootstrap';
import { ContenedorNuevoDocGoogleDocsConsenComponent } from 'src/app/modules/tareapendiente/views/tarea-consenso/tareaconsenso-nuevo-doc.component';
import { ContenedorNuevoDocGoogleDocsAprobComponent } from 'src/app/modules/tareapendiente/views/tarea-aprobacion/tareaaprobacion-nuevo-doc.component';
import { ContenedorNuevoDocGoogleDocsHomologComponent } from 'src/app/modules/tareapendiente/views/tarea-homologacion/tareahomologacion-nuevo-doc.component';
import {TabGrupoSolicitudComponent} from '../tabs/views/tab-grupo-solicitud/tab-grupo-solicitud.component';
import { InformacionSolicitudCancelacionComponent } from './component/informacion-solicitud-cancelacion/informacion-solicitud-cancelacion.component';
import { DocumentoRelacionadoSolicitudCancelacionComponent } from './component/documento-relacionado-solicitud-cancelacion/documento-relacionado-solicitud-cancelacion.component';
import { SustentoSolicitudCancelacionComponent } from './component/sustento-solicitud-cancelacion/sustento-solicitud-cancelacion.component';
import { ModalRechazoSolicitudCancelacionComponent } from './modals/modal-rechazo-solicitud-cancelacion/modal-rechazo-solicitud-cancelacion.component';
import { DialogsModule } from '../dialogs/dialogs.module';
import { CopiaImpresaModule } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa.module';
import { AuthDirectivesModule } from 'src/app/auth/auth.directives';


import {TooltipModule} from 'ngx-bootstrap/tooltip';
@NgModule({
  declarations: [
    TareaPendienteComponent,
    TareaAprobacionSolComponent,
    TareaElaboracionComponent,
    TareaConsensoComponent,
    TareaAprobacionComponent,
    TareaHomologacionComponent,
    TabGroupTareaComponent,
    FaseRegistroComponent,
    TareaElaboracionRegistroComponent,
    TareaConsensoRegistroComponent,
    TareaAprobacionRegistroComponent,
    TareaHomologacionRegistroComponent,
    ContenedorNuevoDocGoogleDocsComponent,
    ContenedorNuevoDocGoogleDocsConsenComponent,
    ContenedorNuevoDocGoogleDocsAprobComponent,
    ContenedorNuevoDocGoogleDocsHomologComponent,
    TareaConocimientoComponent,
    BusquedaConocimientoComponent,
    AprobacionSolicitudRegistroComponent,
    ListaCancelacionesComponent,
    SolicitudCancelacionComponent,
    AprobacionCancelacionComponent,
    CancelaSolicitudComponent,
    RegistroSolicitudCancelComponent,
    BusquedaSolicitudCancelComponent,
    RegistroAprobacionCancelComponent,
    RegistroCancelaSolicitudComponent,
    CopiaImpresionComponent,
    RegistroCopiaImpresionComponent,
    MotivoRechazoComponent,
    BusquedaAprobacionSolicitudComponent,
    BusquedaAprobacionRevisionComponent,
    DocGoogleDocs,
    TabGrupoSolicitudComponent,
    InformacionSolicitudCancelacionComponent,
    DocumentoRelacionadoSolicitudCancelacionComponent,
    SustentoSolicitudCancelacionComponent,
    ModalRechazoSolicitudCancelacionComponent
  ],
  imports: [
    DialogsModule,
    CopiaImpresaModule,    
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    TooltipModule.forRoot(),
    BsDatepickerModule,
//  TabsModule.forRoot(),
    NgSelectModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    PaginacionModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    BandejaDocumentosModule,
    TreeModule.forRoot(),
    AlertModule.forRoot(),    
    SweetAlert2Module,
    AuthDirectivesModule
  ],
  entryComponents: [
    BusquedaConocimientoComponent,
    BusquedaSolicitudCancelComponent,
    MotivoRechazoComponent,
    BusquedaAprobacionSolicitudComponent,
    BusquedaAprobacionRevisionComponent,
    DocGoogleDocs,
    TabGrupoSolicitudComponent,
    ModalRechazoSolicitudCancelacionComponent
    ],

  bootstrap: [
    DocGoogleDocs,
    TabGrupoSolicitudComponent
    ],
  exports: [
    DocGoogleDocs,
    TabGrupoSolicitudComponent,
    CopiaImpresionComponent
    ],
  /*,
    schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  ]*/
})
export class TareaPendienteModule { }


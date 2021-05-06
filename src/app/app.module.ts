import { BrowserModule, Title } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpClientModule, HTTP_INTERCEPTORS } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { LocationStrategy, HashLocationStrategy, DatePipe } from '@angular/common';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { AlertModule, PaginationModule } from 'ngx-bootstrap';
import { NgxSpinnerModule } from 'ngx-spinner';

import { ROUTES } from './app.routes';
import { AppComponent } from './app.component';
import { AuthService } from './auth/auth.service';
import { SessionService } from './auth/session.service';
import { AuthGuard } from './auth/auth.guard';
import { JwtInterceptor } from './auth/jwt.interceptor';
import { ErrorInterceptor } from './auth/error.interceptor';



// App views
import { DashboardsModule } from './views/dashboards/dashboards.module';
import { AppviewsModule } from './views/appviews/appviews.module';
// App modules/components
import { SpinKitModule } from './components/common/spinkit/spinkit.module';
import { LayoutsModule } from './components/common/layouts/layouts.module';
import { SampleModule } from './modules/sample/sample.module';
import { AppComponentsModule } from './views/appcomponents/appcomponents.module';
import { BootstrapModule } from './modules/bootstrap/bootstrap.module';
//AGI
import { DialogsModule } from './modules/dialogs/dialogs.module';
import { PaginacionModule } from './components/common/paginacion/paginacion.module';
import { AulasModule } from './modules/aula/aulas.module';
import { CursosModule } from './modules/curso/curso.module';
import { EncuestaModule } from './modules/encuesta/encuesta.module';
import { InstructoresModule } from './modules/instructor/instructores.module';
import { RutaResponsablesModule } from './modules/rutaresponsable/rutaresponsables.module';
import { ParametrosModule } from './modules/parametro/parametros.module';
import { JerarquiasModule } from './modules/jerarquia/jerarquias.module';
import { BandejaDocumentosModule } from './modules/bandejadocumento/bandejadocumentos.module';
import { PreguntaCursoModule } from './modules/capacitacion/pregunta-curso/preguntaCurso.module';
// BancoPreguntaModule
import { BancoPreguntaModule } from './modules/auditoria/bandeja-banco-preguntas/bancoPreguntas.module';

// Arbol
import { Arbol } from './modules/arbol/arbol.module';

import { ModalModule } from 'ngx-bootstrap';

// Arbol
// import { registrardocumentoEditarComponent } from './modules/bandejadocumento/registrar-documentoComponent';
// tabs
import { TabsModule, DemoMaterialModule } from './modules/tabs/tabs.module';
// import { ModalModule } from 'ngx-bootstrap';


import { ProgramacionModule } from './modules/auditoria/programacion/programacion.module';
import { PlanAuditoriaModule } from './modules/auditoria/planauditoria/planauditoria.module';
import { EvaluacionEditorModule } from './modules/auditoria/revisionAuditoria/revisionAuditoria.module';
import { NormaIncidenciaModule } from './modules/auditoria/norma-incidencia/norma-incidencia.module';
import { DeteccionHallazgosModule } from './modules/auditoria/deteccion-hallazgos/deteccion-hallazgos.module';
import { RegistroAuditorModule } from './modules/auditoria/registroAuditor/registroAuditor.module';

// Treeview
import { TreeviewModule } from 'ngx-treeview';
import { TreeModule } from 'angular-tree-component';
import { BandejaListaVerificacionComponent } from './modules/auditoria/listaverificacion/views/bandeja-lista-verificacion/bandeja-lista-verificacion.component';
import { ListaVerificacionModule } from './modules/auditoria/listaverificacion/listaverificacion.module';


import { FichaAuditorModule } from './modules/auditoria/ficha-auditor/lista-ficha.module';
import { BandejaRevisionAuditoriaModule } from './modules/auditoria/bandeja-revision-auditoria/bandeja-revision-auditoria.module';
import { BandejaRegistroHallazgosComponent } from './modules/auditoria/registro-hallazgos/views/bandeja-registro-hallazgos/bandeja-registro-hallazgos.component';
import { BandejaRevisionInformeModule } from './modules/auditoria/bandeja-revision-informe/bandeja-revision-informe.module';

import { RegistroHallazgosModule } from './modules/auditoria/registro-hallazgos/registrohallazgos.module';
import { AgrupacionHallazgosModule } from './modules/auditoria/agrupacion-hallazgos/agrupacion-hallazgos.module';
import { ModalBusquedaColaboradorComponent } from './components/common/modal/modal-busqueda-colaborador/modal-busqueda-colaborador.component';

import { RevisionDocumentosModule } from 'src/app/modules/revisiondocumento/revisiondocumentos.module';
import { TareaPendienteModule } from 'src/app/modules/tareapendiente/tareapendiente.module';

import { CopiaImpresaModule } from './modules/bandejadocumento/copiaImpresa/copiaImpresa.module';
import { ConsultasModule } from 'src/app/modules/bandejadocumento/consulta/consultas.module';
import { ProgramacionesModule } from 'src/app/modules/bandejadocumento/programacion/programaciones.module';
// import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { ConsultasDocumentoGModule } from 'src/app/modules/bandejadocumento/consultadocumento/consultas-documento.module';
import { MaterialModule } from './material';

// No Conformidad
import { NoConformidadModule } from './modules/no-conformidad/no-conformidad.module';
// import { NoConformidadModule } from './modules/noconformidad/bandeja-no-conformidad/bandeja-no-conformidad.module';
// import { BandejaReprogramacionModule } from './modules/noconformidad/bandeja-reprogramacion-plan-accion/bandeja-reprogramacion.module';
import { DistribucionModule } from 'src/app/modules/bandejadocumento/distribucion/distribucion.module';

// Capacitación
import { BandejaAsistenciaModule } from './modules/capacitacion/bandeja-asistencia/bandeja-asistencia.module';
import { BandejaEvaluacionesModule } from './modules/capacitacion/bandeja-evaluaciones/bandeja-evaluaciones.module';
import { ProgramarCapacitacionModule } from './modules/capacitacion/programar-capacitacion/programar-capacitacion.module';
import { CapacitacionModule } from './modules/capacitacion/Capacitacion.module';
import { BandejaExamenesModule } from './modules/capacitacion/bandeja-examenes/bandeja-examenes.module';

// npm PDF
import { PdfJsViewerModule } from 'ng2-pdfjs-viewer';
import { ModalesModule } from './components/common/modal/modales.module';
import { RevisionDocumentosModule1 } from 'src/app/modules/alcmigracion/alcmigracion.module';
import { TabsModule1, DemoMaterialModule1 } from 'src/app/modules/tabsmigracion/tabsmigracion.module';

// Mantenimiento - Inf. Documentada
import { BandejaRelacionCoordinadorModule } from 'src/app/modules/relacioncoordinador/relacion-coodinador.module';

// npm TimePicker
import { AmazingTimePickerModule } from 'amazing-time-picker';
import { EjecucionModule } from './modules/bandejadocumento/ejecuciones/ejecucion.module';
import { RegistroAreaNormaModule } from './modules/auditoria/registro-area-norma/registroAreaNorma.module';
import { RegistroAreaRequisitoModule } from './modules/auditoria/registro-area-requisito/registroAreaNorma.module';
import { RegistroAreaAuditoriaModule } from './modules/auditoria/registro-area/registroAreaAuditoria.module';
import { RegistroCargoAuditoriaModule } from './modules/auditoria/cargos-sig/registroCargoAuditoria.module';
import { BandejaSeguimientoProgramaModule } from './modules/auditoria/seguimiento-programa/bandeja-seguimiento-programa.module';
import { BandejaSeguimientoPlanAuditoriaModule } from './modules/auditoria/seguimiento-plan-auditoria/bandeja-seguimiento-plan-auditoria.module';
import { ApiService } from './services';
import { ConsultaCargosSiService } from './services';
import { ModalInfoAuditorComponent } from './modules/auditoria/registroAuditor/views/modales/modal-info-auditor/modal-info-auditor.component';
import { NavegacionService } from './services/impl/navegacion.service';
import { AreaAuditoriaService } from './services/areaauditoria.service';


// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';

@NgModule({
  declarations: [
    AppComponent,
    JwtInterceptor,
    ModalInfoAuditorComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpClientModule,
    ReactiveFormsModule,
    BrowserAnimationsModule, // required for Toastr
    // 3rd party modules
    BsDatepickerModule.forRoot(),
    ToastrModule.forRoot(),
    SweetAlert2Module.forRoot(),
    PdfJsViewerModule,
    SpinKitModule,
    // Routes
    RouterModule.forRoot(ROUTES),
    // Modal
    ModalModule.forRoot(),
    AlertModule.forRoot(),
    // App modules
    NgxSpinnerModule,
    AppviewsModule,
    DashboardsModule,
    LayoutsModule,
    SampleModule,
    AppComponentsModule,
    BootstrapModule,
    AulasModule,
    CursosModule,
    PreguntaCursoModule,
    // CursosModule,
    DialogsModule,
    PaginacionModule,
    HttpClientModule,
    InstructoresModule,
    RutaResponsablesModule,
    ParametrosModule,
    JerarquiasModule,
    BandejaDocumentosModule,
    // arbol
    Arbol,
    DemoMaterialModule,
    DemoMaterialModule1,
    //arbol
    //Tabs
    TabsModule,
    TabsModule1,

    //tabs
    //Encuesta--kevin
    EncuestaModule,
    ProgramacionModule,
    PlanAuditoriaModule,
    ListaVerificacionModule,
    // migracion
    RevisionDocumentosModule1,
    // migracion

    // Mantenimiento - Inf. Documentada
    BandejaRelacionCoordinadorModule,

    RegistroCargoAuditoriaModule,

    RegistroAuditorModule,
    RegistroAreaNormaModule,
    RegistroAreaAuditoriaModule,
    RegistroAreaRequisitoModule,
    // treeview
    TreeModule.forRoot(),
    // No Conformidad
    NoConformidadModule,
    // BandejaReprogramacionModule,
    // Capacitacion
    BandejaExamenesModule,
    BandejaAsistenciaModule,
    BandejaEvaluacionesModule,
    ProgramarCapacitacionModule,
    CapacitacionModule,
    EvaluacionEditorModule,
    NormaIncidenciaModule,
    DeteccionHallazgosModule,
    FichaAuditorModule,
    BandejaRevisionAuditoriaModule,
    BandejaSeguimientoProgramaModule,
    BandejaSeguimientoPlanAuditoriaModule,
    RegistroHallazgosModule,
    BandejaRevisionInformeModule,
    AgrupacionHallazgosModule,
    MaterialModule,
    BancoPreguntaModule,
    RevisionDocumentosModule,
    TareaPendienteModule,
    CopiaImpresaModule,
    ConsultasModule,
    RevisionDocumentosModule,
    ProgramacionesModule,
    DistribucionModule,
    EjecucionModule,
    ConsultasDocumentoGModule,
    ModalesModule,
    AmazingTimePickerModule,
    PaginationModule
  ],
  providers: [{ provide: LocationStrategy, useClass: HashLocationStrategy },
    ApiService,
    ConsultaCargosSiService,
    AreaAuditoriaService,
    AuthService
    , SessionService,
  { provide: HTTP_INTERCEPTORS, useClass: JwtInterceptor, multi: true },
  { provide: HTTP_INTERCEPTORS, useClass: ErrorInterceptor, multi: true },
    AuthGuard,
    Title,
    DatePipe],
  bootstrap: [AppComponent]
})
export class AppModule {
  constructor(private navegacionService: NavegacionService) { }
}

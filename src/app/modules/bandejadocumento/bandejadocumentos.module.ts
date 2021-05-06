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
//tabs
//import {TabsModule} from 'ngx-bootstrap/tabs';
//tabs
// views
import {BandejaDocumentosRoutes} from './bandejadocumentos.routes';
import {BandejaDocumentosComponent} from './views/lista.component';
import {BandejaDocumentoEditarComponent} from './views/editar.component';
import {BandejaDocumentoFichaTecnicaComponent} from './views/registrarFichaTecnica.component';
import {registrardocumentoEditarComponent} from './views/registrar-documento.component';
//Tab
import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';

//components elaboracion
import {ElaboracionComponent} from './components/elaboracion.component';
//components Justificativa
import {JustificativaComponent} from './components/justificativa.component';
//components complementario
import {ComplementarioComponent} from './components/complementario.component';
//components Equipo Usuario y Perimisos
import {EquipoUsuarioComponent} from './components/equipo-usuario.component';
//components Revision
import {RevisionComponent} from './components/revision.component';
//components Consenso
import {ConsensoComponent} from './components/consenso.component';
//components Aprobación
import {AprobacionComponent} from './components/apobacion.component';
//components Homologación
import {HomologacionComponent} from './components/homologacion.component';
//components Gestion Documento
import {GestionDocumentoComponents} from './components/gestiondocumento.component';

//Modal
import {RegistroElaboracioncomponts} from './modales/registro-elaboracion.component';
 
//Consulta código anterior
import {ConsultaCodigoAnteriorcomponents} from './modales/consulta-codigo-anterior.component';

//Modal Agregar Usuario
import {AgregarUsuarioComponents} from './modales/agregar-usuario.component';

//Modal Agregar Usuario Distribucion
import {AgregarUsuarioDistribComponents} from './modales/agregar-usuario-distribucion.component';

//Modal Agregar Usuario
import {AgregarColaboradorComponents} from './modales/agregar-colaborador.component';
//Modal Subir Archivo
//import { SubirArchivoComponents } from './modales/subir-archivo.component';

//Modal Bajar Archivo
import { BajarDocumentoComponents } from 'src/app/modules/bandejadocumento/modales/bajar-documento.component';

//Modal Bajar Documento Cancelado
import { BajarDocumentoCanceladoComponents } from 'src/app/modules/bandejadocumento/modales/bajar-documento-cancelado.component';

//Modal Bajar Conocimiento Revisión de Documento
import { BajarConocimientoRevisionDocComponents } from 'src/app/modules/bandejadocumento/modales/bandeja-conocimiento-revision-doc.component';

import {VerDocumentoComponents} from './modales/ver-documento.component';

//Modal Revisiones
import {ModalRevisiones} from './modales/modal-revisiones.component';

//Modal Busqueda Avanzada
import { BusquedaAvanzadaComponents } from 'src/app/modules/bandejadocumento/modales/busqueda-avanzada.component';


import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
//import { DemoMaterialModule } from 'src/app/modules/arbol/arbol.module';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { DemoMaterialModule } from 'src/app/modules/tabs/tabs.module';

//Modal Permiso de Carpeta
import { PermisoCarpetaComponents } from 'src/app/modules/bandejadocumento/modales/permiso-carpeta.component';
//Modal Importar Ruta
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { ModalArbolProcesoComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol-proceso.component';
import { Arbol } from 'src/app/modules/arbol/arbol.module';
import { CRegistroDocumentoComponent } from 'src/app/modules/bandejadocumento/components/components-registro-documento.component';

//Alert
import {AlertModule} from 'ngx-bootstrap'; 

import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { FaseRegistroComponent } from 'src/app/modules/bandejadocumento/components/fase-registro.component';

//Modal Editar Participantes
import { EditarParticipantesComponents } from 'src/app/modules/bandejadocumento/modales/modal-editar-participantes.component';

//Dialog PDF
import {DialogsModule} from '../dialogs/dialogs.module';
import { CopiaImpresaModule } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa.module';
import { AgregarDestinatarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-destinatario.component';
import { CopiaImpresionComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-Listado/copiaimpresion.component';
import { AuthDirectivesModule } from 'src/app/auth/auth.directives';
import { BandejaEditarTrasladoComponent } from 'src/app/modules/bandejadocumento/views/editarTraslado.component';
import { GestionDocumentoTrasladoComponents } from 'src/app/modules/bandejadocumento/components/gestiondocumentoTraslado.component';
import { registrardocumentoTrasladoComponent } from 'src/app/modules/bandejadocumento/views/registrar-documento-traslado.component';
import { TabGroupAnimationsExampleHist } from 'src/app/modules/tabs/views/tab-group-animations-example-hist';
import { AgregarParticipanteComponents } from './modales/agregar-participante.component';
import { ModalArbolBusquedaAvanzadaComponents } from './modales/modal-arbol-busquedaAvanzada.component';
//import { TabGroupAnimationsCopiaImpresa } from 'src/app/modules/tabs-copiaImpresa/views/tab-group-animations-copiaImpresa';


@NgModule({
  declarations: [
    BandejaDocumentosComponent,
    BandejaDocumentoEditarComponent,
    BandejaEditarTrasladoComponent,
    BandejaDocumentoFichaTecnicaComponent,
    registrardocumentoEditarComponent,
    registrardocumentoTrasladoComponent,
    TabGroupAnimationsExample,
    TabGroupAnimationsExampleHist,
    ElaboracionComponent,
    JustificativaComponent,
    ComplementarioComponent,
    EquipoUsuarioComponent,
    RevisionComponent,
    ConsensoComponent,
    AprobacionComponent,
    GestionDocumentoTrasladoComponents,
    HomologacionComponent,
    RegistroElaboracioncomponts,
    ConsultaCodigoAnteriorcomponents,
    VerDocumentoComponents,
    AgregarUsuarioComponents,
    AgregarDestinatarioComponents,
    AgregarParticipanteComponents,
    AgregarUsuarioDistribComponents,
    ModalRevisiones,
    BusquedaAvanzadaComponents,
    PermisoCarpetaComponents,
    ImportarRutaComponents,
    AgregarColaboradorComponents,
    GestionDocumentoComponents,
    ModalArbolComponents,
    ModalArbolBusquedaAvanzadaComponents,
    ModalArbolProcesoComponents,
    CRegistroDocumentoComponent,
    //TreeFlatOverviewData
    //SubirArchivoComponents,
    BajarDocumentoComponents,
    BajarDocumentoCanceladoComponents,
    BajarConocimientoRevisionDocComponents,
    FaseRegistroComponent,
    EditarParticipantesComponents
  ],
  exports:[
    BandejaDocumentosComponent,
    BandejaDocumentoEditarComponent,
    BandejaEditarTrasladoComponent,
    BandejaDocumentoFichaTecnicaComponent,
    registrardocumentoEditarComponent,
    registrardocumentoTrasladoComponent,
    TabGroupAnimationsExample,
    TabGroupAnimationsExampleHist,
    ElaboracionComponent,
    JustificativaComponent,
    ComplementarioComponent,
    EquipoUsuarioComponent,
    RevisionComponent,
    ConsensoComponent,
    AprobacionComponent,
    GestionDocumentoTrasladoComponents,
    HomologacionComponent,
    RegistroElaboracioncomponts,
    ConsultaCodigoAnteriorcomponents,
    VerDocumentoComponents,
    AgregarUsuarioComponents,
    AgregarDestinatarioComponents,
    AgregarParticipanteComponents,
    AgregarUsuarioDistribComponents,
    ModalRevisiones,
    BusquedaAvanzadaComponents,
    PermisoCarpetaComponents,
    ImportarRutaComponents,
    AgregarColaboradorComponents,
    GestionDocumentoComponents,
    ModalArbolComponents,
    ModalArbolBusquedaAvanzadaComponents,
    ModalArbolProcesoComponents,
    CRegistroDocumentoComponent,
    CopiaImpresaModule,
    ],
  imports: [
    DialogsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
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
    Arbol,
    AlertModule.forRoot(),
    TooltipModule.forRoot(),
    CopiaImpresaModule,
    AuthDirectivesModule
  ],
  entryComponents: [//TreeFlatOverviewData,
    TabGroupAnimationsExample,
    TabGroupAnimationsExampleHist,
    RegistroElaboracioncomponts,
    ConsultaCodigoAnteriorcomponents,
    VerDocumentoComponents,
    AgregarUsuarioComponents,
    AgregarUsuarioDistribComponents,
    ModalRevisiones,
    BusquedaAvanzadaComponents,
    PermisoCarpetaComponents,
    ImportarRutaComponents,
    AgregarColaboradorComponents,
    ModalArbolComponents,
    ModalArbolBusquedaAvanzadaComponents,
    ModalArbolProcesoComponents,
   // SubirArchivoComponents,
    BajarDocumentoComponents,
    BajarDocumentoCanceladoComponents,
    EditarParticipantesComponents,
    BajarConocimientoRevisionDocComponents,
    AgregarDestinatarioComponents,
    AgregarParticipanteComponents
  ],
  bootstrap: [//TreeFlatOverviewData,
    TabGroupAnimationsExample,
    TabGroupAnimationsExampleHist
  ]

  /*,
    schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  ]*/
})
export class BandejaDocumentosModule { }


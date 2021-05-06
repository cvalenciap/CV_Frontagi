import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../../components/common/paginacion/paginacion.module';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
//import { DemoMaterialModule } from 'src/app/modules/arbol/arbol.module';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
//import { BuscadorDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/buscador-documento.component';
//import { BandejaSolicitudConsultasComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/consultas.component';
import { BandejaMenuConsultasComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/menuConsultas.component';
import { BandejaSolicitudConsultasComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/consultas.component';
import { BandejaDescargaMasivaDocComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/bandejaDescargaMasivaDoc.component';
import { BandejaReporteDocCanceladosComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/reporteDocCancelados.component';
import { BandejaConocimientoRevisionDocComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/bandejaConocimientoRevisionDoc.component';
import { BandejaSeguimientoDocsComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/bandejaSeguimientoDocumentos.component';
import { BandejaReporteTransaccionDocComponent } from 'src/app/modules/bandejadocumento/consulta/consultas/reporteTransaccionDocumentos.component';
import { DialogsModule } from 'src/app/modules/dialogs/dialogs.module';
import { SubirArchivoComponents } from 'src/app/modules/bandejadocumento/consulta/consultas/subir-archivo.component';
import { ModalBusquedaSeguimientoDocumentoComponent } from './modales/modal-busqueda-seguimiento-documento/modal-busqueda-seguimiento-documento.component';
import { EditarBandejaSeguimientoDocumentos } from './consultas/editarBandejaSeguimientoDocumentos.component';
import { TabGroupAnimationsExample } from '../../tabs/views/tab-group-animations-example';
import { BandejaDocumentosModule } from '../bandejadocumentos.module';
import { AuthDirectivesModule } from 'src/app/auth/auth.directives';
import { ProgramacionCargaDocComponent } from './consultas/programacion-carga-doc.component';
import { ModalSeleccionJerarquiaComponent } from 'src/app/modules/bandejadocumento/consulta/modales/modal-seleccion-jerarquia/modal-seleccion-jerarquia.component';
import { JerarquiasListaComponent } from 'src/app/modules/jerarquia/views/lista.component';
import { ModalArbolProcesoComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol-proceso.component';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    BandejaMenuConsultasComponent,
    BandejaSolicitudConsultasComponent,
    BandejaDescargaMasivaDocComponent,
    BandejaReporteDocCanceladosComponent,
    BandejaConocimientoRevisionDocComponent,
    BandejaSeguimientoDocsComponent,
    BandejaReporteTransaccionDocComponent,
    SubirArchivoComponents,
    EditarBandejaSeguimientoDocumentos,
    ModalBusquedaSeguimientoDocumentoComponent,
    ProgramacionCargaDocComponent,
    ModalSeleccionJerarquiaComponent,
  ],
  exports:[
  ],
  entryComponents: [
    ModalBusquedaSeguimientoDocumentoComponent,
    ModalSeleccionJerarquiaComponent,
  ],
  imports: [
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
    //DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    DialogsModule,
    BandejaDocumentosModule,
    AuthDirectivesModule,
    AlertModule.forRoot()
  ],
  //entryComponents: [TreeFlatOverviewData,TabGroupAnimationsExample,RegistroElaboracioncomponts,ConsultaCodigoAnteriorcomponents,VerDocumentoComponents,AgregarUsuarioComponents],
  //entryComponents: [BuscadorDocumentoComponent],
  //bootstrap: [TreeFlatOverviewData,TabGroupAnimationsExample],

  /*,
    schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  ]*/
})
export class ConsultasModule { }


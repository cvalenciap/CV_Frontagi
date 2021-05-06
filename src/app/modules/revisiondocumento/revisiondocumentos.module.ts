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
//import {RevisionDocumentosRoutes} from './revisiondocumentos.routes';





import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Arbol } from 'src/app/modules/arbol/arbol.module';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { RevisarDocumentoComponent } from './views/revisar.component';
import { RegistrarRevisionDocumentoComponent } from './views/registrar-revision-documento.component';
import { TabsModule, DemoMaterialModule } from 'src/app/modules/tabs/tabs.module';
import { ParticipanteComponent } from 'src/app/modules/revisiondocumento/components/participante.component';
//import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { BitacoraComponent } from './modals/bitacora.component';
import { ParticipanteNuevoComponent } from './modals/participante-nuevo.component';
import { BusquedaDocumentoComponent } from './modals/busqueda-documento.component';
import { BusquedaDocumentoSolicitudCopiaComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento-solicitud-copia.component';
import { BusquedaAvanzadaComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-avanzada.component';
import { BandejaDocumentosModule } from 'src/app/modules/bandejadocumento/bandejadocumentos.module';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { DialogsModule } from 'src/app/modules/dialogs/dialogs.module';
import { AuthDirectivesModule } from 'src/app/auth/auth.directives';
import {BusquedaDocumentoFichaComponent} from './modals/busqueda-documento-ficha.component';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    
    //lgomez ini
    RevisarDocumentoComponent,
    RegistrarRevisionDocumentoComponent,
    ParticipanteComponent,
    BitacoraComponent,
    ParticipanteNuevoComponent,
    BusquedaDocumentoComponent,
    BusquedaDocumentoSolicitudCopiaComponent,
    BusquedaAvanzadaComponent,
    BusquedaDocumentoFichaComponent
    //TabGroupAnimationsExample
    //lgomez fin
   
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
    DemoMaterialModule,
    MatNativeDateModule,
    ReactiveFormsModule,
    Arbol,
    BandejaDocumentosModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),    
    DialogsModule,
    AuthDirectivesModule
    //TabsModule
  ],
  exports: [BusquedaDocumentoComponent],
  entryComponents: [BitacoraComponent,ParticipanteNuevoComponent,BusquedaDocumentoComponent,BusquedaDocumentoSolicitudCopiaComponent,BusquedaAvanzadaComponent,BusquedaDocumentoFichaComponent],//TabGroupAnimationsExample

  bootstrap: [],//TabGroupAnimationsExample

  /*,
    schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  ]*/
})
export class RevisionDocumentosModule { }


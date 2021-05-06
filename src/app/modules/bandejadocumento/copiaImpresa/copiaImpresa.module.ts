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
import { AuthDirectivesModule } from 'src/app/auth/auth.directives';
//import { DemoMaterialModule } from 'src/app/modules/arbol/arbol.module';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import {BandejaSolicitudCopiasImpresasComponent} from './copiaImpresa-solicitud/copiaImpresa.component';

//import { TabsModuleCopiaImpresa } from 'src/app/modules/tabs-copiaImpresa/tabs-copiaImpresa.module';
import { TabsModule, AlertModule } from 'ngx-bootstrap';
import { TabGroupAnimationsCopiaImpresa } from 'src/app/modules/bandejadocumento/copiaImpresa/views/tab-group-animations-copiaImpresa';
import { BitacoraComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/bitacora.component';
import { SolicitudComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/solicitud.component';
import { CriticaComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/critica.component';
import { DemoMaterialModule } from 'src/app/modules/tabs/tabs.module';
import { CopiaImpresionComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-Listado/copiaimpresion.component';
import { ModalBusquedaCopiaImpresaComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-modal-busqueda-avanzada/modal-busqueda-copiaImpresa.component';
import { ModalAnadirCopiaImpresaComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-modal-anadir/modal-anadir-copiaImpresa.component';
//import { TabGroupAnimationsCopiaImpresa } from 'src/app/modules/tabs-copiaImpresa/views/tab-group-animations-copiaImpresa';
//import { TabsModuleCopiaImpresa } from 'src/app/modules/bandejadocumento/copiaImpresa/tabs/tabs-copiaImpresa.module';
//import { BusquedaDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento.component';
//PDF DIALOG
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { DialogsModule } from 'src/app/modules/dialogs/dialogs.module';
//cguerra ng build
import { BusquedaRevisionComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-modal-busqueda-revision/busqueda-documento.component';
//cguerra ng build

//PDF DIALOG
@NgModule({
  declarations: [    
    BandejaSolicitudCopiasImpresasComponent,
    CopiaImpresionComponent,
    BusquedaRevisionComponent,
    TabGroupAnimationsCopiaImpresa,
    BitacoraComponent,
    SolicitudComponent,
    CriticaComponent,
    ModalBusquedaCopiaImpresaComponent,
    ModalAnadirCopiaImpresaComponent
     
  ],
  imports: [
    CommonModule,
    AuthDirectivesModule,
    DialogsModule,
    RouterModule,    
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
  TabsModule.forRoot(),
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
    AlertModule.forRoot(),
    TooltipModule
  ],
  exports:[
    TabGroupAnimationsCopiaImpresa 
    ],
  //entryComponents: [TabGroupAnimationsCopiaImpresa],
  entryComponents: [BusquedaRevisionComponent,ModalBusquedaCopiaImpresaComponent,ModalAnadirCopiaImpresaComponent],
  //bootstrap: [TabGroupAnimationsCopiaImpresa],

  /*,
    schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  ]*/
})
export class CopiaImpresaModule { }


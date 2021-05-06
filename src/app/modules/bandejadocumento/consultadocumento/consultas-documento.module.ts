
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
//import { DemoMaterialModule } from 'src/app/modules/tabs/tabs.module';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
//import { BuscadorDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/buscador-documento.component';

import { ConsultaDocumentoComponent } from 'src/app/modules/bandejadocumento/consultadocumento/views/consulta-documento.component';
import { BandejaDocumentosModule } from 'src/app/modules/bandejadocumento/bandejadocumentos.module';

import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';


@NgModule({
  declarations: [    
    
    ConsultaDocumentoComponent
    //BuscadorDocumentoComponent
  ],

  
  imports: [
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
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
    BandejaDocumentosModule,
    
    
  ],
 // entryComponents: [GestionDocumentoComponents],
  //entryComponents: [BuscadorDocumentoComponent],
  //bootstrap: [TreeFlatOverviewData,TabGroupAnimationsExample],

  /*,
    schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  ]*/
})
export class ConsultasDocumentoGModule { }


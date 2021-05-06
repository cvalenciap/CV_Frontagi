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
// views
//Arbol
//mport { TreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla';
//Tab
//import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';

//Modal Agregar Usuario
import {AgregarCursoComponents} from './modales/agregar-curso.component';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { AlertModule } from 'ngx-bootstrap';  
import { DemoMaterialModule } from 'src/app/modules/tabs/tabs.module';
import { AmazingTimePickerModule } from 'amazing-time-picker'; 
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
  declarations: [   
   // TreeFlatOverviewData,
   // TabGroupAnimationsExample
   AgregarCursoComponents
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
    AlertModule.forRoot(),
    AmazingTimePickerModule
  ],
  entryComponents: [//TreeFlatOverviewData,
    //TabGroupAnimationsExample,
    AgregarCursoComponents],

  bootstrap: [//TreeFlatOverviewData,
    //TabGroupAnimationsExample],

  /*,
  schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA */ ]
})
export class CapacitacionModule { }


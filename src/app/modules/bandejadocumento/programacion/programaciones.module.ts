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
import { AuthDirectivesModule } from 'src/app/auth/auth.directives';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../../components/common/paginacion/paginacion.module';
import {BrowserModule} from '@angular/platform-browser';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';
import {HttpClientModule} from '@angular/common/http';
import {MatNativeDateModule} from '@angular/material';
import {ReactiveFormsModule} from '@angular/forms';
import { ProgramacionListaComponent } from 'src/app/modules/bandejadocumento/programacion/programacion/lista.component';
import { ProgramacionEditarComponent } from 'src/app/modules/bandejadocumento/programacion/programacion/editar.component';
import { BusquedaProgramacionComponent } from 'src/app/modules/bandejadocumento/programacion/modales/busqueda-programacion.component';
import { BusquedaRegistroComponent } from 'src/app/modules/bandejadocumento/programacion/modales/busqueda-registro.component';
//Alert
import {AlertModule} from 'ngx-bootstrap';

@NgModule({
  declarations: [    
    ProgramacionListaComponent,
    ProgramacionEditarComponent,
    BusquedaProgramacionComponent,
    BusquedaRegistroComponent
  ],
  imports: [
    CommonModule,
    AuthDirectivesModule,
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
    MatNativeDateModule,
    ReactiveFormsModule,
    AlertModule.forRoot()
  ],
  entryComponents: [BusquedaProgramacionComponent,BusquedaRegistroComponent],
})
export class ProgramacionesModule { }
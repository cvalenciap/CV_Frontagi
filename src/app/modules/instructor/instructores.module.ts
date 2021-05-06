import {NgModule} from '@angular/core';
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
import {InstructoresRoutes} from './instructores.routes';
// views
import {InstructoresListaComponent} from './views/lista.component';
import {InstructoresEditarComponent} from './views/editar.component';
import { BusquedaInstructorComponent } from 'src/app/modules/instructor/modales/busqueda-instructor.component';
import { BusquedaColaboradorMantenimientoComponent } from 'src/app/modules/instructor/modales/busqueda-colaborador-mantenimiento.component';
// modules/components
import {TooltipModule} from 'ngx-bootstrap/tooltip';

@NgModule({
    declarations: [
        InstructoresListaComponent,
        InstructoresEditarComponent,
        BusquedaInstructorComponent,
        BusquedaColaboradorMantenimientoComponent
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
        TooltipModule
    ],
    
    entryComponents:[
        BusquedaInstructorComponent,
        BusquedaColaboradorMantenimientoComponent
    ]
})
export class InstructoresModule { }


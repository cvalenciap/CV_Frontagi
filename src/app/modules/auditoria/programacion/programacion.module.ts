import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SpinKitModule } from './../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from './../../../components/common/paginacion/paginacion.module';
import { ProgramacionComponent } from './views/programacion/programacion.component';
import { RegistroProgramacionComponent } from './views/registro-programacion/registro-programacion.component';

import { AulasListaComponent } from '../../aula/views/lista.component';
import { AulasEditarComponent } from '../../aula/views/editar.component';
import { ModalBusquedaProgramacionComponent } from './modales/modal-busqueda-programacion/modal-busqueda-programacion.component';
import { ModalDetalleProgramacionComponent } from './modales/modal-detalle-programacion/modal-detalle-programacion.component';
import { ModalObservacionProgramacionComponent } from './modales/modal-detalle-programacion/modal-observacion-programacion.component';



@NgModule({
    declarations: [
        ProgramacionComponent,
        RegistroProgramacionComponent,
        ModalDetalleProgramacionComponent,
        ModalBusquedaProgramacionComponent,
        ModalObservacionProgramacionComponent 
    ],
    entryComponents: [
        ModalDetalleProgramacionComponent,
        ModalBusquedaProgramacionComponent,
        ModalObservacionProgramacionComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,
        PaginationModule.forRoot(),
        BsDatepickerModule,
        NgSelectModule,
        ToastrModule,
        SweetAlert2Module,
        SpinKitModule,
        PaginacionModule,
        AlertModule.forRoot()
    ],
    providers: []
})
export class ProgramacionModule {}
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
import { BandejaAsistenciaComponent } from './views/bandeja-asistencia/bandeja-asistencia.component';
import { ModalBusquedaAsistenciaComponent } from './modales/bandeja-asistencia/modal-busqueda-asistencia/modal-busqueda-asistencia.component';
import { DetalleAsistenciaComponent } from './views/detalle-asistencia/detalle-asistencia.component';
import { ModalModificarParticipantesComponent } from './modales/detalle-asistencia/modal-modificar-participantes/modal-modificar-participantes.component';
import {DetalleSesionEmpleado} from './views/detalle-sesion/detalle-sesion-empleado';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
@NgModule({
    declarations: [
        BandejaAsistenciaComponent,
        ModalBusquedaAsistenciaComponent,
        DetalleAsistenciaComponent,
        ModalModificarParticipantesComponent,
        DetalleSesionEmpleado
    ],
    entryComponents: [
        ModalBusquedaAsistenciaComponent,
        ModalModificarParticipantesComponent
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
        AlertModule.forRoot(),
        TooltipModule
    ],
    providers: []
})
export class BandejaAsistenciaModule {}
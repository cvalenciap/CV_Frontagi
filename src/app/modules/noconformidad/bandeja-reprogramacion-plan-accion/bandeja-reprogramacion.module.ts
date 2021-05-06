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
import { BandejaReprogramacionComponent } from './views/bandeja-reprogramacion/bandeja-reprogramacion.component';
import { DetalleReprogramacionComponent } from './views/detalle-reprogramacion/detalle-reprogramacion.component';
import { ModalDetalleAccionPropuestaComponent } from './modales/modal-detalle-accion-propuesta.component';


@NgModule({
    declarations: [
        BandejaReprogramacionComponent,
        DetalleReprogramacionComponent,
        ModalDetalleAccionPropuestaComponent
    ],
    entryComponents: [
        ModalDetalleAccionPropuestaComponent
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
export class BandejaReprogramacionModule {}
import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SpinKitModule } from './../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from './../../../components/common/paginacion/paginacion.module';
import { BandejaEvaluacionesComponent } from './views/bandeja-evaluaciones/bandeja-evaluaciones.component';
import { DetalleEvaluacionesComponent } from './views/detalle-evaluaciones/detalle-evaluaciones.component';
import { ModalRegistrarEvaluacionManualComponent } from './modales/detalle-evaluaciones/modal-registrar-evaluacion-manual/modal-registrar-evaluacion-manual.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import {DialogsModule} from '../../dialogs/dialogs.module';
@NgModule({
    declarations: [
        BandejaEvaluacionesComponent,
        DetalleEvaluacionesComponent,
        ModalRegistrarEvaluacionManualComponent
    ],
    entryComponents: [
        ModalRegistrarEvaluacionManualComponent
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
        TooltipModule.forRoot(),
        DialogsModule
        
    ],
    providers: []
})
export class BandejaEvaluacionesModule {}
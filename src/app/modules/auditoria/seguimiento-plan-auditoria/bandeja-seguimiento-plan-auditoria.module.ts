import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SpinKitModule } from '../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from '../../../components/common/paginacion/paginacion.module';
import { DemoMaterialModule } from '../../tabs/tabs.module';
import { BandejaSeguimientoPlanAuditoriaComponent } from './views/bandeja-seguimiento-plan-auditoria.component';
import { DetallePlanAuditoriaComponent } from './views/detalle-plan-auditoria.component';


@NgModule({
    declarations: [
        BandejaSeguimientoPlanAuditoriaComponent,
        DetallePlanAuditoriaComponent
    ],  
    imports: [
        CommonModule,
        DemoMaterialModule,
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
    ]  
}) 
export class BandejaSeguimientoPlanAuditoriaModule {} 
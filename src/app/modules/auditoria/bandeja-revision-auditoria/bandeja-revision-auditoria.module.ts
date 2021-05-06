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
import { BandejaRevisionAuditoriaComponent } from './lista-bandeja-revision/bandeja-revision-auditoria.component';
import { RegistrarBandejaRevisionComponent } from './registrar-bandeja-revision/registrar-bandeja-revision.component';
import { ListaVerificacionEquipoComponent } from './lista-verificacion-equipo/lista-verificacion-equipo.component';
import { EnviarInformeComponent } from './enviar-informe/enviar-informe.component';
import { ListaVerificacionResponsableComponent } from './lista-verificacion-responsable/lista-verificacion-responsable.component';
import { ModalAprobarEquipoComponent } from './modal-aprobar-equipo/modal-aprobar-equipo.component';
import { ModalBusquedaAvanzRevisionAuditoriaComponent } from './modal-busqueda-avanz-revision-auditoria/modal-busqueda-avanz-revision-auditoria.component';
import { DemoMaterialModule } from '../../tabs/tabs.module';

@NgModule({
    declarations: [
        BandejaRevisionAuditoriaComponent,
        RegistrarBandejaRevisionComponent,
        ListaVerificacionEquipoComponent,
        EnviarInformeComponent,
        ListaVerificacionResponsableComponent,
        ModalAprobarEquipoComponent,
        ModalBusquedaAvanzRevisionAuditoriaComponent
    ],  
    entryComponents: [
        ModalAprobarEquipoComponent,
        ModalBusquedaAvanzRevisionAuditoriaComponent

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
export class BandejaRevisionAuditoriaModule {} 
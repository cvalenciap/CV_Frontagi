import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';

import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SpinKitModule } from '../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from '../../../components/common/paginacion/paginacion.module';
import { RegistrarNormaIncidenciaComponent } from './registrar-norma-incidencia/registrar-norma-incidencia.component';
import { TreeModule } from 'angular-tree-component';
import { ModalBusquedaAvanzNormaIncidenciaComponent } from './modal-busqueda-avanz-norma-incidencia/modal-busqueda-avanz-norma-incidencia.component';
import { DemoMaterialModule } from 'src/app/modules/tabs/tabs.module';
import { ListaNormasIncidenciasComponent } from './lista-normas-incidencias/lista-normas-incidencias.component';
import { EditarNormaComponent } from './editar-norma/editar-norma.component';


@NgModule({
    declarations: [
        RegistrarNormaIncidenciaComponent,
        ModalBusquedaAvanzNormaIncidenciaComponent,
        ListaNormasIncidenciasComponent,
        EditarNormaComponent,

    ],
    entryComponents: [
        ModalBusquedaAvanzNormaIncidenciaComponent

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
        DemoMaterialModule,
        AlertModule.forRoot(),
        TreeModule.forRoot()

    ]


})
export class NormaIncidenciaModule { }
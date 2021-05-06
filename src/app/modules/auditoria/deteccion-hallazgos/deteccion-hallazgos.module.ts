import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule, TabsModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { DeteccionHallazgosComponent } from './lista-detecciones/deteccion-hallazgos.component';  
import { SpinKitModule } from '../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from '../../../components/common/paginacion/paginacion.module';
//
import { DetalleDeteccionesComponent } from './registrar-deteccion-hallazgos/detalle-detecciones/detalle-detecciones.component';
import { TreeModule } from 'angular-tree-component';
import { ModalRegistroDetalleComponent } from './registrar-deteccion-hallazgos/modal-registro-detalle/modal-registro-detalle.component';
import { ModalDeteccionHallazgosComponent } from './registrar-deteccion-hallazgos/modal-deteccion-hallazgos/modal-deteccion-hallazgos.component';
import { RegistrarDeteccionComponent } from './registrar-deteccion-hallazgos/registrar-deteccion/registrar-deteccion.component';
import { ModalBusquedaAvanzDeteccionesComponent } from './modal-busqueda-avanz-detecciones/modal-busqueda-avanz-detecciones.component';
import { ModalBusquedaDetectoresComponent } from './registrar-deteccion-hallazgos/modal-busqueda-detectores/modal-busqueda-detectores.component';
import { RegistrarDeteccionFueraComponent } from './registrar-deteccion-hallazgos/registrar-deteccion-fuera/registrar-deteccion-fuera.component';
import { DemoMaterialModule } from '../../tabs/tabs.module';
import { RegistrarDeteccionHallazgosComponent } from 'src/app/modules/auditoria/deteccion-hallazgos/registrar-deteccion-hallazgos/registrar-deteccion-hallazgos.component';

//cguerra ng build
//import { RegistrarDeteccionHallazgosComponent } from '../../registrar-deteccion-hallazgos/registrar-deteccion-hallazgos.component';

//cguerra ng build
@NgModule({
    declarations: [
        DeteccionHallazgosComponent,
        RegistrarDeteccionHallazgosComponent,
        DetalleDeteccionesComponent,
        ModalRegistroDetalleComponent,
        ModalDeteccionHallazgosComponent,
        RegistrarDeteccionComponent,
        ModalBusquedaAvanzDeteccionesComponent,
        ModalBusquedaDetectoresComponent,
        ModalBusquedaDetectoresComponent,
        RegistrarDeteccionFueraComponent
        

    ],
    entryComponents: [

       ModalRegistroDetalleComponent,
       ModalDeteccionHallazgosComponent ,
       ModalBusquedaAvanzDeteccionesComponent,
       RegistrarDeteccionComponent,
       ModalBusquedaDetectoresComponent

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
        TreeModule.forRoot(),
        AlertModule.forRoot(),
        TabsModule.forRoot(),
        DemoMaterialModule
        
    ]  

   
}) 
export class DeteccionHallazgosModule {}
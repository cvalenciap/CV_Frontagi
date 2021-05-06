import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../../components/common/paginacion/paginacion.module';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap';
import { DemoMaterialModule } from "../../tabs/tabs.module";


import { NoConformidadListaComponent } from './views/lista.component';
import { ModalBusquedaAvanzadaComponent } from './modales/modal-busqueda-avanzada/modal-busqueda-avanzada.component';
import { NoConformidadEditarComponent } from './views/editar.component';
import { ModalRegistroPlanAccionComponent } from './modales/modal-plan-accion/modal-registro-plan-accion.component';
import { ModalEjecucionComponent } from './modales/modal-ejecucion/modal-ejecucion.component';


@NgModule({
    declarations: [
        NoConformidadListaComponent,
        ModalBusquedaAvanzadaComponent,
        NoConformidadEditarComponent,
        ModalRegistroPlanAccionComponent,
        ModalEjecucionComponent
    ],
    entryComponents: [
        ModalBusquedaAvanzadaComponent,
        ModalRegistroPlanAccionComponent,
        ModalEjecucionComponent
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
        ReactiveFormsModule,
        AlertModule.forRoot(),
        TabsModule,
        DemoMaterialModule
    ]
})
export class NoConformidadModule { }
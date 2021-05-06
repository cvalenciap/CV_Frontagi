import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import {RouterModule} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../../components/common/paginacion/paginacion.module';
import { DemoMaterialModule } from '../../tabs/tabs.module';
// views
import { ListaAreaRequisitoComponent } from './views/listaAreaRequisito.component';
import { EditarAreaRequisitoComponent } from './views/editarAreaRequisito.component';
import { ModalBusquedaRequisitoComponent } from './modal/modal-busqueda-requisito.component';
import { ModalBusquedaCuestionarioComponent } from './modal/modal-busqueda-cuestionario.component';


@NgModule({
    declarations: [
        ListaAreaRequisitoComponent,
        EditarAreaRequisitoComponent,
        ModalBusquedaRequisitoComponent,
        ModalBusquedaCuestionarioComponent
    ],
    entryComponents: [
        ModalBusquedaRequisitoComponent,
        ModalBusquedaCuestionarioComponent        
    ],
    imports: [
        DemoMaterialModule,
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
        PaginacionModule
    ]
})
export class RegistroAreaRequisitoModule { }


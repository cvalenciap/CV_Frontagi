import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SpinKitModule } from '../../../components/common/spinkit/spinkit.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { PaginacionModule } from '../../../components/common/paginacion/paginacion.module';
import { DemoMaterialModule } from '../../tabs/tabs.module';
// views
import { ListaAreaAuditoriaComponent } from './views/listaAreaAuditoria.component';
import { EditarAreaAuditoriaComponent } from './views/editarAreaAuditoria.component';
import { ModalBusquedaResponsableComponent } from './modal/modal-busqueda-responsable.component';
import { AreaAuditoriaPipe } from './views/areaAuditoria.pipe';


@NgModule({
    declarations: [
        ListaAreaAuditoriaComponent,
        EditarAreaAuditoriaComponent,
        ModalBusquedaResponsableComponent,
        AreaAuditoriaPipe
    ],
    entryComponents: [
        ModalBusquedaResponsableComponent
    ],
    imports: [
        DemoMaterialModule,
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
        PaginacionModule
    ]
})
export class RegistroAreaAuditoriaModule { }


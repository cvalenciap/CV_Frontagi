import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { BsDropdownModule } from 'ngx-bootstrap/dropdown';
import { PaginationModule } from 'ngx-bootstrap/pagination';
import { BsDatepickerModule } from 'ngx-bootstrap/datepicker';
import { SpinKitModule } from './../../../components/common/spinkit/spinkit.module';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { PaginacionModule } from './../../../components/common/paginacion/paginacion.module';
import { DemoMaterialModule } from '../../tabs/tabs.module';
// views
import { ListaAreaNormaComponent } from './views/listaAreaNorma.component';
import { EditarAreaNormaComponent } from './views/editarAreaNorma.component';
import { ModalBusquedaNormaComponent } from './modal/modal-busqueda-norma.component';
import { AreaNormaAuditoriaPipe } from './views/areaNormaAuditoria.pipe';


@NgModule({
    declarations: [
        ListaAreaNormaComponent,
        EditarAreaNormaComponent,
        ModalBusquedaNormaComponent,
        AreaNormaAuditoriaPipe
    ],
    entryComponents: [
        ModalBusquedaNormaComponent
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
export class RegistroAreaNormaModule { }


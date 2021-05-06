import { BandejaListaVerificacionComponent } from "./views/bandeja-lista-verificacion/bandeja-lista-verificacion.component";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from "ngx-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { SpinKitModule } from "src/app/components/common/spinkit/spinkit.module";
import { PaginacionModule } from "src/app/components/common/paginacion/paginacion.module";
import { NgModule } from "@angular/core";
import { TreeModule } from "angular-tree-component";
import { RegistroListaVerificacionComponent } from "./views/registro-lista-verificacion/registro-lista-verificacion.component";
import { ModalRechazoListaComponent } from './modales/modal-rechazo-lista/modal-rechazo-lista.component';
import { ModalBusquedaColaboradorComponent } from "src/app/components/common/modal/modal-busqueda-colaborador/modal-busqueda-colaborador.component";
import { DemoMaterialModule } from "../../tabs/tabs.module";


@NgModule({
    declarations: [
        BandejaListaVerificacionComponent,
        RegistroListaVerificacionComponent,
        ModalRechazoListaComponent
        
    ],
    entryComponents: [
        ModalRechazoListaComponent
        
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
        TreeModule.forRoot(),
        DemoMaterialModule
    ]
})

export class ListaVerificacionModule{}
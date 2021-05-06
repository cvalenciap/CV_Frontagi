import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from "ngx-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { SpinKitModule } from "src/app/components/common/spinkit/spinkit.module";
import { PaginacionModule } from "src/app/components/common/paginacion/paginacion.module";
import { TreeModule } from "angular-tree-component";
import { NgModule } from "@angular/core";
import { BandejaRegistroHallazgosComponent } from "./views/bandeja-registro-hallazgos/bandeja-registro-hallazgos.component";
import { RegistroHallazgosComponent } from './views/registro-hallazgos/registro-hallazgos.component';
import { DemoMaterialModule } from "../../tabs/tabs.module";
import { ModalRechazoRevisionHallazgosComponent } from './modales/modal-rechazo-revision-hallazgos/modal-rechazo-revision-hallazgos.component';

@NgModule({
    declarations: [
        BandejaRegistroHallazgosComponent,
        RegistroHallazgosComponent,
        ModalRechazoRevisionHallazgosComponent
    ],
    entryComponents: [
        ModalRechazoRevisionHallazgosComponent
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
        DemoMaterialModule
    ],
    providers: []
})
export class RegistroHallazgosModule {}
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SpinKitModule } from './../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from './../../components/common/paginacion/paginacion.module';
import { BandejaRelacionCoordinadorComponent } from './views/bandeja-relacion-coordinador.component';
import { RegistroRelacionCoordinadorComponent } from './views/registro-relacion-coordinador.component';
import { ModalArbolRelacionComponent } from './modals/arbol-relacion.component';
import { TreeModule } from "angular-tree-component";
import { Arbol } from 'src/app/models/arbol';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { ModalArbolProcesoComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol-proceso.component';


@NgModule({
    declarations: [
        BandejaRelacionCoordinadorComponent,
        RegistroRelacionCoordinadorComponent,
        ModalArbolRelacionComponent,
    ],
    entryComponents: [
        ModalArbolRelacionComponent
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
    ],
    providers: []
})
export class BandejaRelacionCoordinadorModule {}
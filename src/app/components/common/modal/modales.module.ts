import { NgModule } from "@angular/core";
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from "ngx-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { PaginacionModule } from "../paginacion/paginacion.module";
import { SpinKitModule } from "../spinkit/spinkit.module";
import { ModalBusquedaColaboradorComponent } from "./modal-busqueda-colaborador/modal-busqueda-colaborador.component";
import { ModalConfirmacionComponent } from "./modal-confirmacion/modal-confirmacion.component";

@NgModule({
    declarations: [
        ModalBusquedaColaboradorComponent,
        ModalConfirmacionComponent
    ],
    entryComponents: [
        ModalBusquedaColaboradorComponent,
        ModalConfirmacionComponent
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
  ]
  })
  export class ModalesModule{}
import { NgModule } from "@angular/core";
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
import { ArbolPlantillaCoTreeFlatOverviewData } from "src/app/modules/arbol/views/arbol-plantilla-component";
import { ArbolProceso } from "src/app/modules/arbol/views/arbol-proceso-component";
import { ArbolBusquedaAvanzadaCoTreeFlatOverviewData } from "./views/arbol-busquedaAvanzada-component";

@NgModule({
  declarations: [
    ArbolPlantillaCoTreeFlatOverviewData,
    ArbolBusquedaAvanzadaCoTreeFlatOverviewData,
    ArbolProceso,
  ],
  exports:[
    ArbolPlantillaCoTreeFlatOverviewData,
    ArbolBusquedaAvanzadaCoTreeFlatOverviewData,
    ArbolProceso
  ],
  entryComponents: [
    ArbolPlantillaCoTreeFlatOverviewData,
    ArbolBusquedaAvanzadaCoTreeFlatOverviewData,
    ArbolProceso
  ],
  bootstrap: [
    ArbolPlantillaCoTreeFlatOverviewData,
    ArbolBusquedaAvanzadaCoTreeFlatOverviewData,
    ArbolProceso
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
    AlertModule.forRoot()
]
})
export class Arbol{}
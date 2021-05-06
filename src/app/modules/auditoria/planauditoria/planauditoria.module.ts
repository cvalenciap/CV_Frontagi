import { NgModule } from "@angular/core";
import { BandejaPlanComponent } from './views/bandeja-plan/bandeja-plan.component';
import { CommonModule } from "@angular/common";
import { RouterModule } from "@angular/router";
import { FormsModule, ReactiveFormsModule } from "@angular/forms";
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from "ngx-bootstrap";
import { NgSelectModule } from "@ng-select/ng-select";
import { ToastrModule } from "ngx-toastr";
import { SweetAlert2Module } from "@toverux/ngx-sweetalert2";
import { SpinKitModule } from "src/app/components/common/spinkit/spinkit.module";
import { PaginacionModule } from "src/app/components/common/paginacion/paginacion.module";
import { RegistroPlanAuditoriaComponent } from './views/registro-plan-auditoria/registro-plan-auditoria.component';
import { ModalConsideracionesPlanComponent } from './modales/modal-consideraciones-plan/modal-consideraciones-plan.component';
import { ModalConfirmacionComponent } from "src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component";
import { ModalRegistroRequisitosComponent } from './modales/modal-registro-requisitos/modal-registro-requisitos.component';
import { ModalBusquedaAuditorComponent } from './modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { TreeModule, TreeComponent } from "angular-tree-component";
import { ModalBusquedaPlanComponent } from './modales/modal-busqueda-plan/modal-busqueda-plan.component';
import { AnadirRequisitosAuditoriaComponent } from './views/anadir-requisitos-auditoria/anadir-requisitos-auditoria.component';
import { ModalObservacionPlanComponent } from "./modales/modal-observar/modal-observacion-plan.component";
import { DemoMaterialModule } from "../../tabs/tabs.module";
import { TimepickerModule } from 'ngx-bootstrap';
import { ModalCriteriosComponent } from "./modales/modal-criterios/modal-criterios.component";
import { EditarAreaNormaComponent } from './views/anadir_norma/editarAreaNorma.component';
import { ModalBusquedaNormaComponent } from './views/modal/modal-busqueda-norma.component';

@NgModule({
  declarations: [
    BandejaPlanComponent, 
    RegistroPlanAuditoriaComponent, 
    AnadirRequisitosAuditoriaComponent,
    ModalConsideracionesPlanComponent,
    ModalRegistroRequisitosComponent,
    ModalBusquedaAuditorComponent,
    ModalBusquedaPlanComponent,
    ModalObservacionPlanComponent,
    ModalCriteriosComponent,
    EditarAreaNormaComponent,
    ModalBusquedaNormaComponent
  ],
  entryComponents: [
    ModalConsideracionesPlanComponent,
    ModalRegistroRequisitosComponent,
    ModalBusquedaAuditorComponent,
    ModalBusquedaPlanComponent,
    ModalObservacionPlanComponent,
    ModalCriteriosComponent,
    ModalBusquedaNormaComponent
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
    DemoMaterialModule,
    TimepickerModule.forRoot()
]
})
export class PlanAuditoriaModule{}
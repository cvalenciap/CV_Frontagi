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
import { BandejaAgrupacionHallazgosComponent } from './views/bandeja-agrupacion-hallazgos/bandeja-agrupacion-hallazgos.component';

@NgModule({
    declarations: [
        BandejaAgrupacionHallazgosComponent
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
  export class AgrupacionHallazgosModule{}
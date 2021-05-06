import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { EvaluacionEditorComponent } from './evaluacion-editor/evaluacion-editor.component';
import { RegistrarEvaluacionComponent } from './registrar-evaluacion/registrar-evaluacion.component'; 
     
import { SpinKitModule } from '../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from '../../../components/common/paginacion/paginacion.module';
import { ModalBusquedaAvanzEvaluacionEditorComponent } from './modal-busqueda-avanz-evaluacion-editor/modal-busqueda-avanz-evaluacion-editor.component';
  
 
@NgModule({
    declarations: [
        EvaluacionEditorComponent,
        RegistrarEvaluacionComponent,
        ModalBusquedaAvanzEvaluacionEditorComponent
      
    ],
    entryComponents: [
      //  ModalDetalleProgramacionComponent
      ModalBusquedaAvanzEvaluacionEditorComponent
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
        AlertModule.forRoot()
    ]
})
export class EvaluacionEditorModule {}
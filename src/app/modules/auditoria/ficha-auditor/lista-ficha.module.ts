import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';

import { BsDropdownModule, PaginationModule, BsDatepickerModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';

//import { RegistrarEvaluacionComponent } from './registrar-evaluacion/registrar-evaluacion.component';   
import { SpinKitModule } from '../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from '../../../components/common/paginacion/paginacion.module';
import { FichaAuditorComponent } from './lista-ficha-auditor/ficha-auditor.component';
import { RegistrarFichaAuditorComponent } from './registrar-ficha-auditor/registrar-ficha-auditor.component';

       
   
@NgModule({
    declarations: [
        FichaAuditorComponent,
        RegistrarFichaAuditorComponent
  
      
    ],
    entryComponents: [
       
      //  ModalDetalleProgramacionComponent
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
        PaginacionModule
        
        
    ]  

     
})
export class FichaAuditorModule {}
import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SpinKitModule } from '../../../components/common/spinkit/spinkit.module';
import { PaginacionModule } from '../../../components/common/paginacion/paginacion.module';
import { BandejaRevisionInformeComponent } from './lista-bandeja-revision-informe/bandeja-revision-informe.component';
import { ListaVerificarInformeComponent } from './lista-verificar-informe/lista-verificar-informe.component';
import { ModalBusquedaAvazBandjComponent } from './modal-busqueda-avaz-bandj/modal-busqueda-avaz-bandj.component';
import { ImpresionInformeComponent } from './lista-verificar-informe/impresion-informe/impresion-informe.component';



import { BrowserModule } from '@angular/platform-browser';
import { PdfViewerModule } from 'ng2-pdf-viewer'; // <- import OrderModule
import { DemoMaterialModule } from '../../tabs/tabs.module';




@NgModule({
    declarations: [
        BandejaRevisionInformeComponent,
        ListaVerificarInformeComponent,
        ModalBusquedaAvazBandjComponent,
        ImpresionInformeComponent  
    ],  
    entryComponents: [
        ModalBusquedaAvazBandjComponent
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
        DemoMaterialModule,
        BrowserModule,
        PdfViewerModule,
       
  
    ]  

   
}) 
export class BandejaRevisionInformeModule {} 


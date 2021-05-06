import { Component, OnInit } from '@angular/core';


import { Paginacion, Tipo } from './../../../../../app/models';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {Response} from './../../../../models/response';

import { FichaAuditor } from 'src/app/models/fichaauditor';

import { FichaAuditorService } from 'src/app/services/impl/fichaauditor.service';

import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';

import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
//import { MyTestApp } from './my-test-app';

//import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';



//import {MatDatepickerModule} from '@angular/material/datepicker';

@Component({
  selector: 'registrar-ficha-auditor',
  templateUrl: './registrar-ficha-auditor.component.html',
  styleUrls: ['./registrar-ficha-auditor.component.scss']
})
export class RegistrarFichaAuditorComponent implements OnInit {

  


  fechaProgramacionDefecto:string;
  usuarioCreacionDefecto:string;

   /* datos */
   items: string[];
   /* filtros */
   textoBusqueda: string;
   parametroBusqueda: string;
   /* paginación */
   paginacion: Paginacion;
   /* registro seleccionado */
   selectedRow: number;
   //selectedObject: RutaResponsable;
   /* indicador de carga */
   loading: boolean;
   itemCodigo: number;
    /* datos */

    //selectedObject: DetalleProgramacion;
    listaTipos: Tipo[];  
    item: FichaAuditor;
    private sub: any;
    bsModalRef: BsModalRef;
 
     
    listaCursosLlevados=[];
    listaCursosPorLlevar=[];
    constructor(
    
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: FichaAuditorService,

    

    
  ){ 
      this.loading = false;
      this.selectedRow = -1;
      this.items = ['Interpretación de las Normas ISO-9001'];
      this.parametroBusqueda = 'codigo';
      this.paginacion = new Paginacion({registros: 10});


      defineLocale('es', esLocale);
      this.localeService.use('es');
      this.selectedRow = -1;
        
      this.listaCursosLlevados=["Interpretación de las Normas ISO-9001","Interpretación de las Normas ISO-14001","Interpretación de las Normas OSHA-18001","Formación de Auditores Internos"];
      this.listaCursosPorLlevar=["Auditoría de Sistemas"];
  }

 



  

obtenerDocumentosRelacionados(){

}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    this.itemCodigo = + params['codigo'];
      
    this.obtenerDocumentosRelacionados();

  });

  if (this.itemCodigo) {
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
          (response: Response) => {
            this.item = response.resultado
           
          },
         
      );
  } else {
    
      this.item = new FichaAuditor()
     
      
  }
  
}
   

  OnRegresar() {
 
    this.router.navigate([`auditoria/ficha-auditor`]);
  }
}


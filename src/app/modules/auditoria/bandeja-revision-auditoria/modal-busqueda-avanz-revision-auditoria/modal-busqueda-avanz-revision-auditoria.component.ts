
import { Component, OnInit, SecurityContext } from '@angular/core';
import { NormaIncidencia } from './../../../../models/normaincidencia';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';  
import { DeteccionHallazgos } from 'src/app/models/deteccionhallazgos';
import { Subject, forkJoin } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap'; 
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';

import { BandejaRevisionAuditoria } from 'src/app/models/bandejarevisionauditoria';
//import { ModalBusquedaAvanzNormaIncidenciaComponent } from '../modal-busqueda-avanz-norma-incidencia/modal-busqueda-avanz-norma-incidencia.component';
 

@Component({
  selector: 'app-modal-busqueda-avanz-revision-auditoria',
  templateUrl: './modal-busqueda-avanz-revision-auditoria.component.html',
  styleUrls: ['./modal-busqueda-avanz-revision-auditoria.component.scss']
})
export class ModalBusquedaAvanzRevisionAuditoriaComponent implements OnInit {

  public onClose: Subject<BandejaRevisionAuditoria>;
  bsConfig: object;
  //listaAuditores:any[];
  listaEquipos:any[];
  busqueda:BandejaRevisionAuditoria;
  loading:boolean;


  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService) { 
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
    this.loading = false;
    }


    ngOnInit() {
      this.onClose = new Subject();
      this.busqueda = new BandejaRevisionAuditoria();
      //this.listaAuditores = [];
      this.listaEquipos = [];
     
      this.obtenerParametros();
    }
  
    cancelar(){
      this.bsModalRef.hide();
    }
  
    obtenerParametros(){
     // const buscaAuditores= this.service.obtenerAuditores();
    /*  const buscaEquipos = this.service.obtenerEquipos();   
      forkJoin(buscaEquipos)
      .subscribe(([buscaEquipos]:[Response])=>{
        //this.listaAuditores = buscaAuditores.resultado;
        this.listaEquipos = buscaEquipos.resultado;     
      },
      (error) => this.controlarError(error));*/
    }
  
    controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
  
    buscar(){
      if(this.busqueda.apellidoPat!= "" ||this.busqueda.apellidoMat!= "" ||this.busqueda.nombre!= ""
       || this.busqueda.equipo != "" || this.busqueda.numeroAuditoria != ""  || this.busqueda.numeroLV != "" 
       || this.busqueda.numeroInformeAuditoria != ""  ){
        this.bsModalRef.hide();
        this.onClose.next(this.busqueda); 
      }
    }

    
  

  
}

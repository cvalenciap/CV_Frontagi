
import { DeteccionHallazgos } from 'src/app/models/deteccionhallazgos';


import { Component, OnInit, ViewChild } from '@angular/core';
import {  BsLocaleService, defineLocale, esLocale ,BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RequisitoAuditoria } from 'src/app/models/requisitoauditoria';
import { Subject, forkJoin, interval } from 'rxjs';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { RequisitoAuditoriaRegistro } from 'src/app/models/requisitoauditoriaregistro';
import { Response } from './../../../../../models/response';
import { Auditor } from 'src/app/models/auditor';
import { Paginacion } from 'src/app/models';
import { DeteccionHallazgosMockService as PlanAuditoriaService, GeneralService} from './../../../../../services/index';
import { ModalConfirmacionComponent } from 'src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component';
//import { ModalBusquedaAuditorComponent } from '../../../modal-busqueda-auditor/modal-busqueda-auditor.component';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ModalBusquedaAuditorComponent } from '../../../planauditoria/modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { Router } from '@angular/router';

import { DeteccionHallazgosMockService as DeteccionHallazgosService} from './../../../../../services/index';
import { NombreParametro } from 'src/app/constants/general/general.constants';



@Component({
  selector: 'app-modal-deteccion-hallazgos',
  templateUrl: './modal-deteccion-hallazgos.component.html',
  styleUrls: ['./modal-deteccion-hallazgos.component.scss'],
  providers: [DeteccionHallazgosService]
})
export class ModalDeteccionHallazgosComponent implements OnInit {

  registroRequisitosForm:FormGroup;
  
  public onClose: Subject<DeteccionHallazgos>;

  selectedObject: DeteccionHallazgos;

   tipoRadio: string;

   origenDet: string;

   loading: boolean;

   listaIncidenciasCombo:any[];

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private generalService: GeneralService,
    private service: DeteccionHallazgosService,
    private localeService: BsLocaleService,
    private formBuilder: FormBuilder,   
    private router: Router) {    
    defineLocale('es', esLocale);
    this.localeService.use('es'); 

  }


  obtenerParametros(){
    const buscaIncidenciasCombo = this.generalService.obtenerParametroPadre(NombreParametro.listaOrigenDeteccion);
    forkJoin(buscaIncidenciasCombo)
    .subscribe(([buscaIncidenciasCombo]:[Response])=>{  
      this.listaIncidenciasCombo = buscaIncidenciasCombo.resultado;

    },  
    (error) => this.controlarError(error));
}
  
controlarError(error) {
  console.error(error);
  this.loading = false;
  this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}


  ngOnInit() {

    localStorage.removeItem("tipoDet");
    localStorage.removeItem("origenDet");

    this.origenDet = "";

    this.onClose = new Subject();
    this.listaIncidenciasCombo = [];
    this.obtenerParametros();
  }

  OnRegresar(){
    this.bsModalRef.hide();
  }

  obtenerClick(event) {
    
     this.tipoRadio = event.target.value;
  }

  nuevaDeteccion(): void { 
 
    localStorage.setItem("tipoDet",this.tipoRadio);
  
    localStorage.setItem("origenDet",this.origenDet);


if(this.tipoRadio=='1'){

   this.bsModalRef.hide();
   this.router.navigate([`auditoria/deteccion-hallazgos/nuevo`]); 
  }
  else{
    

   this.bsModalRef.hide();
   this.router.navigate([`auditoria/deteccion-hallazgos/nuevoFuera`]); 
  }


  
  }
 

}



import { BandejaRevisionAuditoria } from 'src/app/models/bandejarevisionauditoria';

import { Component, OnInit, ViewChild } from '@angular/core';
import {  BsLocaleService, defineLocale, esLocale ,BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RequisitoAuditoria } from 'src/app/models/requisitoauditoria';
import { Subject, forkJoin, interval } from 'rxjs';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { RequisitoAuditoriaRegistro } from 'src/app/models/requisitoauditoriaregistro';
import { Response } from './../../../../models/response';
import { Auditor } from 'src/app/models/auditor';
import { Paginacion } from 'src/app/models';
import { PlanAuditoriaMockService as PlanAuditoriaService} from './../../../../services/index';
import { ModalConfirmacionComponent } from 'src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component';
//import { ModalBusquedaAuditorComponent } from '../../../modal-busqueda-auditor/modal-busqueda-auditor.component';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ModalBusquedaAuditorComponent } from '../../planauditoria/modales/modal-busqueda-auditor/modal-busqueda-auditor.component';



@Component({
  selector: 'app-modal-aprobar-equipo',
  templateUrl: './modal-aprobar-equipo.component.html',
  styleUrls: ['./modal-aprobar-equipo.component.scss']
})
export class ModalAprobarEquipoComponent implements OnInit {
  [x: string]: any;


  public onClose: Subject<BandejaRevisionAuditoria>;
  bsConfig: object;

  bandejaRevisionForm:FormGroup;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private planAuditoriaService: PlanAuditoriaService,
    private localeService: BsLocaleService,
    private formBuilder: FormBuilder) {
      this.selectedRow = -1;
      this.selectedRowComite = -1;
      this.participantes = [];
      this.comites = [];
      this.paginacion = new Paginacion({registros: 10});
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
  }

 
  crearForm() {    
    this.bandejaRevisionForm = this.formBuilder.group({
        'fechaIngreso': new FormControl({ value: ''}),
        'numeroAuditoria':new FormControl({ value: '' })
    });
  }
  
  ngOnInit() {
    this.onClose = new Subject();
    this.crearForm();

    
  
  }

}

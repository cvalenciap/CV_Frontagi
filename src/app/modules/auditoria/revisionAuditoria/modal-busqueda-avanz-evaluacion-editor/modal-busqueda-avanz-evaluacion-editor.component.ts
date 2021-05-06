

import { EvaluacionEditor } from 'src/app/models/evaluacioneditor';
import { Component, OnInit } from '@angular/core';

import { Subject, forkJoin } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../models/response';
import { FichaAuditor } from 'src/app/models/fichaauditor';


@Component({
  selector: 'app-modal-busqueda-avanz-evaluacion-editor',
  templateUrl: './modal-busqueda-avanz-evaluacion-editor.component.html',
  styleUrls: ['./modal-busqueda-avanz-evaluacion-editor.component.scss']
})
export class ModalBusquedaAvanzEvaluacionEditorComponent implements OnInit {


  public onClose: Subject<EvaluacionEditor>;
  bsConfig: object;

  //filtros
  numeroFicha:String;
  apellidoPat:string;
  apellidoMat:string;
  nombre :string;

  busqueda:EvaluacionEditor;
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
      this.busqueda = new EvaluacionEditor();
      this.busqueda.colaborador.apellidoPaterno ="";
      this.busqueda.colaborador.apellidoMaterno ="";
      this.busqueda.colaborador.nombre ="";  
    }

    cancelar(){
      this.bsModalRef.hide();
    }
    controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
  
    buscar(){
      console.log(this.busqueda);
      
      if(this.busqueda.colaborador.numeroFicha != "" || this.busqueda.colaborador.apellidoPaterno != "" || 
      this.busqueda.colaborador.apellidoMaterno != ""|| this.busqueda.colaborador.nombre != ""){
  
        this.bsModalRef.hide();
        this.onClose.next(this.busqueda);
      }
      
    }




}

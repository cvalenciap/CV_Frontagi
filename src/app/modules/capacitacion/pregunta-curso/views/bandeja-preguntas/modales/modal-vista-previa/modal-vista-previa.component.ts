import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from 'src/app/models/programa';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
//import { Response } from './../../../../../models/response';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'app-modal-vista-previa',
  templateUrl: './modal-vista-previa.template.html',
  styleUrls: ['./modal-vista-previa.component.scss']
})
export class ModalVistaPreviaExamenComponent implements OnInit {
    public onClose: Subject<Programa>;
    bsConfig: object;
  
    busqueda:Programa;
    title:string;

    dateTimeObj: string = "01/01/2019";
  
    constructor(public bsModalRef: BsModalRef,
      private toastr: ToastrService,
      private localeService: BsLocaleService) {
        defineLocale('es', esLocale);
      this.localeService.use('es'); 
      }
  
    ngOnInit() {
      this.onClose = new Subject();
      this.busqueda = new Programa();
      this.busqueda.usuarioCreacion = "";
      // console.log(this.hola);
      console.log(this.busqueda);
    }
  
    cancelar(){
      this.bsModalRef.hide();
    }
  
    buscar(){
      console.log(this.busqueda);
      
      if(this.busqueda.usuarioCreacion != "" || (this.busqueda.fechaPrograma != undefined && this.busqueda.fechaPrograma != null)){
        this.bsModalRef.hide();
        this.onClose.next(this.busqueda);
      }
      
    }
}
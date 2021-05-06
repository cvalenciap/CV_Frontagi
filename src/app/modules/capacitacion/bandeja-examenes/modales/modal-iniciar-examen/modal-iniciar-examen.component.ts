import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from 'src/app/models/programa';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { forkJoin } from 'rxjs';

import {ModalPreguntaExamenComponent} from './modal-pregunta-examen.component';

@Component({
  selector: 'app-modal-iniciar-examen',
  templateUrl: './modal-iniciar-examen.template.html'
})
export class ModalIniciarExamenComponent implements OnInit {
    public onClose: Subject<Programa>;
    bsConfig: object;
  
    title:string;

    dateTimeObj: string = "01/01/2019";
  
    constructor(public bsModalRef: BsModalRef,
      private toastr: ToastrService,
      private modalService: BsModalService,
      private localeService: BsLocaleService) {
        defineLocale('es', esLocale);
      this.localeService.use('es'); 
      }
  
    ngOnInit() {
      this.onClose = new Subject();
      // console.log(this.hola);
    }
  
    cancelar(){
      this.bsModalRef.hide();
    }
  
    OnIniciarExamen(): void{
      this.bsModalRef.hide();
      const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
              title:"Examen",
              numeroPregunta : 1
          },
          class: 'modal-lg'
      }
      this.bsModalRef = this.modalService.show(ModalPreguntaExamenComponent, config);
      (<ModalPreguntaExamenComponent>this.bsModalRef.content).onClose.subscribe(result => {
    
      });
    }
}
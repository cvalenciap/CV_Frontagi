import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from 'src/app/models/programa';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { forkJoin } from 'rxjs';

import { ModalEncuestaComponent } from '../modal-encuesta/modal-encuesta.component';

@Component({
  selector: 'app-modal-detalle-examen',
  templateUrl: './modal-detalle-examen.template.html'
})
export class ModalDetalleExamenComponent implements OnInit {
    public onClose: Subject<Programa>;
    bsConfig: object;
  
    title: string;
    tipoVisualizacion: string;

  
    constructor(public bsModalRef: BsModalRef,
      private toastr: ToastrService,
      private modalService: BsModalService,
      private localeService: BsLocaleService) {
        defineLocale('es', esLocale);
      this.localeService.use('es'); 
      }
  
    ngOnInit(): void{
      this.onClose = new Subject();
    }
  
    cancelar(): void{
      this.bsModalRef.hide();
    }

    OnDarEncuesta(): void{
      this.bsModalRef.hide();
      const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
              title:"Encuesta"
          },
          class: 'modal-lg'
      }
      this.bsModalRef = this.modalService.show(ModalEncuestaComponent, config);
      (<ModalEncuestaComponent>this.bsModalRef.content).onClose.subscribe(result => {
    
      });
    }

}
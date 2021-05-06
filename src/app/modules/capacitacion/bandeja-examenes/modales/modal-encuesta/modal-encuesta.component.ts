import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from 'src/app/models/programa';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { forkJoin } from 'rxjs';

import { ModalDetalleExamenComponent } from '../modal-detalle-examen/modal-detalle-examen.component'

@Component({
    selector: 'app-modal-encuesta',
    templateUrl: './modal-encuesta.template.html'
})
export class ModalEncuestaComponent implements OnInit {
    title: string;

    public onClose: Subject<Programa>;
    bsConfig: object;

    constructor(public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private localeService: BsLocaleService) {
        
        defineLocale('es', esLocale);
        this.localeService.use('es');

    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    OnGuardarEncuesta(): void{
        this.bsModalRef.hide();
    }



}
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
    selector: 'app-modal-pregunta-examen',
    templateUrl: './modal-pregunta-examen.template.html'
})
export class ModalPreguntaExamenComponent implements OnInit {
    title: string;
    numeroPregunta: number;
    tiempoExamen: string;
    vistaPrevia: boolean;

    public onClose: Subject<Programa>;
    bsConfig: object;

    constructor(public bsModalRef: BsModalRef,
        private toastr: ToastrService,
        private modalService: BsModalService,
        private localeService: BsLocaleService) {
        

        defineLocale('es', esLocale);
        this.localeService.use('es');

        this.numeroPregunta = 0;
        this.tiempoExamen = "";
        this.OnstartCountdown(3600);
        this.vistaPrevia = false;
    }

    ngOnInit() {
        this.onClose = new Subject();
    }

    cancelar() {
        this.bsModalRef.hide();
    }

    OnNavegaPregunta(tipoboton: string): void{
        
        if(tipoboton == 'siguiente'){
            this.numeroPregunta = this.numeroPregunta + 1;
        } else if(tipoboton == 'anterior'){
            this.numeroPregunta = this.numeroPregunta - 1;
        }
    }

    OnFinalizarExamen() : void{
        this.bsModalRef.hide();
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title:"Examen",
                tipoVisualizacion: "resultado-examen"
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalDetalleExamenComponent, config);
        (<ModalDetalleExamenComponent>this.bsModalRef.content).onClose.subscribe(result => {
      
        });
    }

    OnVistaPrevia(): void{
        this.vistaPrevia = true;
        this.numeroPregunta = 0;
    }

    OnVerPregunta(numPreguna: number): void{
        this.numeroPregunta = numPreguna;
        this.vistaPrevia = false;
    }

    OnstartCountdown(seconds): void {
        var counter = seconds;

        var interval = setInterval(() => {
            //console.log(counter);
            counter--;

            var h = Math.floor(counter / 3600);
            var m = Math.floor(counter % 3600 / 60);
            var s = Math.floor(counter % 3600 % 60);
            this.tiempoExamen = "0" + h + ":" + m + ":"+ s;

            // The code here will run when the timer has reached zero.
            // if (counter < 0) {
            //     clearInterval(interval);
            //     console.log('Ding!');
            // };
        }, 1000);
    };

}
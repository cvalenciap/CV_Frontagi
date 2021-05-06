import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DetalleEvaluaciones } from 'src/app/models/detalleevaluaciones';
import { EmpleadoAsistencia } from 'src/app/models';

@Component({
    selector: 'app-modal-registrar-evaluacion-manual',
    templateUrl: './modal-registrar-evaluacion-manual.template.html',
    styleUrls: ['./modal-registrar-evaluacion-manual.component.scss']
  })
  export class ModalRegistrarEvaluacionManualComponent implements OnInit {

    public onClose: Subject<EmpleadoAsistencia>;
    detalleEvaluacionesForm: FormGroup;
    busqueda:DetalleEvaluaciones;
    bsConfig: object;
    /** Datos **/
    deshabilitarCaja:boolean;
    valorCurso:string;
    valorParticipante:string;
    valorNota:string;
    valorSustento:string;
    empleado:EmpleadoAsistencia;
    /** Datos **/

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService,
                private formBuilder: FormBuilder
            ) {
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
    }

    ngOnInit() {
        
        this.onClose = new Subject();
        this.createForm();
        this.busqueda = new DetalleEvaluaciones();
        /** Datos **/
        this.deshabilitarCaja = true;
    }

    createForm() {
        this.detalleEvaluacionesForm = this.formBuilder.group({
            'curso': new FormControl({ value: ''}),
            'participante': new FormControl({ value: ''}),
            'nota': new FormControl({ value: '' }),
            'sustento': new FormControl({ value: '' })
        });
    }

    OnCancelar(){
        this.bsModalRef.hide();
    }

    controlarError(error) {
        console.error(error);
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
    permitirNumero(evento): void {
        if(!(evento.which>=48 && evento.which<=57))  
           evento.preventDefault();  
    }


    OnGrabar(){
        
        if(Number(this.valorNota)<=20){
            this.empleado=new EmpleadoAsistencia;
            this.empleado.nota=this.valorNota;
            this.onClose.next(this.empleado);
            this.bsModalRef.hide();
        }else{
            this.toastr.error('El valor de la nota no puede ser mayor a 20', 'Error', {closeButton: true});
        }
        
    }
}
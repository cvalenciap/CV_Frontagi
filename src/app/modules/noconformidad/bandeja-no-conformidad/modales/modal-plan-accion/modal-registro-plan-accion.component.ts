import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Reprogramacion } from 'src/app/models/reprogramacion';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { BandejaReprogramacionService } from '../../../../../services/impl/bandejareprogramacion.service';

@Component({
  selector: 'app-modal-registro-plan-accion',
  templateUrl: './modal-registro-plan-accion.component.html'
})
export class ModalRegistroPlanAccionComponent implements OnInit {
    public onClose: Subject<Reprogramacion>;
    bsConfig: object;
    registroPlanAccion:Reprogramacion;
    planAccion: Reprogramacion;
    title:string;
    isNuevo: boolean = false;
  
    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private servicePlanAccionEjecucion: BandejaReprogramacionService,
                private localeService: BsLocaleService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.registroPlanAccion = new Reprogramacion();
        this.planAccion = new Reprogramacion();
    }
  
    ngOnInit() {
      this.isNuevo = false;
      this.onClose = new Subject();
      this.obtenerDatosPlanAccion();
    }

    obtenerDatosPlanAccion(){
      
      if(this.registroPlanAccion){
        this.planAccion = this.registroPlanAccion;
        if(this.planAccion.idPlanAccion == 0 && this.planAccion.estadoRegistro == ""){
          this.isNuevo = true;
        }
      }
    }
  
    OnCancelar(){
      this.bsModalRef.hide();
    }

    OnGuardar(){
      
      this.registroPlanAccion = new Reprogramacion();
      this.registroPlanAccion = this.planAccion;
      if(!this.isNuevo){
        this.registroPlanAccion.estadoRegistro = "2"; //actualizado
      } else {
        this.registroPlanAccion.estadoRegistro = "1"; //nuevo
      }
      this.onClose.next(this.registroPlanAccion);
      this.bsModalRef.hide();
    }

    controlarError(error) {
      console.error(error);
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
}
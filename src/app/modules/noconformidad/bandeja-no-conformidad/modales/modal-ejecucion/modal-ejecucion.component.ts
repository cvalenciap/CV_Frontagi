import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { FormatoCarga } from 'src/app/constants/general/general.constants';
import { Reprogramacion } from 'src/app/models/reprogramacion';
import { Ejecucion } from 'src/app/models/ejecucion';
import { BandejaReprogramacionService } from 'src/app/services';
import { GeneralService} from './../../../../../services';

@Component({
  selector: 'app-modal-ejecucion',
  templateUrl: './modal-ejecucion.component.html',
  styleUrls: ['modal-ejecucion.component.scss']
})
export class ModalEjecucionComponent implements OnInit {
    public onClose: Subject<Ejecucion>;
    bsConfig: object;
    registroEjecucion: Ejecucion;
    ejecucion: Ejecucion;
    title:string;
    isNuevo: boolean = false;

    listaAccionPropuesta: Ejecucion[];
    listaComboAccion: Ejecucion[];
    objetoEjecucion: Ejecucion[] = [];
    //mostrarAccionPropuesta: boolean;
    nombreArchivoAdjuntoEjecucion: string;

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private servicePlanAccionEjecucion: BandejaReprogramacionService,
                private localeService: BsLocaleService,
                private generalService: GeneralService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.registroEjecucion = new Ejecucion();
        this.ejecucion = new Ejecucion();
        this.listaAccionPropuesta=[];
        this.listaComboAccion=[];
        //this.mostrarAccionPropuesta = false;
    }
  
    ngOnInit() {
      
      this.isNuevo = false;
      this.onClose = new Subject();
      this.obtenerDatosEjecucion();
      this.obtenerListaComboAccionPropuesta();
    }

    obtenerDatosEjecucion(){
      
      if(this.registroEjecucion){
        this.ejecucion = this.registroEjecucion;
        if(this.ejecucion.idPlanAccion == 0 && this.ejecucion.idEjecucion == 0 && this.ejecucion.estadoRegistro == ""){
          this.isNuevo = true;
        }
        let listaEjecucion: Ejecucion[] = this.objetoEjecucion;
        this.listaAccionPropuesta = listaEjecucion;
      }
    }

    obtenerListaComboAccionPropuesta(){
      this.listaComboAccion = [];
      let listaCombo: Ejecucion[] = this.listaAccionPropuesta;
      if(listaCombo.length > 0){
        for (let i:number=0; listaCombo.length > i; i++){
          this.listaComboAccion.push(listaCombo[i]);
        }
      }
    }

    mostrarDatosEjecucion(accionPropuesta: number){
      let listaDatosAccion: Ejecucion[] = this.listaAccionPropuesta;
      if(accionPropuesta != 0){
        for(let i:number=0; listaDatosAccion.length > i; i++){
          if(listaDatosAccion[i].idPlanAccion == accionPropuesta){
            this.ejecucion.descripcionAccionPropuesta = listaDatosAccion[i].descripcionAccionPropuesta;
            this.ejecucion.descripcionAccionEjecutada = listaDatosAccion[i].descripcionAccionEjecutada;
            this.ejecucion.descripcionResponsable = listaDatosAccion[i].descripcionResponsable;
            this.ejecucion.fechaCumplimiento = listaDatosAccion[i].fechaCumplimiento;
            this.ejecucion.fechaEjecucion = listaDatosAccion[i].fechaCumplimiento;
            this.ejecucion.descripcionVerificacion = listaDatosAccion[i].descripcionVerificacion;
          }
        }
      } else {
        this.ejecucion.descripcionAccionPropuesta = "";
        this.ejecucion.descripcionAccionEjecutada = "";
        this.ejecucion.fechaCumplimiento = new Date();
        this.ejecucion.fechaEjecucion = new Date();
        this.ejecucion.descripcionVerificacion = "";
      }
    }

    OnCancelar(){
      this.bsModalRef.hide();
    }

    controlarError(error): void {
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }
    
    OnGuardar(){
      
      this.registroEjecucion = new Ejecucion();
      this.registroEjecucion = this.ejecucion;

      if(!this.isNuevo){
        this.registroEjecucion.estadoRegistro = "2"; //actualizado
      } else {
        this.registroEjecucion.estadoRegistro = "1"; //nuevo
      }
      this.onClose.next(this.registroEjecucion);
      this.bsModalRef.hide();
    }

    adjuntarArchivo(event:any){
      if(event.target.files.length>0){
        if(FormatoCarga.pdf == event.target.files[0].type || FormatoCarga.word == event.target.files[0].type || FormatoCarga.wordAntiguo == event.target.files[0].type) {
          if(event.target.id == 'fileEjecucion'){
              this.ejecucion.archivoAdjunto = event.target.files[0];
              this.nombreArchivoAdjuntoEjecucion = event.target.files[0].name;
          }
        } else {
            this.toastr.warning('Solo se permiten archivos PDF o Word', 'Atención', {closeButton: true});
        }
      }
    }
}
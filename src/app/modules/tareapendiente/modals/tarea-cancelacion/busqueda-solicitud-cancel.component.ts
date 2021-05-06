import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';

@Component({
  selector: 'app-busqueda-solicitud-cancel',
  templateUrl: './busqueda-solicitud-cancel.component.html'
})
export class BusquedaSolicitudCancelComponent implements OnInit {
  public codigoDocumento = '';
  public codigoSolicitud = '';
  public nombres = '';
  public apellidoPaterno = '';
  public apellidoMaterno = '';
  public tituloDocumento = '';
  public indicador:number;
  public interruptorBotones: boolean;
  public parametros: Map<string, any>;
  public onClose: Subject<Map<string, any>>;

  titulo:string;

  /* */
  constanteRevision: any;
  tipoParticipante: string;


  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
    // this.constanteRevision = REVISION;
   }

  ngOnInit() {
    this.parametros = new Map<string, any>();
    this.interruptorBotones = true;
  }

  validarInterruptorBotones(){
    if(this.indicador == 1){
      this.validarInterruptorBotonesSolicitud();
    }else{
      this.validarInterruptorBotonesNoSolicitud();
    }
  }

  validarInterruptorBotonesNoSolicitud() {
    if (this.codigoDocumento !== '' || this.codigoSolicitud !== '' || this.tituloDocumento !== '' ||
     this.nombres !== '' || this.apellidoPaterno !== '' ||
      this.apellidoMaterno !== '') {
      this.interruptorBotones = false;
    } else {
      this.interruptorBotones = true;
    }
  }

  validarInterruptorBotonesSolicitud() {
    if (this.codigoDocumento !== '' || this.codigoSolicitud !== '' || this.tituloDocumento !== '') {
      this.interruptorBotones = false;
    } else {
      this.interruptorBotones = true;
    }
  }

  limpiar() {
    this.codigoDocumento = '';
    this.codigoSolicitud = '';
    this.nombres = '';
    this.apellidoPaterno = '';
    this.apellidoMaterno = '';
    this.tituloDocumento = '';
    this.interruptorBotones = true;
  }

  enviarParametros() {
    if (this.codigoDocumento.trim() !== '') { this.parametros.set('codigoDocumento', this.codigoDocumento); }
    if (this.codigoSolicitud !== '') { this.parametros.set('codigoSolicitud', this.codigoSolicitud); }
    if (this.tituloDocumento.trim() !== '') { this.parametros.set('tituloDocumento', this.tituloDocumento);}
    if (this.nombres.trim() !== '') { this.parametros.set('nombres', this.nombres); }
    if (this.apellidoPaterno.trim() !== '') { this.parametros.set('apellidoPaterno', this.apellidoPaterno); }
    if (this.apellidoMaterno.trim() !== '') { this.parametros.set('apellidoMaterno', this.apellidoMaterno); }

    this.onClose.next(this.parametros);
    this.bsModalRef.hide();
  }

  ingresoTexto(event) {
    const key = window.event ? event.which : event.keyCode;
    if (key < 48 || key > 57) {
      event.preventDefault();
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { Paginacion } from 'src/app/models';

@Component({
  selector: 'app-busqueda-aprobacion-solicitud',
  templateUrl: './busqueda-aprobacion-solicitud.component.html'
})
export class BusquedaAprobacionSolicitudComponent implements OnInit {
  public onClose: Subject<Map<string, any>>;
  public textoCodigo: string;
  public textoTitulo: string;
  public textoNombre: string;
  public textoApellidoPaterno: string;
  public textoApellidoMaterno: string;
  public interruptorBotones: boolean;
  private parametros: Map<string, any>;

  constanteRevision: any;
  paginacion: Paginacion;
  slEstado: string;

  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.parametros = new Map<string, any>();
    this.slEstado = '';
    this.interruptorBotones = true;
   }

  ngOnInit() {
    this.textoCodigo = '';
    this.textoTitulo = '';
    this.textoNombre = '';
    this.textoApellidoPaterno = '';
    this.textoApellidoMaterno = '';
    this.onClose = new Subject();
  }

  onBuscar() {
    
    this.parametros =  new Map<string, any>();
    let nombreCompleto: string = "";
    if (this.textoCodigo.trim() !== '') { this.parametros.set('codigoDoc', this.textoCodigo); }
    if (this.textoTitulo.trim() !== '') { this.parametros.set('tituloDoc', this.textoTitulo); }
    if (this.textoNombre.trim() !== '') {
      this.parametros.set('nombres', this.textoNombre);
      nombreCompleto = this.textoNombre;
    }
    if (this.textoApellidoPaterno.trim() !== '') {
      this.parametros.set('apellidoPaterno', this.textoApellidoPaterno);
      nombreCompleto = nombreCompleto + " " + this.textoApellidoPaterno;
    }
    if (this.textoApellidoMaterno.trim() !== '') {
      this.parametros.set('apellidoMaterno', this.textoApellidoMaterno);
      nombreCompleto = nombreCompleto + " " + this.textoApellidoMaterno;
    }
    if(nombreCompleto.trim() !== ""){
      this.parametros.set('nombreCompleto', nombreCompleto);
    }
    this.onClose.next(this.parametros);
    this.bsModalRef.hide();
  }

  limpiar() {
    this.textoCodigo = '';
    this.textoTitulo = '';
    this.textoNombre = '';
    this.textoApellidoPaterno = '';
    this.textoApellidoMaterno = '';
    this.interruptorBotones = true;
  }

  activarBotones() {
    if (this.textoCodigo !== '' || this.textoTitulo !== '' || this.textoNombre !== '' || this.textoApellidoPaterno !== '' ||
        this.textoApellidoMaterno !== '') {
      this.interruptorBotones = false;
    } else {
      this.interruptorBotones = true;
    }
  }

}

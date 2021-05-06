import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { DatePipe } from '@angular/common';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';

@Component({
  selector: 'bandeja-documento-modales-bajar-bandeja-conocimiento-revision-doc',
  templateUrl: 'bandeja-conocimiento-revision-doc.template.html'                
})
export class BajarConocimientoRevisionDocComponents implements OnInit {
  public onClose: Subject<Map<string, any>>;

  @Input()
  loading: boolean;
  codigo:string;
  numrevi:number;
  fechaaprobdesde:Date;
  fechaaprobhasta:Date;
  parametros: Map<string, any>;
  validador:boolean;

  constructor(public bsModalRef: BsModalRef,
              private datePipe: DatePipe,
              private toastr: ToastrService,
              public localeService: BsLocaleService) {
    this.onClose = new Subject();
    this.parametros = new Map<string, any>();
    this.validador = true;
    this.localeService.use('es');
  }

  ngOnInit() {
    this.loading = false;
  }

  onBuscar() {
    
    this.validador = true;

    if (this.codigo == undefined || this.codigo.trim() == '') {
      this.codigo = null;
    }

    if (this.numrevi == undefined) {
      this.numrevi = null;
    }

    if (this.fechaaprobdesde == undefined) {
      this.fechaaprobdesde = null;
    }

    if (this.fechaaprobhasta == undefined) {
      this.fechaaprobhasta = null;
    }

    this.parametros.set("codigo", this.codigo);
    this.parametros.set("numrevi", this.numrevi);
    this.parametros.set("fechaaprobdesde", this.fechaaprobdesde);
    this.parametros.set("fechaaprobhasta", this.fechaaprobhasta);

    if(this.fechaaprobdesde && this.fechaaprobhasta){
      if(this.fechaaprobdesde > this.fechaaprobhasta){
        this.toastr.error('Por favor, "Fecha Aprobación Desde" debe ser menor que "Fecha Aprobación Hasta".', 'Acción Incorrecta', { closeButton: true });
        this.validador = false;
      }
    }
    
    if (this.validador) {
      this.onClose.next(this.parametros);
      this.bsModalRef.hide();
    }

  }

  limpiar() {
    this.codigo = null;
    this.numrevi = null;
    this.fechaaprobdesde = null;
    this.fechaaprobhasta = null;
  }

  ingresoTexto(event) {
    const key = window.event ? event.which : event.keyCode;
    if (key < 48 || key > 57) {
      event.preventDefault();
    }
  }  

}

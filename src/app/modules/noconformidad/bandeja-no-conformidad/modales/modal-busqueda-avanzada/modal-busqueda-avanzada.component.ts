import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from 'src/app/models/programa';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { forkJoin } from 'rxjs';

import { Parametro } from '../../../../../models/parametro';
import { Area } from 'src/app/models/area';
import { NoConformidad } from 'src/app/models/noconformidad';

@Component({
  selector: 'app-modal-busqueda-avanzada',
  templateUrl: './modal-busqueda-avanzada.component.html'
})
export class ModalBusquedaAvanzadaComponent implements OnInit {

  public onClose: Subject<any>;
  title: string;
  /* Lista de Parametros */
  listaTipoFecha: Parametro[];
  listaTipo: Parametro[];
  listaNorma: any[];
  listaAlcance: Parametro[];
  listaOrigen: Parametro[];
  listaGerencia: Area[];
  listaEquipo: Area[];
  /* variables de busqueda */
  tipoFecha: string;
  fechaDesde: string;
  fechaHasta: string;
  codigo: string;
  tipo: string;
  norma: string;
  alcance: string;
  requisito: string;
  origen: string;
  gerencia: string;
  equipo: string;
  /* variable para asignacion */
  parametro: any;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.onClose = new Subject();

    this.listaTipoFecha = [];
    this.listaTipo = [];
    this.listaNorma = [];
    this.listaAlcance = [];
    this.listaOrigen = [];
    this.listaGerencia = [];
    this.listaEquipo = [];
    this.parametro = null;
  }

  ngOnInit() {
    this.OnSeteaVariables();
  }

  OnSeteaVariables(): void {
    this.tipoFecha = null;
    this.fechaDesde = null;
    this.fechaHasta = null;
    this.codigo = null;
    this.tipo = null;
    this.norma = null;
    this.alcance = null;
    this.requisito = null;
    this.origen = null;
    this.gerencia = null;
    this.equipo = null;
  }

  OnCancelar() {
    this.bsModalRef.hide();
  }

  OnBuscar() {
    let obj: Parametro;
    let descTipoFecha: string = null;
    if(this.tipoFecha){
      obj = this.listaTipoFecha.find(x => x.idconstante == Number(this.tipoFecha))
      descTipoFecha = obj.v_valcons;
    }
    this.parametro = { tipoFecha:descTipoFecha, fechaDesde:this.fechaDesde, fechaHasta:this.fechaHasta, codigo: this.codigo, tipo: this.tipo, norma: this.norma, requisito: this.requisito, origen: this.origen, gerencia: this.gerencia, equipo: this.equipo };
    this.bsModalRef.hide();
    this.onClose.next(this.parametro);
  }

}

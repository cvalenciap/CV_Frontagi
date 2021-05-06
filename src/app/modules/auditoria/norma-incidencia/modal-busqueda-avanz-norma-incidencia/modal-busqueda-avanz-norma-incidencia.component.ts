
import { NormaIncidencia } from 'src/app/models/normaincidencia';

import { Component, OnInit } from '@angular/core';
import { PlanAuditoria } from 'src/app/models/planauditoria';
import { Subject, forkJoin } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { GeneralService } from './../../../../services/index';
import { Response } from './../../../../models/response';
import { NombreParametro } from 'src/app/constants/general/general.constants';


@Component({
  selector: 'app-modal-busqueda-avanz-norma-incidencia',
  templateUrl: './modal-busqueda-avanz-norma-incidencia.component.html',
  styleUrls: ['./modal-busqueda-avanz-norma-incidencia.component.scss']
})
export class ModalBusquedaAvanzNormaIncidenciaComponent implements OnInit {
  //[x: string]: any;

  public onClose: Subject<NormaIncidencia>;
  bsConfig: object;

  listaTipos: any[];
  listaNormas: any[];
  busqueda: NormaIncidencia;
  loading: boolean;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
    private generalService: GeneralService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.loading = false;
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.busqueda = new NormaIncidencia();
    this.listaTipos = [];
    this.listaNormas = [];

    this.obtenerParametros();
  }

  cancelar() {

    this.bsModalRef.hide();
  }

  cargarRequisito() {/*
      const buscaNormas = this.service.obtenerNormas(this.busqueda.tipo);
      forkJoin(buscaNormas).subscribe(([buscaNormas]:[Response])=>{       
        this.listaNormas = buscaNormas.resultado;         
      },  
      (error) => this.controlarError(error));
      */

  }

  obtenerParametros() {

    /*      const buscaTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTiposReglas);
         const buscaNormas = this.service.obtenerNormas("2");
          
         forkJoin(buscaTipos,buscaNormas)
         .subscribe(([buscaTipos,buscaNormas]:[Response,Response])=>{       
           this.listaTipos = buscaTipos.resultado;
           this.listaNormas = buscaNormas.resultado;         
         },  
         (error) => this.controlarError(error)); */

    /*      const buscaTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTiposReglas);
         const buscaNormas = this.service.obtenerNormas("2");
          
         forkJoin(buscaTipos,buscaNormas)
         .subscribe(([buscaTipos,buscaNormas]:[Response,Response])=>{       
           this.listaTipos = buscaTipos.resultado;
           this.listaNormas = buscaNormas.resultado;         
         },  
         (error) => this.controlarError(error)); */

    const buscaTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTiposReglas);

    forkJoin(buscaTipos).subscribe(([buscaTipos]: [Response]) => {
      this.listaTipos = buscaTipos.resultado;
      //this.listaNormas = buscaNormas.resultado;         
    },
      (error) => this.controlarError(error));

  }


  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  buscar() {
    if (this.busqueda.tipo != "" || this.busqueda.normaRelacionada != "") {
      this.bsModalRef.hide();
      this.onClose.next(this.busqueda);
    }
  }




}

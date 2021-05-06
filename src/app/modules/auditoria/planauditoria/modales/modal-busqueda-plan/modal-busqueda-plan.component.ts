import { Component, OnInit } from '@angular/core';
//(import { PlanAuditoria } from 'src/app/models/planauditoria';
import { Subject, forkJoin } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlanAuditoriaMockService as PlanAuditoriaService, GeneralService } from './../../../../../services/index';
import { Response } from './../../../../../models/response';
import { Auditoria } from 'src/app/models/auditoria';
import { NombreParametro } from 'src/app/constants/general/general.constants';

@Component({
  selector: 'app-modal-busqueda-plan',
  templateUrl: './modal-busqueda-plan.component.html',
  styleUrls: ['./modal-busqueda-plan.component.scss']
})
export class ModalBusquedaPlanComponent implements OnInit {
  public onClose: Subject<Auditoria>;
  bsConfig: object;

  listaTipos: any[];
  listaDetectores: any[];
  listaEstados: any[];
  busqueda: Auditoria;
  loading: boolean;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
    private service: PlanAuditoriaService,
    private generalService: GeneralService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.loading = false;
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.busqueda = new Auditoria();
    this.listaTipos = [];
    this.listaDetectores = [];
    this.listaEstados = [];
    this.obtenerParametros();
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  obtenerParametros() {
    //const buscaTipos = this.service.obtenerTipos();
    //const buscaEstados = this.service.obtenerEstados();

    const buscaTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTipos);
    const buscaEstados = this.generalService.obtenerParametroPadre(NombreParametro.listaEstadosAuditoria);

    forkJoin(buscaTipos, buscaEstados)
      .subscribe(([buscaTipos, buscaEstados]: [Response, Response]) => {
        this.listaTipos = buscaTipos.resultado;
        this.listaEstados = buscaEstados.resultado;

      },
        (error) => this.controlarError(error));
  }


  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  buscar() {
    if (this.busqueda.tipoAuditoria != "" || this.busqueda.estadoAuditoria != "") {
      this.bsModalRef.hide();
      this.onClose.next(this.busqueda);
    }
  }



}

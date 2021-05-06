import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Response } from '../../../models/response';
import { ParametrosService, EquiposService, BandejaDocumentoService, GeneralService } from 'src/app/services';
import { DatePipe } from '@angular/common';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { Constante } from 'src/app/models/enums/constante';
import { NombreParametro} from 'src/app/constants/general/general.constants';

@Component({
  selector: 'bandeja-documento-modales-bajar-documento-cancelado',
  templateUrl: 'bajar-documento-cancelado.template.html'
})
export class BajarDocumentoCanceladoComponents implements OnInit {
  public onClose: Subject<Map<string, any>>;
  @Input()
  loading: boolean;
  tipoArbol: string;
  parametroBusqueda: string;
  sgiparametrodesc: string;
  sgiparametroid: number;
  procesoparametrodesc: string;
  procesoparametroid: number;
  gerenparametrodesc: string;
  gerenparametroid: number;
  listaTipoDocumento: any[];
  tipodocumento: number;
  tipocancelacion: number;
  desTipodocumento:string;
  desTipodocumentoCan:string;
  codigo:string;
  titulo:string;
  fechacandesde: Date;
  fechacanhasta: Date;
  deshabilitarBuscar: boolean;
  deshabilitarLimpiar: boolean;
  listaTiposSolicitud:any[];
  validador:boolean;

  constructor(public bsModalRef: BsModalRef,
    public localeService: BsLocaleService,
    private generalService:GeneralService,
    private toastr: ToastrService,
    private service: BandejaDocumentoService,
    private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceEquipo: EquiposService,
    private datePipe: DatePipe) {
    this.onClose = new Subject();
    this.localeService.use('es');
    this.tipoArbol;
    this.parametroBusqueda = "titulodefault";
    this.tipodocumento = 0;
    this.tipocancelacion = 0;
    this.gerenparametroid = 0;
    this.sgiparametroid = 0;
    this.procesoparametroid = 0;
    this.desTipodocumento = "";
    this.desTipodocumentoCan = "";
    this.fechacandesde;
    this.fechacanhasta;
    this.deshabilitarBuscar = true;
    this.deshabilitarLimpiar = true;
    this.sgiparametrodesc = "";
    this.gerenparametrodesc = "";
    this.procesoparametrodesc = "";
    this.listaTiposSolicitud = [];
    this.codigo = null;
    this.titulo = null;
    this.validador = true;
  }

  ngOnInit() {
    
    this.obtenerTipoCancel();
    this.obtenerParametros();
    this.loading = false;
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  limpiar(){
    this.tipodocumento = 0;
    this.desTipodocumento = null;
    this.tipocancelacion = 0;
    this.desTipodocumentoCan = null;
    this.codigo = null;
    this.titulo = null;
    this.fechacandesde = null;
    this.fechacanhasta = null;

  }

  OnBuscar(): void {
    this.validador = true;
    let parametrosAdicionales: Map<string, any> = new Map();

    if (this.tipodocumento != 0) {
      parametrosAdicionales.set('idtipodocu', this.tipodocumento);
      let gerencia = this.listaTipoDocumento.find(obj => obj.idconstante == this.tipodocumento);
      this.desTipodocumento = gerencia.v_descons;
      parametrosAdicionales.set('desIdtipodocu', this.desTipodocumento);
    }else{
      parametrosAdicionales.set('idtipodocu', null);
    }

    if (this.tipocancelacion != 0) {
      parametrosAdicionales.set('idproc', this.tipocancelacion);
      let gerencia = this.listaTiposSolicitud.find(obj => obj.idconstante == this.tipocancelacion);
      this.desTipodocumentoCan = gerencia.v_descons;
      parametrosAdicionales.set('desIdproc', this.desTipodocumentoCan);
    }else{
      parametrosAdicionales.set('idproc', null);
    }

    if (this.codigo == null || this.codigo.trim() == '') {
      this.codigo = null;
    }else{
      parametrosAdicionales.set('codigoDocumento', this.codigo);
    }

    if (this.titulo == null || this.titulo.trim() == '') {
      this.titulo = null;
    }else{
      parametrosAdicionales.set('tituloDocumento', this.titulo);
    }

    if (this.fechacandesde != null) {
      parametrosAdicionales.set('fechacandesde', this.fechacandesde);
    }
    if (this.fechacanhasta != null) {
      parametrosAdicionales.set('fechacanhasta', this.fechacanhasta);
    }


    if(this.fechacandesde && this.fechacanhasta){
      if(this.fechacandesde > this.fechacanhasta){
        this.toastr.error('Por favor, "Fecha Cancelación Desde" debe ser menor que "Fecha Cancelación Hasta".', 'Acción Incorrecta', { closeButton: true });
        this.validador = false;
      }
    }

    if (this.validador) {
    this.onClose.next(parametrosAdicionales);
    this.bsModalRef.hide();
    }
  }

  habilitarBusqueda(): void {
    
    if (this.fechacandesde != null || this.fechacanhasta != null ||
      this.tipodocumento != 0 || this.procesoparametrodesc != null || this.sgiparametrodesc != null || this.gerenparametrodesc != null) {
      this.deshabilitarBuscar = false;
      this.deshabilitarLimpiar = false;
    } else {
      this.deshabilitarBuscar = true;
      this.deshabilitarLimpiar = true;
    }

  }

  OnBuscarProceso() {
    localStorage.removeItem("idProcesoSeleccionado");
    this.tipoArbol = "120";
    localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }

    const modalArbol = this.modalService.show(ModalArbolComponents, config);
    (<ModalArbolComponents>modalArbol.content).onClose.subscribe(result => {
      
      let objeto: BandejaDocumento = result;
      this.procesoparametrodesc = objeto.rutaCompleta;
      this.procesoparametrodesc = this.procesoparametrodesc.substr(0, this.procesoparametrodesc.length - objeto.parametrodesc.length - 1);
      this.procesoparametroid = objeto.parametroid;
    });
  }


  OnBuscarSGI() {
    localStorage.removeItem("idProcesoSeleccionado");
    this.tipoArbol = "121";
    localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    const modalArbol = this.modalService.show(ModalArbolComponents, config);
    (<ModalArbolComponents>modalArbol.content).onClose.subscribe(result => {
      let objeto: BandejaDocumento = result;
      this.sgiparametrodesc = objeto.rutaCompleta;
      this.sgiparametrodesc = this.sgiparametrodesc.substr(0, this.sgiparametrodesc.length - objeto.parametrodesc.length - 1);
      this.sgiparametroid = objeto.parametroid;
    });
  }

  OnBuscarGerencia() {
    localStorage.removeItem("idProcesoSeleccionado");
    this.tipoArbol = "122";
    localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    const modalArbol = this.modalService.show(ModalArbolComponents, config);
    (<ModalArbolComponents>modalArbol.content).onClose.subscribe(result => {
      
      let objeto: BandejaDocumento = result;
      this.gerenparametrodesc = objeto.rutaCompleta;
      this.gerenparametrodesc = this.gerenparametrodesc.substr(0, this.gerenparametrodesc.length - objeto.parametrodesc.length - 1);
      this.gerenparametroid = objeto.parametroid;

    });
  }

  obtenerParametros() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_DOCUMENTO).subscribe(
      (response: Response) => {
        this.listaTipoDocumento = response.resultado;
      }, (error) => this.controlarError(error));
  }

  obtenerTipoCancel() {
    let buscaEntidades = this.generalService.obtenerParametroPadre(NombreParametro.listaTipoSolicitudCancelacion);
    forkJoin(buscaEntidades)
      .subscribe(([buscaEntidades]: [Response]) => {
        this.listaTiposSolicitud = buscaEntidades.resultado;
      },
        (error) => this.controlarError(error));
  }


}

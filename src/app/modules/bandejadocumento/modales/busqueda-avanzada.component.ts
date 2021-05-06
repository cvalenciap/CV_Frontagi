import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento, Documento } from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { ViewChild, EventEmitter } from '@angular/core';
import { ParametrosService, BandejaDocumentoService } from 'src/app/services';
import { Constante } from 'src/app/models/enums/constante';
import { Parametro } from 'src/app/models/parametro';
import { Response } from '../../../models/response';
import { ColaboradoresService, EquiposService } from 'src/app/services';
import { Equipo } from 'src/app/models/equipo';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { RegistroElaboracioncomponts } from 'src/app/modules/bandejadocumento/modales/registro-elaboracion.component';
import { Paginacion } from '../../../models/paginacion';
import { Programa } from 'src/app/models/programa';
import { DatePipe } from '@angular/common';
import { AgregarParticipanteComponents } from './agregar-participante.component';
import { ToastrService } from 'ngx-toastr';
import { ModalArbolBusquedaAvanzadaComponents } from './modal-arbol-busquedaAvanzada.component';


@Component({
  selector: 'bandeja-documento-modales-busqueda',
  templateUrl: 'busqueda-avanzada.template.html',
  providers: [EquiposService, ColaboradoresService]
})
export class BusquedaAvanzadaComponents implements OnInit {
  public onClose: Subject<BandejaDocumento>;

  parametroBusqueda: string;
  parametroDescArbol: string;
  parametroDescArbol2: string;
  parametroDescArbol3: string;
  listaTipos: Parametro[];
  idProceso: number;
  listaTipoDocumento: any[];
  listaEstadoDocumento: any[];
  listaFaseActDoc: any[];
  listaEstFaseActDoc: any[];
  listaEstMotivoRevDoc: any[];
  listaEquipos: Equipo[];
  procesoparametrodesc: string;
  procesoparametroruta: string;
  procesoparametroid: string;
  sgiparametrodesc: string;
  sgiparametroid: string;
  gerenparametrodesc: string;
  gerenparametroid: string;

  tipoArbol: string;
  titulo: string;
  idtipo: string;
  estdoc: string;
  fecharevdesde: Date;
  fecharevhasta: Date;
  fechaaprobdesde: Date;
  fechaaprobhasta: Date;
  tipodocumento: number;
  periodooblig: string;
  motirevision: string;
  numrevi: string;
  descripcionarea: string;
  idarea: string;
  descparticipante: string;
  idparticipante: number;
  idfaseact: string;
  idfaseestadoact: string;
  deshabilitarFaseAct: boolean;
  ////faseact: number;
  faseestadoact: string;

  mostrarInformacion: boolean;
  /* paginación */
  paginacion: Paginacion;
  items: Programa[];
  deshabilitarBuscar: boolean;
  deshabilitarLimpiar: boolean;
  deshabilitarObjeto: boolean;
  deshabilitarProceso: boolean;
  deshabilitarAlcance: boolean;
  deshabilitarGerencia: boolean;
  habilitarGerencia: boolean;

  //@Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  fechaDesdeValidator: boolean = false;
  fechaHastaValidator: boolean = false;
  fechaliDesde: boolean;
  fechaliHasta: boolean;
  @ViewChild(ModalArbolBusquedaAvanzadaComponents) child: ModalArbolBusquedaAvanzadaComponents;
  
  constructor(private service: BandejaDocumentoService,
    public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceEquipo: EquiposService,
    private datePipe: DatePipe,
    private toastr: ToastrService) {
    this.onClose = new Subject();
    this.parametroBusqueda = 'tipo';
    this.paginacion = new Paginacion({ registros: 10 });
    this.items = [];
    this.titulo = "";
    this.idtipo = "";
    this.estdoc = "";
    this.fecharevdesde;
    this.fecharevhasta;
    this.fechaaprobdesde;
    this.fechaaprobhasta;
    this.tipodocumento = 0;
    this.periodooblig = "0";
    this.motirevision = "";
    this.numrevi;
    this.tipoArbol;
    this.procesoparametrodesc;
    this.procesoparametroruta;
    this.procesoparametroid;
    this.sgiparametrodesc;
    this.sgiparametroid;
    this.gerenparametrodesc;
    this.gerenparametroid;
    this.descripcionarea;
    this.idarea;
    this.descparticipante;
    this.idparticipante = 0;
    this.idfaseact = "";
    this.idfaseestadoact = "";
    this.fecharevdesde;
    this.fecharevhasta;
    this.fechaaprobdesde;
    this.fechaaprobhasta;
    this.faseestadoact;
    this.deshabilitarFaseAct = true;
    this.deshabilitarBuscar = true;
    this.deshabilitarLimpiar = true;
    this.descripcionarea = "";
    this.descparticipante = "";
    this.deshabilitarObjeto = false;
    this.fechaliDesde = false;
    this.fechaliHasta = false;
  }

  ngOnInit() {
    
    this.loading = false;
    this.OnLimpiar();
    //Listado de combos
    this.obtenerParametros();
    this.obtenerEquipo();
    this.obtenerEstadoDocumento();
    this.obtenerFaseActDoc();
    this.obtenerEstFaseActDoc();
    this.obtenerEstMotivoRevDoc();
    this.mostrarInformacion = false;
    


    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        this.listaTipos = response.resultado;
        this.idProceso = this.serviceParametro.obtenerIdParametro(
          this.listaTipos, Constante.TIPO_JERARQUIA_PROCESO);
        if(this.tipodocumento){
          this.habilitarGerencia = true;
        }else{
          this.habilitarGerencia = false;
        }
      },
      (error) => this.controlarError(error)
    );
  }

  habilitarBusqueda(): void {
    
    if (this.titulo != "" || this.estdoc != "" || this.fechaaprobdesde != null || this.fechaaprobhasta != null ||
      this.tipodocumento != 0 || Number.parseInt(this.periodooblig) != 0 ||
      this.motirevision != "" || this.idfaseact != "" ||
      this.idfaseestadoact != "" || this.descparticipante != null ||
      this.descripcionarea != null || this.procesoparametroruta != null || this.sgiparametrodesc != null ||
      this.gerenparametrodesc != null) {
      this.deshabilitarBuscar = false;
      this.deshabilitarLimpiar = false;
    } else {
      this.deshabilitarBuscar = true;
      this.deshabilitarLimpiar = true;
    }

  }

  controlarError(error) {
    console.error(error);
  }

  cancelar() {
    let objeto: BandejaDocumento = new BandejaDocumento();
    objeto = null;
    this.onClose.next(objeto);
    this.bsModalRef.hide();
  }

  //Busqueda del modal de arbol
  OnBuscarProceso() {
    localStorage.removeItem("idProcesoSeleccionado");
    this.tipoArbol = "120";
    localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        tipoBusqueda: "Proceso"
      },
      class: 'modal-lg'
    }
    const modalArbol = this.modalService.show(ModalArbolBusquedaAvanzadaComponents, config);
    (<ModalArbolBusquedaAvanzadaComponents>modalArbol.content).onClose.subscribe(result => {
      let objeto: BandejaDocumento = result;
      this.procesoparametrodesc = objeto.rutaCompleta;
      this.procesoparametroid = objeto.parametroid.toString();
      this.habilitarBusqueda();
    });
  }

  //Busqueda del modal de arbol
  OnBuscarSGI() {
    localStorage.removeItem("idProcesoSeleccionado");
    this.tipoArbol = "121";
    localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        tipoBusqueda: "Alcance SGI"
      },
      class: 'modal-lg'
    }
    const modalArbol = this.modalService.show(ModalArbolBusquedaAvanzadaComponents, config);
    (<ModalArbolBusquedaAvanzadaComponents>modalArbol.content).onClose.subscribe(result => {
      let objeto: BandejaDocumento = result;
      this.sgiparametrodesc = objeto.rutaCompleta;
      this.sgiparametroid = objeto.parametroid.toString();
      this.habilitarBusqueda();
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
        tipoBusqueda: "Gerencia"
      },
      class: 'modal-lg'
    }
    const modalArbol = this.modalService.show(ModalArbolBusquedaAvanzadaComponents, config);
    (<ModalArbolBusquedaAvanzadaComponents>modalArbol.content).onClose.subscribe(result => {
      let objeto: BandejaDocumento = result;
      this.gerenparametrodesc = objeto.rutaCompleta;
      this.gerenparametroid = objeto.parametroid.toString();
      this.habilitarBusqueda();
    });
  }

  //Combo tipo de documentos
  obtenerParametros() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_DOCUMENTO).subscribe(
      (response: Response) => {
        this.listaTipoDocumento = response.resultado;
      }, (error) => this.controlarError(error));
  }

  //Combo tipo de equipos
  obtenerEquipo() {
    this.listaEquipos = [];
    const parametros: { id?: string, nombre?: string, jefe?: string, estado?: string } =
      { id: null, nombre: null, jefe: null, estado: "1" };

    this.serviceEquipo.buscarPorParametros(parametros).subscribe(
      (response: Response) => {
        this.listaEquipos = response.resultado;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  //Combo estado de documentos
  obtenerEstadoDocumento() {
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_DOCUMENTO).subscribe(
      (response: Response) => {
        this.listaEstadoDocumento = response.resultado;
      }, (error) => this.controlarError(error));
  }

  //Combo fase actual de documento
  obtenerFaseActDoc() {
    this.serviceParametro.obtenerParametroPadre(Constante.FASE_ACT_DOCUMENTO).subscribe(
      (response: Response) => {
        this.listaFaseActDoc = response.resultado;
      }, (error) => this.controlarError(error));
  }

  //Combo estado de fase actual de documento
  obtenerEstFaseActDoc() {
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_FASE_ACT_DOC).subscribe(
      (response: Response) => {
        this.listaEstFaseActDoc = response.resultado;
      }, (error) => this.controlarError(error));
  }

  //Combo estado de motivo de revision de documento
  obtenerEstMotivoRevDoc() {
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_MOTIVO_REVIS).subscribe(
      (response: Response) => {
        this.listaEstMotivoRevDoc = response.resultado;
      }, (error) => this.controlarError(error));
  }

  OnParticipante() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
      class: 'modal-lg'
    }
    const abrirParticipante = this.modalService.show(AgregarParticipanteComponents, config);
    (<AgregarParticipanteComponents>abrirParticipante.content).onClose.subscribe(result => {
      let objeto: RutaParticipante = result;

      this.descparticipante = objeto.responsable;
      this.idparticipante = objeto.idColaborador;
      this.habilitarBusqueda();
    });
  }

  OnEquipo() {
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    const abrirEquipo = this.modalService.show(RegistroElaboracioncomponts, config);
    (<RegistroElaboracioncomponts>abrirEquipo.content).onClose.subscribe(result => {
      this.descripcionarea = "";
      this.idarea = "";
      let listadoEquipo: Equipo[] = result;
      listadoEquipo.forEach(objeto => {
        this.descripcionarea = this.descripcionarea + objeto.sigla + ",";
        this.idarea = this.idarea + objeto.id + ",";
      });
      if (this.descripcionarea.length > 0) {
        this.descripcionarea = this.descripcionarea.substr(0, this.descripcionarea.length - 1);
        this.idarea = this.idarea.substr(0, this.idarea.length - 1);
      }

      this.habilitarBusqueda();
    });
  }

  OnLimpiar() {
    this.titulo = "";
    this.estdoc = "";
    this.fecharevdesde = null;
    this.fecharevhasta = null;
    this.fechaaprobdesde = null;
    this.fechaaprobhasta = null;
    this.procesoparametrodesc = "";
    this.procesoparametroid = "";
    this.sgiparametrodesc = "";
    this.sgiparametroid = "";
    this.gerenparametrodesc = "";
    this.gerenparametroid = "";
    this.tipodocumento = 0;
    this.periodooblig = "0";
    this.descripcionarea = "";
    this.idarea = "";
    this.motirevision = "";
    this.descparticipante = "";
    this.idparticipante = 0;
    this.idfaseact = "";
    this.idfaseestadoact = "";
    this.deshabilitarFaseAct = true;
    this.deshabilitarBuscar = true;
    this.deshabilitarLimpiar = true;
  }

  OnHabilitarEstFaseAct() {
    if (Number.parseInt(this.idfaseact) > 0) {
      this.deshabilitarFaseAct = false;
      this.idfaseestadoact = "135";
    }
    else {
      this.deshabilitarFaseAct = true;
      this.idfaseestadoact = "";
    }
  }

  OnBuscar(): void {
    
    this.fechaliHasta = false;
    this.fechaliDesde = false;

    if (this.fechaaprobdesde!=null) {
      if (this.fechaaprobdesde.toString() == "Invalid Date") {
        this.fechaliDesde = true;
      }     
    }
    
    
    if (this.fechaaprobhasta!=null) {
      if (this.fechaaprobhasta.toString() == "Invalid Date") {
        this.fechaliHasta = true;
      }      
    }

    if (this.fechaliDesde == true && this.fechaliHasta == true) {
      this.toastr.error('Por favor, Ingrese la fecha de aprobación Desde - Hasta.', 'Acción Incorrecta', { closeButton: true });
      (this.fechaliDesde == true) ? this.fechaDesdeValidator = true : this.fechaDesdeValidator = false;
      (this.fechaliHasta == true) ? this.fechaHastaValidator = true : this.fechaHastaValidator = false;
    } else if (this.fechaliDesde == true) {
      this.toastr.error('Por favor, Ingrese una Fecha de Aprobación Desde válida.', 'Acción Incorrecta', { closeButton: true });
      (this.fechaliDesde == true) ? this.fechaDesdeValidator = true : this.fechaDesdeValidator = false;
    } else if (this.fechaliHasta == true) {
      this.toastr.error('Por favor, Ingrese una Fecha de Aprobación Hasta válida.', 'Acción Incorrecta', { closeButton: true });
      (this.fechaliHasta == true) ? this.fechaHastaValidator = true : this.fechaHastaValidator = false;
    } else {
      let objeto: BandejaDocumento = new BandejaDocumento();
      objeto.titulo = this.titulo;
      objeto.estdoc = objeto.estdoc + "," + this.estdoc + ",";
      objeto.fecharevdesde = this.fecharevdesde;
      objeto.fecharevhasta = this.fecharevhasta;
      objeto.fechaaprobdesde = this.fechaaprobdesde;
      objeto.fechaaprobhasta = this.fechaaprobhasta;
      objeto.tipodocumento = this.tipodocumento;
      objeto.periodooblig = this.periodooblig;
      objeto.motirevision = this.motirevision;
      objeto.numrevi = this.numrevi;
      objeto.procesoparametroid = this.procesoparametroid;
      objeto.procesoparametrodesc = this.procesoparametrodesc;
      objeto.sgiparametroid = this.sgiparametroid;
      objeto.sgiparametrodesc = this.sgiparametrodesc;
      objeto.gerenparametroid = this.gerenparametroid;
      objeto.gerenparametrodesc = this.gerenparametrodesc;
      objeto.descparticipante = this.descparticipante;
      objeto.descripcionarea = this.descripcionarea;
      objeto.idarea = this.idarea;
      objeto.idparticipante = this.idparticipante.toString();
      objeto.idfaseact = this.idfaseact;
      objeto.idfaseestadoact = this.idfaseestadoact;
      objeto.habilitarGerencia = this.habilitarGerencia;

      this.onClose.next(objeto);
      
      this.bsModalRef.hide();
    }
  }

}

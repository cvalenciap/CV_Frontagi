import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BandejaDocumento, Documento } from '../../../models';
import { Response } from '../../../models/response';
//Conectar con el servicio
import { BandejaDocumentoService } from '../../../services';
import { Paginacion } from '../../../models/paginacion';
import { DatePipe } from '@angular/common';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ModalRevisiones } from 'src/app/modules/bandejadocumento/modales/modal-revisiones.component';
import { RegistroElaboracioncomponts } from 'src/app/modules/bandejadocumento/modales/registro-elaboracion.component';
import { Programa } from 'src/app/models/programa';
import { BusquedaAvanzadaComponents } from 'src/app/modules/bandejadocumento/modales/busqueda-avanzada.component';
import { PermisoCarpetaComponents } from 'src/app/modules/bandejadocumento/modales/permiso-carpeta.component';
import { Constante } from 'src/app/models/enums';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { ToastrService } from 'ngx-toastr';
import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { ViewChild } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { registrardocumentoEditarComponent } from 'src/app/modules/bandejadocumento/views/registrar-documento.component';
import { debug } from 'util';
import { FiltroDocumento } from 'src/app/models/filtro-documento';
import { Jerarquia } from 'src/app/models/jerarquia';
import { stringify } from '@angular/compiler/src/util';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { EnvioParametros } from 'src/app/models/envioParametros';

@Component({
  selector: 'bandeja-documento-gestion-documento-traslado',
  templateUrl: 'gestiondocumentoTraslado.template.html'
  //,  providers: [BandejaDocumentoService]
})
export class GestionDocumentoTrasladoComponents implements OnInit {

  static item;
  BandejaDocumento: any;

  excelDocumento: FiltroDocumento;
  /* paginación */
  paginacion: Paginacion;
  //item: Documento;
  items: Programa[];
  busquedaProgramacion: Programa;
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  //parametroIdArbol: string;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: BandejaDocumento;
  selectedFilter: string;
  // Id de los Tipos de Jerarquia
  idProceso: number;
  idAlcance: number;
  idGerencia: number;
  textoAccion: string;
  @Input() activartab: boolean;

  /*idProcesoTipoDoc: number;
  idAlcanceTipoDoc: number;
  idGerenciaTipoDoc: number;*/

  /* Tipo de Jerarquia seleccionado */
  idTipoSeleccionado: number;
  //parametroId: number;
  //@Input() parametroid: number;
  @Input() parametroId: number;
  @Input() parametroIdTipoDoc: number;
  @Input() parametroRuta: string;
  @Input() activar: boolean;
  @Input() listaNodes: any;

  activarNuevo: boolean;
  activarverficha: boolean;
  activarProceso: boolean;
  activarSegunItemArbolSel: boolean;
  activarColumna: boolean;
  /* Texto del menu seleccionado*/
  textoMenu: string;
  /* Texto de Mensaje*/
  mensajeInformacion: string;
  /* Validacion si existe un Mensaje a mostrar pantalla: SI(TRUE) / NO(FALSE)*/
  mostrarInformacion: boolean;
  /* Validacion si existe una Alerta a mostrar en pantalla: SI(TRUE) / NO(FALSE)*/
  mostrarAlerta: boolean;
  /* Filtros Anteriores */
  parametroBusquedaAnterior: string;
  textoBusquedaAnterior: string;
  textoMenuAnterior: string;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  bsModalRef: BsModalRef;
  deshabilitaNuevo: boolean;
  /* Deshabilitar Busqueda*/
  deshabilitarBuscar: boolean;
  deshabilitarTextoBuscar: boolean;
  deshabilitarMenu: boolean;
  descripcionMostrar: string;
  titulo: string;
  listaTipoDocumento: any[];
  listaFaseActDoc: any[];
  listaEstFaseActDoc: any[];
  listaEstMotivoRevDoc: any[];
  listaEstadoDocumento: any[];
  objetoBusqAvanz: BandejaDocumento;
  idProcesoSeleccionado: string;
  idSgiSeleccionado: string;
  idGerenciaSeleccionado: string;
  idProcesoSel: string;
  idSgiSel: string;
  idGerenciaSel: string;
  idJerar: number;
  idTipoDocu: number;

  constructor(private service: BandejaDocumentoService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private serviceParametro: ParametrosService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private bandejaService: BandejaDocumentoService) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.selectedFilter = 'usuario';
    this.parametroBusqueda = "titulodefault";
    this.paginacion = new Paginacion({ registros: 10 });
    this.textoMenu = null;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.deshabilitarBuscar = true;
    this.deshabilitarTextoBuscar = false;
    this.deshabilitaNuevo = true;
    //this.descripcionMostrar = "";
    this.listaTipoDocumento = [];
    this.listaFaseActDoc = [];
    this.listaEstFaseActDoc = [];
    this.listaEstMotivoRevDoc = [];
    this.listaEstadoDocumento = [];
    this.textoAccion = Constante.TITULO_GERENCIA;
    this.objetoBusqAvanz = new BandejaDocumento();
    this.idProcesoSel = null;
    this.idSgiSel = null;

    this.idGerenciaSel = null;
    this.excelDocumento = new FiltroDocumento();

    GestionDocumentoTrasladoComponents.item = 1;

    this.obtenerEstadoDocumento();
    this.obtenerParametros();
    this.obtenerEstMotivoRevDoc();
    this.obtenerFaseActDoc();
    this.obtenerEstFaseActDoc();

    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idProceso = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.TIPO_JERARQUIA_PROCESO);
        this.idAlcance = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.TIPO_JERARQUIA_ALCANCE);
        this.idGerencia = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.TIPO_JERARQUIA_GERENCIA);
        this.idTipoSeleccionado = (localStorage.getItem("idProcesoSeleccionado") == null) ? 0 :
          Number(localStorage.getItem("idProcesoSeleccionado"));

        //Texto del Proceso
        if (this.idTipoSeleccionado == this.idProceso) {
          this.textoAccion = Constante.TITULO_PROCESO;
        } else if (this.idTipoSeleccionado == this.idAlcance) {
          this.textoAccion = Constante.TITULO_ALCANCE;
        } else if (this.idTipoSeleccionado == this.idGerencia) {
          this.textoAccion = Constante.TITULO_GERENCIA;
        }
        
        /*Mostrar Botones según condición*/
        if (this.activar) {
          if (this.idTipoSeleccionado == this.idProceso) {
            this.activarNuevo = false;
            this.activarverficha = true;
            this.activarProceso = true;
          } else if (this.idTipoSeleccionado == this.idAlcance) {
            this.activarNuevo = false;
            this.activarverficha = false;
            this.activarProceso = false;
          } else if (this.idTipoSeleccionado == this.idGerencia) {
            this.activarNuevo = true;
            this.activarProceso = false;
            this.activarverficha = false;
          }
          this.activarSegunItemArbolSel = true;
        } else {
          this.activarNuevo = this.activar;
          this.activarProceso = this.activar;
          this.activarSegunItemArbolSel = false;
        }

        //this.getLista();

      },
      (error) => this.controlarError(error)
    );
  }

  public get staticItem() {
    return GestionDocumentoTrasladoComponents.item;
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  //Combo estado de documentos
  obtenerEstadoDocumento() {
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_DOCUMENTO).subscribe(
      (response: Response) => {
        this.listaEstadoDocumento = response.resultado;
      }, (error) => this.controlarError(error));
  }

  //Combo tipo de documentos
  obtenerParametros() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_DOCUMENTO).subscribe(
      (response: Response) => {
        this.listaTipoDocumento = response.resultado;
      }, (error) => this.controlarError(error));
  }

  //Combo estado de motivo de revision de documento
  obtenerEstMotivoRevDoc() {
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_MOTIVO_REVIS).subscribe(
      (response: Response) => {
        this.listaEstMotivoRevDoc = response.resultado;
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

  obtenerEstadoDoc(id) {
    let descCombo = this.listaEstadoDocumento.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboTipoDoc(id) {
    let descCombo = this.listaTipoDocumento.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboRevDoc(id) {
    let descCombo = this.listaEstMotivoRevDoc.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboFaseAct(id) {
    let descCombo = this.listaFaseActDoc.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboEstFaseAct(id) {
    let descCombo = this.listaEstFaseActDoc.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  abrirBusqueda() {
    this.parametroBusqueda = "avanzada";
    //this.selectedFilter = "avanzada";
    this.textoBusqueda = "";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        msj: ""
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(BusquedaAvanzadaComponents, config);
    if (this.activar == true) {
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarObjeto = this.activar;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarProceso = false;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarAlcance = false;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarGerencia = false;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).tipodocumento =
        (this.idTipoDocu == null) ? 0 : this.idTipoDocu;

      if (this.idTipoSeleccionado == this.idProceso) {
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarProceso = this.activar;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).procesoparametrodesc = this.parametroRuta;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).procesoparametroid = this.parametroId + "";
      } else if (this.idTipoSeleccionado == this.idAlcance) {
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarAlcance = this.activar;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).sgiparametrodesc = this.parametroRuta;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).sgiparametroid = this.parametroId + "";
      } else if (this.idTipoSeleccionado == this.idGerencia) {
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarGerencia = this.activar;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).gerenparametrodesc = this.parametroRuta;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).gerenparametroid = this.parametroId + "";
      }
    }
    (<BusquedaAvanzadaComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: BandejaDocumento = result;
      this.objetoBusqAvanz = objeto;

      /*if(this.idTipoSeleccionado!=null) {
        if (this.idTipoSeleccionado == this.idProceso) {
          this.getListaBusqueda(this.idProceso, null, null, objeto);
        } else if (this.idTipoSeleccionado == this.idAlcance) {
          this.getListaBusqueda(null, this.idAlcance, null, objeto);
        } else if (this.idTipoSeleccionado == this.idGerencia) {
          this.getListaBusqueda(null, null, this.idGerencia, objeto);
        }
      } else {*/
      this.getListaBusqueda(null, null, null, objeto);
      //}
    });
  }

  OnPemisoCarpeta() {
    this.selectedFilter = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        hola: "adios"
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(PermisoCarpetaComponents, config);
    (<PermisoCarpetaComponents>this.bsModalRef.content).onClose.subscribe(result => {
    });
  }

  ngOnInit() {
    
    this.OnDescripcionSeleccionada();
    this.deshabilitarTextoBuscar = false;
    this.activarSegunItemArbolSel = false; //desactivado
    this.deshabilitarMenu = this.activar;

    if (localStorage.getItem("activarBuscador") != undefined || localStorage.getItem("activarBuscador") != null) {
      this.activarSegunItemArbolSel = false;//activa
      this.activarColumna = true;
      localStorage.removeItem("activarBuscador");
      localStorage.removeItem("activarColumna");
    }
    if (this.activar) {
      this.activarSegunItemArbolSel = true;
    }

    this.loading = false;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
  }

  OnBitacora() {
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalRevisiones, config);
    (<ModalRevisiones>this.bsModalRef.content).onClose.subscribe(result => {
    });
  }

  pasoParametros() {
    this.idJerar = this.listaNodes.id;
    this.idTipoDocu = this.listaNodes.idTipoDocu;
  }

  activarBotonNuevo() {
    //this.parametroBusqueda = "titulodefault";
    if (this.parametroIdTipoDoc > 0) {
      this.deshabilitaNuevo = false;
      this.activarSegunItemArbolSel = false;
      this.deshabilitarTextoBuscar = false;

      //console.log("si tiene");
    } else {
      this.deshabilitaNuevo = true;
      this.activarSegunItemArbolSel = true;
      this.deshabilitarTextoBuscar = true;


      //console.log("no tiene");
    }
  }

  onChange() {


    let idItemSeleccionadoArbol = "";
    let idItemSeleccionadoArbolIdTipDoc = "";
    idItemSeleccionadoArbol = this.parametroId.toString();
    //if (this.parametroIdTipoDoc!=null) {
    //idItemSeleccionadoArbolIdTipDoc = this.parametroIdTipoDoc.toString();
    if (this.idTipoDocu != null) {
      idItemSeleccionadoArbolIdTipDoc = this.idTipoDocu.toString();
      // YPM - INICIO
      // this.activarSegunItemArbolSel = false;
      this.activarSegunItemArbolSel = true;
      // YPM - FIN
      this.deshabilitarMenu = false;
    } else {
      idItemSeleccionadoArbolIdTipDoc = null;
      // YPM - INICIO
      // this.activarSegunItemArbolSel = true;
      this.activarSegunItemArbolSel = false;
      // YPM - FIN
      this.deshabilitarMenu = true;
    }
    let idProcesoDocSeleccinado = this.idTipoSeleccionado;
    ////let idProceso = "";
    ////let idSgi = "";
    ////let idGerencia = "";
    if (this.idTipoDocu != null) {
      /*this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idProcesoTipoDoc=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_PROCESO);
          //localStorage.setItem("idProcesoTipoDoc",this.idProcesoTipoDoc.toString());
        this.idAlcanceTipoDoc=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_ALCANCE);
          //localStorage.setItem("idAlcanceTipoDoc",this.idAlcanceTipoDoc.toString());
        this.idGerenciaTipoDoc=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_GERENCIA);
          //localStorage.setItem("idGerenciaTipoDoc",this.idGerenciaTipoDoc.toString());
        */
      this.parametroBusqueda = "default";
      if (/*idItemSeleccionadoArbol != "" &&*/ idProcesoDocSeleccinado == this.idProceso/*this.idProcesoTipoDoc*/) {
        this.idProcesoSel = idItemSeleccionadoArbol;
        ////this.getLista(idProceso, null, null/*, idItemSeleccionadoArbol*/);
        this.getListaBusqueda(this.idProcesoSel, null, null, null);
      } else if (/*idItemSeleccionadoArbol != "" &&*/ idProcesoDocSeleccinado == this.idAlcance/*this.idAlcanceTipoDoc*/) {
        this.idSgiSel = idItemSeleccionadoArbol;
        ////this.getLista(null, idSgi, null/*, idItemSeleccionadoArbol*/);
        this.getListaBusqueda(null, this.idSgiSel, null, null);
      } else if (/*idItemSeleccionadoArbol != "" &&*/ idProcesoDocSeleccinado == this.idGerencia/*this.idGerenciaTipoDoc*/) {
        this.idGerenciaSel = idItemSeleccionadoArbol;
        ////this.getLista(null, null, idGerencia/*, idItemSeleccionadoArbol*/);
        this.getListaBusqueda(null, null, this.idGerenciaSel, null);
      }
      /*},
      (error) => this.controlarError(error)
    );*/
    } else {
      this.OnLimpiar();
      this.mostrarInformacion = false;
    }
  }

  OnLimpiar() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.items = [];
  }

  OnDescripcionSeleccionada() {
    //console.log("this.parametroBusqueda0",this.parametroBusqueda);
    if (this.parametroBusqueda == "codigo") {
      this.descripcionMostrar = "Ej: DGMMA001";
    } else if (this.parametroBusqueda == "titulodefault") {
      this.descripcionMostrar = "Ej: Manual de Estandarización";
    }
  }

  OnBusqueda() {

    this.paginacion.pagina = 1;
    let texto: String = "";
    let idItemSeleccionadoArbol = "";

    if (this.parametroId != null) {
      idItemSeleccionadoArbol = this.parametroId.toString();
    }

    let idProcesoDocSeleccinado = this.idTipoSeleccionado;
    this.activarSegunItemArbolSel = false;
    if (this.parametroId != null) {
      if (idProcesoDocSeleccinado == this.idProceso) {
        this.idProcesoSeleccionado = idItemSeleccionadoArbol;
        if (this.parametroIdTipoDoc) {
          this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
          this.getListaBusqueda(this.idProcesoSeleccionado, null, null, this.objetoBusqAvanz);
        }
      } else if (idProcesoDocSeleccinado == this.idAlcance) {
        this.idSgiSeleccionado = idItemSeleccionadoArbol;
        if (this.parametroIdTipoDoc) {
          this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
          this.getListaBusqueda(null, this.idSgiSeleccionado, null, this.objetoBusqAvanz);
        }
      } else if (idProcesoDocSeleccinado == this.idGerencia) {
        this.idGerenciaSeleccionado = idItemSeleccionadoArbol;
        if (this.parametroIdTipoDoc) {
          this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
          this.getListaBusqueda(null, null, this.idGerenciaSeleccionado, this.objetoBusqAvanz);
        }
      }
    } else {
      this.getListaBusqueda(null, null, null, null);
    }
  }

  habilitarBuscar(): void {
    if (this.textoBusqueda != '')
      this.deshabilitarBuscar = false;
    else
      this.deshabilitarBuscar = true;
  }

  getListaBusqueda(idProceso, idSgi, idGerencia, objeto): void {
    this.loading = true;
    this.deshabilitarTextoBuscar = false;
    const parametros: {
      codigo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string,
      titulo?: string, estdoc?: string, fecharevdesde?: Date,
      fecharevhasta?: Date, fechaaprobdesde?: Date, fechaaprobhasta?: Date,
      tipodocumento?: number, periodooblig?: string, motirevision?: string,
      numrevi?: string, procesoparametroid?: string, sgiparametroid?: string,
      gerenparametroid?: string, idarea?: string, idparticipante?: string,
      idfaseact?: string, idfaseestadoact?: string, tipoBusq?: string, idTipoDoc?: string
    } =
    {
      codigo: null, idproc: null, idalcasgi: null, idgeregnrl: null,
      titulo: null, estdoc: null, fecharevdesde: null, fecharevhasta: null, fechaaprobdesde: null,
      fechaaprobhasta: null, tipodocumento: null, periodooblig: null, motirevision: null,
      numrevi: null, procesoparametroid: null, sgiparametroid: null, gerenparametroid: null,
      idarea: null, idparticipante: null, idfaseact: null, idfaseestadoact: null, tipoBusq: null, idTipoDoc: null
    };

    let texto: String = "<strong>Búsqueda Por:</strong>";
    //if (this.parametroBusqueda!=null && this.textoBusqueda!=null){
    switch (this.parametroBusqueda) {
      case 'codigo':
        texto = texto + "<br/><strong>Código: </strong>" + this.textoBusqueda;
        //this.descripcionMostrar = "Eje: DGM-RL03 1";
        parametros.codigo = this.textoBusqueda;
        parametros.idproc = idProceso;
        parametros.idalcasgi = idSgi;
        parametros.idgeregnrl = idGerencia;
        //parametros.tipodocumento = objeto;
        if (objeto != null) {
          parametros.tipodocumento = objeto.tipodocumento;
        } else {
          parametros.tipodocumento = objeto;
        }
        this.mostrarInformacion = true;
        this.mensajeInformacion = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        break;
      case 'titulodefault':
        texto = texto + "<br/><strong>Título: </strong>" + this.textoBusqueda;
        //this.descripcionMostrar = "DS 184-2008-EF Reglamento de la Ley de Contrataciones del Estado";
        parametros.titulo = this.textoBusqueda;
        parametros.idproc = idProceso;
        parametros.idalcasgi = idSgi;
        parametros.idgeregnrl = idGerencia;
        if (objeto != null) {
          if (objeto.tipodocumento) {
            parametros.tipodocumento = objeto.tipodocumento;
          } else {
            parametros.tipodocumento = objeto;
          }
        } else {
          parametros.tipodocumento = objeto;
        }
        this.mostrarInformacion = true;
        this.mensajeInformacion = this.sanitizer.sanitize(SecurityContext.HTML, texto);

        //Obtener Datos Para el Excel
        this.excelDocumento.titulo = parametros.titulo;
        this.excelDocumento.idproceso = parametros.idproc;
        this.excelDocumento.idalcasgi = parametros.idalcasgi;
        this.excelDocumento.idgeregnrl = parametros.idgeregnrl;
        //Fin
        break;
      case 'avanzada':
        parametros.titulo = objeto.titulo;
        parametros.estdoc = objeto.estdoc;
        parametros.fecharevdesde = objeto.fecharevdesde;
        parametros.fecharevhasta = objeto.fecharevhasta;
        parametros.tipodocumento = objeto.tipodocumento;
        parametros.periodooblig = objeto.periodooblig;
        parametros.motirevision = objeto.motirevision;
        parametros.numrevi = objeto.numrevi;
        if (idProceso) parametros.procesoparametroid = idProceso;
        else parametros.procesoparametroid = objeto.procesoparametroid;
        if (idSgi) parametros.sgiparametroid = idSgi;
        else parametros.sgiparametroid = objeto.sgiparametroid;
        if (idGerencia) parametros.gerenparametroid = idGerencia;
        else parametros.gerenparametroid = objeto.gerenparametroid;
        parametros.idarea = objeto.idarea;
        parametros.idparticipante = objeto.idparticipante;
        parametros.idfaseact = objeto.idfaseact;
        parametros.idfaseestadoact = objeto.idfaseestadoact;
        parametros.tipoBusq = "avanzada";

        //Obtener Datos Para el Excel
        this.excelDocumento.titulo = parametros.titulo;
        //Fin

        if (objeto.titulo != "") {
          this.mostrarInformacion = true;
          texto = texto + "<br/><strong>Título: </strong> <parrafo>" + objeto.titulo + "</parrafo>" + " ";
        }
        if (objeto.estdoc != ",," && objeto.estdoc != null) {
          let txtoBusqPrev = objeto.estdoc.substring(objeto.estdoc.length, 1);
          let txtoBusqPost = txtoBusqPrev.substring(0, txtoBusqPrev.length - 1);
          let datoBusqueda = txtoBusqPost.split(",", 4);
          let msjMostrar = "";
          for (let i = 0; i < datoBusqueda.length; i++) {
            if (datoBusqueda[i] != "") {
              msjMostrar = msjMostrar + this.obtenerEstadoDoc(datoBusqueda[i]) + ", ";
            }
          }
          texto = texto + "<br/><strong>Estado de Documento: </strong>" + msjMostrar.substring(0, msjMostrar.length - 2) + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.fechaaprobdesde != null && objeto.fechaaprobhasta != null) {
          texto = texto + "<br/><strong>Fecha de Aprobación : </strong>" + this.datePipe.transform(objeto.fechaaprobdesde, "dd/MM/yyyy") + " - " + this.datePipe.transform(objeto.fechaaprobhasta, "dd/MM/yyyy") + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.procesoparametrodesc != null && objeto.procesoparametrodesc != undefined && objeto.procesoparametrodesc != "") {
          texto = texto + "<br/><strong>Proceso: </strong>" + objeto.procesoparametrodesc + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.sgiparametrodesc != null && objeto.sgiparametrodesc != undefined && objeto.sgiparametrodesc != "") {
          texto = texto + "<br/><strong>Alcance SGI: </strong>" + objeto.sgiparametrodesc + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.gerenparametrodesc != null && objeto.gerenparametrodesc != undefined && objeto.gerenparametrodesc != "") {
          texto = texto + "<br/><strong>Gerencia: </strong>" + objeto.gerenparametrodesc + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.tipodocumento != 0) {
          texto = texto + "<br/><strong>Tipo de Documento: </strong>" + this.obtenerDescComboTipoDoc(objeto.tipodocumento) + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.periodooblig != "0") {
          if (objeto.periodooblig == "1") {
            texto = texto + "<br/><strong>Periodo de Obligatoriedad: </strong> Si";
          } else if (objeto.periodooblig == "2") {
            texto = texto + "<br/><strong>Periodo de Obligatoriedad: </strong> No";
          } else {
          }
          this.mostrarInformacion = true;
        }
        if (objeto.descripcionarea != "") {
          texto = texto + "<br/><strong>Equipo Usuario: </strong>" + objeto.descripcionarea + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.motirevision != "") {
          texto = texto + "<br/><strong>Motivo de Revisión: </strong>" + this.obtenerDescComboRevDoc(objeto.motirevision) + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.descparticipante != "") {
          texto = texto + "<br/><strong>Participante: </strong>" + objeto.descparticipante + " ";
          this.mostrarInformacion = true;
        }
        if (objeto.idfaseact != "") {
          texto = texto + "<br/><strong>Fase Actual: </strong>" + this.obtenerDescComboFaseAct(objeto.idfaseact);
          this.mostrarInformacion = true;
        }
        if (objeto.idfaseestadoact != "") {
          texto = texto + "<br/><strong>Estado de la Fase Actual: </strong>" + this.obtenerDescComboEstFaseAct(objeto.idfaseestadoact);
          this.mostrarInformacion = true;
        }
        this.mensajeInformacion = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        this.deshabilitarTextoBuscar = true;
        break;
      case 'default':
        parametros.idproc = idProceso;
        parametros.idalcasgi = idSgi;
        parametros.idgeregnrl = idGerencia;
        if (this.idTipoDocu) {
          parametros.tipodocumento = this.idTipoDocu;
        }
        this.mostrarInformacion = false;
        //Excel Ini
        this.excelDocumento.idproceso = parametros.idproc;
        this.excelDocumento.idalcasgi = parametros.idalcasgi;
        this.excelDocumento.idgeregnrl = parametros.idgeregnrl;
        this.excelDocumento.idTipoDoc = Number(parametros.idTipoDoc);
        //Excel Fin
        this.parametroBusqueda = "titulodefault";
        this.textoBusqueda = "";
        break;
    }
    this.service.buscarPorParametrosAvanz(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        let listadedocumento: BandejaDocumento[] = response.resultado;
        listadedocumento.forEach(documento => {
          if (documento.revision != null) {
            if (documento.estado.v_descons == Constante.ESTADO_DOCUMENTO_APROBADO) {
              documento.idrevision = documento.revision.numero
              documento.revisionfecha = this.datePipe.transform(documento.revision.fechaAprobacionDocumento, "dd/MM/yyyy");
            } else {
              if (documento.revision.numeroAnterior != null) {
                documento.idrevision = documento.revision.numeroAnterior + "";
              } else {
                documento.idrevision = " ";
              }

              documento.revisionfecha = this.datePipe.transform(documento.revision.fechaAprobacionAnterior, "dd/MM/yyyy");
            }
          } else {
            documento.idrevision = " ";
            documento.revisionfecha = " ";
          }

        });





        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  OnNuevo() {
    let itemDocumento: EnvioParametros = new EnvioParametros();
    itemDocumento.nuevo = true;
    itemDocumento.edicion = false;
    sessionStorage.setItem("item", JSON.stringify(itemDocumento));
    this.router.navigate([`documento/general/bandejadocumento/editar/registrar-documento`]);

  }

  OnModificar(item) {
    
    if (item.estado.v_descons == "Aprobado") {
      localStorage.setItem("codigo", item.codigo);

      this.router.navigate([`documento/general/bandejadocumento/editar/editar-documento-traslado/${item.id}`]);
    }
    else {
      this.toastr.warning('', 'El documento debe estar aprobado', { closeButton: true });
    }
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    if (this.parametroBusqueda == "avanzada") {
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz /*this.objetoBusqAvanz*//*this.parametroIdTipoDoc*/);
    }
    else {
      this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz /*this.objetoBusqAvanz*//*this.parametroIdTipoDoc*/);
    }
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;

    if (this.parametroBusqueda == "avanzada") {
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz /*this.objetoBusqAvanz*//*this.parametroIdTipoDoc*/);
    }
    else {
      this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz /*this.objetoBusqAvanz*//*this.parametroIdTipoDoc*/);
    }

  }
  OnExportarXls() {
    const parametros: {
      codigo?: string,
      descripcion?: string,
      numrevi?: string,
      tipodocumento?: number,
      estado?: string,
      idproceso?: string,
      idalcasgi?: string;
      idgeregnrl?: string;
      prioridad?: string
    } = {};

    //Parametros de Entrada
    parametros.idproceso = this.excelDocumento.idproceso;
    parametros.idalcasgi = this.excelDocumento.idalcasgi;
    parametros.idgeregnrl = this.excelDocumento.idgeregnrl;
    parametros.tipodocumento = this.excelDocumento.idTipoDoc;
    this.bandejaService.generarExcel(parametros).subscribe(function (data) {
      var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
      var fileURL = URL.createObjectURL(file);

      window.open(fileURL);

    },
      (error) => this.controlarError(error)
    );

    this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
  }

  // YPM - INICIO
  OnVerFicha(): void {
    
    let bean: Jerarquia = new Jerarquia();
    bean.idPadre = this.parametroId;
    localStorage.setItem("beanJerarquia", JSON.stringify(bean));
    this.router.navigate([`documento/general/bandejadocumento/consultarFicha/` + Constante.INFORMACION_DOCUMENTADA]);
  }

  // YPM - FIN
}

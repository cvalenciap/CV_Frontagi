import { Component, OnInit, Input } from '@angular/core';
import { Router, ActivatedRoute, RouterLink } from '@angular/router';
import {BandejaDocumento, Documento} from '../../../models';
import { Response } from '../../../models/response';
import { BandejaDocumentoService } from '../../../services';
import { Paginacion } from '../../../models/paginacion';
import { DatePipe } from '@angular/common';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ModalRevisiones } from 'src/app/modules/bandejadocumento/modales/modal-revisiones.component';
import { Programa } from 'src/app/models/programa';
import { BusquedaAvanzadaComponents } from 'src/app/modules/bandejadocumento/modales/busqueda-avanzada.component';
import { PermisoCarpetaComponents } from 'src/app/modules/bandejadocumento/modales/permiso-carpeta.component';
import { Constante } from 'src/app/models/enums';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { FiltroDocumento } from 'src/app/models/filtro-documento';
import { Jerarquia } from 'src/app/models/jerarquia';
import { SessionService } from 'src/app/auth/session.service';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { environment } from 'src/environments/environment';

@Component({
  selector: 'bandeja-documento-gestion-documento',
  templateUrl: 'gestiondocumento.template.html',
  styleUrls: ['gestiondocumento.component.scss']
})
export class GestionDocumentoComponents implements OnInit {
  static item;
  @ViewChild('general') general1: PaginacionSetComponent;
  @Input() parametroId: number;
  @Input() parametroIdTipoDoc: number;
  @Input() parametroRuta: string;
  @Input() activar: boolean;
  @Input() listaNodes: any;
  @Input() activartab : boolean;

  BandejaDocumento: any;
  excelDocumento: FiltroDocumento;
  paginacion: Paginacion;
  paginacionRetorno: Paginacion;
  items: Programa[];
  busquedaProgramacion: Programa;
  textoBusqueda: string;
  urlPDF1:string;
  rutaFinal:string;
  urlPDF:any;
  urlPDF2:boolean;
  apiEndpoint:string;
  parametroBusqueda: string;
  selectedRow: number;
  selectedObject: BandejaDocumento;
  selectedFilter: string;
  idProceso: number;
  idAlcance: number;
  idGerencia: number;
  textoAccion: string;
  idTipoSeleccionado: number;
  activarNuevo: boolean;
  activarverficha: boolean;
  activarProceso: boolean;
  activarSegunItemArbolSel: boolean;  
  activarColumna: boolean; 
  textoMenu:string;
  mensajeInformacion:string;
  mostrarInformacion:boolean;
  mostrarAlerta:boolean;
  parametroBusquedaAnterior: string;
  textoBusquedaAnterior: string;
  textoMenuAnterior:string;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  bsModalRef: BsModalRef;
  deshabilitaNuevo: boolean;
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
  pagRetorno: number;
  objetoBlob: any;
  activarFicha:boolean;
  objetoRetornoBusqueda:RetornosBusqueda;
  parametros: {codigo?:string,idproc?: string,idalcasgi?: string, idgeregnrl?: string, vmodalava?: string,
    titulo?:string,estdoc?: string,fecharevdesde?:Date,
    fecharevhasta?:Date,fechaaprobdesde?:Date,fechaaprobhasta?:Date,
    tipodocumento?:number,periodooblig?:string,motirevision?:string,
    numrevi?:string,procesoparametroid?:string,sgiparametroid?:string,
    gerenparametroid?:string,idarea?:string,idparticipante?:string,
    idfaseact?:string,idfaseestadoact?:string,tipoBusq?:string, idTipoDoc?:string} = 
    {codigo: null, idproc: null, idalcasgi: null, idgeregnrl: null,
    titulo:null, estdoc:null, fecharevdesde:null, fecharevhasta:null,fechaaprobdesde:null,
    fechaaprobhasta:null,tipodocumento:null,periodooblig:null,motirevision:null,
    numrevi:null,procesoparametroid:null,sgiparametroid:null,gerenparametroid:null,
    idarea:null,idparticipante:null,idfaseact:null,idfaseestadoact:null,tipoBusq:null,idTipoDoc:null};
  rutaAnterior:string;
  rutaActual:string;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  valorPaginacion: number;
  IndicadorPagina:number;
  paginaRetorno:number;
  paginaLimpiar:boolean;
  tipoBusquedaOpc:string;
  
  constructor(private service: BandejaDocumentoService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private serviceParametro: ParametrosService,
    private toastr: ToastrService,
    private sanitizer: DomSanitizer,
    private router: Router,
    private bandejaService: BandejaDocumentoService,
    public session: SessionService) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.selectedFilter = 'usuario';        
    this.parametroBusqueda = "titulodefault";
    this.paginacion = new Paginacion({registros: 10});
    this.paginacionRetorno = new Paginacion({registros: 10});    
    this.textoMenu = null;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.deshabilitarBuscar = true;
    this.deshabilitarTextoBuscar = false;
    this.deshabilitaNuevo= false;
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
    this.objetoRetornoBusqueda = new RetornosBusqueda(); 
    this.rutaAnterior = sessionStorage.getItem("rutaAnterior");
    this.rutaActual = this.router.url;
    this.valorPaginacion = 0;
    this.IndicadorPagina = 0;
    this.paginaLimpiar=true; 
    
    GestionDocumentoComponents.item = 1;
    
    this.obtenerEstadoDocumento();
    this.obtenerParametros();
    this.obtenerEstMotivoRevDoc();
    this.obtenerFaseActDoc();
    this.obtenerEstFaseActDoc();

    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idProceso=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_PROCESO);
        this.idAlcance=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_ALCANCE);
        this.idGerencia=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.TIPO_JERARQUIA_GERENCIA);
        this.idTipoSeleccionado = (localStorage.getItem("idProcesoSeleccionado")==null)?0:
                                  Number(localStorage.getItem("idProcesoSeleccionado"));
        
        if(this.idTipoSeleccionado==this.idProceso) {
          this.textoAccion=Constante.TITULO_PROCESO;
        } else if(this.idTipoSeleccionado==this.idAlcance) {
          this.textoAccion=Constante.TITULO_ALCANCE;
        } else if(this.idTipoSeleccionado==this.idGerencia) {
          this.textoAccion=Constante.TITULO_GERENCIA;
        }

        if(this.activar) {
          if(this.idTipoSeleccionado==this.idProceso) {
            this.activarNuevo = false;
            this.activarverficha = true;
            this.activarProceso = true;
          } else if(this.idTipoSeleccionado==this.idAlcance) {
            this.activarNuevo = false;
            this.activarverficha = false;
            this.activarProceso = false;
          } else if(this.idTipoSeleccionado==this.idGerencia) {
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
        
      },
      (error) => this.controlarError(error)
    );

  }

  ngOnInit() {
    
    this.OnDescripcionSeleccionada();
    this.deshabilitarTextoBuscar = false;
    this.activarSegunItemArbolSel = false;
    this.deshabilitarMenu=this.activar;
    
    if(localStorage.getItem("activarBuscador")!=undefined || localStorage.getItem("activarBuscador")!=null){
      this.activarSegunItemArbolSel = false;
      this.activarColumna = true;
      localStorage.removeItem("activarBuscador");
      localStorage.removeItem("activarColumna");
    }
    if(this.activar) {
      this.activarSegunItemArbolSel = true;
    }
    
    this.mostrarInformacion = false;
    this.deshabilitaNuevo=true;

    if (localStorage.getItem("objetoRetornoBusqueda")!=undefined || localStorage.getItem("objetoRetornoBusqueda")!=null) {

      this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
      this.deshabilitaNuevo = false;

      if (localStorage.getItem("objetoRetornoBusqAvanz")!=undefined || localStorage.getItem("objetoRetornoBusqAvanz")!=null) {
        
        this.objetoBusqAvanz = JSON.parse(localStorage.getItem("objetoRetornoBusqAvanz"));
        this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
        this.listaTipoDocumento = this.objetoRetornoBusqueda.listaTipoDocumento;
        this.listaFaseActDoc = this.objetoRetornoBusqueda.listaFaseActDoc;
        this.listaEstFaseActDoc = this.objetoRetornoBusqueda.listaEstFaseActDoc;
        this.listaEstMotivoRevDoc = this.objetoRetornoBusqueda.listaEstMotivoRevDoc;
        this.listaEstadoDocumento = this.objetoRetornoBusqueda.listaEstadoDocumento;

        if (this.objetoRetornoBusqueda.idProceso != null || this.objetoRetornoBusqueda.idalcasgi != null ||this.objetoRetornoBusqueda.idgeregnrl != null ) {
          this.parametroId = this.objetoRetornoBusqueda.parametroId;
          this.idTipoDocu = this.objetoRetornoBusqueda.idTipoDoc;
          if (this.idTipoDocu != null) {
            this.activarSegunItemArbolSel = true;
            this.deshabilitarMenu = false;
            this.deshabilitarTextoBuscar=true;
          } else {
            this.activarSegunItemArbolSel = false;
            this.deshabilitarMenu = true;
          }
        } else {
          this.getListaBusqueda(null,null,null, this.objetoBusqAvanz);

          this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
              
          if (this.objetoRetornoBusqueda.registros <= 10) {
            this.OnPageChangedReturn(this.objetoRetornoBusqueda.pagina);
          } else {
            this.pagRetorno = parseInt( localStorage.getItem("pagRetorno"));
            this.general1.change(this.objetoRetornoBusqueda.registros);
            this.OnPageOptionChangedReturn(this.pagRetorno, this.objetoRetornoBusqueda.registros);
          }
          
        }

      } else {

        if (this.objetoRetornoBusqueda.idProceso != null || this.objetoRetornoBusqueda.idalcasgi != null ||this.objetoRetornoBusqueda.idgeregnrl != null ) {
          this.parametroId = this.objetoRetornoBusqueda.parametroId;
          this.idTipoDocu = this.objetoRetornoBusqueda.idTipoDoc;
        } else {

          this.OnBusquedaRetorno();
          
          this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
      
          if (this.objetoRetornoBusqueda.registros <= 10) {
            this.OnPageChangedReturn(this.objetoRetornoBusqueda.pagina);
          } else {
            this.pagRetorno = parseInt( localStorage.getItem("pagRetorno"));
            this.general1.change(this.objetoRetornoBusqueda.registros);
            this.OnPageOptionChangedReturn(this.pagRetorno, this.objetoRetornoBusqueda.registros);
          }
        }       

      }
   
    }

    this.loading = false;
    this.mostrarAlerta = false;
    this.activarFicha=true;
  }

  OnLimpiar() {
    this.tipoBusquedaOpc = localStorage.getItem("indicadordocumento");
    if (this.tipoBusquedaOpc == "2") {
      localStorage.removeItem("objetoRetornoBusqAvanz");
      localStorage.removeItem("objetoRetornoBusqueda");
      localStorage.removeItem("pagRetorno");
      this.parametroBusqueda = "titulodefault";
      this.descripcionMostrar = "Ej: Manual de Estandarización";
      this.deshabilitarBuscar = true;
      this.deshabilitarTextoBuscar = false;
      this.deshabilitaNuevo = true;
      this.paginaLimpiar = false;
      this.textoBusqueda = "";
      this.items = [];
      this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
      this.mostrarInformacion = false;
    } else {
      this.parametroBusqueda = "titulodefault";
      this.descripcionMostrar = "Ej: Manual de Estandarización";
      this.textoBusqueda = "";
      this.paginacion.pagina = 1;
      this.OnBusqueda();
    }
  }

  public get staticItem(){
    return GestionDocumentoComponents.item;
  }  

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  //Combo estado de documentos
  obtenerEstadoDocumento(){
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_DOCUMENTO).subscribe(
    (response: Response) => {
      this.listaEstadoDocumento = response.resultado;
      this.objetoRetornoBusqueda.listaEstadoDocumento = [];
      this.objetoRetornoBusqueda.listaEstadoDocumento = this.listaEstadoDocumento;
    }, (error) => this.controlarError(error));
  }

  //Combo tipo de documentos
  obtenerParametros() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_DOCUMENTO).subscribe(
        (response: Response) => {
            this.listaTipoDocumento = response.resultado;
            this.objetoRetornoBusqueda.listaTipoDocumento = [];
            this.objetoRetornoBusqueda.listaTipoDocumento = this.listaTipoDocumento;
        }, (error) => this.controlarError(error));
  }

  //Combo estado de motivo de revision de documento
  obtenerEstMotivoRevDoc(){
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_MOTIVO_REVIS).subscribe(
      (response: Response) => {
          this.listaEstMotivoRevDoc = response.resultado;
          this.objetoRetornoBusqueda.listaEstMotivoRevDoc = [];
          this.objetoRetornoBusqueda.listaEstMotivoRevDoc = this.listaEstMotivoRevDoc;
      }, (error) => this.controlarError(error));
  }

  //Combo fase actual de documento
  obtenerFaseActDoc(){
    this.serviceParametro.obtenerParametroPadre(Constante.FASE_ACT_DOCUMENTO).subscribe(
      (response: Response) => {
          this.listaFaseActDoc = response.resultado;
          this.objetoRetornoBusqueda.listaFaseActDoc = [];
          this.objetoRetornoBusqueda.listaFaseActDoc = this.listaFaseActDoc;          
      }, (error) => this.controlarError(error));
  }

  //Combo estado de fase actual de documento
  obtenerEstFaseActDoc(){
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_FASE_ACT_DOC).subscribe(
      (response: Response) => {
          this.listaEstFaseActDoc = response.resultado;
          this.objetoRetornoBusqueda.listaEstFaseActDoc = [];
          this.objetoRetornoBusqueda.listaEstFaseActDoc = this.listaEstFaseActDoc;          
      }, (error) => this.controlarError(error));
  }

  obtenerEstadoDoc(id){
    let descCombo = this.listaEstadoDocumento.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboTipoDoc(id){
    let descCombo = this.listaTipoDocumento.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboRevDoc(id){
    let descCombo = this.listaEstMotivoRevDoc.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboFaseAct(id){
    let descCombo = this.listaFaseActDoc.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  obtenerDescComboEstFaseAct(id){
    let descCombo = this.listaEstFaseActDoc.find(desc => desc.idconstante == id);
    return descCombo.v_valcons;
  }

  abrirBusqueda(){
    
    this.parametroBusqueda  = "avanzada";
    this.textoBusqueda = "";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        msj:""
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(BusquedaAvanzadaComponents, config);

    if(this.activar==true) {
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarObjeto = this.activar;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarProceso = false;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarAlcance = false;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarGerencia = false;
      (<BusquedaAvanzadaComponents>this.bsModalRef.content).tipodocumento =
        (this.idTipoDocu==null)?0:this.idTipoDocu;
    
      if(this.idTipoSeleccionado==this.idProceso) {
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarProceso = this.activar;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).procesoparametrodesc = this.parametroRuta;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).procesoparametroid = this.parametroId + "";
      } else if(this.idTipoSeleccionado==this.idAlcance) {
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarAlcance = this.activar;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).sgiparametrodesc = this.parametroRuta;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).sgiparametroid = this.parametroId + "";
      } else if(this.idTipoSeleccionado==this.idGerencia) {
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).deshabilitarGerencia = this.activar;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).gerenparametrodesc = this.parametroRuta;
        (<BusquedaAvanzadaComponents>this.bsModalRef.content).gerenparametroid = this.parametroId + "";
      }
    }
    (<BusquedaAvanzadaComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto:BandejaDocumento = result;
      this.objetoBusqAvanz = objeto;
      this.deshabilitaNuevo = false;
      
      
      if (objeto != null) {
          this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;
          localStorage.removeItem("objetoRetornoBusqAvanz");
          localStorage.setItem("objetoRetornoBusqAvanz", JSON.stringify(objeto));
          this.getListaBusqueda(null,null,null, objeto);
      }
    });
  }

  OnPemisoCarpeta(){
    this.selectedFilter = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
            hola:"adios"
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(PermisoCarpetaComponents, config);
    (<PermisoCarpetaComponents>this.bsModalRef.content).onClose.subscribe(result => {     
    });  
  }
  
  OnBitacora(){
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

  pasoParametros(){
    this.idJerar = this.listaNodes.id;
    this.idTipoDocu = this.listaNodes.idTipoDocu;
  }

  activarBotonNuevo(){
    if(this.parametroIdTipoDoc >0){
      this.deshabilitaNuevo = false;
      this.activarSegunItemArbolSel = false;
      this.deshabilitarTextoBuscar = false;
      this.activarFicha=true;
    }else{
      this.deshabilitaNuevo = true;
      this.activarSegunItemArbolSel = true;
      this.deshabilitarTextoBuscar = true;
      this.activarFicha=false;
    }
    
  }



  OnDescripcionSeleccionada(){
    
    if (this.parametroBusqueda == "codigo") {
      this.descripcionMostrar = "Ej: DGMMA001";
    } else if(this.parametroBusqueda == "titulodefault"){
      this.descripcionMostrar = "Ej: Manual de Estandarización";
    }
  }

  habilitarBuscar(): void {
    if(this.textoBusqueda!='')
      this.deshabilitarBuscar=false; 
    else
      this.deshabilitarBuscar=true;
  }

  onChange() {
    let idItemSeleccionadoArbol = "";
    let idItemSeleccionadoArbolIdTipDoc = "";
    idItemSeleccionadoArbol = this.parametroId.toString();
    let idProcesoDocSeleccinado = this.idTipoSeleccionado;
    this.objetoRetornoBusqueda.idProcesoDocSeleccinado =  idProcesoDocSeleccinado;
    this.objetoRetornoBusqueda.idProc = this.idProceso;
    this.objetoRetornoBusqueda.idAlcance = this.idAlcance;
    this.objetoRetornoBusqueda.idGerencia = this.idGerencia;
    
    localStorage.removeItem("objetoRetornoBusqAvanz");

    if (this.idTipoDocu != null) {
      idItemSeleccionadoArbolIdTipDoc = this.idTipoDocu.toString();
      this.activarSegunItemArbolSel = true;
      this.deshabilitarMenu = false;
    } else {
      idItemSeleccionadoArbolIdTipDoc = null;
      this.activarSegunItemArbolSel = false;
      this.deshabilitarMenu = true;
    }

    if (this.idTipoDocu != null) {
      this.parametroBusqueda = "default";
      this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;
      if (idProcesoDocSeleccinado == this.idProceso) {
        this.idProcesoSel = idItemSeleccionadoArbol;
        this.getListaBusqueda(this.idProcesoSel, null, null, null);
      } else if (idProcesoDocSeleccinado == this.idAlcance) {
        this.idSgiSel = idItemSeleccionadoArbol;
        this.getListaBusqueda(null, this.idSgiSel, null, null);
      } else if (idProcesoDocSeleccinado == this.idGerencia) {
        this.idGerenciaSel = idItemSeleccionadoArbol;
        this.getListaBusqueda(null, null, this.idGerenciaSel, null);
      }
    } else {
      this.paginacion = new Paginacion({registros: 10});    
      this.items = [];
      this.deshabilitaNuevo = true;
      this.mostrarInformacion = false;
    }

  }

  onChangeRetorno() {

    let idItemSeleccionadoArbol = "";
    let idItemSeleccionadoArbolIdTipDoc = "";
    this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
    idItemSeleccionadoArbol = this.objetoRetornoBusqueda.parametroId.toString();
    this.idTipoDocu = this.objetoRetornoBusqueda.idTipoDoc;

    let idProcesoDocSeleccinado = this.objetoRetornoBusqueda.idProcesoDocSeleccinado;
    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda =  this.objetoRetornoBusqueda.textoBusqueda;
    this.parametroId =  this.objetoRetornoBusqueda.parametroId;

    localStorage.removeItem("objetoRetornoBusqAvanz");

    if (this.idTipoDocu != null) {
      idItemSeleccionadoArbolIdTipDoc = this.idTipoDocu.toString();
      this.activarSegunItemArbolSel = true;
      this.deshabilitarMenu = false;
    } else {
      idItemSeleccionadoArbolIdTipDoc = null;
      this.activarSegunItemArbolSel = false;
      this.deshabilitarMenu = true;
    }

    if (this.idTipoDocu != null) {
      if (idProcesoDocSeleccinado == this.objetoRetornoBusqueda.idProc) {
        this.idProcesoSel = idItemSeleccionadoArbol;
        this.objetoBusqAvanz.tipodocumento = this.idTipoDocu;
        this.getListaBusqueda(this.idProcesoSel, null, null, this.objetoBusqAvanz);
      } else if (idProcesoDocSeleccinado == this.objetoRetornoBusqueda.idAlcance) {
        this.idSgiSel = idItemSeleccionadoArbol;
        this.objetoBusqAvanz.tipodocumento = this.idTipoDocu;
        this.getListaBusqueda(null, this.idSgiSel, null, this.objetoBusqAvanz);
      } else if (idProcesoDocSeleccinado == this.objetoRetornoBusqueda.idGerencia) {
        this.idGerenciaSel = idItemSeleccionadoArbol;
        this.objetoBusqAvanz.tipodocumento = this.idTipoDocu;
        this.getListaBusqueda(null, null, this.idGerenciaSel, this.objetoBusqAvanz);
      }

      


    } else {
      this.paginacion = new Paginacion({registros: 10});    
      this.items = [];
      this.deshabilitaNuevo = true;
      this.mostrarInformacion = false;
    }

  }
 
/*   OnLimpiar(){
    this.paginacion = new Paginacion({registros: 10});    
    this.items = [];
  } */

  OnBusquedaRetorno() {
    
    this.parametroBusqueda="";
    this.textoBusqueda = "";
    this.deshabilitaNuevo = false;
    this.paginacion.pagina = 1;
    let texto: String = "";
    let idItemSeleccionadoArbol = "";
    let idProcesoDocSeleccinado = this.idTipoSeleccionado;
    this.activarSegunItemArbolSel = false;

    this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda =  this.objetoRetornoBusqueda.textoBusqueda;
    this.parametroId =  this.objetoRetornoBusqueda.parametroId;

    if (this.parametroId != null) {
      idItemSeleccionadoArbol = this.parametroId.toString();
    }

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

  OnBusqueda() {
    
    this.deshabilitaNuevo = false;
    this.valorPaginacion = 1;
    this.paginacion.pagina = 1;
    let texto: String = "";
    let idItemSeleccionadoArbol = "";
    let idProcesoDocSeleccinado = this.idTipoSeleccionado;
    this.activarSegunItemArbolSel = false;
    localStorage.removeItem("objetoRetornoBusqAvanz");
        
    this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;
    this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;

    if (this.parametroId != null) {
      idItemSeleccionadoArbol = this.parametroId.toString();
    }

    if (this.parametroId != null) {
      this.objetoRetornoBusqueda.parametroId = this.parametroId;
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

  getListaBusqueda(idProceso, idSgi, idGerencia, objeto): void {
    this.loading = true;
    this.deshabilitarTextoBuscar = false;
    let texto: String = "<strong>Búsqueda Por:</strong>";
    this.parametros =
      {
        codigo: null, idproc: null, idalcasgi: null, idgeregnrl: null, vmodalava: null,
        titulo: null, estdoc: null, fecharevdesde: null, fecharevhasta: null, fechaaprobdesde: null,
        fechaaprobhasta: null, tipodocumento: null, periodooblig: null, motirevision: null,
        numrevi: null, procesoparametroid: null, sgiparametroid: null, gerenparametroid: null,
        idarea: null, idparticipante: null, idfaseact: null, idfaseestadoact: null, tipoBusq: null, idTipoDoc: null
      };
 
    switch (this.parametroBusqueda) {
      case 'codigo':

        texto = texto + "<br/><strong>Código: </strong>" + this.textoBusqueda;
        this.parametros.codigo = this.textoBusqueda;
        this.parametros.idproc = idProceso;
        this.parametros.idalcasgi = idSgi;
        this.parametros.idgeregnrl = idGerencia;

        if (objeto != null) {
          this.parametros.tipodocumento = objeto.tipodocumento;
        } else {
          this.parametros.tipodocumento = objeto;
        }

        if (this.textoBusqueda.trim() =="") {
          this.mostrarInformacion = false;
        } else {
          this.mostrarInformacion = true;
          this.mensajeInformacion = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        }

        
        break;

      case 'titulodefault':

        texto = texto + "<br/><strong>Título: </strong>" + this.textoBusqueda;
        this.parametros.titulo = this.textoBusqueda;
        this.parametros.idproc = idProceso;
        this.parametros.idalcasgi = idSgi;
        this.parametros.idgeregnrl = idGerencia;

        if (objeto != null) {
          if (objeto.tipodocumento) {
            this.parametros.tipodocumento = objeto.tipodocumento;
          } else {
            this.parametros.tipodocumento = objeto;
          }
        } else {
          this.parametros.tipodocumento = objeto;
        }

        if (this.textoBusqueda.trim() =="") {
          this.mostrarInformacion = false;
        } else {
          this.mostrarInformacion = true;
          this.mensajeInformacion = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        }        
        
        this.excelDocumento.titulo = this.parametros.titulo;
        this.excelDocumento.idproceso = this.parametros.idproc;
        this.excelDocumento.idalcasgi = this.parametros.idalcasgi;
        this.excelDocumento.idgeregnrl = this.parametros.idgeregnrl;
        break;

      case 'avanzada':
        this.mostrarInformacion = false;
        if (objeto != null) {
          this.parametros.titulo = objeto.titulo;
          this.parametros.estdoc = objeto.estdoc;

          if (objeto.fecharevdesde != null) {
            this.parametros.fecharevdesde =new Date(objeto.fecharevdesde);
          } else {
            this.parametros.fecharevdesde =null;
          }

          if (objeto.fecharevhasta != null) {
            this.parametros.fecharevhasta =new Date(objeto.fecharevhasta);
          } else {
            this.parametros.fecharevhasta =null;
          }

          if (objeto.fechaaprobdesde != null) {
            this.parametros.fechaaprobdesde =new Date(objeto.fechaaprobdesde);
          } else {
            this.parametros.fechaaprobdesde =null;
          }

          if (objeto.fechaaprobhasta != null) {
            this.parametros.fechaaprobhasta =new Date(objeto.fechaaprobhasta);
          } else {
            this.parametros.fechaaprobhasta =null;
          }

/*           this.parametros.fecharevdesde =new Date(objeto.fecharevdesde);
          this.parametros.fecharevhasta = new Date(objeto.fecharevhasta);
          this.parametros.fechaaprobdesde = new Date(objeto.fechaaprobdesde);
          this.parametros.fechaaprobhasta = new Date(objeto.fechaaprobhasta); */
          this.parametros.tipodocumento = objeto.tipodocumento;
          this.parametros.periodooblig = objeto.periodooblig;
          this.parametros.motirevision = objeto.motirevision;
          this.parametros.numrevi = objeto.numrevi;
          if (idProceso) this.parametros.procesoparametroid = idProceso;
          else this.parametros.procesoparametroid = objeto.procesoparametroid;
          if (idSgi) this.parametros.sgiparametroid = idSgi;
          else this.parametros.sgiparametroid = objeto.sgiparametroid;
          if (idGerencia) this.parametros.gerenparametroid = idGerencia;
          else this.parametros.gerenparametroid = objeto.gerenparametroid;

          if (objeto.habilitarGerencia) {
            this.parametros.vmodalava = "Avanzado";
          } else {
            this.parametros.vmodalava = "Inicial";
          }

          this.parametros.idarea = objeto.idarea;
          this.parametros.idparticipante = objeto.idparticipante;
          this.parametros.idfaseact = objeto.idfaseact;
          this.parametros.idfaseestadoact = objeto.idfaseestadoact;
          this.parametros.tipoBusq = "avanzada";
          this.excelDocumento.titulo = this.parametros.titulo;

          if (objeto.titulo.trim() != "" && objeto.titulo != undefined) {
            this.mostrarInformacion = true;
            texto = texto + "<br/><strong>Título: </strong> <parrafo>" + objeto.titulo + "</parrafo>" + " ";
          }

          if (objeto.estdoc !== "" && objeto.estdoc != ",," && objeto.estdoc != null) {
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

          if (objeto.fechaaprobdesde != null && objeto.fechaaprobdesde != undefined) {
            texto = texto + "<br/><strong>Fecha de Aprobación Desde : </strong>" + this.datePipe.transform(objeto.fechaaprobdesde, "dd/MM/yyyy") + " ";
            this.mostrarInformacion = true;
          }

          if (objeto.fechaaprobhasta != null && objeto.fechaaprobhasta != undefined) {
            texto = texto + "<br/><strong>Fecha de Aprobación Hasta : </strong>" + this.datePipe.transform(objeto.fechaaprobhasta, "dd/MM/yyyy") + " ";
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

          if (objeto.tipodocumento != 0 && objeto.tipodocumento != undefined) {
            texto = texto + "<br/><strong>Tipo de Documento: </strong>" + this.obtenerDescComboTipoDoc(objeto.tipodocumento) + " ";
            this.mostrarInformacion = true;
          }

          if (objeto.periodooblig != "0" && objeto.periodooblig != undefined) {
            if (objeto.periodooblig == "1") {
              texto = texto + "<br/><strong>Periodo de Obligatoriedad: </strong> Si";
            } else if (objeto.periodooblig == "2") {
              texto = texto + "<br/><strong>Periodo de Obligatoriedad: </strong> No";
            } else {
            }
            this.mostrarInformacion = true;
          }

          if (objeto.descripcionarea != "" && objeto.descripcionarea != undefined) {
            texto = texto + "<br/><strong>Equipo Usuario: </strong>" + objeto.descripcionarea + " ";
            this.mostrarInformacion = true;
          }

          if (objeto.motirevision != "" && objeto.motirevision != undefined) {
            texto = texto + "<br/><strong>Motivo de Revisión: </strong>" + this.obtenerDescComboRevDoc(objeto.motirevision) + " ";
            this.mostrarInformacion = true;
          }

          if (objeto.descparticipante != "" && objeto.descparticipante != undefined) {
            texto = texto + "<br/><strong>Participante: </strong>" + objeto.descparticipante + " ";
            this.mostrarInformacion = true;
          }

          if (objeto.idfaseact != "" && objeto.idfaseact != undefined) {
            texto = texto + "<br/><strong>Fase Actual: </strong>" + this.obtenerDescComboFaseAct(objeto.idfaseact);
            this.mostrarInformacion = true;
          }

          if (objeto.idfaseestadoact != "" && objeto.idfaseestadoact != undefined) {
            texto = texto + "<br/><strong>Estado de la Fase Actual: </strong>" + this.obtenerDescComboEstFaseAct(objeto.idfaseestadoact);
            this.mostrarInformacion = true;
          }

          this.mensajeInformacion = this.sanitizer.sanitize(SecurityContext.HTML, texto);
          this.deshabilitarTextoBuscar = true;
        }
        break;

      case 'default':

        this.parametros.idproc = idProceso;
        this.parametros.idalcasgi = idSgi;
        this.parametros.idgeregnrl = idGerencia;

        if (this.idTipoDocu) {
          this.parametros.tipodocumento = this.idTipoDocu;
        }

        this.mostrarInformacion = false; 
        this.excelDocumento.idproceso = this.parametros.idproc;
        this.excelDocumento.idalcasgi = this.parametros.idalcasgi;
        this.excelDocumento.idgeregnrl = this.parametros.idgeregnrl;
        this.excelDocumento.idTipoDoc = Number(this.parametros.idTipoDoc);
        this.parametroBusqueda = "titulodefault";
        this.textoBusqueda = "";

        this.objetoRetornoBusqueda.idProceso = this.parametros.idproc;
       
        this.objetoRetornoBusqueda.idalcasgi = this.excelDocumento.idalcasgi;
        this.objetoRetornoBusqueda.idgeregnrl = this.excelDocumento.idgeregnrl;
        this.objetoRetornoBusqueda.idTipoDoc = this.parametros.tipodocumento;
        
        this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda; 
        this.objetoRetornoBusqueda.parametroId = this.parametroId;
        this.objetoRetornoBusqueda.parametroIdTipoDoc = this.parametroIdTipoDoc;
        this.objetoRetornoBusqueda.parametroRuta = this.parametroRuta;
        this.objetoRetornoBusqueda.activar = this.activar;
        this.objetoRetornoBusqueda.listaNodes = this.listaNodes;
        this.objetoRetornoBusqueda.registros = this.paginacion.registros;
        break;

    }
    
    localStorage.removeItem("objetoRetornoBusqueda");  
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));

    this.service.buscarPorParametrosAvanz(this.parametros, this.paginacion.pagina,
      this.paginacion.registros).subscribe(
        (response: Response) => {
          
          let listadedocumento: BandejaDocumento[] = response.resultado;
          listadedocumento.forEach(documento => {
            if (documento.revision != null) {
              if (documento.estado.v_descons == Constante.ESTADO_DOCUMENTO_APROBADO) {
                documento.idrevision = documento.revision.numero;
                documento.revisionfecha = this.datePipe.transform(documento.revision.fechaAprobacionDocumento, "dd/MM/yyyy");
              } else {
                if (documento.revision.numeroAnterior != null) {
                  documento.idrevision = documento.revision.numeroAnterior + "";
                } else {
                  documento.idrevision = " ";
                }
                documento.revisionfecha =
                  this.datePipe.transform(documento.revision.fechaAprobacionAnterior, "dd/MM/yyyy");
              }
            } else {
              documento.idrevision = " ";
              documento.revisionfecha = " ";
            }
          });
          
          this.items = response.resultado;
          this.paginacion = new Paginacion(response.paginacion);
          this.IndicadorPagina = 0;
          this.valorPaginacion = 0;
          this.loading = false;
        },
        (error) => this.controlarError(error)
      );
  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }
  OnValidaRutaOrigin(Ruta: string, visorPdfSwal) {
    
    let RutaFinal = Ruta;
    if (RutaFinal != null) {
        this.urlPDF1 = RutaFinal;            
        this.objetoBlob = false;
        this.urlPDF = false;       
        this.urlPDF2 = true;       
        visorPdfSwal.show();
    } else {
        this.toastr.warning('No tiene ningún documento para mostrar.', 'Atención', { closeButton: true });
    }
}

OnValidaRutaOrigin1(Ruta: string){
  
  if(Ruta!=null){
    this.apiEndpoint = environment.serviceFileServerEndPoint;
    this.rutaFinal= this.apiEndpoint+Ruta;
    location.href = this.rutaFinal;
    return  location.href;
  }else{
    this.toastr.warning('No tiene ningún documento para mostrar.', 'Atención', { closeButton: true });
  }
}


 //validar si tiene ruta
 OnValidaRuta(Ruta: string, visorPdfSwal) {
  let RutaFinal = Ruta;
  if (RutaFinal != null) {
      this.urlPDF = RutaFinal;
      this.objetoBlob = false;
      this.urlPDF2 = false;
      visorPdfSwal.show();
  } else {
      this.toastr.warning('No tiene ningún documento para mostrar.', 'Atención', { closeButton: true });
  }
}

  
  OnPageChanged(event): void {
    
    if (this.paginaLimpiar) {
      this.objetoRetornoBusqueda.pagina = event.page;
      localStorage.removeItem("objetoRetornoBusqueda");
      localStorage.removeItem("pagRetorno");
      localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));
      localStorage.setItem("pagRetorno", event.page);
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      this.paginacion.pagina = event.page;
      if (this.parametroBusqueda == "avanzada") {
        if (this.IndicadorPagina == 0) {
          this.IndicadorPagina = 0;
          this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz);
        }
      } else {
        if (this.IndicadorPagina == 0) {
          this.IndicadorPagina = 0;
          this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
          this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz);
        }
      }
    }
    this.paginaLimpiar=true;
  }

  OnPageOptionChanged(event): void {
    
    this.objetoRetornoBusqueda.registros = event.rows;
    this.objetoRetornoBusqueda.pagina = 1;
    localStorage.removeItem("objetoRetornoBusqueda");
    localStorage.removeItem("pagRetorno");   
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    localStorage.setItem("pagRetorno", "1");  
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    } 
    this.IndicadorPagina=1; 
    if(this.parametroBusqueda == "avanzada") {
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz);
    } else {
      this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz);
    }
  }

  OnPageChangedReturn(pagina:number): void {
    
    this.paginacion.pagina = pagina;    
    if(this.parametroBusqueda == "avanzada") {
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz);
    } else {
      this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz);
    }
  }

  OnPageOptionChangedReturn(pagina:number, registros:number): void {
    
    this.paginacion.registros = registros;
    
    if (pagina) {
      this.paginacion.pagina = pagina;  
    } else {
      this.paginacion.pagina = 1;  
    }    
      
    if(this.parametroBusqueda == "avanzada") {
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz );
    } else {
      this.objetoBusqAvanz.tipodocumento = this.parametroIdTipoDoc;
      this.getListaBusqueda(this.idProcesoSel, this.idSgiSel, this.idGerenciaSel, this.objetoBusqAvanz );
    }
  }

  controlarError(error) {
    console.error(error); 
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnNuevo(){ 
      sessionStorage.removeItem("listElaboracion");
      sessionStorage.removeItem("listConseso");
      sessionStorage.removeItem("listAprobacion");
      sessionStorage.removeItem("listHomologacion");

      let itemDocumento:EnvioParametros = new EnvioParametros();
      itemDocumento.nuevo = true;
      itemDocumento.edicion = false;
      itemDocumento.rutaAnteriorAnterior = this.rutaAnterior;
      itemDocumento.rutaAnterior = this.rutaActual;

      sessionStorage.setItem("item", JSON.stringify(itemDocumento));
      this.router.navigate([`documento/general/bandejadocumento/editar/registrar-documento`]);
 
  }

  OnModificar(item) {
    sessionStorage.removeItem("listElaboracion");
    sessionStorage.removeItem("listConseso");
    sessionStorage.removeItem("listAprobacion");
    sessionStorage.removeItem("listHomologacion");

    let itemDocumento:EnvioParametros = new EnvioParametros();
    itemDocumento.nuevo = false;
    itemDocumento.edicion = true;
    itemDocumento.rutaAnteriorAnterior = this.rutaAnterior;
    itemDocumento.rutaAnterior = this.rutaActual;
    itemDocumento.parametroPrincipal = item.id;
    sessionStorage.setItem("item", JSON.stringify(itemDocumento));
    this.router.navigate([`documento/general/bandejadocumento/editar/registrar-documento`]);
  } 

  OnExportarXls() {
    if (this.items.length > 0) {
      this.bandejaService.generarExcel(this.parametros).subscribe(function (data) {
        var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var fileURL = URL.createObjectURL(file);
        window.open(fileURL);
      },
        (error) => this.controlarError(error)
      );
      this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
    } else {
      this.toastr.warning('No existen documentos para exportar a Excel', 'Advertencia', { closeButton: true });
    }
  }

  OnExportarPdf(visorPdfSwal1) {
    let mensaje = this.mensajeInformacion;
    if (this.items.length > 0) {
      this.bandejaService.generarPdf(this.parametros).subscribe((data: Blob) => {
        let file = new Blob([data], { type: 'application/pdf' });
        this.objetoBlob = file;
        visorPdfSwal1.show();
      },
        (error) => this.controlarError(error)
      );
      this.toastr.info('Documento generado', 'Confirmación', { closeButton: true });
    } else {
      this.toastr.warning('No existen documentos para exportar a PDF', 'Advertencia', { closeButton: true });
    }
  }

  OnVerFicha(): void{
    let bean: Jerarquia = new Jerarquia();
    bean.idPadre = this.parametroId;
    localStorage.setItem("beanJerarquia", JSON.stringify(bean));
    this.router.navigate([`documento/general/bandejadocumento/consultarFicha/`+Constante.INFORMACION_DOCUMENTADA]);
  }

}
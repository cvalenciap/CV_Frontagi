
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService, ValidacionService, RelacionCoordinadorService } from '../../../services';
import { Estado } from '../../../models/enums/estado';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { RelacionCoordinador } from '../../../models/relacionCoordinador';
import { Response } from '../../../models/response';
import { Constante } from 'src/app/models/enums';
//importamos  consulta de codigo anterior
import { ConsultaCodigoAnteriorcomponents } from 'src/app/modules/bandejadocumento/modales/consulta-codigo-anterior.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Documento } from 'src/app/models/documento';
import { RevisionDocumento } from 'src/app/models/revisiondocumento';
import { validate } from 'class-validator';
import { BusquedaDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento.component';
import { Paginacion, Parametro } from 'src/app/models';
import { Colaborador } from 'src/app/models/colaborador';
import { SessionService } from 'src/app/auth/session.service';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { ModalArbolProcesoComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol-proceso.component';
import { ArbolProceso } from 'src/app/modules/arbol/views/arbol-proceso-component';
import { TreeComponent } from 'angular-tree-component';
import { TreeNode } from 'angular-tree-component/dist/defs/api';

@Component({
  selector: 'bandeja-registro-documento',
  templateUrl: 'components-registro-documento.template.html'
})
export class CRegistroDocumentoComponent implements OnInit {
  @ViewChild('arbolProceso') hijo: ArbolProceso;
  @Input() permisos: any;
  @Input() activar: boolean;
  @Output() extrametododepadre: EventEmitter<any> = new EventEmitter<any>();;
  activartap: boolean;
  /*Modal Consulta Código Anterior*/
  parametroBusqueda: string;
  @Input() idNodo: number;
  @Input() idProceso: number;
  tipoDocumentoGerencia: number;
  bsModalRef: BsModalRef;
  ResulatdoRelacionCord: any[] = [];
  /* codigo seleccionado */
  itemCodigo: number;
  iteracion: number;
  listaJerarquia: any[] = [];
  listaRelacionCoordinador: RelacionCoordinador[];
  listaUltimaCoordinadores: RelacionCoordinador[];
  listaArbolPlano: TreeNode[];
  @ViewChild('tree') treeComponent: TreeComponent;
  @Input() idNodoSeleccionado: number;
  /* datos */
  //listaTipos: Tipo[];
  item: Documento;
  listaTipos: any[];
  consulta: boolean;
  private sub: any;
  errors: any;
  tipoArbol: string;
  invalid: boolean;
  habilitacampo: boolean;
  todosCheck: boolean;
  checkDigital: boolean;
  indicadorDigital: number;
  indicadorSolicitudRevision: string;
  idjerarqua: string;
  tipodocumento: string;
  tipodcumentoid: string;
  procesoparametrodesc: string;
  procesoparametroid: string;
  sgiparametrodesc: string;
  sgiparametroid: string;
  gerenparametrodesc: string;
  gerenparametroid: string;
  //gerenparametroid: number;
  rutaarbol: string;
  items: Documento[];
  paginacion: Paginacion;
  @Input() parametroId: number;
  @Input() parametroIdTipoDoc: number;
  revisionCurso: number;
  periodo: string;
  coordinador: string;
  codigoAnterior: string;
  idCoordinador: string;
  validarDatoCoordinador: boolean;
  listaDatosCoordinador: RelacionCoordinador[];
  indicadorDocumentoActivo: boolean;
  encontro: boolean = false;
  textoEmision: string;
  idTipoGerencia: number;
  idTipoAlcance: number;
  idTipoProceso: number;
  ocultarBusqGerencia: boolean;
  itemDocumento: EnvioParametros;

  rutaAnterior: string;
  rutaAnteriorAnterior: string;
  rutaActual: string;
  datos: RelacionCoordinador
  // @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private serviceRelaCord: RelacionCoordinadorService,
    private route: ActivatedRoute,
    private service: BandejaDocumentoService,
    private serviceParametro: ParametrosService,
    private modalService: BsModalService,
    private servicioValidacion: ValidacionService,
    private serviceRelacion: RelacionCoordinadorService,
    public session: SessionService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.parametroBusqueda = 'tipo';
    this.activar = true;
    this.activartap = false;
    this.consulta = true;
    this.habilitacampo = true;
    this.todosCheck = false;
    this.checkDigital = false;
    this.indicadorDigital = 0;
    this.periodo = "";
    this.tipodocumento = '';
    this.tipodcumentoid = '';
    this.listaTipos = [];
    this.tipoArbol;
    this.idjerarqua = '';
    this.procesoparametrodesc = '';
    this.procesoparametroid;
    this.sgiparametrodesc = '';
    this.sgiparametroid;
    this.gerenparametrodesc = '';
    this.gerenparametroid;
    this.errors = {};
    this.items = [];
    this.rutaarbol = '';
    this.paginacion = new Paginacion({ registros: 100 });
    this.revisionCurso = null;
    this.coordinador = "";
    this.idCoordinador = "";
    this.item = new Documento();
    this.item.estado = new Parametro();
    this.item.estado.v_descons = Constante.ESTADO_DOCUENTO_EMISION;
    this.indicadorSolicitudRevision = null;
    this.listaDatosCoordinador = [];
    this.indicadorDocumentoActivo = false;
    this.ocultarBusqGerencia = true;

    this.rutaActual = this.router.url;
    
    let item = JSON.parse(sessionStorage.getItem("item"));
    console.log("JSON ITEM");
    console.log(item);
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;

    console.log("RGISTRODEDOCUUUUUUU");
    console.log(this.rutaActual);
    console.log(this.rutaAnterior);

  }

  ngOnInit() {
    
    this.gerenparametrodesc = localStorage.getItem("rutadelarbol");
    /*Session   del id de Jerarquia seleccionado del arbol*/
    this.idjerarqua = localStorage.getItem("idjerarquia");
    /*session  Tipo Documento*/
    this.tipodcumentoid = localStorage.getItem("tipodocumento");
    this.tipodocumento = localStorage.getItem("textotipodocumento");

    if (this.gerenparametrodesc != null) {
      this.gerenparametrodesc = this.gerenparametrodesc.substr(0,
        this.gerenparametrodesc.length - this.tipodocumento.length - 1);
    }
    //console.log("aqui__registro");
    //console.log(this.tipodcumentoid);
    /**/

    //Lista del Combo
    //this.item = new Documento();
    //this.obtenerParametros();

    /*
    this.sub = this.route.params.subscribe(params => {
        this.itemCodigo = + params['codigo'];
        */
    this.itemDocumento = JSON.parse(sessionStorage.getItem("item"));
    this.itemCodigo = this.itemDocumento.parametroPrincipal;

    /*Visualizamos los campos Cod. Anterior */
    if (this.itemCodigo > 0) {
      this.activartap = true;
      if (this.activar == true) {
        this.activar = false;
      }
    } else {
      if (this.activar) {
        this.ocultarBusqGerencia = false;
      }
      this.activartap = false;
      this.gerenparametrodesc = localStorage.getItem("rutadelarbol");
      this.idjerarqua = localStorage.getItem("idjerarquia");
      this.tipodcumentoid = localStorage.getItem("tipodocumento");
      this.tipodocumento = localStorage.getItem("textotipodocumento");
      this.gerenparametrodesc = this.gerenparametrodesc.substr(0, this.gerenparametrodesc.length - this.tipodocumento.length - 1);
      if (this.idjerarqua != null) {
        this.obtenerCoordinadorPorGerencia(this.idjerarqua);
      }
      //aqui
      /*if (localStorage.getItem('nodeSeleccionado') !== null && localStorage.getItem('codeTypeDocument') !== null) {
          this.obtenerCodigoDocumento(Number(localStorage.getItem('nodeSeleccionado')), Number(localStorage.getItem('codeTypeDocument')));
      }*/

    }

    this.obtenerTipoJerarquia();


    if (this.idjerarqua != null) {
      this.obtenerColaborador(this.idjerarqua, null);
    }

    localStorage.removeItem("idjerarquia");

    //});

  }

  obtenerColaborador(idGerencia: string, idAlcance: string) {
    let idGerenciaParametro = Number(idGerencia);
    let idAlcanceParametro = (idAlcance != null && idAlcance != undefined) ? Number(idAlcance) : 0;
    this.serviceRelacion.obtenerDatosCoordinador(idGerenciaParametro, idAlcanceParametro).subscribe(
      (response: Response) => {
        
        let datosCoordinador: RelacionCoordinador[] = response.resultado;
        if (datosCoordinador.length > 0) {
          this.validarDatoCoordinador = false;
          for (let i: number = 0; datosCoordinador.length > i; i++) {
            let datos: RelacionCoordinador = datosCoordinador[i];
            this.coordinador = datos.nombreCompletoCoordinador;
            this.idCoordinador = String(datos.idCoordinador);
            let valorDigital = datos.indicadorDocumento;
          }
        } else {
          this.coordinador = "";
          this.idCoordinador = "";
          this.validarDatoCoordinador = true;
          this.toastr.error('No existe un coordinador para la gerencia y alcance seleccionada.', 'Alerta!', { closeButton: true });
        }
      },
      (error) => this.controlarError(error)
    );
  }


  obtenerTipoJerarquia() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let listaTipoJerarquia = response.resultado;
        this.idTipoGerencia = this.serviceParametro.obtenerIdParametro(listaTipoJerarquia, Constante.TIPO_JERARQUIA_GERENCIA);
        this.idTipoAlcance = this.serviceParametro.obtenerIdParametro(listaTipoJerarquia, Constante.TIPO_JERARQUIA_ALCANCE);
        this.idTipoProceso = this.serviceParametro.obtenerIdParametro(listaTipoJerarquia, Constante.TIPO_JERARQUIA_PROCESO);
      },
      (error) => this.controlarError(error)
    );
  }

  obtenerCoordinadorPorGerencia(idGerencia: string) {
    this.indicadorDocumentoActivo = false;
    let idGerenciaParametro = Number(idGerencia);
    let idAlcance: number = 0;
    this.serviceRelacion.obtenerDatosCoordinador(idGerenciaParametro, idAlcance).subscribe(
      (response: Response) => {
        this.listaDatosCoordinador = response.resultado;
        if (this.listaDatosCoordinador.length > 0) {
          //let encontro: boolean = false;
          for (let i: number = 0; this.listaDatosCoordinador.length > i; i++) {
            let datos: RelacionCoordinador = this.listaDatosCoordinador[i];
            if (datos.idAlcance == null) {
              this.validarDatoCoordinador = false;
              this.coordinador = datos.nombreCompletoCoordinador;
              this.idCoordinador = String(datos.idCoordinador);
              this.item.coordinador.idColaborador = Number(this.idCoordinador);
              this.item.coordinador.nombreCompleto = this.coordinador;
              this.indicadorDocumentoActivo = (datos.indicadorDocumento != 0) ? true : false;
              this.encontro = true;
              break;
            }
          }
          if (!this.encontro) {
            this.validarDatoCoordinador = true;
            this.coordinador = "";
            this.idCoordinador = "";
            this.item.coordinador.idColaborador = Number("0");
            this.item.coordinador.nombreCompleto = this.coordinador;
          }
        } else {
          this.validarDatoCoordinador = true;
          this.coordinador = "";
          this.idCoordinador = "";
          this.item.coordinador.idColaborador = Number("0");
          this.item.coordinador.nombreCompleto = this.coordinador;
          this.toastr.error('No existe un coordinador para la gerencia seleccionada.', 'Alerta!', { closeButton: true });
        }
      },
      (error) => this.controlarError(error)
    );
  }

  //Habilitar campo Revisión Obligatorio
  habiliarRevision(): void {
    if (this.todosCheck) {
      this.todosCheck = false;
      this.habilitacampo = true;
      //  this.revisionobligatorio = null;
      this.item.periodo = null;
    } else {
      this.todosCheck = true;
      this.habilitacampo = false;
    }
  }

  //Habilitar campo Indicador de Documento Digital
  habilitarDigital(): void {
    if (this.checkDigital == true) {
      this.checkDigital = false;
      this.indicadorDigital = 0;
    } else {
      this.checkDigital = true;
      this.indicadorDigital = 1;
    }
  }

  Validar(objectForm) {
    (this.item as any).todosCheck = this.todosCheck;
    this.servicioValidacion.validacionSingular(this.item, objectForm, this.errors);
  }

  validarObjeto(objeto, objectForm) {
    (this.item as any).todosCheck = this.todosCheck;
    this.servicioValidacion.validacionSingular(objeto, objectForm, this.errors);
  }

  /*Validar Solo Números */
  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  //Busqueda del modal de arbol
  OnBuscarProceso() {
    //localStorage.removeItem("idProcesoSeleccionado");
    //this.tipoArbol = "120";
    this.tipoArbol = String(this.idTipoProceso);
    //localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: { idNodo: this.procesoparametroid, idProceso: this.tipoArbol, tipoDocumentoGerencia: Number(this.tipodcumentoid) },
      class: 'modal-lg'
    }
    const modalArbol = this.modalService.show(ModalArbolProcesoComponents, config);
    (<ModalArbolProcesoComponents>modalArbol.content).onClose.subscribe(result => {
      let objeto: BandejaDocumento = result;
      this.procesoparametrodesc = objeto.rutaCompleta;
      this.procesoparametroid = objeto.parametroid.toString();
      let tipoDocumento = objeto.parametrodesc;
      this.procesoparametrodesc = this.procesoparametrodesc.substr(0, this.procesoparametrodesc.length - tipoDocumento.length - 1);
    });
  }

  //Buscar del Modal Consulta por codigo anterior
  OnBuscar() {
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id: this.itemCodigo
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ConsultaCodigoAnteriorcomponents, config);
    (<ConsultaCodigoAnteriorcomponents>this.bsModalRef.content).onClose.subscribe(result => {
      //this.busquedaPlan = result;
      //this.OnBuscar();
    });
  }

  onBuscarDocumento() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        //modalService:this.modalService
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(BusquedaDocumentoComponent, config);
    (<BusquedaDocumentoComponent>this.bsModalRef.content).onClose.subscribe(result => {
      //console.log("resultadio de busqueda",result );
      //
      this.extrametododepadre.emit(result);
    });

  }

  OnRegresar() {
    this.router.navigate(['./documento/general/bandejadocumento/editar']);
    //
  }
  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }


  obtenerDatosFrom(): Documento {
    (this.item as any).todosCheck = this.todosCheck;
    this.item.tabName = "general";
    //this.item.revisonobligatoria = this.robligatorio;
    //this.item.tipoDocumento = this.tipodcumentoid;
    
    this.item.tipoDocumento = this.tipodcumentoid;
    this.item.proceso = this.procesoparametroid;
    this.item.gerencia = Number(this.gerenparametroid);
    this.item.revision.iteracion = this.iteracion;

    if (this.item.coordinador != null) {
      if (this.idCoordinador != "") {
        this.item.coordinador.idColaborador = Number(this.idCoordinador);
      }
    } else {
      this.item.coordinador = new Colaborador();
      if (this.idCoordinador != "") {
        this.item.coordinador.idColaborador = Number(this.idCoordinador);
      }
    }

    if (!this.item.gerencia) {
      let idjerarquaN = Number(this.idjerarqua)
      this.item.gerencia = idjerarquaN;
    }

    this.item.alcanceSGI = this.sgiparametroid;
    this.item.indicadorDigital = this.indicadorDigital;
    this.item.indicadorSolicitudRevision = this.indicadorSolicitudRevision;
    //console.log(this.item);
    return this.item;
  }

  OnBuscarSGI() {
    
    if (this.encontro == true) {
      this.toastr.warning('Esta gerencia no tiene alcance relacionado.', 'Atención!', { closeButton: true });
    } else {
      this.tipoArbol = String(this.idTipoAlcance);
      this.parametroBusqueda = "avanzada";
      
      const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
          idNodo: this.sgiparametroid, idProceso: this.tipoArbol,
          listaRelacionCoordinador: this.listaDatosCoordinador,
          tipoDocumentoGerencia: Number(this.tipodcumentoid)
        },
        class: 'modal-lg'
      }
      const modalArbol = this.modalService.show(ModalArbolProcesoComponents, config);
      (<ModalArbolProcesoComponents>modalArbol.content).onClose.subscribe(result => {
        let objeto: BandejaDocumento = result;
        
        this.sgiparametrodesc = objeto.rutaCompleta;
        this.sgiparametroid = objeto.parametroid.toString();
        let tipoDocumento = objeto.parametrodesc;
        //this.sgiparametrodesc = this.sgiparametrodesc.substr(0, this.sgiparametrodesc.length-tipoDocumento.length-1);
        this.mostrarCoordinadorSeleccionado();
      });
    }



  }



  //}

  mostrarCoordinadorSeleccionado() {
    let idGerencia = Number(this.idjerarqua);
    let idAlcance = Number(this.sgiparametroid);
    this.serviceRelacion.obtenerDatosCoordinador(idGerencia, idAlcance).subscribe(
      (response: Response) => {

        let listaAlcanceSeleccionado: RelacionCoordinador[] = response.resultado;
        if (listaAlcanceSeleccionado.length == 1) {
          for (let i: number = 0; listaAlcanceSeleccionado.length > i; i++) {
            let objetoSeleccionado: RelacionCoordinador = listaAlcanceSeleccionado[i];
            this.validarDatoCoordinador = false;
            this.coordinador = objetoSeleccionado.nombreCompletoCoordinador;
            this.idCoordinador = String(objetoSeleccionado.idCoordinador);
            this.item.coordinador.idColaborador = Number(this.idCoordinador);
            this.item.coordinador.nombreCompleto = this.coordinador;
            this.indicadorDocumentoActivo = (objetoSeleccionado.indicadorDocumento != 0) ? true : false;
            break;
          }
        }
      },
      (error) => this.controlarError(error)
    );
  }

  OnBuscarGerencia() {
    localStorage.removeItem("idProcesoSeleccionado");
    //this.tipoArbol = "122";
    this.tipoArbol = String(this.idTipoGerencia);
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
      /* setea el input tipo documento */
      let objeto: BandejaDocumento = result;

      // Descripcion de la Ruta
      this.gerenparametrodesc = objeto.rutaCompleta;
      //ID de la Ruta
      this.gerenparametroid = String(objeto.parametroid);
      //Tipo de documento ID
      this.tipodcumentoid = String(objeto.tipodocumento);
      this.tipodocumento = objeto.parametrodesc;

      this.gerenparametrodesc = this.gerenparametrodesc.substr(0,
        this.gerenparametrodesc.length - this.tipodocumento.length - 1);
      //this.obtenerColaborador(this.gerenparametroid, this.sgiparametroid);
      /* setea el input tipo documento */
      /*for(let item: number = 0; item<this.listaTipos.length; item++ ){
          if (this.listaTipos[item].idconstante == this.tipodcumentoid){
              let respo = this.listaTipos[item];
              //console.log("aqui__registro_del_FOR");
              //console.log(respo);
              //Mostramos el campo v_descons de la tabla
              this.tipodocumento = respo.v_descons;
          break;
          }
}*/
      //console.log("Tipo DOC de La LUPITA");
      //console.log(this.tipodocumento);
    });
  }
  /*obtenerCodigoDocumento(codigoGerencia: number, codigoTipoDocumento: number) {
this.service.generarCodigoDocumento(codigoGerencia, codigoTipoDocumento).subscribe((responseObject: Response) => {
  this.item.codigo = String(responseObject.resultado);
}, (error) => {
  this.item.codigo = '';
  const errorResponse: Response = error.error;
  this.toastr.error(errorResponse.error.mensaje, 'Detalle de error', {closeButton: true});
});
}*/
}

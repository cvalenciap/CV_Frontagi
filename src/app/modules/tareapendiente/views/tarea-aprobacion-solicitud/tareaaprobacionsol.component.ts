import { AfterViewInit, Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService, ParametrosService } from '../../../../services';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { Arbol } from '../../../../models/arbol';
import { BusquedaAprobacionSolicitudComponent } from 'src/app/modules/tareapendiente/modals/tarea-aprobacion-solicitud/busqueda-aprobacion-solicitud.component';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { Documento } from 'src/app/models/documento';
import { RevisionDocumentoService } from '../../../../services/impl/revisiondocumentos.service';
import { Parametro, RevisionDocumento } from '../../../../models';
import { Constante } from '../../../../models/enums';
import { SessionService } from 'src/app/auth/session.service';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { ViewChild } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-tareaaprobacionsol',
  templateUrl: 'tareaaprobacionsol.template.html',
  styleUrls: ['tareaaprobacionsol.component.scss'],
})
export class TareaAprobacionSolComponent implements OnInit, AfterViewInit {
  @ViewChild('pageOption') pageOption: PaginacionSetComponent;
  public numeroSolicitud: string;
  public interruptorBuscar: boolean;
  public claseCirculoAlerta: string;
  public paginacion: Paginacion;
  public listaRevisionDocumento: RevisionDocumento[];
  public revisionDocumentoSeleccionado: RevisionDocumento;
  parametrosBusquedaAvanzada: Map<string, any>;
  parametrosBusquedaAvanzadaRetorno: Map<string, any>;
  private parametroPlazos: number;
  textoBusqueda: string;
  parametroBusqueda: string;
  selectedRow: number;
  itemCodigo: number;
  loading: boolean;
  item: Documento;
  private sub: any;
  selectedObject: Arbol;
  bsModalRef: BsModalRef;
  descripcionMostrar: string;
  filtroBusqueda: string;
  filtroBusquedaRet: string;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  codigo: string;
  titulo: string;
  nombres: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  ocultarColumna: boolean;
  idUsuarioLogueo: number;
  tipoBusqueda: number;
  objetoRetornoBusqueda:RetornosBusqueda;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  IndicadorPagina:number;
  paginaRetorno:number;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private revisionDocumento: RevisionDocumentoService,
    private router: Router,
    private route: ActivatedRoute,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private service: BandejaDocumentoService,
    private parametroService: ParametrosService,
    public session: SessionService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({ registros: 10 });
    this.selectedRow = -1;
    this.descripcionMostrar = "";
    this.filtroBusqueda = "numSolicitud";
    this.ocultarColumna = false;
    this.filtroBusquedaRet = "";
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    this.parametrosBusquedaAvanzada = new Map<string, any>();
    this.parametrosBusquedaAvanzadaRetorno = new Map<string, any>();
    this.valorPaginacion = 0;
    this.IndicadorPagina = 0; 
  }

  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  ngOnInit() {
    
    this.numeroSolicitud = '';
    this.mensajeAlerta = "";
    this.mostrarAlerta = false;
    this.interruptorBuscar = true;

    if (this.session.User != null) {
      this.idUsuarioLogueo = this.session.User.codFicha;
    }

    if (localStorage.getItem("objetoRetornoBusqueda")!=undefined || localStorage.getItem("objetoRetornoBusqueda")!=null) {
      
      this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
            
      if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
        this.OnBuscarRetorno();
      } else if(this.objetoRetornoBusqueda.tipoBusqueda == 2){
        this.busquedaAvanzadaRetorno();
      }
      
      if (this.paginacion.registros > 10) {
        this.paginaRetorno = this.paginacion.pagina;
        this.pageOption.change(this.paginacion.registros);
        if (this.paginaRetorno > 1) {
          this.OnPageChangedReturn(this.paginaRetorno, this.paginacion.registros);
        }
      } else{
        this.OnPageChangedReturn(this.paginacion.pagina, this.paginacion.registros);
      }

    }else{
      this.textoBusqueda = '';
      this.parametroBusqueda = 'numSolicitud';
      this.tipoBusqueda = 1;
      this.buscar();
    }

  }

  busquedaSimple() {
    this.paginacion.pagina = 1;
    this.valorPaginacion = 1;
    this.tipoBusqueda = 1;
    this.buscar();
  }

  buscar() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    switch (this.parametroBusqueda) {
      case 'numSolicitud':
        texto = texto + "<br/><strong>Código de Documento: </strong>" + this.textoBusqueda;
        break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }

    this.obtenerSolicitudes(this.obtenerParametros(null));
  }

  OnBuscarRetorno() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda = this.objetoRetornoBusqueda.textoBusqueda;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;
    this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;

    
    switch (this.parametroBusqueda) {
      case 'numSolicitud':
        texto = texto + "<br/><strong>Código de Documento: </strong>" + this.textoBusqueda;
        break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }

    this.obtenerSolicitudes(this.obtenerParametros(null));
  }

  obtenerParametros(parametrosAdicionales: Map<string, any>) {
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    let parametros: Map<string, any> = new Map();

    parametros.set('pagina', this.paginacion.pagina).set('registros', this.paginacion.registros);
    parametros.set('estado', ',141,');
    parametros.set('idColaborador', this.idUsuarioLogueo);  

    this.objetoRetornoBusqueda.pagina = this.paginacion.pagina;
    this.objetoRetornoBusqueda.registros = this.paginacion.registros;
    this.objetoRetornoBusqueda.tipoBusqueda = this.tipoBusqueda;
    this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;

    if (parametrosAdicionales !== null) {
      parametrosAdicionales.forEach((value, key) => {
        if (value) {
          parametros = parametros.set(key, value);
          this.objetoRetornoBusqueda.parametrosMap.push({key: key, value: value});
        }
      });
    } else {
      if (this.parametroBusqueda === 'numSolicitud') {parametros.set('codigoDoc', this.textoBusqueda); this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda; }
    }
   
    localStorage.removeItem("objetoRetornoBusqueda"); 
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));
    this.parametrosBusquedaAvanzadaRetorno = parametros;
    return parametros;
  }

  obtenerSolicitudes(parametrosFiltro: Map<string, any>) {
    this.loading = true;
    this.parametroService.obtenerParametroPadre(Constante.PLAZOS).subscribe((responseObject: Response) => {
      const response: Parametro[] = responseObject.resultado;
      let valor = this.parametroService.obtenerValorParametro(response, Constante.PLAZO_APROBACION);
      this.parametroPlazos = Number(valor);

      this.revisionDocumento.obtenerTareaAprobar(parametrosFiltro, this.paginacion.pagina, this.paginacion.registros)
        .subscribe((responseObject: Response) => {
          this.listaRevisionDocumento = responseObject.resultado;
          this.paginacion = new Paginacion(responseObject.paginacion);
          
          this.listaRevisionDocumento.forEach((elementoRevisionDocumento) => {
            
            elementoRevisionDocumento.estiloPlazo = this.validarDiaDiferencia(this.obtenerDiferenciaFechaActual(new Date(elementoRevisionDocumento.fechaPlazoAprob)));
          });
          this.valorPaginacion = 0;
          this.IndicadorPagina = 0;
          this.loading = false;
        }, (error) => {
          console.log(error);
        });
    }, (error) => {
      console.log('Error al obtener plazas => ', error);
    });

  }

  limpiar() {
    localStorage.removeItem("objetoRetornoBusqueda");
    this.interruptorBuscar = true;
    this.textoBusqueda = '';
    this.parametroBusqueda = 'numSolicitud';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.tipoBusqueda = 1;
    if (this.session.User != null) {
      this.idUsuarioLogueo = this.session.User.codFicha;
    }
    this.obtenerSolicitudes(this.obtenerParametros(null));
    this.mensajeAlerta = '';
    this.mostrarAlerta = false;
  }

  OnGuardar() {
    this.service.guardar(this.item).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
        this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
      }
    );
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
    this.revisionDocumentoSeleccionado = obj;

    if (this.revisionDocumentoSeleccionado.id != null) {
      localStorage.setItem("idRevisionSeleccionado", this.revisionDocumentoSeleccionado.id.toString());
    }

    if (this.revisionDocumentoSeleccionado.documento.id != null) {
      localStorage.setItem("idDocumentoSeleccionado", this.revisionDocumentoSeleccionado.documento.id.toString());
    }

    if (this.revisionDocumentoSeleccionado.rutaDocumt != null) {
      localStorage.setItem("rutaDocumentoSeleccionado", this.revisionDocumentoSeleccionado.rutaDocumt.toString());
    }
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  abrirBusquedaAvanzada(): void {
    this.filtroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
      class: 'modal-md'
    };
    this.bsModalRef = this.modalService.show(BusquedaAprobacionSolicitudComponent, config);
    (<BusquedaAprobacionSolicitudComponent>this.bsModalRef.content).onClose.subscribe(parametros => {
      this.parametrosBusquedaAvanzada = parametros;
      this.paginacion.pagina = 1;
      this.tipoBusqueda = 2;
      this.busquedaAvanzada(parametros);
    });
  }

  busquedaAvanzada(parametrosModal) {
    let texto: string = "<strong>Busqueda Por: </strong>";

    let busquedaCodigoDoc: string = parametrosModal.get("codigoDoc");
    if (busquedaCodigoDoc != null && busquedaCodigoDoc != "") {
      texto = texto + "<br/><strong>Código del Documento: </strong>" + busquedaCodigoDoc + " ";
    }

    let busquedaTituloDoc: string = parametrosModal.get("tituloDoc");
    if (busquedaTituloDoc != null && busquedaTituloDoc != "") {
      texto = texto + "<br/><strong>Título de Documento: </strong>" + busquedaTituloDoc + " ";
    }

    let busquedaNombreSolic: string = parametrosModal.get("nombres");
    if (busquedaNombreSolic != null && busquedaNombreSolic != "") {
      texto = texto + "<br/><strong>Nombres del Solicitante: </strong>" + busquedaNombreSolic + " ";
    }

    let busquedaApePatSolic: string = parametrosModal.get("apellidoPaterno");
    if (busquedaApePatSolic != null && busquedaApePatSolic != "") {
      texto = texto + "<br/><strong>Apellido Paterno del Solicitante: </strong>" + busquedaApePatSolic + " ";
    }


    let busquedaApeMatSolic: string = parametrosModal.get("apellidoMaterno");
    if (busquedaApeMatSolic != null && busquedaApeMatSolic != "") {
      texto = texto + "<br/><strong>Apellido Materno del Solicitante: </strong>" + busquedaApeMatSolic;
    }

    if (busquedaCodigoDoc == undefined && busquedaTituloDoc == undefined &&
      busquedaNombreSolic == undefined && busquedaApePatSolic == undefined && busquedaApeMatSolic == undefined) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }

    this.obtenerSolicitudes(this.obtenerParametros(parametrosModal));
  }

  busquedaAvanzadaRetorno() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    let parametrosModal: Map<string, any> = new Map();

    this.objetoRetornoBusqueda.parametrosMap.forEach(parametrosMap => {
      if (parametrosMap.value) {
        parametrosModal = parametrosModal.set(parametrosMap.key, parametrosMap.value);
      }
    });
    this.parametrosBusquedaAvanzada = parametrosModal;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;
    this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;
    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;

    let busquedaCodigoDoc: string = parametrosModal.get("codigoDoc");
    if (busquedaCodigoDoc != null && busquedaCodigoDoc != "") {
      texto = texto + "<br/><strong>Código del Documento: </strong>" + busquedaCodigoDoc + " ";
    }

    let busquedaTituloDoc: string = parametrosModal.get("tituloDoc");
    if (busquedaTituloDoc != null && busquedaTituloDoc != "") {
      texto = texto + "<br/><strong>Título de Documento: </strong>" + busquedaTituloDoc + " ";
    }

    let busquedaNombreSolic: string = parametrosModal.get("nombres");
    if (busquedaNombreSolic != null && busquedaNombreSolic != "") {
      texto = texto + "<br/><strong>Nombres del Solicitante: </strong>" + busquedaNombreSolic + " ";
    }

    let busquedaApePatSolic: string = parametrosModal.get("apellidoPaterno");
    if (busquedaApePatSolic != null && busquedaApePatSolic != "") {
      texto = texto + "<br/><strong>Apellido Paterno del Solicitante: </strong>" + busquedaApePatSolic + " ";
    }


    let busquedaApeMatSolic: string = parametrosModal.get("apellidoMaterno");
    if (busquedaApeMatSolic != null && busquedaApeMatSolic != "") {
      texto = texto + "<br/><strong>Apellido Materno del Solicitante: </strong>" + busquedaApeMatSolic;
    }

    if (busquedaCodigoDoc == undefined && busquedaTituloDoc == undefined &&
      busquedaNombreSolic == undefined && busquedaApePatSolic == undefined && busquedaApeMatSolic == undefined) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }

    this.obtenerSolicitudes(this.obtenerParametros(parametrosModal));
  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  pageChanged(event): void {
    this.paginacion.pagina = event.page;

    if (this.tipoBusqueda == 1) {
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      if (this.IndicadorPagina == 0) {
        this.IndicadorPagina = 0;
        this.buscar();
      }
    } else if (this.tipoBusqueda == 2) {
      if (this.IndicadorPagina == 0) {
        this.IndicadorPagina = 0;
        this.busquedaAvanzada(this.parametrosBusquedaAvanzada);
      }
    }
    
  }

  OnPageChangedReturn(pagina:number, registros:number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
      this.buscar();
    } else if (this.objetoRetornoBusqueda.tipoBusqueda == 2) {
      this.parametrosBusquedaAvanzadaRetorno.set('pagina', this.paginacion.pagina);
      this.busquedaAvanzada(this.parametrosBusquedaAvanzadaRetorno);
    }
  }

  pageOptionChanged(event): void {

    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.IndicadorPagina=1;

    if (this.tipoBusqueda == 1) {
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      } 
      this.buscar();
    } else if (this.tipoBusqueda == 2) {
      this.busquedaAvanzada(this.parametrosBusquedaAvanzada);
    }

  }

  validarInterruptor() {
    if (this.numeroSolicitud !== '') {
      this.interruptorBuscar = false;
    } else {
      this.interruptorBuscar = true;
    }
  }

  obtenerDiferenciaFechaActual(fecha: Date) {
    const fechaActual: Date = new Date();
    const diferencia = fecha.getTime() - fechaActual.getTime();
    return Math.round(diferencia / (1000 * 60 * 60 * 24));
  }

  validarDiaDiferencia(numeroDias: number) {
    
    if (numeroDias >= this.parametroPlazos) {
      this.claseCirculoAlerta = 'alertaCirculoVerde';
    } else if (numeroDias < this.parametroPlazos && numeroDias > 0) {
      this.claseCirculoAlerta = 'alertaCirculoAmarillo';
    } else if (numeroDias <= 0) {
      this.claseCirculoAlerta = 'alertaCirculoRojo';
    } else {
      this.claseCirculoAlerta = 'alertaCirculoDefault';
    }
    return this.claseCirculoAlerta;
  }

  OnModificar(codigo): void {
    let itemAprobacion: EnvioParametros = new EnvioParametros();
    itemAprobacion.edicion = true;
    itemAprobacion.nuevo = false;
    itemAprobacion.parametroPrincipal = codigo;
    sessionStorage.setItem("item", JSON.stringify(itemAprobacion));
    this.router.navigate([`documento/tareapendiente/AprobarSolicitud/detalle`]);
  }

}

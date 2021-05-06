import { AfterViewInit, Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../../../services';
import { Tipo } from '../../../../../models/tipo';
import { Estado } from '../../../../../models/enums/estado';
import { BandejaDocumento } from '../../../../../models/bandejadocumento';
import { Response } from '../../../../../models/response';
import { Paginacion } from '../../../../../models/paginacion';
import { Arbol } from '../../../../../models/arbol';
import { BusquedaConocimientoComponent } from 'src/app/modules/tareapendiente/modals/tarea-conocimiento/busqueda-conocimiento.component';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TareasPendientesMockService } from 'src/app/services/mocks/tareas-pendientes/tareaspendientes.mock';
import { Documento } from 'src/app/models';
import { Solicitud } from '../../../../../models/solicitud';
import { TareaService } from '../../../../../services/impl/tarea.service';
import { BusquedaSolicitudCancelComponent } from '../../../modals/tarea-cancelacion/busqueda-solicitud-cancel.component';
import { Cancelacion } from 'src/app/models/cancelacion';
import { ModalRechazoSolicitudCancelacionComponent } from '../../../modals/modal-rechazo-solicitud-cancelacion/modal-rechazo-solicitud-cancelacion.component';
import { DomSanitizer } from '@angular/platform-browser';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { SessionService } from 'src/app/auth/session.service';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { ViewChild } from '@angular/core';
declare var jQuery: any;

@Component({
  selector: 'app-aprobacioncancelacion',
  templateUrl: 'aprobacioncancelacion.template.html',
  styleUrls: ['aprobacioncancelacion.component.scss'],
  providers: [BandejaDocumentoService]
})
export class AprobacionCancelacionComponent implements OnInit, AfterViewInit {
  @ViewChild('pageOption') pageOption: PaginacionSetComponent;
  itemCodigo: number;
  selectedRow: number;
  public textoBusqueda: string;
  public interruptorBusqueda: boolean;
  public loading: boolean;
  public parametroBusqueda: string;
  public paginacion: Paginacion;
  listaTipos: Tipo[];
  item: Documento;
  private sub: any;
  selectedObject: Solicitud;
  items: BandejaDocumento[];
  bsModalRef: BsModalRef;
  public solicitudesCancelacion: Cancelacion[];
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  urlPDF: any;
  parametrosBusquedaAvanzada: Map<string, any>;
  parametrosBusquedaAvanzadaRetorno: Map<string, any>;
  tipoBusqueda: number;
  objetoRetornoBusqueda:RetornosBusqueda;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  IndicadorPagina: number;
  paginaRetorno: number;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,    
    private tareasPendientesService: TareasPendientesMockService,
    private modalService: BsModalService,
    private tareaService: TareaService,
    private sanitizer: DomSanitizer,
    public session: SessionService,
    private spinner: NgxSpinnerService
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
    this.items = [];
    this.paginacion = new Paginacion({ registros: 10 });
    this.mostrarAlerta = false;
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    localStorage.removeItem("indCancelacion");
    this.valorPaginacion = 0;
    this.IndicadorPagina = 0;
  }


  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  ngOnInit() {



    this.solicitudesCancelacion = [];

    if (localStorage.getItem("objetoRetornoBusqueda") != undefined || localStorage.getItem("objetoRetornoBusqueda") != null) {

      this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));

      if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
        this.OnBuscarRetorno();
      } else if (this.objetoRetornoBusqueda.tipoBusqueda == 2) {
        this.busquedaAvanzadaRetorno();
      }

      if (this.paginacion.registros > 10) {
        this.paginaRetorno = this.paginacion.pagina;
        this.pageOption.change(this.paginacion.registros);
        if (this.paginaRetorno > 1) {
          this.OnPageChangedReturn(this.paginaRetorno, this.paginacion.registros);
        }
      } else {
        this.OnPageChangedReturn(this.paginacion.pagina, this.paginacion.registros);
      }

    } else {
      this.textoBusqueda = '';
      this.parametroBusqueda = 'codigo-documento';
      this.tipoBusqueda = 1;
      this.buscar();
    }

    sessionStorage.removeItem("eleccionAprobador");
    sessionStorage.setItem('eleccionAprobador', 'AproCancel');
  }

  obtenerTareasPendientes() {
    this.loading = true;
    this.tareasPendientesService.obtenerConocimientoRevision().subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }


  onRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }

  controlarError(error) {
    this.spinner.hide();
    this.toastr.error('Error al ejecutar el servicio', 'Error', { closeButton: true });
    console.error(error);
  }

  onModificar(cancelacion: Cancelacion): void {
    localStorage.setItem("indCancelacion", "2");
    localStorage.setItem("indCancelacionSustento","5")
    let itemAprobacion: EnvioParametros = new EnvioParametros();
    itemAprobacion.edicion = true;
    itemAprobacion.nuevo = false;
    itemAprobacion.parametroPrincipal = cancelacion.idSolicitudCancelacion;
    sessionStorage.setItem("item", JSON.stringify(itemAprobacion));
    this.router.navigate([`documento/tareapendiente/cancelaciones/AprobacionCancel/registro`]);
  }

  abrirBusquedaAvanzada() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        indicador: 2,
        titulo: 'Busqueda Aprobación de Cancelación'
      },
      class: 'modal-md'
    };
    this.bsModalRef = this.modalService.show(BusquedaSolicitudCancelComponent, config);
    (<BusquedaSolicitudCancelComponent>this.bsModalRef.content).onClose.subscribe(parametrosModal => {
      this.parametrosBusquedaAvanzada = parametrosModal;
      this.paginacion.pagina = 1;
      this.tipoBusqueda = 2;
      this.busquedaAvanzada(parametrosModal);

    });
  }

  busquedaAvanzada(parametrosModal) {
    let texto: string = "<strong>Busqueda Por: </strong>";

    let busquedaCodigoDoc: string = parametrosModal.get("codigoDocumento");
    if (busquedaCodigoDoc != null && busquedaCodigoDoc != "") {
      texto = texto + "<br/><strong>Código de Documento: </strong>" + busquedaCodigoDoc + " ";
    }
    let busquedaCodigoSoli: string = parametrosModal.get("codigoSolicitud");
    if (busquedaCodigoSoli != null && busquedaCodigoSoli != "") {
      texto = texto + "<br/><strong>Número de Solicitud: </strong>" + busquedaCodigoSoli + " ";
    }

    let busquedaTituloDoc: string = parametrosModal.get("tituloDocumento");
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

    if (busquedaCodigoDoc == undefined && busquedaCodigoSoli == undefined && busquedaTituloDoc == undefined &&
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

    let busquedaCodigoDoc: string = parametrosModal.get("codigoDocumento");
    if (busquedaCodigoDoc != null && busquedaCodigoDoc != "") {
      texto = texto + "<br/><strong>Código de Documento: </strong>" + busquedaCodigoDoc + " ";
    }
    let busquedaCodigoSoli: string = parametrosModal.get("codigoSolicitud");
    if (busquedaCodigoSoli != null && busquedaCodigoSoli != "") {
      texto = texto + "<br/><strong>Número de Solicitud: </strong>" + busquedaCodigoSoli + " ";
    }

    let busquedaTituloDoc: string = parametrosModal.get("tituloDocumento");
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

    if (busquedaCodigoDoc == undefined && busquedaCodigoSoli == undefined && busquedaTituloDoc == undefined &&
      busquedaNombreSolic == undefined && busquedaApePatSolic == undefined && busquedaApeMatSolic == undefined) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }

    this.obtenerSolicitudes(this.obtenerParametros(parametrosModal));
  }

  obtenerParametros(parametrosAdicionales: Map<string, any>) {
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    let parametros: Map<string, any> = new Map();
    parametros.set('pagina', this.paginacion.pagina).set('registros', this.paginacion.registros);

    this.objetoRetornoBusqueda.pagina = this.paginacion.pagina;
    this.objetoRetornoBusqueda.registros = this.paginacion.registros;
    this.objetoRetornoBusqueda.tipoBusqueda = this.tipoBusqueda;
    this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;

    if (parametrosAdicionales !== null) {
      parametrosAdicionales.forEach((value, key) => {
        if (value) {
          parametros = parametros.set(key, value);
          this.objetoRetornoBusqueda.parametrosMap.push({ key: key, value: value });
        }
      });
    } else {
      if (this.parametroBusqueda === 'codigo-documento') { parametros.set('codigoDocumento', this.textoBusqueda); this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda; }
      if (this.parametroBusqueda === 'codigo-solicitud') { parametros.set('codigoSolicitud', this.textoBusqueda); this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda; }
      if (this.parametroBusqueda === 'titulo-documento') { parametros.set('tituloDocumento', this.textoBusqueda); this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda; }
    }
    localStorage.removeItem("objetoRetornoBusqueda");
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));
    this.parametrosBusquedaAvanzadaRetorno = parametros;
    return parametros;
  }

  obtenerSolicitudes(parametros: Map<string, any>) {
    this.loading = true;
    this.tareaService.obtenerListaAprobacionCancelacion(parametros).subscribe((responseObject: Response) => {
      this.solicitudesCancelacion = responseObject.resultado;
      this.paginacion = new Paginacion(responseObject.paginacion);
      this.valorPaginacion = 0;
      this.IndicadorPagina = 0;
      this.loading = false;
    }, (errorResponse: Response) => {
      this.loading = false;
      console.log('Error obteniendo solicitudes => ', errorResponse.error);
    });
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

      case 'codigo-documento':
        texto = texto + "<br/><strong>Código de Documento: </strong>" + this.textoBusqueda;
        break;
      case 'codigo-solicitud':
        texto = texto + "<br/><strong>Número de Solicitud: </strong>" + this.textoBusqueda;
        break;
      case 'titulo-documento':
        texto = texto + "<br/><strong>Título de Documento: </strong>" + this.textoBusqueda;
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

      case 'codigo-documento':
        texto = texto + "<br/><strong>Código del Documento: </strong>" + this.textoBusqueda;
        break;
      case 'codigo-solicitud':
        texto = texto + "<br/><strong>Número de Solicitud: </strong>" + this.textoBusqueda;
        break;
      case 'titulo-documento':
        texto = texto + "<br/><strong>Título del Documento: </strong>" + this.textoBusqueda;
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

  onPageChanged(event): void {
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

  OnPageChangedReturn(pagina: number, registros: number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
      this.buscar();
    } else if (this.objetoRetornoBusqueda.tipoBusqueda == 2) {
      this.parametrosBusquedaAvanzadaRetorno.set('pagina', this.paginacion.pagina);
      this.busquedaAvanzada(this.parametrosBusquedaAvanzadaRetorno);
    }
  }

  onPageOptionChanged(event): void {
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

  obtenerParametrosPaginacion() {

    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;

    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  ingresoTexto(event) {
    const key = window.event ? event.which : event.keyCode;
    if (this.parametroBusqueda === 'codigo-solicitud') {
      if (key < 48 || key > 57) {
        event.preventDefault();
      }
    }
  }

  limpiar() {
    localStorage.removeItem("objetoRetornoBusqueda");
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigo-documento';
    this.tipoBusqueda = 1;
    this.obtenerSolicitudes(this.obtenerParametros(null));
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }

  buscarRutaDocumento(cancelacion: Cancelacion, visorPdfSwal: any, event: any) {
    this.spinner.show();
    this.tareaService.obtenerRutaDocCopiaControlada(cancelacion.idDocumento).subscribe(
      (response: Response) => {
        this.spinner.hide();
        let ruta: string = response.resultado;
        if (ruta != null) {
          this.urlPDF = ruta;
          visorPdfSwal.show();
          event.stopPropagation();
        } else {
          this.toastr.error('El documento no cuenta con el archivo para visualización', 'Mensaje', { closeButton: true });
        }
      },
      (error) => this.controlarError(error)
    );
  }



}

import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService} from '../../../../services';
import { BandejaDocumento} from '../../../../models/bandejadocumento';
import { Response} from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BajarDocumentoCanceladoComponents } from 'src/app/modules/bandejadocumento/modales/bajar-documento-cancelado.component';
import { DomSanitizer } from '@angular/platform-browser';
import { GeneralService } from 'src/app/services/impl/general.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { TareaService } from 'src/app/services/impl/tarea.service';
import { Cancelacion } from 'src/app/models/cancelacion';
import { DatePipe } from '@angular/common';


@Component({
  selector: 'reporteDocCancelados',
  templateUrl: 'reporteDocCancelados.template.html',  
  styleUrls: ['reporteDocCancelados.component.scss'],
  providers: [BandejaDocumentoService]
})
export class BandejaReporteDocCanceladosComponent implements OnInit {
  [x: string]: any;
  selectedObject: BandejaDocumento;
  loading: boolean;
  paginacion: Paginacion;
  selectedRow: number;
  bsModalRef: BsModalRef;
  selectedFilter: string;
  estadosValidos:string;
  reporteMap: Map<string, any>;    
  busquedaDocumentoCancelado: BandejaDocumento;
  textoBusqueda: string;
  mensajeAlerta: string;
  public solicitudesCancelacion: Cancelacion [];
  descripcionMostrar: string;
  mostrarAlerta: boolean;
  parametroBusqueda:string;
  listaEstadosDocumento:any[];
  tipoBusqueda:number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  parametroBusquedaIni: string;
  textoBusquedaIni: string;
  IndicadorPagina:number;
  
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private generalService:GeneralService,
              private route: ActivatedRoute,
              private service: BandejaDocumentoService,
              private modalService: BsModalService,
              private datePipe: DatePipe,
              private tareaService: TareaService,
              private spinner: NgxSpinnerService,
              private sanitizer: DomSanitizer) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.parametrosBusquedaAvanzada = new Map<string,any>();
    this.valorPaginacion = 0;
    this.IndicadorPagina = 0;     
    this.reporteMap == new Map();
  }

  ngOnInit() {
    
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.textoBusqueda = '';
    this.parametroBusqueda = 'codigoDocumento';
    this.tipoBusqueda = 1;
    this.buscar();
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
      case 'codigoDocumento':
        texto = texto + "<br/><strong>Código de Documento: </strong>" + this.textoBusqueda;
        break;
      case 'tituloDocumento':
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

  obtenerParametros(parametrosAdicionales: Map<string, any>) {
    let parametros: Map<string, any> = new Map();
    parametros.set('pagina', this.paginacion.pagina).set('registros', this.paginacion.registros);

    this.parametroBusquedaIni = this.parametroBusqueda;

    if (parametrosAdicionales !== null) {
      parametrosAdicionales.forEach((value, key) => {
        if (value) {
          parametros = parametros.set(key, value);
        }
      });
    } else {
      if (this.parametroBusqueda === 'codigoDocumento') { parametros.set('codigoDocumento', this.textoBusqueda); this.textoBusquedaIni = this.textoBusqueda; }
      if (this.parametroBusqueda === 'tituloDocumento') { parametros.set('tituloDocumento', this.textoBusqueda); this.textoBusquedaIni = this.textoBusqueda; }
    }
    parametros.set('estadoDoc', 117);
    return parametros;
  }

  obtenerSolicitudes(parametros: Map<string, any>) {
    this.loading = true;
    this.reporteMap = parametros;
    this.tareaService.obtenerSolicitudesReporte(parametros).subscribe((responseObject: Response) => {
      this.solicitudesCancelacion = responseObject.resultado;
      this.solicitudesCancelacion.forEach(Cancelacion => {
        if (Cancelacion.fechaSolicitud != null) { Cancelacion.fechaSolicitud = new Date(Cancelacion.fechaSolicitud); }
        if (Cancelacion.fechaAprobacion != null) { Cancelacion.fechaAprobacion = new Date(Cancelacion.fechaAprobacion); }
        if (Cancelacion.fechaCancelacion != null) { Cancelacion.fechaCancelacion = new Date(Cancelacion.fechaCancelacion); }
      });
      this.paginacion = responseObject.paginacion;
      this.IndicadorPagina = 0;
      this.valorPaginacion = 0;
      this.loading = false;
    }, (error) => this.controlarError(error));

  }

  abrirBusquedaAvanzada(){
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    const modalBusqueda = this.modalService.show(BajarDocumentoCanceladoComponents, config);
    (<BajarDocumentoCanceladoComponents>modalBusqueda.content).onClose.subscribe(parametrosModal => {
      this.parametrosBusquedaAvanzada = parametrosModal;
      this.tipoBusqueda = 2;
      this.paginacion.pagina = 1;
      this.busquedaAvanzada(parametrosModal);
    });
  }

  busquedaAvanzada(parametrosModal){

    let texto:string = "<strong>Busqueda Por: </strong>";
    
    let busquedaCodigo:string = parametrosModal.get("codigoDocumento");
    if(busquedaCodigo!=null && busquedaCodigo != ""){
      texto = texto + "<br/><strong>Código de Documento: </strong>"+busquedaCodigo+" ";
    }

    let busquedaTitulo:string = parametrosModal.get("tituloDocumento");
    if(busquedaTitulo!=null && busquedaTitulo != ""){
      texto = texto + "<br/><strong>Título de Documento: </strong>"+busquedaTitulo+" ";
    }

    let busquedaIdtipodocu:string = parametrosModal.get("idtipodocu");
    if(busquedaIdtipodocu!=null && busquedaIdtipodocu != ""){
      texto = texto + "<br/><strong>Tipo de Documento: </strong>"+parametrosModal.get("desIdtipodocu")+" ";
    }

    let busquedaIdproc:string = parametrosModal.get("idproc");
    if(busquedaIdproc!=null && busquedaIdproc != ""){
      texto = texto + "<br/><strong>Tipo Solicitud: </strong>"+parametrosModal.get("desIdproc")+" ";
    }

    let busquedaInicio:string = parametrosModal.get("fechacandesde");
    if(busquedaInicio!=null && busquedaInicio != ""){
        texto = texto + "<br/><strong>Fecha de Cancelación Desde: </strong>"+ this.datePipe.transform(busquedaInicio, "dd/MM/yyyy") ;
    } 

    let busquedaFinal:string = parametrosModal.get("fechacanhasta");
    if(busquedaFinal!=null && busquedaFinal != ""){
        texto = texto + "<br/><strong>Fecha de Cancelación Hasta: </strong>"+ this.datePipe.transform(busquedaFinal, "dd/MM/yyyy") ;
    } 

    if (busquedaIdtipodocu == null && busquedaIdproc == null && busquedaCodigo == null && 
      busquedaTitulo == null && busquedaInicio == null && busquedaFinal == null) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }   

    this.obtenerSolicitudes(this.obtenerParametros(parametrosModal));
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

  limpiar() {
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigoDocumento';
    this.tipoBusqueda = 1;
    this.buscar();
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.parametroBusquedaIni;
    this.textoBusquedaPa = this.textoBusquedaIni;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  OnExportarXls() {
    
    if (this.solicitudesCancelacion.length > 0) {
      let params: Map<string, any> = new Map();
      this.reporteMap.forEach((value, key) => {
        if (key == 'registros') {
          params = params.set('registros', this.paginacion.totalRegistros);
        } else {
          params = params.set(key, value);
        }
      });

      let fechaPrueba = new Date();
      let fecha = this.datePipe.transform(fechaPrueba, "dd/MM/yyyy");

      this.tareaService.generarExcel(params).subscribe(function (data) {
        var file = new Blob([data], { type: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet' });
        var link = document.createElement('a');
        link.href = URL.createObjectURL(file);
        link.download = "Reporte-Documentos-Cancelado(" + fecha + ").xlsx";
        
        link.click();       
        
      },
        (error) => this.controlarError(error)
      );
      this.toastr.info('Documento generado', 'Confirmación', { closeButton: true }); 
    } else {
      this.toastr.warning('No existen registros para exportar.', 'Advertencia', { closeButton: true });
    }

  }


  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  
  }
 
}
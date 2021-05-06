import { Component, OnInit, SecurityContext, ViewChild} from '@angular/core';
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
import { BajarConocimientoRevisionDocComponents } from 'src/app/modules/bandejadocumento/modales/bandeja-conocimiento-revision-doc.component';
import { DomSanitizer } from '@angular/platform-browser';
import { ReporteConocimientoDocumentoService } from 'src/app/services/impl/reporteConocimientoDocumento.service';
import { ConocimientoRevisionDocumento } from 'src/app/models/conocimientorevisiondocumento';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'bandejaConocimientoRevisionDoc',
  templateUrl: 'bandejaConocimientoRevisionDoc.template.html',  
  providers: [BandejaDocumentoService]
})
export class BandejaConocimientoRevisionDocComponent implements OnInit {
  selectedObject: BandejaDocumento;
  loading: boolean;
  paginacion: Paginacion;
  selectedRow: number;
  bsModalRef: BsModalRef;
  selectedFilter: string;
  busquedaRevision: BandejaDocumento;
  textoBusqueda: string;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  rutaDocumento: string;
  valorChecked: boolean;
  objetoBlob:any;
  prueba:string;
  cambio:boolean;
  parametroBusqueda:string;
  tipoBusqueda: number;
  parametrosBusquedaAvanzada:Map<string,any>;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  parametroBusquedaIni: string;
  textoBusquedaIni: string;
  valorPaginacion: number;
  IndicadorPagina:number;

  listaConocimiento:ConocimientoRevisionDocumento[];
  
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private datePipe: DatePipe,
              private route: ActivatedRoute,
              private serviceReporte: ReporteConocimientoDocumentoService,
              private modalService: BsModalService,
              private sanitizer: DomSanitizer) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.parametrosBusquedaAvanzada = new Map<string,any>();
    this.selectedRow = -1;
    this.valorPaginacion = 0;
    this.IndicadorPagina = 0; 
    this.cambio = false;
  }

  ngOnInit() {
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.textoBusqueda = '';
    this.parametroBusqueda = 'codigo';
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
      case 'codigo':
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

    this.obtenerConocimientoDocumento(this.obtenerParametros(null));
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
      if (this.parametroBusqueda === 'codigo') { parametros.set('codigo', this.textoBusqueda); this.textoBusquedaIni = this.textoBusqueda;  parametros.set('numrevi', "999");}
    }
    return parametros;
  }

  obtenerConocimientoDocumento(parametros: Map<string, any>) {
    this.loading = true;
    this.serviceReporte.obtenerConocimientoDocumento(parametros).subscribe((responseObject: Response) => {
      this.listaConocimiento = responseObject.resultado;
      this.paginacion = responseObject.paginacion;
      this.IndicadorPagina = 0;
      this.valorPaginacion = 0;
      this.loading = false;
    }, (error) => this.controlarError(error)
    );
  }

  abrirBusquedaAvanzada(){
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    const modalBusqueda = this.modalService.show(BajarConocimientoRevisionDocComponents, config);
    (<BajarConocimientoRevisionDocComponents>modalBusqueda.content).onClose.subscribe(parametrosModal => {
      this.parametrosBusquedaAvanzada = parametrosModal;
      this.tipoBusqueda = 2;
      this.paginacion.pagina = 1;
      this.busquedaAvanzada(parametrosModal);
    });
  }

  busquedaAvanzada(parametrosModal){

    let texto:string = "<strong>Busqueda Por: </strong>";
    
    let busquedaCodigoDoc:string = parametrosModal.get("codigo");
    if(busquedaCodigoDoc!=null && busquedaCodigoDoc != ""){
      texto = texto + "<br/><strong>Código de Documento: </strong>"+busquedaCodigoDoc+" ";
    }

    let busquedaTituloDoc:string = parametrosModal.get("numrevi");
    if(busquedaTituloDoc!=null && busquedaTituloDoc != ""){
        texto = texto + "<br/><strong>N° Revisión: </strong>"+ busquedaTituloDoc;
    }else{
      parametrosModal.set('numrevi', "999");
    }

    let busquedaInicio:string = parametrosModal.get("fechaaprobdesde");
    if(busquedaInicio!=null && busquedaInicio != ""){
        texto = texto + "<br/><strong>Fecha de Aprobación Desde: </strong>"+ this.datePipe.transform(busquedaInicio, "dd/MM/yyyy") ;
    } 

    let busquedaFinal:string = parametrosModal.get("fechaaprobhasta");
    if(busquedaFinal!=null && busquedaFinal != ""){
        texto = texto + "<br/><strong>Fecha de Aprobación Hasta: </strong>"+ this.datePipe.transform(busquedaFinal, "dd/MM/yyyy") ;
    } 

    if (busquedaCodigoDoc == null && busquedaTituloDoc == null && busquedaInicio == null && busquedaFinal == null) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }   

    this.obtenerConocimientoDocumento(this.obtenerParametros(parametrosModal));
  }
 
  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnPageChanged(event): void {
    
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

  OnPageOptionChanged(event): void {
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

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.parametroBusquedaIni;
    this.textoBusquedaPa = this.textoBusquedaIni;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  limpiar() {
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigo';
    this.tipoBusqueda = 1;
    this.buscar();
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }
  
  verReporteNoRevisados(item: ConocimientoRevisionDocumento, visorPdfSwal, event) {
    
    this.serviceReporte.obtenerReporteNoConocimientoDocumento(item.documento.id, item.documento.codigo, item.documento.descripcion, item.revision.id).subscribe((data: Blob) => {
      let file = new Blob([data], { type: 'application/pdf' });
      this.objetoBlob = file;
      visorPdfSwal.show();
    }, (error) => this.controlarError(error)
    );
  }

  verReporteRevisados(item: ConocimientoRevisionDocumento, visorPdfSwal, event) {
    this.serviceReporte.obtenerReporteConocimientoDocumento(item.documento.id, item.documento.codigo, item.documento.descripcion, item.revision.id).subscribe((data: Blob) => {
      let file = new Blob([data], { type: 'application/pdf' });
      this.objetoBlob = file;
      visorPdfSwal.show();
    }, (error) => this.controlarError(error)
    );
  }


}
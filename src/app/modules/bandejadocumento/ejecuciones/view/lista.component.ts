import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../../services';
import { Estado } from '../../../../models/enums/estado';
import { BandejaDocumento } from '../../../../models/bandejadocumento';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BusquedaDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento.component';
import { Jerarquia } from 'src/app/models/jerarquia';
import { Parametro, RevisionDocumento } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { JerarquiasService } from 'src/app/services/impl/jerarquias.service';
import { BusquedaEjecucionComponent } from 'src/app/modules/bandejadocumento/ejecuciones/modales/busqueda-ejecucion.component';
import { DatePipe } from '@angular/common';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { Constante } from 'src/app/models/enums';
import { SessionService } from 'src/app/auth/session.service';

declare var jQuery: any;

@Component({
  selector: 'programacion-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss']
})
export class EjecucionListaComponent implements OnInit {

  /* datos */
  private parametroPlazos: number;
  //items: Jerarquia[];
  items: RevisionDocumento[];
  listado: RevisionDocumento[];
  listadoFinal: RevisionDocumento[];
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  claseCirculoAlerta: string;
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: Jerarquia;
  /* indicador de carga */
  loading: boolean;
  /* Deshabilitar Busqueda*/
  deshabilitarBuscar: boolean;
  /* Texto de Mensaje*/
  mensajeInformacion: string;
  /* Validacion si existe un Mensaje a mostrar pantalla: SI(TRUE) / NO(FALSE)*/
  mostrarInformacion: boolean;
  /* Texto de Alerta*/
  mensajeAlerta: string;
  /* Validacion si existe una Alerta a mostrar en pantalla: SI(TRUE) / NO(FALSE)*/
  mostrarAlerta: boolean;
  /* Texto del menu seleccionado*/
  textoMenu: string;
  /* Lista de Estados */
  listaEstados: any;
  /* Filtros Anteriores */
  parametroBusquedaAnterior: string;
  textoBusquedaAnterior: string;
  textoMenuAnterior: string;
  bsModalRef: BsModalRef;
  objetoBusqAvanz: RevisionDocumento;
  private sub: any;
  idProg: number;
  deshabilitarGuardar: boolean;
  ocultarBtnDistrib: boolean;
  ocultarBtnEjecut: boolean;
  flagJefe: string;
  tipoBusqueda: number;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  parametroBusquedaIni: string;
  textoBusquedaIni: string;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private service: RevisionDocumentoService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private route: ActivatedRoute,
    public session: SessionService
  ) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.listado = [];
    this.listadoFinal = [];
    this.parametroBusqueda = 'cod_programacion';
    this.parametroBusquedaAnterior = this.parametroBusqueda;
    this.paginacion = new Paginacion({ registros: 10 });
    this.deshabilitarBuscar = true;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.textoMenu = null;
    this.mostrarInformacion = false;
    this.objetoBusqAvanz = new RevisionDocumento();
    this.deshabilitarGuardar = true;
    this.ocultarBtnDistrib = false;
    this.ocultarBtnEjecut = false;
    this.flagJefe = "";
    this.valorPaginacion = 0;
  }

  ngOnInit() {
    
    this.textoBusqueda = '';
    this.parametroBusqueda = 'codigo';
    this.tipoBusqueda = 1;
    this.mostrarAlerta = false;
    this.OnBuscar();
  }

  busquedaSimple() {
    this.paginacion.pagina = 1;
    this.valorPaginacion = 1;
    this.tipoBusqueda = 1;
    this.OnBuscar();
  }

  OnBuscar() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    if (this.textoBusqueda.trim() != '') {
      switch (this.parametroBusqueda) {
        case 'codigo':
          texto = texto + "<br/><strong>Número de Programación: </strong>" + this.textoBusqueda;
          break;
      }
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;

    } else {

      this.textoBusqueda = '';
      this.mostrarAlerta = false;

    }

    this.getLista(null);
  }

  getLista(objetoBusqAvanz: RevisionDocumento): void {
    this.loading = true;

    const parametros: {
      nrofichaCo?: string, nrofichaJe?: string, codArea?: string,
      anio?: string, codigoProg?: string, codigoDocu?: string, estejec?: string
    } =
    {
      nrofichaCo: null, nrofichaJe: null, codArea: null,
      anio: null, codigoProg: null, codigoDocu: null, estejec: null
    };

    let codFichaLogueado = localStorage.getItem("codFichaLogueado");
    let codAreaLogueado = localStorage.getItem("codAreaLogueado");
    parametros.nrofichaCo = codFichaLogueado;
    parametros.nrofichaJe = codFichaLogueado;

    this.parametroBusquedaIni = this.parametroBusqueda;


    if (objetoBusqAvanz) {

      if (this.objetoBusqAvanz.codigo) { parametros.codigoProg = this.objetoBusqAvanz.codigo; }
      if (this.objetoBusqAvanz.documento) { parametros.codigoDocu = this.objetoBusqAvanz.documento.toString(); }
      if (this.objetoBusqAvanz.anio) { parametros.anio = this.objetoBusqAvanz.anio.toString(); }
      if (this.objetoBusqAvanz.idequipo) { parametros.codArea = this.objetoBusqAvanz.idequipo.toString(); }
      if (this.objetoBusqAvanz.estados) { this.objetoBusqAvanz.estados.toString(); }

    } else {
      if (this.parametroBusqueda === 'codigo') { parametros.codigoProg = this.textoBusqueda; this.textoBusquedaIni = this.textoBusqueda; }
    }

    this.service.buscarPorParametrosEjec(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        let listaProgramacion: RevisionDocumento[] = response.resultado;
        listaProgramacion.forEach(documento => {
          let fechaEjecucion
          let trimestre = documento.idTrimestre;
          fechaEjecucion = documento.fechaEjecucion;
          if ((documento.fechaProgramacion != null && documento.fechaDistribucion != null) || documento.fechaEjecucion != null) {
            documento.fechaProgramacion = this.datePipe.transform(documento.fechaProgramacion, "dd/MM/yyyy");
            documento.fechaDistribucion = this.datePipe.transform(documento.fechaDistribucion, "dd/MM/yyyy");
            documento.fechaEjecucion = this.datePipe.transform(documento.fechaEjecucion, "dd/MM/yyyy");
          } else {
            documento.fechaProgramacion = " ";
            documento.fechaDistribucion = " ";
            documento.fechaEjecucion = " ";
          }
          
          documento.estiloPlazo = this.validarDiaDiferencia(fechaEjecucion, trimestre);
        });
        this.listadoFinal = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.valorPaginacion = 0;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  validarDiaDiferencia(fechaEjecucion: Date, trimestre: Number) {
      
    if(fechaEjecucion!=null){
      let year = Number(this.datePipe.transform(fechaEjecucion, "yyyy"));
      let fechaEjecucionFinal = new Date(fechaEjecucion)
      let I = new Date(year, 2, 31);
      let II = new Date(year, 5, 30);
      let III = new Date(year, 8, 30);
      let IV = new Date(year, 11, 31);
      if (trimestre == 1) {
        if (fechaEjecucionFinal > I) {
          this.claseCirculoAlerta = 'alertaCirculoRojo';
        } else {
          this.claseCirculoAlerta = 'alertaCirculoVerde';
        }
      } else if (trimestre == 2) {
        if (fechaEjecucionFinal > II) {
          this.claseCirculoAlerta = 'alertaCirculoRojo';
        } else {
          this.claseCirculoAlerta = 'alertaCirculoVerde';
        }
      } else if (trimestre == 3) {
        if (fechaEjecucionFinal > III) {
          this.claseCirculoAlerta = 'alertaCirculoRojo';
        } else {
          this.claseCirculoAlerta = 'alertaCirculoVerde';
        }
      } else if (trimestre == 4) {
        if (fechaEjecucionFinal > IV) {
          this.claseCirculoAlerta = 'alertaCirculoRojo';
        } else {
          this.claseCirculoAlerta = 'alertaCirculoVerde';
        }
      }/*else{

    }

      this.claseCirculoAlerta = 'alertaCirculoDefault';
    }*/
  }else{
    this.claseCirculoAlerta = 'alertaCirculoDefault';
  }
    return this.claseCirculoAlerta;
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnDistribuir(idProg): void {
    this.router.navigate([`documento/distribucion/distribuir/${idProg}`]);
  }

  OnEjecutar(idProg): void {
    this.router.navigate([`documento/distribucion/ejecucion/${idProg}`]);
  }

  OnLimpiar() {
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.parametroBusqueda = 'codigo';
    this.tipoBusqueda = 1;
    this.OnBuscar();
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  habilitarBuscar(): void {
    if (this.textoBusqueda != '')
      this.deshabilitarBuscar = false;
    else
      this.deshabilitarBuscar = true;
  }

  habilitarBuscarNumero(): void {
    if (this.textoBusqueda != null) {
      if (this.textoBusqueda != "") {
        this.deshabilitarBuscar = false;
      } else {
        this.deshabilitarBuscar = true;
      }
    } else {
      this.deshabilitarBuscar = true;
    }
  }

  obtenerTextoEstado(): void {
    this.textoMenu = this.listaEstados.find(resultado => (resultado.id + "") == this.textoBusqueda).valor;
  }

  abrirBusquedaAvanzada() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-md'
    }
    this.bsModalRef = this.modalService.show(BusquedaEjecucionComponent, config);
    (<BusquedaEjecucionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RevisionDocumento = result;
      this.paginacion.pagina = 1;
      this.tipoBusqueda = 2;
      this.objetoBusqAvanz = objeto;
      this.busquedaAvanzada();
    });
  }

  ingresoTexto(event) {
    const key = window.event ? event.which : event.keyCode;
    if (this.parametroBusqueda === 'codigo') {
      if (key < 48 || key > 57) {
        event.preventDefault();
      }
    }
  }

  busquedaAvanzada() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    if (this.objetoBusqAvanz.codigo) {
      texto = texto + "<br/><strong>Número de Programación: </strong>" + this.objetoBusqAvanz.codigo + " ";
    }
    if (this.objetoBusqAvanz.documento) {
      texto = texto + "<br/><strong>Código Documento: </strong>" + this.objetoBusqAvanz.documento + " ";
    }
    if (this.objetoBusqAvanz.anio) {
      texto = texto + "<br/><strong>Año: </strong>" + this.objetoBusqAvanz.anio + " ";
    }
    if (this.objetoBusqAvanz.idequipo) {
      texto = texto + "<br/><strong>Equipo: </strong>" + this.objetoBusqAvanz.descequipo + " ";
    }
    if (this.objetoBusqAvanz.estados) {
      texto = texto + "<br/><strong>Estado: </strong>" + this.objetoBusqAvanz.desestado + " ";
    }

    if (this.objetoBusqAvanz.codigo == "" && this.objetoBusqAvanz.anio == 0 && this.objetoBusqAvanz.documento == "" && this.objetoBusqAvanz.estados == 0 && this.objetoBusqAvanz.idequipo == undefined) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }

    this.getLista(this.objetoBusqAvanz);
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    if (this.tipoBusqueda == 1) {
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      this.OnBuscar();
    } else if (this.tipoBusqueda == 2) {
      this.busquedaAvanzada();
    }
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    if (this.tipoBusqueda == 1) {
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      this.OnBuscar();
    } else if (this.tipoBusqueda == 2) {
      this.busquedaAvanzada();
    }
  }

  obtenerParametrosPaginacion() {

    this.parametroBusquedaPa = this.parametroBusquedaIni;
    this.textoBusquedaPa = this.textoBusquedaIni;

    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }




  obtenerDiferenciaFechaActual(fecha: Date) {
    
    const fechaActual: Date = new Date();
    const diferencia = fecha.getTime() - fechaActual.getTime();
    return Math.round(diferencia / (1000 * 60 * 60 * 24));
  }

}
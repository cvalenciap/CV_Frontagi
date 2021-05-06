import { Constante } from 'src/app/models/enums/constante';
import { Component, OnInit, SecurityContext, EventEmitter } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Tipo } from '../../../../models/tipo';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalRef, BsModalService, PaginationComponent } from 'ngx-bootstrap';
import { TareasPendientesMockService } from 'src/app/services/mocks/tareas-pendientes/tareaspendientes.mock';
import { DomSanitizer } from '@angular/platform-browser';
import { RevisionDocumento, Parametro } from 'src/app/models';
import { DatePipe } from '@angular/common';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { Programa } from 'src/app/models/programa';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { SessionService } from 'src/app/auth/session.service';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { ViewChild } from '@angular/core';

declare var jQuery: any;
declare var jQuery: any;

@Component({
  selector: 'app-copiaimpresion',
  templateUrl: 'copiaimpresion.template.html',
  styleUrls: ['copiaimpresion.component.scss']
})
export class CopiaImpresionComponent implements OnInit {
  @ViewChild('pageOption') pageOption: PaginacionSetComponent;
  pageChanged = new EventEmitter<any>();
  RevisionDocumento: any;
  item: RevisionDocumento;
  codigotipo: string;
  items: RevisionDocumento[];
  selectedObject: RevisionDocumento;
  tipoCopia: string;
  itemCodigo: number;
  selectedRow: number;
  textoBusqueda: string;
  loading: boolean;
  parametroBusqueda: string;
  paginacion: Paginacion;
  mensajeAlerta: string;
  mostrarAlerta: Boolean;
  opcionBusqueda: string;
  Solicitante: string;
  Equipo: string;
  Tipo: string;
  codigo: number;
  selectedFilter: string;
  busquedavanzada: Programa;
  listaTipos: Tipo[];
  listaTipo: String[];
  titulo: string;
  codigodoc: string;
  listaTiposCopia: Parametro[];
  private sub: any;
  rutaActual: string;
  rutaAnterior: string;
  rutaAnteriorAnterior: string;
  objetoRetornoBusqueda:RetornosBusqueda;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  TipoPa: string;
  IndicadorPagina:number;
  paginaRetorno:number;

  bsModalRef: BsModalRef
  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: RevisionDocumentoService,
    private sanitizer: DomSanitizer,
    private tareasPendientesService: TareasPendientesMockService,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    private parametroService: ParametrosService,
    public session: SessionService
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
    this.items = [];
    this.listaTipo = ['Controlado', 'No Controlado'];
    this.parametroBusqueda = 'codDoc';
    this.paginacion = new Paginacion({ registros: 10 });
    this.opcionBusqueda = 'tipo';
    this.mostrarAlerta = false;
    this.codigo = 0;
    this.tipoCopia = '';
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    this.valorPaginacion = 0;
    this.IndicadorPagina = 0;
  }

  ngOnInit() {
    if (localStorage.getItem("objetoRetornoBusquedaSolCopia") != undefined || localStorage.getItem("objetoRetornoBusquedaSolCopia") != null) {
      this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusquedaSolCopia"));
      this.OnBuscarRetorno();

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
      this.parametroBusqueda = 'codigo';
      this.OnBuscar();
    }
  }

  busquedaSimple() {
    this.paginacion.pagina = 1;
    this.valorPaginacion = 1;
    this.OnBuscar();
  }

  OnBuscar() {
    let texto: string = "<strong>Busqueda Por: </strong>";
     switch (this.parametroBusqueda) {

      case 'codigo':
        texto = texto + "<br/><strong>Código de Documento: </strong>" + this.textoBusqueda;
        break;
      case 'titulo':
        texto = texto + "<br/><strong>Título de Documento: </strong>" + this.textoBusqueda;
        break;
      case 'tipo':
        texto = texto + "<br/><strong>Tipo de Copia: </strong>" + this.Tipo;
        break;
    }

    if (this.textoBusqueda.trim() != '' || this.Tipo != null) {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }

    this.obtenerDocumentos();
  }

  OnBuscarRetorno() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda = this.objetoRetornoBusqueda.textoBusqueda;
    this.Tipo = this.objetoRetornoBusqueda.Tipo;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;

    switch (this.parametroBusqueda) {

      case 'codigo':
        texto = texto + "<br/><strong>Código de Documento: </strong>" + this.textoBusqueda;
        break;
      case 'titulo':
        texto = texto + "<br/><strong>Título de Documento: </strong>" + this.textoBusqueda;
        break;
      case 'tipo':
        texto = texto + "<br/><strong>Tipo de Copia: </strong>" + this.Tipo;
        break;
    }

    if (this.textoBusqueda.trim() != '' || this.Tipo != null) {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }

    this.obtenerDocumentos();
  }

  obtenerDocumentos() {
    this.loading = true;
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    const parametros:
      { btipocopi?: string, titulodocumento?: string, codigoDocumento?: string } =
      { btipocopi: null, titulodocumento: null, codigoDocumento: null };

    this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;
    
    if (this.parametroBusqueda === 'codigo') { parametros.codigoDocumento = this.textoBusqueda; this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda; }
    if (this.parametroBusqueda === 'titulo') { parametros.titulodocumento = this.textoBusqueda; this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda; }
    if (this.parametroBusqueda === 'tipo') {
      if (!this.Tipo) {
        this.Tipo = null;
      } else {
        if (this.Tipo == "Controlado") {
          this.codigotipo = Constante.ID_TIPO_COPIA_CONTROLADA;
        } else {
          (this.Tipo == "No Controlado")
          this.codigotipo = Constante.ID_TIPO_COPIA_NO_CONTROLADA;
        }
        parametros.btipocopi = this.codigotipo;
      }
      this.objetoRetornoBusqueda.Tipo = this.Tipo;
    }

    this.objetoRetornoBusqueda.pagina = this.paginacion.pagina;
    this.objetoRetornoBusqueda.registros = this.paginacion.registros;

    localStorage.removeItem("objetoRetornoBusquedaSolCopia");  
    localStorage.setItem("objetoRetornoBusquedaSolCopia", JSON.stringify(this.objetoRetornoBusqueda));    
    
    this.service.buscarPorParametrosSoliciDocumento(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        let listaderevisiondoc: RevisionDocumento[] = response.resultado;
        this.items = listaderevisiondoc;
        this.paginacion = new Paginacion(response.paginacion);
        this.codigotipo = '';
        this.titulo = '';
        this.codigodoc = '';
        this.opcionBusqueda = this.parametroBusqueda;
        this.valorPaginacion = 0;
        this.IndicadorPagina = 0;
        this.loading = false;
      },
      (error) => this.controlarError(error)
      );
  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;
    this.TipoPa = this.objetoRetornoBusqueda.Tipo;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;
    this.Tipo = this.TipoPa;

  }

  limpiar() {
    localStorage.removeItem("objetoRetornoBusquedaSolCopia");
    this.Tipo = null;
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigo';
    this.OnBuscar();
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    }        
    if (this.IndicadorPagina == 0) {
      this.IndicadorPagina = 0;
      this.OnBuscar();
    }
  }

  OnPageChangedReturn(pagina:number, registros:number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    this.OnBuscar();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.IndicadorPagina=1;
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    }  
    this.OnBuscar();    
  }

  obtenerTiposCopia() {
    this.parametroService.obtenerParametroPadre(Constante.TIPO_COPIA).subscribe((response: Response) => {
      this.listaTiposCopia = response.resultado;
    }, (error) => {
    });
  }

  OnVerElementoOpcionBusqueda(opcion: string): void {
    this.opcionBusqueda = opcion;
    this.mostrarAlerta = false;
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  obtenerTareasPendientes() {
    this.tareasPendientesService.obtenerConocimientoRevision().subscribe(
      (response: Response) => {
        this.items = response.resultado;

        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnModificar(item: RevisionDocumento): void {
    /* Solicitud */
    this.router.navigate([`/documento/solicitudes/copiaimpresa/detalle/${item.numerosol}`]);
    localStorage.setItem("idSolicitud", item.numerosol);
    localStorage.setItem("iddocumento", item.documento.id);
    localStorage.setItem("tipocopia", item.numerotipocopia);
    localStorage.setItem("numeromotivo", item.numeromotivo);
    localStorage.setItem("susteso", item.susteso);
    localStorage.setItem("idRevision", item.id + "");
    localStorage.setItem("EstadoSoli", item.estadoSoli);


  }
  OnAgregar(): void {
    this.OnBorrarSession();
    this.codigo = 1;
    this.router.navigate([`/documento/solicitudes/copiaimpresa/detalle`]);
  }

  OnBorrarSession() {
    localStorage.removeItem("susteso");
    localStorage.removeItem("iddocumento");
    localStorage.removeItem("tipocopia");
    localStorage.removeItem("numeromotivo");
    localStorage.removeItem("idRevision");
    localStorage.removeItem("EstadoSoli");
    localStorage.removeItem("idSolicitud");
    localStorage.removeItem("objetoRetornoBusquedaSolCopia");
  }  

}

import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../../services';
import { Tipo } from '../../../../models/tipo';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { BusquedaConocimientoComponent } from 'src/app/modules/tareapendiente/modals/tarea-conocimiento/busqueda-conocimiento.component';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TareasPendientesMockService } from 'src/app/services/mocks/tareas-pendientes/tareaspendientes.mock';
import { Documento, RevisionDocumento } from 'src/app/models';
import { PlantillaService } from 'src/app/services/impl/plantilla.service';
import { conocimiento } from 'src/app/models/conocimiento';
import { SessionService } from 'src/app/auth/session.service';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'app-tareaconocimiento',
  templateUrl: 'tareaconocimiento.template.html',
  styleUrls: ['tareaconocimiento.component.scss'],
  providers: [BandejaDocumentoService]
})
export class TareaConocimientoComponent implements OnInit {

  itemCodigo: number;
  selectedRow: number;
  textoBusqueda: string;
  loading: boolean;
  parametroBusqueda: string;
  parametroIngresado: string;
  paginacion: Paginacion;
  listaTipos: Tipo[];
  indicador: boolean;
  deshabilitarBuscar: boolean;
  conocimiento: conocimiento[];
  lecturaConocimiento: conocimiento;
  listaConocimiento: conocimiento[];
  conocimientoEliminar: conocimiento;
  cantidadDocumentos: number[];
  parametros: Map<string, any>;
  private sub: any;
  selectedObject: RevisionDocumento;
  items: RevisionDocumento[];
  idUsuarioLogueo: number;
  textoCodigo: string;
  bsModalRef: BsModalRef
  urlPDF: any;
  mostrarLeyendaBusqueda: boolean;
  mensajeLeyendaBusqueda: string;
  descripcionMostrar: string;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  parametroBusquedaIni: string;
  textoBusquedaIni: string;

  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: PlantillaService,
    private tareasPendientesService: TareasPendientesMockService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    public session: SessionService
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
    this.items = [];
    this.cantidadDocumentos = [];
    this.parametros = new Map<string, any>();
    this.parametroBusqueda = '';
    this.parametroIngresado = ''
    this.paginacion = new Paginacion({ registros: 10 });
    this.indicador = true;
    this.deshabilitarBuscar = true;
    this.textoCodigo = "";
    this.mostrarLeyendaBusqueda = false;
    this.descripcionMostrar = "Ej: DGMMA001";
    this.valorPaginacion = 0;
  }

  ngOnInit() {
    if (this.session.User != null) {
      this.idUsuarioLogueo = this.session.User.codFicha;
    }
    this.getLista();
    this.parametroBusqueda = "codigo";
  }

  OnBuscar(): void {
    this.valorPaginacion = 1;
    if (this.textoBusqueda == '') {
      this.indicador = true;
    } else {
      this.indicador = false;
    }

    if (this.indicador) {
      this.getLista();
    } else {
      this.getLista();
      this.textoBusqueda = '';
    }
  }

  getLista(): void {
    this.loading = true;
    let texto: String = "<strong>Búsqueda Por:</strong>";
    const parametros: { codigoDoc?: string, tituloDoc?: string } = { codigoDoc: null, tituloDoc: null };

    this.parametroIngresado = this.parametroBusqueda;

    if (this.textoBusqueda != undefined) {
      if (this.textoBusqueda.trim() == '' || this.textoBusqueda == null) {
        this.parametroBusqueda = 'default';
      }
    } else {
      this.parametroBusqueda = 'default';
    }

    switch (this.parametroBusqueda) {
      case 'codigo':
        texto = texto + "<br/><strong>Código: </strong>" + this.textoBusqueda;
        parametros.codigoDoc = this.textoBusqueda;
        this.mostrarLeyendaBusqueda = true;
        this.mensajeLeyendaBusqueda = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        break;
      case 'titulo':
        texto = texto + "<br/><strong>Título: </strong>" + this.textoBusqueda;
        parametros.tituloDoc = this.textoBusqueda;
        this.mostrarLeyendaBusqueda = true;
        this.mensajeLeyendaBusqueda = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        break;
      case 'default':
        parametros.codigoDoc = null;
        parametros.tituloDoc = null;
        this.mostrarLeyendaBusqueda = false;
        this.mensajeLeyendaBusqueda = '';
        this.parametroBusqueda = this.parametroIngresado;
        break;
    }

    this.parametroBusquedaIni = this.parametroBusqueda;
    this.textoBusquedaIni = this.textoBusqueda;

    this.items = [];
    this.service.listarRevisionDoc(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.valorPaginacion = 0;
        this.loading = false;
        this.deshabilitarBuscar = true;
      },
      (error) => this.controlarError(error)
    );
  }

  OnDescripcionSeleccionada() {
    if (this.parametroBusqueda == "codigo") {
      this.descripcionMostrar = "Ej: DGMMA001";
    } else if (this.parametroBusqueda == "titulo") {
      this.descripcionMostrar = "Ej: Manual de Estandarización";
    }
  }

  limpiar() {
    this.parametroBusqueda = '';
    this.textoBusqueda = '';
    this.indicador = true;
    this.valorPaginacion = 0;
    this.mostrarLeyendaBusqueda = false;
    this.mensajeLeyendaBusqueda = '';
    this.deshabilitarBuscar = true;
    this.descripcionMostrar = "Ej: DGMMA001";
    this.getLista();
    this.parametroBusqueda = "codigo";
    this.paginacion = new Paginacion({ registros: 10 });
  }

  habilitarBuscar(): void {
    if (this.parametroBusqueda != '') {
      this.deshabilitarBuscar = false;
      this.indicador = false;
    }
    else {
      this.deshabilitarBuscar = true;
    }
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

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    }
    this.OnBuscar();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    }
    this.OnBuscar();
  }

  obtenerParametrosPaginacion() {

    this.parametroBusquedaPa = this.parametroBusquedaIni;
    this.textoBusquedaPa = this.textoBusquedaIni;

    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }
  controlarError(error) {
    console.error(error);
  }

  OnModificar(): void {
    this.router.navigate([`documento/solicitudes/revisiondocumento/registrar-revision-documento/${this.selectedObject.codigo}`]);
  }

  OnEliminar() {
    for (let i: number = 0; i < this.conocimiento.length; i++) {
      if (this.selectedRow + 1 == this.conocimiento[i].indicador) {
        this.conocimientoEliminar = this.conocimiento[i];
        this.service.EliminarConocimiento(this.conocimientoEliminar).subscribe(
          (response: Response) => {
            this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
            this.getLista();
            this.loading = false;
          },
          (error) => this.controlarError(error)
        );
      }
    }
  }

  abrirBusquedaAvanzada() {

    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-md'
    }
    this.bsModalRef = this.modalService.show(BusquedaConocimientoComponent, config);
    (<BusquedaConocimientoComponent>this.bsModalRef.content).onClose.subscribe(result => {

    });

  }

  mostrarDocumento(item: number, idDocu: number, idReviruta: number, ruta: String, visorPdfSwal: any, event: any) {
    this.lecturaConocimiento = new conocimiento();
    this.lecturaConocimiento.iddocumento = idDocu;
    this.lecturaConocimiento.idrevision = idReviruta;

    this.service.ActualizarConocimiento(this.lecturaConocimiento).subscribe(
      (response: Response) => {
        this.urlPDF = ruta;
        visorPdfSwal.show();
        event.stopPropagation();
        this.getLista();
      },
      (error) => this.controlarError(error)
    );
  }


}
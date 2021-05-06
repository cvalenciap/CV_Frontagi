import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { RevisionDocumento } from '../../../models';
import { Response } from '../../../models/response';
import { RevisionDocumentoMockService } from '../../../services';
import { Paginacion } from '../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BitacoraComponent } from 'src/app/modules/revisiondocumento/modals/bitacora.component';
import { BusquedaAvanzadaComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-avanzada.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { ModalRevisiones } from 'src/app/modules/bandejadocumento/modales/modal-revisiones.component';

declare var jQuery: any;


//lgomez
@Component({
  selector: 'bandejadocumento-revisar',
  templateUrl: 'revisar.template.html',
  styleUrls: ['revisar.component.scss'],
  //providers: [BandejaDocumentosService]
})
export class RevisarDocumentoComponent1 implements OnInit {
  p: number = 1;
  /* codigo seleccionado */
  itemCodigo: number;
  selectedRow: number;
  textoBusqueda: string;
  loading: boolean;
  parametroBusqueda: string;
  placeHolderBuscar: any;
  paginacion: Paginacion;
  /* datos */
  listaTipos: Tipo[];
  item: RevisionDocumento;
  private sub: any;
  selectedObject: RevisionDocumento;
  itemsAll: RevisionDocumento[];
  itemsForPagination: RevisionDocumento[];
  bsModalRef: BsModalRef;
  parametros: Map<string, any>;

  ngAfterViewInit() {
    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceMock: RevisionDocumentoMockService,
    private service: RevisionDocumentoService,
    private modalService: BsModalService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
    this.itemsAll = [];
    this.parametroBusqueda = 'codigoDoc';
    this.placeHolderBuscar = { "codigoDoc": "Ej. ABC123", "tituloDoc": "Ej. Documento" };
    this.paginacion = new Paginacion({ registros: 10 });
    this.parametros = new Map<string, any>();

  }

  ngOnInit() {
    //this.getLista();
  }


  OnGuardar() {
    /*this.serviceMock.guardar(this.item).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
        this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
      }
      //  (error) => this.controlarError(error)
    );*/
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
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
  OnModificar(idDocu): void {
    this.router.navigate([`documento/migracion/registrar-revision-documento/${idDocu}`]);
  }

  onBitacora() {
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

  OnPageChanged(event) {
    if (this.paginacion.pagina != event.page)
      this.getLista(event.page, event.itemsPerPage);

  }

  //metodos usados ini
  getLista(pagina = 1, registroXPagina = 10): void {
    this.loading = true;

    this.service.listarRevisionDocumentos(this.parametros, pagina, registroXPagina).subscribe(
      (response: Response) => {
        this.itemsAll = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);        
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }
  cambiarBusqueda(nombreBusqueda) {
    this.textoBusqueda = "";
    this.parametroBusqueda = nombreBusqueda;

  }
  onBuscar() {
    this.parametros.clear();
    this.parametros.set(this.parametroBusqueda, this.textoBusqueda);
    this.loading = true;

    this.service.listarRevisionDocumentos(this.parametros, 1, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.itemsAll = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  resultadoBusquedaAvanzada(respuesta) {

    this.itemsAll = respuesta.resultado;
    this.paginacion = new Paginacion(respuesta.paginacion);
  }


  OnPageOptionChanged(event) {
    const cantidadPorPagina = Math.ceil(this.paginacion.totalRegistros / event.rows);
    if (this.paginacion.pagina > cantidadPorPagina) {
      this.paginacion.pagina = cantidadPorPagina;
    }
    this.getLista(this.paginacion.pagina, event.rows);

  }

  onEliminar(paramDelete: string) {
    //const paramDelete = this.selectedObject.id == 0? "" : String(this.selectedObject.id);
    this.service.eliminar(paramDelete).subscribe(
      (response: Response) => {
        if (response.resultado) {
          if (paramDelete) {
            this.itemsAll = this.itemsAll.filter(item => item.id != Number(paramDelete));
          } else {
            this.itemsAll = [];
            this.paginacion = new Paginacion({ registros: 5 });

          }

          this.toastr.success('Revisión Documento', 'Registro Eliminado');
        }
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }



}

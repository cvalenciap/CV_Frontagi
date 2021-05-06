import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento, Paginacion, RevisionDocumento } from '../../../models';
import { Subject } from 'rxjs';
import { Response } from '../../../models/response';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { validate } from 'class-validator';
import { Constante } from 'src/app/models/enums/constante';
import { ValidacionService } from 'src/app/services';
import { Constante as constanteRevision } from 'src/app/models/constante';
import { BsModalRef, BsModalService, ModalOptions } from "ngx-bootstrap";
import { BusquedaColaboradorMigracionComponent } from "../modals/busqueda-colaborador-migracion/busqueda-colaborador-migracion.component";
import { Colaborador } from "../../../models/colaborador";
import { RevisionDocumentoMigracion } from 'src/app/models/revisiondocumentomigracion';


@Component({
  selector: 'bandeja-documento-revision-migracion',
  templateUrl: 'revision-migracion.template.html'
})
export class RevisionComponent1 implements OnInit {
  /* */
  public bsModalRef: BsModalRef;
  public colaborador: Colaborador;
  public textoColaborador: string;
  /* */
  idcolaborador: number;
  /*  */
  public onClose: Subject<boolean>;
  @Input() activar: boolean;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  // valor:boolean;
  parametros: Map<string, any>;
  textoBusqueda: string;
  listaRevisionOrigen: RevisionDocumentoMigracion[];
  listaRevision: RevisionDocumentoMigracion[];
  parametroBusqueda: string;
  paginacion: Paginacion;
  placeholder: any;
  listaParametrosPadre: any[];
  txtDescripcionRevision: string;
  valorMotivoRevision: number;
  revision: RevisionDocumentoMigracion;
  errors: any;
  invalid: boolean;
  public fechaAprobacionSolicitud: string;
  public fechaRegistroSolicitud: string;
  constructor(private revisionService: BandejaDocumentoService, private toastr: ToastrService,
    private servicioValidacion: ValidacionService, private modalService: BsModalService) {

    this.onClose = new Subject();
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.parametros = new Map<string, any>();
    this.parametroBusqueda = 'codigo';
    this.placeholder = { 'codigo': 'Ejem.:1234', 'nombreCompleto': 'Ejm.: Instructivo de clase' };
    this.revision = new RevisionDocumentoMigracion();
    this.revision.estado = new constanteRevision();
    this.errors = {};
    this.colaborador = new Colaborador();
    this.idcolaborador = 0;
  }

  ngOnInit() {
    this.loading = false;
    this.textoColaborador = '';
    this.cargarTipoMotivacion();
  }

  public obtenerColaborador(objectForm) {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg'
    };
    this.bsModalRef = this.modalService.show(BusquedaColaboradorMigracionComponent, config);
    (<BusquedaColaboradorMigracionComponent>this.bsModalRef.content).onClose.subscribe((colaborador: Colaborador) => {
      this.colaborador = colaborador;
      this.textoColaborador = this.colaborador.nombre + ' ' + this.colaborador.apellidoPaterno + ' ' + this.colaborador.apellidoMaterno;
      this.revision.usuarioDeAprobacion = this.colaborador.idColaborador;
      this.servicioValidacion.validacionSingular(this.revision, objectForm, this.errors);
      this.idcolaborador = colaborador.idColaborador;
    });
  }

  cargarTipoMotivacion() {
    this.revisionService.obtenerParametroPadre(Constante.ESTADO_MOTIVO_REVIS).subscribe(
      (response: Response) => {
        this.listaParametrosPadre = response.resultado;
      }
    );
  }

  //obtener fecha de la creacion del documento 
  obtenerFechaAprobacionSolicitud(event) {
    this.fechaAprobacionSolicitud = event;
  }


  obtenerFechaRegistroSolicitud(event) {
    this.fechaRegistroSolicitud = event;
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  obtenerRequestRevision(estado: number): RevisionDocumentoMigracion {
    if (!this.revision.id) {
      let constante: constanteRevision = new constanteRevision();
      constante.idconstante = estado;
      this.revision.estado = this.revision.id ? this.revision.estado : constante;

    }

    this.revision.tabName = "revision";

    let revisionnumero;
    revisionnumero = localStorage.getItem('revisionCurso');
    this.revision.numero = revisionnumero;


    //Id de Colaborador de la revision
    this.revision.usuarioDeAprobacion = this.idcolaborador;
    let usuariorevisiongestion;
    usuariorevisiongestion = localStorage.getItem('idcolaborador');
    this.revision.usuarioRevision = usuariorevisiongestion;
    //
    return this.revision;
  }

  cambiar() {
  }

  Validar(objectForm) {
    this.servicioValidacion.validacionSingular(this.revision, objectForm, this.errors);
  }

  OnLimpiarCampos() {
    this.revision.fechaRegistroSOlicit = null;
    this.revision.fechaAprobacion = null;
    this.textoColaborador = "";
    this.revision.idmotirevi = 0;
    this.revision.descripcion = "";

  }
}

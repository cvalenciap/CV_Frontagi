import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject, forkJoin } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../models/response';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';
import { Curso } from 'src/app/models/curso';
import { Router, ActivatedRoute } from '@angular/router';
import { Sesion } from 'src/app/models/sesion';
import { SesionService } from 'src/app/services/impl/sesion.service';
import { DetalleEncuesta } from 'src/app/models/detalle-encuesta';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { validate } from 'class-validator';

@Component({
  selector: 'modal-agregar-pregunta',
  templateUrl: 'agregar-pregunta.template.html',
  styleUrls: ['agregar-pregunta.component.scss'],
  providers: []
})
export class AgregarPreguntaComponents implements OnInit {
  modalService: any;
  public onClose: Subject<DetalleEncuesta>;

  cantItem: string;
  horas: string;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  //Objeto para abrir ventana
  objetoVentana: BsModalRef;
  plazo: number;
  hoy: Date;
  fecha: Date;
  textoFecha: string;
  equipo: number;
  funcion: string;
  responsable: string;
  listaEquipos: Equipo[];
  listaCursos: Curso[];
  codigoSesion: number;
  /* datos */
  items: Curso[];
  //item: Curso;
  /* Paginación */
  paginacion: Paginacion;
  idCurso: number;
  idSesion: number;
  /* Registro seleccionado */
  selectedRow: number;
  selectedObject: Curso;
  private sub: any;
  dataSesion: Curso;
  datoSesion: DetalleEncuesta;
  sesionTmp: DetalleEncuesta;
  nuevo: boolean;
  data: Sesion;
  dispo: any;
  duracion: any;
  nombre: any;
  idCursoTmp: any;
  idSesionTmp: any;
  item: any;
  hdisponible: boolean;
  mensajes: any[];
  errors: any;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: SesionService,
    private servicioValidacion: ValidacionService
  ) {
    this.items = [];
    this.horas = "Horas";
    this.onClose = new Subject();
    this.hoy = new Date();
    this.limpiar();
    this.datoSesion = new DetalleEncuesta();
    this.sesionTmp = new DetalleEncuesta();
    this.datoSesion.ndisdetenc = 1;
    this.datoSesion.vdespre = '';
  }
  limpiar() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.listaCursos = [];
    this.selectedRow = -1;
    this.fecha = this.hoy;
    this.equipo = null;
    this.funcion = "";
    this.responsable = "";
    this.plazo = 0;
    this.textoFecha = (this.hoy.getDate() < 9 ? "0" : "") + this.hoy.getDate() + "/" +
      ((this.hoy.getMonth() + 1) < 9 ? "0" : "") + (this.hoy.getMonth() + 1) + "/" +
      this.hoy.getFullYear();
  }

  calcularFecha() {
    this.fecha = new Date(this.hoy.getTime() + (1000 * 60 * 60 * 24 * this.plazo));
    this.textoFecha = (this.fecha.getDate() < 9 ? "0" : "") + this.fecha.getDate() + "/" +
      ((this.fecha.getMonth() + 1) < 9 ? "0" : "") + (this.fecha.getMonth() + 1) + "/" +
      this.fecha.getFullYear();
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  ngOnInit() {
    
    this.loading = true;
    this.datoSesion.vdespre = this.nombre;

    if (this.item > 0) {
      this.datoSesion.vcodetaencu = this.item;
      this.datoSesion.ndisdetenc = this.dispo;
      this.hdisponible = false;
    }

    if (this.codigoSesion > 0) {
      this.datoSesion.vcodetaencu = this.codigoSesion.toString();
      this.datoSesion.ndisdetenc = 1;
      this.hdisponible = true;
    }

  }

  cancelar() {
    this.bsModalRef.hide();
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  seleccionar() {
    this.router.navigate([`mantenimiento/encuesta`]);
    this.bsModalRef.hide();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  almacenarSesion() {
    
    this.sesionTmp = new DetalleEncuesta();
    this.sesionTmp.vcodetaencu = this.datoSesion.vcodetaencu;
    this.sesionTmp.vdespre = this.datoSesion.vdespre;
    this.sesionTmp.ndisdetenc = this.datoSesion.ndisdetenc;

    if (this.sesionTmp.vdespre === undefined) {
      this.sesionTmp.vdespre = null;
    } else if (this.sesionTmp.vdespre.trim().length == 0) {
      this.sesionTmp.vdespre = null;
    }

    forkJoin(validate(this.sesionTmp)).subscribe(([errors]: [any]) => {
      this.mensajes = [];
      if (errors.length > 0) {
        this.validarCampos();
        this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
      } else {
        this.onClose.next(this.sesionTmp);
        this.bsModalRef.hide();
      }

    });
  }
  validarCampos() {
    this.errors = {};
    this.servicioValidacion.validacionObjeto(this.sesionTmp, this.errors);
  }



}
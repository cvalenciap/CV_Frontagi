import { Component, OnInit, Input, OnChanges, SimpleChanges } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumento } from '../../../models';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Constante, Estado } from 'src/app/models/enums';
import { ParametrosService, RutaResponsablesService, JsonService } from 'src/app/services';
import { RutaResponsable } from 'src/app/models/rutaresponsable';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../../models/response';
import { Subject } from 'rxjs';
import { Colaborador } from 'src/app/models/colaborador';
import { AgregarUsuarioMigracionComponent } from "../modals/agregar-usuario-migracion.component";
import { EditarParticipantesMigracionComponents } from 'src/app/modules/alcmigracion/modals/modal-editar-participantes-migracion.component';
import { ViewChild } from '@angular/core';
import { TabGroupAnimationsExample1 } from 'src/app/modules/tabsmigracion/views/tab-group-animations-example';

@Component({
  selector: 'bandeja-documento-elaboracion-migracion',
  templateUrl: 'elaboracion-migracion.template.html'
})
export class ElaboracionMigracionComponent implements OnInit {
  @Input() activar: boolean;
  @Input() permisos: any;
  /* Participantes   */
  listaParticipantes: RutaParticipante[];
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  itemCodigo: number;
  errors: any;
  /* datos */
  item: RutaResponsable;
  listaResponsablesEliminadas: RutaParticipante[];
  listaResponsableNuevas: RutaParticipante[];
  plazo: number;
  /* registro seleccionado */
  selectedRow: number;
  /* Lista de Participante */
  participante: RutaParticipante;

  /* Lista de Estados */
  listaEstados: [
    { id: 1, valor: 'ACTIVO' },
    { id: 0, valor: 'INACTIVO' }
  ];
  idElaboracion: number;
  idConsenso: number;
  idAprobacion: number;
  idHomologacion: number;
  idFase: number;
  private sub: any;
  /**Variables para el input***/
  textoBusqueda: number;
  deshabilitarBoton: boolean;
  nuevo: boolean;


  constructor(private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceRuta: RutaResponsablesService,
    private route: ActivatedRoute,
    private _jsonService: JsonService,
    private toastr: ToastrService) {
    this.loading = false;
    this.selectedRow = -1;
    this.listaResponsablesEliminadas = [];
    this.listaResponsableNuevas = [];
    this.parametroBusqueda = 'tipo';
    this.deshabilitarBoton = true;
    this.errors = {};
    this.item = new RutaResponsable();
  }

  controlarError(error) {
    // this.toastr.error('Se present?? un error inesperado en la ??ltima acci??n', 'Error', {closeButton: true});
  }

  ngOnInit() {
    this.listaParticipantes = new Array<RutaParticipante>();
    this.loading = false;
    this.listaEstados = [
      { id: 1, valor: 'ACTIVO' },
      { id: 0, valor: 'INACTIVO' }
    ];

    this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
      (response: Response) => {
        const resultado = response.resultado;
        this.idElaboracion = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_ELABORACION);
        this.idConsenso = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_CONSENSO);
        this.idAprobacion = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_APROBACION);
        this.idHomologacion = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_HOMOLOGACION);
        this.idFase = this.idElaboracion;
      },
      (error) => this.controlarError(error)
    );

    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['id'];
    });
    if (this.itemCodigo) {
      this.serviceRuta.buscarPorCodigo(this.itemCodigo).subscribe(
        (response: Response) => {
          this.item = response.resultado[0];
        },
        (error) => this.controlarError(error)
      );
    } else {
      this.item = this.serviceRuta.crear();
    }
    if (this.item == null) { this.item = new RutaResponsable(); }

    for (let i: number = 0; i < this.item.listaElaboracion.length; i++) {
      this.participante.comentario = "";

    }


  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
  }

  onEliminar(indice: number, item: RutaParticipante): void {
    if (!this.nuevo) {
      let index: number;
      let encontro: boolean = false;
      for (let i: number = 0; i < this.listaResponsableNuevas.length; i++) {
        let responsableObj = this.listaResponsableNuevas[i];
        if (responsableObj.equipoColaborador == (item.equipoColaborador) && (responsableObj.funcion == item.funcion) && (responsableObj.responsable == item.responsable)) {
          let contador: number = 0;
        }
        if (encontro) {
          index = i;
          break;
        }
      }
      if (encontro) {
        let ListaNueva = this.listaResponsableNuevas[index];
        this.listaResponsableNuevas.splice(index, 1);
      } else {
        this.listaResponsablesEliminadas.push(item);
      }
    }
    this.item.listaElaboracion.splice(indice, 1);
    sessionStorage.setItem('elaboracion', JSON.stringify(this.item.listaElaboracion));
    this.toastr.info('Registro eliminado', 'Acci??n completada!', { closeButton: true });
  }
  /*Habilita Bot??n segun el input*/
  habilitarBoton() {
    if (this.textoBusqueda != 0)
      this.deshabilitarBoton = false;
    else
      this.deshabilitarBoton = true;
  }
  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }
  OnActualizar(indice: number, item: RutaParticipante) {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: { prueba: 'texto', objeto: Object.assign({}, item) },
      class: 'modal-lg'
    };
    this.bsModalRef = this.modalService.show(EditarParticipantesMigracionComponents, config);
    (<EditarParticipantesMigracionComponents>this.bsModalRef.content).onClose.subscribe(result => {
      const objeto: RutaParticipante = result;
      this.item.listaElaboracion[indice] = result;
      sessionStorage.setItem('elaboracion', JSON.stringify(this.item.listaElaboracion));
    });
  }

  obtenerRequestElaboracion(estado: number): RutaParticipante {
    let objeto: RutaParticipante = new RutaParticipante;
    objeto.idRuta = this.itemCodigo;
    objeto.idFase = this.idFase;
    objeto.estado = Estado.ACTIVO;
    if (this.idFase == this.idElaboracion) { this.item.listaElaboracion.push(objeto) }
    localStorage.setItem("idColaboradorElaboracion", objeto.idColaborador + "");
    return objeto;
  }

  OnNuevo() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nivel: "128",
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(AgregarUsuarioMigracionComponent, config);
    (<AgregarUsuarioMigracionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RutaParticipante = result;
      objeto.idRuta = this.itemCodigo;
      objeto.idFase = this.idFase;
      objeto.estado = Estado.ACTIVO;
      if (this.idFase == this.idElaboracion) { this.item.listaElaboracion.push(objeto) }
      else if (this.idFase == this.idConsenso) { this.item.listaConsenso.push(objeto) }
      else if (this.idFase == this.idConsenso) { this.item.listaConsenso.push(objeto) }
      else if (this.idFase == this.idAprobacion) { this.item.listaAprobacion.push(objeto) }
      else if (this.idFase == this.idHomologacion) { this.item.listaHomologacion.push(objeto) }

      sessionStorage.setItem('elaboracion', JSON.stringify(this.item.listaElaboracion));
    });
  }


}

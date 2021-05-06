import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, EventEmitter } from '@angular/core';
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
import { EditarParticipantesComponents } from 'src/app/modules/bandejadocumento/modales/modal-editar-participantes.component';
import { Colaborador } from 'src/app/models/colaborador';
import { debug } from 'util';
//cguerra segurdidad
import { SessionService } from 'src/app/auth/session.service';
import { Router } from '@angular/router';
//cguerra segurdidad
declare var jQuery: any;

@Component({
  selector: 'bandeja-documento-consenso',
  templateUrl: 'consenso.template.html',
  styleUrls: ['consenso.template.scss']
})
export class ConsensoComponent implements OnInit {

  @Input() activar: boolean;
  @Input() permisos: any;
  @Output() agregarConsenso: EventEmitter<any> = new EventEmitter<any>();
  @Output() eliminarConsenso: EventEmitter<any> = new EventEmitter<any>();
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
  // items:RutaParticipante[];       
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
  //Id de las Etapas
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
  listaEjemplares: RutaParticipante[];
  //cguerra Seguridad
  rutaActual: string;
  rutaAnterior: string;
  rutaAnteriorAnterior: string;
  habilitar: Boolean;

  constructor(private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceRuta: RutaResponsablesService,
    private route: ActivatedRoute,
    private _jsonService: JsonService,
    private toastr: ToastrService,
    ///cguerra seguridad
    public session: SessionService,
    private router: Router)
  ///cguerra seguridad
    /*private router: Router,
    private service: PlanAuditoriaService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) */ {
    this.loading = false;
    this.item = new RutaResponsable();
    this.selectedRow = -1;
    //this.items = [];
    this.listaResponsablesEliminadas = [];
    this.listaResponsableNuevas = [];
    this.parametroBusqueda = 'tipo';
    this.deshabilitarBoton = true;
    this.errors = {};
    //cguerra seguridad
    this.rutaActual = this.router.url;
    let item = JSON.parse(sessionStorage.getItem("item"));
    console.log("SESSIONSTORAGECONSENSO")
    console.log(item);
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
    let nuevo = item.nuevo;
    let edicion = item.edicion
    console.log("VALOR DEL ITEMELABORACIOn")
    console.log(item)
    console.log(nuevo)
    console.log(edicion)

    if (nuevo == true) {
      this.habilitar = true;
    } else {
      this.habilitar = false;
    }

    //cguerra seguridad

  }
  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  ngAfterViewInit() {
    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  ngOnInit() {

    console.log("CONCENSO");
    console.log(this.rutaActual);
    console.log(this.rutaAnterior);
    console.log(this.rutaAnteriorAnterior)


    let listaConsenso = JSON.parse(sessionStorage.getItem("objListaConsenso"));
    console.log(listaConsenso);
    this.listaParticipantes = new Array<RutaParticipante>();
    //this.items = [];
    this.loading = false;
    //FASE Inicio

    this.listaEstados = [
      { id: 1, valor: 'ACTIVO' },
      { id: 0, valor: 'INACTIVO' }
    ];

    this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idElaboracion = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_ELABORACION);
        this.idConsenso = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_CONSENSO);
        this.idAprobacion = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_APROBACION);
        this.idHomologacion = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.ETAPA_RUTA_HOMOLOGACION);
        this.idFase = this.idConsenso;
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
          //this.OnActualizar();
        },
        (error) => this.controlarError(error)
      );
      //this.item=this.items[0];
    } else {
      this.item = this.serviceRuta.crear();
      //this.item.tipo = this.listaTipos[0];
    }
    if (this.item == null) this.item = new RutaResponsable();
    //FASE Fin
  }
  /*
    ngAfterViewInit() {
      this.OnActualizar();
    }
  */
  OnImportar() {
    /*this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ImportarRutaComponents, config);
    (<ImportarRutaComponents>this.bsModalRef.content).onClose.subscribe(result => {
      //this.busquedaPlan = result;
      //this.OnBuscar();
    });*/
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    // this.selectedObject = obj;
  }

  onEliminar(indice: number, item: RutaParticipante): void {
    /*if (!this.nuevo) {
      let index: number;
      let encontro: boolean = false;
      for (let i: number = 0; i < this.listaResponsableNuevas.length; i++) {
        let responsableObj = this.listaResponsableNuevas[i];
        console.log(responsableObj);
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
    }*/
    let equipoEliminado = this.item.listaConsenso[indice].equipo;
    this.item.listaConsenso.splice(indice, 1);
    if (!this.item.listaConsenso.find(colaborador => colaborador.equipo.id === equipoEliminado.id)) {
      this.eliminarConsenso.emit(equipoEliminado);
    }
    this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
    sessionStorage.setItem('listConseso', JSON.stringify(this.item.listaConsenso));
  }
  /*Habilita Botón segun el input*/
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
  /* Abrimos Modal Editar Participantes(Elaboración)  */
  OnActualizar(indice: number, item: RutaParticipante) {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      //datos de regreso
      initialState: { prueba: "texto", objeto: Object.assign({}, item) },
      //datos de regreso
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(EditarParticipantesComponents, config);
    (<EditarParticipantesComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RutaParticipante = result;
      //datos de regreso 
      this.item.listaConsenso[indice] = result;
      sessionStorage.setItem('listConseso', JSON.stringify(this.item.listaConsenso));
    });
  }

  obtenerRequestElaboracion(estado: number): RutaParticipante {
    let objeto: RutaParticipante = new RutaParticipante;
    objeto.idRuta = this.itemCodigo;
    objeto.idFase = this.idFase;
    objeto.estado = Estado.ACTIVO;
    if (this.idFase == this.idElaboracion) { this.item.listaElaboracion.push(objeto) }

    return objeto;
  }

  OnNuevo() {
    sessionStorage.setItem('listConseso', JSON.stringify(this.item.listaConsenso));
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nivel: "129",
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(AgregarUsuarioComponents, config);
    (<AgregarUsuarioComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RutaParticipante = result;
      objeto.idRuta = this.itemCodigo;
      objeto.idFase = this.idFase;
      objeto.estado = Estado.ACTIVO;

      if (this.idFase == this.idElaboracion) { this.item.listaElaboracion.push(objeto) }
      else if (this.idFase == this.idConsenso) { this.item.listaConsenso.push(objeto) }
      else if (this.idFase == this.idAprobacion) { this.item.listaAprobacion.push(objeto) }
      else if (this.idFase == this.idHomologacion) { this.item.listaHomologacion.push(objeto) }

      this.agregarConsenso.emit(objeto.equipo);
    });
  }

}
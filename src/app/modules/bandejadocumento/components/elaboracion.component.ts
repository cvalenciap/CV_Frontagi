import { Component,OnInit,Output,Input,OnChanges,SimpleChanges,EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumento } from '../../../models';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Constante, Estado } from 'src/app/models/enums';
import { ParametrosService, RutaResponsablesService, JsonService } from 'src/app/services';
import { RutaResponsable } from 'src/app/models/rutaresponsable';
import { ActivatedRoute, Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Subject } from 'rxjs';
import { EditarParticipantesComponents } from 'src/app/modules/bandejadocumento/modales/modal-editar-participantes.component';
import { Colaborador } from 'src/app/models/colaborador';
import { SessionService } from 'src/app/auth/session.service';


 
@Component({
  selector: 'bandeja-documento-elaboracion',
  templateUrl: 'elaboracion.template.html',
  styleUrls: ['elaboracion.template.scss']
})
export class ElaboracionComponent implements OnInit {

  @Input() activar:boolean;
  @Input() permisos:any;
  @Output() agregarElaboracion:EventEmitter<any> = new EventEmitter<any>();
  @Output() eliminarElaboracion:EventEmitter<any> = new EventEmitter<any>();
  /* Participantes   */
  listaParticipantes: RutaParticipante[];


  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  itemCodigo: number;
  errors:any;
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
  habilitar: boolean;

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
  //nuevo: boolean;
  rutaActual:string;
  rutaAnterior:string;
  rutaAnteriorAnterior:string;

  constructor(private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceRuta: RutaResponsablesService,
    private route: ActivatedRoute,
    private router: Router,
    private _jsonService : JsonService,
    private toastr: ToastrService,
    public session: SessionService)
    /*private router: Router,
    private service: PlanAuditoriaService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) */ {

    this.loading = false;
    this.selectedRow = -1;
    this.listaResponsablesEliminadas = [];
    this.listaResponsableNuevas = [];
    this.parametroBusqueda = 'tipo';
    this.deshabilitarBoton = true;
    this.errors={};
    this.rutaActual = this.router.url;
    this.habilitar= true;

    let item = JSON.parse(sessionStorage.getItem("item"));
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
 
    let nuevo = item.nuevo;
    let edicion = item.edicion
    
    if(nuevo==true){
      this.habilitar= true;
    }else{
      this.habilitar= false;
    }
  }


  controlarError(error) {
    console.error(error);
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
        let resultado = response.resultado;
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
    if (this.item == null) this.item = new RutaResponsable();
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
  }

  onEliminar(indice: number, item: RutaParticipante): void {
    let equipoEliminado = this.item.listaElaboracion[indice].equipo;
    this.item.listaElaboracion.splice(indice, 1);
    if(!this.item.listaElaboracion.find(colaborador => colaborador.equipo.id===equipoEliminado.id)) {
      this.eliminarElaboracion.emit(equipoEliminado);
    }
    sessionStorage.setItem('listElaboracion', JSON.stringify(this.item.listaElaboracion));
    this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
  }

  habilitarBoton() {
    if (this.textoBusqueda != 0)
      this.deshabilitarBoton = false;
    else
      this.deshabilitarBoton = true;
  }
  permitirNumero(evento): void {
    if(!(evento.which>=48 && evento.which<=57))  
     evento.preventDefault();  
  }

  OnActualizar(indice:number,item: RutaParticipante){ 
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {prueba:"texto",objeto: Object.assign({},item)},
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(EditarParticipantesComponents, config);
    (<EditarParticipantesComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto:RutaParticipante = result;
      this.item.listaElaboracion[indice] = result;
      sessionStorage.setItem('listElaboracion', JSON.stringify(this.item.listaElaboracion));
    });    
  }

  obtenerRequestElaboracion(estado:number):RutaParticipante{      
    let objeto: RutaParticipante = new RutaParticipante;
    objeto.idRuta = this.itemCodigo;  
    objeto.idFase = this.idFase;
    objeto.estado = Estado.ACTIVO;
    
    if (this.idFase == this.idElaboracion) {this.item.listaElaboracion.push(objeto)}     
    return objeto;
  }

  OnNuevo() {
    sessionStorage.setItem('listElaboracion', JSON.stringify(this.item.listaElaboracion));
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nivel:"128",
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(AgregarUsuarioComponents, config);
    (<AgregarUsuarioComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RutaParticipante = result;
      objeto.idRuta = this.itemCodigo;
      objeto.idFase = this.idFase;
      objeto.estado = Estado.ACTIVO;
 
      if (this.idFase == this.idElaboracion) {this.item.listaElaboracion.push(objeto)}  
      else if (this.idFase == this.idConsenso) {this.item.listaConsenso.push(objeto)}
      else if (this.idFase == this.idAprobacion) {this.item.listaAprobacion.push(objeto)}
      else if (this.idFase == this.idHomologacion) {this.item.listaHomologacion.push(objeto)}
      
      this.agregarElaboracion.emit(objeto.equipo);
    });
  }

}
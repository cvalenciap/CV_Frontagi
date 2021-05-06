import { Component, OnInit, Input } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumento } from '../../../models';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Constante, Estado } from 'src/app/models/enums';
import { ParametrosService, RutaResponsablesService } from 'src/app/services';
import { RutaResponsable } from 'src/app/models/rutaresponsable';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../../models/response';
import { Subject } from 'rxjs';
import { EditarParticipantesComponents } from 'src/app/modules/bandejadocumento/modales/modal-editar-participantes.component';
import {AgregarUsuarioMigracionComponent} from "../modals/agregar-usuario-migracion.component";
import { EditarParticipantesMigracionComponents } from 'src/app/modules/alcmigracion/modals/modal-editar-participantes-migracion.component';
import { RutaParticipanteMigracion } from 'src/app/models/rutaParticipanteMigracion';



@Component({
  selector: 'bandeja-documento-aprobacion-migracion',
  templateUrl: 'aprobacion-migracion.template.html'
})
export class AprobacionMigracionComponent implements OnInit {

  @Input()
  activar: boolean;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  itemCodigo: number;
  @Input()
  permisos:any;
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

  constructor(private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceRuta: RutaResponsablesService,
    private route: ActivatedRoute,
    private toastr: ToastrService)
    /*private router: Router,
    private service: PlanAuditoriaService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) */ {
    this.loading = false;
    
    this.selectedRow = -1;
    //this.items = [];
    this.listaResponsablesEliminadas = [];
    this.listaResponsableNuevas = [];
    this.parametroBusqueda = 'tipo';
    this.deshabilitarBoton = true;    
  }
  controlarError(error) {    
  }

  ngOnInit() {
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
        this.idFase = this.idAprobacion;
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

  ngAfterViewInit() {
   // this.OnActualizar();
  }

  OnImportar() {           
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    // this.selectedObject = obj;
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
    this.item.listaAprobacion.splice(indice, 1);
    sessionStorage.setItem('aprobacion', JSON.stringify(this.item.listaAprobacion));
    this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
  }
  /*Habilita Botón segun el input*/
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
/*Actualizar Dias de Plazo */
OnActualizar(indice:number,item: RutaParticipante){ 
  const config = <ModalOptions>{
    ignoreBackdropClick: true,
    keyboard: false,
    //datos de regreso
    initialState: {prueba:"texto",objeto: Object.assign({},item)},
    //datos de regreso
    class: 'modal-lg'
  }
  this.bsModalRef = this.modalService.show(EditarParticipantesMigracionComponents, config);
  (<EditarParticipantesMigracionComponents>this.bsModalRef.content).onClose.subscribe(result => {
    let objeto:RutaParticipanteMigracion = result;
    //datos de regreso 
    this.item.listaAprobacion[indice] = result; 

    sessionStorage.setItem('aprobacion', JSON.stringify(this.item.listaAprobacion));
  });    
}
  OnCambiar(){   
    /* Abrimos Modal Editar Participantes(Elaoración)  */
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(EditarParticipantesComponents, config);
    (<EditarParticipantesComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto:RutaParticipante = result;
      objeto.idRuta=this.itemCodigo;
      objeto.idFase=this.idFase;
      objeto.estado=Estado.ACTIVO;
      if(this.idFase==this.idElaboracion)       this.item.listaElaboracion.push(objeto);
      else if(this.idFase==this.idConsenso)     this.item.listaConsenso.push(objeto);
      else if(this.idFase==this.idAprobacion)   this.item.listaAprobacion.push(objeto);
      else if(this.idFase==this.idHomologacion) this.item.listaHomologacion.push(objeto);

      sessionStorage.setItem('aprobacion', JSON.stringify(this.item.listaAprobacion));
    });    
  }
  OnNuevo() {    
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nivel:"130",
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(AgregarUsuarioMigracionComponent, config);
    (<AgregarUsuarioMigracionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RutaParticipante = result;
      objeto.idRuta = this.itemCodigo;
      objeto.idFase = this.idFase;
      objeto.estado = Estado.ACTIVO;      
      if (this.idFase == this.idElaboracion) {this.item.listaElaboracion.push(objeto)
          this.item.listaElaboracion.forEach(participante=> participante.plazo = this.plazo);}
      else if (this.idFase == this.idConsenso){ this.item.listaConsenso.push(objeto);
        this.item.listaElaboracion.forEach(participante=> participante.plazo = this.plazo);}
      else if (this.idFase == this.idConsenso) {this.item.listaConsenso.push(objeto);
        this.item.listaElaboracion.forEach(participante=> participante.plazo = this.plazo);}
      else if (this.idFase == this.idAprobacion) {this.item.listaAprobacion.push(objeto);
        this.item.listaElaboracion.forEach(participante=> participante.plazo = this.plazo);}
      else if (this.idFase == this.idHomologacion){ this.item.listaHomologacion.push(objeto);
        this.item.listaElaboracion.forEach(participante=> participante.plazo = this.plazo);}

        sessionStorage.setItem('aprobacion', JSON.stringify(this.item.listaAprobacion));
    });    
  }
}

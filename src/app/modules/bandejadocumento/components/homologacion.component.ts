import { Component, OnInit, Input, OnChanges,Output, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumento } from '../../../models';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Constante, Estado } from 'src/app/models/enums';
import { ParametrosService, RutaResponsablesService,JsonService } from 'src/app/services';
import { RutaResponsable } from 'src/app/models/rutaresponsable';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../../models/response';
import { Subject } from 'rxjs';
import { debug } from 'util';
import { EditarParticipantesComponents } from 'src/app/modules/bandejadocumento/modales/modal-editar-participantes.component';
//cguerra segurdidad
import { SessionService } from 'src/app/auth/session.service';
import { Router } from '@angular/router';
//cguerra segurdidad

@Component({
  selector: 'bandeja-documento-homologacion',
  templateUrl: 'homologacion.template.html',
  styleUrls: ['homologacion.template.scss']
})
export class HomologacionComponent implements OnInit {

  @Input() activar: boolean;
  //@Input() permisos: boolean;
  @Input() permisos:any;
  @Output() agregarHomologacion:EventEmitter<any> = new EventEmitter<any>();
  @Output() eliminarHomologacion:EventEmitter<any> = new EventEmitter<any>();
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  itemCodigo: number;
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
  //cguerra Seguridad
  rutaActual:string;
  rutaAnterior:string;
  rutaAnteriorAnterior:string;
  habilitar: Boolean;
  
  constructor(private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceRuta: RutaResponsablesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    ///cguerra seguridad
    public session: SessionService, 
    private router: Router)
  ///cguerra seguridad
   {
    this.loading = false;
    this.selectedRow = -1;
    //this.items = [];
    this.listaResponsablesEliminadas = [];
    this.listaResponsableNuevas = [];
    this.parametroBusqueda = 'tipo';
    this.deshabilitarBoton = true;
    //cguerra seguridad
    this.rutaActual = this.router.url;
    let item = JSON.parse(sessionStorage.getItem("item"));
    console.log("SESSIONSTORAGEHOMOLOGACION")
    console.log(item);
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
    let nuevo = item.nuevo;
    let edicion = item.edicion
    if(nuevo==true){
      this.habilitar= true;
    }else{
      this.habilitar= false;
    }
    //cguerra seguridad
  }

  controlarError(error) {
    console.error(error);    
  }

  ngOnInit() {  
    console.log("HOMOLOGACION");
    console.log(this.rutaActual);
    console.log(this.rutaAnterior);
    console.log(this.rutaAnteriorAnterior)


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
        this.idFase = this.idHomologacion;
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

  ngAfterViewInit() {
    
  }

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
    let equipoEliminado = this.item.listaHomologacion[indice].equipo;
    this.item.listaHomologacion.splice(indice, 1);
    if(!this.item.listaHomologacion.find(colaborador => colaborador.equipo.id===equipoEliminado.id)) {
      this.eliminarHomologacion.emit(equipoEliminado);
    }
    this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
    
    sessionStorage.setItem('listHomologacion', JSON.stringify(this.item.listaHomologacion));
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

/* Abrimos Modal Editar Participantes(Elaboración)  */
OnActualizar(indice:number,item: RutaParticipante){ 
  const config = <ModalOptions>{
    ignoreBackdropClick: true,
    keyboard: false,
    //datos de regreso
    initialState: {prueba:"texto",objeto: Object.assign({},item)},
    //datos de regreso
    class: 'modal-lg'
  }
  this.bsModalRef = this.modalService.show(EditarParticipantesComponents, config);
  (<EditarParticipantesComponents>this.bsModalRef.content).onClose.subscribe(result => {
    let objeto:RutaParticipante = result;
    //datos de regreso 
    this.item.listaHomologacion[indice] = result;
    sessionStorage.setItem('listHomologacion', JSON.stringify(this.item.listaHomologacion));
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
      sessionStorage.setItem('listHomologacion', JSON.stringify(this.item.listaHomologacion));
    });    
  }
  OnNuevo() {
    sessionStorage.setItem('listHomologacion', JSON.stringify(this.item.listaHomologacion));
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nivel: "131",
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
      else if (this.idFase == this.idConsenso) { this.item.listaConsenso.push(objeto); }
      else if (this.idFase == this.idAprobacion) { this.item.listaAprobacion.push(objeto); }
      else if (this.idFase == this.idHomologacion) { this.item.listaHomologacion.push(objeto); }

      this.agregarHomologacion.emit(objeto.equipo);
    });
  }
}

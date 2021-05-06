import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
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
import { SessionService } from 'src/app/auth/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bandeja-documento-aprobacion',
  templateUrl: 'aprobacion.template.html',
  styleUrls: ['aprobacion.template.scss']
})
export class AprobacionComponent implements OnInit {

  @Input() activar: boolean;
  @Input() permisos:any;
  @Output() agregarAprobacion:EventEmitter<any> = new EventEmitter<any>();
  @Output() eliminarAprobacion:EventEmitter<any> = new EventEmitter<any>();
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
  habilitar:Boolean;

  constructor(private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private serviceRuta: RutaResponsablesService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    //Cguerra Seguridad
    public session: SessionService,
    private router: Router)
    //Cguerra Seguridad
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
  }
  OnImportar() {           
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;    
  }
  onEliminar(indice: number, item: RutaParticipante): void {    
    let equipoEliminado = this.item.listaAprobacion[indice].equipo;
    this.item.listaAprobacion.splice(indice, 1);
    if(!this.item.listaAprobacion.find(colaborador => colaborador.equipo.id===equipoEliminado.id)) {
      this.eliminarAprobacion.emit(equipoEliminado);
    }
    this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
    sessionStorage.setItem('listAprobacion', JSON.stringify(this.item.listaAprobacion));
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
    initialState: {prueba:"texto",objeto: Object.assign({},item)},    
    class: 'modal-lg'
  }
  this.bsModalRef = this.modalService.show(EditarParticipantesComponents, config);
  (<EditarParticipantesComponents>this.bsModalRef.content).onClose.subscribe(result => {
    let objeto:RutaParticipante = result;    
    this.item.listaAprobacion[indice] = result;
    sessionStorage.setItem('listAprobacion', JSON.stringify(this.item.listaAprobacion));
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

      sessionStorage.setItem('listAprobacion', JSON.stringify(this.item.listaAprobacion));
    });
  }
  OnNuevo() {    
    sessionStorage.setItem('listAprobacion', JSON.stringify(this.item.listaAprobacion));
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nivel:"130",
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
      else if (this.idFase == this.idConsenso){this.item.listaConsenso.push(objeto);}        
      else if (this.idFase == this.idAprobacion) {this.item.listaAprobacion.push(objeto);}        
      else if (this.idFase == this.idHomologacion){this.item.listaHomologacion.push(objeto);}
      
      this.agregarAprobacion.emit(objeto.equipo);
    });    
  }
}

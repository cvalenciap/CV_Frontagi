import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
import { ColaboradoresService, EquiposService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../models/response';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';
declare var jQuery: any;

@Component({
  selector: 'modal-agregar-colaborador',
  templateUrl: 'agregar-colaborador.template.html',
  providers: [EquiposService, ColaboradoresService]
})
export class AgregarColaboradorComponents implements OnInit {
  public onClose: Subject<RutaParticipante>;
  public interruptorAceptar: boolean;
  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;

  plazo: number;
  hoy: Date;
  fecha: Date;
  textoFecha: string;
  equipo: number;
  funcion: string;
  responsable: string;
  listaEquipos: Equipo[];
  listaColaborador: Colaborador[];
  lstColabAux : Colaborador[];
  colaborador: RutaParticipante
  /* Paginación */
  paginacion: Paginacion;
  lstParticipante : RutaParticipante[];
  participante: RutaParticipante;

  /* Registro seleccionado */
  selectedRow: number;
  selectedObject: Colaborador;
  selectedObj : RutaParticipante;
  filaSeleccionada:number;

  nombre: string;
  apellidoPaterno: string;
  apellidoMaterno: string;
  responsableCola:RutaParticipante=new RutaParticipante;
  constructor(public bsModalRef: BsModalRef,
              private toastr: ToastrService,
              private serviceEquipo: EquiposService,
              private serviceColaborador: ColaboradoresService,) {
    this.onClose = new Subject();
    this.lstColabAux = [];
    this.lstParticipante = [];
    this.hoy = new Date();
    this.limpiar();
  }

  limpiar() {
    this.paginacion = new Paginacion({registros: 10});
    this.listaColaborador = [];
    this.selectedRow = -1;
    this.fecha = this.hoy;
    this.equipo = null;
    this.funcion = "";
    this.responsable = "";
    this.plazo = 0;
    this.textoFecha = (this.hoy.getDate()<9?"0":"") + this.hoy.getDate() + "/" + 
                      ((this.hoy.getMonth()+1)<9?"0":"") + (this.hoy.getMonth()+1) + "/" + 
                      this.hoy.getFullYear();
  }

  calcularFecha() {
    this.fecha = new Date(this.hoy.getTime()+(1000*60*60*24*this.plazo));
    this.textoFecha = (this.fecha.getDate()<9?"0":"") + this.fecha.getDate() + "/" + 
                      ((this.fecha.getMonth()+1)<9?"0":"") + (this.fecha.getMonth()+1) + "/" + 
                      this.fecha.getFullYear();
  }

  permitirNumero(evento): void {
    if(!(evento.which>=48 && evento.which<=57))
      evento.preventDefault();
  }

  ngOnInit() {
    
    this.loading = false;
    this.listaEquipos = [];

    const parametros: {id?:string, nombre?:string, jefe?:string, estado?:string} =
      {id: null, nombre:null, jefe: null, estado: "1"};

    this.serviceEquipo.buscarPorParametros(parametros).subscribe(
      (response: Response) => {
        this.listaEquipos = response.resultado;
        this.loading = false; },
      (error) => this.controlarError(error)
    );
  }
  
  cancelar(){
    this.bsModalRef.hide();
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  buscar(){

    const parametros: {id?:string, equipo?:string, funcion?:string,  nombre?: string, apellidoPaterno?: string, apellidoMaterno?: string, estado?:string}=
    {id: null, equipo:null, funcion:null, nombre:null, apellidoPaterno:null, apellidoMaterno:null, estado:"1"};
    if(this.equipo!=null)  parametros.equipo = this.equipo+"";
    if(this.funcion!=null) parametros.funcion = this.funcion;
    if(this.nombre!=null) parametros.nombre  =this.nombre;
    if(this.apellidoPaterno!=null) parametros.apellidoPaterno = this.apellidoPaterno;
    if(this.apellidoMaterno!=null) parametros.apellidoMaterno = this.apellidoMaterno;
    // if(this.responsable!=null) parametros.responsable=this.responsable;
    this.serviceColaborador.buscarColaborador(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        
        this.listaColaborador = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (error) => this.controlarError(error)
    );
  }

  // seleccionar(){
  //   let objeto:RutaParticipante=new RutaParticipante();
  //   objeto.plazo=this.plazo;
  //   objeto.equipoColaborador=this.selectedObject.equipo.descripcion;
  //   objeto.funcion=this.selectedObject.funcion;
  //   objeto.responsable=this.selectedObject.nombreCompleto;
  //   // YPM - INICIO
  //   objeto.idColaborador = this.selectedObject.idColaborador;
  //   // YPM - FIN
  //   this.onClose.next(objeto);
  //   this.bsModalRef.hide();
  // }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.buscar();
  }

  OnPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
      this.buscar();
  }

  OnRowClick(index, obj): void {
      
      this.selectedRow = index;
      this.selectedObject = obj;
  }

  seleccionarColaborador(index, obj): void {
    this.filaSeleccionada = index;
    this.responsableCola=obj;
   
  }

  agregar(){
    
  
    this.participante = new RutaParticipante();
    this.participante = this.responsableCola;
   
    this.onClose.next(this.participante);
    this.bsModalRef.hide();
  }

}
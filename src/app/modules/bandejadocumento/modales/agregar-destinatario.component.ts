import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';
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

declare var jQuery:any;
@Component({
  selector: 'bandeja-documento-modales-agregar-usuario',
  templateUrl: 'agregar-destinatario.template.html', 
  providers: [EquiposService, ColaboradoresService]
})
export class AgregarDestinatarioComponents implements OnInit {
  public onClose: Subject<RutaParticipante>;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;

  plazo: number;
  prioridad: number;
  hoy: Date;
  fecha: Date;
  textoFecha: string;
  deshabilitarLimpiar: boolean;
  equipo: number;
  funcion: string;
  responsable: string;
  appaterno: string;
  appmaterno: string;
  listaEquipos: Equipo[];
  listaColaborador: Colaborador[];

  /* Paginaci�n */
  paginacion: Paginacion;

  /* Registro seleccionado */
  selectedRow: number;
  selectedObject: Colaborador;

  constructor(public bsModalRef: BsModalRef,
              private toastr: ToastrService,
              private serviceEquipo: EquiposService,
              private serviceColaborador: ColaboradoresService,) {
    this.onClose = new Subject();
    this.hoy = new Date();
    this.limpiar();
    this.deshabilitarLimpiar= true;
  }
//Habilitar Botón Limpiar 
  habilitarLimpiar(): void {
    if(this.responsable!=''||this.appaterno!='' || this.appmaterno!='' || this.equipo !=null || this.plazo !=0 || this.prioridad !=0 || this.funcion!='')
      this.deshabilitarLimpiar=false;
    else
      this.deshabilitarLimpiar=true;
  }    
  

  limpiar() {
    this.paginacion = new Paginacion({registros: 10});
    this.listaColaborador = [];
    this.selectedRow = -1;
    this.fecha = this.hoy;
    this.equipo = null;
    this.funcion = "";
    this.appaterno= "";
    this.appmaterno= "";
    this.responsable = "";
    this.plazo = 0;
    this.prioridad = 0;
    this.textoFecha = (this.hoy.getDate()<9?"0":"") + this.hoy.getDate() + "/" + 
                      ((this.hoy.getMonth()+1)<9?"0":"") + (this.hoy.getMonth()+1) + "/" + 
                      this.hoy.getFullYear();
                      this.habilitarLimpiar();
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
    this.toastr.error('Se presento un error inesperado en la ultima accion', 'Error', {closeButton: true});
  }

  buscar(){
    
 
    const parametros: {id?:string, equipo?:string, funcion?:string, responsable?:string,apellidoPaterno?:string, apellidoMaterno?:string, estado?:string}=
    {id: null, equipo:null, funcion:null, responsable:null,apellidoMaterno:null,apellidoPaterno:null, estado:"1"};
    if(this.equipo!=null)      parametros.equipo     =this.equipo+"";
    if(this.funcion!=null)     parametros.funcion    =this.funcion;
    if(this.responsable!=null) parametros.responsable=this.responsable;
    if(this.appaterno!=null) parametros.apellidoPaterno=this.appaterno;
    if(this.appmaterno!=null) parametros.apellidoMaterno=this.appmaterno;
    this.serviceColaborador.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        
        this.listaColaborador = response.resultado;
        this.loading = false; 
        this.paginacion = new Paginacion(response.paginacion);},
      (error) => this.controlarError(error)
    );
  }

  seleccionar(){
    
    let objeto:RutaParticipante=new RutaParticipante();

    objeto.prioridad=this.prioridad;
    objeto.plazo=this.plazo;
    objeto.equipoColaborador=this.selectedObject.equipo.descripcion;
    objeto.funcion=this.selectedObject.funcion;
    objeto.responsable=this.selectedObject.nombreCompleto;
 
    //ID Colaborador
    objeto.idColaborador = this.selectedObject.idColaborador;
    objeto.numeroFicha = this.selectedObject.numeroFicha;
    
    this.onClose.next(objeto);
    this.bsModalRef.hide();
    console.log(this.plazo);
    console.log(this.prioridad);
  }

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
      let nombreCompleto = obj.nombre+" "+obj.apellidoPaterno+" "+obj.apellidoMaterno;
      sessionStorage.setItem("descparticipante",nombreCompleto);
      sessionStorage.setItem("idparticipante",obj.idColaborador);
  }

}

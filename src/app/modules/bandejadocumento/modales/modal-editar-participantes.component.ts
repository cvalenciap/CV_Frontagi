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
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'modal-editar-participantes',
  templateUrl: 'modal-editar-participantes.template.html',
  providers: [EquiposService, ColaboradoresService]
})
export class EditarParticipantesComponents implements OnInit {
  public onClose: Subject<RutaParticipante>;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  prueba: string;
  plazo: number;
  hoy: Date;
  fecha: Date;
  textoFecha: string;
  equipo: number;
  funcion: string;
  responsable: string;
  listaEquipos: Equipo[];
  listaColaborador: Colaborador[];
  itemCodigo: number;
  /* Paginación */
  paginacion: Paginacion;
  private sub: any;
  /* Registro seleccionado */
  selectedRow: number;
  selectedObject: Colaborador;
  //trae
  objeto:RutaParticipante;
  //trae
  constructor(public bsModalRef: BsModalRef,
              private toastr: ToastrService,
              private serviceEquipo: EquiposService,
              private serviceColaborador: ColaboradoresService,
              private route: ActivatedRoute) {
    this.onClose = new Subject();
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
   
    console.log(this.objeto);
    

 //   this.itemCodigo = 
//
  /*  this.loading = false;
    this.listaEquipos = [];

    const parametros: {id?:string, nombre?:string, jefe?:string, estado?:string} =
      {id: null, nombre:null, jefe: null, estado: "1"};

    this.serviceEquipo.buscarPorParametros(parametros).subscribe(
      (response: Response) => {
        this.listaEquipos = response.resultado;
        this.loading = false; },
      (error) => this.controlarError(error)
    );*/
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
    const parametros: {id?:string, equipo?:string, funcion?:string, responsable?:string, estado?:string}=
    {id: null, equipo:null, funcion:null, responsable:null, estado:"1"};
    if(this.equipo!=null)      parametros.equipo     =this.equipo+"";
    if(this.funcion!=null)     parametros.funcion    =this.funcion;
    if(this.responsable!=null) parametros.responsable=this.responsable;
    this.serviceColaborador.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaColaborador = response.resultado;
        this.loading = false; },
      (error) => this.controlarError(error)
    );
  }

  seleccionar(){
    let objeto:RutaParticipante=new RutaParticipante();
    console.log(objeto);
    this.onClose.next(this.objeto);
    this.bsModalRef.hide();
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
  }

}
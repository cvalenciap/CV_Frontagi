import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef, ModalOptions } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
import { ValidacionService} from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../models/response';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';
import { Curso } from 'src/app/models/curso';
import { Router, ActivatedRoute } from '@angular/router';
import { Sesion } from 'src/app/models/sesion';
import { SesionService } from 'src/app/services/impl/sesion.service';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { validate } from 'class-validator';

@Component({
  selector: 'modal-agregar-sesion',
  templateUrl: 'agregar-sesion.template.html',
  styleUrls: ['agregar-sesion.component.scss'],
  providers: []
})
export class AgregarSesionComponents implements OnInit {
  modalService: any;
  public onClose: Subject<Sesion>;

  cantItem:string;
  horas:string;
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
  datoSesion: Sesion;
  sesionTmp: Sesion;
  nuevo: boolean;
  data: Sesion;
  dispo : any;
  duracion : any;
  nombre: any;
  idCursoTmp: any;
  idSesionTmp: any;
  item: any;
  mensajes: any[];
  errors: any;
  constructor(public bsModalRef: BsModalRef,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: SesionService,
              private serv : ValidacionService,
              ) {
    this.items = [];
    // this.codigo="S0001";
    this.horas="Horas";
    this.onClose = new Subject();
    this.hoy = new Date();
    this.limpiar();
    this.datoSesion = new Sesion();
    this.sesionTmp = new Sesion();
  }
   limpiar() {
    this.paginacion = new Paginacion({registros: 10});
    this.listaCursos = [];
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
    
    this.loading = true;
    
    // if(this.datoSesion.idCurso!=""){
     // this.nuevo = false;
      this.datoSesion.nombreSesion=this.nombre;
      //this.datoSesion.disponibilidad=this.dispo;
      this.datoSesion.duracion=this.duracion;
      if(this.item>0){
        this.datoSesion.itemColumna = this.item;
      }
      
      if(this.codigoSesion>0){
        this.datoSesion.itemColumna=this.codigoSesion;
      }
     
      // this.dataSesion.idSesion = this.idSesionTmp;
      // this.dataSesion.idCurso = this.idCursoTmp;
      // const buscarSesion = this.service.bucarDatoSesion(this.datoSesion.idCurso, this.datoSesion.idSesion).subscribe(
      //   (response: Response)=>{
      //     this.datoSesion = response.resultado;
      //   },(error) => this.controlarError(error)
      // );
    // } else {
    //   this.nuevo = true;
    // }
    
    // const parametros: {id?:string, nombre?:string, descripcion?:string} =
    //   {id: null, nombre:null, descripcion: null};

    // this.serviceCurso.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
    //   (response: Response) => {
    //     this.items = response.resultado;
    //     this.paginacion = new Paginacion(response.paginacion);
    //     this.loading = false; },
    //   (error) => this.controlarError(error)
    // );
  }
  
  cancelar(){
    this.bsModalRef.hide();
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
/*
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
*/
  seleccionar(){
   /* let objeto:RutaParticipante=new RutaParticipante();
    objeto.plazo=this.plazo;
    objeto.equipo=this.selectedObject.equipo.descripcion;
    objeto.funcion=this.selectedObject.funcion;
    objeto.responsable=this.selectedObject.nombreCompleto;
    this.onClose.next(objeto);
    this.bsModalRef.hide();*/
    this.router.navigate([`mantenimiento/encuesta`]);
    this.bsModalRef.hide();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
  //  this.buscar();
  }

  OnPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
    //  this.buscar();
  }

  OnRowClick(index, obj): void {
      this.selectedRow = index;
      this.selectedObject = obj;
  }


  almacenarSesion(){

    
    this.sesionTmp = new Sesion();
    this.sesionTmp.itemColumna = this.codigoSesion;
    this.sesionTmp.nombreSesion = this.datoSesion.nombreSesion;
    this.sesionTmp.duracion = this.datoSesion.duracion;
    this.sesionTmp.disponibilidad = this.datoSesion.disponibilidad;
    
    forkJoin(validate(this.sesionTmp)).subscribe(([errors]:[any])=>{
      this.mensajes = [];
       
      if(errors.length>0){
      this.validarCampos();
      this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', {closeButton: true});
      }else{
        this.onClose.next(this.sesionTmp);
        this.bsModalRef.hide();
      }});
        
      
  }

  validarCampos(){
    
    this.errors = {};
    this.serv.validacionObjeto(this.sesionTmp,this.errors);
  }
  Validar(objectForm) {
    
    this.serv.validacionSingular(this.sesionTmp,objectForm,this.errors);
  }
}
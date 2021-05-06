import { Component, OnInit, Input } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
import { BandejaDocumentoService, ColaboradoresService, EquiposService, ValidacionService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../models/response';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';
import { RutaParticipanteMigracion } from 'src/app/models';
import { validate, Matches,MinLength } from 'class-validator';
declare var jQuery: any;

@Component({
  selector: 'bandeja-documento-modales-agregar-usuario-migracion',
  templateUrl: 'agregar-usuario-migracion.template.html',
  providers: [EquiposService, ColaboradoresService]
})
export class AgregarUsuarioMigracionComponent implements OnInit {
  public loading: boolean;
  public prioridad: number = null;
  //@Matches()
  @MinLength(1, {message: 'Se requiere prueba'})
  public textoNombre: string;
  //public fechaLiberacion: Date;
  public fechaLiberacion: Date;
  public textoFuncion: string;
  public paginacion: Paginacion;
  public listaEquipos: Equipo[];
  selectedRow: number;
  public interruptorAceptar: boolean;
  mensajes: any[];
  public filaSeleccionada: number;
  public textoObservacion: string;
  public textoApellidoPaterno: string;
  public textoApellidoMaterno: string;
  public deshabilitarLimpiar: boolean;
  public colaboradores: Colaborador[];
  //public onClose: Subject<RutaParticipante>;
  public onClose: Subject<RutaParticipanteMigracion>;
  public colaboradorSeleccionado: Colaborador;
  errors: any;
  // public plazo: number;
  // public equipo: number;

  prioridadValidator: boolean = false;
  fechaLiberacionValidator: boolean = false;
  fechali: boolean;
  valorOcultar: boolean;
  selectedObject: RutaParticipanteMigracion;
  nivel:string;
  constructor(public bsModalRef: BsModalRef,
    private  ValidacionSoloLetras : ValidacionService,
    private servicioValidacion: ValidacionService, private toastr: ToastrService, private serviceEquipo: EquiposService,
    private serviceColaborador: ColaboradoresService, 
    private servicioMigracion: BandejaDocumentoService
    ) {
    this.limpiar();
    this.errors = {};
    this.fechali = false; 
    this.valorOcultar = false;
    this.interruptorAceptar = true;
    this.selectedRow = -1;
    this.paginacion = new Paginacion({registros: 10});
  }

  ngOnInit() {
    this.inicializarVariables();
    
    // this.obtenerListaEquipos();
  }

  inicializarVariables() {
    this.onClose = new Subject();
    this.textoNombre = '';
    this.textoFuncion = '';
    this.textoObservacion = '';
    this.textoApellidoPaterno = '';
    this.textoApellidoMaterno = '';
    this.loading = false;
    this.listaEquipos = [];
    this.deshabilitarLimpiar = true;
    this.valorOcultar = false;
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57)) {
      evento.preventDefault();
    }
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  limpiar() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.textoNombre = '';
    this.textoApellidoPaterno = '';
    this.textoApellidoMaterno = '';
    this.colaboradores = [];
    this.prioridad = null;
    this.fechaLiberacion = null;
    this.interruptorAceptar = true;
    this.deshabilitarLimpiar= true;
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

 

  seleccionarFila(indice: number, colaborador: Colaborador): void {
    this.filaSeleccionada = indice;
    if (this.selectedObject !== null) {
      this.interruptorAceptar = false;
    } else {
      this.interruptorAceptar = true;
    }    
    this.colaboradorSeleccionado = colaborador;
    this.colaboradorSeleccionado.nombreCompleto = colaborador.nombre + ' ' + colaborador.apellidoPaterno + ' ' +
    this.colaboradorSeleccionado.apellidoMaterno;
    //this.colaboradorSeleccionado.equipo = new Equipo();
    this.colaboradorSeleccionado.equipo.id = colaborador.equipo.id;    
    this.colaboradorSeleccionado.funcion = colaborador.funcion;
  }

  obtenerParametros(): Map<string, any> {
    const parametros: Map<string, any> = new Map<string, any>();
    parametros.set('pagina', this.paginacion.pagina);
    parametros.set('registros', this.paginacion.registros);
    parametros.set('nombre', this.textoNombre);
    parametros.set('apellidoPaterno', this.textoApellidoPaterno);
    parametros.set('apellidoMaterno', this.textoApellidoMaterno);
    return parametros;
  }

  buscar() {    
    this.servicioMigracion.obtenerColaboradoresMigracion(this.obtenerParametros(), this.paginacion).subscribe(
      (responseService: Response) => {      
      this.colaboradores = responseService.resultado;
      this.paginacion = new Paginacion(responseService.paginacion);
    }, (error) => {
      this.controlarError(error);
    });
  }

  habilitarLimpiar(): void {
    
    if (this.textoNombre !== '' || this.textoApellidoPaterno !== '' || this.textoApellidoMaterno !== '') {
      this.deshabilitarLimpiar = false;
    } else {
      this.deshabilitarLimpiar = true;
    }
    if (this.prioridad && this.prioridad > 0) {
      this.prioridadValidator = false;
    }
  }
  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error en la última acción', 'Error controlado', { closeButton: true });
  }
  seleccionar() {    
    this.fechali = false; 
    if(!this.fechaLiberacion){
      this.fechaLiberacionValidator = true;   
    }else if (this.fechaLiberacion.toString() == "Invalid Date"){
     this.fechali = true;        
    }
    if(!this.prioridad && !this.fechaLiberacion){// si son nulos
      this.toastr.error('Por favor, Ingrese la prioridad y la fecha de liberación.', 'Acción Incorrecta', { closeButton: true });
      (!this.prioridad || this.prioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
      (!this.fechaLiberacion || this.fechali== true)? this.fechaLiberacionValidator = true : this.fechaLiberacionValidator = false;
    }else if (!this.prioridad){
      this.toastr.error('Por favor, Ingrese una prioridad válida.', 'Acción Incorrecta', { closeButton: true });
      (!this.prioridad || this.prioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
    }else if(this.prioridad == 0){
      this.toastr.error('Por favor, Ingrese una prioridad válida.', 'Acción Incorrecta', { closeButton: true });
      (!this.prioridad || this.prioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
    }else if(!this.fechaLiberacion){
      this.toastr.error('Por favor, Ingrese una fecha de liberación válida.', 'Acción Incorrecta', { closeButton: true });
    // !this.fechaLiberacion ? this.fechaLiberacionValidator = true : this.fechaLiberacionValidator = false;
    }else if(this.fechali == true){//invalid Date
      this.toastr.error('Por favor, Ingrese una fecha de liberación válida.', 'Acción Incorrecta', { closeButton: true });
    //}else if(this.prioridad == 0 || this.fechali == true){
    }else{  
      //Inicio Cambio Godar      
      let listElaboracion = JSON.parse(sessionStorage.getItem("elaboracion"));
      let listConseso= JSON.parse(sessionStorage.getItem("consenso"));
      let listAprobacion= JSON.parse(sessionStorage.getItem("aprobacion"));
      let listaHomologacion= JSON.parse(sessionStorage.getItem("homologacion"));    
      
      let listaFinal:any[]=[];
      let valor:boolean=false;
      let valorNuevo:boolean=false;

      if(this.nivel=="128"){
        if(listElaboracion!=undefined){
          valor=true;
          listaFinal=listElaboracion;
        }else{
          valorNuevo=true;
        }
      }
      
      if(this.nivel=="129"){
        if(listConseso!=undefined){
          valor=true;
          listaFinal=listConseso;
        }else{
          valorNuevo=true;
        }
      }
      
      if(this.nivel=="130"){
        if(listAprobacion!=undefined){
          valor=true;
          listaFinal=listAprobacion;
        }else{
          valorNuevo=true;
        }
      }

      if(this.nivel=="131"){
        if(listaHomologacion!=undefined){
          valor=true;
          listaFinal=listaHomologacion;
        }else{
          valorNuevo=true;
        }
      }
      if(this.nivel==null || this.nivel==""){
        valorNuevo=true;
      }
      let repet:boolean=false;
      //Fin cambio Godar
        if(valor){
          const rutaParticipante: RutaParticipante = new RutaParticipante();
          rutaParticipante.prioridad = this.prioridad;
          rutaParticipante.comentario = this.textoObservacion;
          rutaParticipante.fechaLiberacion = this.fechaLiberacion;
          rutaParticipante.responsable = this.colaboradorSeleccionado.nombreCompleto;
          rutaParticipante.idColaborador = this.colaboradorSeleccionado.idColaborador;
          rutaParticipante.nombreCompleto = this.colaboradorSeleccionado.nombreCompleto;
          rutaParticipante.numeroFicha = this.colaboradorSeleccionado.numeroFicha;
          rutaParticipante.equipo = new Equipo();
          rutaParticipante.equipo.id = this.colaboradorSeleccionado.equipo.id;
          rutaParticipante.funcion = this.colaboradorSeleccionado.funcion;
          rutaParticipante.equipoColaborador =   this.colaboradorSeleccionado.equipo.descripcion;
          
          for(let val of listaFinal){
            if(val.idColaborador==rutaParticipante.idColaborador){
              repet=true;
              break;
            }
         }

          if(!repet){
            this.onClose.next(rutaParticipante);
            this.bsModalRef.hide();
          }else{
            this.toastr.error('El participante ya existe, Por favor agregue otro participante.', 'Acción Incorrecta', { closeButton: true });
          }
        }

        if(valorNuevo){
          const rutaParticipante: RutaParticipante = new RutaParticipante();
          rutaParticipante.prioridad = this.prioridad;
          rutaParticipante.comentario = this.textoObservacion;
          rutaParticipante.fechaLiberacion = this.fechaLiberacion;
          rutaParticipante.responsable = this.colaboradorSeleccionado.nombreCompleto;
          rutaParticipante.idColaborador = this.colaboradorSeleccionado.idColaborador;
          rutaParticipante.nombreCompleto = this.colaboradorSeleccionado.nombreCompleto;
          rutaParticipante.numeroFicha = this.colaboradorSeleccionado.numeroFicha;
          rutaParticipante.equipo = new Equipo();
          rutaParticipante.equipo.id = this.colaboradorSeleccionado.equipo.id;
          rutaParticipante.funcion = this.colaboradorSeleccionado.funcion;
          rutaParticipante.equipoColaborador =   this.colaboradorSeleccionado.equipo.descripcion;
          
          this.onClose.next(rutaParticipante);
          this.bsModalRef.hide();
          
        }
      }
     return;
    }
    
    
}
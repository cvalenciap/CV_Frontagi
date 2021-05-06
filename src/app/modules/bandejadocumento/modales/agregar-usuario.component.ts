import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
import { ColaboradoresService, EquiposService, ValidacionService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../models/response';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';

declare var jQuery: any;
@Component({
  selector: 'bandeja-documento-modales-agregar-usuario',
  templateUrl: 'agregar-usuario.template.html',
  providers: [EquiposService, ColaboradoresService]
})
export class AgregarUsuarioComponents implements OnInit {
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
  prioridadValidator: boolean = false;
  plazoValidator: boolean = false;
  nivel:string;
  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private serviceEquipo: EquiposService,
    private serviceColaborador: ColaboradoresService, private  ValidacionSoloLetras : ValidacionService) {
    this.onClose = new Subject();
    this.hoy = new Date();
    this.limpiar();
    this.deshabilitarLimpiar = true;
    this.loading = false;
    this.equipo = null;
    this.listaEquipos = [];
      
    const parametros: { id?: string, nombre?: string, jefe?: string, estado?: string } =
      { id: null, nombre: null, jefe: null, estado: "1" };

    this.serviceEquipo.buscarPorParametros(parametros).subscribe(
      (response: Response) => {
        this.listaEquipos = response.resultado;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }
  //Habilitar Botón Limpiar 
  habilitarLimpiar(): void {
    
    if (this.responsable != '' || this.appaterno != '' || this.appmaterno != '' || this.equipo != null || this.funcion != ''||this.prioridad != 0 ||this.plazo!= 0 ){
      this.deshabilitarLimpiar = false;
    }else{
      this.deshabilitarLimpiar = true;
    }

    if(this.prioridad != 0){
      this.deshabilitarLimpiar = false;
      this.prioridadValidator = false
    }
    if(this.plazo!= 0 ){
      this.deshabilitarLimpiar = false;
      this.plazoValidator = false
    }

  }

  limpiar() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.listaColaborador = [];
    this.selectedRow = -1;
    this.fecha = this.hoy;
    this.equipo = null;
    this.funcion = "";
    this.appaterno = "";
    this.appmaterno = "";
    this.responsable = "";
    this.plazo = 0;
    this.prioridad = 0;
    this.prioridadValidator = false;
    this.plazoValidator = false;

    this.textoFecha = (this.hoy.getDate() < 9 ? "0" : "") + this.hoy.getDate() + "/" +
      ((this.hoy.getMonth() + 1) < 9 ? "0" : "") + (this.hoy.getMonth() + 1) + "/" +
      this.hoy.getFullYear();
    this.habilitarLimpiar();
  }

  

  calcularFecha() {
    this.fecha = new Date(this.hoy.getTime() + (1000 * 60 * 60 * 24 * this.plazo));
    this.textoFecha = (this.fecha.getDate() < 9 ? "0" : "") + this.fecha.getDate() + "/" +
      ((this.fecha.getMonth() + 1) < 9 ? "0" : "") + (this.fecha.getMonth() + 1) + "/" +
      this.fecha.getFullYear();
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  ngOnInit() {
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presento un error inesperado en la ultima accion', 'Error', { closeButton: true });
  }

  buscar() {
    
    const parametros: {
      idDocumento?: string, equipo?: string, funcion?: string,
      responsable?: string, apellidoPaterno?: string, apellidoMaterno?: string, estado?: string
    } =
      {
        idDocumento: null, equipo: null, funcion: null, responsable: null, apellidoPaterno: null,
        apellidoMaterno: null, estado: "1"
      };
    if (this.equipo != null) parametros.equipo = this.equipo + "";
    if (this.funcion != null) parametros.funcion = this.funcion;
    if (this.responsable != null) parametros.responsable = this.responsable;
    if (this.appaterno != null) parametros.apellidoPaterno = this.appaterno;
    if (this.appmaterno != null) parametros.apellidoMaterno = this.appmaterno;

    this.serviceColaborador.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaColaborador = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  seleccionar() {
    
    if (!this.prioridad && !this.plazo) {
      this.toastr.error('Por favor, Ingrese una prioridad y plazo válido.', 'Acción Incorrecta', { closeButton: true });
      (!this.prioridad || this.prioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
      (!this.plazo || this.plazo == 0) ? this.plazoValidator = true : this.plazoValidator = false;
    } else if (!this.prioridad) {
      this.toastr.error('Por favor, Ingrese una prioridad válida.', 'Acción Incorrecta', { closeButton: true });
      (!this.prioridad) ? this.prioridadValidator = true : this.prioridadValidator = false;
    } else if (this.prioridad == 0) {
      this.toastr.error('Por favor, Ingrese una prioridad válida.', 'Acción Incorrecta', { closeButton: true });
      (this.prioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
    } else if (this.prioridad .toString().substr(0,1) == "0") {
      this.toastr.error('Por favor, Ingrese una prioridad válida.', 'Acción Incorrecta', { closeButton: true });
      (this.prioridad .toString().substr(0,1) == "0") ? this.prioridadValidator = true : this.prioridadValidator = false;
    } else if (!this.plazo) {
      this.toastr.error('Por favor, Ingrese un plazo válido.', 'Acción Incorrecta', { closeButton: true });
      (!this.plazo ) ? this.plazoValidator = true : this.plazoValidator = false;
    } else if (this.plazo == 0) {
      this.toastr.error('Por favor, Ingrese un plazo válido.', 'Acción Incorrecta', { closeButton: true });
      (this.plazo == 0) ? this.plazoValidator = true : this.plazoValidator = false;
    } else if (this.plazo .toString().substr(0,1) == "0") {
      this.toastr.error('Por favor, Ingrese un plazo válido.', 'Acción Incorrecta', { closeButton: true });
      (this.plazo .toString().substr(0,1) == "0") ? this.plazoValidator = true : this.plazoValidator = false;
    }
    else {
       
      let elaboracionList=JSON.parse(sessionStorage.getItem("listElaboracion"));
      let consensoList=JSON.parse(sessionStorage.getItem("listConseso"));
      let aprobacionList=JSON.parse(sessionStorage.getItem("listAprobacion"));
      let homologacionList=JSON.parse(sessionStorage.getItem("listHomologacion"));
      let listaFinal:any[]=[];
      let valor:boolean=false;
      let valorNuevo:boolean=false;

      if(this.nivel=="128"){
        if(elaboracionList!=undefined){
          valor=true;
          listaFinal=elaboracionList;
        }else{
          valorNuevo=true;
        }
      }
      
      if(this.nivel=="129"){
        if(consensoList!=undefined){
          valor=true;
          listaFinal=consensoList;
        }else{
          valorNuevo=true;
        }
      }
      
      if(this.nivel=="130"){
        if(aprobacionList!=undefined){
          valor=true;
          listaFinal=aprobacionList;
        }else{
          valorNuevo=true;
        }
      }

      if(this.nivel=="131"){
        if(homologacionList!=undefined){
          valor=true;
          listaFinal=homologacionList;
        }else{
          valorNuevo=true;
        }
      }
      if(this.nivel==null || this.nivel==""){
        valorNuevo=true;
      }
      let repet:boolean=false;
      if(valor){
        let objeto: RutaParticipante = new RutaParticipante();
        
         objeto.prioridad = this.prioridad;
         objeto.plazo = this.plazo;
         objeto.equipo = this.selectedObject.equipo;
         objeto.equipoColaborador = this.selectedObject.equipo.descripcion;
         objeto.funcion = this.selectedObject.funcion;
         objeto.responsable = this.selectedObject.nombreCompleto;
   
         //ID Colaborador
         objeto.idColaborador = this.selectedObject.idColaborador;
         for(let val of listaFinal){
            if(val.idColaborador==objeto.idColaborador){
              repet=true;
              break;
            }
         } 
         if(!repet){
          this.onClose.next(objeto);
          this.bsModalRef.hide();
         }else{
          this.toastr.error('El participante ya existe, Por favor agregue otro participante.', 'Acción Incorrecta', { closeButton: true });
         }
         
      }

      if(valorNuevo){
        let objeto: RutaParticipante = new RutaParticipante();
        
         objeto.prioridad = this.prioridad;
         objeto.plazo = this.plazo;
         objeto.equipo = this.selectedObject.equipo;
         objeto.equipoColaborador = this.selectedObject.equipo.descripcion;
         objeto.funcion = this.selectedObject.funcion;
         objeto.responsable = this.selectedObject.nombreCompleto;
   
         //ID Colaborador
         objeto.idColaborador = this.selectedObject.idColaborador;
   
         this.onClose.next(objeto);
         this.bsModalRef.hide();
      }
      
    }



  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    if (this.paginacion.totalRegistros > 0) this.buscar();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    if (this.paginacion.totalRegistros > 0) this.buscar();
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
    let nombreCompleto = obj.nombre + " " + obj.apellidoPaterno + " " + obj.apellidoMaterno;
    sessionStorage.setItem("descparticipante", nombreCompleto);
    sessionStorage.setItem("idparticipante", obj.idColaborador);
  }

}
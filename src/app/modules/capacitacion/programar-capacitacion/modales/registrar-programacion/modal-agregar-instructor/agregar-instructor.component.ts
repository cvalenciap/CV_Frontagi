import { Component, OnInit, Input, SecurityContext } from '@angular/core';
//import { BandejaDocumento } from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
//import { CursoMockService as CursoService} from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { Response } from 'src/app/models/response';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';
import { Curso } from 'src/app/models/curso';
import { Router } from '@angular/router';
import { InstructoresService } from 'src/app/services';
import { DomSanitizer } from '@angular/platform-browser';
import { Instructor } from 'src/app/models';
import { ModalOptions } from 'ngx-bootstrap/modal/modal-options.class';
import { BsModalService } from 'ngx-bootstrap/modal';
import { BusquedaInstructorComponent } from 'src/app/modules/instructor/modales/busqueda-instructor.component';

@Component({
  selector: 'modal-agregar-instructor',
  templateUrl: 'agregar-instructor.template.html',
  providers: [InstructoresService]
})
export class AgregarInstructorComponents implements OnInit {
  public onClose: Subject<Instructor>;

  @Input()
  //listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  plazo: number;
  hoy: Date;
  fecha: Date;
  textoBusqueda: string;
  parametroBusqueda: string;
  textoFecha: string;
  equipo: number;
  funcion: string;
  responsable: string;
  listaEquipos: Equipo[];
  listaCursos: Curso[];
  objetoBusqAvanz: Instructor;
  instructor: Instructor;
  filaSeleccionada: number;

  /* datos */
  items: Instructor[];

  /* Paginación */
  paginacion: Paginacion;

  /* Registro seleccionado */
  selectedRow: number;
  selectedObject: Curso;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private router: Router,
    private serviceCurso: InstructoresService,
    private service: InstructoresService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
  ) {
    this.items = [];
    this.onClose = new Subject();
    this.hoy = new Date();
    this.limpiar();
    this.objetoBusqAvanz = new Instructor();
    this.instructor = new Instructor();
  }

  limpiar() {
    this.paginacion = new Paginacion({ registros: 10 });
    this.listaCursos = [];
    this.selectedRow = -1;
    this.fecha = this.hoy;
    this.equipo = null;
    this.funcion = "";
    this.responsable = "";
    this.plazo = 0;
    this.textoFecha = (this.hoy.getDate() < 9 ? "0" : "") + this.hoy.getDate() + "/" +
      ((this.hoy.getMonth() + 1) < 9 ? "0" : "") + (this.hoy.getMonth() + 1) + "/" +
      this.hoy.getFullYear();
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
    /*
    this.loading = true;
    const parametros: {id?:string, nombre?:string, descripcion?:string} =
      {id: null, nombre:null, descripcion: null};

    this.serviceCurso.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (error) => this.controlarError(error)
    );*/
    this.getLista();
  }

  getLista() {
    
    this.loading = true;
    //const parametros: {ivcodinst?: string, ivnominst?: string, ivapepatinst?: string, ivapematinst?: string} = {ivcodinst: null, ivnominst: null, ivapepatinst: null, ivapematinst: null};
    switch (this.parametroBusqueda) {
      case 'ficha':
        this.objetoBusqAvanz.v_codinst = this.textoBusqueda;
        break;
    }
    this.service.buscarPorParametros(this.objetoBusqAvanz, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
  //   OnBuscar(): void {
  //     let texto:string = "<strong>Busqueda Por: </strong>";
  //     console.log(this.parametroBusqueda);
  //     switch (this.parametroBusqueda) {

  //         case 'codigo':
  //             texto = texto + "<br/><strong>Código: </strong>"+this.textoBusqueda;
  //             break;
  //         case 'nombre': 
  //             texto = texto + "<br/><strong>Nombre: </strong>"+this.textoBusqueda;
  //             break;
  //      }
  //     this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
  //     this.mostrarAlerta = true;
  //     this.paginacion.pagina = 1;
  //     //this.getLista();
  // }
  seleccionar() {
    /*let objeto:RutaParticipante=new RutaParticipante();
     objeto.plazo=this.plazo;
     objeto.equipo=this.selectedObject.equipo.descripcion;
     objeto.funcion=this.selectedObject.funcion;
     objeto.responsable=this.selectedObject.nombreCompleto;
     this.onClose.next(objeto);
     this.bsModalRef.hide();
     this.router.navigate([`mantenimiento/encuesta`]);*/
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

  abrirBusquedaAvanzada() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-md'
    }
    
    this.bsModalRef = this.modalService.show(BusquedaInstructorComponent, config);
    (<BusquedaInstructorComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: Instructor = result;
      this.objetoBusqAvanz = objeto;
      
      this.OnBuscar();
    });
  }

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getLista();
    
    this.parametroBusqueda = '';
    this.textoBusqueda = '';
    this.objetoBusqAvanz = new Instructor();
  }

  seleccionarInstructor(indice: number, instructor: Instructor) {
    
    this.selectedRow = indice;
    this.instructor = instructor;
    this.filaSeleccionada = indice;
  }

  agregar() {
    
    this.onClose.next(this.instructor);
    this.bsModalRef.hide();
  }
}
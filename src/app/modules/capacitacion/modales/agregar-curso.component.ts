import { Component, OnInit, Input,SecurityContext } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
// import { CursoMockService as CursoService} from '../../../services';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../models/response';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';
import { Curso } from 'src/app/models/curso';
import { Router } from '@angular/router';
import { DomSanitizer } from '@angular/platform-browser';
import { CursoService } from 'src/app/services/impl/curso.service';
import { GeneralService } from 'src/app/services/impl/general.service';

@Component({
  selector: 'modal-agregar-curso',
  templateUrl: 'agregar-curso.template.html',
  providers: [CursoService]
})
export class AgregarCursoComponents implements OnInit {

  public onClose: Subject<Curso>;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  textoBusqueda: string;
  parametroBusqueda:string;
  plazo: number;
  hoy: Date;
  fecha: Date;
  textoFecha: string;
  equipo: number;
  funcion: string;
  responsable: string;
  listaEquipos: Equipo[];
  listaCursos: Curso[];
  mensajeAlerta:string;
  mostrarAlerta:boolean;
  nombreCurso: string;
  codigoCurso: string;
  curso: Curso;
  filaSeleccionada:number;
/* datos */
items: Curso[];

  /* Paginación */
  paginacion: Paginacion;

  /* Registro seleccionado */
  selectedRow: number;
  selectedObject: Curso;

  constructor(public bsModalRef: BsModalRef,
              private toastr: ToastrService,
              private router: Router,
              private serviceCurso: CursoService,
              private servicio: CursoService,
              private sanitizer: DomSanitizer,
              ) {
                this.items = [];
    this.onClose = new Subject();
    this.curso= new Curso;
    this.parametroBusqueda="codigo";
    this.hoy = new Date();
    this.limpiar();
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
    // this.mostrarAlerta = false;
    // this.mensajeAlerta = "";
    // this.loading = true;
    // const parametros: {id?:string, nombre?:string, descripcion?:string} =
    //   {id: null, nombre:null, descripcion: null};

    // this.serviceCurso.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
    //   (response: Response) => {
    //     this.items = response.resultado;
    //     this.paginacion = new Paginacion(response.paginacion);
    //     this.loading = false; },
    //   (error) => this.controlarError(error)
    // );
    this.loading = true;
    this.getCursos();
  }

  getCursos(){
    const parametros: {
      codigoCurso?: string, 
      nombreCurso?: string,
      pagina?:
       string,
      registros?: string
  } = 
  {   codigoCurso: this.codigoCurso, 
      nombreCurso: this.nombreCurso,
      pagina: this.paginacion.pagina + '',
      registros: this.paginacion.registros + ''
  };
  switch (this.parametroBusqueda) {
      case 'codigoCurso':
          parametros.codigoCurso = this.textoBusqueda;
          break;
      case 'nombreCurso':
          parametros.nombreCurso = this.textoBusqueda;
          break;
  }
  
  this.items=[]
 
    this.servicio.buscarCurso(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
          console.log(response.resultado);
          console.log(response.paginacion);
          this.items = response.resultado;
          if(this.items.length>0){
              // this.items = this.generalService.agregarItem(response.resultado,response.paginacion);
          }
          this.paginacion = new Paginacion(response.paginacion);
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
  OnBuscar(): void {
    let texto:string = "<strong>Busqueda Por: </strong>";
    console.log(this.parametroBusqueda);
    
    switch (this.parametroBusqueda) {
        
        case 'codigo':
            texto = texto + "<br/><strong>Código: </strong>"+this.textoBusqueda;
            break;
        case 'nombre': 
            texto = texto + "<br/><strong>Nombre: </strong>"+this.textoBusqueda;
            break;
     }
    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    //this.getLista();
}
  seleccionar(){
   /* let objeto:RutaParticipante=new RutaParticipante();
    objeto.plazo=this.plazo;
    objeto.equipo=this.selectedObject.equipo.descripcion;
    objeto.funcion=this.selectedObject.funcion;
    objeto.responsable=this.selectedObject.nombreCompleto;
    this.onClose.next(objeto);
    this.bsModalRef.hide();*/
    //this.router.navigate([`mantenimiento/encuesta`]);
    this.bsModalRef.hide();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getCursos();
  //  this.buscar();
  }

  OnPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
      this.getCursos();
    //  this.buscar();
  }

  OnRowClick(index, obj): void {
      this.selectedRow = index;
      this.selectedObject = obj;
  }

  seleccionarCurso(indice: number, curso: Curso){
    
    this.selectedRow = indice;
    this.curso = curso;
    this.filaSeleccionada = indice;
  }

  agregar(){
    
    this.onClose.next(this.curso);
    this.bsModalRef.hide();
  }

}
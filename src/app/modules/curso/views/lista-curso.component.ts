import { Component, OnInit, Inject, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Curso } from '../../../models/curso';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
//import { ModalBusquedaAulaComponent } from '../modales/modal-busqueda-aula.component';
// import { CursoMockService as CursoService} from '../../../services';
import { DomSanitizer } from '@angular/platform-browser';
import { CursoService } from 'src/app/services/impl/curso.service';
import { GeneralService } from 'src/app/services/impl/general.service';
@Component({
  selector: 'lista-curso',
  templateUrl: 'lista-curso.template.html',
  styleUrls: ['lista-curso.component.scss'],
  providers: [CursoService]
})
export class CursosListaComponent implements OnInit {

  /* datos */
  nombreCurso: string;
  codigoCurso: string;
  codigo: string;
  nombre: string;
  items: Curso[];
  cantSesiones: number;
  busquedaAula: Curso;
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  selectedFilter: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  selectedObject: Curso;
  /* indicador de carga */
  loading: boolean;
  bsModalRef: BsModalRef;
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private modalService: BsModalService,
    //private service: CursoService,
    private generalService: GeneralService,
    private servicio: CursoService,
    private sanitizer: DomSanitizer) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({ registros: 10 });
  }


  ngOnInit() {
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.getLista();
  }
  // getLista(): void {
  //     this.loading = true;
  //     const parametros: {codigo?: string, nombre?: string, descripcion?: string} = {codigo: null, nombre: null, descripcion: null};
  //     switch (this.parametroBusqueda) {
  //         case 'codigo':
  //             parametros.codigo = this.textoBusqueda;
  //             break;
  //         case 'nombre':
  //             parametros.nombre = this.textoBusqueda;
  //             break;
  //         case 'descripcion':
  //         default:
  //             parametros.descripcion = this.textoBusqueda;
  //     }
  //     this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
  //         (response: Response) => {
  //             this.items = response.resultado;
  //             this.paginacion = new Paginacion(response.paginacion);
  //             this.loading = false; },
  //         (error) => this.controlarError(error)
  //     );
  // }
  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getLista();
  }
  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getLista();
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }
  OnBuscar(): void {
    // let texto:string = "<strong>Busqueda Por: </strong>";
    // console.log(this.parametroBusqueda);
    // switch (this.parametroBusqueda) {

    //     case 'codigo':
    //         texto = texto + "<br/><strong>Código: </strong>"+this.textoBusqueda;
    //         break;
    //     case 'nombre': 
    //         texto = texto + "<br/><strong>Nombre: </strong>"+this.textoBusqueda;
    //         break;
    //     case 'avanzada':
    //         if(this.busquedaAula.codigo != ""){
    //             texto = texto + "<br/><strong>Código: </strong>"+this.busquedaAula.codigo+" ";
    //         }
    //         if(this.busquedaAula.nombre != undefined && this.busquedaAula.nombre != null){
    //             texto = texto + "<br/><strong>Nombre: </strong>"+this.busquedaAula.nombre;
    //          }        
    //         break;

    // }
    // this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    // this.mostrarAlerta = true;
    // this.paginacion.pagina = 1;
    this.getLista();
  }
  OnModificar(): void {
    this.router.navigate([`mantenimiento/aulas/editar/${this.selectedObject.codigo}`]);
  }
  /*
  onEliminar():void{
      //console.log(this.parametroBusqueda);
      this.service.eliminar(this.selectedObject).subscribe(
          (response: Response) => {
              console.log(this.paginacion.totalPaginas.toString());
              this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
              this.getLista();
              this.loading = false;

          },
          (error) => this.controlarError(error)
      );
  }
  */
  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
  /*
      abrirBusqueda(){
         this.parametroBusqueda = "avanzada";
          const config = <ModalOptions>{
              ignoreBackdropClick: true,
              keyboard: false,
              initialState: {        
              },
              class: 'modal-lg'
          }
          this.bsModalRef = this.modalService.show(ModalBusquedaAulaComponent, config);
          (<ModalBusquedaAulaComponent>this.bsModalRef.content).onClose.subscribe(result => {
              this.busquedaAula = result;
              console.log(this.busquedaAula);
              this.OnBuscar();
      
      
      
          });
          
      }
      */

  getLista(): void {
    this.loading = true;
    const parametros: {
      codigoCurso?: string,
      nombreCurso?: string,
      pagina?:
      string,
      registros?: string
    } =
    {
      codigoCurso: this.codigoCurso,
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
    
    this.items = []
    this.servicio.buscarCurso(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        console.log(response.resultado);
        console.log(response.paginacion);
        this.items = response.resultado;
        if (this.items.length > 0) {
          this.items = this.generalService.agregarItem(response.resultado, response.paginacion);
        }
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );

  }

  editarCursoSesion(itemSeleccionado: Curso) {
    console.log(itemSeleccionado.idCurso)
    this.router.navigate([`mantenimiento/cursos/editar/${itemSeleccionado.idCurso}`]);
  }

  eliminarCurso(itemSeleccionado: Curso): void {
    this.servicio.eliminarCurso(itemSeleccionado).subscribe(
      (response: Response) => {
        console.log(this.paginacion.totalPaginas.toString());
        this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
        //this.busquedaProgramacion.us
        this.getLista();
        this.selectedRow = -1;
        this.selectedObject = null;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );

  }
}

import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { Paginacion } from '../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { EncuestaService} from '../../../services';
import { Encuesta } from 'src/app/models';
import { AgregarCursoComponents } from 'src/app/modules/capacitacion/modales/agregar-curso.component';
import { VistaPreviaComponent } from 'src/app/modules/encuesta/views/encuesta-vistaprevia.component';
import { BusquedaCursoMantenimientoComponent } from 'src/app/modules/encuesta/modales/busqueda-curso-mantenimiento.component';
import { Curso } from 'src/app/models/curso';
@Component({
  selector: 'encuesta-lista',
  templateUrl: './lista.template.html',
  styleUrls: ['./lista.component.scss'],
  providers: [EncuestaService]
})
export class EncuestaComponent implements OnInit {
    public curso: Curso;
    //Objeto para abrir ventana
objetoVentana: BsModalRef;
  /* datos */
  items: Encuesta[];
  busquedaEncuesta: Encuesta;
  /* filtros */
  textoBusqueda: string;  
  parametroBusqueda: string;
  selectedFilter: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: Encuesta;
  /* indicador de carga */
  loading: boolean;

  mensajeAlerta:string;
  mostrarAlerta:boolean;

  bsModalRef: BsModalRef;
  objetoBusqAvanz: Encuesta;
 

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: EncuestaService,
              private modalService: BsModalService,           
              private sanitizer: DomSanitizer
            ) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];      
      this.parametroBusqueda = 'ficha';
      this.paginacion = new Paginacion({registros: 10});
      this.objetoBusqAvanz = new Encuesta();
  }

  ngOnInit() {
    this.getLista();
}
getLista(): void {
    switch (this.parametroBusqueda) {
        case 'ficha':
            this.objetoBusqAvanz.vcodencu = this.textoBusqueda;
            break;
    }
    this.service.buscarPorParametros(this.objetoBusqAvanz, this.paginacion.pagina, this.paginacion.registros).subscribe(
       (response: Response) => {
           this.items = response.resultado;
           this.paginacion = new Paginacion(response.paginacion);
          this.loading = false; },
       (error) => this.controlarError(error)
    );
}
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
OnBuscarCurso() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
      class: 'modal-lg'
    }
    this.objetoVentana = this.modalService.show(AgregarCursoComponents, config);
    (<AgregarCursoComponents>this.objetoVentana.content).onClose.subscribe(result => {
    });
  }

OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getLista();
    this.parametroBusqueda = 'ficha';
    this.textoBusqueda='';
    this.objetoBusqAvanz = new Encuesta();
}

OnNuevo(): void {   
    this.router.navigate([`mantenimiento/encuesta/registrar`]);
}

OnModificar(encuesta: Encuesta): void {  
    
    sessionStorage.setItem('aula', JSON.stringify(encuesta));
    this.router.navigate([`mantenimiento/encuesta/editar/${encuesta.nidencu}`]);
}


onEliminar(encuesta: Encuesta):void{
    this.selectedObject = encuesta;
    this.service.eliminar(this.selectedObject).subscribe(
        (response: Response) => {
            this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
            this.getLista();
            this.loading = false;
        },
        (error) => this.controlarError(error)
    );
}

abrirBusquedaAvanzada(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(BusquedaCursoMantenimientoComponent, config);
    (<BusquedaCursoMantenimientoComponent>this.bsModalRef.content).onClose.subscribe((curso: Curso) => {
        this.curso = curso;
        
        this.objetoBusqAvanz.nidcurs = parseInt(this.curso.idCurso);
        this.OnBuscar();
    });



  }



controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}

setFilter(filter: string) {
    this.selectedFilter = filter;
    console.log(this.selectedFilter);
}


}

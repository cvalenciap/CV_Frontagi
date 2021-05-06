import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Instructor } from '../../../models/instructor';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import { InstructoresService } from 'src/app/services';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BusquedaInstructorComponent } from 'src/app/modules/instructor/modales/busqueda-instructor.component';

@Component({
    selector: 'instructores-lista',
    templateUrl: 'lista.template.html',
    styleUrls: ['lista.component.scss'],
    providers: [InstructoresService]
})
export class InstructoresListaComponent implements OnInit {

    /* datos */
    items: Instructor[];
    /* filtros */
    textoBusqueda: string;
    parametroBusqueda: string;
    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
    selectedObject: Instructor;
    /* indicador de carga */
    loading: boolean;
    bsModalRef: BsModalRef;
    objetoBusqAvanz: Instructor;

    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private service: InstructoresService,
                private modalService: BsModalService) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
        this.parametroBusqueda = 'ficha';
        this.paginacion = new Paginacion({registros: 10});
        this.objetoBusqAvanz = new Instructor();
    }
    ngOnInit() {
        this.getLista();
    }
    getLista(): void {
        
        this.loading = true;
        console.log(this.objetoBusqAvanz);
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

    OnBuscar(): void {
        this.paginacion.pagina = 1;
        this.getLista();
        
        this.parametroBusqueda = 'ficha';
        this.textoBusqueda='';
        this.objetoBusqAvanz = new Instructor();
    }

    OnModificar(instructor:Instructor): void {
        sessionStorage.setItem('instructor', JSON.stringify(instructor));
        this.router.navigate([`mantenimiento/instructores/editar/${instructor.n_idinst}`]);
    }
    onEliminar(instructor:Instructor):void{
        this.selectedObject = instructor;
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
    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    abrirBusquedaAvanzada(){
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

    OnNuevo(): void { 
        this.router.navigate([`mantenimiento/instructores/registrar`]);
    }


}


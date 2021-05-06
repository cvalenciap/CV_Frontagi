import { Component, OnInit, Inject,NgModule,SecurityContext  } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { Curso } from './../../../../../models/curso';

import { Paginacion } from '../../../../../models/paginacion';
import {BsLocaleService} from 'ngx-bootstrap/datepicker'; 
import { ToastrService } from 'ngx-toastr';

import { Response } from '../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalSeleccionarCursoComponent } from './modales/modal-busqueda-seleccionarCurso/modal-busqueda-seleccionarCurso.component';
import { ModalVistaPreviaExamenComponent } from './modales/modal-vista-previa/modal-vista-previa.component';
import { PreguntaCursoService } from '../../../../../services';
import { PreguntaCurso } from 'src/app/models';

                            
                            

@Component({
    selector: 'app-lista',
    templateUrl: 'lista.template.html',   
    styleUrls: ['lista.component.scss'],
    providers: [PreguntaCursoService]
})
export class PreguntaCursoListaComponent implements OnInit {

    bsModalRef: BsModalRef;
    busquedaRegistroCurso: Curso;
    selectedFilter: string;
    /* datos */
//items: RegistroAuditor[];
    mostrarAlerta:boolean;
    /* filtros */
    textoBusqueda: string;
    mensajeAlerta:string;
    parametroBusqueda: string;
    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
   selectedObject: PreguntaCurso;
    /* indicador de carga */
    loading: boolean;
    items: PreguntaCurso[];
    constructor(private localeService: BsLocaleService,
                private modalService: BsModalService,
                private toastr: ToastrService,
                private router: Router,
                private service: PreguntaCursoService
                ) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
   /*  //    this.textoBusqueda='0';
        this.selectedFilter = 'N° Ficha';
        this.parametroBusqueda = 'N° Ficha'; */
        this.paginacion = new Paginacion({registros: 10});
    }
    ngOnInit() {
        /* this.mostrarAlerta = false;
        this.mensajeAlerta = ""; */
        this.getLista();
    }
    getLista(): void {
        
        this.loading = true;
         
        const parametros: {codCurso?: string, nomCurso?: string} = {codCurso: null, nomCurso:null};
        if(!this.parametroBusqueda){
            this.parametroBusqueda='codCurso';
        }
        switch (this.parametroBusqueda) {
            case 'codCurso':
                parametros.codCurso =  this.textoBusqueda;
                
                break;
            case 'nomCurso':
                parametros.nomCurso =this.textoBusqueda;
               
                break;
    
            
            }
            
            this.items=[];
         this.service.buscarPorPregunta(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
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
       /*  this.parametroBusqueda=''; */
        this.textoBusqueda='';
    }
   
    onEliminar(preguntacurso: PreguntaCurso):void{
        
        this.selectedObject = preguntacurso;
        this.service.eliminar(this.selectedObject).subscribe(
            
            (response: Response) => {
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


OnBuscarAvanzado(): void {}

OnModificar(preguntacurso: PreguntaCurso): void {  
    sessionStorage.setItem('preguntacurso', JSON.stringify(preguntacurso));
    this.router.navigate([`mantenimiento/preguntasCurso/editar/${preguntacurso.codPregunta}`]);
    
    

}

}

import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Aula } from '../../../models/aula';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import { Parametro } from 'src/app/models';
import { AulasService} from '../../../services';

@Component({
    selector: 'aulas-lista',
    templateUrl: 'lista.template.html',
    styleUrls: ['lista.component.scss'],
    providers: [AulasService]
})
export class AulasListaComponent implements OnInit {
    /* datos */
    items: Aula[];
    /* filtros */
    textoBusqueda: string;
    parametroBusqueda: string;
    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
    selectedObject: Aula;
    /* indicador de carga */
    loading: boolean;

    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private service: AulasService) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
        this.parametroBusqueda = 'codigo';
        this.paginacion = new Paginacion({registros: 10});
    }
    ngOnInit() {
        this.getLista();
    }

    getLista(): void {
        this.loading = true;
        const parametros: {ivcodaula?: string, ivnomaula?: string} = {ivcodaula: null, ivnomaula: null};
        switch (this.parametroBusqueda) {
            case 'codigo':
                parametros.ivcodaula = this.textoBusqueda;
                break;
            case 'nombre':
                parametros.ivnomaula = this.textoBusqueda;
                break; 
            
        }
        
        this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
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
        this.parametroBusqueda = 'codigo';
        this.textoBusqueda='';
    }

    OnModificar(aula: Aula): void {  
        
        sessionStorage.setItem('aula', JSON.stringify(aula));
        this.router.navigate([`mantenimiento/aulas/editar/${aula.nidaula}`]);
    }

    OnNuevo(): void {   
        this.router.navigate([`mantenimiento/aulas/registrar`]);
    }

    onEliminar(aula: Aula):void{
        this.selectedObject = aula;
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
}

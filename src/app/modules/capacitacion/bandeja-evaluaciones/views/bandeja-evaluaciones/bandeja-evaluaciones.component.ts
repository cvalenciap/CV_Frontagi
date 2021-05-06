import { Component, OnInit, SecurityContext } from '@angular/core';
import { BandejaEvaluaciones } from 'src/app/models/bandejaevaluaciones';
import { Router } from '@angular/router';
import { Paginacion } from './../../../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { BandejaEvaluacionesService } from 'src/app/services/impl/bandejaevaluaciones.service';
import { DomSanitizer } from '@angular/platform-browser';
import { DatePipe } from '@angular/common';
import { Asistencia } from 'src/app/models';

@Component({
    selector: 'app-bandeja-evaluaciones',
    templateUrl: './bandeja-evaluaciones.template.html',
    styleUrls: ['./bandeja-evaluaciones.component.scss'],
    providers: [BandejaEvaluacionesService]
})
export class BandejaEvaluacionesComponent implements OnInit {

    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.getLista();
    }

    items: Asistencia[];
    busquedaBandejaEvaluaciones: Asistencia;

    selectedFilter: string;
    selectedRow: number;
    selectedObject: Asistencia;

    paginacion: Paginacion;
    loading: boolean;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    bsModalRef: BsModalRef;

    textoBusqueda: string;
    parametroBusqueda: string;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private service: BandejaEvaluacionesService,
        private modalService: BsModalService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
       /*  this.selectedFilter = 'codigoCapacitacion'; */
        this.paginacion = new Paginacion({registros: 10});
        defineLocale('es', esLocale);
        this.localeService.use('es'); 
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

 /*    OnVerDetalle(asistencia:Asistencia): void {
        sessionStorage.setItem('asistencia', JSON.stringify(asistencia));
        this.router.navigate([`capacitacion/bandejaevaluaciones/detalle/${asistencia.idCapacitacion}`]);
    } */

    OnVerDetalle(): void {
        //sessionStorage.setItem('asistencia', JSON.stringify(asistencia));
        this.router.navigate([`capacitacion/bandejaevaluaciones/detalle/1`]);
    } 


    getLista(){
        
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
        this.service.buscarPorEvaluacion(parametros,this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false; },
            (error) => this.controlarError(error)
        );
    }

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    
    OnBuscar(): void {
        this.paginacion.pagina = 1;
        this.getLista();
       /*  this.parametroBusqueda=''; */
        this.textoBusqueda='';
    }
}
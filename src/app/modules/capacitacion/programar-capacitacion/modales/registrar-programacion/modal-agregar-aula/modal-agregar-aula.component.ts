import { Component, OnInit, Inject, SecurityContext} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../../../models/Response';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ProgramarCapacitacion } from 'src/app/models/programarcapacitacion';
import { AulasService } from 'src/app/services';
import { Aula } from 'src/app/models/aula';

@Component({
  selector: 'app-modal-agregar-aula',
  templateUrl: './modal-agregar-aula.template.html',
  styleUrls: ['./modal-agregar-aula.component.scss']
})
export class ModalAgregarAulaComponent implements OnInit {

    public onClose: Subject<Aula>;
    selectedRow: number;
    selectedObject: any;
    paginacion: Paginacion;
    duracion:string;
    busqueda:ProgramarCapacitacion;
    bsConfig: object;

    textoBusqueda: string;
    parametroBusqueda: string;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    loading: boolean;
    items: Aula[];
    aula: Aula;
    filaSeleccionada:number;

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService,
                private modalService: BsModalService,
                private router: Router,
                private service: AulasService,
                private sanitizer: DomSanitizer) {
                    this.parametroBusqueda = 'codigo';
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
                    this.items = [];
                    this.selectedRow = -1;
                    this.paginacion = new Paginacion({registros: 10});
    }

    ngOnInit() {
        this.busqueda = new ProgramarCapacitacion();
        this.busqueda.codigo = "";
        this.mensajeAlerta = "";
        this.mostrarAlerta = false;
        this.selectedRow = -1;
        this.onClose = new Subject();
        console.log(this.busqueda);
        this.getLista();
    }

    OnRowClick(index, obj): void {
        
        this.selectedRow = index;
        this.selectedObject = obj;
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

    OnSeleccionar(){
        this.bsModalRef.hide();
    }

    OnRegresar(){
        this.bsModalRef.hide();
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

    getLista(){
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

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    seleccionarAula(indice: number, aula: Aula){
        
        this.selectedRow = indice;
        this.aula = aula;
        this.filaSeleccionada = indice;
    }

    agregar(){
        
        this.bsModalRef.hide();
        this.onClose.next(this.aula);
        
    }
}
import { Component, OnInit, Inject, NgModule, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
//import { RegistroAuditor } from './../../../../../models/registroAuditor';

//import { Paginacion } from '../../../../../models/paginacion';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

//import { Response } from '../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { Paginacion } from 'src/app/models/paginacion';
//import { FichaRegistroAuditorService} from './../../../../../services';
//import { ModalBusquedaRegistroAuditorComponent } from './../modales/modal-busqueda-registroAuditor/modal-busqueda-registroAuditor.component';
//import { ParametrosMockService as ParametroService} from '../../../services';





@Component({
    selector: 'app-listaAreaRequisito',
    templateUrl: 'listaAreaRequisito.template.html',
    styleUrls: ['listaAreaRequisito.component.scss'],
    //providers: [FichaRegistroAuditorService]
})
export class ListaAreaRequisitoComponent implements OnInit {

    bsModalRef: BsModalRef;
    //busquedaRegistroAuditor: RegistroAuditor;
    selectedFilter: string;
    /* datos */
    //items: RegistroAuditor[];
    mostrarAlerta: boolean;
    /* filtros */
    textoBusqueda: string;
    mensajeAlerta: string;
    parametroBusqueda: string;
    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
    //selectedObject: RegistroAuditor;
    //public item: RegistroAuditor;
    /* indicador de carga */
    loading: boolean;

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private modalService: BsModalService,
        //private service: FichaRegistroAuditorService,
        private sanitizer: DomSanitizer
    ) {
        this.loading = false;
        this.selectedRow = -1;
        //let items = new RegistroAuditor('AA','AA','','',1,'AA',2,'AA');
        this.textoBusqueda = '';

        this.selectedFilter = 'N° Ficha';
        this.parametroBusqueda = 'N° Ficha';
        this.paginacion = new Paginacion({registros: 10});
    }
    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        //this.getLista();
    }

    /* getLista(): void {
        this.loading = true;

        const parametros: { avanzada?: string, numFicha?: string, nombreAuditor?: string, apePaternoAuditor?: string, apeMaternoAuditor?: string } = { numFicha: '', nombreAuditor: '', apePaternoAuditor: '', apeMaternoAuditor: '' };
        parametros.avanzada = "NO";
        switch (this.parametroBusqueda) {
            case 'numFicha':
                parametros.numFicha = this.textoBusqueda;
                this.textoBusqueda = '';
                break;
            case 'nombreAuditor':
                parametros.nombreAuditor = this.textoBusqueda;
                this.textoBusqueda = '';
                break;
            case 'apePaternoAuditor':
                parametros.apePaternoAuditor = this.textoBusqueda;
                this.textoBusqueda = '';
                break;
            case 'apeMaternoAuditor':
                parametros.apeMaternoAuditor = this.textoBusqueda;
                this.textoBusqueda = '';
                break;
            default:

        }
        this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false;
            },
            (error) => this.controlarError(error)
        );
    } */

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        //this.getLista();
    }
    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        //this.getLista();
    }
    OnRowClick(index, obj): void {
        this.selectedRow = index;
        //this.selectedObject = obj;

    }
    OnBuscar(): void {
        this.paginacion.pagina = 1;
        //this.getLista();
    }
    OnModificar(obj): void {
        //this.selectedObject = obj;
        //this.router.navigate([`auditoria/registro-auditor/editar/${this.selectedObject.codigo}`]);
    }

    /* onEliminar(): void {
        console.log(this.selectedObject);
        this.service.eliminar(this.selectedObject).subscribe(
            (response: Response) => {
                console.log(this.paginacion.totalPaginas.toString());
                this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
                this.getLista();
                this.loading = false;
            },
            (error) => this.controlarError(error)
        );
    } */

    controlarError(error) {
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }


    /* abrirBusqueda() {
        this.selectedFilter = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                hola: "adios"
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalBusquedaRegistroAuditorComponent, config);
        (<ModalBusquedaRegistroAuditorComponent>this.bsModalRef.content).onClose.subscribe(result => {
            this.busquedaRegistroAuditor = result;
            console.log(this.busquedaRegistroAuditor.apePaternoAuditor);
            this.OnBuscarAvanzado(this.busquedaRegistroAuditor);
        });

    }

    OnBuscarAvanzado(busquedaRegistroAuditorAux?: RegistroAuditor): void {
        this.paginacion.pagina = 1;
        this.loading = true;

        const parametros: { avanzada?: string, numFicha?: string, nombreAuditor?: string, apePaternoAuditor?: string, apeMaternoAuditor?: string } = { numFicha: '', nombreAuditor: '', apePaternoAuditor: '', apeMaternoAuditor: '' };
        console.log(this.parametroBusqueda);

        parametros.numFicha = busquedaRegistroAuditorAux.numFicha;
        parametros.nombreAuditor = busquedaRegistroAuditorAux.nombreAuditor;
        parametros.apePaternoAuditor = busquedaRegistroAuditorAux.apePaternoAuditor;
        parametros.apeMaternoAuditor = busquedaRegistroAuditorAux.apeMaternoAuditor;
        parametros.avanzada = "SI";

        console.log(parametros.apeMaternoAuditor);
        console.log(parametros.avanzada);

        this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false;
            },
            (error) => this.controlarError(error)
        );
    }


    OnBuscarLineal(): void {
        let texto: string = "<strong>Busqueda Por: </strong>";
        console.log(this.selectedFilter);
        
        switch (this.selectedFilter) {

            case 'numFicha':
                texto = texto + "<br/><strong>N° Ficha: </strong>" + this.textoBusqueda;
                break;
            case 'nombreAuditor':
                texto = texto + "<br/><strong>Nombre: </strong>" + this.textoBusqueda;
                break;
            case 'apePaternoAuditor':
                texto = texto + "<br/><strong>Ape. Paterno: </strong>" + this.textoBusqueda;
                break;
            case 'apeMaternoAuditor':
                texto = texto + "<br/><strong>Ape. Materno: </strong>" + this.textoBusqueda;
                break;

        }
        this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        this.mostrarAlerta = true;
        this.paginacion.pagina = 1;

        this.getLista();
    } */

}

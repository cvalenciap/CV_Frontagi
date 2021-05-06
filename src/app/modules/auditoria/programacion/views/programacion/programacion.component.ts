import { Component, OnInit, SecurityContext } from '@angular/core';
//import { ProgramacionAuditoria } from './../../../../../models/programacionauditoria';
import { Router } from '@angular/router';


import { Paginacion } from './../../../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';

import { Response } from './../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';

import { ProgramacionAuditoriaMockService, ProgramacionAuditoriaService, GeneralService } from './../../../../../services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalBusquedaProgramacionComponent } from '../../modales/modal-busqueda-programacion/modal-busqueda-programacion.component';
import { DatePipe } from '@angular/common';
import { Programa } from 'src/app/models/programa';

@Component({
    selector: 'app-programacion',
    templateUrl: './programacion.component.html',
    styleUrls: ['./programacion.component.scss'],
    providers: [ProgramacionAuditoriaService]
})
export class ProgramacionComponent implements OnInit {

    busquedaProgramacion: Programa;
    textoBusqueda: string;
    fechaBusqueda: Date;
    selectedFilter: string;
    paginacion: Paginacion;
    selectedRow: number;
    selectedObject: Programa;
    loading: boolean;
    mensajeAlerta: string;
    mostrarAlerta: boolean;
    dismissible = true;
    bsModalRef: BsModalRef;
    //Inicio Prototipo
    mostrarA: boolean;
    mostrarB: boolean;
    mostrarC: boolean;
    //Fin Prototipo
    
    datoGrilla : any[];

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private service: ProgramacionAuditoriaMockService,
        private serviceBD: ProgramacionAuditoriaService,
        private generalService: GeneralService,
        private modalService: BsModalService,
        private datePipe: DatePipe,
        private sanitizer: DomSanitizer) {
        this.loading = false;
        this.selectedRow = -1;
        this.selectedFilter = 'usuario';
        this.paginacion = new Paginacion({ registros: 10 });
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.mostrarA = true;
        this.mostrarB = true;
        this.mostrarC = true;

        this.datoGrilla = this.getDatos();
    }

    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        //this.getLista();
    }



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
        this.selectedObject = obj;
    }

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    abrirBusqueda() {
        this.selectedFilter = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {

            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalBusquedaProgramacionComponent, config);
        (<ModalBusquedaProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
            this.busquedaProgramacion = result;
            //this.OnBuscar();

        });
    }

    /*getLista(): void {
        this.loading = true;
        const parametros: { usuario?: string, fecha?: string, descripcion?: string } = { usuario: null, fecha: null, descripcion: null };
        switch (this.selectedFilter) {
            case 'usuario':
                parametros.usuario = this.textoBusqueda;
                break;
            case 'fecha':
                console.log(this.fechaBusqueda);
                parametros.fecha = this.datePipe.transform(this.fechaBusqueda, "dd/MM/yyyy");
                break;
            case 'avanzada':
                if (this.busquedaProgramacion.usuarioCreacion != "") {
                    parametros.usuario = this.busquedaProgramacion.usuarioCreacion;
                }
                if (this.busquedaProgramacion.fechaPrograma != undefined && this.busquedaProgramacion.fechaPrograma != null) {
                    parametros.fecha = this.datePipe.transform(this.busquedaProgramacion.fechaPrograma, "dd/MM/yyyy");
                }

        }
        this.serviceBD.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
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

     agregarItem(listaResultados:any[],datosPaginacion:any):any[]{
       let  contador:number;
       contador = (datosPaginacion.pagina - 1)*datosPaginacion.registros + 1;
       listaResultados.forEach(element => {
        element.item = contador;
        contador++;
       });
    
       return listaResultados;
    
    } */

    

    /* OnBuscar(): void {
        let texto: string = "<strong>Busqueda Por: </strong>";
        console.log(this.selectedFilter);
        
        switch (this.selectedFilter) {

            case 'usuario':
                texto = texto + "<br/><strong>Usuario: </strong>" + this.textoBusqueda;
                break;
            case 'fecha':
                texto = texto + "<br/><strong>Fecha: </strong>" + this.datePipe.transform(this.fechaBusqueda, "dd/MM/yyyy");
                break;
            case 'avanzada':
                if (this.busquedaProgramacion.usuarioCreacion != "") {
                    texto = texto + "<br/><strong>Usuario: </strong>" + this.busquedaProgramacion.usuarioCreacion + " ";
                }
                if (this.busquedaProgramacion.fechaPrograma != undefined && this.busquedaProgramacion.fechaPrograma != null) {
                    texto = texto + "<br/><strong>Fecha: </strong>" + this.datePipe.transform(this.busquedaProgramacion.fechaPrograma, "dd/MM/yyyy");
                }
                break;

        }
        this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        this.mostrarAlerta = true;
        this.paginacion.pagina = 1;
        this.getLista();
    }
    OnModificar(itemSeleccionado: Programa): void {
        this.router.navigate([`auditoria/programacion/editar/${itemSeleccionado.idPrograma}`]);
    }
    onEliminar(itemSeleccionado: Programa): void {
          this.serviceBD.eliminar(itemSeleccionado).subscribe(
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
    } */

  

    /* setFilter(filter: string) {
        this.selectedFilter = filter;
        console.log(this.selectedFilter);
    } */

    //Inicio Prototipo
    /*
    OnHabilitarAL() {
        this.mostrarA = true;
        this.mostrarB = true;
        this.mostrarC = false;
    }

    OnHabilitarCO() {
        this.mostrarA = false;
        this.mostrarB = false;
        this.mostrarC = true;
    }

    OnHabilitarRAD() {
        this.mostrarA = true;
        this.mostrarB = false;
        this.mostrarC = false;
    }
    */
    //Fin Prototipo

    getDatos() {
        return [
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas I', year: 2019, estado: 'Aprobado' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas II', year: 2020, estado: 'En Revisión' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas III', year: 2019, estado: 'Aprobado' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas IV', year: 2021, estado: 'Aprobado' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas V', year: 2019, estado: 'En Revisión' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas VI', year: 2020, estado: 'Aprobado' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas VII', year: 2019, estado: 'Aprobado' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas IV', year: 2021, estado: 'Aprobado' },
            { descripcion: 'Auditoria Interna de la Gerencia de Finanzas V', year: 2019, estado: 'En Revisión' }
        ]
    }

}

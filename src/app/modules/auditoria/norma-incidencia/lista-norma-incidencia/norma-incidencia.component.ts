
import { Component, OnInit, SecurityContext, ViewChild } from '@angular/core';
import { NormaIncidencia } from './../../../../models/normaincidencia';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';

import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { forkJoin, interval } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalOptions, BsModalService, BsModalRef, BsLocaleService } from 'ngx-bootstrap';

//import { NormaIncidenciaMockService as NormaIncidenciaService} from './../../../../services/index';

import { NormaIncidenciaService, GeneralService } from '../../../../services';

import { ModalBusquedaAvanzNormaIncidenciaComponent } from '../modal-busqueda-avanz-norma-incidencia/modal-busqueda-avanz-norma-incidencia.component';
import { NombreParametro } from 'src/app/constants/general/general.constants';
import { Norma } from 'src/app/models/norma';





@Component({
    selector: 'norma-incidencia',
    templateUrl: './norma-incidencia.component.html',
    styleUrls: ['./norma-incidencia.component.scss'],
    providers: [NormaIncidenciaService]
})
export class NormaIncidenciaComponent implements OnInit {
    [x: string]: any;

    items: NormaIncidencia[];
    itemsNorma: Norma[];
    textoBusqueda: string;
    parametroBusqueda: string;
    nodosRequisitos: any[] = [];

    norma: Norma[];

    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
    selectedObject: NormaIncidencia;
    selectedObjectNorna: Norma;
    /* indicador de carga */
    loading: boolean;
    opcionBusqueda: string;
    normaIncidencia: NormaIncidencia;
    //para la busqueda
    listaTipos: any[];
    listaNormas: any[];
    listaNorma: any[];

    valorTipo: string;
    valorNormas: string;
    mostrarAlerta: boolean;
    mensajeAlerta: string;
    valorNorma: Norma;
    busquedaNormas: NormaIncidencia;
    selectedObjectNorma: Norma;
    descripNorma: string;


    constructor(
        LocaleService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private service: NormaIncidenciaService,
        private modalService: BsModalService,
        private generalService: GeneralService,
        private sanitizer: DomSanitizer) {

        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
        this.itemsNorma = [];
        this.norma = [];


        this.parametroBusqueda = 'tipo';
        this.opcionBusqueda = "";
        this.descripNorma = "";

        this.valorTipo = "";
        this.valorNormas = "";
        this.paginacion = new Paginacion({ registros: 10 });
    }

    ngOnInit() {

        this.listaTipos = [];
        this.listaNormas = [];
        this.listaNorma = [];
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.inicializandoParametros();
        this.obtenerParametros();
        this.getLista();
        this.descripNorma = "";


    }

    getLista(): void {
        
        this.loading = true;
        const parametros: { tipo?: string, norma?: string } = { tipo: null, norma: null };
        switch (this.parametroBusqueda) {
            case 'tipo':
                if (this.valorTipo != "") {
                    parametros.tipo = this.valorTipo;
                }
                break;
            case 'norma':
                if (this.valorNormas != "") {
                    parametros.norma = this.valorNormas;
                }
                break;
            case 'avanzada':
                if (this.busquedaNormas.tipo != "") {
                    parametros.tipo = this.busquedaNormas.tipo;
                }
                if (this.busquedaNormas.normaRelacionada != "") {
                    parametros.norma = this.busquedaNormas.normaRelacionada;
                }
                this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
                    (response: Response) => {
                        console.log(response);
                        console.log(this.items);
                        this.items = response.resultado;
                        console.log(this.items);
                        this.paginacion = new Paginacion(response.paginacion);
                        this.loading = false;
                        if (this.parametroBusqueda == "avanzada") {
                            this.parametroBusqueda = "tipo";
                        }
                    },
                    (error) => this.controlarError(error)
                );
        }
    }

    obtenerParametros() {
        const buscaTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTiposReglas);
        const buscaNormas = this.service.obtenerNormas("1");

        forkJoin(buscaTipos, buscaNormas).subscribe(([buscaTipos, buscaNormas]: [Response, Response]) => {
            this.listaTipos = buscaTipos.resultado;
            this.listaNormas = buscaNormas.resultado;
        },
            (error) => this.controlarError(error));
    }



    eliminarNormaIncidencia(fila: any) {
        this.items.splice(fila, 1);
        this.selectedRow = -1;

        this.service.eliminar(this.selectedObject).subscribe(
            (response: Response) => {
                console.log(this.paginacion.totalPaginas.toString());
                this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
                this.getLista();
                this.loading = false;
            },
            (error) => this.controlarError(error)
        );

    }


    inicializandoParametros() {
        this.valorTipo = "";
        this.valorNormas = "";
        //this.parametroBusqueda = "";
    }

    obtenerValorTipo(valor: string) {
        let valorTipo = this.listaTipos.find(item => item.v_campcons1 == valor);
        return valorTipo.v_valcons;
    }

    /* obtenerValorNormas(valor: string, tipo: string) {
         this.service.obtenerNormas(tipo).subscribe(
             (response: Response) =>
                 let listaderevisiondoc: Norma[] = response.resultado;
         this.norma = listaderevisiondoc;*/
    /*antes   
    this.valorNorma = this.norma.find(item => item.idNorma == valor);
    this.descripNorma = this.valorNorma.descripcionNorma;*/
    /*this.valorNorma = this.norma.find(item => item.n_id_normas === Number(valor));
    this.descripNorma = this.valorNorma.v_nom_norma;
    console.log("PRIMERA");
    console.log(this.descripNorma);


}, (error) => this.controlarError(error));
return this.descripNorma;

}*/

    activarOpcion(accion: number) {
        this.opcionBusqueda = "";
        switch (accion) {
            case 1: this.parametroBusqueda = "tipo"; break;
            case 2: this.parametroBusqueda = "norma"; break;

        }
    }



    /*   abrirBusqueda() {
   
           const config = <ModalOptions>{
               ignoreBackdropClick: true,
               keyboard: false,
               initialState: {
               },
               class: 'modal-lg'
           }
           this.bsModalRef = this.modalService.show(ModalBusquedaAvanzNormaIncidenciaComponent, config);
           (<ModalBusquedaAvanzNormaIncidenciaComponent>this.bsModalRef.content).onClose.subscribe(result =
               this.busquedaNormas = result;
           this.parametroBusqueda = "avanzada";
           this.OnBuscar();
   
       });*/

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        this.paginacion.registros = event.itemsPerPage;

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
        /* let texto: string = "<strong>Busqueda Por: </strong>";
        switch (this.parametroBusqueda) {
            case 'tipo':
    
                if (this.valorTipo == "") {
                    texto = texto + "<br/><strong>Tipo: </strong>" + "TODOS";
                } else {
                    texto = texto + "<br/><strong>Tipo: </strong>" + this.obtenerValorTipo(this.valorTipo);
                }
                break;
    
            case 'norma':
    
                if (this.valorNormas == "") {
                    texto = texto + "<br/><strong>Tipo: </strong>" + "TODOS";
                } else {
                    texto = texto + "<br/><strong>Norma: </strong>" + this.obtenerValorNormas(this.valorNormas, "1");
                }
                break;
    
            case 'avanzada':
                if (this.busquedaNormas.tipo != "") {
                    texto = texto + "<br/><strong>Tipo: </strong>" + this.obtenerValorTipo(this.busquedaNormas.tipo);
                }
                if (this.busquedaNormas.normaRelacionada != "") {
    
                    this.service.obtenerNormas(this.busquedaNormas.tipo).subscribe(
                        (response: Response) => {
                            
                            let listaderevisiondoc: Norma[] = response.resultado;
                            this.norma = listaderevisiondoc;
                            this.valorNorma = this.norma.find(item => item.idNorma == this.busquedaNormas.normaRelacionada);
                            this.descripNorma = this.valorNorma.descripcionNorma;
                            console.log("PRIMERA");
                            console.log(this.descripNorma);
                            texto = texto + "<br/><strong>Norma: </strong>" + this.descripNorma;

                        }, (error) => this.controlarError(error));



                }
    
        }
        this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        this.mostrarAlerta = true; */
        this.paginacion.pagina = 1;
        this.getLista();
        this.inicializandoParametros();

    }

    limpiarCombo() {

    }

    OnPrueba(): void {

        this.router.navigate([`auditoria/norma-incidencia/pruebaArbol`]);

    }



    OnModificar(item): void {
        
        this.router.navigate([`auditoria/norma-incidencia/editar/${item.idNorma}`]);
        //this.cargarArbol(item);

        // this.service.buscarRequisitosNorma(item.idNorma).subscribe(
        //     (response: Response) => {
        //         this.nodosRequisitos = response.resultado;
        //       const source = interval(1000);
        //      },
        //   (error) => this.controlarError(error)
        //   )

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
    }*/

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    eliminarNorma(normaIncidencia: Norma): void {
        this.selectedObjectNorma = normaIncidencia;
        /*antes this.service.eliminarNorma(this.selectedObjectNorma).subscribe(
             (response: Response) => {
                 this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
                 this.getLista();
                 this.loading = false;
             },
             (error) => this.controlarError(error)
         );*/
    }

}

import { Component, OnInit, Inject, NgModule, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { Pregunta } from './../../../../../models/pregunta';
import { Paginacion } from '../../../../../models/paginacion';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../../../models/response';
import { DomSanitizer } from '@angular/platform-browser';
import { BancoPreguntaService, GeneralService, ParametrosService } from './../../../../../services';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { ViewChild } from '@angular/core';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';

@Component({
    selector: 'app-lista',
    templateUrl: 'lista.template.html',
    styleUrls: ['lista.component.scss'],
    providers: [BancoPreguntaService]
})

export class BancoPreguntasListaComponent implements OnInit {
    @ViewChild('pageOption') pageOption: PaginacionSetComponent;
    bsModalRef: BsModalRef;
    busquedaRegistroAuditor: Pregunta;
    respuestaRol: string[];
    selectedFilter: string;
    private parametroPlazos: number;
    rol: string;
    items: any[];
    mostrarAlerta: boolean;
    textoBusqueda: string;
    mensajeAlerta: string;
    parametroBusqueda: string;
    parametrosBusquedaAvanzadaRetorno: Map<string, any>;
    paginacion: Paginacion;
    selectedRow: number;
    selectedObject: Pregunta;
    public item: Pregunta;
    loading: boolean;
    objetoRetornoBusqueda: RetornosBusqueda;
    listaPregunta: Pregunta[];
    idUsuarioLogueo: number;
    tipoBusqueda: number;
    paginaRetorno: number;
    valorPaginacion: number;
    IndicadorPagina: number;
    public interruptorBuscar: boolean;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private modalService: BsModalService,
        private service: BancoPreguntaService,
        private generalService: GeneralService,
        private sanitizer: DomSanitizer,
        private parametroService: ParametrosService,
    ) {
        this.loading = false;
        this.selectedRow = -1;
        let items = new Pregunta();
        this.textoBusqueda = '';
        this.objetoRetornoBusqueda = new RetornosBusqueda();
        this.selectedFilter = 'N° Ficha';
        this.parametroBusqueda = 'N° Ficha';
        this.parametrosBusquedaAvanzadaRetorno = new Map<string, any>();
        this.listaPregunta = [];
        this.paginacion = new Paginacion({ registros: 10 });
        this.valorPaginacion = 0;
        this.IndicadorPagina = 0;
    }
    ngOnInit() {
        this.interruptorBuscar = true;
        this.mostrarAlerta = false;
        if (localStorage.getItem("objetoRetornoBusqueda") != undefined || localStorage.getItem("objetoRetornoBusqueda") != null) {
            this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
            this.buscarRetorno();
            if (this.paginacion.registros > 10) {
                this.paginaRetorno = this.paginacion.pagina;
                this.pageOption.change(this.paginacion.registros);
                if (this.paginaRetorno > 1) {
                    this.OnPageChangedReturn(this.paginaRetorno, this.paginacion.registros);
                }
            } else {
                this.OnPageChangedReturn(this.paginacion.pagina, this.paginacion.registros);
            }
        }
        else {
            this.textoBusqueda = '';
            this.parametroBusqueda = 'pregunta';
            this.tipoBusqueda = 1;
            this.buscar();
        }
    }
    buscar() {
        let texto: string = "<strong>Busqueda Por: </strong>";
        switch (this.parametroBusqueda) {
            case 'pregunta':
                texto = texto + "<br/><strong>Descripción de Pregunta: </strong>" + this.textoBusqueda;
                break;
        }
        if (this.textoBusqueda.trim() != '') {
            this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
            this.mostrarAlerta = true;
        } else {
            this.textoBusqueda = '';
            this.mostrarAlerta = false;
        }
        this.obtenerPreguntas(this.obtenerParametros());
    }
    buscarRetorno() {
        let texto: string = "<strong>Busqueda Por: </strong>";
        this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
        this.textoBusqueda = this.objetoRetornoBusqueda.textoBusqueda;
        this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
        this.paginacion.registros = this.objetoRetornoBusqueda.registros;
        this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;
        switch (this.parametroBusqueda) {
            case 'pregunta':
                texto = texto + "<br/><strong>Descripción de Pregunta: </strong>" + this.textoBusqueda;
                break;
        }
        if (this.textoBusqueda.trim() != '') {
            this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
            this.mostrarAlerta = true;
        } else {
            this.textoBusqueda = '';
            this.mostrarAlerta = false;
        }
        this.obtenerPreguntas(this.obtenerParametros());
    }
    obtenerParametros() {
        let parametros: Map<string, any> = new Map();
        parametros.set('pagina', this.paginacion.pagina).set('registros', this.paginacion.registros);

        this.objetoRetornoBusqueda.pagina = this.paginacion.pagina;
        this.objetoRetornoBusqueda.registros = this.paginacion.registros;
        this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;

        if (this.parametroBusqueda === 'pregunta') {
            parametros.set('pregunta', this.textoBusqueda);
            this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;
        }
        localStorage.removeItem("objetoRetornoBusqueda");
        localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));
        this.parametrosBusquedaAvanzadaRetorno = parametros;
        return parametros;
    }
    obtenerPreguntas(parametrosFiltro: Map<string, any>) {
        this.loading = true;
        this.service.ObtenerDatosPreguntas(parametrosFiltro)
            .subscribe((responseObject: Response) => {
                this.listaPregunta = responseObject.resultado;

                this.listaPregunta.forEach(obj => {
                    obj.listaRoles = [];
                    this.rolAuditor(obj);
                });
                this.paginacion = new Paginacion(responseObject.paginacion);
                this.loading = false;
            }, (error) => { console.log(error); });
    }
    rolAuditor(item: any) {
        if (item.auditorLider === "1") {
            item.listaRoles[0] = "Auditor Líder";
        } else {
            item.listaRoles[0] = "";
        };

        if (item.auditorLiderInterno === "1") {
            item.listaRoles[1] = "Auditor Líder de Grupo";
        } else {
            item.listaRoles[1] = "";
        };
        if (item.auditorInterno === "1") {
            item.listaRoles[2] = "Auditor Interno";
        } else {
            item.listaRoles[2] = "";
        };
        if (item.auditorObservador === "1") {
            item.listaRoles[3] = "Observador";
        } else {
            item.listaRoles[3] = "";
        };

    }
    OnPageChangedReturn(pagina: number, registros: number): void {
        this.paginacion.registros = registros;
        this.paginacion.pagina = pagina;
        this.buscar();
    }
    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        this.buscar();
    }
    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        this.buscar();
    }
    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
    }
    OnBuscar(): void {
        this.paginacion.pagina = 1;
        this.buscar();
    }
    OnModificar(pregunta: Pregunta): void {
        this.router.navigate([`auditoria/banco-preguntas/editar/${pregunta.iD}`]);
    }
    
    onEliminar(pregunta: Pregunta): void {
        this.service.eliminar(pregunta).subscribe(
            (response: Response) => {
                this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
                this.loading = false;
                this.buscar();
            },
        );
    }
    controlarError(error) {
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }
    abrirBusqueda() {
        this.selectedFilter = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                hola: "adios"
            },
            class: 'modal-lg'
        }

    }
    OnBuscarAvanzado(busquedaRegistroAuditorAux?: Pregunta): void {
        this.paginacion.pagina = 1;
        this.loading = true;
    }
    OnBuscarLineal(): void {
        let texto: string = "<strong>Busqueda Por: </strong>";
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
    }
    limpiar() {
        localStorage.removeItem("objetoRetornoBusqueda");
        this.interruptorBuscar = true;
        this.textoBusqueda = '';
        this.parametroBusqueda = 'pregunta';
        this.valorPaginacion = 0;
        this.paginacion.pagina = 1;
        this.IndicadorPagina = 0;
        this.tipoBusqueda = 1;
        this.buscar()
        this.mensajeAlerta = '';
        this.mostrarAlerta = false;
    }
}
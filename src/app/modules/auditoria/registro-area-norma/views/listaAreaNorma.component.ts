import { Component, OnInit, } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
import { Paginacion } from 'src/app/models/paginacion';
import { AreaAuditoriaService } from 'src/app/services/areaauditoria.service';
import { NgxSpinnerService } from 'ngx-spinner';
import { AreaParametros } from 'src/app/models/areas-parametro';
import { AreaAuditoria } from 'src/app/models/area-auditoria';
import { AreaNormaAuditoria } from 'src/app/models/areanorma-auditoria';


@Component({
    selector: 'app-listaAreaNorma',
    templateUrl: 'listaAreaNorma.template.html',
    styleUrls: ['listaAreaNorma.component.scss']
})
export class ListaAreaNormaComponent implements OnInit {

    areaParametros: AreaParametros;
    lstAreaNormaAuditoria: AreaNormaAuditoria[];
    lstAreaNormaAuditoriaShow: AreaNormaAuditoria[];
    pagingOptions: number[] = [5, 10, 20, 50, 100];
    defaultOption = 10;
    selectedOption = this.defaultOption;

    //EXISTENTES

    bsModalRef: BsModalRef;
    selectedFilter: string;
    mostrarAlerta: boolean;
    textoBusqueda: string;
    mensajeAlerta: string;
    parametroBusqueda: string;
    paginacion: Paginacion;
    selectedRow: number;
    loading: boolean;

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private servicio: AreaAuditoriaService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private modalService: BsModalService,
        private sanitizer: DomSanitizer
    ) {
        this.loading = false;
        this.selectedRow = -1;
        this.textoBusqueda = '';
        this.selectedFilter = 'N° Ficha';
        this.parametroBusqueda = 'N° Ficha';
        this.paginacion = new Paginacion({ registros: 10 });
    }

    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.inicializarVariables();
        this.limpiarListas();
        this.getLista();
    }

    limpiarListas() {
        if (localStorage.getItem('areaParametros')) {
            console.log('Limpiando localStorage');
            localStorage.removeItem('areaParametros');
        }
    }

    inicializarVariables() {
        this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
        this.lstAreaNormaAuditoria = [];
        this.lstAreaNormaAuditoriaShow = [];
    }

    getLista(): void {
        this.spinner.show();
        this.servicio.obtenerAreasParametros().subscribe(
            (response: any) => {
                this.spinner.hide();
                localStorage.setItem('areaParametros', JSON.stringify(response.resultado));
                this.areaParametros = JSON.parse(localStorage.getItem('areaParametros'));
                console.log(this.areaParametros);
                for (let i = 0; i < this.areaParametros.lstAreaNormaAuditoria.length; i++) {
                    if (this.areaParametros.lstAreaNormaAuditoria[i].n_id_tipo === 1 || this.areaParametros.lstAreaNormaAuditoria[i].n_id_tipo === 3) {
                        this.lstAreaNormaAuditoria.push(this.areaParametros.lstAreaNormaAuditoria[i]);
                        this.lstAreaNormaAuditoriaShow.push(this.areaParametros.lstAreaNormaAuditoria[i]);
                    }
                }

                /*
                console.log(this.lstAreaAuditoriaShow);
                this.indicadorActualizar = sessionStorage.getItem('indicadorActualizar');
                console.log(this.indicadorActualizar);
                if (this.indicadorActualizar && this.indicadorActualizar === 'SI') {
                    this.pagina = JSON.parse(sessionStorage.getItem('paginacionActual'));
                    this.usoFiltro = sessionStorage.getItem('usoFiltro');
                    console.log(this.pagina);
                    console.log(this.usoFiltro);
                    this.selectedOption = parseInt(sessionStorage.getItem('numeroPagina'));
                    if (this.usoFiltro === 'SI') {
                        console.log('use filtro');
                        this.filtroBusqueda = parseInt(sessionStorage.getItem('indicadorFiltro'));
                        this.textoBusqueda = sessionStorage.getItem('textoFiltro');
                        this.modeloTipo = JSON.parse(sessionStorage.getItem('busqueda'));
                        console.log(this.filtroBusqueda);
                        console.log(this.textoBusqueda);
                        console.log(this.modeloTipo);
                        setTimeout(() => {
                            this.onFiltrar();
                        }, 1);
                    } else {
                        this.paginacion = new Paginacion({
                            pagina: this.pagina.pagina,
                            registros: this.pagina.registros,
                            totalPaginas: this.pagina.totalPaginas,
                            totalRegistros: this.pagina.totalRegistros
                        });
                    }
                    this.onLimpiarStorage();
                } else {
                    this.paginacion = new Paginacion({
                        pagina: 1,
                        registros: 10,
                        totalPaginas: this.lstAreaAuditoriaShow.length,
                        totalRegistros: this.lstAreaAuditoriaShow.length
                    });
                    this.onLimpiarStorage();
                }
                */
                this.paginacion = new Paginacion({
                    pagina: 1,
                    registros: 10,
                    totalPaginas: this.lstAreaNormaAuditoriaShow.length,
                    totalRegistros: this.lstAreaNormaAuditoriaShow.length
                });
                console.log(this.areaParametros);
            },
            (error) => {
                this.controlarError(error);
            }
        );
    }

    onListarRangoAreaNorma(): AreaNormaAuditoria[] {
        const inicio: number = (this.paginacion.pagina - 1) * this.paginacion.registros;
        const fin: number = (this.paginacion.registros * this.paginacion.pagina);
        return this.lstAreaNormaAuditoriaShow.slice(inicio, fin);
    }

    OnPageChanged(event: any): void {
        this.paginacion.pagina = event.page;
    }

    OnPageOptionChanged(event: any): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
    }

    OnRowClick(index, obj): void {
        this.selectedRow = index;
    }

    OnBuscar(): void {
        this.paginacion.pagina = 1;
    }
    OnModificar(obj): void {

    }

    controlarError(error) {
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

}

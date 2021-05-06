import { Component, OnInit } from '@angular/core';
import { AreaAuditoriaService } from 'src/app/services/areaauditoria.service';
import { ToastrService } from 'ngx-toastr';
import { NgxSpinnerService } from 'ngx-spinner';
import { AreaParametros } from 'src/app/models/areas-parametro';
import { Paginacion } from 'src/app/models/paginacion';
import { AreaAuditoria } from 'src/app/models/area-auditoria';
import { Router } from '@angular/router';
import swal from 'sweetalert2';


@Component({
    selector: 'app-listaAreaAuditoria',
    templateUrl: 'listaAreaAuditoria.template.html',
    styleUrls: ['listaAreaAuditoria.component.scss'],
})
export class ListaAreaAuditoriaComponent implements OnInit {

    areaParametros: AreaParametros;
    lstAreaAuditoria: AreaAuditoria[];
    lstAreaAuditoriaShow: AreaAuditoria[];
    paginacion: Paginacion;
    loading: boolean;
    pagingOptions: number[] = [5, 10, 20, 50, 100];
    defaultOption = 10;
    selectedOption = this.defaultOption;
    textoBusqueda: string;
    filtroBusqueda: number;
    indicadorActualizar: string;
    usoFiltro: string;
    pagina: any;
    lstTipos = [
        {
            id_tipo: 1,
            nom_tipo: 'GERENCIA'
        },
        {
            id_tipo: 2,
            nom_tipo: 'EQUIPO'
        },
        {
            id_tipo: 3,
            nom_tipo: 'COMITÉ'
        }
    ];
    modeloTipo: any;

    constructor(private servicio: AreaAuditoriaService,
        private toastr: ToastrService,
        private spinner: NgxSpinnerService,
        private router: Router
    ) {

    }
    ngOnInit() {
        this.indicadorActualizar = sessionStorage.getItem('indicadorActualizar')
        this.limpiarListas();
        this.inicializarVariables();
        this.getLista();

        console.log(this.lstAreaAuditoria);
    }

    inicializarVariables() {
        this.paginacion = new Paginacion({ registros: 10, pagina: 1 });
        this.lstAreaAuditoria = [];
        this.lstAreaAuditoriaShow = [];
        this.filtroBusqueda = 1;
        this.usoFiltro = 'NO';
    }

    limpiarListas() {
        if (localStorage.getItem('areaParametros')) {
            console.log('Limpiando localStorage');
            localStorage.removeItem('areaParametros');
        }
    }

    onRegresar() {
        this.lstAreaAuditoriaShow = [];
        let areaAuditoria = new AreaAuditoria();
        let paginacion: Paginacion;
        this.filtroBusqueda = parseInt(sessionStorage.getItem('indicadorFiltro').toString());
        if (this.filtroBusqueda === 1) {
            this.textoBusqueda = sessionStorage.getItem('textoFiltro');
        } else if (!this.filtroBusqueda) {
            this.modeloTipo = JSON.parse(sessionStorage.getItem('busqueda'));
        }
        areaAuditoria = JSON.parse(sessionStorage.getItem('itemAreaAudiMod'));
        paginacion = JSON.parse(sessionStorage.getItem('paginaAreaActual'));
        this.lstAreaAuditoriaShow = JSON.parse(sessionStorage.getItem('listaActual'));
        this.paginacion = new Paginacion({
            pagina: paginacion.pagina,
            registros: paginacion.registros,
            totalPaginas: paginacion.totalPaginas,
            totalRegistros: paginacion.totalRegistros
        });
    }

    getLista(): void {
        this.spinner.show();
        this.servicio.obtenerAreasParametros().subscribe(
            (response: any) => {
                this.spinner.hide();
                localStorage.setItem('areaParametros', JSON.stringify(response.resultado));
                this.areaParametros = JSON.parse(localStorage.getItem('areaParametros'));
                for (let i = 0; i < this.areaParametros.lstAreaAuditoria.length; i++) {
                    if (this.areaParametros.lstAreaAuditoria[i].n_id_area && this.areaParametros.lstAreaAuditoria[i].v_st_reg === 1) {
                        this.lstAreaAuditoria.push(this.areaParametros.lstAreaAuditoria[i]);
                        this.lstAreaAuditoriaShow.push(this.areaParametros.lstAreaAuditoria[i]);
                    }
                }
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
                console.log(this.areaParametros);
            },
            (error) => {
                this.controlarError(error);
            }
        );
    }

    onLimpiarStorage() {
        sessionStorage.removeItem('indicadorActualizar');
        sessionStorage.removeItem('paginacionActual');
        sessionStorage.removeItem('numeroPagina');
        sessionStorage.removeItem('indicadorFiltro');
        sessionStorage.removeItem('textoFiltro');
        sessionStorage.removeItem('usoFiltro');
        sessionStorage.removeItem('busqueda');
        sessionStorage.removeItem('itemAreaAudiMod');
    }

    onFiltrar() {
        this.usoFiltro = 'SI';
        this.lstAreaAuditoriaShow = [];
        this.paginacion = new Paginacion({
            pagina: 0,
            registros: 0,
            totalPaginas: 0,
            totalRegistros: 0
        });
        console.log(this.modeloTipo);
        if (this.filtroBusqueda === 1) {
            const filtro = this.textoBusqueda.toUpperCase();
            for (let i = 0; i < this.lstAreaAuditoria.length; i++) {
                const textoInclido = (this.lstAreaAuditoria[i].v_nom_area).toUpperCase();
                const resultado = textoInclido.lastIndexOf(filtro);
                if (resultado !== -1) {
                    this.lstAreaAuditoriaShow.push(this.lstAreaAuditoria[i]);
                }
            }
        } else {
            if (this.modeloTipo.id_tipo === 1) {
                this.lstAreaAuditoriaShow = this.lstAreaAuditoria.filter(s => s.n_id_tipo === 1);
            } else if (this.modeloTipo.id_tipo === 2) {
                this.lstAreaAuditoriaShow = this.lstAreaAuditoria.filter(s => s.n_id_tipo === 2);
            } else {
                this.lstAreaAuditoriaShow = this.lstAreaAuditoria.filter(s => s.n_id_tipo === 3);
            }
        }
        if (this.indicadorActualizar && this.indicadorActualizar === 'SI') {
            this.paginacion = new Paginacion({
                pagina: this.pagina,
                registros: this.selectedOption,
                totalPaginas: this.lstAreaAuditoriaShow.length,
                totalRegistros: this.lstAreaAuditoriaShow.length
            });
            console.log(this.paginacion);
        } else {
            this.paginacion = new Paginacion({
                pagina: 1,
                registros: 10,
                totalPaginas: this.lstAreaAuditoriaShow.length,
                totalRegistros: this.lstAreaAuditoriaShow.length
            });
        }
    }

    onLimpiar() {
        this.lstAreaAuditoriaShow = [];
        for (let i = 0; i < this.lstAreaAuditoria.length; i++) {
            this.lstAreaAuditoriaShow.push(this.lstAreaAuditoria[i]);
        }
        this.selectedOption = 10;
        this.textoBusqueda = '';
        this.modeloTipo = null;
        this.paginacion = new Paginacion({
            pagina: 1,
            registros: 10,
            totalPaginas: this.lstAreaAuditoriaShow.length,
            totalRegistros: this.lstAreaAuditoriaShow.length
        });
    }

    setParametroBusqueda(indicador: number) {
        if (indicador === 1) {
            this.filtroBusqueda = 1;
        } else {
            this.filtroBusqueda = 2;
        }
    }

    onModificar(item: AreaAuditoria) {
        sessionStorage.setItem('itemAreaAudiMod', JSON.stringify(item));
        sessionStorage.setItem('indicadorActualizar', 'SI');
        sessionStorage.setItem('usoFiltro', this.usoFiltro);
        sessionStorage.setItem('indicadorFiltro', this.filtroBusqueda.toString());
        if (this.filtroBusqueda === 1) {
            sessionStorage.setItem('textoFiltro', this.textoBusqueda);
        } else if (this.filtroBusqueda) {
            sessionStorage.setItem('busqueda', JSON.stringify(this.modeloTipo));
        }
        sessionStorage.setItem('paginacionActual', JSON.stringify(this.paginacion));
        sessionStorage.setItem('numeroPagina', this.selectedOption.toString());
        this.router.navigate([`/auditoria/registro-area-auditoria/editar/${item.n_id_area}`]);
    }

    onEliminar(item: AreaAuditoria) {
        swal({
            title: '¿Está seguro que desea eliminar el área?',
            type: 'warning',
            showConfirmButton: true,
            allowOutsideClick: false,
            showCancelButton: true,
            confirmButtonText: 'Si, eliminar',
            cancelButtonText: 'No gracias'
        }).then((result) => {
            if (result.value) {
                this.onProcesarDelete(item);
            }
        });
    }

    onProcesarDelete(item: AreaAuditoria) {
        this.spinner.show();
        this.servicio.eliminarArea(item).subscribe(
            (response: any) => {
                this.spinner.hide();
                if (response.resultado === 0) {
                    this.toastr.success('Registro eliminado.', 'Acción completada!', { closeButton: true });
                    this.limpiarListas();
                    this.inicializarVariables();
                    this.onLimpiarStorage();
                    this.getLista();
                } else {
                    this.spinner.hide();
                    this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
                }
            }, (error) => {
                this.spinner.hide();
                this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
            }
        );
    }

    controlarError(error) {
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    onListarRangoAreaAuditoria(): AreaAuditoria[] {
        const inicio: number = (this.paginacion.pagina - 1) * this.paginacion.registros;
        const fin: number = (this.paginacion.registros * this.paginacion.pagina);
        return this.lstAreaAuditoriaShow.slice(inicio, fin);
    }

    OnPageChanged(event: any): void {
        this.paginacion.pagina = event.page;
    }

    OnPageOptionChanged(event: any): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
    }

    change(option) {
        this.selectedOption = option;
        this.paginacion = new Paginacion({ registros: option, totalPaginas: 1, totalRegistros: this.lstAreaAuditoriaShow.length });
        this.paginacion.pagina = 1;
    }





}

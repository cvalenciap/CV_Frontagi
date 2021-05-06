import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { DatePipe } from '@angular/common';

import { Parametro } from '../../../../models/parametro';
import { ParametrosService } from '../../../../services';
import { ProgramacionAuditoriaService } from '../../../../services';
import { AreaService } from '../../../../services/impl/area.service';
import { Constante } from 'src/app/models/enums/constante';
import { NoConformidad } from 'src/app/models/noconformidad';
import { ModalBusquedaAvanzadaComponent } from '../modales/modal-busqueda-avanzada/modal-busqueda-avanzada.component'
import { NoConformidadService } from '../../../../services/impl/noconformidad.service';
import { variable } from '@angular/compiler/src/output/output_ast';
import { Area } from 'src/app/models/area';


@Component({
    selector: 'no-conformidad-lista',
    templateUrl: 'lista.template.html',
    styleUrls: ['lista.component.scss']
})
export class NoConformidadListaComponent implements OnInit {

    /* datos */
    items: NoConformidad[];
    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
    selectedObject: NoConformidad;
    /* indicador de carga */
    loading: boolean;
    /* opcion de busqueda*/
    opcionBusqueda: string;
    /* modal */
    bsModalRef: BsModalRef;
    /* Lista de Parametros */
    listaTipoFecha: Parametro[];
    listaTipo: Parametro[];
    listaNorma: any[];
    listaAlcance: Parametro[];
    listaOrigen: Parametro[];
    listaGerencia: Area[];
    listaEquipo: Area[];
    /* variables de busqueda */
    tipoFecha: string;
    fechaDesde: string;
    fechaHasta: string;    
    codigo: string;
    tipo: string;    
    norma: string;
    alcance: string;
    requisito: string;
    origen: string;
    gerencia: string;
    equipo: string;
    /* variable para busqueda*/
    parametroArea: any;
    /* variable informativo de busqueda  */
    textoInformativo: string;

    /* Mientras */
    accesoUsuario: number;
    /* Mientras */

    constructor(private modalService: BsModalService,
                private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private datePipe: DatePipe,
                private serviceParametro: ParametrosService,
                private serviceAuditoria: ProgramacionAuditoriaService,
                private serviceArea: AreaService,
                private sanitizer: DomSanitizer,
                private service: NoConformidadService) {
        this.loading = false;
        this.selectedRow = -1;
        this.paginacion = new Paginacion({ registros: 10 });
        this.items = [];
        this.opcionBusqueda = 'codigo';
        this.listaTipoFecha = [];
        this.listaTipo = [];        
        this.listaNorma = [];
        this.listaAlcance = [];
        this.listaOrigen = [];
        this.listaGerencia = [];
        this.listaEquipo = [];
        this.parametroArea = null;
        this.textoInformativo = "";
        /* Mientras */
        this.accesoUsuario = 0; //0 Representante //1 Coordinador
        /* Mientras */
    }

    ngOnInit() {
        /* this.OnSeteaVariables();
        this.serviceParametro.obtenerParametroPadre(Constante.TIPO_FECHA_NO_CONFORMIDAD).subscribe(
            (response: Response) => {
                this.listaTipoFecha = response.resultado;
            },
            (error) => this.controlarError(error)
        );
        this.serviceParametro.obtenerParametroPadre(Constante.TIPO_NO_CONFORMIDAD).subscribe(
            (response: Response) => {
                this.listaTipo = response.resultado;
            },
            (error) => this.controlarError(error)
        );

        this.service.buscarNorma().subscribe(
            (response: Response) => {
                this.listaNorma = response.resultado;                
            },
            (error) => this.controlarError(error)
        );

        this.serviceParametro.obtenerParametroPadre(Constante.TIPO_ORIGEN_DETECCION).subscribe(
            (response: Response) => {
                this.listaOrigen = response.resultado;
            },
            (error) => this.controlarError(error)
        );
        
        this.parametroArea = { idArea: null, idCentro: null, descripcion: null, tipoArea: Constante.TIPO_AREA_GERENCIA, idAreaSuperior: null };
        this.serviceArea.buscarArea(this.parametroArea).subscribe(
            (response: Response) => {
                this.listaGerencia = response.resultado;
            },
            (error) => this.controlarError(error)
        );
        this.parametroArea = { idArea: null, idCentro: null, descripcion: null, tipoArea: Constante.TIPO_AREA_EQUIPO, idAreaSuperior: null };
        this.serviceArea.buscarArea(this.parametroArea).subscribe(
            (response: Response) => {
                this.listaEquipo = response.resultado;
            },
            (error) => this.controlarError(error)
        ); */
    }

    OnSeteaVariables(): void {
        this.tipoFecha = null;
        this.fechaDesde = null;
        this.fechaHasta = null;   
        this.codigo = null;
        this.tipo = null;
        this.norma = null;
        this.alcance = null;
        this.requisito = null;
        this.origen = null;
        this.gerencia = null;
        this.equipo = null;
    }

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        this.OnBuscar();
    }

    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        this.OnBuscar();
    }

    OnRowClick(index, obj): void {
        this.selectedRow = index;
        // this.selectedObject = obj;
    }

    OnBuscar(): void {
        this.selectedRow = -1;
        this.loading = true;
        const parametros: any = {
                tipoFecha: this.tipoFecha,                
                fechaDesde: this.datePipe.transform(this.fechaDesde,"dd/MM/yyyy"),
                fechaHasta: this.datePipe.transform(this.fechaHasta,"dd/MM/yyyy"),
                codigo: this.codigo,
                tipoConformidad: this.tipo,
                norma: this.norma,
                //alcance: this.alcance,
                requisito: this.requisito,
                origenDeteccion: this.origen,
                gerencia: this.gerencia,
                equipo: this.equipo
            };
        this.service.buscarNoConformidad(parametros, this.paginacion).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false;
                this.OnVerCriterioBusqueda();
                this.OnSeteaVariables();
            },
            (error) => this.controlarError(error)
        );
    }

    controlarError(error): void {
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    OnAbrirBusquedaAvanzada(): void {
        this.OnSeteaVariables();
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title: "Búsqueda Avanzada",
                listaTipoFecha: this.listaTipoFecha,
                listaTipo: this.listaTipo,
                listaNorma: this.listaNorma,
                listaAlcance: this.listaAlcance,
                listaOrigen: this.listaOrigen,
                listaGerencia: this.listaGerencia,
                listaEquipo: this.listaEquipo
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalBusquedaAvanzadaComponent, config);
        (<ModalBusquedaAvanzadaComponent>this.bsModalRef.content).onClose.subscribe(result => {
            this.tipoFecha = result.tipoFecha;
            this.fechaDesde = result.fechaDesde;
            this.fechaHasta = result.fechaHasta;
            this.codigo = result.codigo;
            this.tipo = result.tipo;
            this.norma = result.norma;
            this.alcance = result.alcance;
            this.requisito = result.requisito;
            this.origen = result.origen;
            this.gerencia = result.gerencia;
            this.equipo = result.equipo;
            this.OnBuscar();
        });
    }

    OnVerElementoOpcionBusqueda(opcion: string): void {
        this.opcionBusqueda = opcion;
        this.OnSeteaVariables();
    }

    //OnModificar(objetoSeleccionado: NoConformidad): void {
        OnModificar(): void {
        //sessionStorage.setItem('objNoConformidad', JSON.stringify(objetoSeleccionado));
        sessionStorage.setItem('accesoUsuario',this.accesoUsuario.toString());
        this.router.navigate([`noconformidad/bandejanoconformidad/editar`]);
    }

    OnVerCriterioBusqueda(): void{
        this.textoInformativo = "";
        let busquedaRealizada: boolean = false;
        let textoHtml = "<strong>Búsqueda Por:</strong>"
        if(this.tipoFecha){
            busquedaRealizada = true;
            textoHtml = textoHtml + "<br/><strong>"+this.tipoFecha+": </strong> Entre "+this.datePipe.transform(this.fechaDesde,"dd/MM/yyyy")+" y "+this.datePipe.transform(this.fechaHasta,"dd/MM/yyyy");
        }
        if(this.codigo){
            busquedaRealizada = true;
            textoHtml = textoHtml + "<br/><strong>Código: </strong>"+this.codigo;
        }
        if(this.tipo){
            busquedaRealizada = true;
            let obj: Parametro = this.listaTipo.find(x => x.idconstante == Number(this.tipo))
            textoHtml = textoHtml + "<br/><strong>Tipo No Conformidad: </strong>"+obj.v_valcons;
        }
        if(this.norma){
            busquedaRealizada = true;
            let obj: any = this.listaNorma.find(x => x.idNorma == Number(this.norma))
            textoHtml = textoHtml + "<br/><strong>Norma: </strong>"+obj.descripcionNorma;
        }
        if(this.requisito){
            busquedaRealizada = true;
            textoHtml = textoHtml + "<br/><strong>Requisito: </strong>"+this.requisito;
        }
        if(this.origen){
            busquedaRealizada = true;
            let obj: Parametro = this.listaOrigen.find(x => x.idconstante == Number(this.origen))
            textoHtml = textoHtml + "<br/><strong>Origen Detección: </strong>"+obj.v_valcons;
        }
        if(this.gerencia){
            busquedaRealizada = true;
            let obj: Area = this.listaGerencia.find(x => x.idArea == this.gerencia);
            textoHtml = textoHtml + "<br/><strong>Gerencia Responsable: </strong>"+obj.descripcion;
        }
        if(this.equipo){
            busquedaRealizada = true;
            let obj: Area = this.listaEquipo.find(x => x.idArea == this.equipo);
            textoHtml = textoHtml + "<br/><strong>Equipo Responsable: </strong>"+obj.descripcion;
        }        
        if(busquedaRealizada){
            this.textoInformativo = this.sanitizer.sanitize(SecurityContext.HTML, textoHtml);
        }
    }
}

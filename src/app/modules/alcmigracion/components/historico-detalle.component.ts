import { Component, OnInit, Input, AfterViewInit } from '@angular/core';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BandejaDocumentoService } from '../../../services';

import { Programa } from 'src/app/models/programa';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Constante } from 'src/app/models/enums';

@Component({
    selector: 'historico-detalle-documento',
    templateUrl: 'historico-detalle.template.html'
})
export class HistoricoDetalleComponent implements OnInit, OnDestroy {
    selectedRow: number;
    loading: boolean;
    documento: any;
    items: any[];
    paginacion: Paginacion;
    idTipoDocuRechazado: number;

    constructor(private router: Router,
                private toastr: ToastrService,
                private serviceDocumento: BandejaDocumentoService,
                private serviceParametro: ParametrosService) {
        this.selectedRow = -1;
        this.loading = false;
        this.documento = null;
        this.items = [];
        this.paginacion = new Paginacion({ registros: 10 });
    }

    ngOnInit() {        
        this.documento = JSON.parse(sessionStorage.getItem('objDocumento'));
        //this.OnBuscar();
        this.obtenerTipoRechazado();
    }

    obtenerTipoRechazado(){        
        this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_FASE_ACT_DOC).subscribe(
            (response: Response) => {                
              let listaEstadoSolicitud: any[] = response.resultado;
              this.idTipoDocuRechazado = this.serviceParametro.obtenerIdParametro(listaEstadoSolicitud, Constante.ESTADO_FASE_ACT_DOC_RECHAZADO);
              this.OnBuscar();
            },
            (error) => this.controlarError(error)
        );
    }

    ngOnDestroy() {
        sessionStorage.removeItem('objDocumento');
    }
    OnBuscar(): void {        
        this.selectedRow = -1;
        const parametros: any = { codigo: this.documento.id,numrevi:this.documento.revision.numero };
 
        this.serviceDocumento.buscarHistoricoDetalle(parametros, this.paginacion).subscribe(
            (response: Response) => {                
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false;

                if(this.items){
                    for(let i:number = 0; this.items.length>i; i++){
                        this.items[i].idHistorico = i;
                        if(this.items[i].etapa == "Solicitado"){
                            Object.defineProperty(this.items[i],'valorTooltip',{value:'Fecha de Solicitud'})
                        } else if(this.items[i].etapa == "Aprobado Solicitud"){
                            Object.defineProperty(this.items[i],'valorTooltip',{value:'Fecha de Aprobación Solicitud'})
                        } else if(this.items[i].etapa == "Elaboracion"){
                            Object.defineProperty(this.items[i],'valorTooltip',{value:'Fecha de Elaboración'})
                        } else if(this.items[i].etapa == "Consenso"){
                            Object.defineProperty(this.items[i],'valorTooltip',{value:'Fecha de Consenso'})
                        } else if(this.items[i].etapa == "Aprobacion"){
                            Object.defineProperty(this.items[i],'valorTooltip',{value:'Fecha de Aprobación'})
                        } else if(this.items[i].etapa == "Homologacion"){
                            Object.defineProperty(this.items[i],'valorTooltip',{value:'Fecha de Homologación'})
                        }
                    }
                }
            },
            (error) => this.controlarError(error)
        );
    }

    controlarError(error): void {
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    OnRegresar(): void {
        this.router.navigate([`documento/migracion/historico-documento`]);
    }

    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        this.OnBuscar();
    }

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        this.OnBuscar();
    }

    OnRowClick(index): void {
        this.selectedRow = index;
    }

}
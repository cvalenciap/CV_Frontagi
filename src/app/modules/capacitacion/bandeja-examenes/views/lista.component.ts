import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';
import { forkJoin } from 'rxjs';

import { ModalDetalleExamenComponent } from '../modales/modal-detalle-examen/modal-detalle-examen.component';
import { ModalIniciarExamenComponent } from '../modales/modal-iniciar-examen/modal-iniciar-examen.component';

@Component({
    selector: 'examenes-lista',
    templateUrl: 'lista.template.html'
})
export class ExamenesListaComponent implements OnInit {

    /* datos */
    // listNoConformidad: NoConformidad[];
    /* paginación */
    paginacion: Paginacion;
    /* Parámetro de búsqueda*/
    parametroBusqueda: string;
    /* registro seleccionado */
    selectedRow: number;
    // selectedObject: NoConformidad;
    /* indicador de carga */
    loading: boolean;

    bsModalRef: BsModalRef;

    // objNoConfomidad : NoConformidad = {
    //     codigo : "00001",
    //     fechaidentificacion : "27/06/2018",
    //     tiponoconformidad : "SAC",
    //     responsable : "GSC",
    //     norma : "ISO 9001",           
    //     alcance : "EOMR-SJL-2015",
    //     origen : "Hallazgo Personal",
    //     requisito : "7.5.3 Prestación de Servicio",
    //     equipo : "EOMR-SJL",
    //     ambito : "Dentro del SGI",
    //     etapa : "Identificación del Problema",
    //     estado : "En proceso"
    // };

    ngOnInit() {
       this.getLista();
    }

    constructor(private modalService: BsModalService,
                private router: Router){        
        this.paginacion = new Paginacion({registros: 10});
        this.parametroBusqueda = 'codigo';
        this.selectedRow = -1;
        this.loading = false;
        // this.listNoConformidad = [];
    }

    /* Metodo para paginacion */
    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        // this.getLista();
    }

    OnRowClick(index, obj): void {
        
        //this.selectedRow = index;
        // this.selectedObject = obj;

        if(index == 3){
            this.selectedRow = index;
        }else{
            this.selectedRow = -1;
        }
    }

    getLista() : void{        
        for(let i : number = 1; i<= 5; i++){
            // this.listNoConformidad.push(this.objNoConfomidad);
        }
    }

    abrirBusquedaAvanzada(){
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title:"Búsqueda Avanzada"
            },
            class: 'modal-lg'
        }
        // this.bsModalRef = this.modalService.show(ModalBusquedaAvanzadaComponent, config);
        // (<ModalBusquedaAvanzadaComponent>this.bsModalRef.content).onClose.subscribe(result => {
       
        // });
    }

    OnVerDetalle(): void{
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title:"Examen",
                tipoVisualizacion: "consulta-examen"
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalDetalleExamenComponent, config);
        (<ModalDetalleExamenComponent>this.bsModalRef.content).onClose.subscribe(result => {
       
        });
    }
    
    OnModificar(): void {
        this.router.navigate([`noconformidad/bandejanoconformidad/editar`]);
    }

    OnDarExamen(): void{
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title:"EXAMEN - CAPACITACION"
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalIniciarExamenComponent, config);
        (<ModalIniciarExamenComponent>this.bsModalRef.content).onClose.subscribe(result => {
       
        });
    }

}
    
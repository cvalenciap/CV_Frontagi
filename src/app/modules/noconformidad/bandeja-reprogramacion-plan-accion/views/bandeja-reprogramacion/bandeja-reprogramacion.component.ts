import { Component, OnInit, SecurityContext } from '@angular/core';
import { Reprogramacion } from 'src/app/models/reprogramacion';
import { NoConformidad } from 'src/app/models/noconformidad';
import { Router } from '@angular/router';
import { Paginacion } from './../../../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { BandejaReprogramacionService} from './../../../../../services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalDetalleAccionPropuestaComponent } from '../../modales/modal-detalle-accion-propuesta.component';
import { initialState } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';

@Component({
    selector: 'app-bandeja-reprogramacion',
    templateUrl: './bandeja-reprogramacion.template.html',
    styleUrls: ['./bandeja-reprogramacion.component.scss'],
    providers: [BandejaReprogramacionService]
})
export class BandejaReprogramacionComponent implements OnInit {
    
    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.getLista();
    }

    items: NoConformidad[];
    paginacion: Paginacion;
    selectedRow: number;
    selectedObject: Reprogramacion;
    loading: boolean;

    mensajeAlerta:string;
    mostrarAlerta:boolean;
    
    dismissible = true;
    bsModalRef: BsModalRef;
    accesoUsuario: number;
    
    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private service: BandejaReprogramacionService,
                private modalService: BsModalService,
                private sanitizer: DomSanitizer) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
        this.paginacion = new Paginacion({registros: 10});
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.accesoUsuario = 0;
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

    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
    }

    OnModificar(): void {
        this.router.navigate([`noconformidad/bandejareprogramacion/editar/1`]);
        sessionStorage.setItem('accesoUsuario', this.accesoUsuario.toString());
    }

    getLista(): void {
        
        this.loading = true;
        this.service.buscarReprogramacion(this.paginacion.pagina, this.paginacion.registros).subscribe(
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
}
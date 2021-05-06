import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { ProgramarCapacitacion } from 'src/app/models/programarcapacitacion';

@Component({
  selector: 'app-modal-busqueda-capacitacion',
  templateUrl: './modal-busqueda-capacitacion.template.html',
  styleUrls: ['./modal-busqueda-capacitacion.component.scss']
})
export class ModalBusquedaCapacitacionComponent implements OnInit {

    public onClose: Subject<ProgramarCapacitacion>;
    busqueda:ProgramarCapacitacion;
    bsConfig: object;

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService) {
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.busqueda = new ProgramarCapacitacion();
        this.busqueda.codigo = "";
        console.log(this.busqueda);
    }

    OnBuscar(){
        console.log(this.busqueda);
        
        if(this.busqueda.capacitacion != "" || (this.busqueda.fechaInicio != undefined && this.busqueda.fechaFin != undefined) || this.busqueda.instructor != "" || this.busqueda.anioPlanificacion != "" || this.busqueda.estado != ""){
            this.bsModalRef.hide();
            this.onClose.next(this.busqueda);
        }
    }

    OnCancelar(){
        this.bsModalRef.hide();
    }
}
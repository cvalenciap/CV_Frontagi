import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BandejaAsistencia } from 'src/app/models/bandejaasistencia';

@Component({
  selector: 'app-modal-busqueda-asistencia',
  templateUrl: './modal-busqueda-asistencia.template.html',
  styleUrls: ['./modal-busqueda-asistencia.component.scss']
})
export class ModalBusquedaAsistenciaComponent implements OnInit {

    public onClose: Subject<BandejaAsistencia>;
    busqueda:BandejaAsistencia;
    bsConfig: object;

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService) {
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
    }

    ngOnInit() {
        this.onClose = new Subject();
        this.busqueda = new BandejaAsistencia();
        this.busqueda.codigoCapacitacion = "";
        console.log(this.busqueda);
    }

    OnBuscar(){
        console.log(this.busqueda);
        
        if(this.busqueda.codigoCapacitacion != "" || this.busqueda.capacitacion != "" || this.busqueda.codigoSesion != "" || this.busqueda.sesion != ""){
            this.bsModalRef.hide();
            this.onClose.next(this.busqueda);
        }
    }

    OnCancelar(){
        this.bsModalRef.hide();
    }
}
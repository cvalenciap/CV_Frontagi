import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';

@Component({
  selector: 'bandeja-documento-modales-bajar-documento',
  templateUrl: 'bajar-documento.template.html'
})
export class BajarDocumentoComponents implements OnInit {

    public onClose: Subject<BandejaDocumento>;
    busqueda:BandejaDocumento;
    bsConfig: object;
    indicador: number;
    nombre:string;
    idGerencia: string;
    datoGerencia : RelacionCoordinador = new RelacionCoordinador();
    activoG : boolean = false;
    activoA : boolean = false;
    activoP : boolean = false;

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService) {
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
    }

    ngOnInit() {
        
        this.onClose = new Subject();
        this.busqueda = new BandejaDocumento();
        this.busqueda.codigo = 0;
        if(this.indicador == 1){
            this.datoGerencia.idGerencia = Number(this.idGerencia);
            this.datoGerencia.descripcionGerencia = this.nombre;
            this.activoA = true;
            this.activoP = true;
            this.activoG = true;
        } else if(this.indicador == 2){
            this.datoGerencia.descripcionAlcance = this.nombre;
            this.activoA = true;
            this.activoP = true;
            this.activoG = true;
        }
       
        console.log(this.busqueda);
    }

    OnBuscar(){
        console.log(this.busqueda);
        
        if(this.busqueda.codigo != 0 || this.busqueda.estdoc != ""){
            this.bsModalRef.hide();
            this.onClose.next(this.busqueda);
        }
    }

    OnCancelar(){
        this.bsModalRef.hide();
    }
}

import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef, ModalOptions, BsModalService } from 'ngx-bootstrap';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';

@Component({
  selector: 'bandeja-documento-modales-permiso-carpeta',
  templateUrl: 'permiso-carpeta.template.html'
})

export class PermisoCarpetaComponents implements OnInit {
  public onClose: Subject<boolean>;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametroBusqueda: string;
  
  constructor(public bsModalRef: BsModalRef, private modalService: BsModalService) {
    this.onClose = new Subject();
    this.parametroBusqueda = 'tipo';
  }

  ngOnInit() {
    this.loading = false;
  }
  
  /*Modal Importar Ruta  */
  OnImportarRuta(){
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    const cerrar= this.modalService.show(ImportarRutaComponents, config);
    (<ImportarRutaComponents>cerrar.content).onClose.subscribe(result => {
        //this.busquedaPlan = result;
        //this.OnBuscar();
    });
  }

  cancelar(){
    this.bsModalRef.hide();    
  }
}

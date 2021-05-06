import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento,Response} from '../../../models';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';
import { VerDocumentoComponents } from 'src/app/modules/bandejadocumento/modales/ver-documento.component';
import { ModalOptions, BsModalService } from 'ngx-bootstrap';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';


@Component({
  selector: 'bandeja-documento-modales-codigo-anterior',
  templateUrl: 'consulta-codigo-anterior.template.html'
})
export class ConsultaCodigoAnteriorcomponents implements OnInit {
  public onClose: Subject<boolean>;
  
    @Input()
    parametroBusqueda: string; 
    listaSeguimiento: BandejaDocumento[];
    loading: boolean;
    /* registro seleccionado */
    selectedRow: number;
    selectedObject: BandejaDocumento;
    id:number;
    listaCodigo:any[];

    constructor(public bsModalRef: BsModalRef, private modalService: BsModalService, private bandejaDocumentoServ:BandejaDocumentoService) {
      this.onClose = new Subject();
      this.parametroBusqueda = 'tipo';
      this.selectedRow = -1;
    }
  
    ngOnInit() {
      this.loading = false;
      console.log("id documento "+ this.id);
      //this.getLista();
      this.cargarCodigosAnteriores();
    }
    
cargarCodigosAnteriores(){
  this.bandejaDocumentoServ.obtenerCodigoAnterior(this.id).subscribe(
    (response: Response) => {
console.log("codigos anteriores ", response);
this.listaCodigo = response.resultado;
    },
  (error)=>{})
}

    cancelar(){
      this.bsModalRef.hide();
    }


    OnExportar(){


      this.parametroBusqueda = "avanzada";
      const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
            idDocu:this.id
          },
          class: 'modal-lg'
      }
      this.bsModalRef = this.modalService.show(VerDocumentoComponents, config);
      (<VerDocumentoComponents>this.bsModalRef.content).onClose.subscribe(result => {
          //this.busquedaPlan = result;
          //this.OnBuscar();
      });
    }

    ver(){      
      this.parametroBusqueda = "avanzada";
      const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
          },
          //style
          class: 'modal1-lg-custom'
      }
      const cerrar = this.modalService.show(VerDocumentoComponents, config);
      (<VerDocumentoComponents>cerrar.content).onClose.subscribe(result => {
          //this.busquedaPlan = result;
          //this.OnBuscar();
      });
    }

    OnRowClick(index, obj): void {
      this.selectedRow = index;
      this.selectedObject = obj;
    }

}

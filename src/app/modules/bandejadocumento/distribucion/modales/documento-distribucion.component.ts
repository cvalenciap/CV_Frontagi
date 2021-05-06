import { Component, OnInit } from '@angular/core';
import { BsModalRef,BsModalService,ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import {Response} from '../../../../models/response';
import { RevisionDocumento } from 'src/app/models';
import { Paginacion } from 'src/app/models/paginacion';
import { DetalleDistribucionComponent } from './detalle-distribucion.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';

@Component({
  selector: 'documento-distribucion',
  templateUrl: 'documento-distribucion.template.html'
})
export class DocumentoDistribucionComponent implements OnInit {
  public onClose: Subject<Response>;
  showNumAntiguedad:boolean;
  constanteRevision:any;
  //tipoParticipante:string;
  txtSolicitante:string;
  slEstadoSol:string;
  txtFecha:string;
  paginacion: Paginacion;
  bsModalRefDetalle: BsModalRef;
  /* indicador de carga */
  loading: boolean;
  items: any;
  txtFechaActual: Date;
  
  constructor(public bsModalRef: BsModalRef,private modalService: BsModalService,private service: RevisionDocumentoService) {
    
    this.constanteRevision = REVISION;
    this.showNumAntiguedad = false;
    this.paginacion = new Paginacion({registros: 10});
    this.txtFechaActual = null;
   }

  ngOnInit() {
    this.OnBuscar();
    
    //this.onClose = new Subject();
  }

  OnBuscar(){
    //let parametros = {"solicitante":this.txtSolicitante,"estaSolicitud":this.slEstadoSol,"fecSolicitud":this.txtFecha};
    
    this.loading = true;
    const parametros: {} = {};
     
    this.service.buscarProgramaciones(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
          (response: Response) => {
              let listadedocumento:RevisionDocumento[] = response.resultado;
              listadedocumento.forEach(documento => {
                documento.fechaActual= new Date(documento.fechaActual);
                if(documento.fechaActual){
                  this.txtFechaActual = documento.fechaActual;
                }
              });                
              this.items = response.resultado;
              this.paginacion = new Paginacion(response.paginacion);
              this.loading = false;
            },
          (error) => this.controlarError(error)
        );
  }
      controlarError(error) {
        alert(error);
      }

  verDetalle(idDocu){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        idDocu:idDocu
      },
      class: 'modal-lg'
    }
    this.bsModalRefDetalle = this.modalService.show(DetalleDistribucionComponent, config);
    (<DetalleDistribucionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      console.log("resultado modal", result);
      
    });
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
}
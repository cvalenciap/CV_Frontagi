import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import {Response} from '../../../../models/response';
import { RevisionDocumento } from 'src/app/models';
import { Paginacion } from 'src/app/models/paginacion';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';

@Component({
  selector: 'detalle-distribucion',
  templateUrl: 'detalle-distribucion.template.html'
})
export class DetalleDistribucionComponent implements OnInit {
  public onClose: Subject<Response>;
  showNumAntiguedad:boolean;
  constanteRevision:any;
  //tipoParticipante:string;
  txtSolicitante:string;
  slEstadoSol:string;
  txtFecha:string;
  paginacion: Paginacion;
  /* indicador de carga */
  loading: boolean;
  items: any;
  idDocu: number;
  desabilitarObj: boolean;

  constructor(public bsModalRef: BsModalRef, private service: RevisionDocumentoService) {
    
    this.constanteRevision = REVISION;
    this.showNumAntiguedad = false;
    this.paginacion = new Paginacion({registros: 10});
    this.idDocu = 0;
    this.desabilitarObj = true;
   }

  ngOnInit() {
    this.desabilitarObj = true;
    this.OnBuscar();
    //this.onClose = new Subject();
  }

  OnBuscar(){
    //let parametros = {"solicitante":this.txtSolicitante,"estaSolicitud":this.slEstadoSol,"fecSolicitud":this.txtFecha};
    
    this.loading = true;
    const parametros: {iddocu?:string} = {iddocu:null};    
    console.log("inicioo");
    console.log(this.idDocu);
    console.log("inicioo");
    if (this.idDocu) {
      parametros.iddocu = this.idDocu.toString();//this.idDocu.toString();  
    }

    this.service.buscarDocsDostribuidos(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
          (response: Response) => {
              let listadedocumento:RevisionDocumento[] = response.resultado;
              listadedocumento.forEach(documento => {
                documento.fechaActual= new Date(documento.fechaActual);
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
import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoMockService } from 'src/app/services';
import {Response} from '../../../../models/response';
import { RevisionDocumento, Paginacion } from 'src/app/models';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'app-busqueda-aprobacion-revision',
  templateUrl: './busqueda-aprobacion-revision.component.html'
  //styleUrls: ['./bitacora.component.scss']
})
export class BusquedaAprobacionRevisionComponent implements OnInit {
  public onClose: Subject<Response>;

  constanteRevision:any;
  //tipoParticipante:string;
  txtSolicitante:string;
  slEstadoSol:string;
  txtFecha:string;
  paginacion: Paginacion;
  parametros: Map<string,any>;
  slEstado:string;
  txtNombreCompleto:string;
  txtNumeroSolicitud:string;
 
  constructor(public bsModalRef: BsModalRef,private serviceMock: RevisionDocumentoMockService,
    private service: RevisionDocumentoService,private datePipe: DatePipe) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.parametros = new Map<string,any>();
    this.slEstado = "";
   }

  ngOnInit() {
    //console.log("participante ", this.bsModalRef);
    this.onClose = new Subject();
  }

  onBuscar(){
    this.bsModalRef.hide();
  }
      controlarError(error) {
        alert(error);
      }
}

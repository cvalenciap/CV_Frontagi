import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { Paginacion } from '../../../models/paginacion';

@Component({
  selector: 'app-participante-nuevo',
  templateUrl: './participante-nuevo.component.html'
  //styleUrls: ['./bitacora.component.scss']
})
export class ParticipanteNuevoComponent implements OnInit {
  constanteRevision:any;
  paginacion: Paginacion;
  tipoParticipante:string;
  public onClose: Subject<boolean>;
  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.paginacion = new Paginacion({registros: 10});
    
   }

  ngOnInit() {
    console.log("participantea ", this.tipoParticipante);
    //this.tipoParticipante = this.bsModalRef.content.tipoParticipante; 
  }

}

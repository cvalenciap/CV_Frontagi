import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';

@Component({
  selector: 'app-buscador-conocimiento',
  templateUrl: './busqueda-conocimiento.component.html'
  //styleUrls: ['./bitacora.component.scss']
})
export class BusquedaConocimientoComponent implements OnInit {
  constanteRevision:any;
  
  tipoParticipante:string;
  public onClose: Subject<boolean>;
  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    
    
   }

  ngOnInit() {
    console.log("participante ", this.bsModalRef);
    //this.tipoParticipante = this.bsModalRef.content.tipoParticipante; 
  }

}

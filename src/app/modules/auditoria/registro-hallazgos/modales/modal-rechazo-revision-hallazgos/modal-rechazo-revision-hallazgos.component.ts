import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-rechazo-revision-hallazgos',
  templateUrl: './modal-rechazo-revision-hallazgos.component.html',
  styleUrls: ['./modal-rechazo-revision-hallazgos.component.scss']
})
export class ModalRechazoRevisionHallazgosComponent implements OnInit {

  public onClose: Subject<string>;
  bsConfig: object;

  descripcionRechazo:string;

  constructor(public bsModalRef: BsModalRef,
    private modalService:BsModalService) { }

  ngOnInit() {
    this.descripcionRechazo = "";
    this.onClose = new Subject();
  }

  cancelar(){
    this.bsModalRef.hide();
  }

  rechazar(){
    if(this.descripcionRechazo != ""){
      this.bsModalRef.hide();
      this.onClose.next(this.descripcionRechazo);
      
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { ModalConfirmacionComponent } from 'src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component';

@Component({
  selector: 'app-modal-rechazo-lista',
  templateUrl: './modal-rechazo-lista.component.html',
  styleUrls: ['./modal-rechazo-lista.component.scss']
})
export class ModalRechazoListaComponent implements OnInit {
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

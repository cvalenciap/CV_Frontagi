import { Component, OnInit } from '@angular/core';
import { BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-modal-rechazo-solicitud-cancelacion',
  templateUrl: './modal-rechazo-solicitud-cancelacion.component.html',
  styleUrls: ['./modal-rechazo-solicitud-cancelacion.component.scss']
})
export class ModalRechazoSolicitudCancelacionComponent implements OnInit {

  public onClose: Subject<string>;
  bsConfig: object;

  descripcionRechazo:string;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private modalService:BsModalService) { }

  ngOnInit() {
    this.descripcionRechazo = "";
    this.onClose = new Subject();
  }

  cancelar(){
    this.bsModalRef.hide();
  }

  rechazar(){
    
    if(this.descripcionRechazo.trim() != ""){
      this.bsModalRef.hide();
      this.onClose.next(this.descripcionRechazo);
    }else{
      this.toastr.warning('Se requiere ingresar una crítica.', 'Atención', {closeButton: true});
    }
  }

}

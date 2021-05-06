import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';

@Component({
  selector: 'app-modal-confirmacion',
  templateUrl: './modal-confirmacion.component.html',
  styleUrls: ['./modal-confirmacion.component.scss']
})
export class ModalConfirmacionComponent implements OnInit {

  public body: string;
  public title: string;
  public onClose: Subject<boolean>;

  public constructor(
    private _bsModalRef: BsModalRef
) { }

  ngOnInit() {
    this.onClose = new Subject();
  }

  public showConfirmationModal(title: string, body: string): void {
    this.title = title;
    this.body = body;
  }

  public onConfirm(): void {    
    this._bsModalRef.hide();
    this.onClose.next(true);
  }

  public onCancel(): void {
    this._bsModalRef.hide();
    this.onClose.next(false);
  }

  public hideConfirmationModal(): void {
    this._bsModalRef.hide();
    this.onClose.next(null);
  }

}

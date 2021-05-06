import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';

@Component({
  selector: 'app-bitacora',
  templateUrl: './bitacora.component.html',
  styleUrls: ['./bitacora.component.scss']
})
export class BitacoraComponent implements OnInit {
  public onClose: Subject<boolean>;

  itemsBitacoras = [{"fechaFase":"15/01/2019","fase":"fase uno","estado":"estado uno","justificacion":"justificacion uno"},
                    {"fechaFase":"10/01/2019","fase":"fase dos","estado":"estado dos","justificacion":"justificacion dos"}];

  constructor(public bsModalRef: BsModalRef) {
    this.onClose = new Subject();
   }

  ngOnInit() {
  }

}

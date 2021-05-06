import { Component, OnInit, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RegistroAuditor } from 'src/app/models/registroAuditor';

@Component({
  selector: 'app-modal-busqueda-norma',
  templateUrl: './modal-busqueda-norma.component.html',
  styleUrls: ['./modal-busqueda-norma.component.scss']
})


export class ModalBusquedaNormaComponent implements OnInit {

  public onClose: Subject<RegistroAuditor>;
  bsConfig: object;
  todosCheck: boolean;
  checkNorma: boolean;

  busqueda: RegistroAuditor;
  hola: string;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.onClose = new Subject();
    this.busqueda = new RegistroAuditor('', '', '', '', 0, '', 0, '');
    this.busqueda.numFicha = "";
    console.log(this.hola);
    console.log(this.busqueda);
    this.onClose = new Subject();
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  seleccionarTodos(){
    if (this.todosCheck) {
      this.todosCheck = false;
      this.checkNorma = false;
    } else {
      this.todosCheck = true;
      this.checkNorma = true;
    }
  }

}

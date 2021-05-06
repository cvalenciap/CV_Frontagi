import { Component, OnInit, NgModule } from '@angular/core';
//import { ProgramacionAuditoria } from 'src/app/models/programacionauditoria';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Curso } from 'src/app/models/curso';

@Component({
  selector: 'app-modal-agregar-pregunta-relacional',
  templateUrl: './modal-agregar-pregunta-relacional.template.html',
  styleUrls: ['./modal-agregar-pregunta-relacional.component.scss']
})
export class ModalAgregarPreguntaRelacionalComponent implements OnInit {

  public onClose: Subject<Curso>;
  bsConfig: object;


  busqueda: Curso;
  hola: string;





  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }




  ngOnInit() {
    this.onClose = new Subject();
    this.busqueda = new Curso();
    //    this.busqueda.numFicha = "";
    console.log(this.hola);
    console.log(this.busqueda);
  }


  buscar() {
    console.log(this.busqueda);
    // if(this.busqueda.numFicha=== "" || (this.busqueda.tipo != undefined && this.busqueda.nomRol != null)){
    //   this.bsModalRef.hide();
    //   this.onClose.next(this.busqueda);
    // }

  }


  cancelar() {
    this.bsModalRef.hide();
  }
}
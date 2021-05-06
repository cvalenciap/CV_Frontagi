import { Component, OnInit, NgModule } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { Norma } from 'src/app/models/norma';
import { AreaParametros } from 'src/app/models/areas-parametro';

@Component({
  selector: 'app-modal-busqueda-norma',
  templateUrl: './modal-busqueda-norma.component.html',
  styleUrls: ['./modal-busqueda-norma.component.scss']
})


export class ModalBusquedaNormaComponent implements OnInit {

  public onClose: Subject<Norma[]>;
  bsConfig: object;
  todosCheck: boolean;
  checkNorma: boolean;

  lstNormas: Norma[];
  lstNormasSeleccionadas: Norma[];
  areaParametros: AreaParametros;

  busqueda: Norma;
  hola: string;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.lstNormas = [];
    this.lstNormasSeleccionadas = [];
    this.onClose = new Subject();
    this.areaParametros = JSON.parse(localStorage.getItem('areaParametros'));
    this.lstNormas = this.areaParametros.lstNormas;
    console.log(this.lstNormas);
    this.onClose = new Subject();
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  OnSeleccionar() {
    let objeto: Norma[];
    objeto = this.lstNormasSeleccionadas;
    this.onClose.next(objeto);
    this.bsModalRef.hide();
  }

  onAgregar(e, item: Norma, indice: number) {
    console.log(e.target.value);
    console.log(item);
    console.log(indice);
    console.log(this.lstNormas);
    let buscarIndice: number;
    buscarIndice = this.lstNormasSeleccionadas.indexOf(item);
    if (buscarIndice === -1) {
      this.lstNormasSeleccionadas.push(item);
      console.log(this.lstNormasSeleccionadas);
    } else {
      this.lstNormasSeleccionadas.splice(buscarIndice, 1);
      console.log(this.lstNormasSeleccionadas);
    }
  }

  seleccionarTodos() {
    if (this.todosCheck) {
      this.todosCheck = false;
      this.checkNorma = false;
    } else {
      this.todosCheck = true;
      this.checkNorma = true;
    }
  }

}

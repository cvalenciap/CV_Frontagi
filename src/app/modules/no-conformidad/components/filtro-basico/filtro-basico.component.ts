import { Component, OnInit, EventEmitter, Output, Input } from "@angular/core";

@Component({
  selector: "app-filtro-basico",
  templateUrl: "./filtro-basico.component.html",
  styles: [
    `
      .menu-item:hover {
        cursor: pointer !important;
      }
    `
  ]
})
export class FiltroBasicoComponent implements OnInit {

  opcionFiltro: string;
  @Output() buscarAvanzado = new EventEmitter();

  buscar() {}

  changeCombo() {}

  constructor() {}


  mostrarBusquedaAvanzada() {
    this.buscarAvanzado.emit();
  }

  ngOnInit(): void {
    this.opcionFiltro = 'TIPO';
  }

  seleccionarOpcion(opcion: string) {
    this.opcionFiltro = opcion;
  }
}

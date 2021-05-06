import { Component } from "@angular/core";
import { Paginacion } from "src/app/models";
import { Router } from "@angular/router";

@Component({
  selector: "app-formulario-bitacora",
  templateUrl: "./formulario-bitacora.component.html",
  styleUrls: ["./formulario-bitacora.component.scss"]
})
export class formularioBitacoraComponent {
  paginacion: Paginacion;

  cambiarPagina(event: any) {}

  cambiarRegistrosPorPagina(event: any) {
    this.paginacion.registros = event.rows;
    // this.listarItemsPagina();
  }

  constructor(public router: Router) {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
  }
}

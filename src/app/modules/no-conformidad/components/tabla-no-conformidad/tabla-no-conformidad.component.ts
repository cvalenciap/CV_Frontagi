import { Component } from "@angular/core";
import { Paginacion } from "src/app/models";
import { Router } from "@angular/router";

@Component({
  selector: "app-tabla-no-conformidad",
  templateUrl: "./tabla-no-conformidad.component.html",
  styleUrls: ["./tabla-no-conformidad.component.scss"]
})
export class TablaNoConformidadComponent {
  paginacion: Paginacion;

  cambiarPagina(event: any) {}

  cambiarRegistrosPorPagina(event: any) {
    this.paginacion.registros = event.rows;
    // this.listarItemsPagina();
  }

  constructor(public router: Router) {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
  }

  editar() {
    this.router.navigate(['/no-conformidad/bandejanoconformidad/editar/:1']);
  }

  eliminar() {}
}

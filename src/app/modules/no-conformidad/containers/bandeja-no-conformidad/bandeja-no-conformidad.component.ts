import { Component, OnInit, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { SwalComponent } from '@toverux/ngx-sweetalert2';

@Component({
  selector: 'app-bandeja-no-conformidad',
  templateUrl: './bandeja-no-conformidad.component.html',
  styleUrls: ['./bandeja-no-conformidad.component.scss']
})
export class BandejaNoConformidadComponent {

  datosBusqueda: any;
  mostrarDatosBusqueda: boolean;
  @ViewChild('modalBusquedaAvanzada') modalBusquedaAvanzada: SwalComponent;

  cerralModalBusquedaAvanzada() {
    this.modalBusquedaAvanzada.nativeSwal.close();
  }

  constructor(public router: Router) {}

  limpiarFiltro(item: any): void {

  }

  registrarNoConformidad(): void {
    this.router.navigate(['/no-conformidad/bandejanoconformidad/registrar']);
  }
}

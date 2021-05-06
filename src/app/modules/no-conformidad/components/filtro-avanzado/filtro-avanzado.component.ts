import { Component, OnInit, ViewChild, Output, EventEmitter } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-filtro-avanzado',
  templateUrl: './filtro-avanzado.component.html',
  styleUrls: ['./filtro-avanzado.component.scss']
})
export class FiltroAvanzadoComponent {

  @Output() cerrarModalEvent = new EventEmitter();

  busquedaAvanzadaEmit(){

  }

  cerrarModal(){
    this.cerrarModalEvent.emit();
  }

  limpiarFiltros(){

  }

}

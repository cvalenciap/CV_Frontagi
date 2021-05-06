import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from '@angular/core';
import { Router } from '@angular/router';

@Component({
  selector: 'app-datos-busqueda-bandeja',
  templateUrl: './datos-busqueda-bandeja.component.html',
  styleUrls: ['./datos-busqueda-bandeja.component.scss']
})
export class DatosBusquedaBandejaComponent {

  @Input() datos: any;
  @Output() cerrarPanel = new EventEmitter<any>();

  busquedaAvanzadaEmit(){

  }

  closePanel(){
    this.cerrarPanel.emit();
  }

}

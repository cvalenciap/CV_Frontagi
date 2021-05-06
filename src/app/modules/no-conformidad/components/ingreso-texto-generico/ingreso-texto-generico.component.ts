import { Component, OnInit, ViewChild, Output, EventEmitter, Input } from "@angular/core";
import { Router } from "@angular/router";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-ingreso-texto-generico",
  templateUrl: "./ingreso-texto-generico.component.html",
  styleUrls: ["./ingreso-texto-generico.component.scss"]
})
export class IngresoTextoGenericoComponent {
  @Input() configuracion: any;
  @Output() cancelarEvent = new EventEmitter();
  @Output() aceptarEvent = new EventEmitter();

  aceptar(): void{
    this.aceptarEvent.emit('texto de rechazo');
  }

  cancelar(): void{
    this.cancelarEvent.emit();
  }

  limpiar(): void{

  }
}

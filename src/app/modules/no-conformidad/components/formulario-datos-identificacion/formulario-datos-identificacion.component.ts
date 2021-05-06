import { Component, ViewChild, OnInit } from "@angular/core";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { SweetAlertOptions } from "sweetalert2";

@Component({
  selector: 'app-formulario-datos-identificacion',
  templateUrl: './formulario-datos-identificacion.component.html',
  styleUrls: ['./formulario-datos-identificacion.component.scss']
})
export class FormularioDatosIdentificacionComponent implements OnInit{

  configModalIngresoTexto: ConfiguracionModalIngresoTexto;
  @ViewChild('swalAgregarProblema') modalAgregarProblema: SwalComponent;

  adjuntarArchivo(){

  }

  agregarProblema(problema: string): void{
    this.modalAgregarProblema.nativeSwal.close();
  }

  cerralModalAgregarProblema(): void{
    this.modalAgregarProblema.nativeSwal.close();
  }

  editarProblema(): void{

  }

  eliminarProblema(): void{

  }

  mostrarModalAgregarProblema(): void{
    this.configModalIngresoTexto = new ConfiguracionModalIngresoTexto();
    this.configModalIngresoTexto.title = "Agregar Problema";
    this.configModalIngresoTexto.placeholder =
      "Ingrese descripción del problema";
    this.configModalIngresoTexto.buttonName = "Agregar";
    this.modalAgregarProblema.show();
  }

  ngOnInit(): void {

  }

}

class ConfiguracionModalIngresoTexto {
  title?: string;
  placeholder?: string;
  buttonName?: string;
}

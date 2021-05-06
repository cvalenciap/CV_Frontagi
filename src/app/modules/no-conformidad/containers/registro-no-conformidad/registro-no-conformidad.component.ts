import { Component, OnInit, ViewChild } from "@angular/core";
import { Router } from "@angular/router";
import { SwalComponent } from "@toverux/ngx-sweetalert2";
import { ToastrService } from "ngx-toastr";

@Component({
  selector: "app-registro-no-conformidad",
  templateUrl: "./registro-no-conformidad.component.html",
  styleUrls: ["./registro-no-conformidad.component.scss"]
})
export class RegistroNoConformidadComponent implements OnInit {
  botonAccion: string;
  configModalIngresoTexto: ConfiguracionModalIngresoTexto;
  mensajeConfirmarAccion: string;
  @ViewChild("swalConfirmacionAccion") modalConfirmacionAccion: SwalComponent;
  @ViewChild("swalRechazarNoConformidad")
  modalRechazarNoConformidad: SwalComponent;
  @ViewChild("swalRetornarNoConformidad")
  modalRetornarNoConformidad: SwalComponent;

  constructor(public router: Router, private toastr: ToastrService) {
    this.mensajeConfirmarAccion = "";
  }

  ngOnInit(): void {}

  cerralModalAgregarRechazo(): void {
    this.modalRechazarNoConformidad.nativeSwal.close();
  }

  cerralModalRetornar(): void {
    this.modalRetornarNoConformidad.nativeSwal.close();
  }

  confirmarAccion(): void {
    switch (this.botonAccion) {
      case "ENVIAR": {
        this.confirmacionEnvio();
        break;
      }
      case "VALIDAR": {
        this.confirmacionValidar();
        break;
      }
      case "REVISAR": {
        this.confirmacionRevisar();
        break;
      }
      case "APROBAR": {
        this.confirmacionAprobar();
        break;
      }
      case "CANCELAR": {
        this.confirmacionCancelar();
        break;
      }
      case "ASIGNAR": {
        this.confirmarAsignar();
        break;
      }
      case "RETORNAR": {
        this.confirmarAsignar();
        break;
      }
      default: {
        //statements;
        break;
      }
    }
  }

  confirmarAsignar(): void {
    this.toastr.success("Registro almacenado", "Acción Completada");
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  confirmacionCancelar(): void {
    this.toastr.success(
      "Se ha cancelado la No Conformidad",
      "Acción Completada"
    );
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  confirmacionRevisar(): void {
    this.toastr.success("Registro almacenado", "Acción Completada");
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  confirmacionAprobar(): void {
    this.toastr.success("Registro almacenado", "Acción Completada");
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  confirmacionEnvio(): void {
    this.toastr.success("Registro almacenado", "Acción Completada");
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  confirmacionValidar(): void {
    this.toastr.success("Registro almacenado", "Acción Completada");
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  mostrarModalRechazo(): void {
    this.configModalIngresoTexto = new ConfiguracionModalIngresoTexto();
    this.configModalIngresoTexto.title = "Agregar Rechazo";
    this.configModalIngresoTexto.placeholder =
      "Ingrese descripción del rechazo";
    this.configModalIngresoTexto.buttonName = "Aceptar";
    this.modalRechazarNoConformidad.show();
  }

  mostrarModalRetorno(): void{
    this.configModalIngresoTexto = new ConfiguracionModalIngresoTexto();
    this.configModalIngresoTexto.title = "Agregar Mensaje Retorno";
    this.configModalIngresoTexto.placeholder =
      "Ingrese motivo del retorno";
    this.configModalIngresoTexto.buttonName = "Aceptar";
    this.modalRetornarNoConformidad.show();
  }

  rechazar(textoRechazo: string): void {
    this.toastr.success("Se ha rechazo la no conformidad", "Acción Completada");
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  regresar(): void {
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  retornar(textoRetorno: string): void{
    this.toastr.success("Se ha rechazo la no conformidad", "Acción Completada");
    this.router.navigate(["/no-conformidad/bandejanoconformidad/"]);
  }

  validarAccion(accion: string): void {
    debugger;
    this.botonAccion = accion;
    switch (this.botonAccion) {
      case "ENVIAR": {
        this.mensajeConfirmarAccion =
          "¿Está seguro que desea enviar la no conformidad?";
        break;
      }
      case "VALIDAR": {
        this.mensajeConfirmarAccion =
          "¿Está seguro que desea confirmar la validación de la no conformidad?";
        break;
      }
      case "REVISAR": {
        this.mensajeConfirmarAccion =
          "¿Está seguro que desea confirmar la revisión de la no conformidad?";
        break;
      }
      case "APROBAR": {
        this.mensajeConfirmarAccion =
          "¿Está seguro que desea aprobar la no conformidad?";
        break;
      }
      case "CANCELAR": {
        this.mensajeConfirmarAccion =
          "¿Está seguro que desea cancelar la no conformidad?";
        break;
      }
      case "ASIGNAR": {
        this.mensajeConfirmarAccion =
          "¿Está seguro que desea asignar el responsable de la no conformidad?";
        break;
      }
      default: {
        //statements;
        break;
      }
    }
    this.modalConfirmacionAccion.title = this.mensajeConfirmarAccion;
    this.modalConfirmacionAccion.show();
  }
}

class ConfiguracionModalIngresoTexto {
  title?: string;
  placeholder?: string;
  buttonName?: string;
}

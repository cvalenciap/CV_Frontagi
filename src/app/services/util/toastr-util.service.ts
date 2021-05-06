import { Injectable } from '@angular/core';
import { ToastrService } from 'ngx-toastr';

@Injectable({
  providedIn: 'root'
})
export class ToastrUtilService {

  constructor(private toastr: ToastrService) { }

  public showSuccess(mensaje: string) {
    this.toastr.success(mensaje, 'Acción Completada!', { closeButton: true });
  }

  public showError(mensaje: string) {
    this.toastr.error(mensaje, 'Error!', { closeButton: true });
  }

  public showWarning(mensaje: string) {
    this.toastr.warning(mensaje, 'Advertencia!', { closeButton: true });
  }

}

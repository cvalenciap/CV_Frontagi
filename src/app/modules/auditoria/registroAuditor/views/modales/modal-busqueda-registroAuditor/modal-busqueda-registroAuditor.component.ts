import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrUtilService } from 'src/app/services/util/toastr-util.service';
import { FichaAudiRequest } from 'src/app/models/interfaces/request/ficha-audi-request';
import { GenericParam } from 'src/app/models/interfaces/generic-param';
import { FichaAuditorApiService } from 'src/app/services/impl/ficha-auditor-api.service';
import { Response } from 'src/app/models';
import { FiltroSalida } from 'src/app/models/interfaces/filtro-salida';
import AgcUtil from '../../../util/agc-util';

@Component({
  selector: 'app-modal-busqueda-registroAuditor',
  templateUrl: './modal-busqueda-registroAuditor.component.html',
  styleUrls: ['./modal-busqueda-registroAuditor.component.scss']
})


export class ModalBusquedaRegistroAuditorComponent implements OnInit {

  public onClose: Subject<any> = new Subject<any>();
  bsConfig: object;

  roles: GenericParam[] = [];
  request: FichaAudiRequest = {};
  dataFiltrosSeleccionados: FiltroSalida[] = [];

  constructor(public bsModalRef: BsModalRef,
    private toastrUtil: ToastrUtilService,
    private localeService: BsLocaleService,
    private fichaAudiApi: FichaAuditorApiService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.cargarComboRoles();
  }

  ngOnInit() { }

  private agregarDataFiltro(codigo: number, campo: string, value: any): void {
    this.eliminarFiltroRepetido(codigo);
    const filtro: FiltroSalida = { codigoFiltro: codigo, nombreFiltro: campo, valorFiltro: value };
    this.dataFiltrosSeleccionados.push(filtro);
    this.dataFiltrosSeleccionados.sort((a, b) => {
      if (a.codigoFiltro > b.codigoFiltro) { return 1; }
      if (a.codigoFiltro < b.codigoFiltro) { return -1; }
      return 0;
    });
  }

  private buscarIndiceFiltroRepetido(codigo: number) {
    for (let i = 0; i < this.dataFiltrosSeleccionados.length; i++) {
      const item = this.dataFiltrosSeleccionados[i];
      if (item.codigoFiltro === codigo) {
        return i;
      }
    }
    return -1;
  }

  public cancelar() {
    this.bsModalRef.hide();
  }

  public async cargarComboRoles() {
    await this.fichaAudiApi.obtenerParametros().toPromise()
      .then((response: Response) => {
        if (response.estado === 'OK') {
          console.log(response);
          this.roles = response.resultado.roles;
        } else {
          console.error(response.error.mensaje);
          this.toastrUtil.showWarning(response.error.mensaje);
        }
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError('Ocurrio un error al cargar los parametros');
      });
  }

  private eliminarFiltroRepetido(codigo: number): void {
    const indice: number = this.buscarIndiceFiltroRepetido(codigo);
    if (indice > -1) {
      this.dataFiltrosSeleccionados.splice(indice, 1);
    }
  }

  public enviarBusqueda(): void {
    if (this.dataFiltrosSeleccionados.length > 0) {
      this.bsModalRef.hide();
      this.onClose.next({
        filtros: this.dataFiltrosSeleccionados,
        request: this.request
      });
    } else {
      this.toastrUtil.showWarning('No ha ingresado ningún filtro');
    }
  }

  public onChangeFiltro(codigo: number, campo: string, value: any) {
    if (codigo === 1 || codigo === 2 || codigo === 3 || codigo === 4) {
      if (AgcUtil.validarCampoTexto(value)) {
        this.agregarDataFiltro(codigo, campo, value);
      } else {
        this.eliminarFiltroRepetido(codigo);
      }
    } else if (codigo === 5) {
      if (AgcUtil.validarCampoObjeto(value)) {
        this.agregarDataFiltro(codigo, campo, value.descripcion);
      } else {
        this.eliminarFiltroRepetido(codigo);
      }
    }
  }

}

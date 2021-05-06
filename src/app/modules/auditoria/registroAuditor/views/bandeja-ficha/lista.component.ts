import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';

import { BsModalService, BsModalRef, ModalOptions } from 'ngx-bootstrap';
import { RegistroAuditor } from './../../../../../models/registroAuditor';

import { Paginacion } from '../../../../../models/paginacion';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';

import { Response } from '../../../../../models/response';
import { DomSanitizer } from '@angular/platform-browser';
import { FichaRegistroAuditorService } from './../../../../../services';
import { ModalBusquedaRegistroAuditorComponent } from './../modales/modal-busqueda-registroAuditor/modal-busqueda-registroAuditor.component';
import { ToastrUtilService } from 'src/app/services/util/toastr-util.service';
import { BandejaFichaService } from '../../service/bandeja-ficha.service';
import { NavegacionService } from 'src/app/services/impl/navegacion.service';
import { FichaAudiRequest } from 'src/app/models/interfaces/request/ficha-audi-request';
import StorageUtil from '../../util/storage-util';
import { FiltroSalida } from 'src/app/models/interfaces/filtro-salida';
import { FichaAudi } from 'src/app/models/interfaces/ficha-audi';
import AgcUtil from '../../util/agc-util';
import { FichaAuditorApiService } from 'src/app/services/impl/ficha-auditor-api.service';


@Component({
  selector: 'app-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [FichaRegistroAuditorService]
})
export class RegistroAuditorListaComponent implements OnInit {

  bsModalRef: BsModalRef;
  loading: boolean;
  paginacion: Paginacion;
  listaFichaAuditores: FichaAudi[] = [];

  dataFiltrosSeleccionados: FiltroSalida[] = [];
  showFiltrosBusqueda: boolean = false;

  request: FichaAudiRequest = {};

  textoFiltros: string;

  constructor(private localeService: BsLocaleService,
    private router: Router,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    private toastrUtil: ToastrUtilService,
    private navegacionService: NavegacionService,
    private bandejaService: BandejaFichaService,
    private fichaAudiApi: FichaAuditorApiService,
  ) {
    this.suscribirIsLoading();
    this.suscribirDataBandejaFicha();
    this.suscribirPaginacion();
  }

  ngOnInit(): void {
    this.limpiarParametrosSession();
    this.realizarConsulta(true);
  }

  public abrirModalBusquedaAvanzada(): void {
    const config: ModalOptions = {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-md'
    };

    this.bsModalRef = this.modalService.show(ModalBusquedaRegistroAuditorComponent, config);
    const modal: ModalBusquedaRegistroAuditorComponent = this.bsModalRef.content;
    modal.onClose.subscribe(output => {
      this.dataFiltrosSeleccionados = output.filtros;
      this.request = output.request;
      this.onRealizarBusqueda();
    });
  }

  private buildTextoFiltro(): void {
    let htmlText: string = `<strong>Busqueda Por: </strong>`;
    this.dataFiltrosSeleccionados.sort((x, y) => (x.codigoFiltro > y.codigoFiltro) ? 1 : -1);
    this.dataFiltrosSeleccionados.forEach(item => {
      htmlText += `<br/><strong>${item.nombreFiltro}: </strong>${item.valorFiltro}`;
    });
    this.textoFiltros = this.sanitizer.sanitize(SecurityContext.HTML, htmlText);
    this.showFiltrosBusqueda = true;
  }

  private limpiarParametrosSession(): void {
    const rutaAnterior = this.navegacionService.previousUrl;
    if ((rutaAnterior !== '/auditoria/registro-auditor/registrar')
      && (rutaAnterior !== '/auditoria/registro-auditor/editar')) {
      StorageUtil.removerSession('fichaAuditorEditar');
      StorageUtil.removerSession('dataFiltrosBandejaFichaAudi');
      StorageUtil.removerSession('requestFichaAudi');
      StorageUtil.removerSession('paginacionBandejaFichaAudi');
    }
  }

  private navegacionRetorno() {
    this.request = StorageUtil.recuperarObjetoSession('requestFichaAudi');
    this.bandejaService.consultarApi(false);
    this.dataFiltrosSeleccionados = StorageUtil.recuperarObjetoSession('dataFiltrosBandejaFichaAudi');
    this.showFiltrosBusqueda = (this.dataFiltrosSeleccionados !== null && this.dataFiltrosSeleccionados !== undefined)
      ? this.dataFiltrosSeleccionados.length > 0 : false;
  }

  public onRealizarBusqueda(): void {
    if (this.dataFiltrosSeleccionados.length > 0) {
      StorageUtil.almacenarObjetoSession('dataFiltrosBandejaFichaAudi', this.dataFiltrosSeleccionados);
      this.buildTextoFiltro();
      this.realizarConsulta(false);
    } else {
      this.toastrUtil.showWarning('No ha ingresado ningún filtro');
    }

  }

  public onChangeBindingRequest(codigo: number, campo: string, value: any) {
    this.dataFiltrosSeleccionados.length = 0;
    if (AgcUtil.validarCampoTexto(value)) {
      const filtro: FiltroSalida = {
        codigoFiltro: codigo,
        nombreFiltro: campo,
        valorFiltro: value
      };
      this.dataFiltrosSeleccionados.push(filtro);
    }
  }

  public onEditarFicha(item: FichaAudi) {
    StorageUtil.almacenarObjetoSession('fichaAuditorEditar', item);
    this.router.navigateByUrl('/auditoria/registro-auditor/editar');
  }

  public async onEliminar(item: FichaAudi) {
    this.loading = true;
    await this.fichaAudiApi.eliminarFichaAudi(item.idFichaAudi).toPromise()
      .then((response: Response) => {
        if (response.estado === 'OK') {
          this.loading = false;
          this.onLimpiarFiltros();
        } else {
          console.error(response.error);
          this.toastrUtil.showError(response.error.mensaje);
          this.loading = false;
        }
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError('Ocurrio un error en la ultima acción');
        this.loading = false;
      });
  }

  public onLimpiarFiltros(): void {
    this.dataFiltrosSeleccionados.length = 0;
    this.showFiltrosBusqueda = false;
    this.request = {};
    this.realizarConsulta(false);
  }

  public OnPageChanged(event: any): void {
    this.paginacion.pagina = event.page;
    this.paginacion.registros = event.itemsPerPage;
    this.bandejaService.cambiarPagina(this.paginacion);
  }

  public OnPageOptionChanged(event: any): void {
    this.paginacion = new Paginacion({ pagina: 1, registros: event.rows, totalPaginas: this.listaFichaAuditores.length });
    this.bandejaService.cambiarPagina(this.paginacion)
  }

  private realizarConsulta(validarNavegacion: boolean) {
    if (validarNavegacion) {
      const rutaAnterior: string = this.navegacionService.previousUrl;
      if (rutaAnterior === '/auditoria/registro-auditor/editar') {
        this.navegacionRetorno();
      } else {
        this.bandejaService.consultarApi(true, this.request);
      }
    } else {
      this.bandejaService.consultarApi(true, this.request);
    }
  }

  private suscribirDataBandejaFicha(): void {
    this.bandejaService.dataFichaAuditor$.subscribe(data => this.listaFichaAuditores = data);
  }

  private suscribirIsLoading(): void {
    this.bandejaService.isLoading$.subscribe(loading => this.loading = loading);
  }

  private suscribirPaginacion(): void {
    this.bandejaService.paginacion$.subscribe(pag => this.paginacion = pag);
  }

}

import {Component, OnInit} from '@angular/core';
import {Subject} from 'rxjs';
import {FichaAudi} from 'src/app/models/interfaces/ficha-audi';
import {Paginacion, Response} from 'src/app/models';
import {InfoAuditorRequest} from 'src/app/models/interfaces/request/info-auditor-request';
import {BsLocaleService, BsModalRef, BsModalService, defineLocale, esLocale} from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {GeneralService} from 'src/app/services';
import {FichaAuditorApiService} from 'src/app/services/impl/ficha-auditor-api.service';
import AgcUtil from '../../../util/agc-util';
import {ToastrUtilService} from '../../../../../../services/util/toastr-util.service';

@Component({
  selector: 'app-modal-info-auditor',
  templateUrl: './modal-info-auditor.component.html',
  styleUrls: ['./modal-info-auditor.component.scss']
})
export class ModalInfoAuditorComponent implements OnInit {

  bsConfig: object;
  nuevo: boolean;
  loading: boolean;
  selectedRow: number;
  listaInfoAuditores: FichaAudi[] = [];
  paginacion: Paginacion;
  public infoAuditorRequest: InfoAuditorRequest = {};
  selectedObject: FichaAudi = {};
  indicadorBusqueda: string;

  private onClose: Subject<FichaAudi> = new Subject<FichaAudi>();
  public onClose$ = this.onClose.asObservable();

  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private toastr: ToastrService,
              private generalService: GeneralService,
              private fichaAuditorApi: FichaAuditorApiService,
              private toastrUtil: ToastrUtilService,
              private localeService: BsLocaleService) {
    this.selectedRow = -1;
    this.paginacion = new Paginacion({pagina: 1, registros: 10});
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
  }

  public getAgcUtil() {
    return AgcUtil;
  }

  private async consultarApi(request: InfoAuditorRequest, pagina: number = 1, registros: number = 10) {
    this.loading = true;
    await this.fichaAuditorApi.obtenerInfoAuditor(request, pagina, registros).toPromise()
      .then((response: Response) => {
        if (response.estado === 'OK') {
          this.listaInfoAuditores = response.resultado.lista;
          this.paginacion = new Paginacion({
            pagina: response.resultado.pagina,
            registros: response.resultado.registros,
            totalRegistros: response.resultado.totalRegistros
          });
        } else {
          console.error(response.error);
          this.toastrUtil.showError(response.error.mensaje);
        }
        this.loading = false;
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(err);
        this.loading = false;
      });
  }

  public onBuscar() {
    this.consultarApi(this.infoAuditorRequest);
  }

  public onCancelar() {
    this.bsModalRef.hide();
  }

  public onLimpiar() {
    this.listaInfoAuditores.length = 0;
    this.selectedObject = null;
    this.selectedRow = -1;
  }

  public OnPageChanged(event: any) {
    this.consultarApi(this.infoAuditorRequest, event.page);
  }

  public OnPageOptionChanged(event: any) {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.consultarApi(this.infoAuditorRequest, this.paginacion.pagina, this.paginacion.registros);
  }

  public OnRowClick(index: number, item: FichaAudi) {
    this.selectedRow = index;
    this.selectedObject = item;
  }

  public onSeleccionarRow() {
    if (AgcUtil.validarCampoObjeto(this.selectedObject)) {
      this.bsModalRef.hide();
      this.onClose.next(this.selectedObject);
    } else {
      this.toastrUtil.showWarning('Debe seleccionar un auditor');
    }
  }

}

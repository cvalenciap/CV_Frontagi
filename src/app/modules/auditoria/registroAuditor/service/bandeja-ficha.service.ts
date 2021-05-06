import { Injectable } from '@angular/core';
import { Subject, BehaviorSubject } from 'rxjs';
import { FichaAudi } from 'src/app/models/interfaces/ficha-audi';
import { Paginacion, Response } from 'src/app/models';
import PaginacionUtil from '../util/paginacion-util';
import { FichaAudiRequest } from 'src/app/models/interfaces/request/ficha-audi-request';
import { FichaAuditorApiService } from 'src/app/services/impl/ficha-auditor-api.service';
import { ToastrUtilService } from 'src/app/services/util/toastr-util.service';
import StorageUtil from '../util/storage-util';

@Injectable({
  providedIn: 'root'
})
export class BandejaFichaService {

  private dataFichaAuditorSubject: Subject<FichaAudi[]> = new Subject<FichaAudi[]>();
  private isLoadingSubject: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(true);
  private paginacionSubject: BehaviorSubject<Paginacion> =
    new BehaviorSubject<Paginacion>(PaginacionUtil.paginacionVacia());

  public dataFichaAuditor$ = this.dataFichaAuditorSubject.asObservable();
  public isLoading$ = this.isLoadingSubject.asObservable();
  public paginacion$ = this.paginacionSubject.asObservable();

  private data: FichaAudi[] = [];
  paginacionActual: Paginacion;
  request: FichaAudiRequest;

  constructor(private fichaAudiApi: FichaAuditorApiService,
    private toastrUtil: ToastrUtilService) { }

  public cambiarPagina(paginacion: Paginacion): void {
    this.dataFichaAuditorSubject.next(this.paginarResultado(paginacion));
  }

  public async consultarApi(nuevaConsulta: boolean, requestFicha?: FichaAudiRequest, paginacion?: Paginacion) {
    this.mostrarloader();
    this.request = nuevaConsulta ? requestFicha : StorageUtil.recuperarObjetoSession('requestFichaAudi');
    if (nuevaConsulta) {
      StorageUtil.almacenarObjetoSession('requestFichaAudi', this.request);
    }
    await this.fichaAudiApi.obtenerListaFichaAuditores(this.request).toPromise()
      .then((response: Response) => {
        if (response.estado === 'OK') {
          const dataResponse: FichaAudi[] = response.resultado;
          if (dataResponse.length > 0) {
            this.data = dataResponse;
            this.paginacionActual = nuevaConsulta ? PaginacionUtil.devolverPaginacion(paginacion, this.data.length)
              : PaginacionUtil.recuperarPaginacionSession(StorageUtil.recuperarObjetoSession('paginacionBandejaFichaAudi'));
            if (nuevaConsulta) {
              StorageUtil.almacenarObjetoSession('paginacionBandejaFichaAudi', this.paginacionActual);
            }
            this.dataFichaAuditorSubject.next(this.paginarResultado(this.paginacionActual));
            this.paginacionSubject.next(this.paginacionActual);
          } else {
            this.data.length = 0;
            this.dataFichaAuditorSubject.next([]);
            this.paginacionSubject.next(PaginacionUtil.paginacionVacia());
            this.toastrUtil.showWarning('No se encontraron resultados');
          }
        } else {
          console.error(response.error);
          this.toastrUtil.showError(response.error.mensaje);
        }
        this.ocultarLoader();
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(err);
        this.ocultarLoader();
      });
  }

  public mostrarloader(): void {
    this.isLoadingSubject.next(true);
  }

  public ocultarLoader(): void {
    this.isLoadingSubject.next(false);
  }

  private paginarResultado(paginacion: Paginacion): Array<any> {
    this.paginacionActual = paginacion;
    return PaginacionUtil.paginarData(this.data, paginacion);
  }

}

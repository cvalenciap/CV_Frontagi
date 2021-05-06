import { Injectable } from '@angular/core';
import { environment } from 'src/environments/environment';
import { FichaAudi } from 'src/app/models/interfaces/ficha-audi';
import { Response } from 'src/app/models';
import { Observable } from 'rxjs';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InfoAuditorRequest } from 'src/app/models/interfaces/request/info-auditor-request';
import { FichaAudiRequest } from 'src/app/models/interfaces/request/ficha-audi-request';
import StorageUtil from 'src/app/modules/auditoria/registroAuditor/util/storage-util';

@Injectable({
  providedIn: 'root'
})
export class FichaAuditorApiService {

  private endPoint: string;

  constructor(private httpClient: HttpClient) {
    this.endPoint = `${environment.serviceEndpoint}/ficha-audi`;
  }

  public obtenerParametros(): Observable<Response> {
    const url: string = `${this.endPoint}/parametros`;
    return this.httpClient.get<Response>(url);
  }

  public obtenerInfoAuditor(request: InfoAuditorRequest, pagina: number = 1, registros: number = 10): Observable<Response> {
    const url: string = `${this.endPoint}/info-auditores`;
    const params: HttpParams = new HttpParams()
      .append('pagina', pagina.toString())
      .append('registros', registros.toString());
    return this.httpClient.post<Response>(url, request, { params });
  }

  public obtenerListaFichaAuditores(request: FichaAudiRequest): Observable<Response> {
    const url: string = `${this.endPoint}/lista`;
    return this.httpClient.post<Response>(url, request);
  }

  public guardarFichaAuditor(ficha: FichaAudi): Observable<Response> {
    const url: string = `${this.endPoint}/registrar`;
    return this.httpClient.post<Response>(url, ficha);
  }

  public eliminarFichaAudi(idFichaAudi: number): Observable<Response> {
    const url: string = `${this.endPoint}/eliminar`;
    const params: HttpParams = new HttpParams()
      .append('idFicha', idFichaAudi.toString())
      .append('usuario', StorageUtil.recuperarObjetoSession('currentUser').codUsuario);
    return this.httpClient.delete<Response>(url, { params });
  }

  public actualizarFichaAuditor(ficha: FichaAudi): Observable<Response> {
    const url: string = `${this.endPoint}/actualizar`;
    return this.httpClient.post<Response>(url, ficha);
  }

}

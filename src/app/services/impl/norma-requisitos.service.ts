import { Injectable } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { InormaRequisitos } from '../interfaces/inorma-requisitos';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class NormaRequisitosService implements InormaRequisitos {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + `/requisito`;
  }

  obtenerNormaRequisitos(pagina: number, registros: number) {
    const params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    const url = `${this.apiEndpoint}/obtenerNormaRequisitos`;
    return this.http.get(url, { params });
  }
}

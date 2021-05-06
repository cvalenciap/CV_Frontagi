import { Injectable } from '@angular/core';
import { Itiponormas } from '../interfaces/itiponormas';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class TipoNormasService implements Itiponormas {
  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + `/tipoNormas`;
  }
  
  obtenerTipoNormas(pagina: number, registros: number) {
    const params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    const url = `${this.apiEndpoint}/obtenerTiposNormasAudi`;
    return this.http.get(url, { params });
  }
}

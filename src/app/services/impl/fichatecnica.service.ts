import { Directive, Injectable } from '@angular/core';
import { IFichaTecnicaService } from "src/app/services/interfaces/ifichatecnica.service";
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { FichaTecnica } from 'src/app/models/fichaTecnica';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';

@Injectable({
    providedIn: 'root',
})

export class FichaTecnicaService implements IFichaTecnicaService {

    private apiEndpoint: string;
    private apiEndpointExcel: string;
    constructor(private http: HttpClient) {
        this.apiEndpoint = "";
        this.apiEndpointExcel = environment.serviceEndpoint + '/fichaTecnica/plazo.xls';
    }

    buscar(idfich: number) {
        this.apiEndpoint = environment.serviceEndpoint + '/ficha';
        let params: HttpParams = new HttpParams()
        .set('id', idfich.toString())
        return this.http.get(this.apiEndpoint, { params });
    }
    guardar(archivo:any,fichaTecnica: FichaTecnica): Observable<any> {
        const requestUrl = this.apiEndpoint;
        const formData: FormData = new FormData();
        if(archivo != undefined && archivo != null){
            formData.append('file', archivo, archivo.name);
          }else{
            formData.append('file',null);          }
        
    const blobFichaTecnica = new Blob([JSON.stringify(fichaTecnica)], {
        type: "application/json"
      });
  
      formData.append('fichaTecnica', blobFichaTecnica);
  
      return this.http.post(requestUrl,formData);
    }

    /*Exportar Excel*/
  generarExcel(parametros: Map<string, any>) {
    
      let params: HttpParams = new HttpParams()
      parametros.forEach((value, key) => {
        if (value) {
          params = params.set(key, value);
        }
      });
    const url = `${this.apiEndpointExcel}`;    
    return this.http.get(url, {responseType: 'arraybuffer', params: params});
  }
  /*Exportar Excel*/

}
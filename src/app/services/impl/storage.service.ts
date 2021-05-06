import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {BandejaDocumento, RevisionDocumento} from '../../models';
import {Estado} from '../../models/enums';
import {IBandejaDocumentoService} from '../interfaces/ibandejadocumento.service';
import {environment} from '../../../environments/environment';
import { Observable } from 'rxjs';
import { IDocumentoService } from 'src/app/services/interfaces/idocumento.service';

//lgomez
@Injectable({
  providedIn: 'root',
})
export class StorageService implements IDocumentoService{

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint;
  }

  listarRevisionDocumentos(parametros:Map<string,any>,pagina: number, registros: number):Observable<any>{
    let url = this.apiEndpoint + '/revision';
    let params: HttpParams = new HttpParams()
    .set('pagina', pagina.toString())
    .set('registros', registros.toString()); 
    console.log("parametro ", parametros);
    parametros.forEach((value, key)=>{
      if(value){
        params = params.set(key,value);
      }
     
    });
  return this.http.get(url, {params});
  }

  eliminar(id:string){
  let url = this.apiEndpoint + '/revision/'+id;
  return this.http.delete(url);
  }
    
  guardar(revisionDocumento: RevisionDocumento): Observable<any>{
    return null;
  }
  
    
    actualizar(revisionDocumento: RevisionDocumento): Observable<any>{
      return null;
    }

    buscarPorCodigo(codigo: string): Observable<any>{
      return null;
    }
  
}


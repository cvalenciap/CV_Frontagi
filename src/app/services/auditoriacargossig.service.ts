import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ApiService } from './api.service';
import { Response } from '../models';



@Injectable()
export class ConsultaCargosSiService {
  constructor(private http: HttpClient, private API: ApiService) {
  }
  
  //Listar Busqueda
  ConsultaBusquedaSig(data: any): Observable<Response>{    
    return this.http.post<Response>(this.API.getConsultaCargoSig,data);
  }
  
  //Guardar
  GuardaConsultaSig(data: any): Observable<Response>{    
    return this.http.post<Response>(this.API.getGuardaCargoSig,data);
  }

  //Modificar
  GuardaConsultaSigModif(data: any): Observable<Response>{    
    return this.http.post<Response>(this.API.getGuardaModifCargoSig,data);
  }

  

}

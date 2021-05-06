import { Observable } from 'rxjs';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

@Injectable({ providedIn: 'root' })
export class JsonService {
  constructor(private http: HttpClient) {}

  getTareasPendientes(): Observable<any> {
    console.log("holaaaaaaaa");
    return this.http.get('./assets/jsons/tareas-pendientes.json').pipe();
  }

  getTareasPendientesCanceladas(): Observable<any> {
    console.log("holaaaaaaaa");
    return this.http.get('./assets/jsons/tareas-pendientes-cancelaciones.json').pipe();
  }
  


}

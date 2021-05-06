import { Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpParams } from "@angular/common/http";
import { Pregunta } from "src/app/models/pregunta";
import { IBancoPreguntaService } from "../interfaces/ibancopregunta.service";
import {Observable} from 'rxjs';
@Injectable({
    providedIn: 'root',
})
export class BancoPreguntaService implements IBancoPreguntaService{
    private apiEndpoint: string;
    private apiEndpointRol:string;
    private apiEndpointUpdateCarga: string;
    private apiEndpointGuardarPregunta: string;
    private apiEndpointEliminarPregunta: string;
    private apiEndpointObtenerPregunta: String;
    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/banco-pregunta/lista-preguntas';

        this.apiEndpointRol = environment.serviceEndpoint + '/banco-pregunta';
         this.apiEndpointGuardarPregunta= environment.serviceEndpoint + '/banco-pregunta/guardar-banco-preguntas';
         this.apiEndpointEliminarPregunta = environment.serviceEndpoint +'/banco-pregunta/eliminar-pregunta';
         this.apiEndpointObtenerPregunta = environment.serviceEndpoint + '/banco-pregunta/obtener-pregunta'    
         this.apiEndpointUpdateCarga =environment.serviceEndpoint + '/banco-pregunta/actualizar-banco-preguntas';
        }
    crear(): Pregunta {
        const pregunt = new Pregunta();
        return pregunt;
    }
obtenerListaPregunta(parametros: Map<string, any>, pagina: number, registros: number): Observable<any> {
    const url = this.apiEndpoint + '/tarea-aprobado';
    let params: HttpParams = new HttpParams().set('pagina', pagina.toString()).set('registros', registros.toString());
    
    parametros.forEach((value, key) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get(url, {params});
  }
  buscarRoles(descripcion?: any) {
    let params: HttpParams = new HttpParams()
       console.log(descripcion);
     
    if (descripcion) {      
      params = params.set('descripcion', descripcion);    
    }    
   let url = `${this.apiEndpointRol}/obtenerRoles`
    return this.http.get(url, {params});
  }
    guardar(pregunta: Pregunta){
        console.log('Guardar:');
        console.log(pregunta);          
        return this.http.post(this.apiEndpointGuardarPregunta, pregunta);        
    }

    actualizar(pregunta: Pregunta) {
        console.log(pregunta);          
        return this.http.post(this.apiEndpointUpdateCarga, pregunta);        
    }
    eliminar(ficha: Pregunta) {
      
        console.log(ficha.iD+'serviciooooooo'); 
        const url = `${this.apiEndpointEliminarPregunta}/${ficha.iD}`;
        console.log(ficha);
        console.log(url);          
        return this.http.delete(url);
    }       
    obtenerDatosPreguntaxId(cod?: number){
        let params: HttpParams = new HttpParams()
        .set('cod', cod.toString())

        return this.http.get(this.apiEndpointObtenerPregunta+"?", {params});   
    }
ObtenerDatosPreguntas(parametros: Map<string, any>): Observable<any>{
  const url= this.apiEndpoint;
  let params: HttpParams = new HttpParams();
  
  parametros.forEach((value, key) => {
    if (value) {
      params = params.set(key, value);
    }
  });
  return this.http.get(url, {params});
}
}







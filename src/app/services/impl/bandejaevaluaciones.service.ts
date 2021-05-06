import { IBandejaEvaluacionesService } from "../interfaces/ibandejaevaluaciones.service";
import { Directive,Injectable } from "@angular/core";
import {environment} from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams} from "@angular/common/http";
import { DetalleEvaluaciones } from "src/app/models/detalleevaluaciones";
import { BandejaEvaluaciones } from "src/app/models/bandejaevaluaciones";
import {Asistencia} from '../../models';
import { Observable } from 'rxjs/internal/Observable';
@Injectable({
    providedIn: 'root',
})
export class BandejaEvaluacionesService implements IBandejaEvaluacionesService{
    private apiEndpoint: string;
    private apiEndpointPdf:string;
    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/asistencia';
        this.apiEndpointPdf= environment.serviceEndpoint + '/asistencia/generarPDF';
    }

    buscarEvaluaciones(pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
    return this.http.get(this.apiEndpoint);
    }

    buscarDetalleEvaluaciones(nroFicha: string){
        const url = `${this.apiEndpoint}/${nroFicha}`;
        return this.http.get(url);
    }

    buscarPorEvaluacion(asistencia: { codCurso?: string; nomCurso?: string; }, pagina: number, registros: number){
        let url = this.apiEndpoint + `/evaluacion`;
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
        if (asistencia.codCurso) { params = params.set('codCurso', asistencia.codCurso);}
        if (asistencia.nomCurso) { params = params.set('nomCurso', asistencia.nomCurso); }
        return this.http.get(url, {params});
    }

    actualizar(asistencia: Asistencia): Observable<any> {
        
        let url = this.apiEndpoint+`/actualizarEvaluacion`;
      return this.http.post(url, asistencia);
      }

      buscarEmpleado(empleado:{
        idCapacitacion?:string,nombreTrabajador?:string,nomEquipo?:string}, pagina: number, registros: number){
            
            let url = this.apiEndpoint + `/empleados`;
            let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
            if (empleado.idCapacitacion) { params = params.set('idCapacitacion', empleado.idCapacitacion);}
            if (empleado.nombreTrabajador) { params = params.set('nombreTrabajador', empleado.nombreTrabajador);}
            if (empleado.nomEquipo) { params = params.set('nomEquipo', empleado.nomEquipo);}
            return this.http.get(url, {params});
        }


      generarPdf(parametros: {idCapacitacion?:string,listaEmpl?:any,nomCurso?:string,nombreTrabajador?:string,nomEquipo?:string}, pagina: number, registros: number
      ) {
          
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
        if(parametros.idCapacitacion!=null) { params = params.set('idCapacitacion', parametros.idCapacitacion); }
        if(parametros.listaEmpl!=null) { params = params.set('listaEmpl', parametros.listaEmpl); }
        if(parametros.nomCurso!=null) { params = params.set('nomCurso', parametros.nomCurso); }  
        if(parametros.nombreTrabajador!=null) { params = params.set('nombreTrabajador', parametros.nombreTrabajador); } 
        if(parametros.nomEquipo!=null) { params = params.set('nomEquipo', parametros.nomEquipo); } 
        //const url = `${this.apiEndpointPdf}`;
        return this.http.get(this.apiEndpointPdf, {responseType:'blob', params:params});
      }
}
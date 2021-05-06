import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Response} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import { ICapacitacionService } from "src/app/services/interfaces/icapacitacion.service";
import { ProgramarCapacitacion } from 'src/app/models/programarcapacitacion';
import { Asistencia } from 'src/app/models/asistencia';
import { CapacitacionDocumentos } from 'src/app/models/capacitacionDocumentos';

@Injectable({
    providedIn: 'root',
})

export class CapacitacionService implements ICapacitacionService{

    private apiEndpoint: string;
    private apiEndpointRegistro: string;
    private apiEndpointEliminar: string;
    private apiEndpointActualizar: string;
    private apiEndpointEnvPart: string;
    private apiEndpointCarga: string;
    private apiEndpointCurso: string;
    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/capacitacion';
        this.apiEndpointRegistro = environment.serviceEndpoint + '/guardarCapacitacion';
        this.apiEndpointEliminar = environment.serviceEndpoint + '/';
        this.apiEndpointActualizar = environment.serviceEndpoint;
        this.apiEndpointEnvPart = environment.serviceEndpoint + '/enviarParticipante';
        this.apiEndpointCarga = environment.serviceEndpoint;
        this.apiEndpointCurso = environment.serviceEndpoint + '/preguntaCurso';
      }


    buscarCapacitacion(parametros: { capacitacion?: string; instructor?: string; }, pagina: number, registros: number){
    
    let params: HttpParams = new HttpParams()
        .set('pagina',pagina.toString())
        .set('registros', registros.toString());

        if(parametros.capacitacion) {
            params = params.set('capacitacion', parametros.capacitacion);
        }
        if (parametros.instructor) {
            params = params.set('instructor', parametros.instructor); 
        }
        return this.http.get(this.apiEndpoint, { params });
    }

    registrarCapacitacion(capacitacion: ProgramarCapacitacion){
        
        return this.http.post(this.apiEndpointRegistro, capacitacion);  
    }

    eliminarCapacitacion(capacitacion : ProgramarCapacitacion){
        
        const url = `${this.apiEndpointEliminar}/${capacitacion.idCapacitacion}`;
        return this.http.delete(url);
    }

    actualizarDatosCapacitacion(capacitacion : ProgramarCapacitacion){
        let url = this.apiEndpointActualizar+`/${capacitacion.idCapacitacion}`;
        return this.http.post(url, capacitacion); 
    }

    enviarCapacitacion(asistencia : Asistencia){
        
        return this.http.post(this.apiEndpointEnvPart, asistencia);  
    }

    cargarDocumento(archivo:any,capacitacion: CapacitacionDocumentos): Observable<any>{
        const requestUrl = this.apiEndpointCarga+`/cargarDocumento`;
        const formData: FormData = new FormData();

        if(archivo != undefined && archivo != null){
        formData.append('file', archivo, archivo.name);
        }else{
        formData.append('file',null);
        }


        const blobDocumento = new Blob([JSON.stringify(capacitacion)], {
        type: "application/json"
        });


        formData.append('capacitacion', blobDocumento);
        return this.http.post(requestUrl,formData);
    }

    buscarPreguntaCursoId(preguntacurso: { idCurso?: string; }, pagina: number, registros: number){
        let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
        if (preguntacurso.idCurso) { params = params.set('idCurso',preguntacurso.idCurso);}
        return this.http.get(this.apiEndpointCurso, {params});
    }
}
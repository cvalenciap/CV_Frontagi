import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Response} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import {ICursoService} from '../interfaces/icurso.service';
import * as data from './curso.json';
import { Curso } from 'src/app/models/curso';

@Injectable({
    providedIn: 'root',
})
export class CursoService implements ICursoService {

    private apiEndpoint: string;
    private apiEndpointRegistro: string;
    private apiEndpointConsulta: string;
    private apiEndpointEliminar: string;
    private apiEndpointActualizar: string;
    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/curso';
        this.apiEndpointRegistro = environment.serviceEndpoint +  '/curso' + '/guardarCurso';
        this.apiEndpointConsulta = environment.serviceEndpoint +  '/curso' + '/detalle';
        this.apiEndpointEliminar = environment.serviceEndpoint + '/curso' + '/eliminarCurso';
        this.apiEndpointActualizar = environment.serviceEndpoint +  '/curso' + '/actualizarCurso';
      }

    
    buscarCurso(parametros: { codigoCurso?: string; nombreCurso?: string; }, pagina: number, registros: number){
        
        let params: HttpParams = new HttpParams()
            .set('pagina',pagina.toString())
            .set('registros', registros.toString());

            if(parametros.codigoCurso) {
                params = params.set('codigoCurso', parametros.codigoCurso);
            }
            if (parametros.nombreCurso) {
                params = params.set('nombreCurso', parametros.nombreCurso); 
            }
           return this.http.get(this.apiEndpoint, { params });
    }

    registrarCurso(curso: Curso){
        return this.http.post(this.apiEndpointRegistro, curso);  
    }

    bucarCursoPorCodigo(codigo: number){
        const url = `${this.apiEndpointConsulta}/${codigo}`;
        return this.http.get(url);
    }

    eliminarCurso(curso: Curso){
        
        const url = `${this.apiEndpointEliminar}/${curso.idCurso}`;
        console.log(url);
        console.log(curso.idCurso);
        return this.http.delete(url);
    }

    actualizarDatosCurso(curso: Curso){
        return this.http.post(this.apiEndpointActualizar, curso); 
    }
    
    // crear(): Curso {
    //     throw new Error("Method not implemented.");
    // }
    // obtenerTipos(): Observable<any> {
    //     throw new Error("Method not implemented.");
    // }
    // buscarPorParametros(parametros: { codigo?: string; nombre?: string; descripcion?: string; }, pagina: number, registros: number): Observable<any> {
    //     throw new Error("Method not implemented.");
    // }
    // buscarPorCodigo(codigo: number): Observable<any> {
    //     throw new Error("Method not implemented.");
    // }
    
    // buscarCurso(parametros: {codigo?: string; nombre?: string; pagina?: string;
    //     registros?: string}) {

    //         let params: HttpParams = new HttpParams()
    //         .set('pagina', parametros.pagina)
    //         .set('registros', parametros.registros);

    //         throw new Error("Method not implemented.");
    //     }

    
}
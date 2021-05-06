import { Directive, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { Instructor } from '../../models';
import { Estado } from '../../models/enums';
import { IInstructoresService } from '../interfaces/iinstructores.service';
import { environment } from '../../../environments/environment';
import { Observable } from 'rxjs';


@Injectable({
    providedIn: 'root',
})
export class InstructoresService implements IInstructoresService {

    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/instructor';
    }
    obtenerTipos() {
        let url = this.apiEndpoint + `/tipos`;
        return this.http.get(url);
    }
    crear(): Instructor {
        const instructor = new Instructor();
        //instructor.codigo = 0;
        //instructor.estado = Estado.ACTIVO;
        return instructor; 
    }

    buscarPorParametros(instructor: Instructor, pagina: number, registros: number) {
        
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (instructor.v_codinst) { params = params.set('ivcodinst', instructor.v_codinst); }
        if (instructor.v_nominst) { params = params.set('ivnominst', instructor.v_nominst); }
        if (instructor.v_apepatinst) { params = params.set('ivapepatinst', instructor.v_apepatinst); }
        if (instructor.v_apematinst) { params = params.set('ivapematinst', instructor.v_apematinst); }

        return this.http.get(this.apiEndpoint, { params });

    }

    buscarPorCodigo(codigo: number) {
        const url = `${this.apiEndpoint}/${codigo}`;
        return this.http.get(url);
    }
    guardar(instructor: Instructor): Observable<any> {
       
        let url = this.apiEndpoint;
        if (instructor.n_idinst !== 0) {
            url += `/${instructor.n_idinst}`;
          }
        return this.http.post(url, instructor);
    }

    eliminar(instructor: Instructor) {
        const url = `${this.apiEndpoint}/${instructor.n_idinst}`;
        return this.http.delete(url);
    }

}

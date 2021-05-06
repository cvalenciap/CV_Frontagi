import {Injectable} from '@angular/core';
import {environment} from '../../../environments/environment';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import {Response} from '../../models';
import {Estado} from '../../models/enums';
import {Observable} from 'rxjs';
import 'rxjs/add/observable/of';
import * as data from './curso.json';
import { ISesionService } from 'src/app/services/interfaces/isersion.service';

@Injectable({
    providedIn: 'root',
})
export class SesionService implements ISesionService {
    private apiEndpoint: string;

    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint;
    }

    bucarDatoSesion(idCurso: any, idSesion: any){
        const url = `${this.apiEndpoint}/${idCurso}/${idSesion}`;
        return this.http.get(url);
    }
}
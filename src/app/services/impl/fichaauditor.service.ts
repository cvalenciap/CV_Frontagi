import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';

import {environment} from '../../../environments/environment';
import { FichaAuditor } from 'src/app/models/fichaauditor';

import { IFichaAuditorService } from '../interfaces/ifichaauditor.service';


@Injectable({
  providedIn: 'root',
})
export class FichaAuditorService implements IFichaAuditorService {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/constante';
  }
  crear(): FichaAuditor {
    const fichaAuditor = new FichaAuditor();
    fichaAuditor.idFichaAuditor ="0";
    fichaAuditor.tipo = "12/09/2019";
    fichaAuditor.nombreAuditor = "Ruth";
    fichaAuditor.rol="Auditor";
    return fichaAuditor;
  }
  buscarPorCodigo(id: number) {
    const url = `${this.apiEndpoint}/${id}`;
    return this.http.get(url);
  }
  
  obtenerTipos(){
    let url = this.apiEndpoint + `/tipos`;
    return this.http.get(url);
  }
 
  buscarPorFichaAuditor(fichaAuditor: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (fichaAuditor.idconstante) { params = params.set('idconstante', fichaAuditor.idconstante); }
    if (fichaAuditor.v_nomcons) { params = params.set('v_nomcons', fichaAuditor.v_nomcons); }
    if (fichaAuditor.n_discons) { params = params.set('n_discons', fichaAuditor.n_discons); }
    if (fichaAuditor.estadoConstante) { params = params.set('estadoConstante', fichaAuditor.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }


  cargarDatosConstante(fichaAuditor: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (fichaAuditor.idconstante) { params = params.set('idconstante', fichaAuditor.idconstante); }
    if (fichaAuditor.v_nomcons) { params = params.set('v_nomcons', fichaAuditor.v_nomcons); }
    if (fichaAuditor.n_discons) { params = params.set('n_discons', fichaAuditor.n_discons); }
    if (fichaAuditor.estadoConstante) { params = params.set('estadoConstante', fichaAuditor.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }
 
  guardar(fichaAuditor: FichaAuditor) {
    console.log(fichaAuditor.idFichaAuditor);
    let url = this.apiEndpoint;
    if (fichaAuditor.idFichaAuditor !== "") {
      url += `/${fichaAuditor.idFichaAuditor}`;
    }
    return this.http.post(url, fichaAuditor);
  }
//Eliminar Parametro o Constante
  eliminar(fichaAuditor: FichaAuditor) {
    const url = `${this.apiEndpoint}/${fichaAuditor.idFichaAuditor}`;
    return this.http.delete(url);
  }

 


}


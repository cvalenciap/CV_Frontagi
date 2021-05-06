import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';

import { IBandejaRevisionInformeService } from '../interfaces/ibandejarevisioninforme.service';
import { BandejaRevisionInforme } from 'src/app/models/bandejarevisioninforme';
   

@Injectable({
  providedIn: 'root',
}) 


export class BandejaRevisionInformeService implements IBandejaRevisionInformeService {
      
  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/constante';
  }

    
  crear(): BandejaRevisionInforme {
    const bandejaRevisionInforme = new BandejaRevisionInforme();
    bandejaRevisionInforme.idBandejaRevisionInforme=""; 
    bandejaRevisionInforme.numeroAuditoria="";
    bandejaRevisionInforme.numIA = "";
    bandejaRevisionInforme.estadoIA=""; 
    bandejaRevisionInforme.fecha = new Date();
    bandejaRevisionInforme.auditorLider = "";  
    bandejaRevisionInforme.equipo = "";
    bandejaRevisionInforme.responsable = "";
    bandejaRevisionInforme.conclusiones = "";
    return bandejaRevisionInforme;
  }
  buscarPorCodigo(id: number) {
    const url = `${this.apiEndpoint}/${id}`;
    return this.http.get(url);
  }
  
  obtenerTipos(){
    let url = this.apiEndpoint + `/tipos`;
    return this.http.get(url);
  }
 
  obtenerAuditores(){
    let url = this.apiEndpoint + `/auditor`;
    return this.http.get(url);
  }


  buscarPorBandejaRevisionInforme(bandejaRevisionInforme: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (bandejaRevisionInforme.idconstante) { params = params.set('idconstante', bandejaRevisionInforme.idconstante); }
    if (bandejaRevisionInforme.v_nomcons) { params = params.set('v_nomcons', bandejaRevisionInforme.v_nomcons); }
    if (bandejaRevisionInforme.n_discons) { params = params.set('n_discons', bandejaRevisionInforme.n_discons); }
    if (bandejaRevisionInforme.estadoConstante) { params = params.set('estadoConstante', bandejaRevisionInforme.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }
//listas  
buscarPorListaVerficacion(listaVerificacion: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (listaVerificacion.idconstante) { params = params.set('idconstante', listaVerificacion.idconstante); }
    if (listaVerificacion.v_nomcons) { params = params.set('v_nomcons', listaVerificacion.v_nomcons); }
    if (listaVerificacion.n_discons) { params = params.set('n_discons', listaVerificacion.n_discons); }
    if (listaVerificacion.estadoConstante) { params = params.set('estadoConstante', listaVerificacion.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }

  buscarPorListaVerficacionResponsable(listaVerficacionResponsable: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (listaVerficacionResponsable.idconstante) { params = params.set('idconstante', listaVerficacionResponsable.idconstante); }
    if (listaVerficacionResponsable.v_nomcons) { params = params.set('v_nomcons', listaVerficacionResponsable.v_nomcons); }
    if (listaVerficacionResponsable.n_discons) { params = params.set('n_discons', listaVerficacionResponsable.n_discons); }
    if (listaVerficacionResponsable.estadoConstante) { params = params.set('estadoConstante', listaVerficacionResponsable.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }

  buscarEnviarInformes(listaEnviarInformes: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (listaEnviarInformes.idconstante) { params = params.set('idconstante', listaEnviarInformes.idconstante); }
    if (listaEnviarInformes.v_nomcons) { params = params.set('v_nomcons', listaEnviarInformes.v_nomcons); }
    if (listaEnviarInformes.n_discons) { params = params.set('n_discons', listaEnviarInformes.n_discons); }
    if (listaEnviarInformes.estadoConstante) { params = params.set('estadoConstante', listaEnviarInformes.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }
  
  guardar(bandejaRevisionInforme: BandejaRevisionInforme) {
    console.log(bandejaRevisionInforme.idBandejaRevisionInforme);
    let url = this.apiEndpoint;
    if (bandejaRevisionInforme.idBandejaRevisionInforme !== "") {
      url += `/${bandejaRevisionInforme.idBandejaRevisionInforme}`;
    }
    return this.http.post(url, bandejaRevisionInforme);
  }
  
 //Eliminar Parametro o Constante
  eliminar(bandejaRevisionInforme: BandejaRevisionInforme) {
    const url = `${this.apiEndpoint}/${bandejaRevisionInforme.idBandejaRevisionInforme}`;
    return this.http.delete(url);
  }

 
   

}


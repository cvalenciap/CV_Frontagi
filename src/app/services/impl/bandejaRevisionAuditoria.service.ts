import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {environment} from '../../../environments/environment';
import { BandejaRevisionAuditoria } from 'src/app/models/bandejarevisionauditoria';
import { IBandejaRevisionAuditoriaService } from '../interfaces/ibandejarevisionauditoria.service';
import { Auditor } from 'src/app/models/auditor';
   

@Injectable({
  providedIn: 'root',
}) 


export class BandejaRevisionAuditoriaService implements IBandejaRevisionAuditoriaService {

        
  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/constante';
  }

 

  crear(): BandejaRevisionAuditoria {
    const bandejaRevisionAuditoria = new BandejaRevisionAuditoria();
    bandejaRevisionAuditoria.idBandejaRevisionAuditoria="0"; 
    bandejaRevisionAuditoria.numeroAuditoria = "";
    bandejaRevisionAuditoria.fechaIngreso = new Date();
    bandejaRevisionAuditoria.numeroLV="Auditor";
    bandejaRevisionAuditoria.estadoListaVerificacion="";
    bandejaRevisionAuditoria.auditor=new Auditor();
    bandejaRevisionAuditoria.equipo="";
    bandejaRevisionAuditoria.gerencia="";
    bandejaRevisionAuditoria.actividades="";
    bandejaRevisionAuditoria.cargoAAuditar="";
    bandejaRevisionAuditoria.responsable="";

    return bandejaRevisionAuditoria;
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
    let url = this.apiEndpoint + `/auditores`;
    return this.http.get(url);
  }
 

  obtenerEquipos(){
    let url = this.apiEndpoint + `/equipos`;
    return this.http.get(url);
  }
 
 
  buscarPorBandejaRevisionAuditoria(bandejaRevisionAuditoria: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (bandejaRevisionAuditoria.idconstante) { params = params.set('idconstante', bandejaRevisionAuditoria.idconstante); }
    if (bandejaRevisionAuditoria.v_nomcons) { params = params.set('v_nomcons', bandejaRevisionAuditoria.v_nomcons); }
    if (bandejaRevisionAuditoria.n_discons) { params = params.set('n_discons', bandejaRevisionAuditoria.n_discons); }
    if (bandejaRevisionAuditoria.estadoConstante) { params = params.set('estadoConstante', bandejaRevisionAuditoria.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }
//listas  
buscarPorListaVerficacion(listaVerficacion: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (listaVerficacion.idconstante) { params = params.set('idconstante', listaVerficacion.idconstante); }
    if (listaVerficacion.v_nomcons) { params = params.set('v_nomcons', listaVerficacion.v_nomcons); }
    if (listaVerficacion.n_discons) { params = params.set('n_discons', listaVerficacion.n_discons); }
    if (listaVerficacion.estadoConstante) { params = params.set('estadoConstante', listaVerficacion.estadoConstante); }

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
  

 
  guardar(bandejaRevisionAuditoria: BandejaRevisionAuditoria) {
    console.log(bandejaRevisionAuditoria.idBandejaRevisionAuditoria);
    let url = this.apiEndpoint;
    if (bandejaRevisionAuditoria.idBandejaRevisionAuditoria !== "") {
      url += `/${bandejaRevisionAuditoria.idBandejaRevisionAuditoria}`;
    }
    return this.http.post(url, bandejaRevisionAuditoria);
  }
//Eliminar Parametro o Constante
  eliminar(bandejaRevisionAuditoria: BandejaRevisionAuditoria) {
    const url = `${this.apiEndpoint}/${bandejaRevisionAuditoria.idBandejaRevisionAuditoria}`;
    return this.http.delete(url);
  }

 
   

}


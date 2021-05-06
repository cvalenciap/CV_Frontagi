import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {DeteccionHallazgos} from '../../models/deteccionhallazgos';
import {Estado} from '../../models/enums';
import {IDeteccionHallazgosService} from '../interfaces/ideteccionhallazgos.service';
import {environment} from '../../../environments/environment';




@Injectable({
  providedIn: 'root',
})
export class DeteccionHallazgosService implements IDeteccionHallazgosService {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/constante';
  } 

  crear(): DeteccionHallazgos {
    const normaIncidencia = new DeteccionHallazgos();
    normaIncidencia.idDeteccionHallazgo ="";
    normaIncidencia.ambito = "";
    normaIncidencia.origenDeteccion="";
    normaIncidencia.fechaDeteccion=new Date();
    normaIncidencia.estado="";
    return normaIncidencia;
  }
  buscarPorCodigo(id: number) {
    const url = `${this.apiEndpoint}/${id}`;
    return this.http.get(url);
  }
  
  obtenerTipos(){
    let url = this.apiEndpoint + `/tipos`;
    return this.http.get(url);
  }

 



  obtenerOrigenDet(){
    let url = this.apiEndpoint + `/origenDet`;
    return this.http.get(url);
  }

  obtenerDetector(){
    let url = this.apiEndpoint + `/detector`;
    return this.http.get(url);
  }
  

  obtenerEstado(){
    let url = this.apiEndpoint + `/estado`;
    return this.http.get(url);
  }



  buscarPorParametros(parametros: {tipo?: string, origenDet?: string, detector?: string,estado?: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
    if (parametros.tipo) { params = params.set('tipo', parametros.tipo); }
    if (parametros.origenDet) { params =  params.set('origenDet', parametros.origenDet); }

    if (parametros.detector) { params =  params.set('detector', parametros.detector); }
    if (parametros.estado) { params =  params.set('estado', parametros.estado); }
     
    return this.http.get(this.apiEndpoint, {params});
}


buscarPorDeteccionHallazgos(deteccionhallazgos: {estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string, descripcion?: string,n_discons?: string, v_descons?:string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (deteccionhallazgos.idconstante) { params = params.set('idconstante', deteccionhallazgos.idconstante); }
    if (deteccionhallazgos.v_nomcons) { params = params.set('v_nomcons', deteccionhallazgos.v_nomcons); }
    if (deteccionhallazgos.n_discons) { params = params.set('n_discons', deteccionhallazgos.n_discons); }
    if (deteccionhallazgos.estadoConstante) { params = params.set('estadoConstante', deteccionhallazgos.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }

 
  guardar(deteccionhallazgos: DeteccionHallazgos) {
    console.log(deteccionhallazgos.idDeteccionHallazgo);
    let url = this.apiEndpoint;
    if (deteccionhallazgos.idDeteccionHallazgo!=null) {
      url += `/${deteccionhallazgos.idDeteccionHallazgo}`;
    }
    return this.http.post(url, deteccionhallazgos);
  }
//Eliminar Parametro o Constante
  eliminar(deteccionhallazgos: DeteccionHallazgos) {
    const url = `${this.apiEndpoint}/${deteccionhallazgos.idDeteccionHallazgo}`;
    return this.http.delete(url);
  }

    


}


import { Directive, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { NormaIncidencia } from '../../models/normaincidencia';
import { Norma } from '../../models/norma';
import { Estado } from '../../models/enums';
import { INormaIncidenciaService } from '../interfaces/inormaincidencia.service';
import { environment } from '../../../environments/environment';
import { Tipo } from 'src/app/models';
import { of } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class NormaIncidenciaService implements INormaIncidenciaService {

  private apiEndpoint: string;
  private apiRequisitoEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + `/norma`;
    //    this.apiRequisitoEndpoint = environment.serviceEndpoint + '/requisito';
  }
  /*crear(): NormaIncidencia {
    const normaIncidencia = new NormaIncidencia();
    normaIncidencia.id = "0";
    normaIncidencia.tipo = "";
    normaIncidencia.descripcionNormaIncidencia = "";
    normaIncidencia.requisitoIncidencia = "";
    normaIncidencia.normaRelacionada = "";
    normaIncidencia.numeroRequisito = "";
    normaIncidencia.descripcionRequisitoRelacionado = "";
    return normaIncidencia;
  }
  buscarPorCodigo(id: number) {
    
    const url = `${this.apiEndpoint}/${id}`;
    return this.http.get(url);
  }*/

  //Esto se tiene que borrar
  obtenerNormas(tipo?: string) {
    let params: HttpParams = new HttpParams()

    params = params.set('tipo', tipo);

    let url = this.apiEndpoint + `/obtenerLista`;

    return this.http.get(url, { params });
  }

  /*buscarNormaReq(tipo?: string, idNorma?: string) {
    let params: HttpParams = new HttpParams()
    if (tipo) { params = params.set('tipo', tipo); }
    if (idNorma) { params = params.set('idNorma', idNorma); }
    let url = `${this.apiEndpoint}/obtenerNormaReq`
    return this.http.get(url, { params });
  }*/


  //lista para la grilla de normas incidencia
  // Gpjp Sale otro error hay que analizar
  buscarPorParametros(parametros: { tipo?: string, norma?: string }, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.tipo) { params = params.set('tipo', parametros.tipo); }
    if (parametros.norma) { params = params.set('idNorma', parametros.norma); }
    let url = `${this.apiEndpoint}/obtenerListaGrilla`
    return this.http.get(url, { params });
  }
  /*
    guardar(normaIncidencia: NormaIncidencia) {
      console.log(normaIncidencia.id);
      let url = this.apiEndpoint;
      if (normaIncidencia.id !== "0") {
        url += `/${normaIncidencia.id}`;
      }
      return this.http.post(url, normaIncidencia);
    }
    registrarNorma(norma: Norma) {
      const jsonNorma = JSON.stringify(norma);
      let objetoRegistroNorma: any = { "norma": jsonNorma }
      console.log("Servicio registrarNorma", objetoRegistroNorma);
  
      let url = this.apiEndpoint + `/guardarNormaReq`;*/
  /*antes if (norma.idNorma != "0") {
     url += `/${norma.idNorma}`;
   }*/
  /*return this.http.post(url, objetoRegistroNorma);

}*/

  //Eliminar Parametro o Constante
  // Gpjp Sale otro error hay que analizar
  eliminar(normaIncidencia: NormaIncidencia) {
    const url = `${this.apiEndpoint}/${normaIncidencia.id}`;
    return this.http.delete(url);
  }

  /* eliminarNorma(norma: Norma) {*/
  /* antes  const url = `${this.apiEndpoint}/${norma.idNorma}`;
   return this.http.delete(url);*/
  /*}

  convertirNorma(nodosRequisito: any[]){
      
  }
 
  obtenerDocumentosRelacionados(){

    
  }

  obtenerDocumentosRelacionados() {


  }*/
  // Gpjp Sale otro error hay que analizar
  buscarRequisitosNorma(codigo: string, tipo: string) {
    let url = this.apiRequisitoEndpoint + `/obtener`;
    let params: HttpParams = new HttpParams()
      .set('idNorma', codigo)
      .set('tipoNorma', tipo);
    return this.http.get(url, { params });
  }

  listarNormasAuditoria(pagina: number, registros: number) {
    const params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    const url = `${this.apiEndpoint}/obtenerLista`;
    return this.http.get(url, { params });
  }

  updateNormasAuditoria(norma: Norma) {
    return this.http.post(this.apiEndpoint + '/actualizarNorma', norma);
  }

}


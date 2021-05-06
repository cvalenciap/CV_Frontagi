import {Directive, Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import {EvaluacionEditor} from 'src/app/models/evaluacioneditor';
import {Estado} from '../../models/enums';
import {IEvaluacionEditorService} from '../interfaces/ievaluacionEditor.service';
import {environment} from '../../../environments/environment';
import { Pregunta } from 'src/app/models/pregunta';

   

@Injectable({
  providedIn: 'root',
})
export class EvaluacionEditorService implements IEvaluacionEditorService {

  private apiEndpoint: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint + '/evaluacion';
  }
  crear(): EvaluacionEditor {
    const evaluacionEditor = new EvaluacionEditor();
    evaluacionEditor.idEvaluacionAuditor=0;
    evaluacionEditor.idAuditoria ="0";
    evaluacionEditor.fauditoria = "12/09/2019";
    evaluacionEditor.auditorEvaluado = "Ruth";
    evaluacionEditor.rol="Auditor";
    return evaluacionEditor;
  }   
  buscarPorCodigo(id: any) {

   // const url = `${this.apiEndpoint}`+ "/obtenerEvalAuditor/" +id;

  const url = `${this.apiEndpoint}/obtenerEvalAuditor`;

  let params: HttpParams = new HttpParams();

  
  if (id) { params = params.set('v_numero_auditoria', id); }

    return this.http.get(url,{params});
  }
  
  obtenerTipos(){
    let url = this.apiEndpoint + `/tipos`;
    return this.http.get(url);
  }

buscarPorEvaluacionEditor(evaluacionEditor: {
  estadoConstante?: string,idconstante?: string,v_nomcons?: string, id?: string,
  descripcion?: string,n_discons?: string, v_descons?:string}, 
  pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (evaluacionEditor.idconstante) { params = params.set('idconstante', evaluacionEditor.idconstante); }
    if (evaluacionEditor.v_nomcons) { params = params.set('v_nomcons', evaluacionEditor.v_nomcons); }
    if (evaluacionEditor.n_discons) { params = params.set('n_discons', evaluacionEditor.n_discons); }
    if (evaluacionEditor.estadoConstante) { params = params.set('estadoConstante', evaluacionEditor.estadoConstante); }

    return this.http.get(this.apiEndpoint, {params});
  }
    
   
//registrar Evaluacion ruth
registrar(evaluacionAuditor: EvaluacionEditor, listaPreguntas: Pregunta[]) {

    const jsonEvaluacionAuditor = JSON.stringify(evaluacionAuditor);
    const jsonListaPreguntas = JSON.stringify(listaPreguntas);
    //const url = `${this.apiEndpoint}/registrarEvaluacionAuditor`;
    let objetoRegistroEvaluacionAuditor:any = {"evaluacionAuditor": jsonEvaluacionAuditor, "listaPreguntas": jsonListaPreguntas}
    let url = `${this.apiEndpoint}/registrarEvaluacionAuditor`;
    
    return this.http.post(url, objetoRegistroEvaluacionAuditor);
}

actualizar(evaluacionAuditor: EvaluacionEditor, listaPreguntas: Pregunta[]) {

      const jsonEvaluacionAuditor = JSON.stringify(evaluacionAuditor);
      const jsonListaPreguntas = JSON.stringify(listaPreguntas);  
      let objetoRegistroEvaluacionAuditor:any = {"evaluacionAuditor": jsonEvaluacionAuditor, "listaPreguntas": jsonListaPreguntas}
      let url = `${this.apiEndpoint}/actualizarEvaluacionAuditor`;
      
      return this.http.post(url, objetoRegistroEvaluacionAuditor);
  }



eliminar(evaluacionEditor: EvaluacionEditor) {
  
 let codigo=evaluacionEditor.idEvaluacionAuditor;
 console.log(codigo);

  const url = this.apiEndpoint+`/eliminarEvaluacionAuditor/${codigo}`;
    
  
  return this.http.delete(url);
}

       
  buscarPorParametros(parametros: {numeroFicha?: string, apellidoPaterno?: string, apellidoMaterno?: string, nombre?: string}, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());
    if (parametros.numeroFicha) { params = params.set('v_numero_ficha', parametros.numeroFicha); }
    
   console.log(parametros.numeroFicha);
  
    if (parametros.apellidoPaterno) { params =  params.set('v_apellido_pat', parametros.apellidoPaterno); }
    if (parametros.apellidoMaterno) { params =  params.set('v_apellido_mat', parametros.apellidoMaterno); }
    if (parametros.nombre) { params =  params.set('v_nombre', parametros.nombre); }
   let url = `${this.apiEndpoint}/obtenerListaEvalAuditorGrilla` 
   
    return this.http.get(url, {params});
}


//buscarAspectosPorRol



buscarAspectosPorRol(parametros: {n_rol_auditor?: any}, pagina: number, registros: number) {

 
  let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

  if (parametros.n_rol_auditor) { params = params.set('n_rol_auditor', parametros.n_rol_auditor); }
 let url = `${this.apiEndpoint}/obtenerListaAspectos`
 
  return this.http.get(url, {params});
}
 
buscarAspectosPorRolRes(parametros: {n_rol_auditor?: any,n_idEvaAuditor?: any   }, pagina: number, registros: number) {
  let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
  
  console.log("Parametros res");
      console.log(parametros);

  if (parametros.n_rol_auditor) {   
    params = params.set('n_rol_auditor', parametros.n_rol_auditor);  
  }
  if (parametros.n_idEvaAuditor) {   
    params = params.set('idEvaluacionAuditor', parametros.n_idEvaAuditor);  
  }

  console.log("params");
  console.log(params);
 let url = `${this.apiEndpoint}/obtenerListaAspectosRes`
  return this.http.get(url, {params});
}


ImprimirEvaluacion(parametros: {n_rol_auditor?: any,n_id_EvaAuditor?: any}, pagina: number, registros: number) {
  let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString()); 
  if (parametros.n_rol_auditor) {   
    params = params.set('n_rol_auditor', parametros.n_rol_auditor);   
  }
  if (parametros.n_id_EvaAuditor) {    
    params = params.set('n_id_EvaAuditor', parametros.n_id_EvaAuditor);   
  }
 let url = `${this.apiEndpoint}/imprimirEvaluacion` 
  return this.http.get(url, {params});
}


buscarAspectosPorRolCount(parametros: {n_rol_auditor?: any,n_id_EvaAuditor?: any   }, pagina: number, registros: number) {
  let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
  
  if (parametros.n_rol_auditor) {
    
    params = params.set('n_rol_auditor', parametros.n_rol_auditor); 
  
  }


  if (parametros.n_id_EvaAuditor) {
    
    params = params.set('n_id_EvaAuditor', parametros.n_id_EvaAuditor); 
  
  }

 let url = `${this.apiEndpoint}/obtenerListaAspectosRes`
 
  return this.http.get(url, {params});
}

  
/*
  buscarPorParametros(parametros: {
    numeroFicha?: string, apePat?: string, apeMat?: string, nombre?: string},

    pagina: number, registros: number) {

    let params: HttpParams = new HttpParams()
        .set('pagina', pagina.toString())
        .set('registros', registros.toString());   
    //            
    //if (parametros.numeroFicha) { params = params.set('numeroFicha', parametros.numeroFicha); }
    if (parametros.apePat) { params =  params.set('apePat', parametros.apePat); }
    if (parametros.apeMat) { params =  params.set('apeMat', parametros.apeMat); }
    if (parametros.nombre) { params =  params.set('nombre', parametros.nombre); } 

   let url = `${this.apiEndpoint}/obtenerListaEvalAuditorGrilla`

    return this.http.get(url, {params});
}
   
*/


  guardar(evaluacionEditor: EvaluacionEditor) {
    console.log(evaluacionEditor.idEvaluacionAuditor);
    let url = this.apiEndpoint;
    if (evaluacionEditor.idEvaluacionAuditor !== 0) {

      url += `/${evaluacionEditor.idEvaluacionAuditor}`;
    }
    return this.http.post(url, evaluacionEditor);
  }
//Eliminar Parametro o Constante

    
 
  buscarDetalleEvaluacion(codigo: number){
    return this.http.get(this.apiEndpoint);
}



}


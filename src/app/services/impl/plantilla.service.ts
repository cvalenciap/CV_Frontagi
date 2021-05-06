import { IPlanAuditoriaService } from "../interfaces/iplanauditoria.service";
import { Injectable } from "@angular/core";
import { HttpClient, HttpParams } from "@angular/common/http";
import { environment } from "./../../../environments/environment";
import { Auditoria } from "src/app/models/auditoria";
import { ConsideracionPlan } from "src/app/models/consideracionesplan";
import { CriterioResultado } from "src/app/models/criterioResultado";
import { IPlantillaService } from "src/app/services/interfaces/iplantilla.service";
import { Plantilla } from "src/app/models/plantilla";
import { Observable } from "rxjs/internal/Observable";
import { conocimiento } from "src/app/models/conocimiento";
//import { PlanAuditoria } from "src/app/models/planauditoria";

@Injectable({
    providedIn: 'root',
})
export class PlantillaService implements IPlantillaService{
    private apiEndpoint: string;
    private apiEndpointConocimineto: string ;
    private apiEndpointDocumento: string;
    constructor(private http: HttpClient) {
        this.apiEndpoint = environment.serviceEndpoint + '/plantilla';
        this.apiEndpointConocimineto = environment.serviceEndpoint + '/conocimiento';
        this.apiEndpointDocumento = environment.serviceEndpoint + '/revision';
    }

    crear(): Plantilla {
        const programacion = new Plantilla();
        return programacion;
    }

    buscarPorParametros(parametros: {desplan?: string}, pagina: number, registros: number) {
        
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.desplan) { params = params.set('desplan', parametros.desplan); }     
        return this.http.get(this.apiEndpoint, {params});
    }

    buscarPorParametrosConocimiento(parametros: {idpersona?: string}, pagina: number, registros: number) {
       
        let params: HttpParams = new HttpParams()
            .set('pagina', pagina.toString())
            .set('registros', registros.toString());
        if (parametros.idpersona) { params = params.set('idpersona', parametros.idpersona); }      
        return this.http.get(this.apiEndpointConocimineto, {params});
    }

    //Listar Documento(Documento)  
  listarRevisionDocumentos(parametros:Map<string,any>,pagina: number, registros: number):Observable<any>{
    let url = this.apiEndpointDocumento;
    let params: HttpParams = new HttpParams()
    .set('pagina', pagina.toString())
    .set('registros', registros.toString()); 
    console.log("parametro revision ", parametros);
    parametros.forEach((value, key)=>{
      if(value){
        params = params.set(key,value);
      }
     
    });
    
  return this.http.get(url, {params});
  }

    
    guardar(archivo:any,plantilla: Plantilla): Observable<any> {
        const requestUrl = this.apiEndpoint;
        const formData: FormData = new FormData();
        if(archivo != undefined && archivo != null){
            formData.append('file', archivo, archivo.name);
          }else{
            formData.append('file',null);          }
        
    const blobPlantilla = new Blob([JSON.stringify(plantilla)], {
        type: "application/json"
      });
  
      formData.append('plantilla', blobPlantilla);
  
      return this.http.post(requestUrl,formData);
    }

  ActualizarConocimiento(conocimiento:conocimiento): Observable<any> {
    
    let url  = this.apiEndpointDocumento+ '/actualizarConocimiento';
    return this.http.post(url, conocimiento);
  }
    
    Eliminar(plantilla:Plantilla){
        
        const url = `${this.apiEndpoint}/${plantilla.idplan}`;
        console.log(url);
        return this.http.delete(url);
        }      
        
        EliminarConocimiento(conocimiento:conocimiento){
            
            const url = `${this.apiEndpointConocimineto}/${conocimiento.idconocimiento}/${conocimiento.idpersona}/${conocimiento.iddocumento}`;
            console.log(url);
            return this.http.delete(url);
            }  


            listarRevisionDoc(parametros:{codigoDoc?: string,tituloDoc?:string},pagina: number, registros: number):Observable<any>{
                
                let url = this.apiEndpointDocumento+"/Doc";
                let params: HttpParams = new HttpParams()
                .set('pagina', pagina.toString())
                .set('registros', registros.toString()); 
               
                /* parametros.forEach((value, key)=>{
                  if(value){
                    params = params.set(key,value);
                  }
                 
                }); */
                if (parametros.codigoDoc) { params = params.set('codigoDoc', parametros.codigoDoc);}
                if (parametros.tituloDoc) { params = params.set('tituloDoc', parametros.tituloDoc); }
               
              return this.http.get(url, {params});
              }      
}
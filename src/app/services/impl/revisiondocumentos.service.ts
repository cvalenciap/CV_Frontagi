import { Directive, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BandejaDocumento, RevisionDocumento } from '../../models';
import { Estado } from '../../models/enums';
import { IBandejaDocumentoService } from '../interfaces/ibandejadocumento.service';
import { environment } from '../../../environments/environment';
import { Observable, forkJoin } from 'rxjs';
import { IDocumentoService } from 'src/app/services/interfaces/idocumento.service';
import { SolicitudCopiaDocumento } from 'src/app/models/solicitudcopiadocumento';
import { Constante } from 'src/app/models/enums/constante';

//lgomez
@Injectable({
  providedIn: 'root',
})
export class RevisionDocumentoService implements IDocumentoService {

  private apiEndpoint: string;
  private revision: RevisionDocumento;
  private apiEndpointSolicitud: string;
  //cguerra Inicio
  private apiEndpointFooter: string;
  //cguerra Fin
  private estadoEmision: number;
  private apiEndpointFile: string;
  private apiEndpointFileAdjuntar: string;
  private apiEndpointFileFinalizar: string;

  constructor(private http: HttpClient) {
    this.apiEndpoint = environment.serviceEndpoint;
    this.apiEndpointSolicitud = environment.serviceEndpoint + '/solicitud';
    //cguerra Inicio
    this.apiEndpointFooter = environment.serviceEndpoint + '/footer';
    //cguerra Fin
    this.apiEndpointFileAdjuntar = environment.serviceEndpoint + '/revision/guardar-adjunto';
    this.apiEndpointFile = environment.serviceEndpoint + '/revision/guardar-ejecucion';
    this.apiEndpointFileFinalizar = environment.serviceEndpoint + '/revision/guardar-ejecucion-finalizar';
  }
  //cguerra Inicio
  ServicioFooter(codigo: number, nombre: string, iddocu: number, idrevi: number) {
    let params: HttpParams = new HttpParams()
    //if (parametros.ruta != null) { params = params.set('ruta', parametros.ruta); }    
    let url = this.apiEndpointFooter + "/" + codigo + "/" + nombre + "/" + iddocu + "/" + idrevi;
    return this.http.get(url, { responseType: 'blob' });
  }
  //cguerra Fin
  listarRevisionDocumentos(parametros: Map<string, any>, pagina: number, registros: number): Observable<any> {
    let url = this.apiEndpoint + '/revision';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    parametros.forEach((value, key) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    params = params.set("estado", Constante.ESTADO_DOCUMENTO_EMISION);
    return this.http.get(url, { params });
  }

  listarRevisionFase(parametros: Map<string, any>, pagina: number, registros: number): Observable<any> {
    let url = this.apiEndpoint + '/revisionFase';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    parametros.forEach((value, key) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get(url, { params });
  }

  eliminar(id: string) {
    let url = this.apiEndpoint + '/revision/' + id;
    return this.http.delete(url);
  }
  /*Guardar Solicitud de Copia*/
  guardarSolicitud(revision: SolicitudCopiaDocumento): Observable<any> {
    
    let url = this.apiEndpointSolicitud;
    return this.http.post(url, revision);
  }

  /*Aprueba Solicitud de Copia*/
  guardarSolicitudModif(revision: SolicitudCopiaDocumento): Observable<any> {
    let url = this.apiEndpointSolicitud;
    if (revision.numerosolicitud !== 0) {
      url += `/${revision.numerosolicitud}`;
    }
    return this.http.post(url, revision);
  }

  eliminarProgramacion(id: string) {
    let url = this.apiEndpoint + '/revision/eliminar/programacion/' + id;
    return this.http.delete(url);
  }

  //Implementacion para el registro del
  guardar(revision: RevisionDocumento): Observable<any> {
    let url = this.apiEndpoint;
    return this.http.post(url, revision);
  }

  adjuntarArchivo(revision: RevisionDocumento[]): Observable<any> {
    
    const requestUrl = this.apiEndpointFileAdjuntar;
    const formData: FormData = new FormData();
    revision.forEach(obj => {
      if (obj.archivo != undefined || obj.rutaDocumt != null) {
      }
    });
    const jsonListaRevision = JSON.stringify(revision);
    let parameters: any = { "listaRevision": jsonListaRevision };    
    return this.http.post(requestUrl,formData,{ params: parameters });
  }  

  guardarArchivo(revision: RevisionDocumento[]): Observable<any> {
    
    const requestUrl = this.apiEndpointFile;

    const jsonListaRevision = JSON.stringify(revision);
    let parameters: any = { "listaRevision": jsonListaRevision };

    return this.http.post(requestUrl, { params: parameters });
  }

  //cguerra Inicio
  GuardarDocumentoArchivo(revision: RevisionDocumento[]){
    
       const requestUrl = this.apiEndpointFile+"1";
    return this.http.post(requestUrl,revision);
  }
  
  finalizarArchivo(revision: RevisionDocumento[]){
    
       const requestUrl = this.apiEndpointFileFinalizar;
    return this.http.post(requestUrl,revision);
  }
  //cguerra Fin

  guardarProgramacion(parametros: any): Observable<any> {
    let url = this.apiEndpoint + '/revision/guardarprogramacion';
    return this.http.post(url, parametros);
  }

  guardarDistribucion(parametros: any): Observable<any> {
    
    let url = this.apiEndpoint + '/revision/guardarlistadistribucion';
    return this.http.post(url, parametros);
  }

  finalizarArchivoDist(parametros: any): Observable<any> {
    
    let url = this.apiEndpoint + '/revision/finalizarlistadistribucion';
    return this.http.post(url, parametros);
  }

  actualizar(revisionDocumento: RevisionDocumento): Observable<any> {
    return null;
  }

  buscarPorCodigo(codigo: string): Observable<any> {
    return null;
  }

  set setRevision(_revision: RevisionDocumento) {
    this.revision = _revision;
  }

  get getRevision() {
    return this.revision;
  }

  obtenerDetalleDocumento(documento: Observable<any>, documentoDetalle: Observable<any>) {
    return forkJoin([documento, documentoDetalle]);
  }

  buscarPorParametros(parametros: { codigo?: string, titulo?: string, numero?: string, idFase?: string }, pagina: number, registros: number) {
    let url = this.apiEndpoint + '/revisionFase';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.codigo) { params = params.set('codigoDoc', parametros.codigo); }
    if (parametros.titulo) { params = params.set('tituloDoc', parametros.titulo); }
    if (parametros.numero) { params = params.set('id', parametros.numero); }
    if (parametros.idFase) { params = params.set('idFase', parametros.idFase); }
    return this.http.get(url, { params });
  }

  buscarPorParametrosBitacora(parametros: {
    idDocumento?: number, btipocopi?: string; codigo?: string, titulo?: string,
    numero?: string, idFase?: string
  }, pagina: number, registros: number) {
    
    let url = this.apiEndpoint + '/solicitudBitacora';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.idDocumento) { params = params.set('idDocumento', parametros.idDocumento.toString()); }
    if (parametros.btipocopi) { params = params.set('btipocopi', parametros.btipocopi); }
    //if (parametros.bnombredestina) { params = params.set('bnombredestina', parametros.bnombredestina); }
    if (parametros.titulo) { params = params.set('tituloDoc', parametros.titulo); }
    if (parametros.numero) { params = params.set('id', parametros.numero); }
    if (parametros.idFase) { params = params.set('idFase', parametros.idFase); }
    return this.http.get(url, { params });
  }

  buscarPorParametrosSolici(parametros: { btipocopi?: string, titulodocumento?: string, codigoDocumento?: string }, pagina: number, registros: number) {
    
    let url = this.apiEndpoint + '/solicitudBitacora';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.btipocopi) { params = params.set('btipocopi', parametros.btipocopi); }
    if (parametros.titulodocumento) { params = params.set('titulodocumento', parametros.titulodocumento); }
    if (parametros.codigoDocumento) { params = params.set('codigoDocumento', parametros.codigoDocumento); }
    return this.http.get(url, { params });
  }
  buscarPorParametrosSoliciDocumento(parametros: { btipocopi?: string, titulodocumento?: string, codigoDocumento?: string }, pagina: number, registros: number) {
    let url = this.apiEndpoint + '/BandejaSolicitudCopia';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.btipocopi) { params = params.set('btipocopi', parametros.btipocopi); }
    if (parametros.titulodocumento) { params = params.set('titulodocumento', parametros.titulodocumento); }
    if (parametros.codigoDocumento) { params = params.set('codigoDocumento', parametros.codigoDocumento); }
    return this.http.get(url, { params });
  }

  obtenerTareaAprobar(parametros: Map<string, any>, pagina: number, registros: number): Observable<any> {
    const url = this.apiEndpoint + '/tarea-aprobado';
    let params: HttpParams = new HttpParams().set('pagina', pagina.toString()).set('registros', registros.toString());
    
    parametros.forEach((value, key) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get(url, { params });
  }

  buscarPorParametrosProgram(parametros: { codigo?: string, anio?: string, estado?: string },
    pagina: number, registros: number
  ) {
    let url = this.apiEndpoint + '/revision/listaprogramada';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

    if (parametros.codigo != null) { params = params.set('idProg', parametros.codigo); }
    if (parametros.anio != null) { params = params.set('anioProg', parametros.anio); }
    if (parametros.estado != null) { params = params.set('estProg', parametros.estado); }

    return this.http.get(url, { params });
  }

  buscarParametrosProgramacion(parametros: { codigo?: string, anio?: string, estados?: string },
    pagina: number, registros: number
  ) {
    let url = this.apiEndpoint + '/revision/listaprogramada';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

    if (parametros.codigo != null) { params = params.set('idProg', parametros.codigo); }
    if (parametros.anio != null) { params = params.set('anioProg', parametros.anio); }
    if (parametros.estados != null) { params = params.set('estProg', parametros.estados); }

    return this.http.get(url, { params });
  }

  buscarPorParametrosDistEjec(parametros: { nroficha?: string, codArea?: string, idEstProg?: string, codigo?: string, anio?: string, equipo?: string, estprog?: string, estejec?: string },
    pagina: number, registros: number
  ) {
    let url = this.apiEndpoint + '/revision/listadistribucion';
    let params: HttpParams = new HttpParams()

      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.nroficha != null) { params = params.set('nroFicha', parametros.nroficha); }
    if (parametros.codArea != null) { params = params.set('codArea', parametros.codArea); }
    if (parametros.idEstProg != null) { params = params.set('idEstProg', parametros.idEstProg); }
    if (parametros.codigo != null) { params = params.set('idProg', parametros.codigo); }
    if (parametros.anio != null) { params = params.set('anioProg', parametros.anio); }
    if (parametros.equipo != null) { params = params.set('equipoProg', parametros.equipo); }
    if (parametros.estprog != null) { params = params.set('idEstProg', parametros.estprog); }
    if (parametros.estejec != null) { params = params.set('idEstEjecProg', parametros.estejec); }

    return this.http.get(url, { params });
  }

  buscarPorParametrosEjec(parametros: {
    nrofichaCo?: string, nrofichaJe?: string, codArea?: string,
    anio?: string, codigoProg?: string, codigoDocu?: string, estejec?: string
  }
    , pagina: number, registros: number) {
    
    let url = this.apiEndpoint + '/revision/listaejecucion';
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());

    if (parametros.nrofichaCo != null) { params = params.set('nroFicha', parametros.nrofichaCo); }
    if (parametros.nrofichaJe != null) { params = params.set('nroFicha', parametros.nrofichaJe); }
    if (parametros.codArea != null) { params = params.set('equipoProg', parametros.codArea); }
    if (parametros.anio != null) { params = params.set('anioProg', parametros.anio); }
    if (parametros.codigoProg != null) { params = params.set('idProg', parametros.codigoProg); }
    if (parametros.codigoDocu != null) { params = params.set('codigoDocumento', parametros.codigoDocu); }
    if (parametros.estejec != null) { params = params.set('idEstEjecProg', parametros.estejec); }


    return this.http.get(url, { params });
  }

  buscarPorParametroIdProg(parametros: { idProg?: string }) {
    let params: HttpParams = new HttpParams();
    let url = this.apiEndpoint + `/revision/editar/programaciones`;

    if (parametros.idProg != null) { params = params.set('idProg', parametros.idProg); }

    return this.http.get(url, { params });
  }

  buscarPorParametroDistrib(parametros: { codFichaLogueado?: string, idProg?: string }) {
    
    let params: HttpParams = new HttpParams();
    let url = this.apiEndpoint + `/revision/editar/programaciones`;

    if (parametros.codFichaLogueado != null) { params = params.set('idusuresp', parametros.codFichaLogueado); }
    if (parametros.idProg != null) { params = params.set('idProg', parametros.idProg); }

    return this.http.get(url, { params });
  }

  buscarProgramaciones(parametros: {},
    pagina: number, registros: number) {
    
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    let url = this.apiEndpoint + `/revision/listar/programaciones`;

    return this.http.get(url, { params });
  }

  buscarDocsDostribuidos(parametros: { iddocu?: string },
    pagina: number, registros: number) {
    
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.iddocu != null) { params = params.set('idDocumento', parametros.iddocu); }
    let url = this.apiEndpoint + `/revision/detalle/distribuciones`;

    return this.http.get(url, { params });
  }

  buscarPorParametrosAvanz(parametros: { tipodoc?: string, gerenId?: string, anioantiguedad?: string },
    pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', "1")
      .set('registros', "1000");
    let url = this.apiEndpoint + `/revision/programaciones`;

    if (parametros.tipodoc != null) { params = params.set('tipodoc', parametros.tipodoc); }
    if (parametros.gerenId != null) { params = params.set('gerenId', parametros.gerenId); }
    if (parametros.anioantiguedad != null) { params = params.set('anioantiguedad', parametros.anioantiguedad); }

    return this.http.get(url, { params });
  }

  buscarJefes(parametros: { nroficha?: string, codArea?: string }, pagina: number, registros: number) {
    
    let url = this.apiEndpoint + `/revision/listajefes`;
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.nroficha != null) { params = params.set('fichaTrabajador', parametros.nroficha); }
    if (parametros.codArea != null) { params = params.set('areaTrabajador', parametros.codArea); }
    return this.http.get(url, { params });
  }

  rechazarDocumento(idDocumento: number, revisionRechazar: RevisionDocumento): Observable<any> {
    let url = this.apiEndpoint + `/rechazarDocumento/${idDocumento}`;
    return this.http.post(url, revisionRechazar);
  }

  guardarDocumentoRevision(revision: RevisionDocumento): Observable<any> {
    const url = this.apiEndpoint + '/revision/guardarDocumento';
    return this.http.post(url, revision);
  }
}


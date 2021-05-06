import { Directive, Injectable } from '@angular/core';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BandejaDocumento, RevisionDocumento } from '../../models';
import { Documento } from '../../models';
import { Estado } from '../../models/enums';
import { IBandejaDocumentoService } from '../interfaces/ibandejadocumento.service';
import { environment } from '../../../environments/environment';
//import { TreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla';
//import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { Subject, Observable, forkJoin } from 'rxjs';
import { map } from 'rxjs/operators';
import { Response } from '../../models/response';
import { ResponseContentType } from '@angular/http';
import { Fase } from 'src/app/models/fase';
import { Paginacion } from 'src/app/models';
import { Tareas } from 'src/app/models/tareas';
import { DocumentoMigracion } from 'src/app/models/documentomigracion';
import { DatePipe } from '@angular/common';


@Injectable({
  providedIn: 'root',
})

export class BandejaDocumentoService implements IBandejaDocumentoService {

  private apiEndpointCrearDocGoogle: string;
  private apiEndpointSubirDocGoogle: string;
  private apiEndpoint: string;
  private apiEndpointadjuntar: string;
  private apiEndpointFile: string;
  private apiEndpointM: string;
  private apiEndpointArbol: string;
  private apiEndpointDetalle: string;
  private apiEndpointDetalleHist: string;
  private apiEndpointDetalleSoli: string;
  private apiEndpointCodAnterior: string;
  private apiEndpointCodigoDocumento: string;
  private apiEndpointExcel: string;
  private apiEndpointPdf: string;
  private apiEndpointBloquear: string;
  private apiEndpointDesBloquear: string;
  private apiEndpoindColaborador: string;
  private apiEndpoindDetalleDocumentoMigracion: string;
  private prueba: string;
  private parametroId: number;
  private apiEndpointDetalleMigracion: string;
  private subjectRevision = new Subject<Map<string, any>>();
  private apiEndpointHistorico: string;
  private apiEndpointDocumentoSolicitudRevision: string;
  private apiEndpointRevisionDocumento: string;
  private apiEndpointObtenerHistorico: string;
  private apiEndpointParticipantes: string;
  private apiEndpointHistoricoDetalle: string;
  //@ViewChild(ArbolPlantillaCoTreeFlatOverviewData) child: ArbolPlantillaCoTreeFlatOverviewData;

  constructor(private http: HttpClient, private datePipe: DatePipe) {
    /*Migraci�n */
    this.apiEndpointM = environment.serviceEndpoint + '/migracion/documentomigracion';
    this.apiEndpoindColaborador = environment.serviceEndpoint + '/migracion/colaboradormigracion';
    this.apiEndpoindDetalleDocumentoMigracion = environment.serviceEndpoint + '/migracion/documentoDetallemigracion';
    this.apiEndpointFile = environment.serviceEndpoint + '/migracion/enviarDocumentofile';
    this.apiEndpointObtenerHistorico = environment.serviceEndpoint + '/migracion/consultaHistoricaMigracion';

    /*Migraci�n */


    this.apiEndpoint = environment.serviceEndpoint + '/documento';
    this.apiEndpointadjuntar = environment.serviceEndpoint + '/documentosinAdjunto';
    this.apiEndpointArbol = environment.serviceEndpoint + '/jerarquia';
    this.apiEndpointDetalle = environment.serviceEndpoint + '/documentoDetalle';
    this.apiEndpointDetalleHist = environment.serviceEndpoint + '/documentoDetalleHist';
    this.apiEndpointCodAnterior = environment.serviceEndpoint + '/codigoAnterior';
    this.apiEndpointCodigoDocumento = environment.serviceEndpoint + '/documento/generar-codigo';
    this.apiEndpointExcel = environment.serviceEndpoint + '/plazo.xls';
    this.apiEndpointPdf = environment.serviceEndpoint + '/plazo.pdf';
    this.apiEndpointCrearDocGoogle = environment.serviceEndpoint + '/crearDocGoogleDrive';
    this.apiEndpointHistorico = environment.serviceEndpoint + '/migracion/historicomigracion';
    this.apiEndpointSubirDocGoogle = environment.serviceEndpoint + '/subirDocGoogleDrive';
    this.apiEndpointBloquear = environment.serviceEndpoint + '/bloquearDocumento';
    this.apiEndpointDesBloquear = environment.serviceEndpoint + '/desBloquearDocumento';
    this.apiEndpointDetalleSoli = environment.serviceEndpoint + '/documentoSolicitudDetalle';
    this.apiEndpointDocumentoSolicitudRevision = environment.serviceEndpoint + '/documentoSolicitudRevision';
    this.apiEndpointRevisionDocumento = environment.serviceEndpoint + '/documentoRevisionSolicitudDetalle';
    this.apiEndpointParticipantes = environment.serviceEndpoint + '/detalleParticipantes';
    this.apiEndpointHistoricoDetalle = environment.serviceEndpoint + '/migracion/historicoDetalleMigracion';
  }

  ngOnInit() {
    /*console.log(this.parametroId);
     this.child.emitEvent.subscribe(parametroIdArbol =>
      {
        this.parametroId = parametroIdArbol;
        //console.log("PARAMETRO EDITAR:" + parametroIdArbol);
      }
    );*/
  }

  getSubjectRevision(): Observable<any> {
    return this.subjectRevision.asObservable();
  }

  enviarRevisionDocumento(listaRevisionDocumento: Map<string, any>) {
    this.subjectRevision.next(listaRevisionDocumento);
  }

  //Listar Documento(Documento)
  buscarPorParametros(parametros: { tipodocumento?: string, codigo?: string, titulo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string, estdoc?: string, vmodal?: string/*, codigo?: string, tipoDocumento?: string, descripcion?: string*/ }, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    /*if (parametros.tipoDocumento) { params = params.set('tipoDocumento', parametros.tipoDocumento); }
    if (parametros.codigo) { params = params.set('codigo', parametros.codigo); }
    if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }*/
    if (parametros.codigo != null) { params = params.set('codigo', parametros.codigo); }
    if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
    if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
    if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
    if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
    if (parametros.tipodocumento != null) { params = params.set('tipodocumento', parametros.tipodocumento); }
    if (parametros.estdoc != null) { params = params.set('estdoc', parametros.estdoc); }
    if (parametros.vmodal != null) { params = params.set('vmodal', parametros.vmodal); }

    
    //if (parametros.revisionobligatorio != null) { params = params.set('revisionobligatorio', parametros.revisionobligatorio); }
    //if (parametros.revisionobligatorio != null) { params = params.set('revisionobligatorio', parametros.revisionobligatorio); }
    // if (parametros.estdoc != null) { params = params.set('estdoc', String(parametros.estdoc)); }
    // if (parametros.v_descons) { params = params.set('v_descons', parametros.v_descons); }
    return this.http.get(this.apiEndpoint, { params });
  }

  //Listar Documento(Documento)
  buscarPorParametrosMigracion(parametros: { tipodocumento?: string, codigo?: string, titulo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string, estdoc?: string/*, codigo?: string, tipoDocumento?: string, descripcion?: string*/ }, pagina: number, registros: number) {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    /*if (parametros.tipoDocumento) { params = params.set('tipoDocumento', parametros.tipoDocumento); }
    if (parametros.codigo) { params = params.set('codigo', parametros.codigo); }
    if (parametros.descripcion) { params = params.set('descripcion', parametros.descripcion); }*/
    if (parametros.codigo != null) { params = params.set('codigo', parametros.codigo); }
    if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
    if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
    if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
    if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
    if (parametros.tipodocumento != null) { params = params.set('tipodocumento', parametros.tipodocumento); }
    if (parametros.estdoc != null) { params = params.set('estdoc', parametros.estdoc); }
    //if (parametros.revisionobligatorio != null) { params = params.set('revisionobligatorio', parametros.revisionobligatorio); }
    //if (parametros.revisionobligatorio != null) { params = params.set('revisionobligatorio', parametros.revisionobligatorio); }
    // if (parametros.estdoc != null) { params = params.set('estdoc', String(parametros.estdoc)); }
    // if (parametros.v_descons) { params = params.set('v_descons', parametros.v_descons); }
    return this.http.get(this.apiEndpointM, { params });
  }
  //Consulta Historica Documento(Documento)
  buscarPorParametrosHistory(parametros: { tipodocumento?: string, codigo?: string, titulo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string/*, codigo?: string, tipoDocumento?: string, descripcion?: string*/ }, pagina: number, registros: number) {

    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.codigo != null) { params = params.set('codigo', parametros.codigo); }
    if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
    if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
    if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
    if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
    if (parametros.tipodocumento != null) { params = params.set('tipodocumento', parametros.tipodocumento); }
    return this.http.get(this.apiEndpointObtenerHistorico, { params });

    //return this.http.get(this.apiEndpoint, {params});
  }
  /* Buscar Documento con toda la Revision o la utima Revision Aprobada */
  buscaDocumentoSolicitud(parametros: { idtipocopia?: string, tipodocumento?: string, codigo?: string, titulo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string, estdoc?: string/*, codigo?: string, tipoDocumento?: string, descripcion?: string*/ }, pagina: number, registros: number) {
    
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.idtipocopia != null) { params = params.set('idtipocopia', parametros.idtipocopia); }
    if (parametros.codigo != null) { params = params.set('codigo', parametros.codigo); }
    if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
    if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
    if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
    if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
    if (parametros.tipodocumento != null) { params = params.set('tipodocumento', parametros.tipodocumento); }
    if (parametros.estdoc != null) { params = params.set('estdoc', parametros.estdoc); }
    return this.http.get(this.apiEndpointDocumentoSolicitudRevision, { params });
  }

  buscarPorParametrosAvanz(parametros: {
    codigo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string, vmodalava?: string,
    idTipoDoc?: string, titulo?: string, estdoc?: string, fecharevdesde?: Date,
    fecharevhasta?: Date, fechaaprobdesde?: Date, fechaaprobhasta?: Date,
    tipodocumento?: number, periodooblig?: string, motirevision?: string,
    numrevi?: string, procesoparametroid?: string, sgiparametroid?: string,
    gerenparametroid?: string, idarea?: string, idparticipante?: string
    idfaseact?: string, idfaseestadoact?: string, tipoBusq?: string
  }, pagina: number, registros: number) {

    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.tipoBusq == "avanzada") {
      if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
      if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
      if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
      if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
      if (parametros.estdoc != null) { params = params.set('estdoc', parametros.estdoc); }
      if (parametros.fecharevdesde != null) { params = params.set('fecharevdesde', parametros.fecharevdesde.toString()); }
      if (parametros.fecharevhasta != null) { params = params.set('fecharevhasta', parametros.fecharevhasta.toString()); }
      if (parametros.fechaaprobdesde != null) { params = params.set('fechaaprobdesde', parametros.fechaaprobdesde.toString()); }
      if (parametros.fechaaprobhasta != null) { params = params.set('fechaaprobhasta', parametros.fechaaprobhasta.toString()); }
      if (parametros.tipodocumento) { params = params.set('tipodocumento', parametros.tipodocumento.toString()); }
      if (parametros.periodooblig != null) { params = params.set('periodooblig', parametros.periodooblig); }
      if (parametros.motirevision != "") { params = params.set('motirevision', parametros.motirevision); }
      if (parametros.numrevi != null) { params = params.set('numrevi', parametros.numrevi); }
      if (parametros.procesoparametroid != null) { params = params.set('idproc', parametros.procesoparametroid); }
      if (parametros.sgiparametroid != null) { params = params.set('idalcasgi', parametros.sgiparametroid); }
      if (parametros.gerenparametroid != null) { params = params.set('idgeregnrl', parametros.gerenparametroid); }
      if (parametros.idarea != null) { params = params.set('listaArea', parametros.idarea); }
      if (parametros.idparticipante != null) { params = params.set('idparticipante', parametros.idparticipante); }
      if (parametros.idfaseact != "") { params = params.set('idfaseact', parametros.idfaseact); }
      if (parametros.idfaseestadoact != "") { params = params.set('idfaseestadoact', parametros.idfaseestadoact); }
      if (parametros.vmodalava != "") { params = params.set('vmodalava', parametros.vmodalava); }
    } else {
      if (parametros.codigo != null) { params = params.set('codigo', parametros.codigo); }
      if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
      if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
      if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
      if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
      //if (parametros.revisionobligatorio != null) { params = params.set('revisionobligatorio', parametros.revisionobligatorio); }
    }
    
    return this.http.get(this.apiEndpoint, { params });
  }

  /*Exportar Excel*/
  generarExcel(parametros: {
    codigo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string,
    idTipoDoc?: string, titulo?: string, estdoc?: string, fecharevdesde?: Date,
    fecharevhasta?: Date, fechaaprobdesde?: Date, fechaaprobhasta?: Date,
    tipodocumento?: number, periodooblig?: string, motirevision?: string,
    numrevi?: string, procesoparametroid?: string, sgiparametroid?: string,
    gerenparametroid?: string, idarea?: string, idparticipante?: string
    idfaseact?: string, idfaseestadoact?: string, tipoBusq?: string
  }
  ) {
    let params: HttpParams = new HttpParams()
      .set('pagina', '0')
      .set('registros', '0');
    if (parametros.tipoBusq == "avanzada") {
      if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
      if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
      if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
      if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
      if (parametros.estdoc != null) { params = params.set('estdoc', parametros.estdoc); }
      if (parametros.fecharevdesde != null) { params = params.set('fecharevdesde', parametros.fecharevdesde.toString()); }
      if (parametros.fecharevhasta != null) { params = params.set('fecharevhasta', parametros.fecharevhasta.toString()); }
      if (parametros.fechaaprobdesde != null) { params = params.set('fechaaprobdesde', parametros.fechaaprobdesde.toString()); }
      if (parametros.fechaaprobhasta != null) { params = params.set('fechaaprobhasta', parametros.fechaaprobhasta.toString()); }
      if (parametros.tipodocumento) { params = params.set('tipodocumento', parametros.tipodocumento.toString()); }
      if (parametros.periodooblig != "0") { params = params.set('periodooblig', parametros.periodooblig); }
      if (parametros.motirevision != "") { params = params.set('motirevision', parametros.motirevision); }
      if (parametros.numrevi != null) { params = params.set('numrevi', parametros.numrevi); }
      if (parametros.procesoparametroid != null) { params = params.set('idproc', parametros.procesoparametroid); }
      if (parametros.sgiparametroid != null) { params = params.set('idalcasgi', parametros.sgiparametroid); }
      if (parametros.gerenparametroid != null) { params = params.set('idgeregnrl', parametros.gerenparametroid); }
      if (parametros.idarea != null) { params = params.set('listaArea', parametros.idarea); }
      if (parametros.idparticipante != null) { params = params.set('idparticipante', parametros.idparticipante); }
      if (parametros.idfaseact != "") { params = params.set('idfaseact', parametros.idfaseact); }
      if (parametros.idfaseestadoact != "") { params = params.set('idfaseestadoact', parametros.idfaseestadoact); }
    } else {
      if (parametros.codigo != null) { params = params.set('codigo', parametros.codigo); }
      if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
      if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
      if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
      if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
    }
    const url = `${this.apiEndpointExcel}`;
    return this.http.get(url, { responseType: 'arraybuffer', params: params });
  }
  /*Exportar Pdf*/
  generarPdf(parametros: {
    codigo?: string, idproc?: string, idalcasgi?: string, idgeregnrl?: string,
    idTipoDoc?: string, titulo?: string, estdoc?: string, fecharevdesde?: Date,
    fecharevhasta?: Date, fechaaprobdesde?: Date, fechaaprobhasta?: Date,
    tipodocumento?: number, periodooblig?: string, motirevision?: string,
    numrevi?: string, procesoparametroid?: string, sgiparametroid?: string,
    gerenparametroid?: string, idarea?: string, idparticipante?: string
    idfaseact?: string, idfaseestadoact?: string, tipoBusq?: string
  }
  ) {
    let params: HttpParams = new HttpParams()
      .set('pagina', '0')
      .set('registros', '0');
    if (parametros.tipoBusq == "avanzada") {
      if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
      if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
      if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
      if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
      if (parametros.estdoc != null) { params = params.set('estdoc', parametros.estdoc); }
      if (parametros.fecharevdesde != null) { params = params.set('fecharevdesde', parametros.fecharevdesde.toString()); }
      if (parametros.fecharevhasta != null) { params = params.set('fecharevhasta', parametros.fecharevhasta.toString()); }
      if (parametros.fechaaprobdesde != null) { params = params.set('fechaaprobdesde', parametros.fechaaprobdesde.toString()); }
      if (parametros.fechaaprobhasta != null) { params = params.set('fechaaprobhasta', parametros.fechaaprobhasta.toString()); }
      if (parametros.tipodocumento) { params = params.set('tipodocumento', parametros.tipodocumento.toString()); }
      if (parametros.periodooblig != "0") { params = params.set('periodooblig', parametros.periodooblig); }
      if (parametros.motirevision != "") { params = params.set('motirevision', parametros.motirevision); }
      if (parametros.numrevi != null) { params = params.set('numrevi', parametros.numrevi); }
      if (parametros.procesoparametroid != null) { params = params.set('idproc', parametros.procesoparametroid); }
      if (parametros.sgiparametroid != null) { params = params.set('idalcasgi', parametros.sgiparametroid); }
      if (parametros.gerenparametroid != null) { params = params.set('idgeregnrl', parametros.gerenparametroid); }
      if (parametros.idarea != null) { params = params.set('listaArea', parametros.idarea); }
      if (parametros.idparticipante != null) { params = params.set('idparticipante', parametros.idparticipante); }
      if (parametros.idfaseact != "") { params = params.set('idfaseact', parametros.idfaseact); }
      if (parametros.idfaseestadoact != "") { params = params.set('idfaseestadoact', parametros.idfaseestadoact); }
    } else {
      if (parametros.codigo != null) { params = params.set('codigo', parametros.codigo); }
      if (parametros.titulo != null) { params = params.set('titulo', parametros.titulo); }
      if (parametros.idproc != null) { params = params.set('idproc', parametros.idproc); }
      if (parametros.idalcasgi != null) { params = params.set('idalcasgi', parametros.idalcasgi); }
      if (parametros.idgeregnrl != null) { params = params.set('idgeregnrl', parametros.idgeregnrl); }
    }
    //const url = `${this.apiEndpointPdf}`;
    return this.http.get(this.apiEndpointPdf, { responseType: 'blob', params: params });
  }
  /*Obtener Codigo Anterior*/
  obtenerCodigoAnterior(idDoc) {
    let params: HttpParams = new HttpParams()
      .set('id', idDoc);
    return this.http.get(this.apiEndpointCodAnterior, { params });
  }

  obtenerTipos() {
    let url = this.apiEndpoint + `/tipos`;
    return this.http.get(url);
  }

  buscarPorParametrosArbol(parametros: { codigo?: string, tipo?: string, id?: string, idTipoDocu?: string, tipoJerarquiaNombre?: string }, pagina: number, registros: number) {
    //buscarPorParametrosArbol() {
    let params: HttpParams = new HttpParams()
      .set('pagina', pagina.toString())
      .set('registros', registros.toString());
    if (parametros.tipo) { params = params.set('tipo', parametros.tipo); }
    //JHERRERAP
    if (parametros.idTipoDocu) { params = params.set('idTipoDocu', parametros.idTipoDocu); }
    if (parametros.tipoJerarquiaNombre) { params = params.set('tipoJerarquiaNombre', parametros.tipoJerarquiaNombre); }
    //JHERRERAP
    /*if (parametros.v_nomcons) { params = params.set('v_nomcons', null); }
    if (parametros.n_discons) { params = params.set('n_discons', null); }
    if (parametros.estadoConstante) { params = params.set('estadoConstante', null); }*/
    return this.http.get(this.apiEndpointArbol, { params });
  }

  buscarPorCodigo(codigo: number) {
    
    let url = this.apiEndpointDetalle + "/" + codigo;
    return this.http.get(url).pipe();
  }

  buscarPorCodigoHist(codigo: number, idRevisionSeleccionado: number) {
    
    let url = this.apiEndpointDetalleHist + "/" + codigo + "/" + idRevisionSeleccionado;
    return this.http.get(url).pipe();
  }

  //seleccionar del modal
  buscarPorCodigoDocSoliRevi(codigo: number, codigoRevision: number) {
    let url = this.apiEndpointRevisionDocumento + "/" + codigo + "/" + codigoRevision;
    return this.http.get(url).pipe();
  }

  buscarPorCodigoDocSoli(codigo: number, codigoSolicitud: number, codigoRevision) {
    let url = this.apiEndpointDetalleSoli + "/" + codigo + "/" + codigoSolicitud + "/" + codigoRevision;
    return this.http.get(url).pipe();
  }

  buscarPorCodigoMigracion(codigo: number) {
    const url = this.apiEndpoindDetalleDocumentoMigracion + '/' + codigo;
    return this.http.get(url).pipe();
  }

  //Guardar Documento
  guardar(documento: Documento) {
    //console.log(documento);
    let url = this.apiEndpoint;
    return this.http.post(url, documento);
  }

  //Subir Documento en Google Drive
  subirDocGoogleDrive(tareas: Tareas) {
    return this.http.post(this.apiEndpointSubirDocGoogle, tareas);
  }
  //Modificar Documento
  //guardarMigracion(documento: Documento,file: HTMLInputElement) {
  guardarMigracion(documento: DocumentoMigracion) {

    //console.log(documento);
    let url = this.apiEndpointM;
    return this.http.post(url, documento);
  }

  //CGuerra Inicial
  guardarMigracionArchivo(archivo: any, archivodoc: any, documento: DocumentoMigracion): Observable<any> {
    const requestUrl = this.apiEndpointFile;
    const formData: FormData = new FormData();
    if (archivo != undefined && archivo != null) {
      formData.append('file', archivo, archivo.name);
    } else {
      formData.append('file', null);
    }
    //CG
    if (archivodoc != undefined && archivodoc != null) {
      formData.append('fileDoc', archivodoc, archivodoc.name);
    } else {
      formData.append('fileDoc', null);
    }
    //CG
    const blobDocumento = new Blob([JSON.stringify(documento)], {
      type: "application/json"
    });
    formData.append('documento', blobDocumento);
    return this.http.post(requestUrl, formData);
  }
  //CGuerra Fin

  //Modificar Documento
  modificar(documento: Documento) {
    
    let url = this.apiEndpoint;
    if (documento.id !== 0) {
      url += `/${documento.id}`;
    }
    return this.http.post(url, documento);
  }

  modificarsinAdjunto(documento: Documento) {
    
    let url = this.apiEndpointadjuntar;
    if (documento.id !== 0) {
      url += `/${documento.id}`;
    }
    return this.http.post(url, documento);
  }

  //Bloquear Documento
  bloquear(bitacora: Fase) {
    let url = this.apiEndpointBloquear;
    return this.http.post(url, bitacora);
  }

  //DesBloquear Documento
  desBloquear(bitacora: any) {
    
    let url = this.apiEndpointDesBloquear;
    return this.http.post(url, bitacora);
  }

  modificarTraslado(documento: Documento) {

    let url = this.apiEndpoint;
    if (documento.id !== 0) {
      url += `/traslado/${documento.id}`;
    }

    return this.http.post(url, documento);
  }

  /* Modificacion Registro Migracion*/
  modificarMigracion(documento: DocumentoMigracion) {
    let url = this.apiEndpointM;
    if (documento.id !== 0) {
      url += `/${documento.id}`;
    }
    return this.http.post(url, documento);
  }
  // Modificacion con Archivo Adjunto
  modificarConAdjunto(documento: Documento, file: HTMLInputElement) {
    const formData: FormData = new FormData();
    formData.append('file', file.files[0], file.files[0].name);

    const blobDocumento = new Blob([JSON.stringify(documento)], {
      type: "application/json"
    });
    formData.append('documento', blobDocumento);

    let url = this.apiEndpoint;
    if (documento.id !== 0) {
      url += `/${documento.id}`;
    }
    return this.http.put(url, formData);
  }

  eliminar(bandejadocumento: BandejaDocumento) {
    const url = `${this.apiEndpoint}/${bandejadocumento.codigo}`;
    //console.log(url);
    //console.log(bandejadocumento.fechaRegistro);
    return this.http.delete(url);
  }

  obtenerDocumento(parametros: Map<string, any>): Observable<any> {
    let params: HttpParams = new HttpParams()
      .set('pagina', "1")
      .set('registros', "1");

    parametros.forEach((value, key) => {
      if (value) {
        params = params.set(key, value);
      }
    });
    return this.http.get(this.apiEndpoint, { params });
  }

  obtenerParametroPadre(padre: string) {
    let params: HttpParams = new HttpParams()
      .set('padre', padre)
      .set('pagina', "1")
      .set('registros', "1000");
    let url = environment.serviceEndpoint + '/constante';
    return this.http.get(url, { params });
  }

  forkRevision(parametrosPadre: Observable<any>, documentoPorCodigo: Observable<any>) {
    return forkJoin([parametrosPadre, documentoPorCodigo]);
  }

  generarCodigoDocumento(codigoGerencia: number, codigoTipoDocumento: number) {
    let httpParametros: HttpParams = new HttpParams();
    if (codigoGerencia != null) { httpParametros = httpParametros.set('codigoGerencia', String(codigoGerencia)); }
    if (codigoTipoDocumento != null) { httpParametros = httpParametros.set('codigoTipoDocumento', String(codigoTipoDocumento)); }
    return this.http.get(this.apiEndpointCodigoDocumento, { params: httpParametros });
  }

  crearDocumentoGoogleDrive(idrevi: number, tipoDocumentoCrear: string) {
    let url = this.apiEndpointCrearDocGoogle + "/" + idrevi + "/" + tipoDocumentoCrear;
    return this.http.post(this.apiEndpointCrearDocGoogle + "/" + idrevi + "/" + tipoDocumentoCrear, {});
  }

  obtenerColaboradoresMigracion(parametros: Map<string, any>, paginacion: Paginacion): Observable<any> {
    let parametrosHttp: HttpParams = new HttpParams()
      .set('pagina', paginacion.pagina.toString())
      .set('registros', paginacion.registros.toString());

    parametros.forEach((value, key) => {
      if (value) {
        parametrosHttp = parametrosHttp.set(key, value);
      }
    });
    return this.http.get(this.apiEndpoindColaborador, { params: parametrosHttp });
  }

  buscarHistorico(parametros: { codigo?: number }, paginacion: Paginacion) {
    // this.apiEndpoint = environment.serviceEndpoint + '/migracion/historico';
    let params: HttpParams = new HttpParams()
      .set('pagina', paginacion.pagina.toString())
      .set('registros', paginacion.registros.toString());

    if (parametros.codigo) { params = params.set('id', parametros.codigo.toString()); }
    return this.http.get(this.apiEndpointHistorico, { params });
  }

  CrearCodigo(codigoGerencia: number, codigoTipoDocumento: number) {
    
    let url = this.apiEndpoint + `/generar-codigo`;
    let params: HttpParams = new HttpParams()

    if (codigoGerencia) { params = params.set('codigoGerencia', String(codigoGerencia)) }
    if (codigoTipoDocumento) { params = params.set('codigoTipoDocumento', String(codigoTipoDocumento)) }
    return this.http.get(url, { params });
  }

  buscarParticipantesModificados(codigo: number) {
    let url = this.apiEndpointParticipantes + "/" + codigo;
    return this.http.get(url);
  }


  buscarHistoricoDetalle(parametros: { codigo?: number, numrevi?: string }, paginacion: Paginacion) {
    
    let params: HttpParams = new HttpParams()
      .set('pagina', paginacion.pagina.toString())
      .set('registros', paginacion.registros.toString());

    if (parametros.codigo) { params = params.set('id', parametros.codigo.toString()); }
    if (parametros.numrevi) { params = params.set('numrevi', parametros.numrevi); }
    return this.http.get(this.apiEndpointHistoricoDetalle, { params });
  }
  buscarPorIdDocumento(codigo: number) {
    
    let url = this.apiEndpoint;
    let params: HttpParams = new HttpParams()

    if (codigo) { params = params.set('id', String(codigo)); }
    return this.http.get(url, { params });
  }
}

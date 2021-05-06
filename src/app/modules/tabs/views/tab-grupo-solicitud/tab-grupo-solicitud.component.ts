import {Component, OnInit, ViewChild} from '@angular/core';
import {Documento, Paginacion} from '../../../../models';
import {InformacionSolicitudCancelacionComponent} from '../../../tareapendiente/component/informacion-solicitud-cancelacion/informacion-solicitud-cancelacion.component';
import {DocumentoRelacionadoSolicitudCancelacionComponent} from '../../../tareapendiente/component/documento-relacionado-solicitud-cancelacion/documento-relacionado-solicitud-cancelacion.component';
import {SustentoSolicitudCancelacionComponent} from '../../../tareapendiente/component/sustento-solicitud-cancelacion/sustento-solicitud-cancelacion.component';
import { Cancelacion } from 'src/app/models/cancelacion';

@Component({
  selector: 'app-tab-grupo-solicitud',
  templateUrl: './tab-grupo-solicitud.component.html',
  styleUrls: ['./tab-grupo-solicitud.component.scss']
})
export class TabGrupoSolicitudComponent implements OnInit {
  public document: Documento;

  public cancelacionTabs: Cancelacion;
  archivoSustento:any;

  @ViewChild('information')   requestInformation:      InformacionSolicitudCancelacionComponent;
  @ViewChild('relationship')  requestRelationship:     DocumentoRelacionadoSolicitudCancelacionComponent;
  @ViewChild('livelihood')    requestLivelihood:       SustentoSolicitudCancelacionComponent;

  constructor() {}

  ngOnInit() {
  }

  receiveDocument($event) {
    this.document = $event;
    this.requestRelationship.documento = this.document;
    
    this.requestRelationship.documentosComplementarios = this.document.listaComplementario;
    this.requestRelationship.convertirDocumentosComplementarios();
   // this.requestRelationship.agregarDocumentosComplementarios();
    this.requestRelationship.obtenerPadresComplementarios(this.document);
    console.log('Documentos complementariosss: ', this.requestRelationship.documentosComplementarios);
  }

  leerTabs(){
    
  }

  obtenerCancelacion(){
    this.cancelacionTabs = new Cancelacion();
    this.cancelacionTabs.idDocumento = this.requestInformation.idDocumento;
    this.cancelacionTabs.numTipoCancelacion = this.requestInformation.item.numTipoCancelacion;
    this.cancelacionTabs.descripcionAlcance = this.requestInformation.item.descripcionAlcance;
    this.cancelacionTabs.descripcionProceso = this.requestInformation.item.descripcionProceso;
    this.cancelacionTabs.descripcionGerencia = this.requestInformation.item.descripcionGerencia;
    this.cancelacionTabs.numMotivoCancelacion = this.requestLivelihood.cancel.numMotivoCancelacion;
    this.cancelacionTabs.sustentoSolicitud = this.requestLivelihood.cancel.sustentoSolicitud;
    this.cancelacionTabs.nombreArchivoSustento = this.requestLivelihood.cancel.nombreArchivoSustento;
    this.cancelacionTabs.listaSolicitudesDocComp = this.requestRelationship.documentosComplementariosSolicitud;
    
    this.archivoSustento = this.requestLivelihood.archivoSustento;
  }

  enviarDatosCancelacion(solicitudCancelacion:Cancelacion){
    this.requestInformation.enviarDatosCancelacion(solicitudCancelacion);
    this.requestRelationship.enviarDatosCancelacion(solicitudCancelacion);
    this.requestLivelihood.enviarDatosCancelacion(solicitudCancelacion);
  }

}

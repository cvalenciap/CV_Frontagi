import { Component, ViewChild, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { EquipoUsuarioComponent } from 'src/app/modules/bandejadocumento/components/equipo-usuario.component';
import { CRegistroDocumentoComponent } from 'src/app/modules/bandejadocumento/components/components-registro-documento.component';
import { RevisionComponent } from 'src/app/modules/bandejadocumento/components/revision.component';
import { JsonService } from 'src/app/services';
import { ActivatedRoute } from '@angular/router';
import { Observable, forkJoin } from 'rxjs';
import { NOMBREPAGINA, ACCIONES } from 'src/app/constants/general/general.constants';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { Response, Documento, RevisionDocumento, ControlView } from 'src/app/models';
import { ParticipanteComponent } from 'src/app/modules/revisiondocumento/components/participante.component';
import { ElaboracionComponent } from 'src/app/modules/bandejadocumento/components/elaboracion.component';
import { ConsensoComponent } from 'src/app/modules/bandejadocumento/components/consenso.component';
import { AprobacionComponent } from 'src/app/modules/bandejadocumento/components/apobacion.component';
import { HomologacionComponent } from 'src/app/modules/bandejadocumento/components/homologacion.component';
import { ComplementarioComponent } from 'src/app/modules/bandejadocumento/components/complementario.component';
import { FaseRegistroComponent } from 'src/app/modules/bandejadocumento/components/fase-registro.component';
import { CriticaComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/critica.component';
import { SolicitudComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/solicitud.component';
import { BitacoraComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/bitacora.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { NgxSpinnerService } from 'ngx-spinner';

/**
 * @title Tab group animations
 */
/**
 * @title Tab group animations
 */
@Component({
  selector: 'tab-group-animations-copiaImpresa',
  templateUrl: 'tab-group-animations-copiaImpresa.html',
  styleUrls: ['tab-group-animations-copiaImpresa.scss'],
})
export class TabGroupAnimationsCopiaImpresa implements OnInit {
  @ViewChild('solicitud') solicitud: SolicitudComponent;
  @ViewChild('bitacora') bitacora: BitacoraComponent;
  @ViewChild('critica') critica: CriticaComponent;
  @Input() activar: boolean;
  @Input() param: number;
  @Output() estaSolicitud: EventEmitter<string> = new EventEmitter<string>();
  //@Output()  extrametododepadres: EventEmitter<any> =  new EventEmitter<any>();
  //@Input() activartab : boolean;
  itemCodigo: number;
  item: Documento;
  valor: boolean;
  permisos: any;
  varTemporal: boolean;
  nombrePagina: string;
  tipoAccion: string;
  controlview: ControlView;
  indicadorSolicitudRevision: string;
  listaNormas = [];
  listaMeses = [];
  idDocumento1: number;
  idSolicitud: number;
  idRevision: number;

  constructor(private _jsonService: JsonService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private service: BandejaDocumentoService) {    
    this.valor = true;
    this.varTemporal = true;     
    this.item = new Documento();
    this.controlview = new ControlView();
    this.indicadorSolicitudRevision = null;
    //this.pruebaHijo = this.equipo_usuario.prueba;
  }

  obtenerDataRutaPadre() {
    if (this.route.parent) {
      //this.route.parent.data.subscribe(params => {
      this.route.data.subscribe(params => {
        if (params['nArchivo']) {
          this.nombrePagina = params['nArchivo'];
          this.tipoAccion = params['accion'];
          //   this.cargarControlView(this.nombrePagina,this.tipoAccion);
        }

      });
    }
  }
  ngOnInit(): void {
    
    this.obtenerDataRutaPadre();
    this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
      this.bitacora.idDocumento = this.itemCodigo;
    });

    
    let idDocumento, idSolicitud, idRevision
    idDocumento = localStorage.getItem("iddocumento");
    idSolicitud = localStorage.getItem("idSolicitud");
    idRevision = localStorage.getItem("idRevision");
    this.idDocumento1 = idDocumento;
    this.idSolicitud = idSolicitud;
    this.idRevision = idRevision;
    if (this.idDocumento1) {
      this.spinner.show();
      this.service.buscarPorCodigoDocSoli(this.idDocumento1, this.idSolicitud, this.idRevision).subscribe((responseDocumento: Response) => {        
      this.mapearTabsParaTodos(responseDocumento.resultado)
      this.spinner.hide();
    });

    }
    
  }
  controlarError(error) {
    console.error(error);
    //this.loading = false;
    //this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  //Setear los campos en todas la pestañas 
  mapearTabsParaTodos(itemResponse) {
    this.spinner.show();
    
    let iddocumento, idsolicitud
    this.item = itemResponse;
    console.log(this.item);
    /*Obetenemos documento */
    this.solicitud.item = Object.assign(new RevisionDocumento(), this.item);
    iddocumento = this.solicitud.item.id;
    idsolicitud = this.solicitud.item.idususoli;
    this.solicitud.objDocumento.descripcion = this.item.descripcion;
    this.solicitud.objDocumento.codigo = this.item.codigo;
    
    this.solicitud.objDocumento.numeroderevision = this.item.revision.numero;
    this.solicitud.objDocumento.jgerencia.descripcion = this.item.jgerencia.descripcion;
    this.solicitud.objDocumento.jgerencia.id = this.item.jgerencia.idJerarquia;
    if (this.item.jalcanceSGI != null) {
      this.solicitud.objDocumento.jalcanceSGI.descripcion = this.item.jalcanceSGI.descripcion;
    }
    if (this.item.jproceso != null) {
      this.solicitud.objDocumento.jproceso.descripcion = this.item.jproceso.descripcion;
    }
    this.solicitud.objDocumento.fecha = new Date(this.item.revision.fecha);
    /* Comentario de la Critica*/
    this.critica.critica = this.item.criticaporDocumento.resumenCritica;
    /* Comentario de la Critica*/
    this.solicitud.tipoCopia = this.item.criticaporDocumento.numtipoestasoli;
    this.solicitud.idmotivo = this.item.criticaporDocumento.nmotivo;
    this.solicitud.sustento = this.item.criticaporDocumento.observa;
    this.solicitud.nestacopi = this.item.criticaporDocumento.nestcopi;
    this.estaSolicitud.next(this.solicitud.nestacopi);
    /* Capturamos el estado de la solicitud para deshabilitar el boton enviar*/
    let EstadoSolicitud = this.item.criticaporDocumento.nestcopi
    /* Setear pestaña bitacora */
    if (this.item.listaRevision != null) {
      this.bitacora.items = this.item.listaRevision;
    }    
    this.bitacora.items = this.item.listaRevision;
    /* llenar pestaña Solicitud */
    this.solicitud.OnBuscarDestinatario(iddocumento, this.idSolicitud);
    this.spinner.hide();
  }
  /* Buscar Destinatarios en Bitacora  */
  extrametododepadre(documento) {
    this.itemCodigo = documento.id;
    this.mapearTabsParaTodos(documento);
  }


}

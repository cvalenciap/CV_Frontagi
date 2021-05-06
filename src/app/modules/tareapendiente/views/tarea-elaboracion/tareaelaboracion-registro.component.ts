import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { validate } from 'class-validator';
//

import { FormatoCarga } from 'src/app/constants/general/general.constants';
import Swal from 'sweetalert2/dist/sweetalert2.js'
//
import { BandejaDocumentoService } from '../../../../services';
import { Tipo } from '../../../../models/tipo';
import { Estado } from '../../../../models/enums/estado';
import { BandejaDocumento } from '../../../../models/bandejadocumento';
import { Response } from '../../../../models/response';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { ESTADO_REVISION } from 'src/app/constants/general/general.constants';
//importamos  consulta de codigo anterior 
import { ConsultaCodigoAnteriorcomponents } from 'src/app/modules/bandejadocumento/modales/consulta-codigo-anterior.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Paginacion } from '../../../../models/paginacion';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { DatePipe } from '@angular/common';

import { RevisionDocumento, Documento, UploadResponse, DocumentoAdjunto } from 'src/app/models';
import { Arbol } from '../../../../models/arbol';
import { ID_FASE } from 'src/app/constants/general/general.constants';
import { environment } from 'src/environments/environment';
import { FileServerService } from 'src/app/services/impl/file-server.service';
import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { AppSettings } from 'src/app/app.settings';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Constante } from 'src/app/models/enums';
import { Parametro } from 'src/app/models/parametro';
import { Fase } from 'src/app/models/fase';
import { CorreoService } from 'src/app/services/impl/correo.service';
import { Correo } from 'src/app/models/correo';
import { forEach } from '@angular/router/src/utils/collection';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/auth/session.service';
import { take } from 'rxjs/internal/operators/take';

@Component({
    selector: 'tareaelaboracion-registro',
    templateUrl: 'tareaelaboracion-registro.template.html',
    styleUrls: ['tareaelaboracion-registro.component.scss']
})
export class TareaElaboracionRegistroComponent implements OnInit {
    @ViewChild('tab') tab: TabGroupAnimationsExample;

    @Input() variable: String;
    //
    @Input() parametroIdTipoDoc: number;
    @Input() item1: number;

    ///otro

    @ViewChild("fileRevision") fileRevision: ElementRef;
    nombreArchivoRevision: string;
    @Input()
    /*Modal Consulta Código Anterior*/
    parametroBusqueda: string;
    bsModalRef: BsModalRef;
    desactiva: boolean;
    fechaRechazo: Date;
    RutaOrigin:string;
    Prueba:string;
    fechaLibera:boolean;
    FechaRechazoAnterior: string;

    fechaRechazohijo: boolean;
    fileAdjunto: HTMLInputElement
    indicadorRespuesta: number;
    /* codigo seleccionado */
    itemCodigo: number;
    urlPDF: any
    /* id de documento google drive de registro seleccionado */
    idDocGoogleDrive: string;
    idRevision: string;
    nuevo: boolean;
    b: string;
    /* datos */
    listaTipos: Tipo[];
    item: Documento;
    activar: boolean;
    consulta: boolean;
    private sub: any;
    /* paginación */
    paginacion: Paginacion;
    items: Arbol[];
    loading: boolean;
    documento: Documento;
    docAnterior: string = '';
    mensajes: any[];
    cantidadRegFase: number;
    documentoAdjunto: DocumentoAdjunto;
    indicadorBloqueo: boolean;
    mensaje: String;
    idFase: number;
    errors: any;
    datosFase: any;
    itemElaboracion: EnvioParametros;
    listaDocAux: any[] = [];
    revisarDato: number;
    ocultarBotonConPregunta: boolean;
    ocultarBotonSinPregunta: boolean;
    ocultarBotonVerDocumentoAdjunt: boolean;
    ocultarBotonVerDocumentoAdjunt1: boolean;
    ocultarBotonVerDocumentoAdjuntotro:boolean;

    // @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private session: SessionService,
        private service: BandejaDocumentoService,
        private modalService: BsModalService,
        private datePipe: DatePipe,
        private spinner: NgxSpinnerService,
        private bandejaFileServerService: FileServerService,
        private servicioValidacion: ValidacionService,
        private serviceParametro: ParametrosService,
        private serviceCorreo: CorreoService,
        private revisionDocumentoService: RevisionDocumentoService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.parametroBusqueda = 'tipo';
        this.activar = false;
        this.consulta = true;
        this.paginacion = new Paginacion({ registros: 10 });
        this.items = [];
        this.loading = false;
        this.desactiva = false;
        this.indicadorBloqueo = true;
        this.revisarDato = 0;
        this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
            (response: Response) => {
                let resultado = response.resultado;
                this.idFase = this.serviceParametro.obtenerIdParametro(
                    resultado, Constante.ETAPA_RUTA_ELABORACION);
            },
            (error) => this.controlarError(error)
        );
    }

    ngOnInit() {
        this.datosFase = JSON.parse(sessionStorage.getItem("FaseDatos"));
        this.listaDocAux = JSON.parse(sessionStorage.getItem("tabDocumentos"));
        sessionStorage.setItem('retornoDatos', JSON.stringify(this.datosFase));
        sessionStorage.setItem('retornoLista', JSON.stringify(this.listaDocAux));
        this.documentoAdjunto = new DocumentoAdjunto();
        this.documentoAdjunto.nombreReal = '';
        this.docAnterior = null;
        this.documento = new Documento();
        this.itemElaboracion = JSON.parse(sessionStorage.getItem("item"));
        this.itemCodigo = this.itemElaboracion.parametroPrincipal;
        this.idRevision = this.itemElaboracion.parametroSecundario;
        this.idDocGoogleDrive = null;
        let nFichaLogueo = localStorage.getItem("codFichaLogueado");


        if (this.tab.padre != null) {
            this.sub = this.tab.padre.subscribe(parametro => {
                let fase = parametro;
                if (fase.indicadorBloqueo == 1 &&
                    fase.usuarioBloqueo != Number(nFichaLogueo)) {
                    this.indicadorBloqueo = false;
                    this.mensaje = "El documento está siendo modificado por el Usuario: " +
                        fase.nombreBloqueo;
                }
            });
        }
        /*this.service.buscarPorCodigo(this.itemCodigo).subscribe(
                 (response: Response) => {
                     this.item = response.resultado;
                     f(this.item..faseElaboracion.indicadorBloqueo==1 &&
                         this.faseElaboracion.usuarioBloqueo!=Number(AppSettings.USUARIO_LOGIN)) {
                 }
                 (error) => this.controlarError(error)
             );*/
        //} else {
        //this.item = this.service.crear();
        //this.item.tipo = this.listaTipos[0];
    }
    //Buscar del Modal Consulta por codigo anterior
    OnBuscar() {
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ConsultaCodigoAnteriorcomponents, config);
        (<ConsultaCodigoAnteriorcomponents>this.bsModalRef.content).onClose.subscribe(result => {
            //this.busquedaPlan = result;
            //this.OnBuscar();
        });
    }

    OnRegresar() {
        sessionStorage.removeItem("FaseDatos");
        sessionStorage.removeItem("tabDocumentos");
        sessionStorage.removeItem("datosFase");
        sessionStorage.removeItem("listaDocumentos");
        sessionStorage.removeItem("retornoLista");
        sessionStorage.removeItem("Fase");
        sessionStorage.removeItem("listDoc");
        sessionStorage.removeItem("retornoDatos");
        sessionStorage.removeItem("listaDocumentosDoc");
        sessionStorage.removeItem("revisionIdmotivo");
        sessionStorage.removeItem("revisionDescripcion");
        sessionStorage.removeItem("comboRevision");
        sessionStorage.removeItem("descripcionRevision");
        sessionStorage.removeItem("listEquipoReturn");
        sessionStorage.removeItem("listaEquipoAux");
        sessionStorage.removeItem("listElaboracion");
        sessionStorage.removeItem("listConseso");
        sessionStorage.removeItem("listAprobacion");
        sessionStorage.removeItem("listHomologacion");
        sessionStorage.removeItem("listaElaboracionAux");
        sessionStorage.removeItem("listaConsensoAux");
        sessionStorage.removeItem("listaAprobacionAux");
        sessionStorage.removeItem("listaHomologacionAux");

        this.router.navigate([`documento/tareapendiente/ElaborarRevision`]);
    }

    OnGuardar(file: HTMLInputElement) {
        sessionStorage.removeItem("FaseDatos");
        sessionStorage.removeItem("tabDocumentos");
        sessionStorage.removeItem("datosFase");
        sessionStorage.removeItem("listaDocumentos");
        sessionStorage.removeItem("retornoLista");
        sessionStorage.removeItem("Fase");
        sessionStorage.removeItem("listDoc");
        sessionStorage.removeItem("retornoDatos");
        sessionStorage.removeItem("listaDocumentosDoc");
        sessionStorage.removeItem("revisionIdmotivo");
        sessionStorage.removeItem("revisionDescripcion");
        sessionStorage.removeItem("comboRevision");
        sessionStorage.removeItem("descripcionRevision");
        sessionStorage.removeItem("listEquipoReturn");
        sessionStorage.removeItem("listaEquipoAux");
        sessionStorage.removeItem("listElaboracion");
        sessionStorage.removeItem("listConseso");
        sessionStorage.removeItem("listAprobacion");
        sessionStorage.removeItem("listHomologacion");
        sessionStorage.removeItem("listaElaboracionAux");
        sessionStorage.removeItem("listaConsensoAux");
        sessionStorage.removeItem("listaAprobacionAux");
        sessionStorage.removeItem("listaHomologacionAux");

        this.tab.general.errors = {};

        /*Datos de la pestaña: Informacion General*/
        let documento = this.tab.general.obtenerDatosFrom();

        /*Datos de la pestaña: Equipo Usuario*/
        documento.listaEquipo = this.tab.equipousuario.listaEquipo;

        /*Datos de la pestaña: Participantes*/
        //Elaboracion 
        documento.participanteElaboracion = this.tab.participantes.item.listaElaboracion;
        //Consenso
        documento.participanteConsenso = this.tab.concenso.item.listaConsenso;
        //Aprobacion
        documento.participanteAprobacion = this.tab.aprobacion.item.listaAprobacion;
        //Homologacion
        documento.participanteHomologacion = this.tab.homologacion.item.listaHomologacion;

        let objeto = documento.listaEquipo.find(equipo => equipo.indicadorResponsable == 1);
        if (objeto != null) documento.indicadorResponsable = 1;
        else documento.indicadorResponsable = 0;

        if (documento.participanteElaboracion != null) {
            let persona = documento.participanteElaboracion.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        if (documento.participanteConsenso != null && documento.indicadorParticipante == 0) {
            let persona = documento.participanteConsenso.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        if (documento.participanteAprobacion != null && documento.indicadorParticipante == 0) {
            let persona = documento.participanteAprobacion.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        if (documento.participanteHomologacion != null && documento.indicadorParticipante == 0) {
            let persona = documento.participanteHomologacion.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        /*Datos de la pestaña: Documento Relacionado*/
        let objetodocumento: Documento = new Documento();
        let listacomplen: Documento[] = this.tab.complementario.listaSeguimiento;
        let listacomplentariofinal: Documento[] = [];
        for (let i: number = 0; i < listacomplen.length; i++) {
            let responsableObj: Documento = listacomplen[i];
            let objetodocumento: Documento = new Documento();
            objetodocumento.id = responsableObj.id;
            objetodocumento.descripcion = responsableObj.descripcion;
            objetodocumento.tipo = responsableObj.tipo;
            objetodocumento.tipoComplementario = responsableObj.tipoComplementario;
            listacomplentariofinal.push(objetodocumento);
        }
        documento.listaComplementario = listacomplentariofinal;

        documento.listaComplementario = documento.listaComplementario.filter(x => x.tipoComplementario.v_descons != "Documentos que se complementan");

        /*Datos de la pestaña: Revisión*/
        this.tab.revision.errors = {};

        let listaRevisi: RevisionDocumento[] = [];
        listaRevisi = JSON.parse(sessionStorage.getItem("datosRevi"));

        documento.revision = this.tab.revision.revision;

        documento.revision = this.tab.revision.revision;
        if (documento.revision.descripcion == listaRevisi[listaRevisi.length - 1].descripcion &&
            documento.revision.idmotirevi == listaRevisi[listaRevisi.length - 1].idmotirevi) {
            this.revisarDato = 1;
        }

        if (documento.revision.descripcion == null && documento.revision.idmotirevi == null) {
            documento.revision.descripcion = listaRevisi[listaRevisi.length - 1].descripcion;
            documento.revision.idmotirevi = listaRevisi[listaRevisi.length - 1].idmotirevi;
        }

        localStorage.removeItem('datosRevi');
        /*Datos de la pestaña: Fase*/
        this.tab.bitacora.errors = {};
        documento.bitacora = new Fase();
        documento.bitacora.comentario = this.tab.bitacora.fase.comentario;
        documento.bitacora.idFase = this.idFase;
        documento.indicadorFase = Constante.INDICADOR_FASE_GUARDAR;//1


        forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
            
            this.mensajes = [];
            if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                if (this.revisarDato != 1) {
                    documento.revision.descripcion = "";
                    documento.revision.idmotirevi = 0;                    
                }                
                this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
                
                //} else if(file!=null){
            } else if (this.fileAdjunto != null) {
                /* Eliminar FileServe */
                  if (documento.rutaDocumento!=null && this.fileAdjunto.files.length>0){                      
                      this.tab.general.item.rutaDocumento=null;  
                      let a = null;
                      this.docAnterior = documento.rutaDocumento;
                      var lista: Array<string>;
                      lista = new Array<string>();
                      if(documento.rutaDocumento!=null && a!=this.docAnterior) {
                          lista.push(documento.rutaDocumento.replace(environment.serviceFileServerEndPoint+"/",""));
                          this.bandejaFileServerService.deleteFiles(lista).subscribe(
                              (response: Response) => {},
                              (error) => this.controlarError(error)
                          );
                      }
                  }

                /* Grabar Documento */
                
                if (this.fileAdjunto.files.length > 0) {
                    this.spinner.show()
                    this.service.modificarConAdjunto(documento, this.fileAdjunto).subscribe(
                        (response: Response) => {
                            this.spinner.hide()
                            this.item = response.resultado;
                            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                            this.router.navigate(['./documento/tareapendiente/ElaborarRevision']);
                        },
                        (error) => this.controlarError(error)
                    );
                } else {
                    this.spinner.show()
                    this.service.modificarsinAdjunto(documento).subscribe(
                        (response: Response) => {
                            this.spinner.hide()
                            this.item = response.resultado;
                            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                            this.OnRegresar();
                        },
                        (error) => this.controlarError(error)
                    );
                }

            } else {
                /* Grabar Documento */
                this.spinner.show()
                this.service.modificar(documento).subscribe(
                    (response: Response) => {
                        this.spinner.hide()
                        this.item = response.resultado;
                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                        this.OnRegresar();
                    },
                    (error) => this.controlarError(error)
                );
            }
        }); 
    }

    controlarError(error) {
        console.error(error);
        // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    selectFile() {
        this.fileRevision.nativeElement.click();

    }
    archivoCambio() {
        this.nombreArchivoRevision = this.fileRevision.nativeElement.value;
    }



    OnDocNvoGoogleDocs() {
        /*Datos de las Pestañas*/
        
        let valorFase = JSON.parse(sessionStorage.getItem("datosFase"));
        let documentos = JSON.parse(sessionStorage.getItem("listaDocumentos"));
        /*  sessionStorage.removeItem("datosFase");
         sessionStorage.removeItem("listaDocumentos"); */
        sessionStorage.setItem('Fase', JSON.stringify(valorFase));
        sessionStorage.setItem('listDoc', JSON.stringify(documentos));
        let documento = this.tab.general.obtenerDatosFrom();
        documento.revision = this.tab.revision.revision;

        let bitacora = new Fase();
        bitacora.idFase = this.idFase;
        bitacora.idDocumento = documento.id;
        bitacora.idRevision = documento.revision.id;
        bitacora.iteracion = documento.revision.iteracion;
        //bitacora.usuarioBloqueo = AppSettings.USUARIO_LOGIN;

        /* Bloquear Documento */
        this.service.bloquear(bitacora).subscribe(
            (response: Response) => {
                this.item = response.resultado;
                //this.toastr.success('Se ha bloqueado el acceso del documento','Acción completada!',{closeButton:true});
            },
            (error) => this.controlarError(error)
        );
        /*if (this.idDocGoogleDrive) {*/
        this.router.navigate(['documento/tareapendiente/NuevoDocGoogleDocs/' + this.idRevision + "/" + this.itemCodigo]);
        /*} else {
            this.router.navigate([`documento/tareapendiente/NuevoDocGoogleDocs/${this.idRevision}`]);
        }*/
    }
    //Adjuntar archivo
    OnAdjuntar(file: HTMLInputElement) {
        
        if (file.files[0].type != FormatoCarga.pdf) {
            this.toastr.warning('Solo se permite archivo PDF', 'Atención', { closeButton: true });
            this.fileAdjunto = null;
        } else{
            this.fileAdjunto = file;
        }
        var lista: Array<string>;
        lista = new Array<string>();
    }

    //validar si tiene ruta
    OnValidaRuta(Ruta: string, visorPdfSwal) {
        
        this.tab.general.errors = {};
        /*Datos de la pestaña: Informacion General*/
        let documento = this.tab.general.obtenerDatosFrom();

        let indicadorDigital = this.tab.general.indicadorDigital;

        let RutaDocumentoAdjunto = this.tab.general.item.revision.rutaDocumentoOriginal;

        if (RutaDocumentoAdjunto != null) {
            this.urlPDF = RutaDocumentoAdjunto;
            visorPdfSwal.show();
        } else {
            this.toastr.warning('No tiene ningún documento para mostrar.', 'Atención', { closeButton: true });
        }
    }


    OnAprobar(file: HTMLInputElement) {
        
        sessionStorage.removeItem("FaseDatos");
        sessionStorage.removeItem("tabDocumentos");
        sessionStorage.removeItem("datosFase");
        sessionStorage.removeItem("listaDocumentos");
        sessionStorage.removeItem("retornoLista");
        sessionStorage.removeItem("Fase");
        sessionStorage.removeItem("listDoc");
        sessionStorage.removeItem("retornoDatos");
        sessionStorage.removeItem("listaDocumentosDoc");
        sessionStorage.removeItem("revisionIdmotivo");
        sessionStorage.removeItem("revisionDescripcion");
        sessionStorage.removeItem("comboRevision");
        sessionStorage.removeItem("descripcionRevision");
        sessionStorage.removeItem("listEquipoReturn");
        sessionStorage.removeItem("listaEquipoAux");
        sessionStorage.removeItem("listElaboracion");
        sessionStorage.removeItem("listConseso");
        sessionStorage.removeItem("listAprobacion");
        sessionStorage.removeItem("listHomologacion");
        sessionStorage.removeItem("listaElaboracionAux");
        sessionStorage.removeItem("listaConsensoAux");
        sessionStorage.removeItem("listaAprobacionAux");
        sessionStorage.removeItem("listaHomologacionAux");
        
        this.tab.general.errors = {};
        /*Datos de la pestaña: Informacion General*/
        let documento = this.tab.general.obtenerDatosFrom();

        let indicadorDigital = this.tab.general.indicadorDigital;

        let RutaDocumentoAdjunto = this.tab.general.item.rutaDocumento;
        //        this.tab.general.item.fechaApro

        /*Datos de la pestaña: Equipo Usuario*/
        documento.listaEquipo = this.tab.equipousuario.listaEquipo;
        

        /*Datos de la pestaña: Participantes*/
        //Elaboracion
        documento.participanteElaboracion = this.tab.participantes.item.listaElaboracion;
        //Consenso
        documento.participanteConsenso = this.tab.concenso.item.listaConsenso;
        //Aprobacion
        documento.participanteAprobacion = this.tab.aprobacion.item.listaAprobacion;
        //Homologacion
        documento.participanteHomologacion = this.tab.homologacion.item.listaHomologacion;

        let objeto = documento.listaEquipo.find(equipo => equipo.indicadorResponsable == 1);
        if (objeto != null) documento.indicadorResponsable = 1;
        else documento.indicadorResponsable = 0;

        if (documento.participanteElaboracion != null) {
            let persona = documento.participanteElaboracion.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        if (documento.participanteConsenso != null && documento.indicadorParticipante == 0) {
            let persona = documento.participanteConsenso.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        if (documento.participanteAprobacion != null && documento.indicadorParticipante == 0) {
            let persona = documento.participanteAprobacion.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        if (documento.participanteHomologacion != null && documento.indicadorParticipante == 0) {
            let persona = documento.participanteHomologacion.find(obj => obj.estiloBloqueado);
            if (persona != null) documento.indicadorParticipante = 1;
            else documento.indicadorParticipante = 0;
        }

        /*Datos de la pestaña: Documento Relacionado*/
        let objetodocumento: Documento = new Documento();
        let listacomplen: Documento[] = this.tab.complementario.listaSeguimiento;
        let listacomplentariofinal: Documento[] = [];
        for (let i: number = 0; i < listacomplen.length; i++) {
            let responsableObj: Documento = listacomplen[i];
            let objetodocumento: Documento = new Documento();
            objetodocumento.id = responsableObj.id;
            objetodocumento.descripcion = responsableObj.descripcion;
            objetodocumento.tipo = responsableObj.tipo;
            objetodocumento.tipoComplementario = responsableObj.tipoComplementario;
            listacomplentariofinal.push(objetodocumento);
        }
        documento.listaComplementario = listacomplentariofinal;
        //Inicio Cambio Godar
        documento.listaComplementario = documento.listaComplementario.filter(x => x.tipoComplementario.v_descons != "Documentos que se complementan");
        //Fin Cambio

        /*Datos de la pestaña: Revisión*/
        this.tab.revision.errors = {};

        let listaRevisi: RevisionDocumento[] = [];
        listaRevisi = JSON.parse(sessionStorage.getItem("datosRevi"));


        documento.revision = this.tab.revision.revision;




        if (documento.revision.descripcion == listaRevisi[0].descripcion &&
            documento.revision.idmotirevi == listaRevisi[0].idmotirevi) {
            this.revisarDato = 1;
        }
            documento.revision.descripcion = listaRevisi[0].descripcion;
            documento.revision.idmotirevi = listaRevisi[0].idmotirevi;
        
        localStorage.removeItem('datosRevi');

        /*Datos de la pestaña: Fase*/
        this.tab.bitacora.errors = {};
        documento.bitacora = new Fase();

        // Indicador digital inicial 
        
        this.tab.bitacora.fase.lista;
        for (let i: number = 0; i < this.tab.bitacora.fase.lista.length; i++) {
            let res = this.tab.bitacora.fase.lista[i];
            this.fechaRechazo = res.fechaPlazo;
        }

        // Indicador Digital

        documento.bitacora.comentario = this.tab.bitacora.fase.comentario;
        documento.bitacora.idFase = this.idFase;
        documento.indicadorFase = Constante.INDICADOR_FASE_APROBAR;//2
        /*let clickBotonVerDocumento;
        clickBotonVerDocumento = localStorage.getItem("crearTipoDoc");*/
        let googleid = localStorage.getItem("idDocuGoogleDrive")

        //Inicio de todo   
        
        if (indicadorDigital != 1) {
            if (googleid) {
                forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
                    this.mensajes = [];
                    
                    if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) { 
                                               
                        if (this.revisarDato != 1) {
                            documento.revision.descripcion = "";
                            documento.revision.idmotirevi = 0;
                            //clickBotonVerDocumento = "";
                        }
                        this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
                    } else if (file != null) {
                        /* Eliminar FileServe */
                        if (documento.rutaDocumento != null && file.files.length > 0) {
                            let a = null;
                            this.docAnterior = documento.rutaDocumento;
                            var lista: Array<string>;
                            lista = new Array<string>();
                            if (documento.rutaDocumento != null && a != this.docAnterior) {
                                lista.push(documento.rutaDocumento.replace(environment.serviceFileServerEndPoint + "/", ""));
                                this.bandejaFileServerService.deleteFiles(lista).subscribe(
                                    (response: Response) => { },
                                    (error) => this.controlarError(error)
                                );
                            }
                        }

                        /* Grabar Documento */
                        if (file.files.length > 0) {
                            this.spinner.show()
                            this.service.modificarConAdjunto(documento, file).subscribe(
                                (response: Response) => {
                                    this.spinner.hide()
                                    this.item = response.resultado;
                                    localStorage.removeItem("objetoRetornoBusquedaElaboracion");
                                    //Enviar Correo - Plazo de Atencion
                                    this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                        Constante.CORREO_PLAZO_ATENCION).subscribe(
                                        (response: Response) => {
                                            const lista: Correo[] = response.resultado;
                                            lista.forEach(correo => {
                                                if (correo.correoCabecera.correoDestino.length > 0) {
                                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                        (response: Response) => { },
                                                        (error) => {
                                                            this.controlarError(error);
                                                        }
                                                    );
                                                }
                                            });
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    //Enviar Correo - Aprobado
                                    this.serviceCorreo.obtenerCorreo(documento.id, null,
                                        Constante.CORREO_APROBACION).subscribe(
                                        (response: Response) => {
                                            const correo: Correo = response.resultado;
                                            if (correo.correoCabecera.correoDestino.length > 0) {
                                                this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                    (response: Response) => { },
                                                    (error) => {
                                                        this.controlarError(error);
                                                    }
                                                );
                                            }
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                    this.router.navigate(['./documento/tareapendiente/ElaborarRevision']);
                                },
                                (error) => this.controlarError(error)
                            );
                        } else {
                            this.spinner.show()
                            this.service.modificar(documento).subscribe(
                                (response: Response) => {
                                    this.spinner.hide()
                                    localStorage.removeItem("objetoRetornoBusquedaElaboracion");
                                    this.item = response.resultado;

                                    //Enviar Correo - Plazo de Atencion
                                    this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                        Constante.CORREO_PLAZO_ATENCION).subscribe(
                                        (response: Response) => {
                                            const lista: Correo[] = response.resultado;
                                            lista.forEach(correo => {
                                                if (correo.correoCabecera.correoDestino.length > 0) {
                                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                        (response: Response) => { },
                                                        (error) => {
                                                            this.controlarError(error);
                                                        }
                                                    );
                                                }
                                            });
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    //Enviar Correo - Aprobado
                                    this.serviceCorreo.obtenerCorreo(documento.id, null,
                                        Constante.CORREO_APROBACION).subscribe(
                                        (response: Response) => {
                                            const correo: Correo = response.resultado;
                                            if (correo.correoCabecera.correoDestino.length > 0) {
                                                this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                    (response: Response) => { },
                                                    (error) => {
                                                        this.controlarError(error);
                                                    }
                                                );
                                            }
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    if (this.item.indicadorAprobado == null) this.item.indicadorAprobado = "0";
                                    if (this.item.indicadorAprobado == "1") {
                                        this.OnExportar();
                                    } else {
                                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                    }
                                    this.OnRegresar();
                                },
                                (error) => this.controlarError(error)
                            );
                        }

                    } else {
                        /* Grabar Documento */
                        this.spinner.show()
                        this.service.modificar(documento).subscribe(
                            (response: Response) => {
                                this.spinner.hide()
                                this.item = response.resultado;
                                localStorage.removeItem("objetoRetornoBusquedaElaboracion");
                                //Enviar Correo - Plazo de Atencion
                                this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                    Constante.CORREO_PLAZO_ATENCION).subscribe(
                                    (response: Response) => {
                                        const lista: Correo[] = response.resultado;
                                        lista.forEach(correo => {
                                            if (correo.correoCabecera.correoDestino.length > 0) {
                                                this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                    (response: Response) => { },
                                                    (error) => {
                                                        this.controlarError(error);
                                                    }
                                                );
                                            }
                                        });
                                    },
                                    (error) => {
                                        this.controlarError(error);
                                    }
                                    );

                                //Enviar Correo - Aprobado
                                this.serviceCorreo.obtenerCorreo(documento.id, null,
                                    Constante.CORREO_APROBACION).subscribe(
                                    (response: Response) => {
                                        const correo: Correo = response.resultado;
                                        if (correo.correoCabecera.correoDestino.length > 0) {
                                            this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                (response: Response) => { },
                                                (error) => {
                                                    this.controlarError(error);
                                                }
                                            );
                                        }
                                    },
                                    (error) => {
                                        this.controlarError(error);
                                    }
                                    );

                                if (this.item.indicadorAprobado == null) this.item.indicadorAprobado = "0";
                                if (this.item.indicadorAprobado == "1") {
                                    this.OnExportar();
                                } else {
                                    this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                }
                                this.OnRegresar();
                            },
                            (error) => this.controlarError(error)
                        );
                    }


                });
                //cguerra
            } else {
                this.toastr.warning('Debe crear un documento "Google Drive"', 'Validación', { closeButton: true });
                return;
            }
            //indicador Digital
        } else {

            
            //si viene la ruta no es necesario el adjunto
            if (RutaDocumentoAdjunto != null) {
                //validacion con la fecha de rechazo de la bitacora(fase)
                if (this.fechaRechazo != null && this.fileAdjunto != null) {
                    forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
                        this.mensajes = [];
                        if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                            if (this.revisarDato != 1) {
                                documento.revision.descripcion = "";
                                documento.revision.idmotirevi = 0;
                                //clickBotonVerDocumento = "";
                            }
                            this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
                        } else {
                            this.spinner.show()
                            this.service.modificarConAdjunto(documento, this.fileAdjunto).subscribe(
                                (response: Response) => {
                                    this.spinner.hide()
                                    this.item = response.resultado;
                                    localStorage.removeItem("objetoRetornoBusquedaElaboracion");
                                    //Enviar Correo - Plazo de Atencion
                                    this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                        Constante.CORREO_PLAZO_ATENCION).subscribe(
                                        (response: Response) => {
                                            const lista: Correo[] = response.resultado;
                                            lista.forEach(correo => {
                                                if (correo.correoCabecera.correoDestino.length > 0) {
                                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                        (response: Response) => { },
                                                        (error) => {
                                                            this.controlarError(error);
                                                        }
                                                    );
                                                }
                                            });
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    //Enviar Correo - Aprobado
                                    this.serviceCorreo.obtenerCorreo(documento.id, null,
                                        Constante.CORREO_APROBACION).subscribe(
                                        (response: Response) => {
                                            const correo: Correo = response.resultado;
                                            if (correo.correoCabecera.correoDestino.length > 0) {
                                                this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                    (response: Response) => { },
                                                    (error) => {
                                                        this.controlarError(error);
                                                    }
                                                );
                                            }
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                    this.router.navigate(['./documento/tareapendiente/ElaborarRevision']);
                                },
                                (error) => this.controlarError(error)
                            );
                        }
                    });



                    /************** */
                } else {

                    forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
                        this.mensajes = [];
                        if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                            if (this.revisarDato != 1) {
                                documento.revision.descripcion = "";
                                documento.revision.idmotirevi = 0;
                                //clickBotonVerDocumento = "";
                            }
                            this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
                        } else {
                            this.spinner.show()
                            this.service.modificarsinAdjunto(documento).subscribe(
                                (response: Response) => {
                                    this.spinner.hide()
                                    this.item = response.resultado;
                                    localStorage.removeItem("objetoRetornoBusquedaElaboracion");
                                    //Enviar Correo - Plazo de Atencion
                                    this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                        Constante.CORREO_PLAZO_ATENCION).subscribe(
                                        (response: Response) => {
                                            const lista: Correo[] = response.resultado;
                                            lista.forEach(correo => {
                                                if (correo.correoCabecera.correoDestino.length > 0) {
                                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                        (response: Response) => { },
                                                        (error) => {
                                                            this.controlarError(error);
                                                        }
                                                    );
                                                }
                                            });
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    //Enviar Correo - Aprobado
                                    this.serviceCorreo.obtenerCorreo(documento.id, null,
                                        Constante.CORREO_APROBACION).subscribe(
                                        (response: Response) => {
                                            const correo: Correo = response.resultado;
                                            if (correo.correoCabecera.correoDestino.length > 0) {
                                                this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                    (response: Response) => { },
                                                    (error) => {
                                                        this.controlarError(error);
                                                    }
                                                );
                                            }
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                    this.router.navigate(['./documento/tareapendiente/ElaborarRevision']);
                                },
                                (error) => this.controlarError(error)
                            );
                        }
                    });

                    /************** */
                }

            } else {
                //con adjunto
                
                if (this.fileAdjunto != null) {
                    forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
                        this.mensajes = [];
                        if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                            if (this.revisarDato != 1) {
                                documento.revision.descripcion = "";
                                documento.revision.idmotirevi = 0;
                                //clickBotonVerDocumento = "";
                            }
                            this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
                        } else if (this.fileAdjunto != null) {
                            /* Eliminar FileServe */
                            if (documento.rutaDocumento != null && this.fileAdjunto.files.length > 0) {
                                let a = null;
                                this.docAnterior = documento.rutaDocumento;
                                var lista: Array<string>;
                                lista = new Array<string>();
                                if (documento.rutaDocumento != null && a != this.docAnterior) {
                                    lista.push(documento.rutaDocumento.replace(environment.serviceFileServerEndPoint + "/", ""));
                                    this.bandejaFileServerService.deleteFiles(lista).subscribe(
                                        (response: Response) => { },
                                        (error) => this.controlarError(error)
                                    );
                                }
                            }
                            /* Grabar Documento */
                            if (this.fileAdjunto.files.length > 0) {
                                
                                this.spinner.show()
                                this.service.modificarConAdjunto(documento, this.fileAdjunto).subscribe(
                                    (response: Response) => {
                                        this.spinner.hide()
                                        this.item = response.resultado;
                                        localStorage.removeItem("objetoRetornoBusquedaElaboracion");
                                        //Enviar Correo - Plazo de Atencion
                                        this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                            Constante.CORREO_PLAZO_ATENCION).subscribe(
                                            (response: Response) => {
                                                const lista: Correo[] = response.resultado;
                                                lista.forEach(correo => {
                                                    if (correo.correoCabecera.correoDestino.length > 0) {
                                                        this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                            (response: Response) => { },
                                                            (error) => {
                                                                this.controlarError(error);
                                                            }
                                                        );
                                                    }
                                                });
                                            },
                                            (error) => {
                                                this.controlarError(error);
                                            }
                                            );

                                        //Enviar Correo - Aprobado
                                        this.serviceCorreo.obtenerCorreo(documento.id, null,
                                            Constante.CORREO_APROBACION).subscribe(
                                            (response: Response) => {
                                                const correo: Correo = response.resultado;
                                                if (correo.correoCabecera.correoDestino.length > 0) {
                                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                        (response: Response) => { },
                                                        (error) => {
                                                            this.controlarError(error);
                                                        }
                                                    );
                                                }
                                            },
                                            (error) => {
                                                this.controlarError(error);
                                            }
                                            );

                                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                        this.router.navigate(['./documento/tareapendiente/ElaborarRevision']);
                                    },
                                    (error) => this.controlarError(error)
                                );
                            } else {
                                this.spinner.show()
                                this.service.modificar(documento).subscribe(
                                    (response: Response) => {
                                        this.spinner.hide()
                                        this.item = response.resultado;
                                        localStorage.removeItem("objetoRetornoBusquedaElaboracion");

                                        //Enviar Correo - Plazo de Atencion
                                        this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                            Constante.CORREO_PLAZO_ATENCION).subscribe(
                                            (response: Response) => {
                                                const lista: Correo[] = response.resultado;
                                                lista.forEach(correo => {
                                                    if (correo.correoCabecera.correoDestino.length > 0) {
                                                        this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                            (response: Response) => { },
                                                            (error) => {
                                                                this.controlarError(error);
                                                            }
                                                        );
                                                    }
                                                });
                                            },
                                            (error) => {
                                                this.controlarError(error);
                                            }
                                            );

                                        //Enviar Correo - Aprobado
                                        this.serviceCorreo.obtenerCorreo(documento.id, null,
                                            Constante.CORREO_APROBACION).subscribe(
                                            (response: Response) => {
                                                const correo: Correo = response.resultado;
                                                if (correo.correoCabecera.correoDestino.length > 0) {
                                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                        (response: Response) => { },
                                                        (error) => {
                                                            this.controlarError(error);
                                                        }
                                                    );
                                                }
                                            },
                                            (error) => {
                                                this.controlarError(error);
                                            }
                                            );
                                        if (this.item.indicadorAprobado == null) this.item.indicadorAprobado = "0";
                                        if (this.item.indicadorAprobado == "1") {
                                            this.OnExportar();
                                        } else {
                                            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                        }
                                        this.OnRegresar();
                                    },
                                    (error) => this.controlarError(error)
                                );
                            }

                        } else {
                            /* Grabar Documento */
                            this.spinner.show()
                            /////////////////
                            this.service.modificar(documento).subscribe(
                                (response: Response) => {
                                    this.spinner.hide()
                                    this.item = response.resultado;
                                    localStorage.removeItem("objetoRetornoBusquedaElaboracion");
                                    //Enviar Correo - Plazo de Atencion
                                    this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                        Constante.CORREO_PLAZO_ATENCION).subscribe(
                                        (response: Response) => {
                                            const lista: Correo[] = response.resultado;
                                            lista.forEach(correo => {
                                                if (correo.correoCabecera.correoDestino.length > 0) {
                                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                        (response: Response) => { },
                                                        (error) => {
                                                            this.controlarError(error);
                                                        }
                                                    );
                                                }
                                            });
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    //Enviar Correo - Aprobado
                                    this.serviceCorreo.obtenerCorreo(documento.id, null,
                                        Constante.CORREO_APROBACION).subscribe(
                                        (response: Response) => {
                                            const correo: Correo = response.resultado;
                                            if (correo.correoCabecera.correoDestino.length > 0) {
                                                this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                    (response: Response) => { },
                                                    (error) => {
                                                        this.controlarError(error);
                                                    }
                                                );
                                            }
                                        },
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                        );

                                    if (this.item.indicadorAprobado == null) this.item.indicadorAprobado = "0";
                                    if (this.item.indicadorAprobado == "1") {
                                        this.OnExportar();
                                    } else {
                                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                    }
                                    this.OnRegresar();
                                },
                                (error) => this.controlarError(error)
                            );
                        }


                    });

                } else {
                    this.toastr.warning('Debe adjuntar un archivo PDF', 'Validación:', { closeButton: true });
                }
            }

        }
        //cguerra

    }

    OnExportar() {
        let idDocGoogle: string = localStorage.getItem("idDocuGoogleDrive");
        let revision: RevisionDocumento = new RevisionDocumento();
        revision.id = +this.idRevision;
        revision.idDocGoogleDrive = idDocGoogle;
        revision.documento = new Documento();
        revision.documento.id = this.itemCodigo;
        this.spinner.show()
        this.revisionDocumentoService.guardarDocumentoRevision(revision).subscribe(
            (response: Response) => {
                this.spinner.hide()
                this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
            }
        );
    }


    OnWord() {
        Swal.close()
        localStorage.setItem("crearTipoDoc", "crearDocWord");
        this.OnDocNvoGoogleDocs();
    }

    OnExcel() {
        Swal.close()
        localStorage.setItem("crearTipoDoc", "crearDocExcel");
        this.OnDocNvoGoogleDocs();
    }
    //cguerra
    OnOtrosBotones() {
        let timerInterval
        Swal.fire({
            title: "¿Iniciar con Word o Excel?",

            html:
                "<br>" +
                '<button type="button"  id="word" class="btn m-r btn-success">' + 'WORD' + '</button>' +
                '<button type="button" id="excel" role="button" tabindex="0" class="btn m-r btn-primary">' + 'EXCEL' + '</button>' +
                '<button type="button" id="cancel" role="button" tabindex="0" class="btn m-r ">' + 'Cancelar' + '</button>',

            onBeforeOpen: () => {
                const content = Swal.getContent()
                const $ = content.querySelector.bind(content)
                const word = $('#word')
                const excel = $('#excel')
                const cancel = $('#cancel')

                Swal.showLoading()
                function toggleButtons() {
                    excel.disabled = !Swal.isTimerRunning()
                    cancel.disabled = Swal.isTimerRunning()
                }
                excel.addEventListener('click', () => {
                    this.OnExcel();
                })
                cancel.addEventListener('click', () => {
                    Swal.close()
                })
                word.addEventListener('click', () => {
                    this.OnWord();
                })
            }
        })
    }
    //cguerra

    OnValidarFechaRechazo(item: string) {
                
        this.Prueba=item;
        if (item != "null") {
            //Muestra adjunto
            this.fechaRechazohijo = true;   
            //ocultamos el primero boton 
            this.ocultarBotonVerDocumentoAdjunt1=false;           
        } else {
            //No Muestra adjunto
            this.fechaRechazohijo = false; 
            //Mostramos el primero boton
            this.ocultarBotonVerDocumentoAdjunt1=true;           
        }
    }

OnCantidadFase(item: number){
    
    this.cantidadRegFase =  item;
}

    OnFechadeLiberacion(item: string) {
                
         if (item != "null") {
            //Muestra adjunto
            this.fechaLibera = true;  
            //muestra tecer boton
            this.ocultarBotonVerDocumentoAdjunt=false;
            //ocultamos el primero boton 
            this.ocultarBotonVerDocumentoAdjunt1=false;          
        } else {
            //No Muestra adjunto
            this.fechaLibera = false;            
            //Mostramos el primero boton
            this.ocultarBotonVerDocumentoAdjunt1=true;  
        }
            //si tiene ruta no mostramos el boton 1 para maximo
            if(this.RutaOrigin!=null){
                if(this.cantidadRegFase>0){
                    this.ocultarBotonVerDocumentoAdjunt1=false;                   
                }
            }
       /************************Validamos Rechazo luego guardar */
         if(this.RutaOrigin!=null){
                if(this.cantidadRegFase>0){
                    if(this.FechaRechazoAnterior!="null" && this.FechaRechazoAnterior!=undefined){
                        if(item=="null"){
                            this.ocultarBotonVerDocumentoAdjunt1=false;                             
                            this.ocultarBotonVerDocumentoAdjuntotro=true; 
                        }
                    }                                      
                }
            }
    }
OnFechaRechazoAnterior(FechaRechazoAnterior:string){
    this.FechaRechazoAnterior = FechaRechazoAnterior;
}

OnRutaOrigin(RutaOrigen: string){
    
    this.RutaOrigin = RutaOrigen;
}

    OnIndicadorDigital(indicador: number) {
        
        this.indicadorRespuesta = indicador;
        let existeDoc = localStorage.getItem("idDocuGoogleDrive")
        //tiene google drive
        if (indicador != 1) {
            if (existeDoc) {
                //Muestra boton  ocultarBotonConPregunta
                this.ocultarBotonSinPregunta = true;
                this.ocultarBotonConPregunta = false;
                this.ocultarBotonVerDocumentoAdjunt = false;
                this.ocultarBotonVerDocumentoAdjunt1 = false;
                this.ocultarBotonVerDocumentoAdjuntotro=false; 
                this.fechaRechazohijo = false;
            } else {
                //Muestra boton  ocultarBotonSinPregunta
                this.ocultarBotonConPregunta = true;
                this.ocultarBotonSinPregunta = false;
                this.ocultarBotonVerDocumentoAdjunt = false;
                this.ocultarBotonVerDocumentoAdjunt1 = false;
                this.ocultarBotonVerDocumentoAdjuntotro=false; 
                this.fechaRechazohijo = false;
            }
        } else {
            //Si tiene Indicador Digital
            this.ocultarBotonConPregunta = false;
            this.ocultarBotonSinPregunta = false;
            /***********************************************/
            //Primer Caso Muestra el Primer Boton  
            //validamos ruta vacia y indicador con valor 1 
            if(this.RutaOrigin){
                if(indicador==1){
                    this.ocultarBotonVerDocumentoAdjunt1=true; 
                    this.fechaRechazohijo=false;
                    }
            }
            
           

            
        }

    }

}
import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { validate } from 'class-validator';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { BandejaDocumentoService, ParametrosService, ValidacionService, CorreoService } from '../../../../services';
//import {Tipo} from '../../../../models/tipo';
import { Estado } from '../../../../models/enums/estado';
import { BandejaDocumento } from '../../../../models/bandejadocumento';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
//importamos  consulta de codigo anterior 
import { ConsultaCodigoAnteriorcomponents } from 'src/app/modules/bandejadocumento/modales/consulta-codigo-anterior.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Constante } from 'src/app/models/enums/constante';
import { AppSettings } from 'src/app/app.settings';
import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { Fase } from 'src/app/models/fase';
import { Documento, RevisionDocumento } from 'src/app/models';
import { Correo } from 'src/app/models/correo';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/auth/session.service';

@Component({
    selector: 'tareaconsenso-registro',
    templateUrl: 'tareaconsenso-registro.template.html',
    styleUrls: ['tareaconsenso-registro.component.scss']
})
export class TareaConsensoRegistroComponent implements OnInit {
    @ViewChild('tab') tab: TabGroupAnimationsExample;
    @ViewChild("fileRevision") fileRevision: ElementRef;
    nombreArchivoRevision: string;

    @Input()
    /*Modal Consulta Código Anterior*/
    parametroBusqueda: string;
    bsModalRef: BsModalRef;
    /* codigo seleccionado */
    itemCodigo: number;
    /* datos */
    //listaTipos: Tipo[];
    item: BandejaDocumento;
    activar: boolean;
    urlPDF: any;
    consulta: boolean;
    private sub: any;
    idRevision: string;
    idDocGoogleDrive: string;

    /* paginación */
    paginacion: Paginacion;
    mensajes: any[];
    indicadorBloqueo: boolean;
    mensaje: string;
    idFase: number;
    datosFase: any;
    listaDocAux: any;
    itemConsenso: EnvioParametros;
    revisarDato: number;

    // @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        public session: SessionService,
        private route: ActivatedRoute,
        private spinner: NgxSpinnerService,
        private service: BandejaDocumentoService,
        private servicioValidacion: ValidacionService,
        private serviceParametro: ParametrosService,
        private serviceCorreo: CorreoService,
        private modalService: BsModalService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.parametroBusqueda = 'tipo';
        this.paginacion = new Paginacion({ registros: 10 });
        this.activar = false;
        this.consulta = true;
        this.revisarDato = 0;
        this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
            (response: Response) => {
                let resultado = response.resultado;
                this.idFase = this.serviceParametro.obtenerIdParametro(
                    resultado, Constante.ETAPA_RUTA_CONSENSO);
            },
            (error) => this.controlarError(error)
        );
    }
    ngOnInit() {
        
        this.datosFase = JSON.parse(sessionStorage.getItem("FaseDatos"));
        this.listaDocAux = JSON.parse(sessionStorage.getItem("tabDocumentos"));

        sessionStorage.setItem('retornoDatos', JSON.stringify(this.datosFase));
        sessionStorage.setItem('retornoLista', JSON.stringify(this.listaDocAux));

        this.itemConsenso = JSON.parse(sessionStorage.getItem("item"));
        this.itemCodigo = this.itemConsenso.parametroPrincipal;
        this.idRevision = this.itemConsenso.parametroSecundario;
        this.idDocGoogleDrive = null;


        if (this.tab.padre != null) {
            this.sub = this.tab.padre.subscribe(parametro => {
                let fase = parametro;
                if (fase.indicadorBloqueo == 1 &&
                    fase.usuarioBloqueo != Number(AppSettings.USUARIO_LOGIN)) {
                    this.indicadorBloqueo = false;
                    this.mensaje = "El documento está siendo modificado por el Usuario: " +
                        fase.nombreBloqueo;
                }
            });
        }
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
        this.router.navigate([`documento/tareapendiente/ConsensuarRevision`]);
    }
    controlarError(error) {
        console.error(error);
    }

    selectFile() {
        this.fileRevision.nativeElement.click();

    }
    archivoCambio() {
        this.nombreArchivoRevision = this.fileRevision.nativeElement.value;
    }

    OnDocNvoGoogleDocs() {
        
        let valorFase = JSON.parse(sessionStorage.getItem("datosFase"));
        let documentos = JSON.parse(sessionStorage.getItem("listaDocumentos"));
        sessionStorage.setItem('Fase', JSON.stringify(valorFase));
        sessionStorage.setItem('listDoc', JSON.stringify(documentos));
        let documento = this.tab.general.obtenerDatosFrom();
        documento.revision = this.tab.revision.revision;
        let bitacora = new Fase();
        bitacora.idFase = this.idFase;
        bitacora.idDocumento = documento.id;
        bitacora.idRevision = documento.revision.id;
        bitacora.iteracion = documento.revision.iteracion;
        bitacora.usuarioBloqueo = AppSettings.USUARIO_LOGIN;

        /* Bloquear Documento */
        this.service.bloquear(bitacora).subscribe(
            (response: Response) => {
                this.item = response.resultado;
                //this.toastr.success('Se ha bloqueado el acceso del documento','Acción completada!',{closeButton:true});
            },
            (error) => this.controlarError(error)
        );

        this.router.navigate([`documento/tareapendiente/NuevoDocGoogleDocsConsenso/${this.idRevision}/${this.itemCodigo}`]);
    }

    OnGuardar() {

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

        /*Datos de la pestaña: Revisión*/
        this.tab.revision.errors = {};
        
        let listaRevisi: RevisionDocumento[] = [];
        listaRevisi = JSON.parse(sessionStorage.getItem("datosRevi"));

        documento.revision = this.tab.revision.revision;
        if (documento.revision.descripcion == listaRevisi[listaRevisi.length - 1].descripcion &&
            documento.revision.idmotirevi == listaRevisi[listaRevisi.length - 1].idmotirevi) {
            this.revisarDato = 1;
        }

        documento.revision.descripcion = listaRevisi[listaRevisi.length - 1].descripcion;
        documento.revision.idmotirevi = listaRevisi[listaRevisi.length - 1].idmotirevi;

        localStorage.removeItem('datosRevi');

        /*Datos de la pestaña: Fase*/
        this.tab.bitacora.errors = {};
        documento.bitacora = new Fase();
        documento.bitacora.comentario = this.tab.bitacora.fase.comentario;
        documento.bitacora.idFase = this.idFase;
        documento.indicadorFase = Constante.INDICADOR_FASE_GUARDAR;
        //Inicio Cambio Godar
        documento.listaComplementario = documento.listaComplementario.filter(x => x.tipoComplementario.v_descons != "Documentos que se complementan");
        //Fin Cambio

        forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
            this.mensajes = [];
            if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                if (this.revisarDato != 1) {
                    documento.revision.descripcion = "";
                    documento.revision.idmotirevi = 0;
                }
                this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
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

    OnAprobar() {
        
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
        let objeto = documento.listaEquipo.find(equipo => equipo.indicadorResponsable == 1); if (objeto != null) documento.indicadorResponsable = 1;
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
        //Fin cambio

        /*Datos de la pestaña: Revisión*/
        this.tab.revision.errors = {};

        let listaRevisi: RevisionDocumento[] = [];
        listaRevisi = JSON.parse(sessionStorage.getItem("datosRevi"));

        documento.revision = this.tab.revision.revision;

        if (documento.revision.descripcion == listaRevisi[listaRevisi.length - 1].descripcion &&
            documento.revision.idmotirevi == listaRevisi[listaRevisi.length - 1].idmotirevi) {
            this.revisarDato = 1;
        }

        documento.revision.descripcion = listaRevisi[listaRevisi.length - 1].descripcion;
        documento.revision.idmotirevi = listaRevisi[listaRevisi.length - 1].idmotirevi;
        localStorage.removeItem('datosRevi');

        /*Datos de la pestaña: Fase*/
        this.tab.bitacora.errors = {};
        documento.bitacora = new Fase();
        documento.bitacora.comentario = this.tab.bitacora.fase.comentario;
        documento.bitacora.idFase = this.idFase;
        documento.indicadorFase = Constante.INDICADOR_FASE_APROBAR;
        
        //
        let indicadorDigital = this.tab.general.indicadorDigital;
        //

        if (indicadorDigital != 1) {
            //Guarda Documento Google Drive
            forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
                this.mensajes = [];
                if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                    if (this.revisarDato != 1) {
                        documento.revision.descripcion = "";
                        documento.revision.idmotirevi = 0;
                    }
                    this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
                } else {
                    /* Grabar Documento */
                    this.spinner.show()
                    this.service.modificar(documento).subscribe(
                        (response: Response) => {
                            this.spinner.hide()
                            this.item = response.resultado;
                            localStorage.removeItem("objetoRetornoBusqueda");  
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
                            this.OnRegresar();
                        },
                        (error) => this.controlarError(error)
                    );
                }
            });
        } else {
            //Guarda documento Digital
            forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
                this.mensajes = [];
                if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                    if (this.revisarDato != 1) {
                        documento.revision.descripcion = "";
                        documento.revision.idmotirevi = 0;
                    }
                    this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
                } else {
                    /* Grabar Documento */
                    this.spinner.show()
                    this.service.modificarsinAdjunto(documento).subscribe(
                        (response: Response) => {
                            this.spinner.hide()
                            this.item = response.resultado;
                            localStorage.removeItem("objetoRetornoBusqueda");  
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
                            this.OnRegresar();
                        },
                        (error) => this.controlarError(error)
                    );
                }
            });
        }
    }





                         /*   );


                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                        this.OnRegresar();
                    },
                    (error) => this.controlarError(error)
                );
            }
        });

    }*/

    OnRechazar() {
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
        //Fin cambio

        /*Datos de la pestaña: Revisión*/
        this.tab.revision.errors = {};

        let listaRevisi: RevisionDocumento[] = [];
        listaRevisi = JSON.parse(sessionStorage.getItem("datosRevi"));

        documento.revision = this.tab.revision.revision;
        if (documento.revision.descripcion == listaRevisi[listaRevisi.length - 1].descripcion &&
            documento.revision.idmotirevi == listaRevisi[listaRevisi.length - 1].idmotirevi) {
            this.revisarDato = 1;
        }

        documento.revision.descripcion = listaRevisi[listaRevisi.length - 1].descripcion;
        documento.revision.idmotirevi = listaRevisi[listaRevisi.length - 1].idmotirevi;
        localStorage.removeItem('datosRevi');
        /*Datos de la pestaña: Fase*/
        this.tab.bitacora.errors = {};
        documento.bitacora = new Fase();
        documento.bitacora.comentario = this.tab.bitacora.fase.comentario;
        documento.bitacora.idFase = this.idFase;
        documento.indicadorFase = Constante.INDICADOR_FASE_RECHAZAR;
        forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
            this.mensajes = [];
            if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                if (this.revisarDato != 1) {
                    documento.revision.descripcion = "";
                    documento.revision.idmotirevi = 0;
                }
                this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
            } else {
                /* Grabar Documento */
                this.spinner.show()
                this.service.modificar(documento).subscribe(
                    (response: Response) => {
                        this.spinner.hide()
                        this.item = response.resultado;
                        localStorage.removeItem("objetoRetornoBusqueda");  
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
                            });
                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                        this.OnRegresar();
                    },
                    (error) => this.controlarError(error)
                );
            }
        });
    }
}
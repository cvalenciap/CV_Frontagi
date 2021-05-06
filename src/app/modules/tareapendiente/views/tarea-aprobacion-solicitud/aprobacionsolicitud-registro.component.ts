import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Tipo } from '../../../../models/tipo';
import { Estado } from '../../../../models/enums/estado';
import { Response } from '../../../../models/response';
//importamos  consulta de codigo anterior
import { ConsultaCodigoAnteriorcomponents } from 'src/app/modules/bandejadocumento/modales/consulta-codigo-anterior.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { MotivoRechazoComponent } from 'src/app/modules/tareapendiente/modals/tarea-aprobacion-solicitud/motivo-rechazo.component';
//import { RevisionDocumento, BandejaDocumento } from '../../../../models';
//import { BandejaDocumentoService } from '../../../../services';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { validate } from 'class-validator';
import { RevisionDocumento, Documento } from '../../../../models';
import { BandejaDocumentoService, ValidacionService, ParametrosService} from '../../../../services';
import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { Constante } from 'src/app/models/enums/constante';
//import { ESTADO_REVISION } from 'src/app/constants/general/general.constants';
import { debug, error, isUndefined } from 'util';
import { Tareas } from 'src/app/models/tareas';
import { CorreoService } from 'src/app/services/impl/correo.service';
import { Correo } from 'src/app/models/correo';
import { EnviarInformeComponent } from 'src/app/modules/auditoria/bandeja-revision-auditoria/enviar-informe/enviar-informe.component';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/auth/session.service';

@Component({
    selector: 'aprobacionsolicitud-registro',
    templateUrl: 'aprobacionsolicitud-registro.template.html',
    providers: [BandejaDocumentoService]
})
export class AprobacionSolicitudRegistroComponent implements OnInit {
    @ViewChild('tab') tab:TabGroupAnimationsExample;
    @Input()
    mensajes:any[];
    bsModalRef: BsModalRef;
    itemCodigo: number;
    item: Documento;
    activar: boolean;
    consulta: boolean;
    private sub: any;
    idRevision: number;
    listaTipos: Tipo[];
    listaEstadoDocumento: any[];
    listaEstadoRevision: any[];
    idEstadoDocumento: number;
    idEstadoRevision: number;

    itemAprobacion:EnvioParametros;

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        public session: SessionService,
        private route: ActivatedRoute,
        private service: BandejaDocumentoService,
        private servicioValidacion:ValidacionService,
        private modalService: BsModalService,
        private serviceCorreo: CorreoService,
        private spinner: NgxSpinnerService,
        private serviceParametro: ParametrosService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.activar = false;
        this.consulta = true;
        this.idEstadoDocumento = 0;
        this.idEstadoRevision = 0;
    }

    ngOnInit() {
        
        this.obtenerListaEstados();
        this.idRevision = 0;
        this.itemAprobacion = JSON.parse(sessionStorage.getItem("item"));
        if(this.itemAprobacion.edicion){
            this.itemCodigo = this.itemAprobacion.parametroPrincipal;
            this.service.buscarPorCodigo(this.itemCodigo).subscribe((response: Response) => {
                this.item = response.resultado;
                this.idRevision = this.item.revision.id
            });
        }else{
            this.itemCodigo = null;
        }
        
    }
    //Lista de estados del documento y la revision.
    obtenerListaEstados(){
        this.listaEstadoDocumento = [];
        this.listaEstadoRevision = [];
        this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_DOCUMENTO).subscribe(
            (response: Response) => {
                this.listaEstadoDocumento = response.resultado;
                this.idEstadoDocumento = this.serviceParametro.obtenerIdParametro(this.listaEstadoDocumento, Constante.ESTADO_DOCUMENTO_EN_REVISION);
                //console.log(this.idEstadoDocumento);
            }, (error) => this.controlarError(error)
        );

        this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_SOLICITUD).subscribe(
            (response: Response) => {
                this.listaEstadoRevision = response.resultado;
                this.idEstadoRevision = this.serviceParametro.obtenerIdParametro(this.listaEstadoRevision, Constante.ESTADO_SOLICITUD_APROBADO);
                //console.log(this.idEstadoRevision);
            }, (error) => this.controlarError(error)
        );
    }
    OnAprobar(){              
        this.tab.general.errors={};
        /*Obtenemos los datos del la pestaña informacion general*/
        let documento = this.tab.general.obtenerDatosFrom();
        /*Seteamos al bean de documento la lista de documento */
        documento.listaEquipo = this.tab.equipousuario.listaEquipo;        
        /* Setamos al bean de documento la lista de participantes */
        //Elaboracion
        documento.participanteElaboracion = this.tab.participantes.item.listaElaboracion;
        //Consenso
        documento.participanteConsenso = this.tab.concenso.item.listaConsenso;
        //Aprobacion
        documento.participanteAprobacion = this.tab.aprobacion.item.listaAprobacion;
        //Homologacion
        documento.participanteHomologacion = this.tab.homologacion.item.listaHomologacion;
        let objeto = documento.listaEquipo.find(equipo => equipo.indicadorResponsable==1);
        if(objeto!=null)    documento.indicadorResponsable = 1;
        else                documento.indicadorResponsable = 0;

        if(documento.participanteElaboracion!=null) {
            let persona = documento.participanteElaboracion.find(obj => obj.estiloBloqueado);
            if(persona!=null)   documento.indicadorParticipante = 1;
            else                documento.indicadorParticipante = 0;
        }

        if(documento.participanteConsenso!=null && documento.indicadorParticipante==0) {
            let persona = documento.participanteConsenso.find(obj => obj.estiloBloqueado);
            if(persona!=null)   documento.indicadorParticipante = 1;
            else                documento.indicadorParticipante = 0;
        }

        if(documento.participanteAprobacion!=null && documento.indicadorParticipante==0) {
            let persona = documento.participanteAprobacion.find(obj => obj.estiloBloqueado);
            if(persona!=null)   documento.indicadorParticipante = 1;
            else                documento.indicadorParticipante = 0;
        }

        if(documento.participanteHomologacion!=null && documento.indicadorParticipante==0) {
            let persona = documento.participanteHomologacion.find(obj => obj.estiloBloqueado);
            if(persona!=null)   documento.indicadorParticipante = 1;
            else                documento.indicadorParticipante = 0;
        }

//Inicio cambio Godar validacion de plazo  y fecha de plazo que no sea vacio
        let valid:boolean=false;

        //Validar Participante Elaboración
        if(documento.participanteElaboracion.length>0){
            for(let val of documento.participanteElaboracion){
                if(val.plazo==undefined){
                    valid=false;
                    break;
                }else{
                    valid=true;
                }
            }
        }

        //Validar Participante Consenso
        if(documento.participanteConsenso.length>0){
            for(let val of documento.participanteConsenso){
                if(val.plazo==undefined){
                    valid=false;
                    break;
                }else{
                    valid=true;
                }
            }
        }

         //Validar Participante Aprobación
         if(documento.participanteAprobacion.length>0){
            for(let val of documento.participanteAprobacion){
                if(val.plazo==undefined){
                    valid=false;
                    break;
                }else{
                    valid=true;
                }
            }
        }

        //Validar Participante Homologación
        if(documento.participanteHomologacion.length>0){
            for(let val of documento.participanteHomologacion){
                if(val.plazo==undefined){
                    valid=false;
                    break;
                }else{
                    valid=true;
                }
            }
        }

        //Fin cambio

        //Documento Relacionado
        let objetodocumento:Documento=new Documento();
        let listacomplen:Documento[] = this.tab.complementario.listaSeguimiento;
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
        this.tab.revision.errors = {};
        //documento.revision = this.tab.revision.obtenerRequestRevision(ESTADO_REVISION.EMITIDO);
        documento.revision = this.tab.revision.obtenerRequestRevision(this.idEstadoRevision);
        documento.revision.estado.idconstante = this.idEstadoRevision;
        documento.revision.estado.v_descons = Constante.ESTADO_SOLICITUD_APROBADO;
        documento.estado.idconstante = this.idEstadoDocumento;
        documento.estado.v_descons = Constante.ESTADO_DOCUMENTO_EN_REVISION;
        documento.indAprobacionSoli = "1";
        //Inicio Cambio Godar
        documento.listaComplementario=documento.listaComplementario.filter(x=>x.tipoComplementario.v_descons!="Documentos que se complementan");
        //Fin Cambio
        forkJoin(validate(documento)).subscribe(([errors]:[any])=>{
            this.mensajes = [];
            if(this.servicioValidacion.mapearErrores(errors,this.tab,this.mensajes)){
                this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});
            } else {
                if(documento.indicadorDigital==0) {
                    if(valid){
                    let entrada;
                    entrada = new Tareas();
                    entrada.idRevisionSelecc = this.idRevision;
                    entrada.idDocumenSelecc  = documento.id;
                    entrada.rutaDocuSelecc   = this.tab.revision.revision.rutaDocumentoOriginal;             
                   this.spinner.show()
                        this.service.modificar(documento).subscribe(
                        (response: Response) => {
                            this.spinner.hide()
                            this.item = response.resultado;
                            localStorage.removeItem("objetoRetornoBusqueda");
                            //Enviar Correo - Aprobacion
                            this.serviceCorreo.obtenerCorreo(documento.id, null,
                                Constante.CORREO_APROBAR_SOLICITUD).subscribe(
                                (response: Response) => {
                                    let correo = response.resultado;
                                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                                        (response: Response) => {},
                                        (error) => {
                                            this.controlarError(error);
                                        }
                                    );
                                },
                                (error) => {
                                    this.controlarError(error);
                                }
                            );
                            //Enviar Correo - Plazo de Atencion
                            this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                                Constante.CORREO_PLAZO_ATENCION).subscribe(
                                (response: Response) => {
                                    const lista: Correo[] = response.resultado;
                                    lista.forEach(correo => {
                                        if(correo.correoCabecera.correoDestino.length > 0) {
                                            this.serviceCorreo.enviarCorreo(correo).subscribe(
                                                (response: Response) => {},
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
                            this.toastr.success('Registro almacenado','Acción completada!',{closeButton:true});
                            this.OnRegresar();
                        },(error) => this.controlarError(error));
                    }else{
                        this.toastr.error('Falta Completar campos de plazo de los participantes.','',{closeButton:true});
                    }
                } else {
                    if(valid){
                    this.spinner.show()
                    this.service.modificar(documento).subscribe((response: Response) => {
                        this.item = response.resultado;
                        localStorage.removeItem("objetoRetornoBusqueda");
                        this.spinner.hide()
                        //Enviar Correo - Aprobacion
                        this.serviceCorreo.obtenerCorreo(documento.id, null,
                            Constante.CORREO_APROBAR_SOLICITUD).subscribe(
                            (response: Response) => {
                                let correo = response.resultado;
                                this.serviceCorreo.enviarCorreo(correo).subscribe(
                                    (response: Response) => {},
                                    (error) => {
                                        this.controlarError(error);
                                    }
                                );
                            },
                            (error) => {
                                this.controlarError(error);
                            }
                        );
                        //Enviar Correo - Plazo de Atencion
                        this.serviceCorreo.obtenerListaCorreo(documento.id, null,
                            Constante.CORREO_PLAZO_ATENCION).subscribe(
                            (response: Response) => {
                                const lista: Correo[] = response.resultado;
                                lista.forEach(correo => {
                                    if(correo.correoCabecera.correoDestino.length > 0) {
                                        this.serviceCorreo.enviarCorreo(correo).subscribe(
                                            (response: Response) => {},
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

                        this.toastr.success('Registro almacenado','Acción completada!',{closeButton:true});
                        this.OnRegresar();
                    },(error) => this.controlarError(error));
                }else{
                    this.toastr.error('Falta Completar campos de plazo de los participantes.','',{closeButton:true});
                }
              }
            }
        });
    }
   

    OnRechazar() {
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                idDocumento: this.itemCodigo,
                idRevision: this.idRevision
            },
            class: 'modal-MD'
        }
        this.bsModalRef = this.modalService.show(MotivoRechazoComponent, config);
        (<MotivoRechazoComponent>this.bsModalRef.content).onClose.subscribe(result => {
            this.OnRegresar();
        });
    }
    
    OnRegresar() {
        this.router.navigate([`/documento/tareapendiente/AprobarSolicitud`]);
    }

    controlarError(error) {
        console.error(error);
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

}
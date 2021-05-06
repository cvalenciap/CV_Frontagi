import { Component, OnInit, ViewChild, ElementRef, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService, JsonService, BandejaDocumentoService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { Response } from '../../../models/response';
import { REVISION } from '../constanteRevision';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BusquedaDocumentoComponent } from '../modals/busqueda-documento.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { RevisionDocumento, Documento } from 'src/app/models';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Constante } from 'src/app/models/enums';
import { forkJoin } from 'rxjs';
import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { validate } from 'class-validator';
import { ESTADO_REVISION } from 'src/app/constants/general/general.constants';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { EventEmitter } from '@angular/core';
import { CorreoService } from 'src/app/services/impl/correo.service';

import { NgxSpinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';

import { EnvioParametros } from 'src/app/models/envioParametros';
import { SessionService } from 'src/app/auth/session.service';


//lgomez
//tabs
//import { TabsetComponent } from 'ngx-bootstrap';

@Component({
    selector: 'registrar-revision-documento',
    templateUrl: 'registrar-revision-documento.template.html',
    styleUrls: ['registrar-revision-documento.component.scss']
})
export class RegistrarRevisionDocumentoComponent implements OnInit {
    @ViewChild("fileRevision") fileRevision: ElementRef;
    @ViewChild("customButton") customButton: ElementRef;
    bsModalRef: BsModalRef;
    nombreArchivoRevision: string;
    constanteRevision: any;
    /* codigo seleccionado */
    idRevDoc: number;
    item: Documento;
    iteracion:number;
    //item: RevisionDocumento;
    private sub: any;
    parametros: Map<string, any>;

    formRevision: FormGroup;
    listaGerencia:any[];
    listaAlcance:any[];
    listaProceso:any[];
    codigo:number;
    consulta:boolean;
    permisos:boolean;
    envioActivo:boolean;
    activar:boolean;
    ocultarSeleccionDoc:boolean;
    @ViewChild('tab') tab:TabGroupAnimationsExample;
    mensajes:any[];
    idEstadoEmitido:number;
    idEstadoAprobado:number;

    itemRevision:EnvioParametros;
    infoIdConstante:number;
    infoDescons: string;

    //  @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private servicioValidacion:ValidacionService,
        private route: ActivatedRoute,
        private serviceDocumento: BandejaDocumentoService,
        private service: RevisionDocumentoService,
        private modalService: BsModalService,
        private formBuilder: FormBuilder,
        private datePipe: DatePipe,
        private serviceParametro: ParametrosService,
        private serviceCorreo: CorreoService,
        private _jsonService:JsonService,
        public session:SessionService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.constanteRevision = REVISION;
        this.parametros = new Map<string, any>();
        this.consulta = true;
        this.activar = false;
        this.ocultarSeleccionDoc=true;
        this.permisos=true;
        this.envioActivo =true;
        this.infoIdConstante=0
        this.infoDescons="";
        this.item = new Documento();
        
        this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_SOLICITUD).subscribe(
            (response: Response) => {
                let resultado  = response.resultado;
                this.idEstadoEmitido = this.serviceParametro.obtenerIdParametro(
                    //resultado,Constante.ESTADO_SOLICITUD_EMITIDO);
                    resultado,Constante.ESTADO_DOCUMENTO_EN_REVISION);
                console.log("Estado Revision");
                console.log(this.idEstadoEmitido);
            },
            (error) => this.controlarError(error)
        );

        this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_DOCUMENTO).subscribe(
            (response: Response) => {
                let resultado  = response.resultado;
                this.idEstadoAprobado = this.serviceParametro.obtenerIdParametro(
                    resultado,Constante.ESTADO_DOCUMENTO_APROBADO);
                console.log("idEstadoAprobado");
                console.log(this.idEstadoAprobado);
            },
            (error) => this.controlarError(error)
        );
    }

    ngOnInit() {
        this.inicializarFormulario();

        this.itemRevision = JSON.parse(sessionStorage.getItem("item"));

        if(this.itemRevision.edicion){
            this.activar=true;
               this.ocultarSeleccionDoc=false;
               this.envioActivo=false;
               this.permisos=false;
        }

    }

    inicializarFormulario() {
        this.formRevision = this.formBuilder.group({
            'num_solicitud': new FormControl('', []),
            'fecha_solicitud': new FormControl('', []),
            'nombre_completo': new FormControl('', []),
            'equipo': new FormControl('', []),
            'revision': new FormControl('', []),
            'fec_revision': new FormControl('', [])
        });
    }

    onBuscarDocumento() {

        //Para el Coordinador
        localStorage.setItem("COORDINADOR","COORDINADOR");
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                //modalService:this.modalService
                busquedaEstadosSolicitudCancelacion:","+this.idEstadoAprobado+","
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(BusquedaDocumentoComponent, config);

        (<BusquedaDocumentoComponent>this.bsModalRef.content).onClose.subscribe(result => {
          //console.log("resultadio de busqueda",result);
          if(result!=null){ this.envioActivo=false; }
          let documento:Documento = result;
          
          let tamano = (documento.participanteElaboracion==null)?0:documento.participanteElaboracion.length;
          for(let posicion=0; posicion<tamano; posicion++) {
            let indicador=documento.participanteElaboracion.findIndex(
                persona=>persona.responsable==null || persona.equipo==null);
            if(indicador > -1) {
                documento.participanteElaboracion.splice(indicador, 1);
            } else {
                break;
            }
          }

          tamano = (documento.participanteConsenso==null)?0:documento.participanteConsenso.length;
          for(let posicion=0; posicion<tamano; posicion++) {
            let indicador=documento.participanteConsenso.findIndex(
                persona=>persona.responsable==null || persona.equipo==null);
            if(indicador > -1) {
                documento.participanteConsenso.splice(indicador, 1);
            } else {
                break;
            }
          }

          tamano = (documento.participanteAprobacion==null)?0:documento.participanteAprobacion.length;
          for(let posicion=0; posicion<tamano; posicion++) {
            let indicador=documento.participanteAprobacion.findIndex(
                persona=>persona.responsable==null || persona.equipo==null);
            if(indicador > -1) {
                documento.participanteAprobacion.splice(indicador, 1);
            } else {
                break;
            }
          }

          tamano = (documento.participanteHomologacion==null)?0:documento.participanteHomologacion.length;
          for(let posicion=0; posicion<tamano; posicion++) {
            let indicador=documento.participanteHomologacion.findIndex(
                persona=>persona.responsable==null || persona.equipo==null);
            if(indicador > -1) {
                documento.participanteHomologacion.splice(indicador, 1);
            } else {
                break;
            }
          }



          documento.participanteElaboracion.forEach(obj => {
            //obj.plazo=0;
            obj.fechaPlazo=null;
            obj.fechaLiberacion=null;
            obj.comentario=null;
          });

          documento.participanteConsenso.forEach(obj => {
            //obj.plazo=0;
            obj.fechaPlazo=null;
            obj.fechaLiberacion=null;
            obj.comentario=null;
          });

          documento.participanteAprobacion.forEach(obj => {
            //obj.plazo=0;
            obj.fechaPlazo=null;
            obj.fechaLiberacion=null;
            obj.comentario=null;
          });

          documento.participanteHomologacion.forEach(obj => {
            //obj.plazo=0;
            obj.fechaPlazo=null;
            obj.fechaLiberacion=null;
            obj.comentario=null;
          });

          this.tab.extrametododepadre(documento);
        });
         //LPS
       // localStorage.removeItem("prueba")
    }
    OnRegresar() {
        this.router.navigate([`documento/solicitudes/revisiondocumento`]);
    }
    controlarError(error) {
        console.error(error);
        // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    fechaActual() {
        var d = new Date();
        return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    }

    selectFile() {
        this.fileRevision.nativeElement.click();

    }
    archivoCambio() {
        this.nombreArchivoRevision = this.fileRevision.nativeElement.value;
    }

    onGuardar(){
        this.tab.general.errors={};
        
        let documento = this.tab.general.obtenerDatosFrom();
        documento.listaEquipo = this.tab.equipousuario.listaEquipo;
        this.iteracion=documento.revision.iteracion;
        this.tab.revision.errors={};

        let objeto = documento.listaEquipo.find(equipo => equipo.indicadorResponsable==1);
        if(objeto!=null)    documento.indicadorResponsable = 1;
        else                documento.indicadorResponsable = 0;

        if(documento.participanteElaboracion!=null) {
            let persona = documento.participanteElaboracion.find(obj => obj.estiloBloqueado);
            if(persona!=null)   documento.indicadorParticipante = 1;
            else                documento.indicadorParticipante = 0;
        }

        //consenso
        if(documento.participanteConsenso!=null && documento.indicadorParticipante==0) {
            let persona = documento.participanteConsenso.find(obj => obj.estiloBloqueado);
            if(persona!=null)   documento.indicadorParticipante = 1;
            else                documento.indicadorParticipante = 0;
        }
        this.infoIdConstante = documento.estado.idconstante;
        this.infoDescons = documento.estado.v_descons;

        if (documento.estado.idconstante == 119) {
            documento.estado.idconstante = 116;
            documento.estado.v_descons = Constante.ESTADO_DOCUMENTO_EMISION;
            documento.indAprobacionSoli = "1";
        }
        let numero = documento.revision.numero;

        documento.revision = this.tab.revision.obtenerRequestRevision(ESTADO_REVISION.EMITIDO);
        if(documento.revision.estado.v_descons=="Rechazado" || documento.revision.estado.v_descons=="Aprobado"){
            documento.revision.iteracion         =this.iteracion;
            documento.revision.estado.idconstante=this.idEstadoEmitido;
            //documento.revision.estado.v_descons  =Constante.ESTADO_SOLICITUD_EMITIDO;
            documento.revision.estado.v_descons  =Constante.ESTADO_DOCUMENTO_EN_REVISION;
        }
        if(numero!=undefined){
            documento.revision.numero=numero;
        }

        documento.listaComplementario=documento.listaComplementario.filter(x=>x.tipoComplementario.v_descons!="Documentos que se complementan");

        documento.rutaDocumento = null;
        documento.revision.rutaDocumentoOriginal= null;

        forkJoin(validate(documento)).subscribe(([errors]:[any])=>{
            this.mensajes = [];
           // console.log("errorrrr", errors);
            if(this.servicioValidacion.mapearErrores(errors,this.tab,this.mensajes)){
                documento.estado.idconstante = this.infoIdConstante;
                documento.estado.v_descons = this.infoDescons;
                this.toastr.error(`${this.mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});
            }else{
                this.spinner.show();
                
                this.serviceDocumento.modificar(documento).subscribe(
                    (response: Response) => {
                    this.item = response.resultado;
                    this.spinner.hide();
                    localStorage.removeItem("objetoRetornoBusqueda");
                    //Enviar Correo
                    this.serviceCorreo.obtenerCorreo(documento.id, null,
                        Constante.CORREO_REGISTRO_SOLICITUD).subscribe(
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

                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    this.router.navigate(['documento/solicitudes/revisiondocumento']);
                    }
                );
            }
        });
    }

}

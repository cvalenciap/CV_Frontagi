import {Component, OnInit, ViewChild , ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService, ValidacionService } from '../../../../../services';
import { Tipo } from '../../../../../models/tipo';
import { BandejaDocumento } from '../../../../../models/bandejadocumento';
import { Paginacion } from '../../../../../models/paginacion';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { TareaService} from '../../../../../services/impl/tarea.service';
import { TabGrupoSolicitudComponent} from '../../../../tabs/views/tab-grupo-solicitud/tab-grupo-solicitud.component';
import { Response} from '../../../../../models';
import { Cancelacion } from 'src/app/models/cancelacion';
import { forkJoin } from 'rxjs';
import { validate } from 'class-validator';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { CorreoService } from 'src/app/services/impl/correo.service';
import { Constante } from 'src/app/models/enums/constante';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnviarInformeComponent } from 'src/app/modules/auditoria/bandeja-revision-auditoria/enviar-informe/enviar-informe.component';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { SessionService } from 'src/app/auth/session.service';

@Component({
    selector: 'app-registrosolicitudcancel',
    templateUrl: 'registrosolicitudcancel.template.html',
    styleUrls: ['registrosolicitudcancel.component.scss'],
    providers: [BandejaDocumentoService]
})
export class RegistroSolicitudCancelComponent implements OnInit {
    @ViewChild('fileRevision') fileRevision: ElementRef;
    @ViewChild('customButton') customButton: ElementRef;
    @ViewChild('tabs') tabGrupoSolicitud: TabGrupoSolicitudComponent;
    @ViewChild('visorPdfSwal') visorPdfSwal: SwalComponent;
    public bsModalRef: BsModalRef;
    public nombreArchivoRevision: string;
    public constanteRevision: any;
    itemSolicitud: EnvioParametros;
    itemCodigo: number;
    listaTipos: Tipo[];
    item: BandejaDocumento;
    private sub: any;
    paginacion: Paginacion;
    cancelacion: Cancelacion;
    archivoSustento: any;
    loading: boolean;
    cancelacionObtenido: Cancelacion;
    editar: boolean;
    mensajes: any[];
    urlPDF: any;
    indicadorGuardar:number;

    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                public session: SessionService,
                private route: ActivatedRoute,
                private tareaServicio: TareaService,
                private documentService: BandejaDocumentoService,
                private serviceCorreo: CorreoService,
                private spinner: NgxSpinnerService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.paginacion = new Paginacion({registros: 10});
    }

    ngOnInit() {
      this.loading = false;
      this.itemSolicitud = JSON.parse(sessionStorage.getItem("item"));
      if (this.itemSolicitud.edicion) {
        this.editar = true;
        this.loading = true;
        this.indicadorGuardar = 0;
        this.spinner.show();
        
        this.tareaServicio.obtenerSolicitudCancelacionPorId(this.itemSolicitud.parametroPrincipal).subscribe((response:Response) => {            
          this.cancelacionObtenido = response.resultado;
          
          this.enviarDatos(this.cancelacionObtenido);
        },
        (error) => this.controlarError(error))
        
      } else if(this.itemSolicitud.nuevo) {
        this.cancelacionObtenido = new Cancelacion();
        this.indicadorGuardar = 1;
        this.editar = false;
      }

    }

    OnRegresar() {

      this.router.navigate([`documento/tareapendiente/cancelaciones/SolicitudCancel`]);
      
    }

    controlarError(error) {
        console.error(error);
        this.spinner.hide();
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
      }

    fechaActual() {
        const d = new Date();
        return ('0' + d.getDate()).slice(-2) + '/' + ('0' + (d.getMonth() + 1)).slice(-2) + '/' + d.getFullYear();
    }

    selectFile() {
        this.fileRevision.nativeElement.click();
    }

    archivoCambio() {
        this.nombreArchivoRevision = this.fileRevision.nativeElement.value;
    }

    searchByCodeDocument(codeDocument: string) {

    }

    onBuscar() {}

    OnEnviar(){
        
        this.tabGrupoSolicitud.obtenerCancelacion();
        this.cancelacion = this.tabGrupoSolicitud.cancelacionTabs;

        let coordinador= JSON.parse(sessionStorage.getItem("coordinador"));
        sessionStorage.removeItem("coordinador");
        sessionStorage.removeItem("objeto");
        if(coordinador!=undefined){
            this.cancelacion.idUsuAprobador=coordinador;
        }

        if(this.editar){
            this.cancelacion.rutaArchivoSustento = this.cancelacionObtenido.rutaArchivoSustento;
            this.cancelacion.idSolicitudCancelacion = this.cancelacionObtenido.idSolicitudCancelacion;
        }
        
        this.archivoSustento = this.tabGrupoSolicitud.archivoSustento;

        forkJoin(validate(this.cancelacion)).subscribe(([errors]:[any])=>{
            this.mensajes = [];
            if(errors.length>0){
                this.tabGrupoSolicitud.requestInformation.validarCampos(); 
                this.tabGrupoSolicitud.requestLivelihood.validarCampos();
                this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', {closeButton: true});
            }else{
                if(!this.editar){
                    this.loading = true;
                    this.spinner.show();
                    this.tareaServicio.crearEnviarSolicitudCancelacion(this.archivoSustento, this.cancelacion).subscribe(
                        (response:Response) => {
                        localStorage.removeItem("objetoRetornoBusqueda"); 
                    //Enviar Correo
                    this.serviceCorreo.obtenerCorreo(this.cancelacion.idDocumento, this.cancelacion.numTipoCancelacion,
                        Constante.CORREO_REGISTRO_CANCELACION).subscribe(
                        (response: Response) => {
                            let correo = response.resultado;
                            this.serviceCorreo.enviarCorreo(correo).subscribe(
                                (response: Response) => {
                                    this.spinner.hide();
                                    this.loading = false;
                                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                                    this.router.navigate([`documento/tareapendiente/cancelaciones/SolicitudCancel`]);
                                },
                                (error) => {
                                    this.controlarError(error);
                                }
                            );
                        },
                        (error) => {
                            this.controlarError(error);
                        }
                    );

                    
                    
                    },
                    (error) => this.controlarError(error))
                }else{
                    this.loading = true;
                    this.spinner.show();
                    this.tareaServicio.actualizarEnviarSolicitudCancelacion(this.archivoSustento, this.cancelacion).subscribe(
                        (response:Response) => {
                        localStorage.removeItem("objetoRetornoBusqueda");
                    //Enviar Correo
                    this.serviceCorreo.obtenerCorreo(this.cancelacion.idDocumento, this.cancelacion.numTipoCancelacion,
                        Constante.CORREO_REGISTRO_CANCELACION).subscribe(
                        (response: Response) => {
                            let correo = response.resultado;
                            this.serviceCorreo.enviarCorreo(correo).subscribe(
                                (response: Response) => { 
                                    this.spinner.hide();
                                    this.loading = false;
                                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                                    this.router.navigate([`documento/tareapendiente/cancelaciones/SolicitudCancel`]);
                                },
                                (error) => {
                                    this.controlarError(error);
                                }
                            );
                        },
                        (error) => {
                            this.controlarError(error);
                        }
                    );

                    
                    
                    },
                    (error) => this.controlarError(error))
                }
                

            }
        });

        
    }

    OnGuardar(){
        
        this.tabGrupoSolicitud.obtenerCancelacion();
        this.cancelacion = this.tabGrupoSolicitud.cancelacionTabs;
        let coordinador= JSON.parse(sessionStorage.getItem("coordinador"));
        sessionStorage.removeItem("coordinador");

        if(coordinador!=undefined){
            this.cancelacion.idUsuAprobador=coordinador;
        }

        if(this.editar){
            this.cancelacion.rutaArchivoSustento = this.cancelacionObtenido.rutaArchivoSustento;
            this.cancelacion.idSolicitudCancelacion = this.cancelacionObtenido.idSolicitudCancelacion;
        }
        
        this.archivoSustento = this.tabGrupoSolicitud.archivoSustento;

        forkJoin(validate(this.cancelacion)).subscribe(([errors]:[any])=>{
            this.mensajes = [];
            if(errors.length>0){
                this.tabGrupoSolicitud.requestInformation.validarCampos();
                this.tabGrupoSolicitud.requestLivelihood.validarCampos();
                this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', {closeButton: true});
            }else{
                if(!this.editar){
                    this.loading = true;
                    this.spinner.show();
                    this.tareaServicio.crearSolicitudCancelacion(this.archivoSustento, this.cancelacion).subscribe((response:Response) => {
                    if (this.indicadorGuardar == 1) {
                        localStorage.removeItem("objetoRetornoBusqueda");
                    }                        
                    this.loading = false;
                    this.spinner.hide();
                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    this.router.navigate([`documento/tareapendiente/cancelaciones/SolicitudCancel`]);
                    
                    },
                    (error) => this.controlarError(error))
                }else{
                    this.loading = true;
                    this.spinner.show();
                    this.tareaServicio.actualizarSolicitudCancelacion(this.archivoSustento, this.cancelacion).subscribe((response:Response) => {
                    if (this.indicadorGuardar == 1) {
                        localStorage.removeItem("objetoRetornoBusqueda");
                    } 
                    this.loading = false;
                    this.spinner.hide();
                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    this.router.navigate([`documento/tareapendiente/cancelaciones/SolicitudCancel`]);
                    
                    },
                    (error) => this.controlarError(error))
                }
            }
            
        });
        
    }

    enviarDatos(solicitudCancelacion:Cancelacion){
        
        this.tabGrupoSolicitud.enviarDatosCancelacion(solicitudCancelacion);
    }

    buscarRutaDocumento(visorPdfSwal:any,event:any){
        let codDocumento = this.tabGrupoSolicitud.requestInformation.idDocumento;
        if(codDocumento != undefined && codDocumento != null && codDocumento != 0){
            this.spinner.show();
            this.tareaServicio.obtenerRutaDocCopiaControlada(codDocumento).subscribe(
                (response: Response) => {
                    this.spinner.hide();
                    let ruta:string = response.resultado;
                    if(ruta!=null){
                    this.urlPDF = ruta;
                    visorPdfSwal.show();
                    event.stopPropagation();
                    }else{
                    this.toastr.error('El documento no cuenta con el archivo para visualización', 'Error', {closeButton: true});
                    }
                },
                (error) => this.controlarError(error)
                ); 
        }else{
            this.toastr.error('No se ha ingresado aun el documento, no se puede visualizar', 'Error', {closeButton: true});
        }
    }


}

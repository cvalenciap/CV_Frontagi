import {Component, OnInit,ViewChild,ElementRef} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {BandejaDocumentoService, CorreoService} from '../../../../../services';
import {Tipo} from '../../../../../models/tipo';
import {Estado} from '../../../../../models/enums/estado';
import {BandejaDocumento} from '../../../../../models/bandejadocumento';
import {Response} from '../../../../../models/response';
import { Paginacion } from '../../../../../models/paginacion';

import { ModalOptions,BsModalRef,BsModalService } from 'ngx-bootstrap';
import { Cancelacion } from 'src/app/models/cancelacion';
import { TareaService } from 'src/app/services/impl/tarea.service';
import { TabGrupoSolicitudComponent } from 'src/app/modules/tabs/views/tab-grupo-solicitud/tab-grupo-solicitud.component';
import { ModalRechazoSolicitudCancelacionComponent } from '../../../modals/modal-rechazo-solicitud-cancelacion/modal-rechazo-solicitud-cancelacion.component';
import { Constante } from 'src/app/models/enums/constante';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { SessionService } from 'src/app/auth/session.service';
import { Correo } from 'src/app/models/correo';


@Component({
    selector: 'app-registroaprobacioncancel',
    templateUrl: 'registroaprobacioncancel.template.html',
    styleUrls: ['registroaprobacioncancel.component.scss'],
    //providers: [BandejaDocumentoService]
})
export class RegistroAprobacionCancelComponent implements OnInit {
    @ViewChild('fileRevision') fileRevision: ElementRef;
  @ViewChild('customButton') customButton: ElementRef;
  @ViewChild('tabs') tabGrupoSolicitud: TabGrupoSolicitudComponent;
  public bsModalRef: BsModalRef;
  public nombreArchivoRevision: string;
  public constanteRevision: any;

    /* codigo seleccionado */
    itemCodigo: number;
    /* datos */
    listaTipos: Tipo[];
    item: BandejaDocumento;
    private sub: any;
    paginacion: Paginacion;

    cancelacion:Cancelacion;
    archivoSustento:any;
    loading:boolean;

    cancelacionObtenido:Cancelacion;

    editar:boolean;
    idCancelacion:string;
    urlPDF:any;

    itemAprobacion:EnvioParametros;

    constructor(private localeService: BsLocaleService, 
                private toastr: ToastrService, 
                private router: Router,
                public session: SessionService,
                private route: ActivatedRoute, 
                private tareaServicio: TareaService, 
                private documentService: BandejaDocumentoService,
                private serviceCorreo: CorreoService,                
                private modalService: BsModalService,
                private spinner: NgxSpinnerService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.paginacion = new Paginacion({registros: 10});
    }

    ngOnInit() {
      
      this.loading = false;
      this.itemAprobacion = JSON.parse(sessionStorage.getItem("item"));
      console.log('Código del documento envíado', this.itemAprobacion.parametroPrincipal);
      if (this.itemAprobacion.edicion) {
        this.editar = true;
        this.loading = true;
        this.spinner.show();
        this.tareaServicio.obtenerSolicitudCancelacionPorId(this.itemAprobacion.parametroPrincipal).subscribe((response:Response) => {
          
            this.loading = false;
          this.cancelacionObtenido = response.resultado;
          console.log('Código');
          console.log(this.cancelacionObtenido);
          this.idCancelacion = this.cancelacionObtenido.idSolicitudCancelacion; 
          this.enviarDatos(this.cancelacionObtenido);
        },
        (error) => this.controlarError(error))
        
      } else {
        this.editar = false;
      }
    }

    OnRegresar() {
      this.router.navigate([`documento/tareapendiente/cancelaciones/AprobacionCancel`]);
    }

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.spinner.hide();
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

    enviarDatos(solicitudCancelacion:Cancelacion){
        this.tabGrupoSolicitud.enviarDatosCancelacion(solicitudCancelacion);
    }

    aprobar(){
        
        this.loading = true;
        let vidCoordinadorCancel: number = JSON.parse(sessionStorage.getItem("idCoordinadorCancel"));
        sessionStorage.removeItem("idCoordinadorCancel");
        this.cancelacionObtenido.idSolicitudCancelacion = this.idCancelacion;
        this.cancelacionObtenido.idColaborador = vidCoordinadorCancel.toString();     
                
        this.spinner.show();
         this.tareaServicio.aprobarSolicitudCancelacion(this.cancelacionObtenido).subscribe((response:Response) => {
            localStorage.removeItem("objetoRetornoBusqueda"); 
            //Enviar Correo
            this.serviceCorreo.obtenerCorreo(this.cancelacionObtenido.idDocumento, this.cancelacionObtenido.numTipoCancelacion,
              Constante.CORREO_APROBAR_CANCELACION).subscribe(
              (response: Response) => {
                  let correo = response.resultado;
                  this.serviceCorreo.enviarCorreo(correo).subscribe(
                      (response: Response) => {
                        this.spinner.hide();
                        this.loading = false;
                        this.toastr.success('Solicitud de Cancelación Aprobada', 'Acción completada!', {closeButton: true});
                        this.router.navigate([`documento/tareapendiente/cancelaciones/AprobacionCancel`]);
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

  rechazar() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {

      },
      class: 'modal-lg'
    }
    
    this.bsModalRef = this.modalService.show(ModalRechazoSolicitudCancelacionComponent, config);
    (<ModalRechazoSolicitudCancelacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      
      this.cancelacionObtenido.idSolicitudCancelacion = this.idCancelacion;
      this.cancelacionObtenido.sustentoRechazo = result;
      this.loading = true;
      this.spinner.show();
      this.tareaServicio.rechazarSolicitudCancelacion(this.cancelacionObtenido).subscribe((response: Response) => {
        localStorage.removeItem("objetoRetornoBusqueda"); 
        this.spinner.hide();
        //this.loading = false;
        this.serviceCorreo.obtenerListaCorreo(this.cancelacionObtenido.idDocumento, this.cancelacionObtenido.numTipoCancelacion,
          Constante.CORREO_RECHAZO_CANCELACION).subscribe(
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

        this.toastr.success('Solicitud de Cancelación Rechazada', 'Acción completada!', { closeButton: true });
        this.router.navigate([`documento/tareapendiente/cancelaciones/AprobacionCancel`]);
      },
        (error) => this.controlarError(error))

    });
  }

      buscarRutaDocumento(visorPdfSwal:any,event:any){
        this.spinner.show();
        this.tareaServicio.obtenerRutaDocCopiaControlada(this.cancelacionObtenido.idDocumento).subscribe(
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
    }
}

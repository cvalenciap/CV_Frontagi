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
import { TabGrupoSolicitudComponent } from 'src/app/modules/tabs/views/tab-grupo-solicitud/tab-grupo-solicitud.component';
import { Cancelacion } from 'src/app/models/cancelacion';
import { TareaService } from 'src/app/services/impl/tarea.service';
import { Constante } from 'src/app/models/enums/constante';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { SessionService } from 'src/app/auth/session.service';


@Component({
    selector: 'app-registrocancelasolicitud',
    templateUrl: 'registrocancelasolicitud.template.html',
    styleUrls: ['registrocancelasolicitud.component.scss'],
    //providers: [BandejaDocumentoService]
})
export class RegistroCancelaSolicitudComponent implements OnInit {
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
      itemCancelacion:EnvioParametros;
  
      constructor(private localeService: BsLocaleService, 
                  private toastr: ToastrService, 
                  private router: Router,
                  public session: SessionService,
                  private route: ActivatedRoute,
                  private tareaServicio: TareaService,
                  private serviceCorreo: CorreoService,
                  private documentService: BandejaDocumentoService,
                  private spinner: NgxSpinnerService) {
          defineLocale('es', esLocale);
          this.localeService.use('es');
          this.paginacion = new Paginacion({registros: 10});
      }
  
      ngOnInit() {
        
        this.loading = false;
        this.itemCancelacion = JSON.parse(sessionStorage.getItem("item"));
        console.log('Código del documento envíado', this.itemCancelacion.parametroPrincipal);
        if (this.itemCancelacion.edicion) {
          this.editar = true;
          this.loading = true;
          this.spinner.show();
          this.tareaServicio.obtenerSolicitudCancelacionPorId(this.itemCancelacion.parametroPrincipal).subscribe((response:Response) => {
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
        this.router.navigate([`documento/tareapendiente/cancelaciones/CancelaSolicitud`]);
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
  
      enviarDatos(solicitudCancelacion:Cancelacion){
          this.tabGrupoSolicitud.enviarDatosCancelacion(solicitudCancelacion);
      }

  ejecutar() {
    this.loading = true;
    this.spinner.show();
    this.tareaServicio.ejecutarCancelacion(this.cancelacionObtenido).subscribe((response: Response) => {
      localStorage.removeItem("objetoRetornoBusqueda"); 
      //Enviar Correo
      this.serviceCorreo.obtenerCorreo(this.cancelacionObtenido.idDocumento, this.cancelacionObtenido.numTipoCancelacion,
        Constante.CORREO_EJECUTAR_CANCELACION).subscribe(
          (response: Response) => {
            let correo = response.resultado;
            this.serviceCorreo.enviarCorreo(correo).subscribe(
              (response: Response) => {
                this.spinner.hide();
                this.loading = false;
                this.toastr.success('Ejecución de Cancelación realizada', 'Acción completada!', { closeButton: true });
                this.router.navigate([`documento/tareapendiente/cancelaciones/CancelaSolicitud`]);
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

  buscarRutaDocumento(visorPdfSwal: any, event: any) {
    this.spinner.show();
    this.tareaServicio.obtenerRutaDocCopiaControlada(this.cancelacionObtenido.idDocumento).subscribe(
      (response: Response) => {
        this.spinner.hide();
        let ruta: string = response.resultado;
        if (ruta != null) {
          this.urlPDF = ruta;
          visorPdfSwal.show();
          event.stopPropagation();
        } else {
          this.toastr.error('El documento no cuenta con el archivo para visualización', 'Error', { closeButton: true });
        }
      },
      (error) => this.controlarError(error)
    );
  }

}
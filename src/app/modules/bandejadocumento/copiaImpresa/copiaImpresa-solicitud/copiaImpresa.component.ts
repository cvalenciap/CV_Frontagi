import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../../services';
import { Tipo } from '../../../../models/tipo';
import { Estado } from '../../../../models/enums/estado';
import { BandejaDocumento } from '../../../../models/bandejadocumento';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { ViewChild } from '@angular/core';
import { validate } from 'class-validator';
import { Input } from '@angular/core';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BusquedaDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento.component';
import { TabGroupAnimationsCopiaImpresa } from 'src/app/modules/bandejadocumento/copiaImpresa/views/tab-group-animations-copiaImpresa';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { RevisionDocumento } from 'src/app/models/revisiondocumento';
import { Documento } from 'src/app/models';
import { forkJoin } from 'rxjs';
import { SolicitudComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/solicitud.component';
import { Constante } from 'src/app/models/enums';
import { CorreoService } from 'src/app/services/impl/correo.service';
import { SessionService } from 'src/app/auth/session.service';

declare var jQuery: any;

@Component({
  selector: 'copiaimpresa',
  templateUrl: 'copiaimpresa.template.html',
  providers: [BandejaDocumentoService]
})
export class BandejaSolicitudCopiasImpresasComponent implements OnInit {
  @ViewChild('tab') tab: TabGroupAnimationsCopiaImpresa;
  /* indicador de carga */
  loading: boolean;
  /* paginación */
  paginacion: Paginacion;
  
  rutaActual: string;
  rutaAnterior: string;
  rutaAnteriorAnterior: string;
  /* registro seleccionado */
  selectedRow: number;
  item: RevisionDocumento;
  itemCodigo: number;
  habilitaenviar: boolean;
  items: Documento[];
  /* datos */
  activar: boolean;
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  private sub: any;
  param: number;
  mensajes: any[];
  @Input()

  ngAfterViewInit() {    
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    public session: SessionService,
    private servicioValidacion: ValidacionService,
    private route: ActivatedRoute,
    private service: RevisionDocumentoService,
    private serviceCorreo: CorreoService,
    private modalService: BsModalService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({ registros: 10 });
    this.selectedRow = -1;
    this.parametroBusqueda = 'tipo';
    this.activar = false;
    this.item = new RevisionDocumento();
    this.habilitaenviar= false;

   /* this.rutaActual = this.router.url;        
    let item = JSON.parse(sessionStorage.getItem("item"));
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
    let nuevo = item.nuevo;
    let edicion = item.edicion*/

  }


  ngOnInit() {

    this.sub = this.route.params.subscribe(params => {
      this.param = + params['codigo'];
    });
    if (this.param == 0) {
      this.activar = false;
    } else { 
      this.activar = true 
    }


    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
    });
  }
  OnRegresar() {
    localStorage.removeItem("susteso");
    localStorage.removeItem("iddocumento");
    localStorage.removeItem("tipocopia");
    localStorage.removeItem("numeromotivo");
    localStorage.removeItem("idSolicitud");
    localStorage.removeItem("EstadoSolicitud");
    this.router.navigate([`/documento/solicitudes/copiaimpresa`]);
  }

  OnValidarSiEsAprobado(item: any) {
    if (item == "143" || item == "141") { //Estado Aprobado // 
        this.habilitaenviar= true;
    }else{
      this.habilitaenviar= false;
    }
  }

  OnEnviar() {
    
    this.tab.solicitud.errors = {};
    let idDocumento;
    idDocumento = localStorage.getItem("iddocumento");
    localStorage.removeItem("iddocumento");
    let documento = this.tab.solicitud.obtenerRequestRevision();
    let id = documento.nestcopi;
    //Lista de destinatarios
    documento.listaParticipante = this.tab.solicitud.listaParticipantes;
    let idSolicitud
    idSolicitud = localStorage.getItem("idSolicitud");
    documento.numerosolicitud = idSolicitud;    
    documento.resumenCritica = " ";  

    //Validación
    forkJoin(validate(documento)).subscribe(([errors]:[any])=>{
      console.log(errors);
      let atributoError:any = null;
      if(errors.length>0){
        for(let err of errors){
          if(err.property == "listaParticipante"){
            atributoError = err;
            break;
          }
        }
      }
     let mensajeListaParticipante:string= "";
     if(atributoError != null){
      mensajeListaParticipante= atributoError.constraints[Object.keys(atributoError.constraints)[0]]
     }
      console.log(mensajeListaParticipante);
      this.mensajes = [];
        if (this.servicioValidacion.mapearErrores(errors,this.tab,this.mensajes)){
            console.log(this.mensajes.join('. '));   
            let encontroMensaje:boolean = false;   
            if(mensajeListaParticipante != ""){
              for(let texto of this.mensajes){
                if(texto == mensajeListaParticipante){
                  encontroMensaje = true;
                }
              }
            } 
            if(encontroMensaje){
              this.toastr.error(mensajeListaParticipante, 'Acción inválida', {closeButton: true});
            }else{
              this.toastr.error("Existen campos obligatorios por completar.", 'Acción inválida', {closeButton: true});
            }
           
        }else{
    //Validación

    if (idSolicitud) {
      /*Modifica*/
      documento.indicadorestado = Constante.ESTADO_SOLICITUD_EN_REVISION;//Estado En Revision
       this.service.guardarSolicitudModif(documento).subscribe(
         (response: Response) => {
          let listadedocumento:RevisionDocumento = response.resultado;
          localStorage.removeItem("objetoRetornoBusquedaSolCopia");  
          //Enviar Correo
          

          this.serviceCorreo.obtenerCorreo(idDocumento, listadedocumento.id,
            Constante.CORREO_SOLICITUD_COPIA).subscribe(
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

           this.item = response.resultado;
           this.toastr.success('Se Envío la Solicitud', 'Acción completada!', { closeButton: true });
           this.router.navigate([`/documento/solicitudes/copiaimpresa`]);
         }
       );

    } else {
      /*  Nuevo  */
      console.log("Nuevo")
      this.service.guardarSolicitud(documento).subscribe(
        (response: Response) => {
          let listadedocumento:RevisionDocumento = response.resultado;
          localStorage.removeItem("objetoRetornoBusquedaSolCopia");  
          //Enviar Correo
          
          this.serviceCorreo.obtenerCorreo(documento.id, listadedocumento.id,
            Constante.CORREO_SOLICITUD_COPIA).subscribe(
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

          this.item = response.resultado;
          this.toastr.success('Se Envío la Solicitud', 'Acción completada!', { closeButton: true });
          this.router.navigate([`/documento/solicitudes/copiaimpresa`]);
        }
      );


    }
    //Validación
    }
  });
    //Validación
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;
    //this.selectedObject = obj;
  }
  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });

  }

}

import {Component, EventEmitter, OnInit, Output} from '@angular/core';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {BusquedaDocumentoComponent} from '../../../revisiondocumento/modals/busqueda-documento.component';
import {Documento,Response} from '../../../../models';
import {TareaService} from '../../../../services/impl/tarea.service';
import { GeneralService, BandejaDocumentoService, ValidacionService, RelacionCoordinadorService } from 'src/app/services';
import { NombreParametro, EstadosCancelacion } from 'src/app/constants/general/general.constants';
import { forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { Cancelacion } from 'src/app/models/cancelacion';
import { validate } from 'class-validator';
import { NgxSpinnerService } from 'ngx-spinner';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { JerarquiasService } from 'src/app/services/impl/jerarquias.service';
import { Jerarquia } from 'src/app/models/jerarquia';
import { Equipo } from 'src/app/models/equipo';

@Component({
  selector: 'app-informacion-solicitud-cancelacion',
  templateUrl: './informacion-solicitud-cancelacion.component.html',
  styleUrls: ['./informacion-solicitud-cancelacion.component.scss']
})
export class InformacionSolicitudCancelacionComponent implements OnInit {
  public document: Documento;
  public interruptor: boolean;
  public inputAlcance: string;
  public inputProceso: string;
  public inputGerencia: string;
  public inputCodigo: string;
  private bsModalRef: BsModalRef;

  listaTiposSolicitud:any[];
  loading:boolean;
  idDocumento:number;
  tipoSolicitud:string;

  indCancelacion:string;
  estadoEditable:boolean;

  item:Cancelacion;
  errors:any;
  todosCheck:boolean;

  tabName:any;

  listaEstadosDocumento:any[];
  jerar:Jerarquia=new Jerarquia();
  @Output() documentEvent = new EventEmitter<Documento>();

  estadosValidos:string;

  constructor(private bsModalService: BsModalService, 
    private tareaService: TareaService,
    private generalService:GeneralService,
    private bandejaDocumentoService:BandejaDocumentoService,
    private toastr:ToastrService,
    private servicioValidacion:ValidacionService,
    private spinner: NgxSpinnerService,
    private serviceRelacion: RelacionCoordinadorService,
    private serviceJerarquia:JerarquiasService) { 
      this.errors = {};
      this.tabName = "information";
    }

  ngOnInit() {
    this.indCancelacion = localStorage.getItem("indCancelacion");
    this.todosCheck = true;
    this.estadoEditable = true;
    this.inicializarCampos();
    this.obtenerEstadosDocumento();
  }

  inicializarCampos() {
    this.item = new Cancelacion();
    this.tipoSolicitud = "";  
    this.inputAlcance = '';
    this.inputProceso = '';
    this.inputGerencia = '';
    this.inputCodigo = '';
    this.listaTiposSolicitud = [];
    this.obtenerParametros();
    this.tareaService.documento.subscribe( document => this.document = document);
    this.tareaService.interruptor.subscribe( interruptor => this.interruptor = interruptor);
  }

  abrirModelBusquedaDocumento() {
    

    if (this.item.numTipoCancelacion == "") {
      this.toastr.error('Se requiere seleccionar un tipo solicitud', 'Atención', { closeButton: true });
    } else {

      const configuracion = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
          //busquedaEstadosSolicitudCancelacion: this.estadosValidos
          proCancel: true,
          tipoCancel:this.item.numTipoCancelacion
        },
        class: 'modal-lg'
      };
      this.bsModalRef = this.bsModalService.show(BusquedaDocumentoComponent, configuracion);
      (<BusquedaDocumentoComponent>this.bsModalRef.content).onClose.subscribe((objetoModal: Documento) => {
        this.tareaService.obtenerCantidadSolicitudesCancelacion(objetoModal.id).subscribe((response: Response) => {
          

          let cantidad: number = response.resultado;
          console.log(cantidad);
          if (cantidad > 0) {
            this.toastr.error('El documento ya cuenta con una solicitud de cancelación', 'Error', { closeButton: true });
          } else {
            console.log("Respuesta Modal");
            console.log(objetoModal);
            this.actualizarInputs(objetoModal);
            this.enviarDocumento();

            let objetoDat: Documento = new Documento;
            objetoDat = JSON.parse(sessionStorage.getItem("objeto"));
            if (objetoDat != undefined) {
              let idGerencia = objetoDat.jgerencia.idJerarquia;
              let idAlcance = 0;
              if (objetoDat.jalcanceSGI != undefined) {
                idAlcance = objetoDat.jalcanceSGI.idJerarquia;
              }
              this.obtenerJeraquiaPadre(Number(idGerencia), Number(idAlcance));

            }

          }

        },
        );
      });

    }
  }

  enviarDocumento() {
    this.tareaService.cambioDocumento(this.document);
    this.tareaService.cambioInterruptor(this.interruptor);
    this.documentEvent.emit(this.document);
  }

  actualizarInputs(objetoModal: Documento): void {
    if(this.document != undefined && this.document != null){
      let documentoActual:Documento = Object.assign({},this.document);
      if(documentoActual.id != objetoModal.id){
        this.tareaService.cambioDocumentoValida(true);
      }else{
        this.tareaService.cambioDocumentoValida(false);
      }
    }else{
      this.tareaService.cambioDocumentoValida(false);
    }
    

    if (objetoModal.codigo === null) {
      this.item.codigoDocumento = '';
    } else {
      this.item.codigoDocumento = objetoModal.codigo;
    }

  


    if (objetoModal.jalcanceSGI == null) {
      this.item.descripcionAlcance = '';
    } else {
      this.item.descripcionAlcance = objetoModal.jalcanceSGI.descripcion;
    }

    if (objetoModal.jproceso == null) {
      this.item.descripcionProceso = '';
    } else {
      this.item.descripcionProceso = objetoModal.jproceso.descripcion;
    }

    

    if (objetoModal.jgerencia == null) {
      this.item.descripcionGerencia = '';
    } else {
      this.item.descripcionGerencia = objetoModal.jgerencia.descripcion;
    }

    
    //this.Validar();
    this.validacionSingularDistinta(this.item,"descripcionGerencia",this.errors);
    this.validacionSingularDistinta(this.item,"codigoDocumento",this.errors);
    this.document = objetoModal;
    this.idDocumento = objetoModal.id;
    this.interruptor =  true;

    

  }

  obtenerJeraquiaPadre(codigo:number,idAlcance:number){
    this.serviceJerarquia.buscarPorCodigoIdPadre(codigo).subscribe(
      (response:Response)=>{
        
       
         this.jerar=response.resultado;
        let idGere=this.jerar[0].idPadre;
        this.obtenerColaborador(Number(idGere),Number(idAlcance)); 
      },
        (error) => this.controlarError(error)
    );
  }
  obtenerColaborador(idGerencia: number, idAlcance: number) {
    
    let veleccionAprobador: string = sessionStorage.getItem("eleccionAprobador");
    sessionStorage.removeItem("eleccionAprobador");

    if (veleccionAprobador == 'SoliCancel') {
      let listadedocumento: Documento = JSON.parse(sessionStorage.getItem("listaEquipoDetalle"));
      sessionStorage.removeItem("listaEquipoDetalle");

      if (listadedocumento != undefined) {
        for (let index = 0; index < listadedocumento.listaEquipo.length; index++) {
          if (listadedocumento.listaEquipo[index].indicadorResponsable == 1) {
            this.serviceRelacion.obtenerJefeEquipo(listadedocumento.listaEquipo[index].id).subscribe(
              (numeroFicha: Response) => {
                
                sessionStorage.setItem('coordinador', JSON.stringify(numeroFicha.resultado));
              },
              (error) => this.controlarError(error)
            );
          }
        }
      }
    } else {
      this.serviceRelacion.obtenerDatosCoordinador(idGerencia, idAlcance).subscribe(
        (response: Response) => {
          
          let datosCoordinador: RelacionCoordinador[] = response.resultado;
          sessionStorage.setItem('coordinador', JSON.stringify(datosCoordinador[0].nroFicha));
        },
        (error) => this.controlarError(error)
      );
    }
  }

  obtenerParametros(){
    let buscaEntidades = this.generalService.obtenerParametroPadre(NombreParametro.listaTipoSolicitudCancelacion);
    this.loading = true;
    forkJoin(buscaEntidades)
      .subscribe(([buscaEntidades]:[Response])=>{
        this.loading = true;
        this.listaTiposSolicitud = buscaEntidades.resultado;
      },
      (error) => this.controlarError(error));
  }

  controlarError(error) {
    console.error(error);
    this.spinner.hide();
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  enviarDatosCancelacion(solicitudCancelacion:Cancelacion){
    this.idDocumento = solicitudCancelacion.idDocumento;
    if(this.indCancelacion == "1"){
      if(solicitudCancelacion.estadoSolicitud == EstadosCancelacion.RECHAZADO){
        this.estadoEditable = false;
      }else{
        this.estadoEditable = true;
      }
    }
    

    this.item.numTipoCancelacion = solicitudCancelacion.numTipoCancelacion;
    this.llenarDatos(this.idDocumento);
  }

  llenarDatos(idDocumento){
    this.bandejaDocumentoService.buscarPorCodigo(idDocumento).subscribe((response:Response)=>
    {
    this.spinner.hide();
     let documento:Documento = response.resultado;
     sessionStorage.removeItem("idCoordinadorCancel");
     sessionStorage.setItem('idCoordinadorCancel', JSON.stringify(documento.coordinador.idColaborador));
     console.log("Documento obtenido");
     console.log(documento);
     this.actualizarInputs(documento);
      this.enviarDocumento();
    },
    (error) => this.controlarError(error))
  }

  Valida(objectForm) {
    
    let prueba = this.item.numTipoCancelacion;
    if (prueba == '775') {
      let variable: string = ",";
      variable = variable + "117,";
      this.estadosValidos = variable;
    } else {
      this.obtenerEstadosDocumento();
    }
    this.item.descripcionGerencia = '';
    this.item.codigoDocumento = '';
    (this.item as any).todosCheck = this.todosCheck;
    this.servicioValidacion.validacionSingular(this.item, objectForm, this.errors);
  }

  Validar(objectForm) {
    
    let prueba = this.item.numTipoCancelacion;
    if (prueba == '775') {
      let variable: string = ",";
      variable = variable + "117,";
      this.estadosValidos = variable;
    } else {
      this.obtenerEstadosDocumento();
    }
    (this.item as any).todosCheck = this.todosCheck;
    this.servicioValidacion.validacionSingular(this.item, objectForm, this.errors);
  }

  validacionSingularDistinta(modelo:any,atributo:string,errorsGlobal:any){
    validate(modelo).then( errors => {
      
       errorsGlobal[atributo] = "";
       if (errors.length > 0) {
         console.log("error singular",errors);
        errors.map(e => {
          
          if(e.property == atributo){
            errorsGlobal[e.property] = e.constraints[Object.keys(e.constraints)[0]];
           return;
          }
           
         });
       }
  
     });
  }

  validarCampos(){
    this.errors = {};
    this.servicioValidacion.validacionObjeto(this.item,this.errors);
  }

  obtenerEstadosDocumento(){
    
    let buscaEstados = this.generalService.obtenerParametroPadre(NombreParametro.listaEstadosDocumento);
    
    forkJoin(buscaEstados)
      .subscribe(([buscaEstados]:[Response])=>{
                
        this.listaEstadosDocumento = buscaEstados.resultado;
        let variable:string = ",";
              
        for(let item of this.listaEstadosDocumento){
          if(item.v_valcons != "Cancelado"){
            
            variable = variable + item.idconstante + ",";
          }
        }
        this.estadosValidos = variable;

      },
      (error) => this.controlarError(error));
  }


}

import { Component, OnInit, ViewChild, Input,EventEmitter,Output } from '@angular/core';
//import {BandejaDocumento, Paginacion,RevisionDocumento} from '../../../models';
import { Subject } from 'rxjs';
//import { Response } from '../../../models/response';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { validate } from 'class-validator';
import { Constante } from 'src/app/models/enums/constante';
import { ValidacionService, ParametrosService, ColaboradoresService } from 'src/app/services';
import { Constante as constanteRevision } from 'src/app/models/constante';
import { BandejaDocumento, RevisionDocumento, SolicitudCopiaDocumento,Paginacion, Documento, Parametro } from 'src/app/models';
import { Response } from 'src/app/models/response'; 
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BusquedaDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento.component';
//import { ModalAñadirCopiaImpresaComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/copiaImpresa-modal-a\u00F1adir/modal-a\u00F1adir-copiaImpresa.component';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { AgregarDestinatarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-destinatario.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { GeneralService } from 'src/app/services/impl/general.service';
import { BitacoraComponent } from 'src/app/modules/bandejadocumento/copiaImpresa/components/bitacora.component';
//import { TabGroupAnimationsCopiaImpresa } from 'src/app/modules/bandejadocumento/copiaImpresa/views/tab-group-animations-copiaImpresa';
import { BusquedaDocumentoSolicitudCopiaComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento-solicitud-copia.component';
import { SessionService } from 'src/app/auth/session.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
  selector: 'copia-impresa-solicitud',
  templateUrl: 'solicitud.template.html'
})
export class SolicitudComponent implements OnInit {
  @Output()  extrametododepadre: EventEmitter<any> =  new EventEmitter<any>();
  [x: string]: any;
  public onClose: Subject<boolean>;
  listaTiposCopia: Parametro[]; 
  listaMotivoImpresion: Parametro[]; 
  @Input() permisos: any;
  @Input() activar  : boolean;  
  idtipo: number;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametros: Map<string, any>;
  textoBusqueda: string;
  listaRevisionOrigen:SolicitudCopiaDocumento[];
  listaRevision:SolicitudCopiaDocumento[];
  tipoCopia:string;
  tipo:number;
  sustento: string;
  nestacopi: string;
  idmotivo: string;
  parametroBusqueda: string;
  paginacion: Paginacion;
  selectedObject: RutaParticipante;
selectedRow:number;
 // listaParticipantes:RutaParticipante[];
 listaParticipantes:RutaParticipante[];
  listaColaborador:RutaParticipante[];
  objDocumento:Documento;
  placeholder:any;
  item: SolicitudCopiaDocumento;
  items: SolicitudCopiaDocumento[];
  txtDescripcionRevision:string;
  valorMotivoRevision:number;
  revision:SolicitudCopiaDocumento;
  i:number;
 errors:any;
 invalid:boolean;
 bsModalRef: BsModalRef;
 habilitaenviar: boolean;
 rutaActual:string;  
 rutaAnterior:string;  
 rutaAnteriorAnterior:string;
 

 @ViewChild('bitacora') bitacor: BitacoraComponent;
 //@ViewChild('listadestin') listadestin:TabGroupAnimationsCopiaImpresa;
  constructor(private revisionService: BandejaDocumentoService, 
    private parametroService: ParametrosService,private toastr: ToastrService,
    private servicioValidacion:ValidacionService,
    private modalService: BsModalService,
    public session: SessionService,
    private spinner: NgxSpinnerService,
    private service: RevisionDocumentoService,
    private serviceColaborador: ColaboradoresService,
    private generalService:GeneralService) {
    this.onClose = new Subject();
    this.paginacion = new Paginacion({ pagina:1,registros: 10 }); 
    this.parametros = new Map<string, any>();
    this.parametroBusqueda = "codigo";
    this.placeholder = {"codigo":"Ejem.:1234","nombreCompleto":"Ejm.: Instructivo de clase"};
    this.revision = new SolicitudCopiaDocumento();
    this.objDocumento= new Documento();
    this.revision.estado = new constanteRevision();
    this.errors = {};
    this.i=0;
    this.selectedRow = -1;  
    this.listaParticipantes = [];    
    this.listaColaborador = [];
    this.tipoCopia="";
    this.idmotivo= "";
    this.sustento="";
    this.nestacopi = "";
    this.habilitaenviar= false;
     //cguerra seguridad
      //this.rutaActual = this.router.url;
     //let item = JSON.parse(sessionStorage.getItem("item"));     
     //this.rutaAnterior = item.rutaAnterior;
     //this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
     //cguerra seguridad
  }

  ngOnInit() {
    this.spinner.show();
    let estadoSoli = localStorage.getItem("EstadoSoli"); 
    this.loading = true;
    
    this.cargarTipoMotivacion();
    this.obtenerTiposCopia();
    
    //Deshabilita Btn segun estado    
    if(estadoSoli=="Aprobado"||estadoSoli=="En Revision"){
      this.habilitaenviar = true;
    }else{
      this.habilitaenviar = false;
    }

    this.spinner.hide();
  }

  OnEliminar(indice: number, item: RutaParticipante): void {
        this.listaParticipantes.splice(indice,1);
        this.i--;
        this.paginacion.totalRegistros=this.i;  
        this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
  }
  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  cambiar(){
    console.log("motivo revi cambio "+this.revision.idmotirevi);
  }

  Validar(objectForm) {
    console.log("entroi al validar",this.revision);
    this.servicioValidacion.validacionSingular(this.revision,objectForm,this.errors);
  }
  
  OnBuscar(){       
    if (this.tipoCopia== ""){
      this.toastr.error('Se requiere seleccionar un tipo de copia', 'Atención', {closeButton: true});
    }else{    
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: { 
          tipoCopia:this.tipoCopia
         },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(BusquedaDocumentoSolicitudCopiaComponent, config);
    (<BusquedaDocumentoSolicitudCopiaComponent>this.bsModalRef.content).onClose.subscribe(resultado => {             
      console.log("RESULTADO")
      console.log(resultado);
      
      
      this.objDocumento.id = Number(resultado.nidocu);       

      this.objDocumento.codigo= resultado.vcoddocu;                     //Código del Documento
      this.objDocumento.numeroderevision = Number(resultado.nrevision); //Número de Revisión
      this.objDocumento.descripcion = resultado.vdesdocu;               //Titulo de Documento
      this.objDocumento.fecha= new Date(resultado.fechaApro);           //Fecha de Aprobación de la Revisión
       this.objDocumento.nidrevision =  resultado.nidrevi;  //id Revision       
       this.objDocumento.jgerencia.id = Number(resultado.idjerageneral);//id ruta jera
       this.objDocumento.jgerencia.descripcion= resultado.rutagerencia;
       this.objDocumento.jalcanceSGI.id=Number(resultado.idjeralc);
       this.objDocumento.jalcanceSGI.descripcion=  resultado.rutalcance;
       this.objDocumento.jproceso.id=Number(resultado.iproce);
       this.objDocumento.jproceso.descripcion= resultado.rutaproceso; 
       this.objDocumento.idUsuAprobador=resultado.idUsuAprobador; 
      localStorage.setItem("iddocumento",this.objDocumento.id+"");
      this.listaParticipantes=[];
       });       
      }
  }

  OnBuscarDestinatario(codigo: number,codigosoli:number){
    this.loading = true;
    const parametros: {idDocumento?:number, idSolicitud?:number,equipo?:string, funcion?:string, responsable?:string, estado?:string}=
    {idDocumento: codigo,idSolicitud: codigosoli, equipo:null, funcion:null, responsable:null, estado:"1"};
    if(this.equipo!=null)      parametros.equipo     =this.equipo+"";
    if(this.funcion!=null)     parametros.funcion    =this.funcion;
    if(this.responsable!=null) parametros.responsable=this.responsable;
    this.serviceColaborador.buscarDestinatario(parametros,1, 1000).subscribe(
      (response: Response) => {  
  
        this.listaColaborador = response.resultado;
        this.loading = false;        
        for(let colab of this.listaColaborador){
          let rutaPartipante:RutaParticipante = new RutaParticipante();
          rutaPartipante.responsable = colab.nombreCompleto;
          rutaPartipante.equipoColaborador = colab.equipo.descripcion;
          rutaPartipante.estadoSoli = colab.estadoSoli;    
          rutaPartipante.idsolicitud= colab.idsolicitud;  
          rutaPartipante.idColaborador= colab.idColaborador;    
          this.listaParticipantes.push(rutaPartipante);        
        /*capturamos el Id de Copiasolicitud para poder Identificar si es Nuevo o Modificar  */ 
        localStorage.setItem("idSolicitud",rutaPartipante.idsolicitud);
        /*capturamos el Id de Copiasolicitud para poder Identificar si es Nuevo o Modificar  */
        }        
        this.generalService.agregarItem(this.listaParticipantes,this.paginacion);
        
      },
      (error) => this.controlarError(error)
    );
  }

  obtenerTiposCopia() {    
    this.parametroService.obtenerParametroPadre(Constante.TIPO_COPIA).subscribe((response: Response) => {      
    this.listaTiposCopia = response.resultado;     
    console.log("thipocopia")
    console.log(this.tipoCopia)
    
    }, (error) => {
      console.log(error);
    });
    this.loading = false;
  }

  cargarTipoMotivacion(){    
    this.parametroService.obtenerParametroPadre(Constante.TIPO_MOTIVO_IMPRESION).subscribe(
      (response:Response)=>{
        this.listaMotivoImpresion = response.resultado;        
      }
    );
  }
  obtenerRequestRevision():SolicitudCopiaDocumento{ 
         
    this.revision.id              = this.objDocumento.id
    this.revision.tipoCopia       = this.tipoCopia;     
    this.revision.motivoR         = this.idmotivo;
    this.revision.tabName         = "solicitud";
    this.revision.numero          = this.objDocumento.numeroderevision;
    this.revision.descripcion     = this.objDocumento.descripcion;
    this.revision.gerencia        = this.objDocumento.jgerencia.id;
    this.revision.codigo          = this.objDocumento.codigo;    
    this.revision.alcance         = this.objDocumento.jalcanceSGI.id+"";
    this.revision.proceso         = this.objDocumento.jproceso.id+"";
    this.revision.sustento        = this.sustento; 
    this.revision.nestcopi        = this.nestacopi;
    this.revision.idUsuAprobador  =this.objDocumento.idUsuAprobador;

    
    this.revision.nidrevision= this.objDocumento.nidrevision;//Id Revisión
    

    return this.revision;
  }

  OnAgregar(){ 
     
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(AgregarDestinatarioComponents, config);
    (<AgregarDestinatarioComponents>this.bsModalRef.content).onClose.subscribe(result => { 
      
      this.listaParticipantes.push(result); 
      this.generalService.agregarItem(this.listaParticipantes,this.paginacion);     
    });
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  } 


}

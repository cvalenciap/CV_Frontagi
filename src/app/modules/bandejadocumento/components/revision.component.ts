import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento, Paginacion,RevisionDocumento} from '../../../models';
import { Subject } from 'rxjs';
import { Response } from '../../../models/response';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { validate } from 'class-validator';
import { Constante } from 'src/app/models/enums/constante';
import { ValidacionService } from 'src/app/services';
import { Constante as constanteRevision } from 'src/app/models/constante';
import { ActivatedRoute ,Router } from '@angular/router';
import { VerDocumentoComponents } from 'src/app/modules/bandejadocumento/modales/ver-documento.component';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { SessionService } from 'src/app/auth/session.service';


@Component({
  selector: 'bandeja-documento-revision',
  templateUrl: 'revision.template.html'
})

export class RevisionComponent implements OnInit {
  public onClose: Subject<boolean>;
  @Input() activar  : boolean;
  @Input() permisos: any;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametros: Map<string, any>;
  textoBusqueda: string;
  listaRevisionOrigen:RevisionDocumento[];
  listaRevision:RevisionDocumento[];
  listaRevisionHist:RevisionDocumento[];
  parametroBusqueda: string;
  paginacion: Paginacion;
  placeholder:any;
  listaParametrosPadre:any[];
  txtDescripcionRevision:string;
  valorMotivoRevision:number;
  revision:RevisionDocumento;
  errors:any;
  invalid:boolean;
  codDocu: string;
  desDocu: string;
  numRevi: number;
  fecRevi: Date;
  antiguedadDocu: number;
  periodoOblig: number;
  responsableEquipo: string;
  codigo: number;
  rutaActual:string;  
    rutaAnterior:string;  
    rutaAnteriorAnterior:string;

  constructor(private revisionService: BandejaDocumentoService,
    private route: ActivatedRoute,
    private toastr: ToastrService,
    private router: Router,
    private session: SessionService,
    private servicioValidacion:ValidacionService,
    private modalService: BsModalService,) {
    this.onClose = new Subject();
    this.paginacion = new Paginacion({ pagina:1,registros: 10 }); 
    this.parametros = new Map<string, any>();
    this.parametroBusqueda = "codigo";
    this.placeholder = {"codigo":"Ejem.:1234","nombreCompleto":"Ejm.: Instructivo de clase"};
    this.revision = new RevisionDocumento();
    this.revision.estado = new constanteRevision();
    this.errors = {};
    this.codigo = 0;
     //cguerra seguridad
     this.rutaActual = this.router.url;
     let item = JSON.parse(sessionStorage.getItem("item"));     
     this.rutaAnterior = item.rutaAnterior;
     this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
     //cguerra seguridad
  }

  ngOnInit() {

    
    this.loading = false;
    this.cargarTipoMotivacion();
  }

  cargarTipoMotivacion(){
    
    this.revisionService.obtenerParametroPadre(Constante.ESTADO_MOTIVO_REVIS).subscribe(
      (response:Response)=>{
        this.listaParametrosPadre = response.resultado;
      }
    );
  }
 
  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  obtenerRequestRevision(estado:number):RevisionDocumento{
    if(!this.revision.id){
      let constante: constanteRevision = new constanteRevision();
      constante.idconstante = estado;
      this.revision.estado = this.revision.id?this.revision.estado:constante;
      
    }

    this.revision.tabName = "revision";
    return this.revision;
  }

  cambiar(){
    //console.log("motivo revi cambio "+this.revision.idmotirevi);
  }

  Validar(objectForm) {
    //console.log("entroi al validar",this.revision);
    this.servicioValidacion.validacionSingular(this.revision,objectForm,this.errors);
    sessionStorage.setItem('revisionIdmotivo', JSON.stringify(this.revision.idmotirevi));
    sessionStorage.setItem('revisionDescripcion', JSON.stringify(this.revision.descripcion));
  }


  OnHistorialDoc(idDocu, idRevision){
    
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
          codigo: idDocu,
          idRevision: idRevision
        },
        class: 'modal-lg'
    }
    const modalDocumento = this.modalService.show(VerDocumentoComponents, config);
    (<VerDocumentoComponents>modalDocumento.content).onClose.subscribe(result => {
        let objeto:boolean = result;
    });
  }
  
}

import { Component, OnInit, Input } from '@angular/core';
//import {BandejaDocumento, Paginacion,RevisionDocumento} from '../../../models';
import { Subject } from 'rxjs';
//import { Response } from '../../../models/response';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { validate } from 'class-validator';
import { Constante } from 'src/app/models/enums/constante';
import { ValidacionService } from 'src/app/services';
import { Constante as constanteRevision } from 'src/app/models/constante';
import { BandejaDocumento, RevisionDocumento, Paginacion, SolicitudCopiaDocumento } from 'src/app/models';
import { Response } from 'src/app/models/response';


@Component({
  selector: 'copia-impresa-critica',
  templateUrl: 'critica.template.html'
})
export class CriticaComponent implements OnInit {
  public onClose: Subject<boolean>;
  @Input() activar  : boolean;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametros: Map<string, any>;
  textoBusqueda: string;
  listaRevisionOrigen:SolicitudCopiaDocumento[];
  listaRevision:SolicitudCopiaDocumento[];
  parametroBusqueda: string;
  paginacion: Paginacion;
  
  placeholder:any;
  listaParametrosPadre:any[];
  txtDescripcionRevision:string;
  valorMotivoRevision:number;
  revision:SolicitudCopiaDocumento;
  critica: string;
 errors:any;
 invalid:boolean;
  constructor(private revisionService: BandejaDocumentoService,private toastr: ToastrService,
    private servicioValidacion:ValidacionService    ) {
    this.onClose = new Subject();
    this.paginacion = new Paginacion({ pagina:1,registros: 10 }); 
    this.parametros = new Map<string, any>();
    this.parametroBusqueda = "codigo";
    this.placeholder = {"codigo":"Ejem.:1234","nombreCompleto":"Ejm.: Instructivo de clase"};
    this.revision = new SolicitudCopiaDocumento();
    this.revision.estado = new constanteRevision();
    this.errors = {};
    this.critica = '';
    
  }

  ngOnInit() {
    this.loading = false;
    
    
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

  obtenerRequestRevision(estado:number):SolicitudCopiaDocumento{
    if(!this.revision.id){
      let constante: constanteRevision = new constanteRevision();
      constante.idconstante = estado;
      this.revision.estado = this.revision.id?this.revision.estado:constante;
    }

    this.revision.tabName = "revision";
    return this.revision;
  } 
  
obtenerRequestCritica():SolicitudCopiaDocumento{    
  
this.revision.resumenCritica = this.critica;
/*if(this.critica !=null){
  this.revision.resumenCritica = this.critica;
}else{
  (error) => this.controlarError(error)
}*/
this.revision.tabName = "critica";
return this.revision;
}

  cambiar(){
    console.log("motivo revi cambio "+this.revision.idmotirevi);
  }

  Validar(objectForm) {
    console.log("entroi al validar",this.revision);
    this.servicioValidacion.validacionSingular(this.revision,objectForm,this.errors);
  }
  validarCampos(){
    this.errors = {};
    this.servicioValidacion.validacionObjeto(this.revision,this.errors);
  }

}

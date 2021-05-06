import { Component, OnInit } from '@angular/core';
import {Paginacion, Response} from '../../../../models';
import { GeneralService, ValidacionService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { NombreParametro, FormatoCarga } from 'src/app/constants/general/general.constants';
import { Cancelacion } from 'src/app/models/cancelacion';
import { validate } from 'class-validator';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/auth/session.service';

@Component({
  selector: 'app-sustento-solicitud-cancelacion',
  templateUrl: './sustento-solicitud-cancelacion.component.html',
  styleUrls: ['./sustento-solicitud-cancelacion.component.scss']
})
export class SustentoSolicitudCancelacionComponent implements OnInit {
  public selectedRow: number;
  public paginacion: Paginacion;
  public item: any;

  motivo:string;
  sustentoCancelacion:string;
  archivoSustento:any;
  nombreArchivoSustento:string;
  rutaArchivoSustento:string;
  SizeFile:number;
  listaMotivos:any[];
  loading:boolean;
  valorFinal1:boolean;
  indCancelacionSustento:string;
  indCancelacionSustento1:string;
  valorFinal:boolean;
  indCancelacion: String;
  sustentoRechazo:string;
  cancel:Cancelacion;

  todosCheck:boolean;

  errors:any;
  tabName:any;

  constructor(private generalService:GeneralService,
              private toastr: ToastrService,
              private servicioValidacion:ValidacionService,
              private router: Router,
              public session: SessionService) {
    this.todosCheck = true;
    this.paginacion = new Paginacion({registros: 10});
    this.errors = {};
    this.tabName = "livelihood";
  }

  ngOnInit() {
    
    this.indCancelacionSustento = localStorage.getItem("indCancelacionSustento");
    this.indCancelacion = localStorage.getItem("indCancelacion");
    if(this.indCancelacion=="1"){
      this.valorFinal = false;    
    }else{
      this.valorFinal = true;     
    }
    //this.indCancelacion = localStorage.getItem("indCancelacion");
    this.cancel = new Cancelacion();
    this.motivo = "";
    this.sustentoCancelacion = "";
    this.loading = false;
    this.obtenerParametros();
  }

  OnRowClick(numero: number, item: any) {}

  OnPageChanged(event) {}

  OnPageOptionChanged(event) {}

  archivoCambio() {}

  selectFile() {}

  obtenerParametros(){
    let buscaEntidades = this.generalService.obtenerParametroPadre(NombreParametro.listaMotivoCancelacion);
    this.loading = true;
    forkJoin(buscaEntidades)
      .subscribe(([buscaEntidades]:[Response])=>{
        this.loading = false;
        this.listaMotivos = buscaEntidades.resultado;
      },
      (error) => this.controlarError(error));
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  adjuntarArchivo(event:any){
    
    this.SizeFile = event.target.files[0].size;  
    if(event.target.files.length>0){
      if (this.SizeFile > 40000000) {
        this.toastr.warning('El documento excede el tamaño permitido 40MB.','Atención', {closeButton: true});           
}else{ 
      if(FormatoCarga.word == event.target.files[0].type || FormatoCarga.wordAntiguo == event.target.files[0].type){
      
      this.archivoSustento= event.target.files[0];
      this.cancel.nombreArchivoSustento = event.target.files[0].name;
      this.validacionSingularDistinta(this.cancel,"nombreArchivoSustento",this.errors);
      }else{
        this.toastr.warning('Solo se permite archivo Word', 'Atención', {closeButton: true});
      }
    }
    }
  }

  enviarDatosCancelacion(solicitudCancelacion:Cancelacion){
    
    this.cancel.numMotivoCancelacion = solicitudCancelacion.numMotivoCancelacion;
    this.cancel.sustentoSolicitud = solicitudCancelacion.sustentoSolicitud;
    this.cancel.nombreArchivoSustento = solicitudCancelacion.nombreArchivoSustento;
    this.cancel.sustentoRechazo = solicitudCancelacion.sustentoRechazo;
    this.sustentoRechazo = solicitudCancelacion.sustentoRechazo;
    let ruta:string = solicitudCancelacion.rutaArchivoSustento;
    this.rutaArchivoSustento = ruta+"?download=1";
    console.log("rechazo");
    console.log(this.sustentoRechazo);
    console.log(this.rutaArchivoSustento);
  }

  Validar(objectForm) {
    
    (this.cancel as any).todosCheck = this.todosCheck;
    this.servicioValidacion.validacionSingular(this.cancel,objectForm,this.errors);

  }

  validarCampos(){
    
    this.errors = {};
    this.servicioValidacion.validacionObjeto(this.cancel,this.errors);
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



}

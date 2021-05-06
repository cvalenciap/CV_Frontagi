import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoMockService, ParametrosService } from 'src/app/services';
import {Response} from '../../../../models/response';
import { RevisionDocumento, Paginacion } from 'src/app/models';
import { Estado } from 'src/app/models/enums/estado';
import { Constante } from 'src/app/models/enums/constante';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';

@Component({
  selector: 'app-busqueda-programacion',
  templateUrl: './busqueda-programacion.component.html'
  //styleUrls: ['./bitacora.component.scss']
})
export class BusquedaProgramacionComponent implements OnInit {
  public onClose: Subject<RevisionDocumento>;
  showNumAntiguedad:boolean;
  constanteRevision:any;
  //tipoParticipante:string;
  txtSolicitante:string;
  slEstadoSol:string;
  txtFecha:string;
  loading: boolean;
  listaEquipos: Estado[];
  listaEstadoProgramacion: any[];
  /* paginación */
  paginacion: Paginacion;
  items: any;
  codigoProg: string;
  anioProg: number;
  estProg: number;
  deshabilitarBuscar: boolean;

  constructor(public bsModalRef: BsModalRef,private service: RevisionDocumentoService,
                                            private serviceParametro: ParametrosService) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.showNumAntiguedad = false;
    this.estProg = 0;
    this.paginacion = new Paginacion({registros: 10});
    this.items = [];    
    this.anioProg = 0;
    this.deshabilitarBuscar = true;
   }

   OnLimpiar(){
   this.deshabilitarBuscar=true;
   this.codigoProg = '';
   this.anioProg = 0;
   this.estProg = 0;
   }

  ngOnInit() {
    this.loading = false;
    //console.log("participante ", this.bsModalRef);
    this.onClose = new Subject();
    this.listaEstadoProgramacion = new Array<any>();
    this.obtenerEstados();
    this.obtenerAniosProg();
  }

  habilitarBusqueda(): void {
    
    if(this.codigoProg!='' || this.anioProg!=0 || this.estProg!=0){
      this.deshabilitarBuscar=false;
    }else{
      this.deshabilitarBuscar=true;
    }
  }

  OnBuscar(): void {
    let objeto:RevisionDocumento=new RevisionDocumento();
    objeto.codigo=this.codigoProg;
    objeto.anio=this.anioProg;
    objeto.estados=this.estProg; 
    
    if (this.estProg) {
      objeto.desestado=this.obtenerDescEstado(this.estProg);
    }   
    
    objeto.tipobusq='avanzada';
    this.onClose.next(objeto);
    this.bsModalRef.hide();
  }

  obtenerDescEstado(idEstado){
    
    let desEstado: any = this.listaEstadoProgramacion.find(obj => obj.idconstante == idEstado);
    return desEstado.v_valcons;
  }

  obtenerEstados(){
    
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_PROGRAMACION).subscribe(
      (response: Response) => {
          this.listaEstadoProgramacion = response.resultado;
      }, (error) => this.controlarError(error));
  }

  obtenerAniosProg(){
    
    const parametros: {codigo?: string, año?: string, estado?: string} =
    {codigo: null, año:null, estado: null};
    this.service.buscarPorParametrosProgram(parametros, 0, 0/*this.paginacion.pagina, this.paginacion.registros*/).subscribe(
      (response: Response) => {
          /*let listaProgramacion:RevisionDocumento[] = response.resultado;            
          listaProgramacion.forEach(documento => {
          
          });*/
          console.log("Inicio");
          console.log(response.resultado);
          console.log("Fin");
          this.items = response.resultado;
          //this.paginacion = new Paginacion(response.paginacion);
          //this.loading = false;            
        },
      (error) => this.controlarError(error)
    );
  }

  //onBuscar(){
    //let parametros = {"solicitante":this.txtSolicitante,"estaSolicitud":this.slEstadoSol,"fecSolicitud":this.txtFecha};
    
    //this.service.buscarPorParametros(parametros).subscribe(
      //(response: Response) => {
        //this.itemsAll = response.resultado;
        //this.paginacion = new Paginacion(response.paginacion);
        //console.log("resultado de busqueda parametros ", response);
        //this.bsModalRef.hide();
        //this.onClose.next(response);
       
      //(error) => this.controlarError(error)
    //}
    //);
      
  //}
    controlarError(error) {
      alert(error);
    }

    permitirNumero(evento): void {
      if(!(evento.which>=48 && evento.which<=57))
        evento.preventDefault();
    }
}

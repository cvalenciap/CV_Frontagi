import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoMockService, ParametrosService } from 'src/app/services';
import {Response} from '../../../../models/response';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
//import { RevisionDocumento } from 'src/app/models';
import { Constante } from 'src/app/models/enums/constante';
import { RevisionDocumento, Paginacion } from 'src/app/models';
import { RegistroElaboracioncomponts } from 'src/app/modules/bandejadocumento/modales/registro-elaboracion.component';
import { forEach } from '@angular/router/src/utils/collection';

@Component({
  selector: 'app-busqueda-distribucion',
  templateUrl: './busqueda-distribucion.component.html'
  //styleUrls: ['./bitacora.component.scss']
})
export class BusquedaDistribucionComponent implements OnInit {
  public onClose: Subject<RevisionDocumento>;
  showNumAntiguedad:boolean;
  constanteRevision:any;
  //tipoParticipante:string;
  txtSolicitante:string;
  slEstadoSol:string;
  txtFecha:string;
  items: any;
  anioProg: number;
  numProg: string;
  listaEstadoProgramacion: any[];
  listaEstadoEjecucion: any[];
  estProg: number;
  estEjec: number;
  idequipo: string;
  descripcionequipo: string;
  deshabilitarBuscar: boolean;
  deshabilitarLimpiar: boolean;
  listaEquipos: any;
  listaSinFormato: string;
  vIdEstProg: number;
  mostraEstado: boolean;

  constructor(public bsModalRef: BsModalRef, private service: RevisionDocumentoService, private serviceParametro: ParametrosService, private modalService: BsModalService) {
    this.anioProg = 0;
    this.constanteRevision = REVISION;
    this.showNumAntiguedad = false;
    this.items = [];
    this.numProg = '';
    this.estProg = 0;
    this.estEjec = 0;
    this.deshabilitarBuscar = true;
    this.deshabilitarLimpiar = true;
    this.idequipo = '';
    this.descripcionequipo = '';
    this.listaEstadoProgramacion = [];
    this.listaEstadoEjecucion = [];
    this.mostraEstado = false;
   }

  ngOnInit() {
    this.onClose = new Subject();
    this.obtenerAniosProg();
    this.obtenerEstadosProgram();

    if (this.vIdEstProg) {
      this.estProg = this.vIdEstProg;
      this.mostraEstado = true;
    } else {
      this.mostraEstado = false;
    }

  }

  obtenerEstadosProgram(){
    
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_PROGRAMACION).subscribe(
      (response: Response) => {
          this.listaEstadoProgramacion = response.resultado;
      }, (error) => this.controlarError(error));
  }

  OnLimpiar(){
    this.anioProg = 0;
    this.numProg = '';
    this.estProg = 0;
    this.estEjec = 0;
  }

  OnBuscar(){
    
    let objeto:RevisionDocumento=new RevisionDocumento();
    
    objeto.codigo=this.numProg;
    objeto.anio=this.anioProg;

    this.listaSinFormato = this.listaSinFormato;//localStorage.getItem("listaEquiposSelecc");
    if (this.listaSinFormato) {
      this.listaEquipos = JSON.parse(this.listaSinFormato); 
    }
    let idEquipoAcum = "";
    let descEquipoAcum = "";
    if(this.listaEquipos){
      for(let i:number = 0; i<this.listaEquipos.length; i++){      
        idEquipoAcum = idEquipoAcum + this.listaEquipos[i].id + ",";
        descEquipoAcum = descEquipoAcum + this.listaEquipos[i].descripcion + ", ";
      }
    }

    if (idEquipoAcum) {
      objeto.idequipo = ","+idEquipoAcum;  
    }
    
    objeto.estados=this.estProg;
    objeto.idestadoejec=this.estEjec;
    
    if (this.estProg) {
      objeto.desestado=this.obtenerDescEstado(this.estProg);
    }
    if (this.estEjec) {
      objeto.desestadoejec=this.obtenerDescEstadoEjec(this.estEjec);
    }
    if (descEquipoAcum) {
      let descEquipoFinal = descEquipoAcum.substring(0,descEquipoAcum.length-2);
      objeto.descequipo = descEquipoFinal;
      this.descripcionequipo = descEquipoFinal;
    }
    
    

    objeto.tipobusq='avanzada';    
    this.onClose.next(objeto);
    this.bsModalRef.hide();  
  }

  obtenerDescEstado(idEstado){
    let desEstado: any = this.listaEstadoProgramacion.find(obj => obj.idconstante == idEstado);
    return desEstado.v_valcons;
  }
  
  obtenerDescEstadoEjec(idEstadoEjec){
    let desEstadoEjec: any = this.listaEstadoEjecucion.find(objEstEjec => objEstEjec.idconstante == idEstadoEjec);
    return desEstadoEjec.v_valcons;
  }

  controlarError(error) {
    alert(error);
  }

  permitirNumero(evento): void {
    if(!(evento.which>=48 && evento.which<=57))
      evento.preventDefault();
  }

  obtenerAniosProg(){
    
    const parametros: {codigo?: string, año?: string, estado?: string} =
    {codigo: null, año:null, estado: null};
    this.service.buscarPorParametrosProgram(parametros, 0, 0/*this.paginacion.pagina, this.paginacion.registros*/).subscribe(
      (response: Response) => {
          this.items = response.resultado;
      },
      (error) => this.controlarError(error)
    );
  }

  habilitarBusqueda(): void {
    
    if(this.numProg!="" || this.anioProg!=0 || this.idequipo!="" || this.descripcionequipo!=null ||
      this.estProg!=0 || 
      this.estEjec!=0){
      this.deshabilitarBuscar=false;
      this.deshabilitarLimpiar=false;
    }else{
      this.deshabilitarBuscar=true;
      this.deshabilitarLimpiar=true;
    }
  }

  OnEquipo() {
    
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    const abrirEquipo = this.modalService.show(RegistroElaboracioncomponts, config);
    (<RegistroElaboracioncomponts>abrirEquipo.content).onClose.subscribe(result => {
      
      this.habilitarBusqueda();
      this.listaSinFormato = localStorage.getItem("listaEquiposSeleccion");
      this.listaEquipos = JSON.parse(this.listaSinFormato);
      let descEquipoAcum = "";
      for (let i: number = 0; i < this.listaEquipos.length; i++) {
        descEquipoAcum = descEquipoAcum + this.listaEquipos[i].descripcion + ", ";
      }
      let descEquipoFin = descEquipoAcum.substring(0, descEquipoAcum.length - 2);
      this.descripcionequipo = descEquipoFin;
    });
  }

}

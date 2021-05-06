import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoMockService, ParametrosService } from 'src/app/services';
import {Response} from 'src/app/models/response';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { Constante } from 'src/app/models/enums/constante';
import { Paginacion, Instructor } from 'src/app/models';

@Component({
  selector: 'app-busqueda-instructor',
  templateUrl: './busqueda-instructor.component.html'
})
export class BusquedaInstructorComponent implements OnInit {
  public onClose: Subject<Instructor>;
  showNumAntiguedad:boolean;
  constanteRevision:any;
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

  numFicha:string;
  vnombre:string;
  vaPaterno:string;
  vaMaterno:string;

  constructor(public bsModalRef: BsModalRef, private service: RevisionDocumentoService, private serviceParametro: ParametrosService) {
  
    this.constanteRevision = REVISION;
    this.showNumAntiguedad = false;
    this.items = [];
   }

  ngOnInit() {
    
    this.onClose = new Subject();
    this.OnLimpiar();
  }

  OnLimpiar(){
    this.numFicha = null;
    this.vnombre=null;
    this.vaPaterno=null;
    this.vaMaterno=null;
  }

  OnBuscar(){
    
    
    let objeto:Instructor=new Instructor();
    
    objeto.v_codinst=this.numFicha;
    objeto.v_nominst=this.vnombre;
    objeto.v_apepatinst=this.vaPaterno;
    objeto.v_apematinst=this.vaMaterno;
    objeto.tipobusq='avanzada';

    this.onClose.next(objeto);
    this.bsModalRef.hide();   
  }

  controlarError(error) {
    alert(error);
  }

  permitirNumero(evento): void {
    if(!(evento.which>=48 && evento.which<=57))
      evento.preventDefault();
  }
  
}

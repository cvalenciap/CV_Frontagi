import { Component, OnInit } from '@angular/core';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { Response } from 'src/app/models/response';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoMockService, JerarquiasService } from 'src/app/services';
import { RevisionDocumento, BandejaDocumento, Documento, Jerarquia } from 'src/app/models';
import { Parametro } from 'src/app/models/parametro';
import { ParametrosService, BandejaDocumentoService } from 'src/app/services';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { ViewChild, EventEmitter } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { ModalArbolBusquedaAvanzadaComponents } from '../../modales/modal-arbol-busquedaAvanzada.component';

@Component({
  selector: 'app-busqueda-registro',
  templateUrl: './busqueda-registro.component.html',
  styleUrls: ['busqueda-registro.component.scss']  
})
export class BusquedaRegistroComponent implements OnInit {
  public onClose: Subject<RevisionDocumento>;
  constanteRevision: any;
  txtSolicitante: string;
  listadoTipo: Jerarquia[];
  slEstadoSol: string;
  txtFecha: string;
  tipodocumento: number;
  listaTipoDocumento: any[];
  listaTipos: Parametro[];
  tipoArbol: string;
  parametroBusqueda: string;
  gerenparametrodesc: string;
  gerenparametroid: string;
  anioantiguedad: string;
  loading: boolean;
  desctipodocumento: string;
  tipodcumentoid: string;
  deshabilitaBuscar: boolean;
  idTipDoc: string;
  prioridadValidator: boolean = false;
  documentoCheck: boolean;
  showNumAntiguedad: boolean;
  todosCheck: boolean;
  idTiposDocumentos: string;
  idGerencia: string;
  cantVal:number
  deshabilitaCheck: boolean;
  parametroDescRuta: string;
  parametroId: string;
  activarBoton:boolean;

  @ViewChild(ModalArbolComponents) child: ModalArbolComponents;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private service: RevisionDocumentoMockService,
    private serviceJerarquia: JerarquiasService,
    private serviceParametro: ParametrosService,
    private modalService: BsModalService) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.tipodocumento = 0;
    this.tipoArbol;
    this.parametroBusqueda = 'tipo';
    this.gerenparametrodesc;
    this.gerenparametroid;
    this.anioantiguedad;
    this.desctipodocumento = '';
    this.idTipDoc = '';
    this.tipodcumentoid = '';
    this.deshabilitaBuscar = true;
    this.showNumAntiguedad = false;
    this.documentoCheck = false;
    this.idTiposDocumentos="";
    this.idGerencia="";
    this.cantVal = 0;
    this.listadoTipo=[];
    this.deshabilitaCheck=true;
    this.activarBoton=false;
  }

  ngOnInit() {
    this.loading = false;
    this.onClose = new Subject();

    if (this.parametroId) {
      this.gerenparametrodesc = this.parametroDescRuta;
      this.gerenparametroid = this.parametroId;
      this.activarBoton=true;
      let parametros: { idTipoDocu?: string, id?: string } = { idTipoDocu: "122", id: this.parametroId };
      this.loading = true;
      this.serviceJerarquia.obtenerJerarquiaTipoDocumento(parametros, 1, 10).subscribe(
        (response: Response) => {
          this.listadoTipo = response.resultado;
          this.listadoTipo.forEach(obj => {
            obj.seleccionado = false;
          });

          if (this.listadoTipo.length == 0) {
            this.deshabilitaCheck = true;
          } else {
            this.deshabilitaCheck = false;
          }

          this.prioridadValidator = false;
          this.loading = false;

        }, (error) => this.controlarError(error)
      )
    }

  }

  controlarError(error) {
    alert(error);
  }

  OnBuscarGerencia() {
    
    localStorage.removeItem("idProcesoSeleccionado");
    localStorage.removeItem('nodeSeleccionado'); 
    this.tipoArbol = "122";
    localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    const modalArbol = this.modalService.show(ModalArbolBusquedaAvanzadaComponents, config);
    (<ModalArbolBusquedaAvanzadaComponents>modalArbol.content).onClose.subscribe(result => {

      let objeto: BandejaDocumento = result;
      this.gerenparametrodesc = objeto.rutaCompleta;
      this.gerenparametroid = objeto.parametroid.toString();

      let parametros: { idTipoDocu?: string, id?: string } = { idTipoDocu: "122", id: this.gerenparametroid };
      this.loading = true;
      this.serviceJerarquia.obtenerJerarquiaTipoDocumento(parametros, 1, 10).subscribe(
        (response: Response) => {
          this.listadoTipo = response.resultado;
          this.listadoTipo.forEach(obj => {
            obj.seleccionado = false;
          });

          if ( this.listadoTipo.length==0) {
            this.deshabilitaCheck=true;
          } else {
            this.deshabilitaCheck=false;
          }

          this.prioridadValidator = false;
          this.loading = false;

        }, (error) => this.controlarError(error)
      )

      /*this.desctipodocumento = localStorage.getItem("txttipodocumentos");
      this.idTipDoc = localStorage.getItem("idTipDoc");
       this.gerenparametrodesc = this.gerenparametrodesc.substr(0, this.gerenparametrodesc.length - this.desctipodocumento.length - 1);
      this.gerenparametroid = objeto.parametroid.toString(); 
      if (this.gerenparametrodesc) {
        this.deshabilitaBuscar = false;
      }*/
    });
  }

  OnLimpiar() {
    this.listadoTipo=[];
    this.idTiposDocumentos="";
    this.idGerencia="";
    this.gerenparametrodesc = "";
    this.gerenparametroid = "";
    this.anioantiguedad = "";
    this.prioridadValidator = false;
    this.deshabilitaCheck=true;
    this.todosCheck = false;
  }

  OnBuscar(): void {
    

    if (this.listadoTipo != undefined) {
      this.cantVal = 0;
      for (let index = 0; index < this.listadoTipo.length; index++) {
        if (this.listadoTipo[index].seleccionado) {
          this.cantVal = this.cantVal + 1;
        }
      }
    }  

    if (!this.gerenparametrodesc) {
      this.toastr.warning('Por favor, ingrese una Área.', 'Acción Incorrecta', { closeButton: true });
      (!this.gerenparametrodesc) ? this.prioridadValidator = true : this.prioridadValidator = false;
    } else if(this.cantVal==0){
      this.toastr.warning('Por favor, seleccione al menos un Tipo de Documento.', 'Acción Incorrecta', { closeButton: true });
    } else {
      this.idTiposDocumentos = ",";
      this.idGerencia = ",";
      for (let index = 0; index < this.listadoTipo.length; index++) {
        if (this.listadoTipo[index].seleccionado) {
          this.idTiposDocumentos  = this.idTiposDocumentos + this.listadoTipo[index].idTipoDocu.toString()+",";
          this.idGerencia  = this.idGerencia + this.listadoTipo[index].id.toString()+",";
        }
      }
      let objeto: RevisionDocumento = new RevisionDocumento();
      objeto.tipodocumento = this.idTiposDocumentos;
      objeto.gerenparametroid = this.idGerencia;
      objeto.gerenparametrodesc = this.gerenparametrodesc;
      objeto.anioantiguedad = this.anioantiguedad;
      this.onClose.next(objeto);
      this.bsModalRef.hide();
    }
  }

  OnHabilitar(): void {
    if (this.documentoCheck) {
      this.documentoCheck = false;
      this.showNumAntiguedad = false;
    } else {
      this.documentoCheck = true;
      this.showNumAntiguedad = true;
    }
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  seleccionarTodos() {
    if (this.todosCheck) {
      this.todosCheck = false;
      this.listadoTipo.forEach(obj => {
        obj.seleccionado = false;
      });
    } else {
      this.todosCheck = true;
      this.listadoTipo.forEach(obj => {
          obj.seleccionado = true;
      });
    }
  }

   seleccionarCheck(item: any) {
    if (item.seleccionado) {
      item.seleccionado = false;
        this.todosCheck = false;
    } else {
      item.seleccionado = true;
        this.todosCheck = false;
    }
  }
}

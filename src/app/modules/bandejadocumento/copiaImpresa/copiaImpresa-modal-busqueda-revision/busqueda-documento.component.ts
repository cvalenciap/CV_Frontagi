import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { ModalOptions,BsModalService } from 'ngx-bootstrap';
import { BitacoraComponent } from 'src/app/modules/revisiondocumento/modals/bitacora.component';

import { ParametrosService } from 'src/app/services';
import { Parametro, Documento, Paginacion } from 'src/app/models';
import { Constante } from 'src/app/models/enums';
import {Response} from '../../../../models/response';
import { BandejaDocumentoService } from '../../../../services';
import {BandejaDocumento} from '../../../../models';
import { DatePipe } from '@angular/common';
import { Programa } from 'src/app/models/programa';
import { ToastrService } from 'ngx-toastr';

@Component({
  selector: 'app-busqueda-revision',
  templateUrl: 'busqueda-documento.component.html'
                
  //styleUrls: ['./bitacora.component.scss']
})
export class BusquedaRevisionComponent implements OnInit {
  constanteRevision: any;
  public interruptorBuscar: boolean;
  public interruptorAceptar: boolean;
  // bsModalRef1: BsModalRef;
  bsModalRef2: BsModalRef;
  tipoParticipante:string;
  public onClose: Subject<Documento>;//BandejaDocumento
  paginacion: Paginacion;
  listaTipoDocumento: any[];
  tipoCopia:string;
  listaTipos: Parametro[];
  loading: boolean;
  items: Programa[];
  tipodocumento: string;
  codigo: string;
  titulo: string;
  selectedRow: number;
  selectedObject: Documento;//BandejaDocumento;

  //modalService: BsModalService;
  constructor(private toastr: ToastrService,
              private service: BandejaDocumentoService,private datePipe: DatePipe,
              public bsModalRef: BsModalRef,private modalService: BsModalService,
              private serviceParametro: ParametrosService) {//
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.paginacion = new Paginacion({registros: 10});
    this.loading = false;
    this.items = [];
    this.tipodocumento = '0';
    this.codigo = '';
    this.titulo = '';
    this.selectedRow = -1;
    this.interruptorBuscar = true;  
    this.interruptorAceptar = true;
    this.tipoCopia="";
   }

  ngOnInit() {
    //Combo tipo de documentos
    this.obtenerParametros();
    
    
    // console.log("participante ", this.bsModalRef);
    // this.tipoParticipante = this.bsModalRef.content.tipoParticipante;
  }

  //Combo tipo de dcumentos
  obtenerParametros() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_DOCUMENTO).subscribe(
        (response: Response) => {
            this.listaTipoDocumento = response.resultado;
        }, (error) => this.controlarError(error));
  }

  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnBuscar() {
    this.loading = true;
    // this.paginacion.pagina = 1;
    const parametros: { tipodocumento?: string, codigo?: string, titulo?: string, estdoc: string }
      = { tipodocumento: null, codigo: null, titulo: null, estdoc: null};  
    parametros.tipodocumento = this.tipodocumento;
    parametros.codigo = this.codigo;
    parametros.titulo = this.titulo;
    parametros.estdoc = ',119,';

    this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        const listadedocumento: BandejaDocumento[] = response.resultado;
        listadedocumento.forEach(documento => {
          if (documento.revision != null) {
            documento.idrevision = documento.revision.id;
            documento.revisionfecha = this.datePipe.transform(documento.revision.fecha, 'dd/MM/yyyy');
          } else {
            documento.idrevision = ' ';
            documento.revisionfecha = ' ';
          }
        });
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
    // }
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.OnBuscar();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.OnBuscar();
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
    if (this.selectedObject !== null) {
      this.interruptorAceptar = false;
    } else {
      this.interruptorAceptar = true;
    }
  }

  seleccionarDocumento() {
    
  if (this.selectedObject != null) {
    this.service.buscarPorCodigo(this.selectedObject.id).subscribe((response:Response)=>
  {
    this.onClose.next(response.resultado);
    this.tipoCopia="";
    this.bsModalRef.hide();
  })
      
    }
  }

  limpiar() {
    this.tipodocumento = '0';
    this.codigo = '';
    this.titulo = '';
    this.interruptorBuscar = true;
    this.interruptorAceptar = true;
    this.items = [];
     
  }

  activarBusqueda(): void {    
    if (this.codigo != '' || this.titulo != '' || this.tipodocumento != null) {
      this.interruptorBuscar = false;
    } else {
      this.interruptorBuscar = true;
    }
  }

}

import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoMockService, BandejaDocumentoService, ValidacionService } from 'src/app/services';
import { Response } from '../../../models/response';
import { RevisionDocumento, Paginacion, ParametrosRevision } from 'src/app/models';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { DatePipe } from '@angular/common';
import { Constante } from 'src/app/models/enums';
import { validate } from 'class-validator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-buscador-documento',
  templateUrl: './busqueda-avanzada.component.html'
})
export class BusquedaAvanzadaComponent implements OnInit {
  public onClose: Subject<Map<string, any>>;

  constanteRevision: any;
  txtTitulo: string;
  fechaInicio: string;
  fechaFinal: string;
  paginacion: Paginacion;
  parametros: Map<string, any>;
  slEstado: string;
  txtNombreCompleto: string;
  txtCodigo: string;
  listaParametrosPadre: any[];
  errors: any;
  parametrosRevision: ParametrosRevision;
  mensajes: any[];
  codigoDoc: string;
  tituloDoc: string;

  constructor(public bsModalRef: BsModalRef, private serviceMock: RevisionDocumentoMockService, private servicioValidacion: ValidacionService,
    private service: RevisionDocumentoService, private datePipe: DatePipe, private documentService: BandejaDocumentoService,
    private toastr: ToastrService) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.parametros = new Map<string, any>();
    this.slEstado = "";
    this.parametrosRevision = new ParametrosRevision();
    this.errors = {};
  }

  ngOnInit() {
    this.cargarEstadoSolicitud();
    this.onClose = new Subject();
  }

  Validar(objectForm) {
    console.log("entroi al validar", this.parametrosRevision);
    this.servicioValidacion.validacionSingular(this.parametrosRevision, objectForm, this.errors);
  }

  onBuscar() {
    if (this.codigoDoc == undefined || this.codigoDoc.trim() == '') {
      this.codigoDoc = null;
    }

    if (this.tituloDoc == undefined || this.tituloDoc.trim() == '') {
      this.tituloDoc = null;
    }

    if (this.fechaInicio == undefined) {
      this.fechaInicio = null;
    }

    if (this.fechaFinal == undefined) {
      this.fechaFinal = null;
    }

    this.parametros.set("codigoDoc", this.codigoDoc);
    this.parametros.set("tituloDoc", this.tituloDoc);
    this.parametros.set("fechaInicio", this.datePipe.transform(this.fechaInicio, "dd/MM/yyyy"));
    this.parametros.set("fechaFinal", this.datePipe.transform(this.fechaFinal, "dd/MM/yyyy"));

    this.onClose.next(this.parametros);
    this.bsModalRef.hide();
  }

  controlarError(error) {
    alert(error);
  }

  cargarEstadoSolicitud() {
    this.documentService.obtenerParametroPadre(Constante.ESTADO_SOLICITUD).subscribe(
      (response: Response) => {
        this.listaParametrosPadre = response.resultado;
      }
    );
  }

}

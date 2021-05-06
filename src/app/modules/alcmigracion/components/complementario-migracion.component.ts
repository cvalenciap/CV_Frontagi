import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento, Documento, Parametro, Tipo} from '../../../models';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {BandejaDocumentoService, ParametrosService} from '../../../services';
import {Constante} from '../../../models/enums';
import { Response } from '../../../models/response';
import {ToastrService} from 'ngx-toastr';
import {BusquedaDocumentoComponent} from "../modals/busqueda-documento.component";
import { DocumentoMigracion } from 'src/app/models/documentomigracion';

@Component({
  selector: 'bandeja-documento-complementario-migracion',
  templateUrl: 'complementario-migracion.template.html'
})
export class ComplementarioMigracionComponent implements OnInit {
  @Input() activar: boolean;
  @Input() permisos: any;
  public tipoComplementario: string
  public textoTipoComplementario: string;
  public interruptorAnadir = true; // LARP
  public bsModalRef: BsModalRef; // LARP
  public listaDocumentoComplementarios: Array<Parametro>; // LARP
  private tipoDocumento: Tipo;
  selectedRow: number;
  private tipoComplementarioParametro: Parametro;
  listaSeguimiento: DocumentoMigracion[]; // BandejaDocumento[];
  loading: boolean;
  
  constructor(private bsModalService: BsModalService, private parametroService: ParametrosService, private toastr: ToastrService,
              private bandejaService: BandejaDocumentoService) {
                this.selectedRow= -1;
              }

  ngOnInit() {
    this.tipoComplementarioParametro = new Parametro();
    this.tipoComplementario = '';
    this.loading = false;
    this.tipoComplementario = "0";
    this.obtenerTiposComplementarios();
    this.listaSeguimiento = new Array<DocumentoMigracion>(); // new Array<BandejaDocumento>();
    // this.obtenerDocumentosComplementarios();
    this.recibiendoDatosRevision();
  }

  recibiendoDatosRevision() {
    this.bandejaService.getSubjectRevision().subscribe((datosParaRevision: Map<string, any>) => {
      const codigoDocumento: number = datosParaRevision.get('codigoDocumento');
      if (codigoDocumento !== undefined) {
        this.obtenerDocumentosComplementarios(codigoDocumento);
      }
    }, (error) => {      
    });
  }

  ngDoBootstrap() {}

  /* Código agregado | LARP */
  abrirModal() {
    const configuraciones = <ModalOptions> {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg',
    };
    this.bsModalRef = this.bsModalService.show(BusquedaDocumentoComponent, configuraciones);
    (<BusquedaDocumentoComponent> this.bsModalRef.content).onClose.subscribe((resultado: Documento) => {
      resultado.tipo = this.tipoDocumento;
      resultado.tipoComplementario = this.tipoComplementarioParametro;      
      let existe = false;
      if (this.listaSeguimiento.length <= 0) {
        this.listaSeguimiento.push(resultado);
      } else {
        this.listaSeguimiento.forEach(function (documento)  {
          if (documento.codigo === resultado.codigo) {
            this.toastr.show('No se puede seleccionar un documento que existe agregado.');
            existe = true;
          }
        }.bind(this));
        if (!existe) { this.listaSeguimiento.push(resultado); }
      }
      this.ordenarListaDocumentos();
    });
  }

  obtenerTiposComplementarios() {
    this.parametroService.obtenerParametroPadre(Constante.TIPO_DOCUMENTO_COMPL).subscribe((response: Response) => {
      this.listaDocumentoComplementarios = response.resultado;
    }, (error) => {      
    });
  }

  validarCambioDocumento() {
    if (this.tipoComplementario !== '') {
      const complementario: Parametro = this.listaDocumentoComplementarios.find(x => String(x.idconstante) === this.tipoComplementario);
      const codigo: string = String(complementario.idconstante);
      this.interruptorAnadir = false;
      // this.tipoComplementarioParametro.idconstante = Number(codigo);
      // this.tipoComplementarioParametro.v_valcons = complementario.v_valcons;
      // this.textoTipoComplementario = complementario.v_valcons;
      this.tipoComplementarioParametro = {
        idconstante: Number(codigo), v_valcons: complementario.v_valcons, v_descons: complementario.v_valcons};
      this.tipoDocumento = {codigo: codigo, descripcion: complementario.v_descons, idconstante: codigo};
    } else {
      this.interruptorAnadir = true;
    }
  }

  ordenarListaDocumentos() {
    this.listaSeguimiento.sort((a, b) => a.tipoComplementario.v_valcons.localeCompare(b.tipoComplementario.v_valcons));
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;    
  }
  eliminarDocumento(indice: number) {
    if (indice >= 0) {
      this.listaSeguimiento.splice(indice, 1);
      this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
    }
  }

  obtenerDocumentosComplementarios(codigoDocumento: number) {
    this.bandejaService.buscarPorCodigo(codigoDocumento).subscribe((documentos: Response) => {
      const documento: DocumentoMigracion = documentos.resultado;
      documento.listaComplementario.forEach( function(elemento) {
        const tipo: Tipo = {codigo: '', descripcion: elemento.tipoComplementario};        
        const bandejaDocumento: DocumentoMigracion = new DocumentoMigracion();
        bandejaDocumento.codigo = elemento.id;
        bandejaDocumento.descripcion = elemento.descripcion;
        bandejaDocumento.tipo = tipo;
        this.listaSeguimiento.push(bandejaDocumento);
      }.bind(this));
    }, (error) => {      
    });
  }
  /* Fin bloque | LARP */

}

import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento, Documento, Parametro, Tipo} from '../../../models';
import {BsModalRef, BsModalService, ModalOptions} from 'ngx-bootstrap';
import {BusquedaDocumentoComponent} from '../../revisiondocumento/modals/busqueda-documento.component';
import {BandejaDocumentoService, ParametrosService} from '../../../services';
import {Constante} from '../../../models/enums';
import { Response } from '../../../models/response';
import {ToastrService} from 'ngx-toastr';
import {getSetRelativeTimeRounding} from 'ngx-bootstrap/chronos/duration/humanize';
import { SessionService } from 'src/app/auth/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bandeja-documento-complementario',
  templateUrl: 'complementario.template.html'
})
export class ComplementarioComponent implements OnInit {
  @Input() activar: boolean;
  @Input() permisos: any;
  public tipoComplementario: string
  public interruptorAnadir = true; // LARP
  public bsModalRef: BsModalRef; // LARP
  public listaDocumentoComplementarios: Array<Parametro>; // LARP
  private tipoDocumento: Tipo;
  listaSeguimiento: Documento[];//BandejaDocumento[];
  listaRetorno: any[];
  loading: boolean;
  rutaActual:string;
  rutaAnterior:string;
  rutaAnteriorAnterior:string;
  habilitar: Boolean;
  constructor(private bsModalService: BsModalService, private parametroService: ParametrosService, private toastr: ToastrService,
              private bandejaService: BandejaDocumentoService,
              public session: SessionService,
              private router: Router) {
    //cguerra seguridad
    this.rutaActual = this.router.url;
    let item = JSON.parse(sessionStorage.getItem("item"));
    console.log("SESSIONSTORAGECONSENSO")
    console.log(item);
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
    let nuevo = item.nuevo;
    let edicion = item.edicion
    console.log("VALOR DEL ITEMELABORACIOn")
    console.log(item)
    console.log(nuevo)
    console.log(edicion)
    
    if(nuevo==true){
      this.habilitar= true;
    }else{
      this.habilitar= false;
    }
    //cguerra seguridad
  }

  ngOnInit() {
    
    this.tipoComplementario = '';
    this.loading = false;
    this.obtenerTiposComplementarios();
    this.listaSeguimiento = new Array<Documento>();//new Array<BandejaDocumento>();
    this.listaRetorno = [];
    // this.obtenerDocumentosComplementarios();
    this.listaRetorno=JSON.parse(sessionStorage.getItem("listaDocumentosDoc"));
    this.recibiendoDatosRevision();
    if(this.listaRetorno!=undefined){
      this.listaSeguimiento=this.listaRetorno;
    }
  //this.listaSeguimiento.

  }

  recibiendoDatosRevision() {
    this.bandejaService.getSubjectRevision().subscribe((datosParaRevision: Map<string, any>) => {
      const codigoDocumento: number = datosParaRevision.get('codigoDocumento');
      if (codigoDocumento !== undefined) {
        this.obtenerDocumentosComplementarios(codigoDocumento);
      }
    }, (error) => {
      console.log(error);
    });
  }

  ngDoBootstrap() {}

  /* Código agregado | LARP */
  abrirModal() {
    const configuraciones = <ModalOptions> {
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg',
      initialState: {
        
      },
    };
    
    this.bsModalRef = this.bsModalService.show(BusquedaDocumentoComponent, configuraciones);
    (<BusquedaDocumentoComponent> this.bsModalRef.content).onClose.subscribe((resultado: Documento) => {
      //console.log(resultado);
      
      resultado.tipo = this.tipoDocumento;
      resultado.tipo.codigo = this.tipoDocumento.codigo;
      resultado.tipo.descripcion = this.tipoDocumento.descripcion;
      resultado.tipoComplementario = new Parametro();
      resultado.tipoComplementario.idconstante = Number(this.tipoDocumento.codigo);
      resultado.tipoComplementario.v_descons = this.tipoDocumento.descripcion;      
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
      sessionStorage.setItem('listaDocumentos', JSON.stringify(this.listaSeguimiento));
      this.ordenarListaDocumentos();
    });
  }

  obtenerTiposComplementarios() {
    this.parametroService.obtenerParametroPadre(Constante.TIPO_DOCUMENTO_COMPL).subscribe((response: Response) => {
      this.listaDocumentoComplementarios = response.resultado;
    }, (error) => {
      console.log(error);
    });
  }

  validarCambioDocumento() {
    if (this.tipoComplementario !== '') {
      const complementario: Parametro = this.listaDocumentoComplementarios.find(x => String(x.idconstante) === this.tipoComplementario);
      const codigo: string = String(complementario.idconstante);
      this.interruptorAnadir = false;
      this.tipoDocumento = {codigo: codigo, descripcion: complementario.v_valcons};
    } else {
      this.interruptorAnadir = true;
    }
  }

  ordenarListaDocumentos() {
    this.listaSeguimiento.sort((a, b) => a.tipoComplementario.v_descons.localeCompare(b.tipoComplementario.v_descons));
    //console.log('Lista ordenada', this.listaSeguimiento);
  }

  eliminarDocumento(indice: number) {
    if (indice >= 0) {
      this.listaSeguimiento.splice(indice, 1);
      sessionStorage.setItem('listaDocumentos', JSON.stringify(this.listaSeguimiento));
    }
  }

  obtenerDocumentosComplementarios(codigoDocumento: number) {
    
    if(this.listaRetorno!=undefined){
      this.listaSeguimiento=this.listaRetorno;
    }
    this.bandejaService.buscarPorCodigo(codigoDocumento).subscribe((documentos: Response) => {
      const documento: Documento = documentos.resultado;
      documento.listaComplementario.forEach( function(elemento) {
        //const tipo: Tipo = {codigo: '', descripcion: elemento.tipoComplementario};
        const bandejaDocumento: Documento = new Documento();
        bandejaDocumento.codigo = elemento.id;
        bandejaDocumento.descripcion = elemento.descripcion;
        bandejaDocumento.tipoComplementario = new Parametro();
        bandejaDocumento.tipoComplementario.v_descons=elemento.tipoComplementario;
        this.listaSeguimiento.push(bandejaDocumento);
        this.listaSeguimiento=this.listaRetorno;
        sessionStorage.setItem('listaDocumentos', JSON.stringify(this.listaSeguimiento));
      }.bind(this));
    }, (error) => this.controlarError(error)           
    );
  }
  /* Fin bloque | LARP */
  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

}

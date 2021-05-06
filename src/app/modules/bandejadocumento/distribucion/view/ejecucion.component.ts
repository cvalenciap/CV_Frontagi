import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Jerarquia } from 'src/app/models/jerarquia';
import { RevisionDocumento, AdjuntoMensaje } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';
import { BusquedaRegistroComponent } from 'src/app/modules/bandejadocumento/programacion/modales/busqueda-registro.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { FormatoCarga } from 'src/app/constants/general/general.constants';
import { validate } from 'class-validator';
import { Constante } from 'src/app/models/enums/constante';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { SessionService } from 'src/app/auth/session.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;

@Component({
  selector: 'app-ejecucion',
  templateUrl: 'ejecucion.template.html',
  styleUrls: ['ejecucion.component.scss']
})
export class EjecucionComponent implements OnInit {

  items: RevisionDocumento[];
  listaDocumentos: RevisionDocumento[];
  listaRutas: RevisionDocumento[];
  textoBusqueda: string;
  parametroBusqueda: string;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Jerarquia;
  loading: boolean;
  //cguerra  
  fileAltas: AdjuntoMensaje;
  lstAdjuntos: AdjuntoMensaje[] = new Array<AdjuntoMensaje>();
  //cguerra
  deshabilitarBuscar: boolean;
  mensajeInformacion: string;
  mostrarInformacion: boolean;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  textoMenu: string;
  listaEstados: any;
  parametroBusquedaAnterior: string;
  textoBusquedaAnterior: string;
  textoMenuAnterior: string;
  bsModalRef: BsModalRef;
  ocultarColumna: boolean;
  primerTrim: number;
  segundoTrim: number;
  tercerTrim: number;
  cuartoTrim: number;
  listaParticipantes: RutaParticipante[];
  idProg: number;
  deshabilitarGuardar: boolean;
  cantDocu: number;
  responsableequipo: string;
  idresponsableequipo: number;
  desabilitarColumna: boolean;
  rutaDocumt: string;
  mensajearchivo: string;
  archivo: any;
  errors: any;
  archivodoc: any;
  desabilitarBuscar: boolean;
  listaEstadoEjec: any[];
  idestejec: string;
  desabilitarFinalizar: boolean;
  private sub: any;
  indExisteDocu: boolean;
  indicadorLectura: boolean;
  indicadorDisabled: boolean;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    public session: SessionService,
    private service: RevisionDocumentoService,
    private sanitizer: DomSanitizer,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private serviceDocumento: RevisionDocumentoService,
    private serviceParametro: ParametrosService,
  ) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.listaDocumentos = [];
    this.parametroBusquedaAnterior = this.parametroBusqueda;
    this.paginacion = new Paginacion({ registros: 10 });
    this.deshabilitarBuscar = true;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.textoMenu = null;
    this.ocultarColumna = true;
    this.primerTrim = 0;
    this.segundoTrim = 0;
    this.tercerTrim = 0;
    this.cuartoTrim = 0;
    this.idProg = 0;
    this.deshabilitarGuardar = true;
    this.desabilitarColumna = true;
    this.errors = {};
    this.mensajearchivo = "No se encuentra ningún archivo seleccionado";
    this.desabilitarBuscar = true;
    this.indExisteDocu = true;
    this.indicadorLectura = false;
    this.idestejec = "158";
    this.listaEstadoEjec = [];
    this.listaRutas = [];
    this.indicadorDisabled = false;
  }

  ngOnInit() {
    
    //this.desabilitarFinalizar= true;
    this.spinner.show();
    this.obtenerEstadoEjec();
    this.desabilitarColumna = true;
    this.ocultarColumna = true;
    this.listaParticipantes = new Array<RutaParticipante>();

    this.sub = this.route.params.subscribe(params => {
      this.idProg = + params['idProg'];
      this.deshabilitarGuardar = false;
      
      if (this.idProg) {
        this.abrirBusquedaPorIdProg(this.idProg);
        this.items
        this.listaDocumentos
      }
    });
    this.idestejec = "158";

  }

  obtenerEstadoEjec() {
    this.serviceParametro.obtenerParametroPadre(Constante.ESTADO_EJECUCION).subscribe(
      (response: Response) => {
        this.listaEstadoEjec = response.resultado.filter(obj => obj.v_valcons != 'Pendiente')
      }, (error) => this.controlarError(error));
  }

  abrirBusquedaPorIdProg(idProg): void {
    this.loading = true;

    const parametros: { codFichaLogueado?: string, idProg?: string } = { codFichaLogueado: null, idProg: null };

    parametros.idProg = idProg;

    if (localStorage.getItem("codFichaLogueado")) {
      parametros.codFichaLogueado = localStorage.getItem("codFichaLogueado");
    }
    this.service.buscarPorParametroDistrib(parametros).subscribe(
      (response: Response) => {
        let listadedocumento: RevisionDocumento[] = response.resultado;
        let c = 0;
        listadedocumento.forEach(documento => {
          c = c + 1;
          documento.fecRevi = new Date(documento.fecRevi);
          this.cantDocu = listadedocumento.length;

          if (documento.estEjec != 'Pendiente') {
            // this.indicadorLectura = true;
          }
          
          if (documento.estEjec == 'Pendiente') {
            this.desabilitarFinalizar = true;
            this.indicadorLectura = true;
          } else if (documento.fechaEjecucion != null) {
            this.desabilitarFinalizar = true;
          }
          this.primerTrim = documento.primerTrim;
          this.segundoTrim = documento.segundoTrim;
          this.tercerTrim = documento.tercerTrim;
          this.cuartoTrim = documento.cuartoTrim;

          if (c >= 5) {
            c = 0;
            c = c + 1;
            if (documento.idTrimestre == null) {
              documento.idTrimestre = c;
            }
          } else {
            if (documento.idTrimestre == null) {
              documento.idTrimestre = c;
            }
          }
        });
        
        this.items = response.resultado;
        this.responsableequipo
        this.paginacion = new Paginacion(response.paginacion);

        this.loading = false;
        this.spinner.hide();
        this.OnContador();
      },
      (error) => this.controlarError(error)
    );
  }

  OnContador() {
    this.primerTrim = 0;
    this.segundoTrim = 0;
    this.tercerTrim = 0;
    this.cuartoTrim = 0;
    for (let item of this.items) {
      if (item.idTrimestre == 1) {
        this.primerTrim = this.primerTrim + 1;
      }
      if (item.idTrimestre == 2) {
        this.segundoTrim = this.segundoTrim + 1;
      }
      if (item.idTrimestre == 3) {
        this.tercerTrim = this.tercerTrim + 1;
      }
      if (item.idTrimestre == 4) {
        this.cuartoTrim = this.cuartoTrim + 1;
      }
    }
  }

  OnAdjuntar(file: any, item: RevisionDocumento) {
    
    const size = file.target.files[0].size;
    const name = file.target.files[0].name;
    if (size > 40000000) {
      this.toastr.warning('El documento excede el tamaño permitido 40MB.', 'Atención', { closeButton: true });
    } else {
      if (file.target.files.length > 0) {
        if (FormatoCarga.pdf == file.target.files[0].type) {
          const reader = new FileReader();
          reader.onload = (e) => {
            
            //Convertimos el archivo en byte
            const rawData = reader.result as ArrayBuffer;
            const bytes = new Uint8Array(rawData);
            const adjunto = new AdjuntoMensaje();
            adjunto.n_estado = 1;
            adjunto.sizeAdjunto = size;
            adjunto.nombreAdjunto = name;
            adjunto.extensionAdjunto = name.split('.').pop();
            adjunto.bytesArray = JSON.parse('[' + bytes + ']');
            //Seteamos al Bean archivo                        
            item.archivo = adjunto;
            item.mensajearchivo = file.target.files[0].name
            this.desabilitarBuscar = false;
            //this.desabilitarFinalizar = false;
            // Despues de completar la carga de fichero
            this.validacionSingularDistinta(item.archivo, "nombreArchivo", this.errors);

          }
          reader.readAsArrayBuffer(file.target.files[0]);
        } else {
          item.archivo = undefined;
          this.toastr.warning('Solo se permite archivo PDF', 'Atención', { closeButton: true });
        }
      }
    }
  }
  validacionSingularDistinta(modelo: any, atributo: string, errorsGlobal: any) {
    validate(modelo).then(errors => {
      errorsGlobal[atributo] = "";
      if (errors.length > 0) {
        errors.map(e => {
          if (e.property == atributo) {
            errorsGlobal[e.property] = e.constraints[Object.keys(e.constraints)[0]];
            return;
          }
        });
      }
    });
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  habilitarBuscar(): void {
    if (this.textoBusqueda != '')
      this.deshabilitarBuscar = false;
    else
      this.deshabilitarBuscar = true;
  }

  habilitarBuscarNumero(): void {
    if (this.textoBusqueda != null) {
      if (this.textoBusqueda != "") {
        this.deshabilitarBuscar = false;
      } else {
        this.deshabilitarBuscar = true;
      }
    } else {
      this.deshabilitarBuscar = true;
    }
  }
  obtenerTextoEstado(): void {
    this.textoMenu = this.listaEstados.find(resultado => (resultado.id + "") == this.textoBusqueda).valor;
  }
  OnRegresar(): void {
    this.router.navigate(['documento/programacion/distribucion']);
  }

  abrirBusquedaAvanzada() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-md'
    }
    this.bsModalRef = this.modalService.show(BusquedaRegistroComponent, config);
    (<BusquedaRegistroComponent>this.bsModalRef.content).onClose.subscribe(result => {

    });
  }

  OnGuardar() {
    this.spinner.show();
    let revisado: number = 0; //158
    let cancelado: number = 0; //159

    for (let revision of this.items) {
      if (revision.idestejec == Constante.ID_ESTADO_REVISION_REVISADO) {
        revisado = revisado + 1;
      }
      if (revision.idestejec == Constante.ID_ESTADO_REVISION_CANCELADO) {
        cancelado = cancelado + 1;
      }
    }
    if (this.indExisteDocu) {
      
      this.items.forEach(item => {
        if (this.items.length == cancelado) {
          item.idestejec = Constante.ID_ESTADO_REVISION_CANCELADO;
        }
        
        if (item.archivo != null) {
          this.listaDocumentos.push(item);
        }
      });
      //cguerra inicio      
      
      this.serviceDocumento.GuardarDocumentoArchivo(this.listaDocumentos).subscribe(
        (response: Response) => {
          this.archivo = null;
          this.mensajearchivo = "No se encuentra Ningún archivo seleccionado";
          this.spinner.hide();
          this.router.navigate([`documento/programacion/distribucion`]);
          this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
        });

    } else {
      this.indExisteDocu = true;
    }
    //cguerra Fin 
  }


  OnEjecucion() {
    this.spinner.show();
    let revisado: number = 0; //158
    let cancelado: number = 0; //159

    for (let revision of this.items) {
      if (revision.idestejec == Constante.ID_ESTADO_REVISION_REVISADO) {
        revisado = revisado + 1;
      }
      if (revision.idestejec == Constante.ID_ESTADO_REVISION_CANCELADO) {
        cancelado = cancelado + 1;
      }
    }
    if (this.indExisteDocu) {
      
      this.items.forEach(item => {
        if (this.items.length == cancelado) {
          item.idestejec = Constante.ID_ESTADO_REVISION_CANCELADO;
        }
        
        if (item.archivo != null) {
          this.listaDocumentos.push(item);
        }
      });
      //cguerra inicio      
      
      if (this.listaDocumentos.length > 0) {
        this.serviceDocumento.finalizarArchivo(this.listaDocumentos).subscribe(
          (response: Response) => {
            this.archivo = null;
            this.mensajearchivo = "No se encuentra Ningún archivo seleccionado";
            this.spinner.hide();
            this.router.navigate([`documento/programacion/distribucion`]);
            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
          });
      } else {
        this.serviceDocumento.finalizarArchivo(this.items).subscribe(
          (response: Response) => {
            this.archivo = null;
            this.mensajearchivo = "No se encuentra Ningún archivo seleccionado";
            this.spinner.hide();
            this.router.navigate([`documento/programacion/distribucion`]);
            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
          });
      }
    } else {
      this.indExisteDocu = true;
    }
    //cguerra Fin 
  }
}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { CorreoService } from '../../../../services';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Jerarquia } from 'src/app/models/jerarquia';
import { RevisionDocumento } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';
import { BusquedaRegistroComponent } from 'src/app/modules/bandejadocumento/programacion/modales/busqueda-registro.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { DatePipe } from '@angular/common';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { AgregarUsuarioDistribComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario-distribucion.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { ParametrosService } from 'src/app/services';
declare var jQuery: any;
import { Correo } from 'src/app/models/correo';
import { Constante } from 'src/app/models/enums';

@Component({
  selector: 'app-distribucion',
  templateUrl: 'distribucion.template.html',
  styleUrls: ['distribucion.component.scss']
})
export class DistribucionComponent implements OnInit {

  items: any;
  cItems: RevisionDocumento[];
  textoBusqueda: string;
  parametroBusqueda: string;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Jerarquia;
  loading: boolean;
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
  idProg: number;
  deshabilitarGuardar: boolean;
  private sub: any;
  listaParticipantes: RutaParticipante[];
  equipoColaborador: string;
  idColaborador: number;
  responsableequipo: string;
  idresponsableequipo: number;
  cantDocu: number;
  primerTrim: number;
  segundoTrim: number;
  tercerTrim: number;
  cuartoTrim: number;
  item: RevisionDocumento;
  desabilitarGuardar: boolean;
  ocultarColumna: boolean;
  indExisteDocu: boolean;
  indObliDocu: boolean;
  indExisteResp: boolean;
  todosCheck: boolean;
  listaProgramacionSelecc: RevisionDocumento[];
  listaProgramacionNoSelecc: RevisionDocumento[];
  ind:number;
  numeroMaximo:any[];
  numeroMaximoDist:string;

  public listaDistribucion: RevisionDocumento[];

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private service: RevisionDocumentoService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private serviceCorreo: CorreoService,
    private route: ActivatedRoute,
    private spinner: NgxSpinnerService,
    private serviceParametro: ParametrosService,
    private datePipe: DatePipe
  ) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'codigo';
    this.parametroBusquedaAnterior = this.parametroBusqueda;
    this.paginacion = new Paginacion({ registros: 1000 });
    this.deshabilitarBuscar = true;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.textoMenu = null;
    this.idProg = 0;
    this.deshabilitarGuardar = true;
    this.equipoColaborador = '';
    this.idColaborador = 0;
    this.cantDocu = 0;
    this.primerTrim = 0;
    this.segundoTrim = 0;
    this.tercerTrim = 0;
    this.cuartoTrim = 0;
    this.listaDistribucion = new Array<RevisionDocumento>();
    this.desabilitarGuardar = true;
    this.ocultarColumna = false;
    this.indExisteDocu = true;
    this.indObliDocu=true;
    this.indExisteResp = false;
    this.numeroMaximo = [];
  }

  ngOnInit() {
    
    this.ocultarColumna = false;
    this.listaParticipantes = new Array<RutaParticipante>();
    this.sub = this.route.params.subscribe(params => {
      this.idProg = + params['idProg'];
      this.deshabilitarGuardar = false;
      if (this.idProg) {
        this.abrirBusquedaPorIdProg(this.idProg);
      }
    });

    this.serviceParametro.obtenerParametroPadre('Cantidad máxima Distribución').subscribe(
      (response: Response) => {
        this.numeroMaximo = response.resultado;
        this.numeroMaximoDist= this.numeroMaximo[0].v_valcons;
      },
      (error) => this.controlarError(error)
    );

  }

  abrirBusquedaPorIdProg(idProg): void {
    this.loading = true;
    const parametros: {codFichaLogueado?: string, idProg?: string } = { codFichaLogueado: null, idProg: null };
    parametros.idProg = idProg;

    if (localStorage.getItem("codFichaLogueado")) {
      parametros.codFichaLogueado = localStorage.getItem("codFichaLogueado");
    }

    this.service.buscarPorParametroDistrib(parametros).subscribe(
      (response: Response) => {
        this.todosCheck = false;
        let listadedocumento: RevisionDocumento[] = response.resultado;
        let c = 0;
        listadedocumento.forEach(documento => {
          c = c + 1;
          documento.fecRevi = new Date(documento.fecRevi);
          this.cantDocu = listadedocumento.length;

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

        for (let index = 0; index < this.items.length; index++) {
          if (this.items[index].responsableEquipoSelecc == '' || this.items[index].responsableEquipoSelecc == null || this.items[index].responsableEquipoSelecc == undefined) {
            this.indExisteResp = true;
          }
        }

        if (this.indExisteResp) {
          this.desabilitarGuardar = true;
        } else {
          this.desabilitarGuardar = false;
        }
        this.paginacion = new Paginacion(response.paginacion);
        this.seleccionarTodos();
        this.loading = false;
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

  OnNuevo(item: RevisionDocumento) {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        equipo: item.idResponsableEquipo
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(AgregarUsuarioDistribComponents, config);
    (<AgregarUsuarioDistribComponents>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RutaParticipante = result;

      item.responsableEquipoSelecc = result.responsable;//localStorage.getItem("responsableequipo");
      item.idResponsableEquipoSelecc = result.idColaborador;//Number.parseInt(localStorage.getItem("idresponsableequipo"));
      if (item.responsableEquipoSelecc) {
        this.desabilitarGuardar = false;
      }
    });
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.abrirBusquedaPorIdProg(this.idProg);
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.abrirBusquedaPorIdProg(this.idProg);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  controlarError(error) {
    console.error(error);
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
    let cantOblig:number = 0;
    this.listaDistribucion = [];
    this.listaProgramacionSelecc = [];
    this.listaProgramacionNoSelecc = [];
    
    for (let item of this.items) {
      if (item.seleccionado) {
        this.listaProgramacionSelecc.push(item);
        if (item.periodoOblig != null || item.periodoOblig > 0) {
          cantOblig = cantOblig + 1;
        }
      } else {
        this.listaProgramacionNoSelecc.push(item);
      }
    }

    const jsonListaProgramacionSelecc = JSON.stringify(this.listaProgramacionSelecc);
    const jsonListaProgramacionNoSelecc = JSON.stringify(this.listaProgramacionNoSelecc);
    let parametros: any = { "listaProgSeleccionada": jsonListaProgramacionSelecc, "listaProgNoSeleccionada": jsonListaProgramacionNoSelecc }

    if (localStorage.getItem("codFichaLogueado")) {
      parametros.codFichaLogueado = localStorage.getItem("codFichaLogueado");
    }

    if (this.listaProgramacionSelecc.length > 0) {
      for (let item of this.listaProgramacionSelecc) {
        if (item.responsableEquipoSelecc == '' || item.responsableEquipoSelecc == null || item.responsableEquipoSelecc == undefined) {
          this.indExisteDocu = false;
        }
      }
    }

    if (cantOblig < parseInt(this.numeroMaximoDist)) {
      if (this.listaProgramacionSelecc.length > parseInt(this.numeroMaximoDist)) {
        this.indObliDocu=false;
        this.ind = 1;
      }
    }else if(cantOblig >= parseInt(this.numeroMaximoDist)){
      if (this.listaProgramacionSelecc.length > cantOblig) {
        this.indObliDocu=false;
        this.ind = 2;
      }
    }  

    if (this.listaProgramacionSelecc.length == 0) {
      this.indExisteDocu = true;
      this.toastr.warning('Por favor, seleccione minimo un documento.', 'Atención', { closeButton: true });
    } else if (!this.indObliDocu) {
      this.indExisteDocu = true;
      if (this.ind == 1) {
        this.toastr.warning('Por favor, seleccione como maximo 25 documentos.', 'Atención', { closeButton: true });
      } else {
        this.toastr.warning('Solo se pueden seleccionar los documentos con periodo de obligatoriedad.', 'Atención', { closeButton: true });
      }
    } else if (!this.indExisteDocu) {
      this.indExisteDocu = true;
      this.toastr.warning('Debe asignar responsable a los documentos selecionados', 'Atención', { closeButton: true });
    } else {
      this.spinner.show();
      this.service.guardarDistribucion(parametros).subscribe(
        (response: Response) => {
          this.spinner.hide();
          this.item = response.resultado;
          this.toastr.success('Registro Almacenado', 'Acción completada!', { closeButton: true });
          this.router.navigate([`documento/programacion/distribucion`]);
        }
      );
    }
    this.indObliDocu=true;
  }

  OnEjecucion() {
    let cantOblig:number = 0;
    this.listaDistribucion = [];
    this.listaProgramacionSelecc = [];
    this.listaProgramacionNoSelecc = [];
    
    for (let item of this.items) {
      if (item.seleccionado) {
        this.listaProgramacionSelecc.push(item);
        if (item.periodoOblig != null || item.periodoOblig > 0) {
          cantOblig = cantOblig + 1;
        }
      } else {
        this.listaProgramacionNoSelecc.push(item);
      }
    }

    const jsonListaProgramacionSelecc = JSON.stringify(this.listaProgramacionSelecc);
    const jsonListaProgramacionNoSelecc = JSON.stringify(this.listaProgramacionNoSelecc);
    let parametros: any = { "listaProgSeleccionada": jsonListaProgramacionSelecc, "listaProgNoSeleccionada": jsonListaProgramacionNoSelecc }

    if (localStorage.getItem("codFichaLogueado")) {
      parametros.codFichaLogueado = localStorage.getItem("codFichaLogueado");
    }

    if (this.listaProgramacionSelecc.length > 0) {
      for (let item of this.listaProgramacionSelecc) {
        if (item.responsableEquipoSelecc == '' || item.responsableEquipoSelecc == null || item.responsableEquipoSelecc == undefined) {
          this.indExisteDocu = false;
        }
      }
    }

    if (cantOblig < parseInt(this.numeroMaximoDist)) {
      if (this.listaProgramacionSelecc.length > parseInt(this.numeroMaximoDist)) {
        this.indObliDocu=false;
        this.ind = 1;
      }
    }else if(cantOblig >= parseInt(this.numeroMaximoDist)){
      if (this.listaProgramacionSelecc.length > cantOblig) {
        this.indObliDocu=false;
        this.ind = 2;
      }
    }  

    if (this.listaProgramacionSelecc.length == 0) {
      this.indExisteDocu = true;
      this.toastr.warning('Por favor, seleccione minimo un documento.', 'Atención', { closeButton: true });
    } else if (!this.indObliDocu) {
      this.indExisteDocu = true;
      if (this.ind == 1) {
        this.toastr.warning('Por favor, seleccione como maximo 25 documentos.', 'Atención', { closeButton: true });
      } else {
        this.toastr.warning('Solo se pueden seleccionar los documentos con periodo de obligatoriedad.', 'Atención', { closeButton: true });
      }
    } else if (!this.indExisteDocu) {
      this.indExisteDocu = true;
      this.toastr.warning('Debe asignar responsable a los documentos selecionados', 'Atención', { closeButton: true });
    } else {
      this.spinner.show();
      this.service.finalizarArchivoDist(parametros).subscribe((response: Response) => {
        this.toastr.success('Registro finalizado', 'Acción completada!', { closeButton: true });
        localStorage.removeItem("objetoRetornoBusqueda");
        this.cItems = response.resultado;

        for (let index = 0; index < this.cItems.length; index++) {
          this.serviceCorreo.obtenerListaCorreo(this.cItems[index].idProgramacion, this.cItems[index].idEquipoProgramacion, Constante.CORREO_DISTRIBUIR_PROGRAMACION).subscribe((response: Response) => {
            const lista: Correo[] = response.resultado;
            lista.forEach(correo => {
              if (correo.correoCabecera.correoDestino.length > 0) {
                this.serviceCorreo.enviarCorreo(correo).subscribe(
                  (response: Response) => { }, (error) => { this.controlarError(error); });
              }
            });
          }, (error) => { this.controlarError(error); });
        }
        this.spinner.hide();
        this.router.navigate([`documento/programacion/distribucion`]);
      }, (error) => { this.controlarError(error); });
    }
    this.indObliDocu=true;
  }

  /* OnEjecucion() {
    this.listaDistribucion = [];
    for (let item of this.items) {
      this.listaDistribucion.push(item);
    }

    const jsonListaDistribucion = JSON.stringify(this.listaDistribucion);
    let parametros: any = { "listaDistribucion": jsonListaDistribucion };

    if (localStorage.getItem("codFichaLogueado")) {
      parametros.codFichaLogueado = localStorage.getItem("codFichaLogueado");
    }

    for (let index = 0; index < this.items.length; index++) {
      if (this.items[index].responsableEquipoSelecc == '' || this.items[index].responsableEquipoSelecc == null || this.items[index].responsableEquipoSelecc == undefined) {
        this.toastr.warning('Debe asignar responsable al documento ' + this.items[index].codDocu + '.', 'Atención', { closeButton: true });
        this.indExisteDocu = false;
        break;
      }
    }

    if (this.indExisteDocu) {
      this.spinner.show();
      this.service.finalizarArchivoDist(parametros).subscribe((response: Response) => {
        this.toastr.success('Registro finalizado', 'Acción completada!', { closeButton: true });
        localStorage.removeItem("objetoRetornoBusqueda");
        this.loading = false;
        this.cItems = response.resultado;

        for (let index = 0; index < this.cItems.length; index++) {
          this.serviceCorreo.obtenerListaCorreo(this.cItems[index].idProgramacion, this.cItems[index].idEquipoProgramacion, Constante.CORREO_DISTRIBUIR_PROGRAMACION).subscribe((response: Response) => {
            const lista: Correo[] = response.resultado;
            lista.forEach(correo => {
              if (correo.correoCabecera.correoDestino.length > 0) {
                this.serviceCorreo.enviarCorreo(correo).subscribe(
                  (response: Response) => { }, (error) => { this.controlarError(error); });
              }
            });
          }, (error) => { this.controlarError(error); });
        }
        this.spinner.hide();
        this.router.navigate([`documento/programacion/distribucion`]);
      }, (error) => { this.controlarError(error); });

    } else {
      this.indExisteDocu = true;
    }

  } */

  seleccionarTodos() {
    
     if (this.todosCheck) {
      this.todosCheck = false;
      this.items.forEach(obj => {
        if (obj.periodoOblig!= null || obj.periodoOblig > 0) {
          obj.seleccionado = true;
        }else{
          obj.seleccionado = false;
        }
      });
    } else {
      this.todosCheck = true;

      this.items.forEach(obj => {
        if (obj.periodoOblig!= null || obj.periodoOblig > 0) {
          obj.seleccionado = true;
        }else{
          obj.seleccionado = true;
        }

        if (obj.responsableEquipo) {
          obj.seleccionado = true;
        }else{
          obj.seleccionado = false;
        }

      });
    }
  }

  seleccionarCheck(item: any) {
    if (item.seleccionado) {
      item.seleccionado = false;
      if (!this.validaSeleccionados()) {
        this.todosCheck = false;
      }
    } else {
      item.seleccionado = true;
      if (this.validaSeleccionados()) {
        this.todosCheck = true;
      }
    }
  }

  validaSeleccionados(): boolean {
     let flag: boolean = true;
    for (let i: number = 0; this.items.length > i; i++) {
      if (!this.items[i].seleccionado) {
        flag = false;
        break;
      }
    }
    return flag;
  }

}
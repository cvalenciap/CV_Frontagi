import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BajarDocumentoComponents } from 'src/app/modules/bandejadocumento/modales/bajar-documento.component';
import { BandejaDocumento, Response } from 'src/app/models';
// import { DomSanitizer } from '@angular/platform-browser/src/security/dom_sanitization_service';
import { Paginacion } from 'src/app/models/paginacion';
import { esLocale } from 'ngx-bootstrap/locale';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { Constante } from 'src/app/models/enums/constante';
import { ModalArbolRelacionComponent } from 'src/app/modules/relacioncoordinador/modals/arbol-relacion.component';
import { RelacionCoordinadorService } from 'src/app/services';
import { Estado } from 'src/app/models/enums/estado';
import { GeneralService } from 'src/app/services/impl/general.service';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { forkJoin } from 'rxjs';
import { ModalSeleccionJerarquiaComponent } from 'src/app/modules/bandejadocumento/consulta/modales/modal-seleccion-jerarquia/modal-seleccion-jerarquia.component';

@Component({
  selector: 'app-programacion-carga-doc',
  templateUrl: './programacion-carga-doc.component.html',
  styleUrls: ['./programacion-carga-doc.component.scss']
})
export class ProgramacionCargaDocComponent implements OnInit {

  selectedFilter: string;
  busquedaBandejaDocumento: BandejaDocumento;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  valorChecked: boolean;
  textoBusqueda: string;
  paginacion: Paginacion;
  loading: boolean;
  datoSeleccionado: RelacionCoordinador;
  nodosJerarquiaGerencia: any[];
  nodosJerarquiaAlcance: any[];
  idGerencia: number;
  idAlcance: number;
  idCoordinador: number;
  indicadorSinAlcance: number;
  listaRelacionCoordinador: RelacionCoordinador[];
  listaTipoJerarquia: any[];
  idTipoGerencia: number;
  idTipoAlcance: number;
  parametroBusqueda: string;
  dato: RelacionCoordinador = new RelacionCoordinador();
  descr: string;
  indicador: number;
  constructor(
    private localeService: BsLocaleService,
    private router: Router,
    private modalService: BsModalService,
    private service: RelacionCoordinadorService,
    private generalService: GeneralService,
    private toastr: ToastrService,
    private serviceParametro: ParametrosService,
    // private sanitizer: DomSanitizer
  ) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({ registros: 10 });
    this.selectedFilter = 'gerencia';
    this.descr = "";
    this.indicador = 0;
  }

  ngOnInit() {
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.valorChecked = false;
    this.OnSetearValores();
    this.obtenerTipoJerarquia();

  }

  OnSetearValores() {
    this.parametroBusqueda = "";
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.nodosJerarquiaGerencia = [];
    this.nodosJerarquiaAlcance = [];
    this.listaTipoJerarquia = [];
    this.idTipoGerencia = 0;
    this.idTipoAlcance = 0;
    this.datoSeleccionado = new RelacionCoordinador();
  }

  OnRegresar() {
    this.router.navigate([`consulta/descarga/descargaMasivaDocumentos`]);
  }

  abrirBusqueda() {
    this.selectedFilter = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nombre: this.descr,
        id: this.dato.idGerencia,
        indicador: this.indicador
      },
      class: 'modal-lg'
    }
    
    const modalBusqueda = this.modalService.show(BajarDocumentoComponents, config);
    (<BajarDocumentoComponents>modalBusqueda.content).onClose.subscribe(result => {
      this.busquedaBandejaDocumento = result;
      // this.OnBuscar();
    });
  }

  // OnBuscar(): void {
  //   let texto:string = "<strong>Busqueda Por: </strong>";
  //   console.log(this.selectedFilter);
  //   switch (this.selectedFilter) {
  //       case 'gerencia':
  //           texto = texto + "<br/><strong>Gerencia: </strong>"+this.textoBusqueda;
  //           break;
  //       case 'alcance':
  //           texto = texto + "<br/><strong>Alcance: </strong>"+this.textoBusqueda;
  //           break;
  //       case 'proceso':
  //           texto = texto + "<br/><strong>Proceso: </strong>"+this.textoBusqueda;
  //           break;
  //   }
  //   // this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
  //   // this.mostrarAlerta = true;
  //   this.paginacion.pagina = 1;
  //   //this.getLista();
  // }

  OnAbrirBusquedaModal(modal: String) {
    this.datoSeleccionado = new RelacionCoordinador();
    
    switch (modal.toUpperCase()) {
      case Constante.TIPO_JERARQUIA_GERENCIA.toUpperCase():
        this.OnBuscarGerencia();
        break;
      case Constante.TIPO_JERARQUIA_ALCANCE.toUpperCase():
        this.OnBuscarAlcance();
        break;
      default:
        this.OnBuscarCoordinador();
        break;
    }
  }

  
  OnBuscarGerencia() {
    
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nodosJerarquia: this.nodosJerarquiaGerencia,
        tipoBandeja: Constante.TIPO_JERARQUIA_GERENCIA
      },
      class: 'modal-lx'
    }
    
    const modalArbolGerencia = this.modalService.show(ModalSeleccionJerarquiaComponent, config);
    (<ModalSeleccionJerarquiaComponent>modalArbolGerencia.content).onClose.subscribe(result => {
      
      // this.dato = result;
      this.descr = result.descripcionGerencia;
      this.indicador = 1;
      //   this.datoSeleccionado = datoGerencia;
      //   this.idGerencia = datoGerencia.idGerencia;
      //   this.OnsetearFiltro(Constante.TIPO_JERARQUIA_GERENCIA);
      //   this.OnBuscar();
    });
  }

  OnsetearFiltro(filtro: string) {
    switch (filtro) {
      case Constante.TIPO_JERARQUIA_GERENCIA:
        this.idAlcance = null;
        this.indicadorSinAlcance = null;
        this.idCoordinador = null;
        break;
      case Constante.TIPO_JERARQUIA_ALCANCE:
        if (this.indicadorSinAlcance == 0) {
          this.indicadorSinAlcance = null;
        }
        this.idGerencia = null;
        this.idCoordinador = null;
        break;
      default:
        this.idGerencia = null;
        this.idAlcance = null;
        this.indicadorSinAlcance = null;
        break;
    }
  }

  OnBuscarAlcance() {
    
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nodosJerarquia: this.nodosJerarquiaAlcance,
        tipoBandeja: Constante.TIPO_JERARQUIA_ALCANCE
      },
      class: 'modal-lx'
    }
    const modalArbolAlcance = this.modalService.show(ModalArbolRelacionComponent, config);
    (<ModalArbolRelacionComponent>modalArbolAlcance.content).onClose.subscribe(result => {
      
      //   this.dato = result;
      this.descr = result.descripcionAlcance;
      this.indicador = 2;
      //   this.datoSeleccionado = datoAlcance;
      //   this.idAlcance = datoAlcance.idAlcance;
      //   this.indicadorSinAlcance = datoAlcance.indicadorSinAlcance
      //   this.OnsetearFiltro(Constante.TIPO_JERARQUIA_ALCANCE);
      //   this.OnBuscar();
    });
  }

  OnBuscar(): void {
    this.listaRelacionCoordinador = [];
    this.loading = true;
    const parametros: any = {
      gerencia: this.idGerencia,
      alcance: this.idAlcance,
      colaborador: this.idCoordinador,
      sinAlcance: this.indicadorSinAlcance
    };
    this.service.obtenerRelacionCoordinador(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        let listaRelaciones: RelacionCoordinador[] = response.resultado;
        this.listaRelacionCoordinador = listaRelaciones;
        if (this.listaRelacionCoordinador.length > 0) {
          for (let i: number = 0; this.listaRelacionCoordinador.length > i; i++) {
            if (this.listaRelacionCoordinador[i].indicadorDocumento == 1) {
              this.listaRelacionCoordinador[i].descripcionIndicador = Estado.ACTIVO;
            } else {
              this.listaRelacionCoordinador[i].descripcionIndicador = Estado.INACTIVO;
            }
            if (this.listaRelacionCoordinador[i].indicadorSinAlcance == 1) {
              this.listaRelacionCoordinador[i].descripcionAlcance = Constante.TIPO_JERARQUIA_SIN_ALCANCE;
            }
          }
          this.listaRelacionCoordinador = this.generalService.agregarItem(response.resultado, response.paginacion);
        }
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
        this.OnMostrarMensajeFiltros();
      },
      (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  OnMostrarMensajeFiltros() {
    this.mostrarAlerta = false;
    let objetoFiltro: RelacionCoordinador = this.datoSeleccionado;
    let texto = "<strong>Búsqueda Por:</strong>"

    if (objetoFiltro.idGerencia != null && objetoFiltro.idGerencia != 0) {
      texto = texto + "<br/><strong>Gerencia: </strong>" + objetoFiltro.descripcionGerencia;
      this.mostrarAlerta = true;
    }
    if (objetoFiltro.idAlcance != null && objetoFiltro.descripcionAlcance != "") {
      texto = texto + "<br/><strong>Alcance: </strong>" + objetoFiltro.descripcionAlcance;
      this.mostrarAlerta = true;
    }
    if (objetoFiltro.idCoordinador != null && objetoFiltro.idCoordinador != 0) {
      texto = texto + "<br/><strong>Colaborador: </strong>" + objetoFiltro.nombreCompletoCoordinador;
      this.mostrarAlerta = true;
    }
    // if(this.mostrarAlerta){
    //     this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    // }
  }

  OnBuscarCoordinador() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg'
    };
    // const modalColaborador = this.modalService.show(AgregarDestinatarioComponents, config);
    // (<AgregarDestinatarioComponents>modalColaborador.content).onClose.subscribe(result => {
    //     let datoColaborador: RutaParticipante = result;
    //     this.datoSeleccionado.idCoordinador = datoColaborador.idColaborador;
    //     this.datoSeleccionado.nombreCompletoCoordinador = String(datoColaborador.responsable);
    //     this.idCoordinador = datoColaborador.idColaborador;
    //     this.OnsetearFiltro(this.valorCoordinador);
    //     this.OnBuscar();
    // });
  }

  obtenerTipoJerarquia() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        this.listaTipoJerarquia = response.resultado;
        this.idTipoGerencia = this.serviceParametro.obtenerIdParametro(this.listaTipoJerarquia, Constante.TIPO_JERARQUIA_GERENCIA);
        this.idTipoAlcance = this.serviceParametro.obtenerIdParametro(this.listaTipoJerarquia, Constante.TIPO_JERARQUIA_ALCANCE);
        this.obtenerListaJerarquias();
      },
      (error) => this.controlarError(error)
    );
  }

  obtenerListaJerarquias() {
    let buscaArbolGerencia = this.service.obtenerArbolJerarquiaPorTipo(this.idTipoGerencia);
    let buscaArbolAlcance = this.service.obtenerArbolJerarquiaPorTipo(this.idTipoAlcance);

    forkJoin(buscaArbolGerencia, buscaArbolAlcance)
      .subscribe(([buscaArbolGerencia, buscaArbolAlcance]: [Response, Response]) => {
        let listaGerencia = buscaArbolGerencia.resultado;
        if (listaGerencia.length > 0) {
          for (let i: number = 0; listaGerencia.length > i; i++) {
            let listaPadre: any = listaGerencia[i];
            this.nodosJerarquiaGerencia.push(listaPadre);
          }
        }

        let listaAlcance = buscaArbolAlcance.resultado;
        const itemSinAlcance: { children?: string, id?: number, idTipoDocu?: number, nombre?: string, ruta?: string } = { children: null, id: 0, idTipoDocu: null, nombre: Constante.TIPO_JERARQUIA_SIN_ALCANCE, ruta: null };
        if (listaAlcance.length > 0) {
          this.nodosJerarquiaAlcance.push(itemSinAlcance);
          for (let i: number = 0; listaAlcance.length > i; i++) {
            let listaPadre: any = listaAlcance[i];
            this.nodosJerarquiaAlcance.push(listaPadre);
          }
        }
        localStorage.setItem('nodosJerarquiaGerencia', JSON.stringify(this.nodosJerarquiaGerencia));
        localStorage.setItem('nodosJerarquiaAlcance', JSON.stringify(this.nodosJerarquiaAlcance));
      },
        (error) => this.controlarError(error));
  }
}

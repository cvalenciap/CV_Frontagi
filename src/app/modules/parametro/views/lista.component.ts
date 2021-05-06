
import { Component, OnInit, Inject, SecurityContext, ViewChild } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ParametrosService } from '../../../services';
import { Parametro } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';

@Component({
  selector: 'parametro-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [ParametrosService]
})
export class ParametrosListaComponent implements OnInit {
  @ViewChild('CantReg') general1: PaginacionSetComponent;
  /* datos */
  items: Parametro[];
  indicador: string;
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  tipoBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: Parametro;
  parametro: Parametro = new Parametro;
  /* indicador de carga */
  loading: boolean;
  objPadre: Parametro;
  mostrarAlerta: boolean;
  mensajeAlerta: string;
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private service: ParametrosService,
    private sanitizer: DomSanitizer) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.objPadre = new Parametro();
    //this.parametroBusqueda = '';
    this.paginacion = new Paginacion({ registros: 10 });
  }
  ngOnInit() {
    this.indicador = "";
    this.mensajeAlerta = "";
    this.mostrarAlerta = false;
    //localStorage.setItem("indicadorBusqueda","1");
    let Retorno = localStorage.getItem("indicadorBusqueda")
    if (Retorno == "1") {
      this.getListaRetorno();
    } else {
      this.getLista();
    }
    let CantRow = parseInt(localStorage.getItem("combocantidadRow"));
    if (String(CantRow) == "NaN") {
      CantRow = 0;
    }

    if (CantRow > 0) {
      this.general1.change(CantRow);
      let pagRetorno = parseInt(localStorage.getItem("pagRetorno"));
      this.OnPageOptionChangedReturn(pagRetorno, CantRow);
    } else {
      //paginacion 
      let Paginacion = localStorage.getItem("PaginacionRetorno");
      //Paginacion        
      if (Paginacion != null) {
        this.OnPageChangedRetorno(Paginacion);
      }
    }
  }

  OnBuscar(): void {
    this.indicador = "indica"
    this.paginacion.pagina = 1;
    this.OnLimpiarVariables();
    localStorage.removeItem("PaginacionRetorno");
    //localStorage.removeItem("combocantidadRow");
    let text = this.textoBusqueda.trim();
    if (text == "") {
      this.textoBusqueda = '';
    }
    this.getLista();
    localStorage.setItem("indicadorBusqueda", "1");
  }

  OnLimpiarVariables() {
    localStorage.removeItem("ParametroBusqueda");
    localStorage.removeItem("filtroBusqueda");
    localStorage.removeItem("filtrobusquedaDes");
    localStorage.removeItem("indicadorBusqueda");
  }

  getLista(): void {
    this.OnLimpiarVariables();
    //eliminamos la paginacion en una busqueda normal    
    this.loading = true;
    const parametros: {
      idconstante?: string, n_discons?: string, v_padre?: string, v_nomcons?:
      string, v_descons?: string
    } = {
      idconstante: null, n_discons: null, v_padre: null,
      v_nomcons: null, v_descons: null
    };
    if (!this.parametroBusqueda) {
      this.parametroBusqueda = "nombre";
    }
    //Tipo de Busqueda
    localStorage.setItem("ParametroBusqueda", this.parametroBusqueda);
    switch (this.parametroBusqueda) {
      case 'nombre':
        parametros.v_nomcons = this.textoBusqueda;
        this.parametro.v_nomcons = parametros.v_nomcons;
        localStorage.setItem("filtroBusqueda", this.parametro.v_nomcons);
        break;
      case 'descripcion':
        parametros.v_descons = this.textoBusqueda;
        this.parametro.descripcion = parametros.v_descons;
        localStorage.setItem("filtrobusquedaDes", this.parametro.descripcion)
        break;
    }

    let PaginacionRetorno = localStorage.getItem("PaginacionRetorno");
    let RepuestaPag
    if (PaginacionRetorno != null) {
      RepuestaPag = PaginacionRetorno;
    } else {
      RepuestaPag = 1;
    }

    this.OnMostrarMensajeFiltros();
    this.service.buscarPorParametrosMant(parametros, RepuestaPag, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  getListaRetorno(): void {
    this.loading = true;
    const parametros: {
      idconstante?: string, n_discons?: string, v_padre?: string, v_nomcons?:
      string, v_descons?: string
    } = {
      idconstante: null, n_discons: null, v_padre: null,
      v_nomcons: null, v_descons: null
    };
    //caprturamos variable
    let parametroRetorno = localStorage.getItem("ParametroBusqueda")
    let textoRetorno = localStorage.getItem("filtroBusqueda");
    let textoRetornoDescripcion = localStorage.getItem("filtrobusquedaDes")
    if (parametroRetorno != null) {
      this.parametroBusqueda = parametroRetorno;
    }
    //Nombre
    if (textoRetorno != null) {
      if (textoRetorno == "undefined") {
        textoRetorno = '';
        this.textoBusqueda = '';
      } else {
        this.textoBusqueda = textoRetorno;
      }
    }
    //Descripcion
    if (textoRetornoDescripcion != null) {
      if (textoRetorno == "undefined") {
        textoRetornoDescripcion = '';
        this.textoBusqueda = '';
      } else {
        this.textoBusqueda = textoRetornoDescripcion;
      }
    }
    switch (this.parametroBusqueda) {
      case 'nombre':
        parametros.v_nomcons = this.textoBusqueda;
        this.parametro.v_nomcons = parametros.v_nomcons;
        break;
      case 'descripcion':
        parametros.v_descons = this.textoBusqueda;
        this.parametro.descripcion = parametros.v_descons;
        break;
    }

    let PaginacionRetorno = localStorage.getItem("PaginacionRetorno");
    let RepuestaPag
    if (PaginacionRetorno != null) {
      RepuestaPag = PaginacionRetorno;
    } else {
      RepuestaPag = 1;
    }
    this.OnMostrarMensajeFiltros();
    this.service.buscarPorParametrosMant(parametros, RepuestaPag, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = response.paginacion
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  OnPageChanged(event): void {
    localStorage.removeItem("PaginacionRetorno"); //Valor de la pagina          
    this.paginacion.pagina = event.page;
    localStorage.setItem("PaginacionRetorno", event.page)
    this.getListaRetornoPaginacion();
  }

  OnPageChangedRetorno(event): void {
    this.paginacion.pagina = event.page;
    this.getListaRetornoPaginacion();
  }

  getListaRetornoPaginacion(): void {
    this.loading = true;
    const parametros: {
      idconstante?: string, n_discons?: string, v_padre?: string, v_nomcons?:
      string, v_descons?: string
    } = {
      idconstante: null, n_discons: null, v_padre: null,
      v_nomcons: null, v_descons: null
    };

    let Retorno = localStorage.getItem("indicadorBusqueda");
    let parametroRetorno = '';
    let textoRetorno = '';
    let textoRetornoDescripcion = '';

    if (Retorno == "1") {
      parametroRetorno = localStorage.getItem("ParametroBusqueda");
      textoRetorno = localStorage.getItem("filtroBusqueda");
      if (textoRetorno == "undefined") {
        textoRetorno = '';
        this.textoBusqueda = "";
      }
      textoRetornoDescripcion = localStorage.getItem("filtrobusquedaDes")
      if (textoRetornoDescripcion == "undefined") {
        textoRetornoDescripcion = '';
        this.textoBusqueda = "";
      }
    }

    //caprturamos variable
    if (parametroRetorno != null) {
      this.parametroBusqueda = parametroRetorno;
    }
    switch (this.parametroBusqueda) {
      case 'nombre':
        parametros.v_nomcons = textoRetorno;
        this.parametro.v_nomcons = parametros.v_nomcons;
        break;
      case 'descripcion':
        parametros.v_descons = textoRetornoDescripcion;//this.textoBusqueda;
        this.parametro.descripcion = parametros.v_descons;
        break;
    }

    let PaginacionRet = parseInt(localStorage.getItem("PaginacionRetorno"));
    this.OnMostrarMensajeFiltros();

    this.service.buscarPorParametrosMant(parametros, PaginacionRet, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = response.paginacion;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  //Cantidad de Reg.
  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    localStorage.removeItem("combocantidadRow");
    localStorage.setItem("combocantidadRow", JSON.stringify(this.paginacion.registros));
    this.paginacion.pagina = 1;
    this.getListaRetornoPaginacionCantReg();
  }
  OnPageOptionChangedReturn(pagina: number, registros: number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    this.getListaRetornoPaginacionCantReg();
  }

  getListaRetornoPaginacionCantReg(): void {
    this.loading = true;
    const parametros: {
      idconstante?: string, n_discons?: string, v_padre?: string, v_nomcons?:
      string, v_descons?: string
    } = {
      idconstante: null, n_discons: null, v_padre: null,
      v_nomcons: null, v_descons: null
    };

    let Retorno = localStorage.getItem("indicadorBusqueda");
    let parametroRetorno = '';
    let textoRetorno = '';
    let textoRetornoDescripcion = '';

    if (Retorno == "1") {
      parametroRetorno = localStorage.getItem("ParametroBusqueda");
      textoRetorno = localStorage.getItem("filtroBusqueda");
      textoRetornoDescripcion = localStorage.getItem("filtrobusquedaDes")
    }
    //caprturamos variable
    if (parametroRetorno != null) {
      this.parametroBusqueda = parametroRetorno;
    }
    switch (this.parametroBusqueda) {
      case 'nombre':
        parametros.v_nomcons = textoRetorno;
        this.parametro.v_nomcons = parametros.v_nomcons;
        break;
      case 'descripcion':
        parametros.v_descons = textoRetornoDescripcion;//this.textoBusqueda;
        this.parametro.descripcion = parametros.v_descons;
        break;
    }

    let PaginacionRet = localStorage.getItem("PaginacionRetorno");
    let ResulPag
    let rowcantidad = parseInt(localStorage.getItem("combocantidadRow"));

    if (PaginacionRet != null) {
      ResulPag = PaginacionRet;
    } else {
      ResulPag = 1;
    }

    this.OnMostrarMensajeFiltros();

    this.service.buscarPorParametrosMant(parametros, ResulPag, rowcantidad).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = response.paginacion;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }




  OnMostrarMensajeFiltros() {
    this.mostrarAlerta = false;

    let texto = "<strong>Búsqueda Por:</strong>"
    if (this.parametro.v_nomcons != null && this.parametro.v_nomcons != "") {
      texto = texto + "<br/><strong>Nombre: </strong>" + this.parametro.v_nomcons;
      this.mostrarAlerta = true;
    }
    if (this.parametro.descripcion != null && this.parametro.descripcion != "") {
      texto = texto + "<br/><strong>Descripción: </strong>" + this.parametro.descripcion;
      this.mostrarAlerta = true;
    }

    if (this.mostrarAlerta) {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    }
    this.parametro.v_nomcons = "";
    this.parametro.descripcion = "";
  }


  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnModificar(parametro: Parametro): void {
    sessionStorage.setItem('parametro', JSON.stringify(parametro));
    sessionStorage.setItem('objPadre', JSON.stringify(this.objPadre));
    this.router.navigate([`mantenimiento/parametros/editar/${parametro.idconstante}`]);
  }
  OnNuevo(): void {
    let parametro: Parametro = new Parametro();
    sessionStorage.removeItem("parametro");
    sessionStorage.removeItem("parametroEditar");
    sessionStorage.removeItem("listaParametrosPadre3");
    sessionStorage.removeItem("listaEliminado");
    sessionStorage.removeItem("listaAux");
    sessionStorage.removeItem("objPadre");
    sessionStorage.removeItem("listaFinalAgregar");
    sessionStorage.removeItem("parametroLista");
    sessionStorage.removeItem("listaEliminadoDet");
    sessionStorage.setItem('objPadre', JSON.stringify(this.objPadre));
    this.router.navigate([`mantenimiento/parametros/registrar`]);
  }
  onEliminar(parametro: Parametro): void {        
    this.service.eliminar(parametro).subscribe(
      (response: Response) => {        
        this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
        this.getLista();
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }
  controlarError(error) {    
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
}




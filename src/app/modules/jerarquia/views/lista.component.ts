import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Jerarquia } from '../../../models/jerarquia';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {JerarquiasService} from '../../../services';
import {Parametro} from '../../../models/parametro';
import { isNumber } from 'util';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

//import { JerarquiasMockService as JerarquiaService} from '../../../services';

@Component({
  selector: 'jerarquia-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [JerarquiasService]
})
export class JerarquiasListaComponent implements OnInit {

  /* datos */
  items: Jerarquia[];
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  // selectedObject: Jerarquia;
  selectedObject: Parametro;
  /* indicador de carga */
  loading: boolean;
  /* Deshabilitar Busqueda*/
  deshabilitarBuscar: boolean;
  /* Texto de Mensaje*/
  mensajeInformacion:string;
  /* Validacion si existe un Mensaje a mostrar pantalla: SI(TRUE) / NO(FALSE)*/
  mostrarInformacion:boolean;
  /* Texto de Alerta*/
  mensajeAlerta:string;
  /* Validacion si existe una Alerta a mostrar en pantalla: SI(TRUE) / NO(FALSE)*/
  mostrarAlerta:boolean;
  /* Texto del menu seleccionado*/
  textoMenu:string;
  /* Lista de Tipos de Jerarquia */
  listaTipos: Parametro[];
  /* Lista de Estados */
  listaEstados: any;
  /* Filtros Anteriores */
  parametroBusquedaAnterior: string;
  textoBusquedaAnterior: string;
  textoMenuAnterior:string;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private service: JerarquiasService,
              private sanitizer: DomSanitizer
  ) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'descripcion';
    this.parametroBusquedaAnterior = this.parametroBusqueda;
    this.paginacion = new Paginacion({registros: 10});
    this.deshabilitarBuscar = true;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.textoMenu = null;
    this.textoBusqueda = null;
  }
  ngOnInit() {
    this.getListaDatos(this.paginacion, this.textoBusqueda);
  }

  getListaDatos(paginacion: Paginacion, descripcion: string): void{
    this.loading = true;

    this.service.obtenerTipos(paginacion, descripcion).subscribe(
      (response: Response) => {
        this.listaTipos = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; 
      },
      (error) => this.controlarError(error)
    );
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getListaDatos(this.paginacion, this.textoBusqueda);
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getListaDatos(this.paginacion,this.textoBusqueda);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnBuscar(): void {
    this.getListaDatos(this.paginacion, this.textoBusqueda);
    this.textoBusqueda='';
  }

  OnModificar(item): void {
    
    localStorage.removeItem("nodeSeleccionado");
    localStorage.removeItem("idModulo");
    localStorage.removeItem("rutadelarbol");
    localStorage.removeItem("textotipodocumento");
    localStorage.removeItem("tipodocumento");
    localStorage.removeItem("idjerarquia");

    this.selectedObject = item;
    this.router.navigate(['documento/jerarquias/editar/'+item.idconstante+'/'+item.v_descons]);
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  permitirNumero(evento): void {
    if(!(evento.which>=48 && evento.which<=57))
      evento.preventDefault();
  }

  habilitarBuscar(): void {
    if(this.textoBusqueda!='')
      this.deshabilitarBuscar=false;
    else
      this.deshabilitarBuscar=true;
  }

  habilitarBuscarNumero(): void {
    if(this.textoBusqueda!=null) {
      if(this.textoBusqueda!="") {
        this.deshabilitarBuscar=false;
      } else {
        this.deshabilitarBuscar=true;  
      }
    } else {
      this.deshabilitarBuscar=true;
    }  
  }

  obtenerTextoTipo(): void {
    this.textoMenu=this.listaTipos.find(resultado=>(resultado.idconstante+"")==this.textoBusqueda).v_valcons;
  }

  obtenerTextoEstado(): void {
    this.textoMenu=this.listaEstados.find(resultado=>(resultado.id+"")==this.textoBusqueda).valor;
  }

}
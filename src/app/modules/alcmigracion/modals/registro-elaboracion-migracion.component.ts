import {Component, OnInit, Input, AfterViewInit} from '@angular/core';
import {Response} from '../../../models/response';
import { Subject } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef } from 'ngx-bootstrap';
import {ToastrService} from 'ngx-toastr';
import {Equipo} from 'src/app/models/equipo';
import {Area} from 'src/app/models/area';
import {AreaService} from 'src/app/services/impl/area.service';
// import {Paginacion} from 'src/app/models/paginacion';
import {Paginacion} from '../../../models/paginacion';
import {Colaborador} from '../../../models/colaborador';

declare var jQuery: any;
 
@Component({
  selector: 'bandeja-documento-modales-registro-elaboracion-migracion',
  templateUrl: 'registro-elaboracion-migracion.template.html'
})
export class RegistroElaboracionMigracionComponent implements OnInit, AfterViewInit {
  public onClose: Subject<Equipo []>;
  public interruptorBoton: boolean;
  public interruptorAceptar: boolean;
  public parametroBusqueda: string;
  public textoBusqueda: string;
  public siglaBusqueda: string;
  public listaEquiposSeleccionados: Equipo [];
  listado: Area[];
  loading: boolean;
  responsable: string;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Equipo;

  constructor(public bsModalRef: BsModalRef, private toastr: ToastrService, private service: AreaService) {
    this.listaEquiposSeleccionados = new Array<Equipo>();
    this.onClose = new Subject();
    this.paginacion = new Paginacion({registros: 10});
    this.parametroBusqueda = '';
  }

  ngAfterViewInit() {
    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  ngOnInit() {
    this.interruptorBoton = true;
    this.interruptorAceptar = true;
    this.loading = false;
    this.limpiar();
  }

  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  buscar() {
    const parametros: {
      idArea?: string,
      idCentro?: string,
      descripcion?: string,
      abreviatura?: string,
      tipoArea?: string,
      idAreaSuperior?: string,
      pagina?: string,
      registros?: string
    } = {
      idArea: null,
      idCentro: null,
      descripcion: this.textoBusqueda,
      abreviatura: this.siglaBusqueda,
      tipoArea: this.parametroBusqueda,
      idAreaSuperior: null,
      pagina: this.paginacion.pagina + '',
      registros: this.paginacion.registros + ''
    };
    this.service.buscarAreaListaMigracion(parametros).subscribe((response: Response) => {
        this.listado = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
      },
      (error) => this.controlarError(error)
    );
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  limpiar() {
    this.textoBusqueda = '';
    this.siglaBusqueda = '';
    this.responsable = '';
    this.listado = [];
    this.interruptorBoton = true; // Línea agregada por LARP
    this.interruptorAceptar = true;
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.buscar();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.buscar();
  }

  OnRowClick(index, obj): void {    
    this.selectedRow = index;
    let existe = false;
    let fila = 0, indice = 0;
    const area: Area = obj;
    const colaborador: Colaborador = new Colaborador();
    colaborador.nombreCompleto = area.responsable;
    let equipo:Equipo = new Equipo();
    equipo.id =  Number(area.idArea);
    equipo.descripcion = area.descripcion;
    equipo.jefe =   colaborador;
    this.selectedObject = equipo;
    // this.listaEquiposSeleccionados.push(this.selectedObject);

    /*if (this.selectedObject !== null && this.listaEquiposSeleccionados.length > 0) {
      this.interruptorAceptar = false;
    } else {
      this.interruptorAceptar = true;
    }*/

    if (this.listaEquiposSeleccionados.length <= 0) {
      this.interruptorAceptar = true;
      this.listaEquiposSeleccionados.push(this.selectedObject);
      jQuery('#' + this.selectedObject.id).css( 'background', 'yellow' );
      this.interruptorAceptar = false;
    } else {
      this.listaEquiposSeleccionados.forEach( function (equipo) {
        if (equipo.id === this.selectedObject.id) {
          existe = true;
          indice = fila;
        }
        fila = fila + 1;
      }.bind(this));
      if (existe) {
        this.listaEquiposSeleccionados.splice(indice, 1);
        jQuery('#' + this.selectedObject.id).css( 'background', 'none' );
      } else {
        this.listaEquiposSeleccionados.push(this.selectedObject);
        jQuery('#' + this.selectedObject.id).css( 'background', 'yellow' );
      }
    }    
    if (this.listaEquiposSeleccionados.length > 0) {
      this.interruptorAceptar = false;
    } else {
      this.interruptorAceptar = true;
    }
  }

  /* Código módificado por LARP */
  seleccionarAuditor() {
    const equipo: Equipo = new Equipo();
    equipo.id = this.selectedObject.id;
    equipo.descripcion = this.selectedObject.descripcion;
    equipo.jefe = this.selectedObject.jefe;    
    this.onClose.next(this.listaEquiposSeleccionados);
    this.bsModalRef.hide();
  }

  validarBoton() {
    if (this.textoBusqueda !== '' || this.siglaBusqueda !== '') {
      this.interruptorBoton = false;
    } else {
      this.interruptorBoton = true;
    }
  }

  sombrearFilasSeleccionadas() {
    const listaFilas = jQuery('tr');
    let equipoEncontrado: Equipo;
    for (let i = 0; i < listaFilas.length; i++) {
      equipoEncontrado = this.listaEquiposSeleccionados.find( function(equipo) {        
        return equipo.id === listaFilas[i].id;
      });     
    }    
  }
}

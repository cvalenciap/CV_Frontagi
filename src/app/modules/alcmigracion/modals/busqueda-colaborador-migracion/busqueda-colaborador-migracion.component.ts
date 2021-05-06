import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Equipo} from "../../../../models/equipo";
import {Area} from "../../../../models/area";
import {Paginacion, Response} from "../../../../models";
import {BsModalRef} from "ngx-bootstrap";
import {ToastrService} from "ngx-toastr";
import {AreaService} from "../../../../services/impl/area.service";
import {Colaborador} from "../../../../models/colaborador";
import {BandejaDocumentoService} from "../../../../services";

@Component({
  selector: 'app-busqueda-colaborador-migracion',
  templateUrl: './busqueda-colaborador-migracion.component.html',
  styleUrls: ['./busqueda-colaborador-migracion.component.scss']
})
export class BusquedaColaboradorMigracionComponent implements OnInit, AfterViewInit {
  /* */
  public loading: boolean;
  public textoNombre: string;
  public textoNumeroFicha: string;
  public textoApellidoPaterno: string;
  public textoApellidoMaterno: string;
  public interruptorBoton: boolean;
  public interruptorAceptar: boolean;
  public colaboradores: Colaborador[];
  public filaSeleccionada: number;
  public colaboradorSeleccionado: Colaborador;
  public onClose: Subject<Colaborador>;
  /* */

  public parametroBusqueda: string;
  public textoBusqueda: string;
  public siglaBusqueda: string;
  public listaEquiposSeleccionados: Equipo [];
  listado: Area[];
  responsable: string;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Equipo;

  constructor(public bsModalRef: BsModalRef, private toastr: ToastrService, private service: AreaService,
              private servicioMigracion: BandejaDocumentoService) {
    this.listaEquiposSeleccionados = new Array<Equipo>();
    this.onClose = new Subject();
    this.paginacion = new Paginacion({registros: 10});
    this.parametroBusqueda = '';
  }

  ngOnInit() {
    this.inicializarVariables();
  }

  ngAfterViewInit() {
    // Add slimscroll to element
    /*jQuer('.full-height-scroll').slimscroll({
      height: '100%'
    });*/
  }

  inicializarVariables() {
    this.textoNombre = '';
    this.textoNumeroFicha = '';
    this.textoApellidoPaterno = '';
    this.textoApellidoMaterno = '';
    this.interruptorBoton = true;
    this.interruptorAceptar =  true;
    this.loading = false;
    this.colaboradores = new Array<Colaborador>();
    this.paginacion = new Paginacion({ registros: 10 });
  }

  limpiar() {
    this.inicializarVariables();
  }

  cancelar() {
    this.bsModalRef.hide();
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

  seleccionarColaborador(indice: number, colaborador: Colaborador) {
    this.colaboradorSeleccionado = colaborador;
    this.filaSeleccionada = indice;
    if (this.filaSeleccionada < 0 || this.colaboradorSeleccionado == null) {
      this.interruptorAceptar = true;
    } else {
      this.interruptorAceptar = false;
    }
  }
  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57)) {
      evento.preventDefault();
    }
  } 
  
  enviarColaborador() {
    this.onClose.next(this.colaboradorSeleccionado);
    this.bsModalRef.hide();
  }

  validarBoton() {
    if (this.textoNumeroFicha !== '' || this.textoNombre !== '' || this.textoApellidoPaterno !== ''
            || this.textoApellidoMaterno !== '') {
      this.interruptorBoton = false;
    } else {
      this.interruptorBoton = true;
    }
  }

  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  obtenerParametros(): Map<string, any> {
    const parametros: Map<string, any> = new  Map<string, any>();
    parametros.set('pagina', this.paginacion.pagina);
    parametros.set('registros', this.paginacion.registros);
    parametros.set('numeroFicha', this.textoNumeroFicha);
    parametros.set('nombre', this.textoNombre);
    parametros.set('apellidoPaterno', this.textoApellidoPaterno);
    parametros.set('apellidoMaterno', this.textoApellidoMaterno);
    return parametros;
  }

  buscar() {
    this.servicioMigracion.obtenerColaboradoresMigracion(this.obtenerParametros(), this.paginacion).subscribe( (responseService: Response) => {
      this.colaboradores = responseService.resultado;
      this.paginacion = new Paginacion(responseService.paginacion);
    }, (error) => {
      this.controlarError(error);
    });
  }

}

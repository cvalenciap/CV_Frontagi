import {AfterViewInit, Component, OnInit} from '@angular/core';
import {Subject} from "rxjs";
import {Paginacion, Response} from "src/app/models";
import {BsModalRef} from "ngx-bootstrap";
import {ToastrService} from "ngx-toastr";
import {BandejaDocumentoService, ColaboradoresService} from "src/app/services";
import { Equipo } from 'src/app/models/equipo';
import { Area } from 'src/app/models/area';
import { Colaborador } from 'src/app/models/colaborador';
import { AreaService } from 'src/app/services/impl/area.service';

@Component({
  selector: 'app-busqueda-colaborador-mantenimiento',
  templateUrl: './busqueda-colaborador-mantenimiento.component.html',
  styleUrls: ['./busqueda-colaborador-mantenimiento.component.scss']
})
export class BusquedaColaboradorMantenimientoComponent implements OnInit, AfterViewInit {
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
              private servicioColaboradores: ColaboradoresService) {
    this.listaEquiposSeleccionados = new Array<Equipo>();
    this.onClose = new Subject();
    this.paginacion = new Paginacion({registros: 10});
    this.parametroBusqueda = '';
  }

  ngOnInit() {
    this.inicializarVariables();
  }

  ngAfterViewInit() {

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

  buscar() {
    
    const parametros: {numeroFicha?: string, nombre?: string, apellidoPaterno?: string, apellidoMaterno?: string}= { numeroFicha: null, nombre: null, apellidoPaterno: null, apellidoMaterno: null};
    parametros.numeroFicha = this.textoNumeroFicha;
    parametros.nombre = this.textoNombre;
    parametros.apellidoPaterno = this.textoApellidoPaterno;
    parametros.apellidoMaterno = this.textoApellidoMaterno;
    this.servicioColaboradores.buscarPorColaborador(parametros,this.paginacion.pagina,this.paginacion.registros).subscribe( (responseService: Response) => {
      
      this.colaboradores = responseService.resultado;
      this.paginacion = responseService.paginacion;
    }, (error) => {
      this.controlarError(error);
    });
  }

}

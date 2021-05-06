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
import { Curso } from 'src/app/models/curso';
import { CursoService } from 'src/app/services/impl/curso.service';

@Component({
  selector: 'app-busqueda-curso-mantenimiento',
  templateUrl: './busqueda-curso-mantenimiento.component.html',
  styleUrls: ['./busqueda-curso-mantenimiento.component.scss']
})
export class BusquedaCursoMantenimientoComponent implements OnInit, AfterViewInit {
  /* */
  public loading: boolean;
  public textoCodigo: string;
  public textoCurso: string;
  public interruptorBoton: boolean;
  public interruptorAceptar: boolean;
  public cursos: Curso[];
  public filaSeleccionada: number;
  public colaboradorSeleccionado: Curso;
  public onClose: Subject<Curso>;
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
              private servicioCurso: CursoService) {
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
    this.textoCodigo = '';
    this.textoCurso = '';
    this.interruptorBoton = true;
    this.interruptorAceptar =  true;
    this.loading = false;
    this.cursos = new Array<Curso>();
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

  seleccionarColaborador(indice: number, curso: Curso) {
    
    this.colaboradorSeleccionado = curso;
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
    
    if (this.textoCodigo !== '' || this.textoCurso !== '' ) {
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
    
    const parametros: {codigoCurso?: string, nombreCurso?: string}= { codigoCurso: null, nombreCurso: null};
    parametros.codigoCurso = this.textoCodigo;
    parametros.nombreCurso = this.textoCurso;
    this.servicioCurso.buscarCurso(parametros,this.paginacion.pagina,this.paginacion.registros).subscribe( (responseService: Response) => {
      
      this.cursos = responseService.resultado;
      this.paginacion = responseService.paginacion;
    }, (error) => {
      this.controlarError(error);
    });
  }

}

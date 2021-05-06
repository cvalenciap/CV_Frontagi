import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {RutaResponsablesService} from '../../../services';
import {Tipo} from '../../../models/tipo';
import {Estado} from '../../../models/enums/estado';
import {RutaResponsable} from '../../../models/rutaresponsable';
import {Response} from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
//import { RutaResponsablesMockService as RutaResponsableService} from '../../../services';
import {ModalOptions, BsModalService, BsModalRef} from 'ngx-bootstrap';
import {AgregarUsuarioComponents} from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { Colaborador } from 'src/app/models/colaborador';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import {HttpClient, HttpHeaders, HttpParams} from '@angular/common/http';
import { environment } from 'src/environments/environment';
import {Constante} from '../../../models/enums/constante';
import { Parametro } from 'src/app/models/parametro';

@Component({
  selector: 'rutaresponsable-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['lista.component.scss'],
  //providers: [RutaResponsableService]
  providers: [RutaResponsablesService, ParametrosService]
})
export class RutaResponsablesEditarComponent implements OnInit {

  /* datos */
  items: RutaResponsable[];
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  //selectedObject: RutaResponsable;
  /* indicador de carga */
  loading: boolean;
  itemCodigo: number;
  /* datos */
  selectedObject: RutaResponsable;
  listaTipos: Tipo[];
  item: RutaResponsable;
  private sub: any;
  /* Lista de Participante */
  participante:RutaParticipante;

  /* Lista de Estados */
  listaEstados: [
    {id:1, valor:'ACTIVO'},
    {id:0, valor:'INACTIVO'}
  ];

  //Objeto para abrir ventana
  objetoVentana: BsModalRef;

  //Id de las Etapas
  idElaboracion: number;
  idConsenso: number;
  idAprobacion: number;
  idHomologacion: number;
  idFase:number;

  constructor(private modalService: BsModalService,
              private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private serviceRuta: RutaResponsablesService,
              private serviceParametro: ParametrosService,
              private http: HttpClient) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({registros: 10});
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }
  ////
  /*OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getLista();
  }
  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getLista();
  }

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getLista();
  }*/
  OnModificar(): void {
    this.router.navigate([`mantenimiento/rutaresponsables/editar/${this.selectedObject.codigo}`]);
  }

  /*getLista(): void {
    this.loading = true;
    const parametros: {codigo?: string, fecha?: string, descripcion?: string} = {codigo: null, fecha: null, descripcion: null};
    switch (this.parametroBusqueda) {
      case 'codigo':
        parametros.codigo = this.textoBusqueda;
        break;
      case 'fecha':
        parametros.fecha = this.textoBusqueda;
        break;
      case 'descripcion':
      default:
        parametros.descripcion = this.textoBusqueda;
    }
    this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (error) => this.controlarError(error)
    );
  }*/
  ngOnInit() {
    this.listaEstados = [
      {id:1, valor:'ACTIVO'},
      {id:0, valor:'INACTIVO'}
    ];
    
    this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idElaboracion=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.ETAPA_RUTA_ELABORACION);
        this.idConsenso=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.ETAPA_RUTA_CONSENSO);
        this.idAprobacion=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.ETAPA_RUTA_APROBACION);
        this.idHomologacion=this.serviceParametro.obtenerIdParametro(
          resultado,Constante.ETAPA_RUTA_HOMOLOGACION);
        this.idFase=this.idElaboracion;
      },
      (error) => this.controlarError(error)
    );
    
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['id'];
    });
    if(this.itemCodigo) {
      this.serviceRuta.buscarPorCodigo(this.itemCodigo).subscribe(
        (response: Response) => {
          this.item = response.resultado[0];
        },
        (error) => this.controlarError(error)
      );
      //this.item=this.items[0];
    } else {
      this.item = this.serviceRuta.crear();
      //this.item.tipo = this.listaTipos[0];
    }
    if(this.item==null) this.item=new RutaResponsable();
  }

  OnGuardar() {
    this.serviceRuta.guardar(this.item).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`mantenimiento/rutaresponsable`]);
      }
      //  (error) => this.controlarError(error)
    );
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/rutaresponsables`]);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnNuevo(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {},
      class: 'modal-lg'
    }
    this.objetoVentana = this.modalService.show(AgregarUsuarioComponents, config);
    (<AgregarUsuarioComponents>this.objetoVentana.content).onClose.subscribe(result => {
      let objeto:RutaParticipante = result;
      objeto.idRuta=this.itemCodigo;
      objeto.idFase=this.idFase;
      objeto.estado=Estado.ACTIVO;
      if(this.idFase==this.idElaboracion)       this.item.listaElaboracion.push(objeto);
      else if(this.idFase==this.idConsenso)     this.item.listaConsenso.push(objeto);
      else if(this.idFase==this.idAprobacion)   this.item.listaAprobacion.push(objeto);
      else if(this.idFase==this.idHomologacion) this.item.listaHomologacion.push(objeto);
    });
  }
}
import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { JerarquiasService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { Jerarquia } from '../../../models/jerarquia';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Parametro } from '../../../models/parametro';
import { ViewChild } from '@angular/core';
//import { TreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla';
import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { JerarquiasFormularioComponent } from 'src/app/modules/jerarquia/views/editar_formulario.component';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Constante } from 'src/app/models/enums';
import { validate } from 'class-validator';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { forkJoin } from 'rxjs';
import { Programa } from 'src/app/models/programa';
import { Norma } from 'src/app/models/norma';
import { NgxSpinnerService } from 'ngx-spinner';
//import { JerarquiasMockService as JerarquiaService} from '../../../services';
declare var jQuery: any;
@Component({
  selector: 'jerarquia-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [JerarquiasService]
})
export class JerarquiasEditarComponent implements OnInit, OnDestroy {

  @ViewChild(ArbolPlantillaCoTreeFlatOverviewData) child: ArbolPlantillaCoTreeFlatOverviewData;
  @ViewChild(JerarquiasFormularioComponent) formulario: JerarquiasFormularioComponent;
  /* datos */
  items: Jerarquia[];
  loading: boolean;
  itemCodigo: number;
  /* datos */

  /* Lista de Tipos de Jerarquia */
  listaTipos: Parametro[];
  item: Jerarquia;
  private sub: any;
  /* Lista de Estados */
  listaEstados: any;
  nodoId: number;
  indicadorProceso: boolean;

  /* YPM - INICIO */
  habilitarFicha: boolean;
  habilitarGuardar: boolean;
  jerarquiaTipoProceso: boolean;
  tipoJerarquia: string;
  mensajes: any;
  tipoJerarquiaNom: string;
  /* YPM - FIN */
  ngAfterViewInit() {
    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }
  jerarquia: Jerarquia = new Jerarquia;
  validar: boolean;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private servicioValidacion: ValidacionService,
    private service: JerarquiasService,
    private serviceDocumento: BandejaDocumentoService,
    private spinner: NgxSpinnerService) {
    this.loading = false;
    this.items = [];
    this.item = new Jerarquia();

    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.indicadorProceso = false;


    /* YPM - INICIO */
    this.habilitarFicha = false;
    this.habilitarGuardar = true;
    this.jerarquiaTipoProceso = false;
    this.tipoJerarquia = "";
    /* YPM - FIN */
  }

  ngOnInit() {
    
    this.tipoJerarquiaNom = null;
    this.validar = false;
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['id'];
      this.tipoJerarquia = params['v_descons']

      if (this.tipoJerarquia.toUpperCase() == Constante.TIPO_JERARQUIA_PROCESO.toUpperCase()) {

        this.jerarquiaTipoProceso = true;
      }
      this.tipoJerarquiaNom = this.tipoJerarquia.toUpperCase();
      localStorage.setItem("idProcesoSeleccionado", this.itemCodigo.toString());
      localStorage.setItem("tipoNom", this.tipoJerarquiaNom.toString());
    });

    this.child.objnode.subscribe(objnode => {
      
      this.formulario.capturaNodo(objnode);

      //this.item.estado=Estado.INACTIVO;


    });
  }
  /* YPM - INICIO */
  ngOnDestroy() {
    localStorage.removeItem("idProcesoSeleccionado");
    localStorage.removeItem("tipoNom");
  }
  /* YPM - FIN */

  OnMapearErrores(errors, mensajes) {
    
    errors.map(e => {
      Object.defineProperty(mensajes, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
    });
  }

  OnGuardar() {
    
    
    let beanJerarquia: Jerarquia = this.formulario.OnObtenerBeanJerarquia();
    this.jerarquia.valModificar = false;
    if (beanJerarquia.valModificar) {
      let jerarquia: Jerarquia = this.formulario.OnModificar();
      this.jerarquia = jerarquia;
      this.jerarquia.valModificar = jerarquia.valModificar;
    }
    var estado: boolean = false;
    if (beanJerarquia.estado == Estado.INACTIVO) {
      if (beanJerarquia.mensajeDoc) {
        this.validar = false;
        this.toastr.warning('Existe documentos en esta ruta', 'Acción completada!', { closeButton: true });
      } else {
        if (beanJerarquia.listaDetalleDoc.length > 0) {
          for (let dat of beanJerarquia.listaDetalleDoc) {
            if (!dat.mensajeDoc) {
              this.validar = true;
              this.jerarquia.valModificar = true;
            } else {
              this.validar = false;
              this.toastr.warning('Existe documentos en las ramas hijas de la ruta', 'Acción completada!', { closeButton: true });
              break;
            }
          }
        } else {
          this.jerarquia.valModificar = true;
          this.validar = true;
        }
      }
    } else if (beanJerarquia.abrJera.trim() == '') {
      if (beanJerarquia.idJerarquia == 122) {
        this.validar = false;
        this.toastr.warning('Debe ingresar una abreviatura', 'Acción completada!', { closeButton: true });
      } else {
        this.validar = true;
      }

    } else {
      this.validar = true;
    }
    // Verificacion de validaciones

    if (this.validar) {
      this.formulario.errors = {};
      forkJoin(validate(beanJerarquia)).subscribe(([errors]: [any]) => {
        this.mensajes = {};

        if (errors.length > 0) {
          this.OnMapearErrores(errors, this.mensajes);
          this.formulario.errors = this.mensajes;
          this.toastr.error(`Existen campos con infomación inválida`, 'Acción inválida', { closeButton: true });
        } else {
          if (this.jerarquia.valModificar) {
            beanJerarquia.descripcion = this.jerarquia.descripcion;
            beanJerarquia.ruta = this.jerarquia.ruta;
            beanJerarquia.detAnterior = this.jerarquia.detAnterior;
            
            this.spinner.show();
            this.service.actualizar(beanJerarquia).subscribe(
              (response: Response) => {
                
                this.item = response.resultado;
                this.spinner.hide();
                this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                this.formulario.OnClear();
                this.invocaArbol();
                //this.router.navigate(['documento/jerarquias']);                
              },
              (error) => this.controlarError(error)
            );
          } else {
            
            this.spinner.show();
            this.service.guardar(beanJerarquia).subscribe(
              (response: Response) => {
                this.item = response.resultado;
                this.spinner.hide();
                this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                this.formulario.OnClear();
               this.invocaArbol();                
                //  this.router.navigate(['documento/jerarquias']);
              },
              (error) => this.controlarError(error)
            );
          }

        }

      });
    }
    
  }

  OnRegresar() {
    this.router.navigate(['documento/jerarquias']);
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  /* YPM - INICIO */
  invocaArbol() {
    this.child.getLista();
  }

  OnEvaluaTipoCarpeta(nodoTipoDocumento): void {
    
    if (this.jerarquiaTipoProceso) {
      // Evaluo si el nodo es de tipo documento
      if (nodoTipoDocumento) {
        this.habilitarGuardar = true;
        this.habilitarFicha = false;
      } else {
        this.habilitarGuardar = true;
        this.habilitarFicha = true;
      }
    }

  }

  // Metodo solo para jerarquia tipo "Proceso"
  OnModificarFicha(): void {
    
    let objeto = this.formulario.OnObtenerBeanJerarquia();
    localStorage.setItem("beanJerarquia", JSON.stringify(objeto));

    this.router.navigate(['documento/jerarquias/editarFicha/' + Constante.MANTENIMIENTO]);

  }
  /* YPM - FIN */

}

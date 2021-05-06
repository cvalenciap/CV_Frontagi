import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {BandejaDocumentoService} from '../../../services';
import {Tipo} from '../../../models/tipo';
import {Estado} from '../../../models/enums/estado';
import {BandejaDocumento} from '../../../models/bandejadocumento';
import {Constante} from 'src/app/models/enums';
import {Response} from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Arbol } from '../../../models/arbol';
import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { GestionDocumentoComponents } from 'src/app/modules/bandejadocumento/components/gestiondocumento.component';
import { BusquedaAvanzadaComponents } from 'src/app/modules/bandejadocumento/modales/busqueda-avanzada.component';
import { CRegistroDocumentoComponent } from 'src/app/modules/bandejadocumento/components/components-registro-documento.component';
import { GestionDocumentoTrasladoComponents } from 'src/app/modules/bandejadocumento/components/gestiondocumentoTraslado.component';
import { ParametrosService, RelacionCoordinadorService } from './../../../services/index';
import { forkJoin } from 'rxjs';

declare var jQuery:any;

@Component({
  selector: 'bandejadocumento-editar-traslado',
  templateUrl: 'editarTraslado.template.html',
  styleUrls: ['editarTraslado.component.scss'],
  providers: [BandejaDocumentoService]
})
export class BandejaEditarTrasladoComponent implements OnInit {

  /* codigo seleccionado */
  itemCodigo: number;
  /* datos */
  listaTipos: Tipo[];
  item: BandejaDocumento;
  private sub: any;
  //selectedObject: BandejaDocumento;
  /* indicador de carga */
  loading: boolean;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  /* datos */
  items: Arbol[];
  parametroId: number;
  parametroIdTipoDoc: number;
  selectedObject: Arbol;
  listaTipoJerarquia: any[];
  idTipoGerencia: number;
  idTipoAlcance: number;
  nodosJerarquiaGerencia: any[];
  nodosJerarquiaAlcance: any[];

  @Input() activar : boolean;  
  @Input() consulta : boolean; 
  
  @ViewChild(ArbolPlantillaCoTreeFlatOverviewData) child: ArbolPlantillaCoTreeFlatOverviewData;
  //@ViewChild(DynamicDatabase) child: DynamicDatabase;
  @ViewChild(GestionDocumentoTrasladoComponents) segundoHijo: GestionDocumentoTrasladoComponents;
  @ViewChild(GestionDocumentoTrasladoComponents) tercerHijo: GestionDocumentoTrasladoComponents;
  @ViewChild(GestionDocumentoTrasladoComponents) cuartoHijo: GestionDocumentoTrasladoComponents;
  @ViewChild(GestionDocumentoTrasladoComponents) quintoHijo: GestionDocumentoTrasladoComponents;

  ngAfterViewInit() {
    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: BandejaDocumentoService,
              private serviceParametro: ParametrosService,
              private serviceRela: RelacionCoordinadorService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.items = [];
    this.parametroId;
    this.parametroIdTipoDoc;
    //Habilitamos el boton
    this.activar= true;
  }

  ngOnInit() {
    
    this.child.objnode.subscribe(nodes =>
      {
        
        this.parametroId = nodes.id;
        this.parametroIdTipoDoc = nodes.idTipoDocu;
        this.segundoHijo.parametroId = this.parametroId;
        this.segundoHijo.parametroIdTipoDoc = this.parametroIdTipoDoc;
        this.segundoHijo.idTipoDocu = this.parametroIdTipoDoc;
        this.segundoHijo.parametroRuta = nodes.ruta;
        this.segundoHijo.onChange();
        localStorage.setItem("idjerarquia",String(this.parametroId));
        localStorage.setItem("tipodocumento",String(this.parametroIdTipoDoc));
        localStorage.setItem("textotipodocumento",nodes.nombre);
        this.segundoHijo.activarBotonNuevo();
        
        let listaNodes = nodes;
        this.segundoHijo.listaNodes = listaNodes;
        this.segundoHijo.pasoParametros();
     }
    );

    this.OnSetearValores() 
    this.obtenerTipoJerarquia() 

  }

  /*getLista(): void {
    
    this.loading = true;*/
    //const parametros: {codigo?: string, fecha?: string, descripcion?: string} = {codigo: null, fecha: null, descripcion: null};
    /*const parametros: {codigo?: string, fecha?: string, descripcion?: string} = {codigo: null, fecha: null, descripcion: null};*/
    /*switch (this.parametroBusqueda) {
      case 'codigo':
        parametros.codigo = this.textoBusqueda;
        break;
      case 'fecha':
        parametros.fecha = this.textoBusqueda;
        break;
      case 'descripcion':
      default:
        parametros.descripcion = this.textoBusqueda;
    }*/
    /*
    this.service.buscarPorParametrosArbol(parametros, 0, 0).subscribe(    
      (response: Response) => {
               
        this.items = response.resultado;*/
        /*
        for(let i: number = 0; this.items.length>i; i++){        
          console.log("Dato--->>>>"+this.items[i].id);
        }*/
        
        //this.child.datosArbol = this.items;
        //this.child.mostrarDatosArbol();
/*
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (error) => this.controlarError(error)
    );
  }*/

  OnGuardar() {
    /*
    this.service.guardar(this.item).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
      }
      //  (error) => this.controlarError(error)
    );*/
  }
  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  } 
  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  
  }

  OnSetearValores() {
    this.nodosJerarquiaGerencia = [];
    this.nodosJerarquiaAlcance = [];
    this.listaTipoJerarquia = [];
    this.idTipoGerencia = 0;
    this.idTipoAlcance = 0;
    localStorage.removeItem('nodosJerarquiaGerencia');
    localStorage.removeItem('nodosJerarquiaAlcance');
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
    let buscaArbolGerencia = this.serviceRela.obtenerArbolJerarquiaPorTipo(this.idTipoGerencia);
    let buscaArbolAlcance = this.serviceRela.obtenerArbolJerarquiaPorTipo(this.idTipoAlcance);

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

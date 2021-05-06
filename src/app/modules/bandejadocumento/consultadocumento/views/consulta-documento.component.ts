import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {BandejaDocumentoService} from '../../../../services';
import {Tipo} from '../../../../models/tipo';
import {Estado} from '../../../../models/enums/estado';
import {BandejaDocumento} from '../../../../models/bandejadocumento';
import {Response} from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { Arbol } from '../../../../models/arbol';
//import { TreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
//import { DynamicDatabase } from 'src/app/modules/arbol/views/tree-dynamic-example';



//import { BandejaDocumentoMockService as BandejaDocumentoService} from '../../../services';

declare var jQuery:any;

@Component({
  selector: 'consulta-bandeja-documento',
  templateUrl: 'consulta-documento.template.html',
  styleUrls: ['consultas.component.scss'],
  providers: [BandejaDocumentoService]
})
export class ConsultaDocumentoComponent implements OnInit {

 /*Indicador  */
 indicadorDocumento: string;
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
  selectedObject: Arbol;
  @Input() activar : boolean;  
  @Input() consulta : boolean; 
  //@ViewChild(TreeFlatOverviewData) child: TreeFlatOverviewData;
  //@ViewChild(DynamicDatabase) child: DynamicDatabase;

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
              private service: BandejaDocumentoService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.items = [];
    this.parametroId;
    this.indicadorDocumento;
    this.activar= false;
  }
  ngOnInit() {
    //capturamos los datos Sessión    
    this.indicadorDocumento = localStorage.getItem("indicadordocumento");
    if(this.indicadorDocumento =="1"){
      localStorage.setItem("indicadordocumento","1");
    }else {
      localStorage.setItem("indicadordocumento","2");
    }
    localStorage.removeItem("idProcesoSeleccionado");
    localStorage.setItem("activarBuscador","1");

    //this.getLista(); 
    
    /*
    this.child.emitEvent.subscribe(parametroIdArbol =>
      {
        this.parametroId = parametroIdArbol;
        console.log("PARAMETRO EDITAR:" + parametroIdArbol);
      }
    );*/
    }
   

  getLista(): void {
    
  this.loading = true;
    //const parametros: {codigo?: string, fecha?: string, descripcion?: string} = {codigo: null, fecha: null, descripcion: null};
    const parametros: {codigo?: string, fecha?: string, descripcion?: string} = {codigo: null, fecha: null, descripcion: null};
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
               
        this.items = response.resultado;

        for(let i: number = 0; this.items.length>i; i++){        
          console.log("Dato--->>>>"+this.items[i].id);
        }
        
        this.child.datosArbol = this.items;
        this.child.mostrarDatosArbol();

        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
      (error) => this.controlarError(error)
    );*/
  }

  OnGuardar() {
  /*  this.service.guardar(this.item).subscribe(
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
  
}

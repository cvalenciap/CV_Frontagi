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
import { SessionService } from 'src/app/auth/session.service';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
//import { DynamicDatabase } from 'src/app/modules/arbol/views/tree-dynamic-example';



//import { BandejaDocumentoMockService as BandejaDocumentoService} from '../../../services';

declare var jQuery:any;


@Component({
  selector: 'bandejadocumento-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['editar.component.scss'],
  providers: [BandejaDocumentoService]
})
export class BandejaDocumentoEditarComponent implements OnInit {

  /* codigo seleccionado */
  itemCodigo: number;
  @ViewChild('generalGestion') generalGestion: GestionDocumentoComponents;
  /* datos */
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
  objetoRetornoBusqueda:RetornosBusqueda;
  pagRetorno: number;
  general2: PaginacionSetComponent;
  objetoBusqAvanz: BandejaDocumento;
  @Input() activar : boolean;  
  @Input() consulta : boolean; 
  
  @ViewChild(ArbolPlantillaCoTreeFlatOverviewData) child: ArbolPlantillaCoTreeFlatOverviewData;
  //@ViewChild(DynamicDatabase) child: DynamicDatabase;
  @ViewChild(GestionDocumentoComponents) segundoHijo: GestionDocumentoComponents;
  @ViewChild(GestionDocumentoComponents) tercerHijo: GestionDocumentoComponents;
  @ViewChild(GestionDocumentoComponents) cuartoHijo: GestionDocumentoComponents;
  @ViewChild(GestionDocumentoComponents) quintoHijo: GestionDocumentoComponents;

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
              private session: SessionService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.items = [];
    this.parametroId;
    this.parametroIdTipoDoc;
    this.objetoBusqAvanz = new BandejaDocumento();
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
        this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
        this.objetoBusqAvanz = JSON.parse(localStorage.getItem("objetoRetornoBusqAvanz"));

        if (this.objetoRetornoBusqueda == null) {
          this.segundoHijo.parametroBusqueda = "titulodefault";
          this.segundoHijo.OnDescripcionSeleccionada();
          this.segundoHijo.onChange();
          this.segundoHijo.activarBotonNuevo();
        } else{

          if (localStorage.getItem("objetoRetornoBusqAvanz")!=undefined || localStorage.getItem("objetoRetornoBusqAvanz")!=null) {
            this.segundoHijo.getListaBusqueda(null,null,null, this.objetoBusqAvanz);
          }else{
            this.segundoHijo.onChangeRetorno();
            this.segundoHijo.activarBotonNuevo();
          }
          
          if (this.objetoRetornoBusqueda.registros <= 10) {
            this.segundoHijo.OnPageChangedReturn(this.objetoRetornoBusqueda.pagina);
          } else {
            this.general2 =  JSON.parse(localStorage.getItem("general1"));
            this.pagRetorno = parseInt( localStorage.getItem("pagRetorno"));
            this.generalGestion.general1.change(this.objetoRetornoBusqueda.registros);
            this.segundoHijo.OnPageOptionChangedReturn(this.pagRetorno, this.objetoRetornoBusqueda.registros);
          }

        }
        

        localStorage.setItem("idjerarquia",String(this.parametroId));
        localStorage.setItem("tipodocumento",String(this.parametroIdTipoDoc));
        localStorage.setItem("textotipodocumento",nodes.nombre);

        //cguerra Inicio
        localStorage.setItem("indicadorDescarga",nodes.indicadorDescargas)        
        //cguerra Fin


        //localStorage.removeItem('nodeSeleccionado'); 
       
        
        let listaNodes = nodes;
        this.segundoHijo.listaNodes = listaNodes;
        this.segundoHijo.pasoParametros();


        this.loading=false;

     }
    );
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

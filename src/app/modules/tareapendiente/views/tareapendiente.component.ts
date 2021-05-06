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
import {Response} from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Arbol } from '../../../models/arbol';

//import { ViewChild } from '@angular/core';
//import { TreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla';
import * as dataListTareasPendientes from "../../../services/mocks/tareaspendientes.json";
import { JsonService } from 'src/app/services/json.service';
import { Documento } from 'src/app/models/documento';
//import { DynamicDatabase } from 'src/app/modules/arbol/views/tree-dynamic-example';

declare var jQuery:any;

//import { BandejaDocumentoMockService as BandejaDocumentoService} from '../../../services';

declare var jQuery:any;

@Component({
  selector: 'app-tareapendiente',
  templateUrl: 'tareapendiente.template.html',
  styleUrls: ['tareapendiente.component.scss'],
  //providers: [BandejaDocumentoService]
})
export class TareaPendienteComponent implements OnInit {

  /* codigo seleccionado */
  itemCodigo: number;
  listaTareasPendientes:any[];
  vistaTareaPendiente:string="APRO_SOLICITUD";
  /* datos */
  listaTipos: Tipo[];
  item: Documento;
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
  selectedObject: Arbol;
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
              private service: BandejaDocumentoService,
              private _jsonService: JsonService) {
    this.loading = false;0
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.items = [];
    this.onCargarTareasPendientes();

  }

  ngOnInit() {
    
  }

  onCargarTareasPendientes(){
    this.listaTareasPendientes = [];
    this._jsonService.getTareasPendientes().subscribe(
      response => {
        console.log("respuesta dashborad", response);
        this.listaTareasPendientes = response.responseData;
      },
      error => {
        alert("error "+ error);
      },
      () => {
        console.log("se completo la carga de tareas pendientes");
      }
    );
  }

  OnGuardar() {
    this.service.guardar(this.item).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
      }
      //  (error) => this.controlarError(error)
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
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  /*OnModificar(): void {
    this.router.navigate([`documento/general/bandejadocumento/registrarFichaTecnica/${this.selectedObject.codigo}`]);
  }*/

}

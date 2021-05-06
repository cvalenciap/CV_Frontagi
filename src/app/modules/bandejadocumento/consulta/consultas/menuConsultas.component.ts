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
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';

declare var jQuery:any;

@Component({
  selector: 'menuConsultas',
  templateUrl: 'menuConsultas.template.html',
  providers: [BandejaDocumentoService]
})
export class BandejaMenuConsultasComponent implements OnInit {

  /* codigo seleccionado */
  //itemCodigo: number;
  /* datos */
  //listaTipos: Tipo[];
  //item: BandejaDocumento;
  //private sub: any;
  //selectedObject: BandejaDocumento;
  /* indicador de carga */
  loading: boolean;
  /* paginación */
  //paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  /* datos */
  //items: Arbol[];
  //parametroId: number;
  //selectedObject: Arbol;
  //@ViewChild(TreeFlatOverviewData) child: TreeFlatOverviewData;
  activar : boolean;  
  //listaSeguimiento: BandejaDocumento[];
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  @Input()
  
  ngAfterViewInit() {    
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: BandejaDocumentoService,
              private modalService: BsModalService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    //this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    //this.items = [];
    //this.parametroId;
    this.parametroBusqueda = 'tipo';
  }

  OnNuevo(){
    /*this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(BuscadorDocumentoComponent, config);
    (<BuscadorDocumentoComponent>this.bsModalRef.content).onClose.subscribe(result => {        
    });*/
  }

  ngOnInit() {     
    //this.child.emitEvent.subscribe(parametroIdArbol =>
      //{
        //this.parametroId = parametroIdArbol;
        //console.log("PARAMETRO EDITAR:" + parametroIdArbol);
      //}
    //);
  }
  
  OnGuardar() {
    //this.service.guardar(this.item).subscribe(
      //(response: Response) => {
        //this.item = response.resultado;
        //this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
        //this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
      //}
      //  (error) => this.controlarError(error)
    //);
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  
  }
  
}

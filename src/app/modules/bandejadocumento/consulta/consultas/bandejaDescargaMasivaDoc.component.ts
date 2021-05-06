import { Component, OnInit, SecurityContext } from '@angular/core';
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
import { DomSanitizer } from '@angular/platform-browser';
import { BajarDocumentoComponents } from 'src/app/modules/bandejadocumento/modales/bajar-documento.component';

declare var jQuery:any;

@Component({
  selector: 'bandejaDescargaMasivaDoc',
  templateUrl: 'bandejaDescargaMasivaDoc.template.html',  
  providers: [BandejaDocumentoService]
})
export class BandejaDescargaMasivaDocComponent implements OnInit {
  
  selectedObject: BandejaDocumento;
  loading: boolean;
  paginacion: Paginacion;
  selectedRow: number;
  activar : boolean;
  bsModalRef: BsModalRef;
  selectedFilter: string;
  busquedaBandejaDocumento: BandejaDocumento;
  textoBusqueda: string;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  deshabilitarBuscar: boolean;
  valorChecked: boolean;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: BandejaDocumentoService,
              private modalService: BsModalService,
              private sanitizer: DomSanitizer) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.selectedFilter = 'codigo';
    this.deshabilitarBuscar = true;
  }

  ngOnInit() {
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.valorChecked = false;
  }

  setFilter(filter: string) {
    
    if(filter == "avanzada"){
      this.selectedFilter = "codigo";
    } else {
      this.selectedFilter = filter;
    }
  }

  darCheckTodos(){
    if(!this.valorChecked){
      this.valorChecked = true;
    } else {
      this.valorChecked = false;
    }
  }

  abrirBusqueda(){
    this.selectedFilter = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    const modalBusqueda = this.modalService.show(BajarDocumentoComponents, config);
    (<BajarDocumentoComponents>modalBusqueda.content).onClose.subscribe(result => {
      this.busquedaBandejaDocumento = result;
      this.OnBuscar();
    });
  }

  habilitarBuscar(): void {
    if(this.textoBusqueda != '')
      this.deshabilitarBuscar=false;
    else
      this.deshabilitarBuscar=true;
  }

  OnBuscar(): void {
    let texto:string = "<strong>Busqueda Por: </strong>";
    console.log(this.selectedFilter);
    
    switch (this.selectedFilter) {
        case 'codigo':
            texto = texto + "<br/><strong>Código: </strong>"+this.textoBusqueda;
            break;
        case 'estadoDocumento':
            texto = texto + "<br/><strong>Estado Documento: </strong>"+this.textoBusqueda;
            break;
    }
    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    //this.getLista();
  }
  
  OnRegresar() {
    this.router.navigate(['documento/consultas']);    
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

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    //this.getLista();
  }
  
  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    //this.getLista();
  }

  onNuevo(){
    
    this.router.navigate([`consulta/descarga/programacion`]);
  }
}
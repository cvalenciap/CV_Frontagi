import { Component, OnInit, SecurityContext} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService} from '../../../../services';
import { Tipo} from '../../../../models/tipo';
import { Estado} from '../../../../models/enums/estado';
import { BandejaDocumento} from '../../../../models/bandejadocumento';
import { Response} from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BajarConocimientoRevisionDocComponents } from 'src/app/modules/bandejadocumento/modales/bandeja-conocimiento-revision-doc.component';
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'reporteTransaccionDocumentos',
  templateUrl: 'reporteTransaccionDocumentos.template.html',  
  providers: [BandejaDocumentoService]
})
export class BandejaReporteTransaccionDocComponent implements OnInit {
  selectedObject: BandejaDocumento;
  loading: boolean;
  paginacion: Paginacion;
  selectedRow: number;
  bsModalRef: BsModalRef;
  selectedFilter: string;
  busquedaTransaccion: BandejaDocumento;
  textoBusqueda: string;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  rutaDocumento: string;

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
    this.selectedFilter = "codigo";
  }

  ngOnInit() {
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.rutaDocumento = "http://sedapal.test:8080/fileserver/agi/c0cbfc6e-1a48-4eb8-b4e4-d15e2170c6d4.pdf";
  }
  
  OnRegresar() {
    this.router.navigate(['documento/consultas']);    
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
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
    const modalBusqueda = this.modalService.show(BajarConocimientoRevisionDocComponents, config);
    (<BajarConocimientoRevisionDocComponents>modalBusqueda.content).onClose.subscribe(result => {
      //this.busquedaBandejaDocumento = result;
      this.OnBuscar();
    });
  }

  OnBuscar(): void {
    let texto:string = "<strong>Busqueda Por: </strong>";
    console.log(this.selectedFilter);
    
    switch (this.selectedFilter) {
        case 'codigo':
            texto = texto + "<br/><strong>Código: </strong>"+this.textoBusqueda;
            break;
        case 'avanzada':
            if(this.busquedaTransaccion.codigo != 0){
                texto = texto + "<br/><strong>Código: </strong>"+ this.busquedaTransaccion.codigo+" ";
            }
            break;
    }
    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    //this.getLista();
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
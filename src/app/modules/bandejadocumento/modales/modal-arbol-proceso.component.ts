import { Component, OnInit, Input, ViewChild } from '@angular/core';
import { Subject, forkJoin, interval } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsModalRef, defineLocale, esLocale, BsLocaleService } from 'ngx-bootstrap';
import { BandejaDocumentoService, ParametrosService } from 'src/app/services';
import { BandejaDocumento } from '../../../models';
import { Response } from '../../../models/response';
import { Constante } from 'src/app/models/enums';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { ArbolProceso } from 'src/app/modules/arbol/views/arbol-proceso-component';

declare var jQuery:any;
@Component({
  selector: 'documento-modal-arbol-proceso',
  templateUrl: 'modal-arbol-proceso.template.html',
})
export class ModalArbolProcesoComponents implements OnInit {
  public onClose: Subject<BandejaDocumento>;
  private sub: any;
  @Input() activarBotonArbol: boolean;
  @Input() idNodo: number;
  @Input() idProceso: number;
  @ViewChild('arbolProceso') hijo: ArbolProceso;

  loading: boolean;
  tipoDocumento: number;
  parametroId: number;
  parametroDescripcion: string;
  rutaCompleta: string;
  textoTitulo: string;
  activarSeleccionar: boolean;
  listaRelacionCoordinador: RelacionCoordinador[];
  tipoDocumentoGerencia: number;

  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  seleccionar(){
    
    let objeto:BandejaDocumento = new BandejaDocumento();
    objeto.parametrodesc        = this.parametroDescripcion;
    objeto.parametroid          = this.parametroId;
    objeto.rutaCompleta         = this.rutaCompleta;
    objeto.tipodocumento        = this.tipoDocumento;  
    this.onClose.next(objeto);
    this.bsModalRef.hide();
  }
 
  constructor(private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private localeService: BsLocaleService,
    private service: BandejaDocumentoService) {
    this.onClose = new Subject();
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.activarBotonArbol  = false;
    this.activarSeleccionar = true;
  }

  ngOnInit() {
    
    this.hijo.idNodoSeleccionado=this.idNodo;
    this.hijo.idProceso         =this.idProceso;
    this.hijo.listaUltimaCoordinadores = this.listaRelacionCoordinador;
    this.hijo.tipoDocumentoGerencia = this.tipoDocumentoGerencia;
    this.hijo.objnode.subscribe(nodes => {
      this.parametroId          = nodes.id;
      this.rutaCompleta         = nodes.ruta;
      this.parametroDescripcion = nodes.nombre;
      this.tipoDocumento        = nodes.idTipoDocu;

      if(this.tipoDocumento!=null) {
        this.activarSeleccionar = false;
      } else {
        this.activarSeleccionar = true;
      }
    });
  }
  
  cancelar(){
    this.bsModalRef.hide();
  }

  getLista(): void {
  }
  
  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

}
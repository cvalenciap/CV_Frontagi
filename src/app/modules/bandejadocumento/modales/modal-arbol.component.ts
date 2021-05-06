import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject, forkJoin, interval } from 'rxjs';
import { subtract } from 'ngx-bootstrap/chronos/moment/add-subtract';
import { BsModalRef, defineLocale, esLocale, BsLocaleService } from 'ngx-bootstrap';
import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { ViewChild } from '@angular/core';
import { Paginacion } from 'src/app/models/paginacion';
import { Arbol } from 'src/app/modules/arbol/arbol.module';
import { Tipo } from 'src/app/models/tipo';
import { BandejaDocumentoService, ParametrosService } from 'src/app/services';
import { Response } from '../../../models/response';
import { ToastrService } from 'ngx-toastr';
import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { BusquedaAvanzadaComponents } from 'src/app/modules/bandejadocumento/modales/busqueda-avanzada.component';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { Constante } from 'src/app/models/enums';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';

declare var jQuery: any;
@Component({
  selector: 'bandeja-documento-modales-arbol',
  templateUrl: 'modal-arbol.template.html',
})
export class ModalArbolComponents implements OnInit {

  public onClose: Subject<BandejaDocumento>;
  @Input() activarBotonArbol: boolean;
  itemCodigo: number;
  listaTipos: Tipo[];
  item: BandejaDocumento;
  private sub: any;
  loading: boolean;
  tipodoc: number;
  paginacion: Paginacion;
  selectedRow: number;
  items: Arbol[];
  parametroId: number;
  selectedObject: Arbol;
  idSeleccionArbol: number;
  rutaCompleta: string;
  parametroDesc: string;
  listaSeguimiento: BandejaDocumento[];
  activar: boolean;
  consulta: boolean;
  activarSeleccionar: boolean;
  idProceso: number;
  idAlcance: number;
  idGerencia: number;
  listaRelacionCoordinador: RelacionCoordinador[];
  tipoDocumentoGerencia: number;

  @ViewChild(ArbolPlantillaCoTreeFlatOverviewData) child: ArbolPlantillaCoTreeFlatOverviewData;

  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  seleccionar() {
    let objeto: BandejaDocumento = new BandejaDocumento();
    objeto.parametrodesc = this.parametroDesc;
    objeto.parametroid = this.parametroId;
    objeto.rutaCompleta = this.rutaCompleta;
    objeto.tipodocumento = this.tipodoc;
    this.onClose.next(objeto);
    this.bsModalRef.hide();
  }

  constructor(private toastr: ToastrService,
    public bsModalRef: BsModalRef,
    private localeService: BsLocaleService,
    private service: BandejaDocumentoService) {
        this.onClose = new Subject();
        this.activar = false;
        this.consulta = false;
        this.loading = false;
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.paginacion = new Paginacion({ registros: 10 });
        this.selectedRow = -1;
        this.items = [];
        this.parametroId;
        this.parametroDesc;
        this.idSeleccionArbol;
        this.activarBotonArbol = false;
        this.activarSeleccionar = true;
  }

  ngOnInit() {
    
    this.child.listaUltimaCoordinadores = this.listaRelacionCoordinador;
    this.child.tipoDocumentoGerencia = this.tipoDocumentoGerencia;

    this.child.objnode.subscribe(nodes => {
      this.parametroId = nodes.id;
      this.rutaCompleta = nodes.ruta;
      this.parametroDesc = nodes.nombre;
      this.tipodoc = nodes.idTipoDocu;
      localStorage.setItem("txttipodocumentos", nodes.nombre);
      localStorage.setItem("idTipDoc", nodes.idTipoDocu);
      if (this.tipodoc != null) {
        this.activarSeleccionar = false;
      } else {
        this.activarSeleccionar = true;
      }
    }
    );
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

}
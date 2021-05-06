import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { ViewChild } from '@angular/core';
import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { JerarquiasFormularioComponent } from 'src/app/modules/jerarquia/views/editar_formulario.component';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Constante } from 'src/app/models/enums';
import { validate } from 'class-validator';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { forkJoin } from 'rxjs';
import { Programa } from 'src/app/models/programa';
import { JerarquiasService } from 'src/app/services';
import { Jerarquia } from 'src/app/models/jerarquia';
import { Parametro } from 'src/app/models/parametro';
import { Subject } from 'rxjs';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { GestionDocumentoComponents } from 'src/app/modules/bandejadocumento/components/gestiondocumento.component';
declare var jQuery: any;

@Component({
  selector: 'app-modal-seleccion-jerarquia',
  templateUrl: './modal-seleccion-jerarquia.component.html',
  styleUrls: ['./modal-seleccion-jerarquia.component.scss'],
  providers: [JerarquiasService]
})
export class ModalSeleccionJerarquiaComponent implements OnInit {

  @ViewChild(ArbolPlantillaCoTreeFlatOverviewData) child: ArbolPlantillaCoTreeFlatOverviewData;
  @ViewChild(JerarquiasFormularioComponent) formulario: JerarquiasFormularioComponent;
  @ViewChild(GestionDocumentoComponents) segundoHijo: GestionDocumentoComponents;
  @ViewChild(GestionDocumentoComponents) tercerHijo: GestionDocumentoComponents;
  @ViewChild(GestionDocumentoComponents) cuartoHijo: GestionDocumentoComponents;
  @ViewChild(GestionDocumentoComponents) quintoHijo: GestionDocumentoComponents;
  public onClose: Subject<RelacionCoordinador>;
  items: Jerarquia[];
  loading: boolean;
  itemCodigo: number;
  listaTipos: Parametro[];
  item: Jerarquia;
  private sub: any;
  listaEstados: any;
  nodoId: number;
  indicadorProceso: boolean;

  habilitarFicha: boolean;
  habilitarGuardar: boolean;
  jerarquiaTipoProceso: boolean;
  tipoJerarquia: string;
  mensajes: any;
  parametroId: number;
  parametroIdTipoDoc: number;
  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private servicioValidacion: ValidacionService,
    private service: JerarquiasService,
    private serviceDocumento: BandejaDocumentoService) {
    this.loading = false;
    this.items = [];
    this.item = new Jerarquia();

    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.indicadorProceso = false;

    this.habilitarFicha = false;
    this.habilitarGuardar = true;
    this.jerarquiaTipoProceso = false;
    this.tipoJerarquia = "";
  }

  ngOnInit() {
    // this.sub = this.route.params.subscribe(params => {
    //   this.itemCodigo = + params['id'];
    //   this.tipoJerarquia = params['v_descons']

    //   if (this.tipoJerarquia.toUpperCase() == Constante.TIPO_JERARQUIA_PROCESO.toUpperCase()) {
    //     this.jerarquiaTipoProceso = true;
    //   }
    //   localStorage.setItem("idProcesoSeleccionado", this.itemCodigo.toString());
    // });

    // this.child.objnode.subscribe(objnode => {
    //   this.formulario.capturaNodo(objnode);
    // });
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
        this.loading=false;
     }
    );
  }

  invocaArbol() {
    this.child.getLista();
  }

}

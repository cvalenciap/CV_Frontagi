import { Component, OnInit, SecurityContext} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService} from '../../../../services';
import { Response} from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { BandejaSeguimientoService } from 'src/app/services/impl/bandejaseguimiento.service';
import { SeguimientoDocumento } from 'src/app/models/seguimientodocumento';
import { Fase } from 'src/app/models/fase';
import { ModalBusquedaSeguimientoDocumentoComponent } from '../modales/modal-busqueda-seguimiento-documento/modal-busqueda-seguimiento-documento.component';
import { NgxSpinnerService } from 'ngx-spinner';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { ViewChild } from '@angular/core';

declare var jQuery:any;

@Component({
  selector: 'bandejaSeguimientoDocumentos',
  templateUrl: 'bandejaSeguimientoDocumentos.template.html',
  styleUrls: ['bandejaSeguimientoDocumentos.component.scss'],
  providers: [BandejaDocumentoService]
})
export class BandejaSeguimientoDocsComponent implements OnInit {
  @ViewChild('pageOption') pageOption: PaginacionSetComponent;
  selectedObject: SeguimientoDocumento;
  loading: boolean;
  paginacion: Paginacion;
  selectedRow: number;
  bsModalRef: BsModalRef;
  selectedFilter: string;
  busquedaSeguimiento: SeguimientoDocumento;
  interruptorBusqueda: boolean;
  textoBusqueda: string;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  listaSeguimientoDocumento:SeguimientoDocumento[];
  parametroBusqueda:string;
  bgVerde:string = "#008000";
  bgAmarillo:string = "#f1dd38";
  bgRojo:string = "#ff0000";
  bgPlomo:string = "#676669";
  cargando:boolean;
  existeElaboracion:boolean;
  existeConsenso:boolean;
  existeAprobacion:boolean;
  existeHomologacion:boolean;
  mapEstados:Map<string,number>;
  estFasRevSelec:string;
  estadoEmision:string;
  mostrarFlujo:boolean;
  estadoDocumentoSeleccionado:string;
  parametrosBusquedaAvanzada:Map<string,any>;
  parametrosBusquedaAvanzadaRetorno: Map<string, any>;
  tipoBusqueda:number;
  objetoRetornoBusqueda:RetornosBusqueda;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  IndicadorPagina:number;
  paginaRetorno:number;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: BandejaSeguimientoService,
              private modalService: BsModalService,
              private sanitizer: DomSanitizer,
              private spinner: NgxSpinnerService
              ) {
    this.loading = false;
    this.cargando = false;
    this.mostrarFlujo = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.mapEstados = new Map<string,number>();
    this.mapEstados.set("Elaboracion",1)
    this.mapEstados.set("Consenso",2)
    this.mapEstados.set("Aprobacion",3);
    this.mapEstados.set("Homologacion",4);
    this.mapEstados.set("sinestado",0); 
    this.parametrosBusquedaAvanzada = new Map<string,any>();
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    this.valorPaginacion = 0;   
    this.IndicadorPagina = 0;       

  }

  ngOnInit() {
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    this.interruptorBusqueda = true;
    this.listaSeguimientoDocumento = [];
    
    if (localStorage.getItem("objetoRetornoBusqueda")!=undefined || localStorage.getItem("objetoRetornoBusqueda")!=null) {
      
      this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
            
      if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
        this.OnBuscarRetorno();
      } else if(this.objetoRetornoBusqueda.tipoBusqueda == 2){
        this.busquedaAvanzadaRetorno();
      }
      
      if (this.paginacion.registros > 10) {
        this.paginaRetorno = this.paginacion.pagina;
        this.pageOption.change(this.paginacion.registros);
        if (this.paginaRetorno > 1) {
          this.OnPageChangedReturn(this.paginaRetorno, this.paginacion.registros);
        }
      } else{
        this.OnPageChangedReturn(this.paginacion.pagina, this.paginacion.registros);
      }    
      

    }else{
      this.textoBusqueda = '';
      this.parametroBusqueda = 'codigo';
      this.tipoBusqueda = 1;
      this.buscar();
    }

  }

  limpiar() {
    localStorage.removeItem("objetoRetornoBusqueda");
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigo';
    this.tipoBusqueda = 1;
    this.obtenerSeguimientos(this.obtenerParametros(null));
    this.mostrarAlerta = false;
    this.mostrarFlujo = false;
    this.mensajeAlerta = '';
  }

  OnRegresar() {
    this.router.navigate(['documento/consultas']);    
  }

  abrirBusquedaAvanzada(){
    this.selectedFilter = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-md'
    }
    const modalBusqueda = this.modalService.show(ModalBusquedaSeguimientoDocumentoComponent, config);
    (<ModalBusquedaSeguimientoDocumentoComponent>modalBusqueda.content).onClose.subscribe(result => {
      this.parametrosBusquedaAvanzada = result;
      this.paginacion.pagina = 1;
      this.tipoBusqueda = 2;
      this.busquedaAvanzada(result);
    });
  }
 
  busquedaAvanzada(parametrosModal){
    let texto:string = "<strong>Busqueda Por: </strong>";

    let busquedaCodigoDoc:string = parametrosModal.get("codigo");
    if(busquedaCodigoDoc!=null && busquedaCodigoDoc != ""){
      texto = texto + "<br/><strong>Código del Documento: </strong>"+busquedaCodigoDoc+" ";
    }

    let busquedaTituloDoc:string = parametrosModal.get("descripcion");
    if(busquedaTituloDoc!=null && busquedaTituloDoc != ""){
        texto = texto + "<br/><strong>Título de Documento: </strong>"+ busquedaTituloDoc;
    } 

    if (busquedaCodigoDoc == undefined && busquedaTituloDoc == undefined) {
      this.mostrarAlerta = false;
      this.mostrarFlujo = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }   

    this.obtenerSeguimientos(this.obtenerParametros(parametrosModal));
  }

  busquedaAvanzadaRetorno(){
    let texto:string = "<strong>Busqueda Por: </strong>";

    let parametrosModal: Map<string, any> = new Map();

    this.objetoRetornoBusqueda.parametrosMap.forEach(parametrosMap => {
      if (parametrosMap.value) {
        parametrosModal = parametrosModal.set(parametrosMap.key, parametrosMap.value);
      }
    });
    this.parametrosBusquedaAvanzada = parametrosModal;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;
    this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;
    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;

    let busquedaCodigoDoc:string = parametrosModal.get("codigo");
    if(busquedaCodigoDoc!=null && busquedaCodigoDoc != ""){
      texto = texto + "<br/><strong>Código del Documento: </strong>"+busquedaCodigoDoc+" ";
    }

    let busquedaTituloDoc:string = parametrosModal.get("descripcion");
    if(busquedaTituloDoc!=null && busquedaTituloDoc != ""){
        texto = texto + "<br/><strong>Título de Documento: </strong>"+ busquedaTituloDoc;
    } 

    if (busquedaCodigoDoc == undefined && busquedaTituloDoc == undefined) {
      this.mostrarAlerta = false;
      this.mostrarFlujo = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }   

    this.obtenerSeguimientos(this.obtenerParametros(parametrosModal));
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  busquedaSimple(){
    this.paginacion.pagina = 1;
    this.valorPaginacion = 1;
    this.tipoBusqueda = 1;
    this.buscar();
  }

  buscar() {
    let texto:string = "<strong>Busqueda Por: </strong>";
    switch (this.parametroBusqueda) {
        
        case 'codigo':
            texto = texto + "<br/><strong>Código de Documento: </strong>"+this.textoBusqueda;
            break;
        case 'titulo': 
            texto = texto + "<br/><strong>Título del Documento: </strong>"+this.textoBusqueda;
            break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
      this.mostrarFlujo = false;
    }
        
    this.obtenerSeguimientos(this.obtenerParametros(null));
  }

  OnBuscarRetorno() {
    let texto:string = "<strong>Busqueda Por: </strong>";

    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda = this.objetoRetornoBusqueda.textoBusqueda;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;
    this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;

    switch (this.parametroBusqueda) {
        
        case 'codigo':
            texto = texto + "<br/><strong>Código de Documento: </strong>"+this.textoBusqueda;
            break;
        case 'titulo': 
            texto = texto + "<br/><strong>Título del Documento: </strong>"+this.textoBusqueda;
            break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
      this.mostrarFlujo = false;
    }
        
    this.obtenerSeguimientos(this.obtenerParametros(null));
  }


  OnRowClick(index, obj:SeguimientoDocumento): void {
    this.selectedRow = index;
    this.selectedObject = obj;
    this.mostrarFlujo = true;
    this.cargando = true;
    this.existeElaboracion = false;
    this.existeConsenso = false;
    this.existeAprobacion = false;
    this.existeHomologacion = false;
    this.service.obtenerFlujoDocumento(obj.idDocumento,obj.idRevision,obj.numeroIteracion).subscribe((responseObject: Response) => {
      let listaFlujo:Fase[] = responseObject.resultado;
      if(listaFlujo != null && listaFlujo != undefined){
        for(let fase of listaFlujo){
          switch(fase.descripcionFase){
            case "Elaboracion": this.existeElaboracion = true; break;
            case "Consenso"   : this.existeConsenso = true; break;
            case "Aprobacion" : this.existeAprobacion = true; break;
            case "Homologacion": this.existeHomologacion = true; break;

          }
        }
      }
      if(obj.estadoDocumento.v_valcons == "Emision"){
        this.estFasRevSelec = "sinestado";
        this.estadoEmision = obj.textoEstadoFase;
        this.estadoDocumentoSeleccionado = obj.estadoDocumento.v_valcons;
      }else if(obj.estadoDocumento.v_valcons == "En Revision"){
        this.estFasRevSelec = obj.faseActual.v_valcons;
        this.estadoDocumentoSeleccionado = obj.estadoDocumento.v_valcons;
      }
      
      this.cargando = false;
      
    });
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    
    if(this.tipoBusqueda == 1){
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }

      if (this.IndicadorPagina == 0) {
        this.IndicadorPagina = 0;
        this.buscar();
      }
      
    }else if(this.tipoBusqueda == 2){
      if (this.IndicadorPagina == 0) {
        this.IndicadorPagina = 0;
        this.busquedaAvanzada(this.parametrosBusquedaAvanzada);
      }
    }
  }

  OnPageChangedReturn(pagina:number, registros:number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
      this.buscar();
    } else if (this.objetoRetornoBusqueda.tipoBusqueda == 2) {
      this.parametrosBusquedaAvanzadaRetorno.set('pagina', this.paginacion.pagina);
      this.busquedaAvanzada(this.parametrosBusquedaAvanzadaRetorno);
    }
  }
  
  OnPageOptionChanged(event): void {
    
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.IndicadorPagina=1;
    if(this.tipoBusqueda == 1){
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      this.buscar();
    }else if(this.tipoBusqueda == 2){
      this.busquedaAvanzada(this.parametrosBusquedaAvanzada);
    }
  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  obtenerParametros(parametrosAdicionales: Map<string, any>) {
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    let parametros: Map<string, any> = new Map();

   parametros.set('pagina', this.paginacion.pagina).set('registros', this.paginacion.registros);

   this.objetoRetornoBusqueda.pagina = this.paginacion.pagina;
   this.objetoRetornoBusqueda.registros = this.paginacion.registros;
   this.objetoRetornoBusqueda.tipoBusqueda = this.tipoBusqueda;
   this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;

    if (parametrosAdicionales !== null) {
      parametrosAdicionales.forEach((value, key) => {
        if (value) {
          parametros = parametros.set(key, value);
          this.objetoRetornoBusqueda.parametrosMap.push({key: key, value: value});
        }
      });
    } else {
      if (this.parametroBusqueda === 'codigo') { parametros.set('codigo', this.textoBusqueda); this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;}
      if (this.parametroBusqueda === 'titulo') { parametros.set('descripcion', this.textoBusqueda); }this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;
    }

    localStorage.removeItem("objetoRetornoBusqueda"); 
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));
    this.parametrosBusquedaAvanzadaRetorno = parametros;
    return parametros;
  }

  obtenerSeguimientos(parametros: Map<string, any>) {
    this.loading = true;
    this.service.obtenerSeguimiento(parametros).subscribe((responseObject: Response) => {
      this.listaSeguimientoDocumento = responseObject.resultado;
      this.paginacion = new Paginacion(responseObject.paginacion);
      this.valorPaginacion = 0;
      this.IndicadorPagina = 0;
      this.loading = false;
    }, (errorResponse: Response) => {
      this.loading = false;
    });

  }

  detalleDocumento(item:SeguimientoDocumento){
    let itemDocumento: EnvioParametros = new EnvioParametros();
    itemDocumento.edicion = true;
    itemDocumento.nuevo = false;
    itemDocumento.parametroPrincipal = item.idDocumento;
    sessionStorage.setItem("item",JSON.stringify(itemDocumento));
    this.router.navigate(['consulta/descarga/seguimientoDocumento/detalle']);    
  }
}
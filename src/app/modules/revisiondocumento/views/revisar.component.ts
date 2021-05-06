import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Tipo } from '../../../models/tipo';
import { RevisionDocumento } from '../../../models';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { RevisionDocumentoMockService } from '../../../services';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { BusquedaAvanzadaComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-avanzada.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { ModalRevisiones } from 'src/app/modules/bandejadocumento/modales/modal-revisiones.component';
import { SessionService } from 'src/app/auth/session.service';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { ViewChild } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'bandejadocumento-revisar',
  templateUrl: 'revisar.template.html',
  styleUrls: ['revisar.component.scss'],
})
export class RevisarDocumentoComponent implements OnInit {
  @ViewChild('pageOption') pageOption: PaginacionSetComponent;
  p: number = 1;
  itemCodigo: number;
  selectedRow: number;
  textoBusqueda: string;
  loading: boolean;
  parametroBusqueda: string;
  placeHolderBuscar:any;
  paginacion: Paginacion;
  listaTipos: Tipo[];
  item: RevisionDocumento;
  private sub: any;
  selectedObject: RevisionDocumento;
  itemsAll: RevisionDocumento[];
  itemsForPagination: RevisionDocumento[];
  bsModalRef: BsModalRef;
  parametros: Map<string, any>;
  rutaDocumento: string;
  idUsuarioLogueo: number;
  mensajeAlerta:string;
  mostrarAlerta:boolean;
  tipoBusqueda:number;
  parametrosBusquedaAvanzada:Map<string,any>;
  parametrosBusquedaAvanzadaRetorno: Map<string, any>;
  objetoRetornoBusqueda:RetornosBusqueda;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  IndicadorPagina:number;
  paginaRetorno:number;

  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });

  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceMock: RevisionDocumentoMockService,
    private service: RevisionDocumentoService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,  
    public session: SessionService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
    this.itemsAll = [];
    this.mostrarAlerta = false;
    this.parametroBusqueda = 'codigoDoc';
    this.parametrosBusquedaAvanzada = new Map<string,any>();
    this.placeHolderBuscar = { "codigoDoc": "Ej:  DGMMA001", "tituloDoc": "Ej:  Manual de Estandarización" };
    this.paginacion = new Paginacion({ registros: 10 });
    this.parametros = new Map<string, any>();
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    this.valorPaginacion = 0;   
    this.IndicadorPagina = 0;       
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }

  onNuevo(){
    let itemRevision:EnvioParametros = new EnvioParametros();
    itemRevision.nuevo = true;
    itemRevision.edicion = false;
    sessionStorage.setItem("item",JSON.stringify(itemRevision));
    this.router.navigate([`documento/solicitudes/revisiondocumento/registrar-revision-documento`]);
  }
  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  OnModificar(idDocu): void {  
    let itemRevision:EnvioParametros = new EnvioParametros();
    itemRevision.nuevo = false;
    itemRevision.edicion = true;
    itemRevision.parametroPrincipal = idDocu;
    sessionStorage.setItem("item",JSON.stringify(itemRevision));  
    this.router.navigate([`documento/solicitudes/revisiondocumento/registrar-revision-documento`]);
  }

  onBitacora() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalRevisiones, config);
    (<ModalRevisiones>this.bsModalRef.content).onClose.subscribe(result => {
    });
  }  

  abrirBusquedaAvanzada() {
    this.parametros.delete(this.parametroBusqueda);
    this.parametroBusqueda = 'codigoDoc';
    this.textoBusqueda = "";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        paginacion: this.paginacion
      },
      class: 'modal-md'
    }
    this.bsModalRef = this.modalService.show(BusquedaAvanzadaComponent, config);
    (<BusquedaAvanzadaComponent>this.bsModalRef.content).onClose.subscribe(parametrosModal => {
      this.parametrosBusquedaAvanzada = parametrosModal;
      this.tipoBusqueda = 2;
      this.paginacion.pagina = 1;
      this.busquedaAvanzada(parametrosModal);
    });
  }

  busquedaAvanzada(parametrosModal){

    let texto:string = "<strong>Busqueda Por: </strong>";
    
    let busquedaCodigoDoc:string = parametrosModal.get("codigoDoc");
    if(busquedaCodigoDoc!=null && busquedaCodigoDoc != ""){
      texto = texto + "<br/><strong>Código de Documento: </strong>"+busquedaCodigoDoc+" ";
    }

    let busquedaTituloDoc:string = parametrosModal.get("tituloDoc");
    if(busquedaTituloDoc!=null && busquedaTituloDoc != ""){
        texto = texto + "<br/><strong>Título de Documento: </strong>"+ busquedaTituloDoc;
    }

    let busquedaInicio:string = parametrosModal.get("fechaInicio");
    if(busquedaInicio!=null && busquedaInicio != ""){
        texto = texto + "<br/><strong>Fecha de Inicio de Registro: </strong>"+ busquedaInicio;
    } 

    let busquedaFinal:string = parametrosModal.get("fechaFinal");
    if(busquedaFinal!=null && busquedaFinal != ""){
        texto = texto + "<br/><strong>Fecha Final de Registro: </strong>"+ busquedaFinal;
    } 

    if (busquedaCodigoDoc == null && busquedaTituloDoc == null && busquedaInicio == null && busquedaFinal == null) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }   

    this.obtenerSolicitudes(this.obtenerParametros(parametrosModal));
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
    
    let busquedaCodigoDoc:string = parametrosModal.get("codigoDoc");
    if(busquedaCodigoDoc!=null && busquedaCodigoDoc != ""){
      texto = texto + "<br/><strong>Código de Documento: </strong>"+busquedaCodigoDoc+" ";
    }

    let busquedaTituloDoc:string = parametrosModal.get("tituloDoc");
    if(busquedaTituloDoc!=null && busquedaTituloDoc != ""){
        texto = texto + "<br/><strong>Título de Documento: </strong>"+ busquedaTituloDoc;
    }

    let busquedaInicio:string = parametrosModal.get("fechaInicio");
    if(busquedaInicio!=null && busquedaInicio != ""){
        texto = texto + "<br/><strong>Fecha de Inicio de Registro: </strong>"+ busquedaInicio;
    } 

    let busquedaFinal:string = parametrosModal.get("fechaFinal");
    if(busquedaFinal!=null && busquedaFinal != ""){
        texto = texto + "<br/><strong>Fecha Final de Registro: </strong>"+ busquedaFinal;
    } 

    if (busquedaCodigoDoc == null && busquedaTituloDoc == null && busquedaInicio == null && busquedaFinal == null) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }   

    this.obtenerSolicitudes(this.obtenerParametros(parametrosModal));
  }

  ngOnInit() {
    
    this.textoBusqueda = '';
    this.parametroBusqueda = 'codigoDoc';
    this.tipoBusqueda = 1;
    
    if(this.session.User != null){
      this.idUsuarioLogueo = this.session.User.codFicha;
    }  
    
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
      this.parametroBusqueda = 'codigoDoc';
      this.tipoBusqueda = 1;
      this.buscar();
    }

  }

  busquedaSimple() {
    this.paginacion.pagina = 1;
    this.valorPaginacion = 1;
    this.tipoBusqueda = 1;
    this.buscar();
  }

  buscar() {
    let texto: string = "<strong>Busqueda Por: </strong>";
    switch (this.parametroBusqueda) {
      case 'codigoDoc':
        texto = texto + "<br/><strong>Código del Documento: </strong>" + this.textoBusqueda;
        break;
      case 'tituloDoc':
        texto = texto + "<br/><strong>Título del Documento: </strong>" + this.textoBusqueda;
        break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }

    this.obtenerSolicitudes(this.obtenerParametros(null));
  }

  OnBuscarRetorno() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda = this.objetoRetornoBusqueda.textoBusqueda;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;
    this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;

    switch (this.parametroBusqueda) {
      case 'codigoDoc':
        texto = texto + "<br/><strong>Código del Documento: </strong>" + this.textoBusqueda;
        break;
      case 'tituloDoc':
        texto = texto + "<br/><strong>Título del Documento: </strong>" + this.textoBusqueda;
        break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }

    this.obtenerSolicitudes(this.obtenerParametros(null));
  }

  obtenerParametros(parametrosAdicionales: Map<string, any>) {
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    let parametros: Map<string, any> = new Map();
    parametros.set('pagina', this.paginacion.pagina).set('registros', this.paginacion.registros);
    parametros.set('idColaborador', this.idUsuarioLogueo);

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
      if (this.parametroBusqueda === 'codigoDoc') {  parametros.set('codigoDoc', this.textoBusqueda);this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;}
      if (this.parametroBusqueda === 'tituloDoc') {  parametros.set('tituloDoc', this.textoBusqueda);this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;}
    }

    localStorage.removeItem("objetoRetornoBusqueda"); 
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));
    this.parametrosBusquedaAvanzadaRetorno = parametros;

    return parametros;
  } 

  obtenerSolicitudes(parametros: Map<string, any>) {  
    this.loading = true;
    this.service.listarRevisionDocumentos(parametros, this.paginacion.pagina,this.paginacion.registros).subscribe(
      (response: Response) => {
        this.itemsAll = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.valorPaginacion = 0;
        this.IndicadorPagina = 0;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    if (this.tipoBusqueda == 1) {
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }

      if (this.IndicadorPagina == 0) {
        this.IndicadorPagina = 0;
        this.buscar();
      }
    } else if (this.tipoBusqueda == 2) {
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
    if (this.tipoBusqueda == 1) {
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      this.buscar();
    } else if (this.tipoBusqueda == 2) {
      this.busquedaAvanzada(this.parametrosBusquedaAvanzada);
    }
  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }
  
  limpiar() {
    localStorage.removeItem("objetoRetornoBusqueda");
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigoDoc';
    this.tipoBusqueda = 1;
    this.buscar();
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }
 
  cambiarBusqueda(nombreBusqueda){
    this.textoBusqueda = "";
    this.parametroBusqueda = nombreBusqueda;
  }

  onEliminar(paramDelete:string){
    this.service.eliminar(paramDelete).subscribe(
      (response: Response) => {
       if(response.resultado){
         if(paramDelete){
          this.itemsAll = this.itemsAll.filter(item => item.id != Number(paramDelete));
         }else{
          this.itemsAll = [];
          this.paginacion = new Paginacion({ registros: 5 });
         }
        this.toastr.success('Revisión Documento', 'Registro Eliminado');
       }
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }
  
}
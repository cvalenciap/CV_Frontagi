import {Component, OnInit, SecurityContext} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {BandejaDocumentoService} from '../../../../services';
import {Tipo} from '../../../../models/tipo';
import {Response} from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { Arbol } from '../../../../models/arbol';
import { Documento } from 'src/app/models/documento';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { RevisionDocumento } from 'src/app/models';
import { ID_FASE } from 'src/app/constants/general/general.constants';
import { DomSanitizer } from '@angular/platform-browser';
import { Constante } from 'src/app/models/enums/constante';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { DatePipe } from '@angular/common';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { SessionService } from 'src/app/auth/session.service';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { ViewChild } from '@angular/core';

declare var jQuery:any;

@Component({
  selector: 'app-tareaconsenso',
  templateUrl: 'tareaconsenso.template.html',
  styleUrls: ['tareaconsenso.component.scss'],
})
export class TareaConsensoComponent implements OnInit {
  @ViewChild('pageOption') pageOption: PaginacionSetComponent;
  itemCodigo: number;
  listaTipos: Tipo[];
  item: Documento;
  items: RevisionDocumento[];
  private sub: any;
  loading: boolean;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Arbol;
  parametros:Map<string,any>;
  parametroBusqueda:string;
  placeHolderBuscar:any;
  textoBusqueda: string;
  mostrarInformacion:boolean;
  mensajeInformacion:string;
  alertTextoBusqueda:any;
  deshabilitarBuscar:boolean;
  mostrarColumna: boolean;
  plazoSuperior: number;
  plazoInferior: number;
  idFase: number;
  rutaActual:string;
  rutaAnterior:string;
  rutaAnteriorAnterior:string;
  mensajeAlerta:string;
  mostrarAlerta:boolean;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  objetoRetornoBusqueda:RetornosBusqueda;
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
              private sanitizer: DomSanitizer,
              private route: ActivatedRoute,
              private datePipe: DatePipe,
              private serviceParametro: ParametrosService,
              private revisionService:RevisionDocumentoService,
              private service: RevisionDocumentoService,
              public session: SessionService) {
    this.loading = false;0
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({registros: 10});
    this.selectedRow = -1;
    this.parametros = new Map<string,any>();
    this.parametroBusqueda = 'codigo';
    this.placeHolderBuscar = {"codigoDoc":"Ej. DGMMA001","tituloDoc":"Ej: Manual de Estandarización","id":"Ej. 2"};
    this.alertTextoBusqueda = {"codigoDoc":"Código Documento:","tituloDoc":"Título:","id":"Número Solicitud:"};
    this.mostrarInformacion = false;
    this.deshabilitarBuscar = true;
    this.mostrarColumna = false;
    this.rutaActual = this.router.url;
    this.mostrarAlerta = false;
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    this.valorPaginacion = 0;  
    this.IndicadorPagina = 0;   
  }

  ngOnInit() {
    this.cargaParametrosIniciales();
    this.mostrarInformacion = false;
    this.mostrarColumna = false;
  }

  cargaParametrosIniciales() {
    this.serviceParametro.obtenerParametroPadre(Constante.PLAZOS).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.plazoSuperior=this.serviceParametro.obtenerIdParametro(resultado,Constante.PLAZO_SUPERIOR);
        this.plazoInferior=this.serviceParametro.obtenerIdParametro(resultado,Constante.PLAZO_INFERIOR);
      },
      (error) => this.controlarError(error)
    );

    this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idFase=this.serviceParametro.obtenerIdParametro(resultado,Constante.ETAPA_RUTA_CONSENSO);

        if (localStorage.getItem("objetoRetornoBusqueda")!=undefined || localStorage.getItem("objetoRetornoBusqueda")!=null) {
          this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
          this.OnBuscarRetorno();

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
          this.OnBuscar();
        }


      },
      (error) => this.controlarError(error)
    );
  }

  cambiarBusqueda(nombreBusqueda){
    this.textoBusqueda = "";
    this.parametroBusqueda = nombreBusqueda;
  }

  cargarRevisionesConsenso(pagina = 1, registroXPagina = 10){
    this.parametros.set("idFase",ID_FASE.CONSENSO);
    this.revisionService.listarRevisionFase(this.parametros,pagina,registroXPagina).subscribe(
     (respuesta:Response) =>{
       this.items = respuesta.resultado;
     }
    );
  }

  ingresoTexto(event) {
    const key = window.event ? event.which : event.keyCode;
    if (this.parametroBusqueda === 'numero') {
      if (key < 48 || key > 57) {
        event.preventDefault();
      }
    }
  }

  busquedaSimple(){
    this.paginacion.pagina = 1;
    this.valorPaginacion = 1;
    this.OnBuscar();
  }

  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnModificar(idDocu, idDocuGoogleDrive, idRevision) {
    sessionStorage.removeItem("FaseDatos");
    sessionStorage.removeItem("tabDocumentos"); 
    sessionStorage.removeItem("datosFase");
    sessionStorage.removeItem("listaDocumentos");
    sessionStorage.removeItem("retornoLista");
    sessionStorage.removeItem("Fase");
    sessionStorage.removeItem("listDoc");
    sessionStorage.removeItem("retornoDatos");
    sessionStorage.removeItem("listaDocumentosDoc");
    sessionStorage.removeItem("revisionIdmotivo");
    sessionStorage.removeItem("revisionDescripcion");
    sessionStorage.removeItem("comboRevision");
    sessionStorage.removeItem("descripcionRevision");
    sessionStorage.removeItem("listEquipoReturn");
    sessionStorage.removeItem("listaEquipoAux");
    sessionStorage.removeItem("listElaboracion");		
    sessionStorage.removeItem("listConseso");
    sessionStorage.removeItem("listAprobacion");
    sessionStorage.removeItem("listHomologacion");
    sessionStorage.removeItem("listaElaboracionAux");		
    sessionStorage.removeItem("listaConsensoAux");
    sessionStorage.removeItem("listaAprobacionAux");
    sessionStorage.removeItem("listaHomologacionAux");
    if (idDocuGoogleDrive!=null && idDocuGoogleDrive!=undefined) {
      localStorage.setItem("idDocuGoogleDrive", idDocuGoogleDrive);
    }

    let itemConsenso:EnvioParametros = new EnvioParametros();
    itemConsenso.edicion = true;
    itemConsenso.nuevo = false;
    itemConsenso.parametroPrincipal = idDocu;
    itemConsenso.parametroSecundario = idRevision;
    sessionStorage.setItem("item",JSON.stringify(itemConsenso));
    this.router.navigate([`documento/tareapendiente/ConsensuarRevisionRegistro`]);
  }

  OnConsultar() {
    this.router.navigate([`documento/tareapendiente/ConsensuarRevisionRegistro`]);
  }

  habilitarBuscar(): void {
    if(this.textoBusqueda!='')
      this.deshabilitarBuscar=false; 
    else
      this.deshabilitarBuscar=true;
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page; 
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    } 
    if (this.IndicadorPagina == 0) {
      this.IndicadorPagina = 0;
      this.OnBuscar();
    }
  }

  OnPageChangedReturn(pagina:number, registros:number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    this.OnBuscar();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.IndicadorPagina=1;
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    } 
    this.OnBuscar();
  }

  OnBuscar() {
    let texto:string = "<strong>Busqueda Por: </strong>";

    switch (this.parametroBusqueda) {
        
        case 'codigo':
            texto = texto + "<br/><strong>Código de Documento: </strong>"+this.textoBusqueda;
            break;
        case 'titulo': 
            texto = texto + "<br/><strong>Título de Documento: </strong>"+this.textoBusqueda;
            break;
        case 'numero': 
            texto = texto + "<br/><strong>Número de Solicitud: </strong>"+this.textoBusqueda;
            break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }
        
    this.obtenerDocumentos();
  }

  OnBuscarRetorno() {
    let texto:string = "<strong>Busqueda Por: </strong>";

    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda = this.objetoRetornoBusqueda.textoBusqueda;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;

    switch (this.parametroBusqueda) {
        
        case 'codigo':
            texto = texto + "<br/><strong>Código de Documento: </strong>"+this.textoBusqueda;
            break;
        case 'titulo': 
            texto = texto + "<br/><strong>Título de Documento: </strong>"+this.textoBusqueda;
            break;
        case 'numero': 
            texto = texto + "<br/><strong>Número de Solicitud: </strong>"+this.textoBusqueda;
            break;
    }

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }
        
    this.obtenerDocumentos();
  }


  obtenerDocumentos() {
    this.loading = true;
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    const parametros: { codigo?: string, titulo?: string, numero?: string, idFase?: string } =
      { codigo: null, titulo: null, numero: null, idFase: String(this.idFase) };

    this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;

    if (this.parametroBusqueda === 'codigo') { parametros.codigo = this.textoBusqueda;this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;}
    if (this.parametroBusqueda === 'titulo') { parametros.titulo = this.textoBusqueda;this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;}
    if (this.parametroBusqueda === 'numero') { parametros.numero = this.textoBusqueda;this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;}

    this.objetoRetornoBusqueda.pagina = this.paginacion.pagina;
    this.objetoRetornoBusqueda.registros = this.paginacion.registros;

    localStorage.removeItem("objetoRetornoBusqueda");  
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));

    this.service.buscarPorParametros(parametros,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (response: Response) => {
        let lista:RevisionDocumento[] = response.resultado;
        lista.forEach(documento => {
          if (documento.fechaPlazoAprob != null){
            documento.fechaPlazoAprob= this.datePipe.transform(documento.fechaPlazoAprob,"dd/MM/yyyy");
          }else {
            documento.fechaPlazoAprob = " ";
          }
          if (documento.fecha != null){
            documento.fecha= this.datePipe.transform(documento.fecha,"dd/MM/yyyy");
          }else {
            documento.fecha = " ";
          }
        });
        this.items = lista;
        this.paginacion = new Paginacion(response.paginacion);
        this.valorPaginacion = 0;
        this.IndicadorPagina = 0;
        this.loading = false; },
      (error) => this.controlarError(error)
    );

  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  OnLimpiar() {
    localStorage.removeItem("objetoRetornoBusqueda");
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigo';
    this.OnBuscar();
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }

}

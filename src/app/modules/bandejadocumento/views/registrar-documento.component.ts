import { Component, OnInit, ViewChild, Input } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService, ValidacionService, RutaResponsablesService } from '../../../services';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { RutaResponsable } from 'src/app/models/rutaresponsable';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { Response } from '../../../models/response';
import { ControlView } from '../../../models';
//importamos  consulta de codigo anterior 
import { ConsultaCodigoAnteriorcomponents } from 'src/app/modules/bandejadocumento/modales/consulta-codigo-anterior.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { EquipoUsuarioComponent } from 'src/app/modules/bandejadocumento/components/equipo-usuario.component';
import { Documento } from 'src/app/models/documento';
import { TabGroupAnimationsExample } from 'src/app/modules/tabs/views/tab-group-animations-example';
import { validate } from 'class-validator';
import { forkJoin } from 'rxjs/internal/observable/forkJoin';
import { Constante } from 'src/app/models/enums';
import { RevisionDocumento } from 'src/app/models';
import { GestionDocumentoComponents } from 'src/app/modules/bandejadocumento/components/gestiondocumento.component';
import { ESTADO_REVISION, NOMBREPAGINA, ACCIONES } from 'src/app/constants/general/general.constants';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { CorreoService } from 'src/app/services/impl/correo.service';
import { EnvioParametros } from 'src/app/models/envioParametros';
import { NgxSpinnerService } from 'ngx-spinner';
import { SessionService } from 'src/app/auth/session.service';

@Component({
  selector: 'registrar-documento-editar',
  templateUrl: 'registrar-documento.template.html',
  providers: [BandejaDocumentoService]
})
export class registrardocumentoEditarComponent implements OnInit {
  @ViewChild('tab') tab: TabGroupAnimationsExample;

  /* viene del papa */
  @ViewChild('hijo') registro1: GestionDocumentoComponents;


  //@ViewChild('hijoEquipo') componenteEquipo: EquipoUsuarioComponent;
  @Input() variable: String;
  //
  @Input() parametroIdTipoDoc: number;
  @Input() item1: number;
  //
  loading: boolean;
  /*Modal Consulta Código Anterior*/
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  urlPDF: any
  urlPDF1: any;
  urlPDF2: boolean;
  objetoBlob: boolean;
  desctiDescarPdf: boolean;
  /* codigo seleccionado */
  itemCodigo: number;
  mensajes: any[];
  nuevo: boolean;
  rutaDocumentoObsoleto: string;
  rutaDocumentoOrigin: string;
  /* datos */
  //listaTipos: Tipo[];
  item: Documento;
  invalid: boolean;

  activar: boolean;
  activartab: boolean;
  consulta: boolean;
  private sub: any;
  //
  private destino: any;
  private idDocumento: any;
  private idDocumento1: any;

  indicadorLectura: boolean;
  mensajeDestino: string;
  mapDatosRevision: Map<string, any>;
  textoAccion: string;
  nombrePagina: string;
  tipoAccion: string;
  habilitarGrabar: boolean;

  habiliarVerDocumento: boolean;

  itemDocumento: EnvioParametros;
  /** */
  rutaActual: string;
  rutaAnterior: string;
  rutaAnteriorAnterior: string;

  // @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    public session: SessionService,
    private route: ActivatedRoute,
    private servicioValidacion: ValidacionService,
    private service: BandejaDocumentoService,
    private modalService: BsModalService,
    private serviceCorreo: CorreoService,
    private serviceParametro: ParametrosService,
    private spinner: NgxSpinnerService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.parametroBusqueda = 'tipo';
    this.activar = true;
    this.activartab = true;
    this.consulta = true;
    this.indicadorLectura = false;
    this.habilitarGrabar = true;
    this.habiliarVerDocumento = true;
    this.mapDatosRevision = new Map<string, any>();
    this.item = new Documento();
    this.textoAccion = null;
    /**/

    this.rutaActual = this.router.url;
    let item = JSON.parse(sessionStorage.getItem("item"));
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
    let nuevo = item.nuevo;
    let edicion = item.edicion
    console.log("VALOR DEL ITEM")
    console.log(item)
    console.log(nuevo)
    console.log(edicion)

    /**/
    //localStorage.setItem("indicadordocumento","1");
    /*if(this.route.parent) {
        this.route.data.subscribe(params => {
            
            if(params['nArchivo']){
                this.nombrePagina=params['nArchivo'];
                this.tipoAccion  =params['accion'];
                if(this.nombrePagina==NOMBREPAGINA.DOCUMENTO &&
                    this.tipoAccion==ACCIONES.NUEVO) {
                        this.habiliarVerDocumento=false;
                }
            }
        });
    }
    if(this.route.parent) {
        this.route.data.subscribe(params => {
            
            if(params['nArchivo']){
                this.nombrePagina=params['nArchivo'];
                this.tipoAccion  =params['accion'];
                if(this.nombrePagina==NOMBREPAGINA.DOCUMENTO &&
                    this.tipoAccion==ACCIONES.EDITAR) {
                    this.habilitarGrabar=false;                     
                }
            }
        });
    }*/

    if (nuevo == true) {
      this.habilitarGrabar = true;
      this.habiliarVerDocumento = false;
    } else {
      this.habilitarGrabar = false;
      this.habiliarVerDocumento = true;
    }


  }

  ngOnInit() {
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        let idProceso = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.TIPO_JERARQUIA_PROCESO);
        let idAlcance = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.TIPO_JERARQUIA_ALCANCE);
        let idGerencia = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.TIPO_JERARQUIA_GERENCIA);
        let idTipoSeleccionado = (localStorage.getItem("idProcesoSeleccionado") == null) ? 0 :
          Number(localStorage.getItem("idProcesoSeleccionado"));

        //Texto del Proceso
        if (idTipoSeleccionado == idProceso) {
          this.textoAccion = Constante.TITULO_PROCESO;
        } else if (idTipoSeleccionado == idAlcance) {
          this.textoAccion = Constante.TITULO_ALCANCE;
        } else if (idTipoSeleccionado == idGerencia) {
          this.textoAccion = Constante.TITULO_GERENCIA;
        }
      },
      (error) => this.controlarError(error)
    );
    this.item = new Documento();
    this.itemDocumento = JSON.parse(sessionStorage.getItem("item"));

    if (this.itemDocumento.edicion) {
      this.nuevo = false;
      this.itemCodigo = this.itemDocumento.parametroPrincipal;
      this.tab.padre.subscribe(loading => {
        this.loading = loading;

        this.destino = 0;
        this.indicadorLectura = false;
      });
    } else {
      this.nuevo = true;
      this.loading = false;
    }
    console.log("HABILITAR")
    console.log(this.habilitarGrabar);
    console.log(this.rutaAnteriorAnterior);
    console.log(this.rutaAnterior);
    //cguerra INicio

    let indfinal = localStorage.getItem("indicadorDescarga");
    
    if (Number(indfinal) == 1) {
      this.desctiDescarPdf = true;
      localStorage.removeItem("indicadorDescarga");
    } else {
      this.desctiDescarPdf = false;
      localStorage.removeItem("indicadorDescarga");
    }


    //cguerra Fin

  }

  //Busqueda del modal de arbol
  OnBuscarProceso() {
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalArbolComponents, config);
    (<ModalArbolComponents>this.bsModalRef.content).onClose.subscribe(result => {
      //this.busquedaPlan = result;
      //this.OnBuscar();
    });

  }

  //validar si tiene ruta
  OnValidaRuta(Ruta: string, visorPdfSwal) {
    let RutaFinal = Ruta;
    if (RutaFinal != null) {
      this.urlPDF = RutaFinal;
      this.objetoBlob = false;
      this.urlPDF2 = false;
      visorPdfSwal.show();
    } else {
      this.toastr.warning('No tiene ningún documento para mostrar.', 'Atención', { closeButton: true });
    }
  }

  OnValidaRutaOrigin(Ruta: string, visorPdfSwal) {
    
    let RutaFinal = Ruta;
    if (RutaFinal != null) {
      this.urlPDF1 = RutaFinal;
      this.objetoBlob = false;
      this.urlPDF = false;
      this.urlPDF2 = true;
      visorPdfSwal.show();
    } else {
      this.toastr.warning('No tiene ningún documento para mostrar.', 'Atención', { closeButton: true });
    }
  }



  //Buscar del Modal Consulta por codigo anterior
  OnBuscar() {
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        id: this.itemCodigo
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ConsultaCodigoAnteriorcomponents, config);
    (<ConsultaCodigoAnteriorcomponents>this.bsModalRef.content).onClose.subscribe(result => {
      //this.busquedaPlan = result;
      //this.OnBuscar();
    });
  }

  OnRegresar() {
    
    sessionStorage.removeItem("listElaboracion");
    sessionStorage.removeItem("listConseso");
    sessionStorage.removeItem("listAprobacion");
    sessionStorage.removeItem("listHomologacion");

    //Sessión 
    this.destino = localStorage.getItem("indicadordocumento");
    if (this.destino == "1") {
      if (this.textoAccion) {
        //localStorage.removeItem("indicadordocumento");
        //localStorage.removeItem('nodeSeleccionado');              
        this.router.navigate(['/documento/general/bandejadocumento/editar']);
      } else {
        this.router.navigate(['./documento/general/revisardocumentos']);
      }
    } else {
      this.router.navigate(['./documento/general/revisardocumentos']);
    }
  }
  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  OnValidarDocumento(item: any) {

    console.log(item);
    this.rutaDocumentoObsoleto = item;

  }
  OnValidarDocumentoOrigin(item: any) {

    console.log(item);
    this.rutaDocumentoOrigin = item;

  }




  //Guarda desde el hijo 
  OnGuardar() {
    
    sessionStorage.removeItem("listElaboracion");
    sessionStorage.removeItem("listConseso");
    sessionStorage.removeItem("listAprobacion");
    sessionStorage.removeItem("listHomologacion");

    this.tab.general.errors = {};
    /*Obtenemos los datos del la pestaña informacion general*/
    let documento = this.tab.general.obtenerDatosFrom();
    /*Seteamos al bean de documento la lista de documento */
    documento.listaEquipo = this.tab.equipousuario.listaEquipo;
    let objeto = documento.listaEquipo.find(equipo => equipo.indicadorResponsable == 1);
    if (objeto != null) documento.indicadorResponsable = 1;
    else documento.indicadorResponsable = 0;

    /* Setamos al bean de documento la lista de participantes */
    //documento.listaParticipante = this.tab.participantes.listaParticipantes;
    //console.log(this.tab);

    //documento.listaParticipante = this.tab.participantes.item.listaElaboracion;        
    documento.participanteElaboracion = this.tab.participantes.item.listaElaboracion;
    if (documento.participanteElaboracion != null) {
      let persona = documento.participanteElaboracion.find(obj => obj.estiloBloqueado == true);
      if (persona != null) documento.indicadorParticipante = 1;
      else documento.indicadorParticipante = 0;
    }

    //consenso
    documento.participanteConsenso = this.tab.concenso.item.listaConsenso;
    if (documento.participanteConsenso != null || documento.indicadorParticipante == 0) {
      let persona = documento.participanteConsenso.find(obj => obj.estiloBloqueado == true);
      if (persona != null) documento.indicadorParticipante = 1;
      else documento.indicadorParticipante = 0;
    }

    //Aprobación
    documento.participanteAprobacion = this.tab.aprobacion.item.listaAprobacion;
    if (documento.participanteAprobacion != null || documento.indicadorParticipante == 0) {
      let persona = documento.participanteAprobacion.find(obj => obj.estiloBloqueado == true);
      if (persona != null) documento.indicadorParticipante = 1;
      else documento.indicadorParticipante = 0;
    }

    //Homologación
    documento.participanteHomologacion = this.tab.homologacion.item.listaHomologacion;
    if (documento.participanteHomologacion != null || documento.indicadorParticipante == 0) {
      let persona = documento.participanteHomologacion.find(obj => obj.estiloBloqueado == true);
      if (persona != null) documento.indicadorParticipante = 1;
      else documento.indicadorParticipante = 0;
    }

    //Documento Relacionado     
    let objetodocumento: Documento = new Documento();
    let listacomplen: Documento[] = this.tab.complementario.listaSeguimiento
    let listacomplentariofinal: Documento[] = [];
    for (let i: number = 0; i < listacomplen.length; i++) {
      let responsableObj: Documento = listacomplen[i];
      let objetodocumento: Documento = new Documento();
      //objetodocumento.codigo =responsableObj.codigo;
      objetodocumento.id = responsableObj.id;
      objetodocumento.descripcion = responsableObj.descripcion;
      objetodocumento.tipo = responsableObj.tipo;
      if (responsableObj.tipo != null)
        objetodocumento.tipoComplementario.idconstante = Number(responsableObj.tipo.codigo);
      else
        objetodocumento.tipoComplementario.idconstante = Number(responsableObj.tipoComplementario.idconstante);
      listacomplentariofinal.push(objetodocumento);
    }
    documento.listaComplementario = listacomplentariofinal;//this.tab.complementario.listaSeguimiento;
    //onsole.log('Lista de documento Complemetario');
    //console.log(documento);
    //console.log("lista equipo",documento.listaEquipo);
    this.tab.revision.errors = {};
    documento.revision = this.tab.revision.obtenerRequestRevision(ESTADO_REVISION.EMITIDO);
    documento.bitacora = null;



    forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
      this.mensajes = [];
      //console.log("errorrrr", errors);
      if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
        //this.toastr.error(`Los siguientes campos son inválidos: ${this.mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});
        this.toastr.error(`${this.mensajes.join('. ')}`, 'Acción inválida', { closeButton: true });
      } else {
        //localStorage.removeItem('nodeSeleccionado'); 
        localStorage.removeItem("objetoRetornoBusqueda");
        if (this.nuevo) {
          //console.log("NUEVO")
          this.spinner.show();
          this.service.guardar(documento).subscribe(
            (response: Response) => {
              this.spinner.hide();
              this.item = response.resultado;
              //Enviar Correo
              this.serviceCorreo.obtenerCorreo(this.item.id, null,
                Constante.CORREO_REGISTRO_SOLICITUD).subscribe(
                  (response: Response) => {
                    let correo = response.resultado;
                    this.serviceCorreo.enviarCorreo(correo).subscribe(
                      (response: Response) => { },
                      (error) => {
                        this.controlarError(error);
                      }
                    );
                  },
                  (error) => {
                    this.controlarError(error);
                  }
                );

              this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
              this.router.navigate(['./documento/general/bandejadocumento/editar']);
            },
            (error) => this.controlarError(error)
          );

        } else {
          //console.log("MODIFICAAAAA")
          this.spinner.show();
          this.service.modificar(documento).subscribe(
            (response: Response) => {
              this.spinner.hide();
              this.item = response.resultado;
              this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
              this.router.navigate(['./documento/general/bandejadocumento/editar']);
            },
            (error) => this.controlarError(error)
          );

        }
      }
    });
  }
}
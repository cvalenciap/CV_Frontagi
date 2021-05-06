
import { Component, OnInit, ViewChild, Input, EventEmitter, Output } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService, ValidacionService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { Response } from '../../../models/response';
import { Constante } from 'src/app/models/enums';
//importamos  consulta de codigo anterior 
import { ConsultaCodigoAnteriorcomponents } from 'src/app/modules/bandejadocumento/modales/consulta-codigo-anterior.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { ModalArbolComponents } from 'src/app/modules/bandejadocumento/modales/modal-arbol.component';
import { AgregarUsuarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-usuario.component';
import { ImportarRutaComponents } from 'src/app/modules/bandejadocumento/modales/importar-ruta.component';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Documento } from 'src/app/models/documento';
import { RevisionDocumento } from 'src/app/models/revisiondocumento';
import { validate, MinLength } from 'class-validator';
import { Paginacion, Parametro } from 'src/app/models';
import { BusquedaColaboradorMigracionComponent } from "../modals/busqueda-colaborador-migracion/busqueda-colaborador-migracion.component";
import { Colaborador } from "../../../models/colaborador";
import { BusquedaDocumentoComponent } from "../modals/busqueda-documento.component";
import { DocumentoMigracion } from 'src/app/models/documentomigracion';
import { DatePipe } from '@angular/common';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { RelacionCoordinadorService } from 'src/app/services/impl/relacioncoordinador.service';


@Component({
    selector: 'bandeja-registro-documento1',
    templateUrl: 'components-registro-documento-migracion.template.html'
})
export class CRegistroDocumentoComponent1 implements OnInit {
    public colaborador: Colaborador;
    public nombreColaborador: string;
    @Input() permisos: any;
    @Input() activar: boolean;
    @Output() extrametododepadre: EventEmitter<any> = new EventEmitter<any>();
    @Output() indicadordigitalAc: EventEmitter<any> = new EventEmitter<any>();
    activartap: boolean;
    /*Modal Consulta Código Anterior*/
    parametroBusqueda: string;
    bsModalRef: BsModalRef;
    idcolaborador: number;
    /* codigo seleccionado */
    itemCodigo: number;
    indicadorArchivoDigital: number;
    indicadorDigital: number;
    habilitacodigo: boolean;
    captura: string;
    captura1: string;
    ultimoNumero: string;
    /* datos */
    //listaTipos: Tipo[];
    item: DocumentoMigracion;
    listaTipos: any[];
    consulta: boolean;
    private sub: any;
    errors: any;
    tipoArbol: string;
    invalid: boolean;
    habilitacampo: boolean;
    habilitacampo1: boolean;
    todosCheck: boolean;
    todosCheck1: boolean;
    idjerarqua: string;
    tipodocumento: string;
    tipodcumentoid: string;
    procesoparametrodesc: string;
    procesoparametroid: string;
    sgiparametrodesc: string;
    sgiparametroid: string;
    habilitareviCurso: boolean;
    gerenparametrodesc: string;
    gerenparametroid: string;
    //gerenparametroid: number;
    rutaarbol: string;
    items: DocumentoMigracion[];
    paginacion: Paginacion;
    @Input() parametroId: number;
    @Input() parametroIdTipoDoc: number;
    revisionCurso: string;
    periodo: string;
    coordinador: string;
    codigoAnterior: string;
    indicador: number;
    fechaRegistro: string;
    //fechaCreaDoc: Date;
    public fechaCreaDocumento: string;    // @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
    //JHERRERAP
    listaDatosCoordinador: RelacionCoordinador[];
    indicadorDocumentoActivo: boolean;
    validarDatoCoordinador: boolean;
    idCoordinador: string;
    idTipoGerencia: number;
    idTipoAlcance: number;
    idTipoProceso: number;

    //JHERRERAP
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private datePipe: DatePipe,
        private route: ActivatedRoute,
        private service: BandejaDocumentoService,
        private serviceParametro: ParametrosService,
        private modalService: BsModalService,
        private servicioValidacion: ValidacionService,
        //JHERRERAP
        private serviceRelacion: RelacionCoordinadorService) {
        //JHERRERAP
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.parametroBusqueda = 'tipo';
        this.activar = true;
        this.activartap = false;
        this.consulta = true;
        this.habilitacampo = true;
        this.habilitacampo1 = false;
        this.todosCheck = false;
        this.todosCheck1 = false;
        this.habilitacodigo = false;
        this.habilitareviCurso = false;
        this.periodo = "";
        this.tipodocumento = '';
        this.tipodcumentoid = '';
        this.listaTipos = [];
        this.tipoArbol;
        this.idjerarqua = '';
        this.procesoparametrodesc = '';
        this.procesoparametroid;
        this.sgiparametrodesc = '';
        this.sgiparametroid;
        this.gerenparametrodesc = '';
        this.gerenparametroid;
        this.errors = {};
        this.items = [];
        this.rutaarbol = '';
        this.paginacion = new Paginacion({ registros: 100 });
        this.revisionCurso = "00";
        this.coordinador = "";
        this.item = new DocumentoMigracion();
        this.item.estado = new Parametro();
        this.fechaRegistro = "";
        this.idcolaborador = 0;
        this.indicadorArchivoDigital = 0;
        this.indicadorDigital = 0;
        //this.fechaCreaDoc= null;
        //JHERRERAP
        this.listaDatosCoordinador = [];
        this.indicadorDocumentoActivo = false;
        this.idCoordinador = "";
        //JHERRERAP
        this.captura = "";
        this.captura1 = "";
        this.ultimoNumero = "00";

    }

    ngOnInit() {
        this.indicador = 0;
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];

            /*Visualizamos los campos Cod. Anterior */
            if (this.itemCodigo > 0) {
                this.activartap = true;
                if (this.activar == true) {
                    this.activar = false;
                }
            } else {
                this.activartap = false;
                this.gerenparametrodesc = localStorage.getItem("rutadelarbol");
                this.idjerarqua = localStorage.getItem("idjerarquia");
                this.tipodcumentoid = localStorage.getItem("tipodocumento");
                this.tipodocumento = localStorage.getItem("textotipodocumento");
                this.gerenparametrodesc = this.gerenparametrodesc.substr(0,
                    this.gerenparametrodesc.length - this.tipodocumento.length - 1);

            }

        });
        this.gerenparametrodesc = '';
        this.tipodocumento = '';
        this.gerenparametrodesc = '';
        this.obtenerTipoJerarquia();
    }

    OnExcel() {

    }

    OnWord() {


    }

    obtenerTipoJerarquia() {
        this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
            (response: Response) => {
                let listaTipoJerarquia = response.resultado;
                this.idTipoGerencia = this.serviceParametro.obtenerIdParametro(listaTipoJerarquia, Constante.TIPO_JERARQUIA_GERENCIA);
                this.idTipoAlcance = this.serviceParametro.obtenerIdParametro(listaTipoJerarquia, Constante.TIPO_JERARQUIA_ALCANCE);
                this.idTipoProceso = this.serviceParametro.obtenerIdParametro(listaTipoJerarquia, Constante.TIPO_JERARQUIA_PROCESO);
            },
            (error) => this.controlarError(error)
        );
    }

    habilitadigital(): void {
        if (this.todosCheck1) {
            this.todosCheck1 = false;
            this.indicadorDigital = 0;
        } else {
            this.todosCheck1 = true;
            this.indicadorDigital = 1;
        }
        this.indicadorDigital
        this.indicadordigitalAc.next(this.indicadorDigital);
    }


    //Habilitar campo Revisión Obligatorio
    habiliarRevision(): void {
        if (this.todosCheck) {
            this.todosCheck = false;
            this.habilitacampo = true;
            this.item.periodo = null;
        } else {
            this.todosCheck = true;
            this.habilitacampo = false;
        }
    }

    habilitaDigital() {
        this.habilitacampo1 = true;
    }


    Validar(objectForm) {
        (this.item as any).todosCheck = this.todosCheck;
        this.servicioValidacion.validacionSingular(this.item, objectForm, this.errors);
    }
    /*Validar Solo Números */
    permitirNumero(evento): void {
        if (!(evento.which >= 48 && evento.which <= 57))
            evento.preventDefault();
    }

    //Busqueda del modal de arbol
    OnBuscarProceso() {
        localStorage.removeItem("idProcesoSeleccionado");
        //this.tipoArbol = "120";
        this.tipoArbol = String(this.idTipoProceso);
        localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                //JHERRERAP
                tipoDocumentoGerencia: Number(this.tipodcumentoid)
                //JHERRERAP
            },
            class: 'modal-lg'
        }
        //this.bsModalRef = this.modalService.show(ModalArbolComponents, config);
        const modalArbol = this.modalService.show(ModalArbolComponents, config);
        (<ModalArbolComponents>modalArbol.content).onClose.subscribe(result => {
            let objeto: BandejaDocumento = result;
            this.procesoparametrodesc = objeto.rutaCompleta;
            this.procesoparametroid = objeto.parametroid.toString();
            //JHERRERAP
            let tipoDocumento = objeto.parametrodesc;
            this.procesoparametrodesc = this.procesoparametrodesc.substr(0, this.procesoparametrodesc.length - tipoDocumento.length - 1);
            //JHERRERAP
        });

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

    onBuscarDocumento() {
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            class: 'modal-lg'
        };
        this.bsModalRef = this.modalService.show(BusquedaDocumentoComponent, config);
        (<BusquedaDocumentoComponent>this.bsModalRef.content).onClose.subscribe(result => {
            this.extrametododepadre.emit(result);
            this.indicador = result.id;
            this.habilitacodigo = true;
            this.habilitareviCurso = true;
        });
    }

    public obtenerColaborador(objectForm) {
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            class: 'modal-lg'
        };
        this.bsModalRef = this.modalService.show(BusquedaColaboradorMigracionComponent, config);
        (<BusquedaColaboradorMigracionComponent>this.bsModalRef.content).onClose.subscribe((colaborador: Colaborador) => {
            this.colaborador = colaborador;
            this.nombreColaborador = this.colaborador.nombre + ' ' + this.colaborador.apellidoPaterno + ' ' + this.colaborador.apellidoMaterno;
            this.idcolaborador = colaborador.idColaborador;
            this.item.idcolaboracioncreaciondoc = this.colaborador.idColaborador;
            this.servicioValidacion.validacionSingular(this.item, objectForm, this.errors);
        });
    }

    //obtener fecha de la creacion del documento 
    obtenerFecha(event) {
        this.fechaCreaDocumento = event;
    }

    OnRegresar() {
        this.router.navigate(['./documento/bandejadocumento/editar']);
    }
    controlarError(error) {        
    }

    OnLimpiarCampos() {
        this.item.descripcion = "";
        this.item.proceso = "";
        this.item.id = 0;
        this.item.gerencia = 0;
        this.gerenparametrodesc = "";
        this.item.indicadorDigital = 0;
        this.item.fechaCreaDoc = null;
        this.nombreColaborador = "";
        this.tipodocumento = "";
        this.sgiparametrodesc = "";
        this.item.codigo = "";
        this.procesoparametrodesc = "";
        this.item.estado.v_descons = "";
        this.item.revision.numero = null;
        this.item.revision.fecha = null;
        this.revisionCurso = "00";
        this.captura = null;
        this.habilitacodigo = false;
        this.habilitareviCurso = false;
        this.todosCheck = true;
        this.indicador = 0;
        this.habiliarRevision();
    }


    obtenerDatosFrom(): DocumentoMigracion {
        (this.item as any).todosCheck = this.todosCheck;
        this.item.tabName = "general";
        //this.item.revisonobligatoria = this.robligatorio;
        //this.item.tipoDocumento = this.tipodcumentoid;
        this.item.tipoDocumento = this.tipodcumentoid;
        this.item.proceso = this.procesoparametroid;
        this.item.gerencia = Number(this.gerenparametroid);
        this.item.id = this.indicador;
        /* obtener el indicador digital */
        this.item.indicadorDigital = this.indicadorDigital;
        /*Obtener el indicador Digital */
        this.item.revision.numero = Number(this.revisionCurso);
        //FechaAprobacionDocumento
        //JHERRERAP
        if (this.item.coordinador != null) {
            this.item.coordinador.idColaborador = Number(this.idCoordinador);
        } else {
            this.item.coordinador = new Colaborador();
            this.item.coordinador.idColaborador = Number(this.idCoordinador);
        }
        //JHERRERAP
        if (this.item.revision.fecha != null) {
            this.captura1 = this.datePipe.transform(this.item.revision.fecha, "dd/MM/yyyy");
        } else {
            this.captura1 = this.captura;
        }
        localStorage.setItem("idcolaborador", String(this.idcolaborador));
        localStorage.setItem("revisionCurso", String(this.revisionCurso));
        this.item.idcolaboracioncreaciondoc = this.idcolaborador // id del combo colaborador                      
        this.item.alcanceSGI = this.sgiparametroid;
        return this.item;
    }
    //JHERRERAP
    mostrarCoordinadorSeleccionado() {
        let idGerencia = Number(this.gerenparametroid);//Number(this.idjerarqua);
        let idAlcance = Number(this.sgiparametroid);
        this.serviceRelacion.obtenerDatosCoordinador(idGerencia, idAlcance).subscribe(
            (response: Response) => {
                let listaAlcanceSeleccionado: RelacionCoordinador[] = response.resultado;
                if (listaAlcanceSeleccionado.length == 1) {
                    for (let i: number = 0; listaAlcanceSeleccionado.length > i; i++) {
                        let objetoSeleccionado: RelacionCoordinador = listaAlcanceSeleccionado[i];
                        this.validarDatoCoordinador = false;
                        this.coordinador = objetoSeleccionado.nombreCompletoCoordinador;
                        this.idCoordinador = String(objetoSeleccionado.idCoordinador);
                        this.indicadorDocumentoActivo = (objetoSeleccionado.indicadorDocumento != 0) ? true : false;
                        break;
                    }
                }
            },
            (error) => this.controlarError(error)
        );
    }

    obtenerCoordinadorPorGerencia(idGerencia: string) {
        this.indicadorDocumentoActivo = false;
        let idGerenciaParametro = Number(idGerencia);
        let idAlcance: number = 0;
        this.serviceRelacion.obtenerDatosCoordinador(idGerenciaParametro, idAlcance).subscribe(
            (response: Response) => {
                this.listaDatosCoordinador = response.resultado;
                if (this.listaDatosCoordinador.length > 0) {
                    let encontro: boolean = false;
                    for (let i: number = 0; this.listaDatosCoordinador.length > i; i++) {
                        let datos: RelacionCoordinador = this.listaDatosCoordinador[i];
                        if (datos.idAlcance == null) {
                            this.validarDatoCoordinador = false;
                            this.coordinador = datos.nombreCompletoCoordinador;
                            this.idCoordinador = String(datos.idCoordinador);
                            this.indicadorDocumentoActivo = (datos.indicadorDocumento != 0) ? true : false;
                            encontro = true;
                            break;
                        }
                    }
                    if (!encontro) {
                        this.validarDatoCoordinador = true;
                        this.coordinador = "";
                        this.idCoordinador = "";
                    }
                } else {
                    this.validarDatoCoordinador = true;
                    this.coordinador = "";
                    this.idCoordinador = "";
                    this.toastr.error('No existe un coordinador para la gerencia seleccionada.', 'Alerta!', { closeButton: true });
                }
            },
            (error) => this.controlarError(error)
        );
    }
    //JHERRERAP

    OnBuscarSGI() {
        localStorage.removeItem("idProcesoSeleccionado");
        //this.tipoArbol = "121";
        this.tipoArbol = String(this.idTipoAlcance);
        localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                //JHERRERAP
                listaRelacionCoordinador: this.listaDatosCoordinador,
                tipoDocumentoGerencia: Number(this.tipodcumentoid)
                //JHERRERAP
            },
            class: 'modal-lg'
        }
        const modalArbol = this.modalService.show(ModalArbolComponents, config);
        (<ModalArbolComponents>modalArbol.content).onClose.subscribe(result => {
            let objeto: BandejaDocumento = result;
            this.sgiparametrodesc = objeto.rutaCompleta;
            this.sgiparametroid = objeto.parametroid.toString();
            //JHERRERAP
            let tipoDocumento = objeto.parametrodesc;
            this.sgiparametrodesc = this.sgiparametrodesc.substr(0, this.sgiparametrodesc.length - tipoDocumento.length - 1);
            this.mostrarCoordinadorSeleccionado();
            //JHERRERAP
        });
    }
    //JHERRERAP
    limpiarDatos() {
        this.sgiparametrodesc = "";
        this.sgiparametroid = "";
        this.validarDatoCoordinador = false;
        this.listaDatosCoordinador = [];
        this.coordinador = "";
        this.idCoordinador = "";
        this.indicadorDocumentoActivo = false;
    }
    //JHERRERAP

    OnBuscarGerencia(objectForm) {
        localStorage.removeItem("idProcesoSeleccionado");
        //this.tipoArbol = "122";
        this.tipoArbol = String(this.idTipoGerencia);
        localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
            },
            class: 'modal-lg'
        }
        const modalArbol = this.modalService.show(ModalArbolComponents, config);
        (<ModalArbolComponents>modalArbol.content).onClose.subscribe(result => {
            /* setea el input tipo documento */
            let objeto: BandejaDocumento = result;
            // Descripcion de la Ruta
            this.gerenparametrodesc = objeto.rutaCompleta;
            //ID de la Ruta            
            this.gerenparametroid = String(objeto.parametroid);
            this.errors.gerencia ? this.errors.gerencia = null : null;
            // this.servicioValidacion.validacionSingular(this.item,objectForm,this.errors);
            //Tipo de documento ID
            this.tipodcumentoid = String(objeto.tipodocumento);
            this.tipodocumento = objeto.parametrodesc;

            this.gerenparametrodesc = this.gerenparametrodesc.substr(0, this.gerenparametrodesc.length - this.tipodocumento.length - 1);
            //JHERRERAP
            this.limpiarDatos();
            this.obtenerCoordinadorPorGerencia(this.gerenparametroid);
            //JHERRERAP
        });
    }
    /*obtenerCodigoDocumento(codigoGerencia: number, codigoTipoDocumento: number) {
  this.service.generarCodigoDocumento(codigoGerencia, codigoTipoDocumento).subscribe((responseObject: Response) => {
    this.item.codigo = String(responseObject.resultado);
  }, (error) => {
    this.item.codigo = '';
    const errorResponse: Response = error.error;
    this.toastr.error(errorResponse.error.mensaje, 'Detalle de error', {closeButton: true});
  });
}*/
}

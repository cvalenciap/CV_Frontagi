import { Component, OnInit, ViewChild, Input } from '@angular/core';
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
import { ControlView } from '../../../models';
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
import { Jerarquia } from 'src/app/models/jerarquia';
import { ModalArbolRelacionComponent } from 'src/app/modules/relacioncoordinador/modals/arbol-relacion.component';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { RelacionCoordinadorService } from 'src/app/services/impl/relacioncoordinador.service';
import { Colaborador } from 'src/app/models/colaborador';
import { Codigo } from 'src/app/models/codigo';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
    selector: 'registrar-documento-editar-traslado',
    templateUrl: 'registrar-documento-traslado.template.html',
    providers: [BandejaDocumentoService]
})
export class registrardocumentoTrasladoComponent implements OnInit {
    nodosJerarquiaGerencia: any[];
    parametroBusqueda: string;
    bsModalRef: BsModalRef;
    itemCodigo: number;
    mensajes: any[];
    nuevo: boolean;
    items: Documento;
    item: Documento;
    invalid: boolean;
    check: boolean;
    checkProceso: boolean;
    checkSGI: boolean;
    activarAlcance: boolean;
    activarProceso: boolean;
    tipoArbol: string;
    listaDatosCoordinador: RelacionCoordinador[];
    validarDatoCoordinador: boolean;
    coordinador: string;
    idCoordinador: string;
    indicadorDocumentoActivo: boolean;
    procesoparametrodesc: string;
    procesoparametroid: string;
    activar: boolean;
    activartab: boolean;
    consulta: boolean;
    private sub: any;
    idjerarquia: string;
    private destino: any;
    private idDocumento: any;
    private idDocumento1: any;
    activarGerencia: boolean;
    indicadorLectura: boolean;
    mensajeDestino: string;
    mapDatosRevision: Map<string, any>;
    textoAccion: string;
    nombrePagina: string;
    tipoAccion: string;
    habilitarGrabar: boolean;
    datosRelacion: RelacionCoordinador;
    idProcesoSeleccionadoAnterior: string;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private servicioValidacion: ValidacionService,
        private service: BandejaDocumentoService,
        private serviceRelacion: RelacionCoordinadorService,
        private modalService: BsModalService,
        private serviceParametro: ParametrosService,
        private spinner: NgxSpinnerService) {

        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.parametroBusqueda = 'tipo';
        this.activar = true;
        this.activartab = true;
        this.consulta = true;
        this.idjerarquia = "";
        this.procesoparametrodesc = "";
        this.procesoparametroid = "";
        this.check = false;
        this.tipoArbol;
        this.listaDatosCoordinador = [];
        this.checkSGI = false;
        this.indicadorDocumentoActivo = false;
        this.coordinador = "";
        this.idCoordinador = "";

        this.checkProceso = false;
        this.activarGerencia = true;
        this.activarAlcance = true;
        this.activarProceso = true;
        this.indicadorLectura = false;
        this.habilitarGrabar = true;
        this.mapDatosRevision = new Map<string, any>();
        this.datosRelacion = new RelacionCoordinador;
        this.item = new Documento();
        this.items = new Documento();
        this.textoAccion = Constante.TITULO_GERENCIA;
        if (this.route.parent) {
            this.route.data.subscribe(params => {
                if (params['nArchivo']) {
                    this.nombrePagina = params['nArchivo'];
                    this.tipoAccion = params['accion'];
                    if (this.nombrePagina == NOMBREPAGINA.DOCUMENTO &&
                        this.tipoAccion == ACCIONES.EDITAR) {
                        this.habilitarGrabar = false;
                    }
                }
            });
        }
    }

    ngOnInit() {
        this.idProcesoSeleccionadoAnterior = localStorage.getItem("idProcesoSeleccionado");
        this.nodosJerarquiaGerencia = JSON.parse(localStorage.getItem("nodosJerarquiaGerencia"));
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];

            if (params['indicador'] != null) this.destino = + params['indicador'];
            else this.destino = 0;
            this.idDocumento = + params['documento'];
            this.idDocumento1 = + params['documento1'];

            if (this.destino == 1) this.indicadorLectura = true;
            else this.indicadorLectura = false;
        });

        this.item = new Documento();
        this.service.buscarPorCodigo(this.itemCodigo).subscribe((responseDocumento: Response) => {
            this.item = responseDocumento.resultado
            if (this.item.jalcanceSGI == null) {
                this.item.jalcanceSGI = new Jerarquia;
            }
            if (this.item.jgerencia == null) {
                this.item.jgerencia = new Jerarquia;
            } else {
                this.item.jgerencia.descripcion = this.item.jgerencia.descripcion.substr(0, this.item.jgerencia.descripcion.length - this.item.ctipoDocumento.v_descons.length - 1);
            }
            if (this.item.jproceso == null) {
                this.item.jproceso = new Jerarquia;
            }

            console.log(this.item);
        });
    }
    validarCheck() {
        
        if (this.check == true) {
            this.activarGerencia = false;
        } else {
        this.activarGerencia = true;
            this.datosRelacion.descripcionGerencia = "";
            this.datosRelacion.idGerencia = 0;
            this.idjerarquia = "";
        }
        if (this.checkSGI == true) {
            this.activarAlcance = false;
            if (this.datosRelacion.idGerencia == 0) {
                this.obtenerCoordinadorPorGerencia(this.item.jgerencia.idJerarquia.toString());
            }
        } else {
        this.activarAlcance = true;
            this.datosRelacion.descripcionAlcance = "";
            this.datosRelacion.idAlcance = 0;
        }
        if (this.checkProceso == true) {
            this.activarProceso = false;
        } else {
        this.activarProceso = true;
            this.procesoparametrodesc = "";
            this.procesoparametroid = ""
        }
    }
    OnTrasladar() {
        
        //Inicio cambio Godar
        this.item.revision.idmotirevi=96
        this.item.revision.descripcion="Esta revisión se ha creado desde la opción de Traslado de Documentos.";
        //Fin cambio

        if (this.datosRelacion.idAlcance != 0) {
            this.item.jalcanceSGI.id = this.datosRelacion.idAlcance;
            this.spinner.show();
            this.service.modificarTraslado(this.item).subscribe(
                (response: Response) => {
                    this.spinner.hide();
                    this.items = response.resultado;
                    localStorage.removeItem('nodeSeleccionado'); 
                    localStorage.removeItem("nodosJerarquiaGerencia");
                    this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                    this.router.navigate(['./documento/general/bandejadocumento/editarTraslado']);
                },
            );
        }
        if (this.procesoparametroid != "") {
            
            this.item.jproceso.id = Number(this.procesoparametroid);
            this.spinner.show();
            this.service.modificarTraslado(this.item).subscribe(
                (response: Response) => {
                    this.spinner.hide();
                    this.items = response.resultado;
                    localStorage.removeItem('nodeSeleccionado'); 
                    localStorage.removeItem("nodosJerarquiaGerencia");
                    this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                    this.router.navigate(['./documento/general/bandejadocumento/editarTraslado']);
                },
            );
        }
        if (this.datosRelacion.idGerencia != 0) {
            this.spinner.show();
            this.service.CrearCodigo(this.datosRelacion.idGerencia, Number(this.item.id)).subscribe(
                (response: Response) => {
                    
                    this.spinner.hide();
                    localStorage.removeItem('nodeSeleccionado'); 
                    localStorage.removeItem("nodosJerarquiaGerencia");
                    let idjerarquia = response.resultado;
                    if (idjerarquia != this.idjerarquia) {
                        this.idjerarquia = idjerarquia;
                    }

                    this.item.codigoAnterior = new Codigo();
                    this.item.codigoAnterior.codigo = this.item.codigo;
                    this.item.codigo = this.idjerarquia;
                    this.item.gerencia = this.datosRelacion.idGerencia;
                    if (this.idCoordinador != "" || this.idCoordinador != null) {
                        this.item.coordinador = new Colaborador();
                        this.item.coordinador.idColaborador = Number(this.idCoordinador);
                    }
                    this.item.revision.id = null;
                    this.item.revision.codigo = this.idjerarquia;
                    this.spinner.show();
                    this.service.modificarTraslado(this.item).subscribe(
                        (response: Response) => {
                            this.spinner.hide();
                            this.items = response.resultado;
                            localStorage.removeItem('nodeSeleccionado'); 
                            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                            this.router.navigate(['./documento/general/bandejadocumento/editarTraslado']);
                        },
                    );
                }
            ,
            );
        }

    }
    OnBuscarGerencia() {
        let tipodoc = this.item.id;
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                nodosJerarquia: this.nodosJerarquiaGerencia,
                tipoBandeja: Constante.TIPO_JERARQUIA_GERENCIA
            },
            class: 'modal-lx'
        }
        const modalArbolGerencia = this.modalService.show(ModalArbolRelacionComponent, config);
        (<ModalArbolRelacionComponent>modalArbolGerencia.content).onClose.subscribe(result => {
            let objeto: RelacionCoordinador = result;
            
            this.service.CrearCodigo(objeto.idGerencia, Number(tipodoc)).subscribe(
                (response: Response) => {
                    
                    this.datosRelacion.idGerencia = objeto.idGerencia;
                    this.datosRelacion.descripcionGerencia = objeto.descripcionGerencia;
                    this.idjerarquia = response.resultado;
                    
                    this.obtenerCoordinadorPorGerencia(this.datosRelacion.idGerencia.toString());
                },
            );


        });

    }







    OnBuscarProceso() {
        localStorage.removeItem("idProcesoSeleccionado");
        this.tipoArbol = "120";
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

            let objeto: BandejaDocumento = result;

            this.procesoparametrodesc = objeto.rutaCompleta;
            this.procesoparametroid = objeto.parametroid.toString();
        });

    }
    OnRegresar() {
        localStorage.removeItem("idProcesoSeleccionado");
        this.destino = localStorage.getItem("indicadordocumento");
        localStorage.setItem("idProcesoSeleccionado", this.idProcesoSeleccionadoAnterior)
        if (this.destino == "1") {
            localStorage.removeItem('nodeSeleccionado');
            this.router.navigate(['/documento/general/bandejadocumento/editarTraslado']);

        } else {
            this.router.navigate(['./documento/revisardocumentos']);
        }
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



    OnBuscarSGI() {
        
        localStorage.removeItem("idProcesoSeleccionado");
        this.tipoArbol = "121";
        localStorage.setItem("idProcesoSeleccionado", this.tipoArbol);
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                listaRelacionCoordinador: this.listaDatosCoordinador
            },
            class: 'modal-lg'
        }
        const modalArbol = this.modalService.show(ModalArbolComponents, config);
        (<ModalArbolComponents>modalArbol.content).onClose.subscribe(result => {
            
            let objeto: BandejaDocumento = result;
            let parametro = objeto.parametrodesc;
            this.datosRelacion.descripcionAlcance = objeto.rutaCompleta;
            this.datosRelacion.descripcionAlcance = this.datosRelacion.descripcionAlcance.substr(0, this.datosRelacion.descripcionAlcance.length - parametro.length - 1);
            this.datosRelacion.idAlcance = objeto.parametroid;
            //  this.mostrarCoordinadorSeleccionado();
        });
    }

    mostrarCoordinadorSeleccionado() {
        
        let idGerencia = this.datosRelacion.idGerencia;
        let idAlcance = this.datosRelacion.idAlcance;
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
    controlarError(error) {
        console.error(error);
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

}
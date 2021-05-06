import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { EncuestaService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { Encuesta } from '../../../models/encuesta';
import { Response } from '../../../models/response';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Curso } from 'src/app/models/curso';
import { BusquedaCursoMantenimientoComponent } from 'src/app/modules/encuesta/modales/busqueda-curso-mantenimiento.component';
import { Paginacion } from 'src/app/models';
import { DetalleEncuesta } from 'src/app/models/detalle-encuesta';
import { AgregarPreguntaComponents } from 'src/app/modules/encuesta/modales/agregar-pregunta.component';
import { forEach } from '@angular/router/src/utils/collection';
import { VistaPreviaComponent } from 'src/app/modules/encuesta/views/encuesta-vistaprevia.component';
import { forkJoin } from 'rxjs';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { validate } from 'class-validator';

@Component({
    selector: 'encuesta-editar',
    templateUrl: 'editar.template.html',
    providers: [EncuestaService]
})
export class EncuestaEditarComponent implements OnInit {

    public curso: Curso;
    public idEncu: number;
    errors: any;
    /* codigo seleccionado */
    itemCodigo: number;
    /* datos */
    listaTipos: Tipo[];
    item: Encuesta;
    itemDet: DetalleEncuesta;
    private sub: any;
    /** Prueba */
    bsModalRef: BsModalRef;
    paginacion: Paginacion;
    nuevo: boolean;
    borraLogico: boolean;

    vdispo: number;
    textoCodigo: string;
    textoCurso: string;
    textoCodEncuesta: string;
    textoEncuesta: string;
    idCurso: number;
    //datoA:DetalleEncuesta;
    listaPreguntas: DetalleEncuesta[];
    listaPreguntasAux: DetalleEncuesta[];
    listRespuestaDetalle: DetalleEncuesta[];

    listaResponsableNuevas: DetalleEncuesta[];
    listaResponsablesEliminadas: DetalleEncuesta[];

    encuestaIn: Encuesta;
    encuesta: Encuesta;
    objetoVentana: BsModalRef;
    sesionTablaTmp: DetalleEncuesta = new DetalleEncuesta();
    datoEncuesta: Encuesta;
    valor: number;
    valorN: boolean;
    hdisponible: boolean;
    habilitar: boolean;
    habilitar_vp: boolean;

    codAux: number;
    selectDetalle: DetalleEncuesta = new DetalleEncuesta;
    tipoAccion: string;
    mensajes: any[];
       constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private service: EncuestaService,
        private modalService: BsModalService,
        private servicioValidacion: ValidacionService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.vdispo = 1;
        this.listaPreguntas = [];
        this.listaPreguntasAux = [];
        this.listaResponsableNuevas = [];
        this.listaResponsablesEliminadas = [];
        this.idEncu = 0;
        this.datoEncuesta = new Encuesta();
        this.paginacion = new Paginacion({ registros: 10 });
        this.errors = {};
        this.textoCodEncuesta = "";
        this.valorN = false;
        this.hdisponible = true;
        this.habilitar = true;
        this.habilitar_vp = true;
    }

    ngOnInit() {

        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];
        });

        if (this.itemCodigo) {
            
            this.nuevo = false;
            this.borraLogico = true;
            this.hdisponible = false;
            this.tipoAccion = 'Modificar Encuesta';
            this.habilitar = true;
            this.habilitar_vp = false;

            this.service.buscarPorCodigo(this.itemCodigo).subscribe(
                (response: Response) => {
                    
                    this.datoEncuesta = response.resultado;
                    this.textoCodEncuesta = this.datoEncuesta.vcodencu;
                    this.idCurso = this.datoEncuesta.nidcurs;
                    this.textoEncuesta = this.datoEncuesta.vnomencu;
                    this.textoCodigo = this.datoEncuesta.v_cod_cur;
                    this.textoCurso = this.datoEncuesta.vdescur;
                    this.vdispo = this.datoEncuesta.ndisencu;
                    this.listaPreguntas = this.datoEncuesta.listaDetEncuesta;

                    //this.listaPreguntasAux = this.datoEncuesta.listaDetEncuesta;

                }, (error) => this.controlarError(error)
            );

        } else {
            this.nuevo = true;
            this.borraLogico = false;
            this.hdisponible = true;
            this.tipoAccion = 'Registrar Encuesta';
            this.habilitar = false;
            this.habilitar_vp = true;

        }
    }

    OnRegresar() {
        this.router.navigate([`mantenimiento/encuesta`]);
    }
    controlarError(error) {
        console.error(error);
        // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }


    public obtenerColaborador(objectForm) {
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            class: 'modal-lg'
        };
        this.bsModalRef = this.modalService.show(BusquedaCursoMantenimientoComponent, config);
        (<BusquedaCursoMantenimientoComponent>this.bsModalRef.content).onClose.subscribe((curso: Curso) => {
            this.curso = curso;
            
            this.textoCodigo = this.curso.codigoCurso;
            this.textoCurso = this.curso.nombreCurso;
            this.idCurso = parseInt(this.curso.idCurso);
        });
    }

    OnGuardar() {
        this.obtenerEncuesta();
        

        if (this.nuevo) {
            
            this.encuestaIn = new Encuesta();
            this.encuestaIn.nidcurs = this.idCurso;
            this.encuestaIn.v_cod_cur = this.textoCodigo;
            this.encuestaIn.ndisencu = this.vdispo;
            this.encuestaIn.vcodencu = this.textoCodEncuesta;
            this.encuestaIn.vnomencu = this.textoEncuesta;
            this.encuestaIn.listaDetEncuesta = this.listaPreguntas;

            if (this.encuestaIn.vcodencu === undefined) {
                this.encuestaIn.vcodencu = null;
            } else if (this.encuestaIn.vcodencu.trim().length == 0) {
                this.encuestaIn.vcodencu = null;
            }

            if (this.encuestaIn.vnomencu === undefined) {
                this.encuestaIn.vnomencu = null;
            } else if (this.encuestaIn.vnomencu.trim().length == 0) {
                this.encuestaIn.vnomencu = null;
            } 

            forkJoin(validate(this.encuestaIn)).subscribe(([errors]: [any]) => {
                
                this.mensajes = [];
                let atributoError: any = null;
                if (errors.length > 0) {

                    for (let err of errors) {
                        if (err.property == "listaDetEncuesta") {
                            atributoError = err;
                            break;
                        }
                    }

                    this.validarCampos();

                    let mensajeListaParticipante: string = "";
                    if (atributoError != null && errors.length == 1) {
                        mensajeListaParticipante = atributoError.constraints[Object.keys(atributoError.constraints)[0]]
                        this.toastr.error("Se " + mensajeListaParticipante, 'Acción inválida', { closeButton: true });
                    } else if (atributoError != null && errors.length > 1) {
                        mensajeListaParticipante = atributoError.constraints[Object.keys(atributoError.constraints)[0]]
                        this.toastr.error("Existen campos obligatorios por completar y se " + mensajeListaParticipante, 'Acción inválida', { closeButton: true });
                    }
                    else {
                        this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
                    }

                } else {
                    this.service.guardar(this.encuestaIn).subscribe(
                        (response: Response) => {
                            this.item = response.resultado;
                            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                            this.router.navigate([`mantenimiento/encuesta`]);
                        }
                    );
                }

            });


        } else {
             this.encuestaIn = new Encuesta();
            this.encuestaIn.nidencu = this.itemCodigo;
            this.encuestaIn.nidcurs = this.idCurso;
            this.encuestaIn.v_cod_cur = this.textoCodigo;
            this.encuestaIn.ndisencu = this.vdispo;
            this.encuestaIn.vcodencu = this.textoCodEncuesta;
            this.encuestaIn.vnomencu = this.textoEncuesta;
            this.encuestaIn.listaDetEncuesta = this.listRespuestaDetalle;

            if (this.encuestaIn.vcodencu === undefined) {
                this.encuestaIn.vcodencu = null;
            } else if (this.encuestaIn.vcodencu.trim().length == 0) {
                this.encuestaIn.vcodencu = null;
            }

            if (this.encuestaIn.vnomencu === undefined) {
                this.encuestaIn.vnomencu = null;
            } else if (this.encuestaIn.vnomencu.trim().length == 0) {
                this.encuestaIn.vnomencu = null;
            } 

            forkJoin(validate(this.encuestaIn)).subscribe(([errors]: [any]) => {
                this.mensajes = [];
                if (errors.length > 0) {
                    let atributoError: any = null;
                    for (let err of errors) {
                        if (err.property == "listaDetEncuesta") {
                            atributoError = err;
                            break;
                        }
                    }

                    this.validarCampos();

                    let mensajeListaParticipante: string = "";
                    if (atributoError != null && errors.length == 1) {
                        mensajeListaParticipante = atributoError.constraints[Object.keys(atributoError.constraints)[0]]
                        this.toastr.error("Se " + mensajeListaParticipante, 'Acción inválida', { closeButton: true });
                    } else if (atributoError != null && errors.length > 1) {
                        mensajeListaParticipante = atributoError.constraints[Object.keys(atributoError.constraints)[0]]
                        this.toastr.error("Existen campos obligatorios por completar y se " + mensajeListaParticipante, 'Acción inválida', { closeButton: true });
                    }
                    else {
                        this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
                    }
                } else {
                    this.service.guardar(this.encuestaIn).subscribe(
                        (response: Response) => {
                            this.item = response.resultado;
                            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                            this.router.navigate([`mantenimiento/encuesta`]);
                        }
                    );
                }

            });

        }
    }

    validarCampos() {
        this.errors = {};
        this.servicioValidacion.validacionObjeto(this.encuestaIn, this.errors);
    }

    obtenerEncuesta() {
        
        this.listRespuestaDetalle = this.listaPreguntas;

        if (this.itemCodigo) {
            if (this.listaPreguntasAux.length > 0) {
                for (let dato of this.listaPreguntasAux) {
                    this.listRespuestaDetalle.push(dato);
                    this.listaPreguntas = this.listaPreguntas.filter(x => x != dato);
                }
            }
        }

    }

    OnAgregar() {
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: { codigoSesion: this.listaPreguntas.length + 1, }
        }

        this.objetoVentana = this.modalService.show(AgregarPreguntaComponents, config);
        (<AgregarPreguntaComponents>this.objetoVentana.content).onClose.subscribe((detalleEncuesta: DetalleEncuesta) => {
            
            this.listaPreguntas.push(detalleEncuesta);
            this.paginacion.totalRegistros = this.listaPreguntas.length;
        });

    }

    editarCursoSesion(indiceSesion: number, preguntaDetalle: DetalleEncuesta) {
        
        this.selectDetalle = preguntaDetalle;

        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                item: this.selectDetalle.vcodetaencu,
                dispo: this.selectDetalle.ndisdetenc,
                nombre: this.selectDetalle.vdespre,
            }
        }

        this.objetoVentana = this.modalService.show(AgregarPreguntaComponents, config);
        
        (<AgregarPreguntaComponents>this.objetoVentana.content).onClose.subscribe((sesionTmp: DetalleEncuesta) => {
            
            this.selectDetalle.item = parseInt(sesionTmp.vcodetaencu);
            this.selectDetalle.vdespre = sesionTmp.vdespre;
            this.selectDetalle.ndisdetenc = sesionTmp.ndisdetenc;

            this.listaPreguntas = this.listaPreguntas.filter(x => x = this.selectDetalle);
            this.paginacion.totalRegistros = this.listaPreguntas.length;
        });
    }

    eliminarSesion(indice: number, preguntaDetalle: DetalleEncuesta) {

        
        this.selectDetalle = preguntaDetalle;

        for (let dato of this.listaPreguntas) {
            if (dato.vdespre == preguntaDetalle.vdespre) {
                if (dato.niddetaencu > 0) {
                    this.selectDetalle.ndisdetenc = 2;
                    this.listaPreguntasAux.push(this.selectDetalle);
                    break;
                }
            }
        }

        this.listaPreguntas = this.listaPreguntas.filter(x => x != this.selectDetalle);
        this.paginacion.totalRegistros = this.listaPreguntas.length;
        this.codAux = 0;

        for (let dat of this.listaPreguntas) {

            if (this.codAux > 0) {
                dat.vcodetaencu = "0";
                dat.vcodetaencu = (this.codAux + 1).toString();
                this.codAux = parseInt(dat.vcodetaencu);
            } else {
                dat.vcodetaencu = "0";
                dat.vcodetaencu = (parseInt(dat.vcodetaencu) + 1).toString();
                this.codAux = parseInt(dat.vcodetaencu);
            }
        }
        console.log(this.listaPreguntas);
        this.habilitar_vp = true;
    }

    abrirBusqueda() {
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                itemEncu: this.itemCodigo,
                codigoEncu: this.textoCodEncuesta,
                textoEncu: this.textoEncuesta
            },
            class: 'modal-lg'

        }
        this.objetoVentana = this.modalService.show(VistaPreviaComponent, config);
        (<VistaPreviaComponent>this.objetoVentana.content).onClose.subscribe(result => {
        });
    }


}

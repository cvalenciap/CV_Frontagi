import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService, JsonService, BandejaDocumentoService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { Response } from '../../../models/response';
import { REVISION } from '../constanteRevision';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BusquedaDocumentoComponent } from '../modals/busqueda-documento.component';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { RevisionDocumento, Documento, DocumentoAdjunto, UploadResponse, Paginacion } from 'src/app/models';
import { FormGroup, FormBuilder, FormControl, Validators } from '@angular/forms';
import { DatePipe } from '@angular/common';
import { Constante } from 'src/app/models/enums';
import { forkJoin } from 'rxjs';
import { validate } from 'class-validator';
import { ESTADO_REVISION, FormatoCarga } from 'src/app/constants/general/general.constants';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { TabGroupAnimationsExample1 } from 'src/app/modules/tabsmigracion/views/tab-group-animations-example';
import { Critica } from "../../../models/critica";
import { environment } from 'src/environments/environment';
import { FileServerService } from 'src/app/services/impl/file-server.service';
import { DocumentoMigracion } from 'src/app/models/documentomigracion';
import { Event } from '@angular/router/src/events';
import { NgxSpinnerService } from 'ngx-spinner';
import { Equipo } from 'src/app/models/equipo';



@Component({
    selector: 'registrar-revision-documento',
    templateUrl: 'registrar-revision-documento.template.html',
    styleUrls: ['registrar-revision-documento.component.scss']
})
export class RegistrarRevisionDocumentoComponent1 implements OnInit {
    @ViewChild("fileRevision") fileRevision: ElementRef;
    @ViewChild("customButton") customButton: ElementRef;

    bsModalRef: BsModalRef;
    nombreArchivoRevision: string;
    constanteRevision: any;
    idRevDoc: number;
    SizeFile: number;
    SizeFile1: number;
    item: DocumentoMigracion;
    private sub: any;
    parametros: Map<string, any>;
    @ViewChild('filed')
    myInputVariable: ElementRef;
    @ViewChild('filed1')
    myInputVariable1: ElementRef;

    formRevision: FormGroup;
    listaGerencia: any[];
    listaAlcance: any[];
    listaProceso: any[];
    codigo: number;
    consulta: boolean;
    activar: boolean;
    mensajearchivo: string;
    mensajearchivoDoc: string;
    @ViewChild('tab') tab: TabGroupAnimationsExample1;
    mensajes: any[];
    documentoAdjunto: DocumentoAdjunto;
    docAnterior: string = '';
    loading: boolean;
    archivo: any;
    archivoDoc: any;
    errors: any;
    habilita: boolean;
    paginacion:Paginacion;
    listaDocumentos:Documento[];
    estadoCodigo:boolean;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router, private servicioValidacion: ValidacionService,
        private bandejaFileServerService: FileServerService,
        private route: ActivatedRoute, private serviceDocumento: BandejaDocumentoService,
        private spinner: NgxSpinnerService,
        private service: RevisionDocumentoService, private modalService: BsModalService,
        private formBuilder: FormBuilder, private datePipe: DatePipe, private serviceParametro: ParametrosService,
        private _jsonService: JsonService,
        private service1: BandejaDocumentoService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.constanteRevision = REVISION;
        this.parametros = new Map<string, any>();
        this.consulta = true;
        this.activar = false;
        this.loading = false;
        this.habilita = true;
        this.item = new DocumentoMigracion();
        this.errors = {};
        this.mensajearchivo = "No se encuentra ningún archivo seleccionado";
        this.mensajearchivoDoc = "No se encuentra ningún archivo seleccionado";
    }

    ngOnInit() {
        
        this.estadoCodigo=false;
        this.listaDocumentos=[];
        this.paginacion = new Paginacion({registros: 10});
        this.documentoAdjunto = new DocumentoAdjunto();
        this.documentoAdjunto.nombreReal = '';
        this.inicializarFormulario();
        this.docAnterior = null;
        this.archivoDoc = null;
        this.archivo = null;
        this.getLista();
        sessionStorage.removeItem("elaboracion");
        sessionStorage.removeItem("consenso");
        sessionStorage.removeItem("aprobacion");
        sessionStorage.removeItem("homologacion");
    }

    onBuscarDocumento() {
        this.tab.general.onBuscarDocumento();
    }

    inicializarFormulario() {
        this.formRevision = this.formBuilder.group({
            'num_solicitud': new FormControl('', []),
            'fecha_solicitud': new FormControl('', []),
            'nombre_completo': new FormControl('', []),
            'equipo': new FormControl('', []),
            'revision': new FormControl('', []),
            'fec_revision': new FormControl('', [])
        });

    }
    OnRegresar() {
        this.router.navigate([`documento/revisiondocumento`]);
    }
    controlarError(error) {
    }

    fechaActual() {
        var d = new Date();
        return ("0" + d.getDate()).slice(-2) + "/" + ("0" + (d.getMonth() + 1)).slice(-2) + "/" + d.getFullYear();
    }

    selectFile() {
        this.fileRevision.nativeElement.click();
    }
    archivoCambio() {
        this.nombreArchivoRevision = this.fileRevision.nativeElement.value;
    }
    OnValidarSiEsAprobado(item: any) {
        if (item == "1") {
            this.habilita = false;
        } else {
            this.habilita = true;
        }
    }
    OnAdjuntarDoc(file: any) {
        this.SizeFile = file.target.files[0].size;
        if (file.target.files.length > 0) {
            if (this.SizeFile > 40000000) {
                this.toastr.warning('El documento excede el tamaño permitido 40MB.','Atención', {closeButton: true});
        }else{
                if (FormatoCarga.word == file.target.files[0].type || FormatoCarga.wordAntiguo == file.target.files[0].type || FormatoCarga.excel == file.target.files[0].type || FormatoCarga.excelAntiguo == file.target.files[0].type) {
                    this.archivoDoc = file.target.files[0];
                    this.mensajearchivoDoc = file.target.files[0].name;
                    this.validacionSingularDistinta(this.archivoDoc, "nombreArchivo", this.errors);
                }else {
                    this.toastr.warning('Solo se permite archivo Word ó Excel', 'Atención', { closeButton: true });
                }
            }
        }
        this.myInputVariable1.nativeElement.value = "";
        return;
    }

    OnAdjuntar(file: any) {
        this.SizeFile1 = file.target.files[0].size;
        if (file.target.files.length > 0) {
            if (this.SizeFile1 > 40000000) {
                this.toastr.warning('El documento excede el tamaño permitido 40MB.','Atención', {closeButton: true});
        }else{
            if (FormatoCarga.pdf == file.target.files[0].type) {
                this.archivo = file.target.files[0];
                this.mensajearchivo = file.target.files[0].name;
                this.validacionSingularDistinta(this.archivo, "nombreArchivo", this.errors);
            } else {
                this.toastr.warning('Solo se permite archivo PDF', 'Atención', { closeButton: true });
            }
          }
       }
       this.myInputVariable.nativeElement.value = "";
       return;
    }


    validacionSingularDistinta(modelo: any, atributo: string, errorsGlobal: any) {
        validate(modelo).then(errors => {

            errorsGlobal[atributo] = "";
            if (errors.length > 0) {
                errors.map(e => {

                    if (e.property == atributo) {
                        errorsGlobal[e.property] = e.constraints[Object.keys(e.constraints)[0]];
                        return;
                    }
                });
            }
        });
    }

    getLista(){
        
        const parametros: { tipodocumento?: string, codigo?: string, titulo?: string, estdoc: string }
        = { tipodocumento: null, codigo: null, titulo: null, estdoc: null};
       this.paginacion.registros=10000000;
       this.paginacion.pagina=1;

      this.service1.buscarPorParametrosMigracion(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
            
         this.listaDocumentos=response.resultado;
        },
        (error) => this.controlarError(error)
      );
    }


    OnGuardar() {
        
        //Inicio cambio Godar
        sessionStorage.removeItem("elaboracion");
        sessionStorage.removeItem("consenso");
        sessionStorage.removeItem("aprobacion");
        sessionStorage.removeItem("homologacion");
        //Fin cambio Godar

        this.tab.general.errors = {};
        /*Obtenemos los datos del la pestaña informacion general*/
        let documento: DocumentoMigracion = this.tab.general.obtenerDatosFrom();
        /*Seteamos al bean de documento la lista de documento */
        if (this.tab.equipousuario.listaEquipo.length > 0) {
            documento.listaEquipo = this.tab.equipousuario.listaEquipo;
            let objeto = documento.listaEquipo.find(equipo => equipo.indicadorResp == 1);
            if (objeto == undefined) {
                this.toastr.error("Por favor, seleccione un equipo responsable en la pestaña 'Equipo Usuario'", 'Acción inválida', { closeButton: true });
                return
            }
        }
        //documento.listaParticipante = this.tab.participantes.item.listaElaboracion;


        this.tab.participantes.errors = {};
        documento.participanteElaboracion = this.tab.participantes.item.listaElaboracion;
        documento.participanteConsenso = this.tab.concenso.item.listaConsenso;
        //Aprobación
        documento.participanteAprobacion = this.tab.aprobacion.item.listaAprobacion;
        //Homologación
        documento.participanteHomologacion = this.tab.homologacion.item.listaHomologacion;
        //Documento Relacionado
        let objetodocumento: DocumentoMigracion = new DocumentoMigracion();
        let listacomplen: DocumentoMigracion[] = this.tab.complementario.listaSeguimiento
        let listacomplentariofinal: DocumentoMigracion[] = [];
        for (let i: number = 0; i < listacomplen.length; i++) {
            let responsableObj: DocumentoMigracion = listacomplen[i];
            let objetodocumento: DocumentoMigracion = new DocumentoMigracion();
            objetodocumento.id = responsableObj.id;
            objetodocumento.descripcion = responsableObj.descripcion;
            objetodocumento.tipo = responsableObj.tipo;
            objetodocumento.tipoComplementario = responsableObj.tipoComplementario;
            listacomplentariofinal.push(objetodocumento);
        }
        documento.listaComplementario = listacomplentariofinal;
         //Inicio Cambio Godar
         documento.listaComplementario=documento.listaComplementario.filter(x=>x.tipoComplementario.v_descons!="Documentos que se complementan");

         //Fin cambio

        this.tab.revision.errors = {};
        documento.revision = this.tab.revision.obtenerRequestRevision(ESTADO_REVISION.EMITIDO);
        documento.critica = this.tab.critica.obtenerCritica();
        documento.bitacora = null;
        let fechaFinal = this.tab.general.captura1;
        this.tab.general.captura = fechaFinal;
        //Inicio cambio Godar
        let usuarioRevision= localStorage.getItem("codFichaLogueado");
        if(usuarioRevision!=undefined){
         documento.revision.usuarioRevision=Number(usuarioRevision);
        }
        //Fin Godar
        forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
            this.mensajes = [];
            if (this.servicioValidacion.mapearErrores(errors, this.tab, this.mensajes)) {
                this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
                let nrevision = documento.revision.numero
                if (nrevision < 1) {
                    documento.revision.numero = 0;
                } else {
                    documento.revision.numero = documento.revision.numero - 1;
                }
            } else {

                
                const parametros: { tipodocumento?: string, codigo?: string, titulo?: string, estdoc: string }
                = { tipodocumento: null, codigo: null, titulo: null, estdoc: null};
               this.paginacion.registros=10000000;
               this.paginacion.pagina=1;

              this.service1.buscarPorParametrosMigracion(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
                (response: Response) => {
                    
                 this.listaDocumentos=response.resultado;
                 let estadoRevisi:boolean=false;
                 let estCod:boolean=false;
                 if(this.listaDocumentos.length>0){
                     for(let val of this.listaDocumentos){
                         if(val.codigo==documento.codigo){
                             if(val.revision.numero==documento.revision.numero){
                                 this.estadoCodigo=false;
                                 estCod=true;
                                 estadoRevisi=true;
                                 break;
                             }else{
                                 this.estadoCodigo=false;
                                 estCod=true;
                                 estadoRevisi=false;
                                 break;
                             }

                         }else{
                             this.estadoCodigo=true;
                         }
                     }
                 }else{
                    this.estadoCodigo=true;
                 }
                
                 if (documento.id == 0) {
                    this.loading = true;
                    if (this.habilita == true) {
                        if (this.archivo != null) {
                            if (this.archivoDoc != null) {
                                if(this.estadoCodigo){
                                this.spinner.show();
                                //nuevo
                                this.serviceDocumento.guardarMigracionArchivo(this.archivo, this.archivoDoc, documento).subscribe(
                                    (response: Response) => {
                                        
                                        this.spinner.hide();
                                        this.item = response.resultado;
                                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                        /*  Limpiar Campos General  */
                                        this.tab.general.OnLimpiarCampos();
                                        this.tab.critica.OnLimpiarCampos();
                                        this.tab.participantes.item.listaElaboracion = [];
                                        this.tab.concenso.item.listaConsenso = [];
                                        this.tab.aprobacion.item.listaAprobacion = [];
                                        this.tab.homologacion.item.listaHomologacion = [];
                                        //Documento Complementario
                                        this.tab.complementario.listaSeguimiento = [];
                                        this.tab.equipousuario.listaEquipo = [];
                                        this.tab.revision.OnLimpiarCampos();

                                        if (this.archivo != null) {
                                            this.myInputVariable.nativeElement.value = "";
                                        }
                                        if (this.archivoDoc != null) {
                                            this.myInputVariable1.nativeElement.value = "";
                                           // this.myInputVariable1.nativeElement.
                                        }
                                        this.archivo = null;
                                        this.archivoDoc = null;
                                        this.mensajearchivo = "No se encuentra Ningún archivo seleccionado";
                                        this.mensajearchivoDoc = "No se encuentra Ningún archivo seleccionado";

                                    });
                                }else{
                                    if(estCod){
                                        this.toastr.warning('El código del documento ya existe, por favor revise el número de código', 'Atención', { closeButton: true });
                                    }else if(estadoRevisi){
                                        this.toastr.warning('El número de revisión asociado al código ya existe, verifique el número de revisión.', 'Atención', { closeButton: true });
                                    }
                                }
                            } else {
                                this.toastr.warning('Debe Adjuntar un archivo Word ó Excel antes de Guardar', 'Atención', { closeButton: true });
                                let nrevision = documento.revision.numero
                                if (nrevision < 1) {
                                    documento.revision.numero = 0;
                                } else {
                                    documento.revision.numero = documento.revision.numero - 1;
                                }

                            }

                        } else {
                            this.toastr.warning('Debe Adjuntar un archivo PDF antes de Guardar', 'Atención', { closeButton: true });
                            let nrevision = documento.revision.numero
                            if (nrevision < 1) {
                                documento.revision.numero = 0;
                            } else {
                                documento.revision.numero = documento.revision.numero - 1;
                            }
                        }
                    } else if (this.habilita == false) {

                        if (this.archivo != null) {
                            this.spinner.show();
                            this.serviceDocumento.guardarMigracionArchivo(this.archivo, this.archivoDoc, documento).subscribe(
                                //CGuerra Fin
                                (response: Response) => {
                                    this.spinner.hide();
                                    this.item = response.resultado;
                                    this.toastr.success('Registros almacenado', 'Acción completada!', { closeButton: true });
                                    /*  Limpiar Campos General  */
                                    this.tab.general.OnLimpiarCampos();
                                    this.tab.participantes.item.listaElaboracion = [];
                                    this.tab.concenso.item.listaConsenso = [];
                                    this.tab.aprobacion.item.listaAprobacion = [];
                                    this.tab.homologacion.item.listaHomologacion = [];
                                    this.tab.complementario.listaSeguimiento = [];
                                    this.tab.equipousuario.listaEquipo = [];
                                    this.tab.revision.OnLimpiarCampos();
                                    this.tab.critica.OnLimpiarCampos();
                                    if (this.archivo != null) {
                                        this.myInputVariable.nativeElement.value = "";
                                    }

                                    if (this.archivoDoc != null) {
                                        this.myInputVariable1.nativeElement.value = "";
                                    }
                                    this.archivo = null;
                                    this.archivoDoc = null;

                                    this.mensajearchivo = "No se encuentra Ningún archivo seleccionado";
                                    this.mensajearchivoDoc = "No se encuentra Ningún archivo seleccionado";
                                });
                        } else {
                            this.toastr.warning('Debe Adjuntar un archivo PDF antes de Guardar', 'Atención', { closeButton: true });
                            let nrevision = documento.revision.numero
                            if (nrevision < 1) {
                                documento.revision.numero = 0;
                            } else {
                                documento.revision.numero = documento.revision.numero - 1;
                            }
                        }

                    }
                    /*  Guarda Documento  */
                    this.loading = false;
                } else {
                    if (this.habilita == true) {
                        if (this.archivo != null) {
                            if (this.archivoDoc != null) {
                                if(!estadoRevisi){
                                this.spinner.show();
                                //Modifica
                                this.serviceDocumento.guardarMigracionArchivo(this.archivo, this.archivoDoc, documento).subscribe(
                                    (response: Response) => {
                                        this.spinner.hide();
                                        this.item = response.resultado;
                                        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                        /*  Limpiar Campos General  */
                                        this.tab.general.OnLimpiarCampos();
                                        this.tab.critica.OnLimpiarCampos();
                                        this.tab.participantes.item.listaElaboracion = [];
                                        this.tab.concenso.item.listaConsenso = [];
                                        this.tab.aprobacion.item.listaAprobacion = [];
                                        this.tab.homologacion.item.listaHomologacion = [];
                                        //Documento Complementario
                                        this.tab.complementario.listaSeguimiento = [];
                                        this.tab.equipousuario.listaEquipo = [];
                                        this.tab.revision.OnLimpiarCampos();
                                        if (this.archivo != null) {
                                            this.myInputVariable.nativeElement.value = "";
                                        }
                                        if (this.archivoDoc != null) {
                                            this.myInputVariable1.nativeElement.value = "";
                                        }
                                        this.archivo = null;
                                        this.archivoDoc = null;
                                        this.mensajearchivo = "No se encuentra ningún archivo seleccionado";
                                        this.mensajearchivoDoc = "No se encuentra Ningún archivo seleccionado";
                                    },
                                    (error) => this.controlarError(error)
                                );

                                }else{
                                    this.toastr.warning('El número de revisión asociado al código ya existe, verifique el número de revisión.', 'Atención', { closeButton: true });
                                }
                            } else {
                                let nrevision = documento.revision.numero
                                if (nrevision < 1) {
                                    documento.revision.numero = 0;
                                } else {
                                    documento.revision.numero = documento.revision.numero - 1;
                                }

                                this.toastr.warning('Debe Adjuntar un archivo Word ó Excel antes de Guardar', 'Atención', { closeButton: true });
                            }
                        } else {
                            let nrevision = documento.revision.numero
                            if (nrevision < 1) {
                                documento.revision.numero = 0;
                            } else {
                                documento.revision.numero = documento.revision.numero - 1;
                            }
                            this.toastr.warning('Debe Adjuntar un archivo PDF antes de Guardar', 'Atención', { closeButton: true });
                        }
                    } else if (this.habilita == false) {
                        if (this.archivo != null) {
                            this.spinner.show();
                            this.serviceDocumento.guardarMigracionArchivo(this.archivo, this.archivoDoc, documento).subscribe(
                                (response: Response) => {
                                    this.spinner.hide();
                                    this.item = response.resultado;
                                    this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                                    /*  Limpiar Campos General  */
                                    this.tab.general.OnLimpiarCampos();
                                    this.tab.critica.OnLimpiarCampos();
                                    this.tab.participantes.item.listaElaboracion = [];
                                    this.tab.concenso.item.listaConsenso = [];
                                    this.tab.aprobacion.item.listaAprobacion = [];
                                    this.tab.homologacion.item.listaHomologacion = [];
                                    //Documento Complementario
                                    this.tab.complementario.listaSeguimiento = [];
                                    this.tab.equipousuario.listaEquipo = [];
                                    this.tab.revision.OnLimpiarCampos();
                                    if (this.archivo != null) {
                                        this.myInputVariable.nativeElement.value = "";
                                    }
                                    if (this.archivoDoc != null) {
                                        this.myInputVariable1.nativeElement.value = "";
                                    }
                                    this.archivo = null;
                                    this.archivoDoc = null;
                                    this.mensajearchivo = "No se encuentra ningún archivo seleccionado";
                                    this.mensajearchivoDoc = "No se encuentra Ningún archivo seleccionado";
                                },
                                (error) => this.controlarError(error)
                            );
                        } else {
                            this.toastr.warning('Debe Adjuntar un archivo PDF antes de Guardar', 'Atención', { closeButton: true });
                            let nrevision = documento.revision.numero
                            if (nrevision < 1) {
                                documento.revision.numero = 0;
                            } else {
                                documento.revision.numero = documento.revision.numero - 1;
                            }
                        }

                    }
                }

                },
                (error) => this.controlarError(error)
              );
            }
        });
    }
}

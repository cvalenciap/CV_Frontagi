import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService, CorreoService } from '../../../../services';
import { Tipo } from '../../../../models/tipo';
import { Estado } from '../../../../models/enums/estado';
import { BandejaDocumento } from '../../../../models/bandejadocumento';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { validate } from 'class-validator';
import { ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Documento } from 'src/app/models/documento';
import { TabGroupAnimationsCopiaImpresa } from 'src/app/modules/bandejadocumento/copiaImpresa/views/tab-group-animations-copiaImpresa';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { forkJoin } from 'rxjs';

import { ValidacionService } from 'src/app/services/util/validacion.service';
import { Constante } from 'src/app/models/enums/constante';
import { SessionService } from 'src/app/auth/session.service';
import { NgxSpinnerService } from 'ngx-spinner';


@Component({
    selector: 'app-registrocopiaimpresion',
    templateUrl: 'registrocopiaimpresion.template.html',
    styleUrls: ['registrocopiaimpresion.component.scss']
})
export class RegistroCopiaImpresionComponent implements OnInit {
    @ViewChild("fileRevision") fileRevision: ElementRef;
    @ViewChild("customButton") customButton: ElementRef;
    @ViewChild('tab') tab: TabGroupAnimationsCopiaImpresa;
    bsModalRef: BsModalRef;
    nombreArchivoRevision: string;
    constanteRevision: any;
    /* codigo seleccionado */
    itemCodigo: number;
    items: Documento[];
    habilitaenviar: boolean;
    /* datos */
    listaTipos: Tipo[];
    item: BandejaDocumento;
    private sub: any;
    paginacion: Paginacion;
    mensajes: any[];
    //  @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        public session: SessionService,
        private route: ActivatedRoute,
        private servicioValidacion: ValidacionService,
        private service: BandejaDocumentoService,
        private serviceG: RevisionDocumentoService,
        private serviceCorreo: CorreoService,
        private modalService: BsModalService,
        private spinner: NgxSpinnerService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.items = [];
        this.habilitaenviar = false;
        this.paginacion = new Paginacion({ registros: 10 });
        //this.constanteRevision = REVISION;
    }

    ngOnInit() {
        this.spinner.show();

        
        let idDocumento
        idDocumento = localStorage.getItem("iddocumento");
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];

        });

        /*  Buscar Documento Para setear a la Pestaña Solicitud   */
        console.log("P id doc");
        console.log(idDocumento);
        if (idDocumento) {
            this.spinner.show();
            this.service.buscarPorCodigo(idDocumento).subscribe(
                (response: Response) => {
                    
                    this.spinner.hide();
                    let listaderevisiondoc1: Documento[] = response.resultado;
                    this.items = listaderevisiondoc1;
                    this.paginacion = new Paginacion(response.paginacion);
                    console.log("para pintarssssssss");
                    console.log(this.items);
                    console.log(listaderevisiondoc1);
                }
            );
        }
        this.spinner.hide();
    }
    OnAprobar() {
        
        let idDocumento;
        idDocumento = localStorage.getItem("iddocumento");
        localStorage.removeItem("iddocumento");
        this.tab.solicitud.errors = {};
        let documento = this.tab.solicitud.obtenerRequestRevision();
        documento.numerosolicitud = this.itemCodigo;
        documento.indicadorestado = "143";
        //Lista de destinatarios
        documento.listaParticipante = this.tab.solicitud.listaParticipantes;
        this.serviceG.guardarSolicitudModif(documento).subscribe(
            (response: Response) => {

                //Enviar Correo
                this.serviceCorreo.obtenerCorreo(idDocumento, this.itemCodigo,
                    Constante.CORREO_IMPRESION).subscribe(
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

                this.item = response.resultado;
                this.toastr.success('Se Aprobó la Solicitud', 'Acción completada!', { closeButton: true });
                this.router.navigate([`/documento/tareapendiente/CopiaImpresion`]);
            }
        );
    }

    OnRechazar() {
        
        let idDocumento;
        idDocumento = localStorage.getItem("iddocumento");
        let documento = this.tab.solicitud.obtenerRequestRevision();
        documento.numerosolicitud = this.itemCodigo;
        documento.indicadorestado = "142";//Rechazado
        documento.motivoR = this.tab.solicitud.idmotivo;
        documento.tipoCopia = this.tab.solicitud.tipoCopia;
        documento.sustento = this.tab.solicitud.sustento;
        //Lista de destinatarios
        documento.listaParticipante = this.tab.solicitud.listaParticipantes;
        
        this.tab.critica.errors = {};
        let critica = this.tab.critica.obtenerRequestCritica();
        documento.resumenCritica = critica.resumenCritica
        if (documento.resumenCritica == " ") {
            documento.resumenCritica = "";
        }
        //Validación
        forkJoin(validate(documento)).subscribe(([errors]: [any]) => {
            this.mensajes = [];
            if (errors.length > 0) {
                this.tab.critica.validarCampos();
                this.toastr.error("Se requiere agregar una crítica", 'Acción inválida', { closeButton: true });
            } else {
                //Validación
                this.serviceG.guardarSolicitudModif(documento).subscribe(
                    (response: Response) => {
                        this.item = response.resultado;
                        localStorage.removeItem("objetoRetornoBusquedaCopia");  
                        //Enviar Correo
                        this.serviceCorreo.obtenerCorreo(idDocumento, this.item.id,
                            Constante.CORREO_IMPRESION_RECHAZO).subscribe(
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
                        localStorage.removeItem("iddocumento");
                        this.toastr.success('Se Rechazó la Solicitud', 'Acción completada!', { closeButton: true });
                        this.router.navigate([`/documento/tareapendiente/CopiaImpresion`]);
                    }
                );
                //Validación
            }
        });
        //Validación
    }

    OnRegresar() {
        localStorage.removeItem("susteso");
        localStorage.removeItem("iddocumento");
        localStorage.removeItem("tipocopia");
        localStorage.removeItem("numeromotivo");
        localStorage.removeItem("idSolicitud");
        this.router.navigate([`documento/tareapendiente/CopiaImpresion`]);
    }

    OnValidarSiEsAprobado(item: any) {
        if (item == "143" || item == "142") { //Estado Aprobado y estado rechazado// 
            this.habilitaenviar = true;
        } else {
            this.habilitaenviar = false;
        }
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
    controlarError(error) {
        console.error(error);
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });

    }
}

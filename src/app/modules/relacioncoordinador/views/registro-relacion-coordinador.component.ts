import { Component, OnInit, SecurityContext } from '@angular/core';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { Router } from '@angular/router';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Response } from './../../../models/response';
import { RelacionCoordinadorService, ParametrosService} from './../../../services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalArbolRelacionComponent } from 'src/app/modules/relacioncoordinador/modals/arbol-relacion.component';
import { AgregarDestinatarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-destinatario.component';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { BandejaDocumentoService } from './../../../services/index';
import { Constante } from 'src/app/models/enums/constante';
import { RutaParticipante } from 'src/app/models/rutaParticipante';

@Component({
    selector: 'app-registro-relacion-coordinador',
    templateUrl: './registro-relacion-coordinador.template.html',
    providers: [RelacionCoordinadorService]
})
export class RegistroRelacionCoordinadorComponent implements OnInit {
    public colaborador: RutaParticipante;
    loading: boolean;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    dismissible = true;
    bsModalRef: BsModalRef;
    datosRelacion: RelacionCoordinador;
    deshabilitarBusquedaJerarquias: boolean;
    nodosJerarquiaGerencia: any[];
    nodosJerarquiaAlcance: any[];
    documentoCheck: boolean;
    validarDatoGerencia: boolean;
    validarDatoAlcance: boolean;
    validarDatoCoordinador: boolean;
    
    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private service: RelacionCoordinadorService,
                private serviceDocumento: BandejaDocumentoService,
                private modalService: BsModalService,
                private sanitizer: DomSanitizer,
                private serviceParametro: ParametrosService) {
        this.loading = false;
        defineLocale('es', esLocale);
        this.localeService.use('es');
    }

    ngOnInit() {
        this.OnSetearValores();
        let objetoRelacion = JSON.parse(localStorage.getItem("objetoRelacion"));
        let nuevo = JSON.parse(localStorage.getItem("nuevo"));
        this.nodosJerarquiaGerencia = JSON.parse(localStorage.getItem("nodosJerarquiaGerencia"));
        this.nodosJerarquiaAlcance = JSON.parse(localStorage.getItem("nodosJerarquiaAlcance"));

        if(objetoRelacion != null && !nuevo){
            this.datosRelacion = objetoRelacion;
            if(this.datosRelacion.indicadorSinAlcance == 1 && this.datosRelacion.idAlcance == null){
                this.datosRelacion.idAlcance = 0;
            }
            this.deshabilitarBusquedaJerarquias = true;
            this.OnMarcarIndicadorDocumento();
        }
    }

    OnSetearValores(){
        this.documentoCheck = false;
        this.nodosJerarquiaGerencia = [];
        this.nodosJerarquiaAlcance = [];
        this.datosRelacion = new RelacionCoordinador();
        this.deshabilitarBusquedaJerarquias = false;
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
    }

    OnMarcarIndicadorDocumento(){
        if(this.datosRelacion.indicadorDocumento == 1){
            this.documentoCheck = true;
        } else {
            this.documentoCheck = false;
        }
    }

    OnBuscarGerencia(){
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
            this.datosRelacion.idGerencia = objeto.idGerencia;
            this.datosRelacion.descripcionGerencia = objeto.descripcionGerencia;
            if(this.validarDatoGerencia) {this.validarDatoGerencia = false}
        });
    }

    OnBuscarAlcance(){
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                nodosJerarquia: this.nodosJerarquiaAlcance,
                tipoBandeja: Constante.TIPO_JERARQUIA_ALCANCE
            },
            class: 'modal-lx'
        }
        const modalArbolAlcance = this.modalService.show(ModalArbolRelacionComponent, config);
        (<ModalArbolRelacionComponent>modalArbolAlcance.content).onClose.subscribe(result => {
            let objeto: RelacionCoordinador = result;
            this.datosRelacion.idAlcance = objeto.idAlcance;
            this.datosRelacion.descripcionAlcance = objeto.descripcionAlcance;
            this.datosRelacion.indicadorSinAlcance = objeto.indicadorSinAlcance;
            if(this.validarDatoAlcance) {this.validarDatoAlcance = false}
        });
    }

    OnBuscarCoordinador(){
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            class: 'modal-lg'
        };
        this.bsModalRef = this.modalService.show(AgregarDestinatarioComponents, config);
        (<AgregarDestinatarioComponents>this.bsModalRef.content).onClose.subscribe(result => {
            let datoColaborador: RutaParticipante = result;
            this.datosRelacion.idCoordinador = datoColaborador.idColaborador;
            this.datosRelacion.nombreCompletoCoordinador = String(datoColaborador.responsable);
            if(this.validarDatoCoordinador) {this.validarDatoCoordinador = false}
        });
    }

    OnGuardar(): void {
        let indicadorGrabar: boolean = true;
        this.validarDatoGerencia = (this.datosRelacion.idGerencia == 0) ? true: false;
        this.validarDatoAlcance = (this.datosRelacion.idAlcance == 0 && this.datosRelacion.descripcionAlcance == "") ? true: false;
        this.validarDatoCoordinador = (this.datosRelacion.idCoordinador == 0) ? true: false;

        if(this.validarDatoGerencia || this.validarDatoAlcance || this.validarDatoCoordinador){
            indicadorGrabar = false;
        }

        if(indicadorGrabar) {
            if(this.datosRelacion.idRelacion != 0) {
                this.service.actualizarRelacionCoordinador(this.datosRelacion).subscribe(
                    (response: Response) => {
                        
                        let respuesta = response.resultado;
                        console.log(respuesta);
                        this.OnRegresar();
                        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    },
                    (error) => this.controlarError(error)
                );
            } else {
                this.service.guardarRelacionCoordinador(this.datosRelacion).subscribe(
                    (response: Response) => {
                        
                        let respuesta = response.resultado;
                        console.log(respuesta);
                        this.OnRegresar();
                        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    },
                    (error) => this.controlarError(error)
                );
            }
        } else {
            this.toastr.error('Faltan completar los datos requeridos.', 'Acción fallida!', {closeButton: true});
        }
    }

    OnHabilitarDocumentoDigital(){
        if(this.documentoCheck){
            this.documentoCheck = false;
            this.datosRelacion.indicadorDocumento = 0;
        } else {
            this.documentoCheck = true;
            this.datosRelacion.indicadorDocumento = 1;
        }
    }

    OnRegresar() {
        this.OnRemoverValoresSesion();
        this.router.navigate([`documento/relacioncoordinador`]);
    }

    OnRemoverValoresSesion(){
        localStorage.removeItem("objetoRelacion");
        localStorage.removeItem("nuevo");
        localStorage.removeItem("nodosJerarquiaGerencia");
        localStorage.removeItem("nodosJerarquiaAlcance");
    }

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
}
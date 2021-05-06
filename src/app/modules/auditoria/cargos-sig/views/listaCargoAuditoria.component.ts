import { Component, OnInit, Inject, NgModule, SecurityContext } from '@angular/core';
import { Router } from '@angular/router';
import { BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { NgxSpinnerService } from 'ngx-spinner';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { Paginacion } from 'src/app/models/paginacion';
import { ConsultaCargosSiService } from 'src/app/services/auditoriacargossig.service';

@Component({
    selector: 'app-listaCargoAuditoria',
    templateUrl: 'listaCargoAuditoria.template.html',
    styleUrls: ['listaCargoAuditoria.component.scss'],
    //providers: [FichaRegistroAuditorService]
})
export class ListaCargoAuditoriaComponent implements OnInit {

    bsModalRef: BsModalRef;
    selectedFilter: string;
    /* datos */
    mostrarAlerta: boolean;
    itemsPagination: any[];
    /* filtros */
    textoBusqueda: string;
    mensajeAlerta: string;
    parametroBusqueda: string;
    /* paginación */
    paginacion: Paginacion;
    selectedRow: number;
    loading: boolean;
    listaBusqueda: any;

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private spinner: NgxSpinnerService,
        private servico: ConsultaCargosSiService,
        private modalService: BsModalService,
        private sanitizer: DomSanitizer
    ) {
        this.loading = false;
        this.selectedRow = -1;
        this.textoBusqueda = '';
        this.selectedFilter = 'nombre';
        this.parametroBusqueda = 'nombre';
        this.paginacion = new Paginacion({ registros: 10 });

    }
    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";

        this.getLista();
    }


    OnBuscar() {

        let texto: string = "<strong>Busqueda Por: </strong>";
        switch (this.parametroBusqueda) {
            case 'nombre':
                texto = texto + "<br/><strong>Nombres y Apellidos: </strong>" + this.textoBusqueda;
                break;
            case 'cargos':
                texto = texto + "<br/><strong>Cargo SIG: </strong>" + this.textoBusqueda;
                break;
        }
        if (this.textoBusqueda.trim() != '') {
            this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
            this.mostrarAlerta = true;
        } else {
            this.textoBusqueda = '';
            this.mostrarAlerta = false;
        }

        this.getLista();
    }

    getDocumentPage(): void {
        this.itemsPagination = [];
        let j = 0;
        if (this.listaBusqueda.length > 0) {
            if (this.listaBusqueda.length < this.paginacion.pagina * this.paginacion.registros) {
                for (let i = (this.paginacion.pagina - 1) * (this.paginacion.registros); i < this.listaBusqueda.length; i++) {
                    this.itemsPagination[j] = this.listaBusqueda[i];
                    j++;
                }
            } else {
                for (let i = (this.paginacion.pagina - 1) * (this.paginacion.registros); i < (this.paginacion.pagina) * this.paginacion.registros; i++) {
                    this.itemsPagination[j] = this.listaBusqueda[i];
                    j++;
                }
            }
        } else {

            this.itemsPagination = this.listaBusqueda;
        }
    }

    getLista() {

        const parametros: { nombrecompleto?: string, carSig?: string } = { nombrecompleto: null, carSig: null };
        switch (this.parametroBusqueda) {
            case 'nombre':
                parametros.nombrecompleto = this.textoBusqueda;
                break;
            case 'cargos':
                parametros.carSig = this.textoBusqueda;
                break;
        }
        this.spinner.show();
        this.servico.ConsultaBusquedaSig(parametros).subscribe(
            response => {
                this.spinner.hide();

                this.listaBusqueda = response.parametros.listaCargoSig;
                //Paginacion
                this.getDocumentPage();
                this.paginacion.totalRegistros = this.listaBusqueda.length;
            },
            (error) => this.controlarError(error)
        );
    }

    OnPageChanged(event): void {

        this.paginacion.pagina = event.page;
        this.getDocumentPage();

    }

    OnPageOptionChanged(event): void {

        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        this.getDocumentPage();
    }
    OnRowClick(index, obj): void {
        this.selectedRow = index;
    }

    OnModificar(obj: any): void {

        const parametros: { ficha?: string, idCargoSig?: string, indicador?: string, cargoSig?: string, sigla?: string, colaborador?: string } =
            { ficha: obj.n_Ficha, idCargoSig: obj.idCargoSig, cargoSig: obj.nombreCargoSig, sigla: obj.sigla, colaborador: obj.nombreCompleto, indicador: "1" };
        sessionStorage.setItem("itemModif", JSON.stringify(parametros));
        this.router.navigate([`/auditoria/registro-cargo-auditoria/editar/${obj}`]);
    }
    controlarError(error) {
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }


    OnEliminar(obj: any): void {

        const parametros: { idCargoSig: number, indicador?: string; cargosig?: string, sigla?: string, nroficha?: number } =
            { idCargoSig: obj.idCargoSig, indicador: "0", cargosig: obj.cargosig, sigla: obj.sigla, nroficha: obj.idColaborador };
        this.servico.GuardaConsultaSigModif(parametros).subscribe(
            response => {
                this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
                this.getLista();
            },
            (error) => this.controlarError(error)
        );
    }

    OnLimpiar() {
        this.textoBusqueda = "";
        this.mostrarAlerta = false;
        this.getLista();
    }

}

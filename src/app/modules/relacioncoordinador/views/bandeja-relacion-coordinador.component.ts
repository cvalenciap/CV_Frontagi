import { Component, OnInit, SecurityContext } from '@angular/core';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { Router } from '@angular/router';
import { Paginacion } from './../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalArbolRelacionComponent } from 'src/app/modules/relacioncoordinador/modals/arbol-relacion.component';
import { initialState } from 'ngx-bootstrap/timepicker/reducer/timepicker.reducer';
import { forkJoin } from 'rxjs';
import { RelacionCoordinadorService, ParametrosService} from './../../../services/index';
import { BandejaDocumentoService } from './../../../services/index';
import { Constante } from 'src/app/models/enums/constante';
import { ViewChild } from '@angular/core';
import { AgregarDestinatarioComponents } from 'src/app/modules/bandejadocumento/modales/agregar-destinatario.component';
import { Jerarquia } from 'src/app/models/jerarquia';
import { GeneralService} from './../../../services';
import { Estado } from 'src/app/models/enums/estado';
import { RutaParticipante } from 'src/app/models/rutaParticipante';

@Component({
    selector: 'app-bandeja-relacion-coordinador',
    templateUrl: 'bandeja-relacion-coordinador.template.html',
    providers: [RelacionCoordinadorService]
})
export class BandejaRelacionCoordinadorComponent implements OnInit {
    paginacion: Paginacion;
    selectedRow: number;
    selectedObject: RelacionCoordinador;
    loading: boolean;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    dismissible = true;
    bsModalRef: BsModalRef;
    listaRelacionCoordinador: RelacionCoordinador[];
    listaTipoJerarquia: any[];
    nodosJerarquiaGerencia: any[];
    nodosJerarquiaAlcance: any[];
    idTipoGerencia: number;
    idTipoAlcance: number;
    parametroBusqueda: string;
    idGerencia: number;
    idAlcance: number;
    idCoordinador: number;
    indicadorSinAlcance: number;
    datoSeleccionado: RelacionCoordinador;
    valorCoordinador: string = "COORDINADOR";
    
    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private service: RelacionCoordinadorService,
                private modalService: BsModalService,
                private sanitizer: DomSanitizer,
                private serviceDocumento: BandejaDocumentoService,
                private serviceParametro: ParametrosService,
                private generalService: GeneralService) {
        this.loading = false;
        this.selectedRow = -1;
        this.paginacion = new Paginacion({registros: 10});
        defineLocale('es', esLocale);
        this.localeService.use('es');
    }

    ngOnInit() {
        this.OnSetearValores();
        this.obtenerTipoJerarquia();
    }

    OnSetearValores(){
        this.parametroBusqueda = "";
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.nodosJerarquiaGerencia = [];
        this.nodosJerarquiaAlcance = [];
        this.listaTipoJerarquia = [];
        this.idTipoGerencia = 0;
        this.idTipoAlcance = 0;
        this.datoSeleccionado = new RelacionCoordinador();
    }
    
    obtenerTipoJerarquia(){
        this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
            (response: Response) => {
                this.listaTipoJerarquia = response.resultado;
                this.idTipoGerencia = this.serviceParametro.obtenerIdParametro(this.listaTipoJerarquia, Constante.TIPO_JERARQUIA_GERENCIA);
                this.idTipoAlcance = this.serviceParametro.obtenerIdParametro(this.listaTipoJerarquia, Constante.TIPO_JERARQUIA_ALCANCE);
                this.obtenerListaJerarquias();
            },
            (error) => this.controlarError(error)
        );
    }

    obtenerListaJerarquias(){
        let buscaArbolGerencia = this.service.obtenerArbolJerarquiaPorTipo(this.idTipoGerencia);
        let buscaArbolAlcance = this.service.obtenerArbolJerarquiaPorTipo(this.idTipoAlcance);

        forkJoin(buscaArbolGerencia, buscaArbolAlcance)
        .subscribe(([buscaArbolGerencia, buscaArbolAlcance]: [Response,Response])=>{
            let listaGerencia = buscaArbolGerencia.resultado;
            if(listaGerencia.length > 0){
                for(let i:number=0; listaGerencia.length > i; i++){
                    let listaPadre: any = listaGerencia[i];
                    this.nodosJerarquiaGerencia.push(listaPadre);
                }
            }

            let listaAlcance = buscaArbolAlcance.resultado;
            const itemSinAlcance: {children?: string, id?: number, idTipoDocu?: number, nombre?: string, ruta?: string} = {children: null, id: 0, idTipoDocu: null, nombre: Constante.TIPO_JERARQUIA_SIN_ALCANCE, ruta: null};
            if(listaAlcance.length > 0){
                this.nodosJerarquiaAlcance.push(itemSinAlcance);
                for(let i:number=0; listaAlcance.length > i; i++){
                    let listaPadre: any = listaAlcance[i];
                    this.nodosJerarquiaAlcance.push(listaPadre);
                }
            }
            localStorage.setItem('nodosJerarquiaGerencia', JSON.stringify(this.nodosJerarquiaGerencia));
            localStorage.setItem('nodosJerarquiaAlcance', JSON.stringify(this.nodosJerarquiaAlcance));
        },
        (error) => this.controlarError(error));
    }

    OnMostrarMensajeFiltros(){
        this.mostrarAlerta = false;
        let objetoFiltro: RelacionCoordinador = this.datoSeleccionado;
        let texto = "<strong>Búsqueda Por:</strong>"
        
        if(objetoFiltro.idGerencia != null && objetoFiltro.idGerencia != 0){
            texto = texto + "<br/><strong>Gerencia: </strong>"+ objetoFiltro.descripcionGerencia;
            this.mostrarAlerta = true;
        }
        if(objetoFiltro.idAlcance != null && objetoFiltro.descripcionAlcance != ""){
            texto = texto + "<br/><strong>Alcance: </strong>"+ objetoFiltro.descripcionAlcance;
            this.mostrarAlerta = true;
        }
        if(objetoFiltro.idCoordinador != null  && objetoFiltro.idCoordinador != 0){
            texto = texto + "<br/><strong>Colaborador: </strong>"+ objetoFiltro.nombreCompletoCoordinador;
            this.mostrarAlerta = true;
        }
        if(this.mostrarAlerta){
            this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        }
    }

    OnAbrirBusquedaModal(modal: String){
        this.datoSeleccionado = new RelacionCoordinador();
        switch(modal.toUpperCase()){
            case Constante.TIPO_JERARQUIA_GERENCIA.toUpperCase():
                this.OnBuscarGerencia();
            break;
            case Constante.TIPO_JERARQUIA_ALCANCE.toUpperCase():
                this.OnBuscarAlcance();
            break;
            default:
                this.OnBuscarCoordinador();
            break;
        }
    }

    OnLimpiar(){
        this.idGerencia=null;
        this.idAlcance=null;
        this.idCoordinador=null;
        this.indicadorSinAlcance=null;
        this.datoSeleccionado=null;
        this.mostrarAlerta=false;
        this.listaRelacionCoordinador=null;
        this.paginacion = new Paginacion({"pagina":1, "registros": 10, "totalPaginas": 0, "totalRegistros": 0});
    }

    OnBuscar(): void {
        
        this.listaRelacionCoordinador = [];
        this.loading = true;
        const parametros: any = {
            gerencia: this.idGerencia,
            alcance: this.idAlcance,
            colaborador: this.idCoordinador,
            sinAlcance: this.indicadorSinAlcance
        };
        this.service.obtenerRelacionCoordinador(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                
                let listaRelaciones: RelacionCoordinador[] = response.resultado;
                this.listaRelacionCoordinador = listaRelaciones;
                if(this.listaRelacionCoordinador.length > 0){
                    for(let i:number=0; this.listaRelacionCoordinador.length > i; i++){
                        if(this.listaRelacionCoordinador[i].indicadorDocumento == 1){
                            this.listaRelacionCoordinador[i].descripcionIndicador = Estado.ACTIVO;
                        } else {
                            this.listaRelacionCoordinador[i].descripcionIndicador = Estado.INACTIVO;
                        }
                        if(this.listaRelacionCoordinador[i].indicadorSinAlcance == 1){
                            this.listaRelacionCoordinador[i].descripcionAlcance = Constante.TIPO_JERARQUIA_SIN_ALCANCE;
                        }
                    }
                    this.listaRelacionCoordinador = this.generalService.agregarItem(response.resultado, response.paginacion);
                }
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false;
                this.OnMostrarMensajeFiltros();
                
            },
            (error) => this.controlarError(error)
        );
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
            
            let datoGerencia: RelacionCoordinador = result;
            this.datoSeleccionado = datoGerencia;
            this.idGerencia = datoGerencia.idGerencia;
            this.OnsetearFiltro(Constante.TIPO_JERARQUIA_GERENCIA);
            this.OnBuscar();
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
            
            let datoAlcance: RelacionCoordinador = result;
            this.datoSeleccionado = datoAlcance;
            this.idAlcance = datoAlcance.idAlcance;
            this.indicadorSinAlcance = datoAlcance.indicadorSinAlcance
            this.OnsetearFiltro(Constante.TIPO_JERARQUIA_ALCANCE);
            this.OnBuscar();
        });
    }

    OnBuscarCoordinador(){
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            class: 'modal-lg'
        };
        const modalColaborador = this.modalService.show(AgregarDestinatarioComponents, config);
        (<AgregarDestinatarioComponents>modalColaborador.content).onClose.subscribe(result => {
            
            let datoColaborador: RutaParticipante = result;
            this.datoSeleccionado.idCoordinador = datoColaborador.idColaborador;
            this.datoSeleccionado.nombreCompletoCoordinador = String(datoColaborador.responsable);
            this.idCoordinador = datoColaborador.idColaborador;
            this.OnsetearFiltro(this.valorCoordinador);
            this.OnBuscar();
        });
    }

    OnsetearFiltro(filtro :string){
        switch(filtro){
            case Constante.TIPO_JERARQUIA_GERENCIA:
                this.idAlcance = null;
                this.indicadorSinAlcance = null;
                this.idCoordinador = null;
                break;
            case Constante.TIPO_JERARQUIA_ALCANCE:
                if(this.indicadorSinAlcance == 0){
                    this.indicadorSinAlcance = null;
                }
                this.idGerencia = null;
                this.idCoordinador = null;
                break;
            default:
                this.idGerencia = null;
                this.idAlcance = null;
                this.indicadorSinAlcance = null;
                break;
        }
    }

    OnNuevo(){
        let nuevo: boolean = true;
        localStorage.setItem('nuevo', JSON.stringify(nuevo));
        this.router.navigate([`documento/relacioncoordinador/nuevo`]);
    }

    OnModificar(objetoSeleccionado: RelacionCoordinador): void {
        let nuevo: boolean = false;
        localStorage.setItem('nuevo', JSON.stringify(nuevo));
        localStorage.setItem('objetoRelacion', JSON.stringify(objetoSeleccionado));
        this.router.navigate([`documento/relacioncoordinador/editar/${objetoSeleccionado.idRelacion}`]);
    }

    OnEliminar(idRelacion: string){
        this.service.eliminarRelacionCoordinador(idRelacion).subscribe(
            (response: Response) => {
                this.toastr.info('Registro eliminado', 'Acción completada!', {closeButton: true});
                this.OnBuscar();
                this.loading = false;
            },
            (error) => this.controlarError(error)
        );
    }

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        this.OnBuscar();
    }

    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        this.OnBuscar();
    }

    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
    }

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
}
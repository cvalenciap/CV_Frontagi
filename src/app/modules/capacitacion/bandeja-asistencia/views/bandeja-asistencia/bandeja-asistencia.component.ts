import { Component, OnInit, SecurityContext } from '@angular/core';
import { BandejaAsistencia } from 'src/app/models/bandejaasistencia';
import { Router } from '@angular/router';
import { Paginacion } from './../../../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { BandejaAsistenciaMockService as BandejaAsistenciaService} from './../../../../../services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalBusquedaAsistenciaComponent} from '../../modales/bandeja-asistencia/modal-busqueda-asistencia/modal-busqueda-asistencia.component';
import { ModalModificarParticipantesComponent} from '../../modales/detalle-asistencia/modal-modificar-participantes/modal-modificar-participantes.component';
import { Asistencia } from 'src/app/models';
import { AsistenciaService } from 'src/app/services/impl/asistencia.service';

@Component({
    selector: 'app-bandeja-asistencia',
    templateUrl: './bandeja-asistencia.template.html',
    styleUrls: ['./bandeja-asistencia.component.scss'],
    providers: [BandejaAsistenciaService]
})
export class BandejaAsistenciaComponent implements OnInit {

    items: Asistencia[];
   /*  busquedaBandejaAsistencia: BandejaAsistencia; */

    selectedFilter: string;
    selectedRow: number;
    selectedObject: Asistencia;

    paginacion: Paginacion;
    loading: boolean;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    bsModalRef: BsModalRef;

    textoBusqueda: string;
    parametroBusqueda: string;

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private service: AsistenciaService,
        private modalService: BsModalService,
        private sanitizer: DomSanitizer) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
       /*  this.selectedFilter = 'codigoCapacitacion'; */
        this.paginacion = new Paginacion({registros: 10});
        defineLocale('es', esLocale);
        this.localeService.use('es'); 
    }
    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.getLista();
    }
    

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        this.getLista();
      }
        OnPageOptionChanged(event): void {
            this.paginacion.registros = event.rows;
            this.paginacion.pagina = 1;
            this.getLista();
        }
        OnRowClick(index, obj): void {
            this.selectedRow = index;
            this.selectedObject = obj;
            
        }
/*     OnVerDetalle(asistencia:Asistencia): void {
        sessionStorage.setItem('asistencia', JSON.stringify(asistencia));
        this.router.navigate([`capacitacion/bandejaasistencia/detalle/${asistencia.idCapacitacion}`]);
    } */


    OnVerDetalle(): void {
        //sessionStorage.setItem('asistencia', JSON.stringify(asistencia));
        this.router.navigate([`capacitacion/bandejaasistencia/detalle/00002`]);
    }

    OnBuscar(): void {
        this.paginacion.pagina = 1;
        this.getLista();
        /* this.parametroBusqueda=''; */
        this.textoBusqueda='';
    }
    getLista(){
        
        this.loading = true;
        const parametros: {codCurso?: string, nomCurso?: string} = {codCurso: null, nomCurso:null};
        if(!this.parametroBusqueda){
            this.parametroBusqueda='codCurso';
        }
        switch (this.parametroBusqueda) {
            case 'codCurso':
                parametros.codCurso =  this.textoBusqueda;
                
                break;
            case 'nomCurso':
                parametros.nomCurso =this.textoBusqueda;
               
                break;
    
            
            }
            
            this.items=[];
        this.service.buscarPorAsistencia(parametros,this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false; },
            (error) => this.controlarError(error)
        );
    }

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

   /*  OnBuscar(): void {
        let texto:string = "<strong>Busqueda Por: </strong>";
        console.log(this.selectedFilter);
        
        switch (this.selectedFilter) {
            
            case 'codigoCapacitacion':
                texto = texto + "<br/><strong>Código de Capacitación: </strong>"+this.textoBusqueda;
                break;
            case 'capacitacion':
                texto = texto + "<br/><strong>Capacitación: </strong>"+this.textoBusqueda;
                break;
            case 'codigoSesion':
                texto = texto + "<br/><strong>Código de Sesión: </strong>"+this.textoBusqueda;
                break;
            case 'sesion':
                texto = texto + "<br/><strong>Sesión: </strong>"+this.textoBusqueda;
                break;
            case 'avanzada':
                if(this.busquedaBandejaAsistencia.codigoCapacitacion != ""){
                    texto = texto + "<br/><strong>Código de Capacitación: </strong>"+this.busquedaBandejaAsistencia.codigoCapacitacion+" ";
                }
                if(this.busquedaBandejaAsistencia.capacitacion != ""){
                    texto = texto + "<br/><strong>Capacitación: </strong>"+ this.busquedaBandejaAsistencia.capacitacion+" ";
                }
                if(this.busquedaBandejaAsistencia.codigoSesion != ""){
                    texto = texto + "<br/><strong>Código de Sesión: </strong>"+ this.busquedaBandejaAsistencia.codigoSesion+" ";
                }
                if(this.busquedaBandejaAsistencia.sesion != ""){
                    texto = texto + "<br/><strong>Sesión: </strong>"+ this.busquedaBandejaAsistencia.sesion+" ";
                }
                break;
    
        }
        this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        this.mostrarAlerta = true;
        this.paginacion.pagina = 1;
        this.getLista();
    } */

  /*   abrirBusqueda(){
        this.selectedFilter = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                hola:"adios"
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalBusquedaAsistenciaComponent, config);
        (<ModalBusquedaAsistenciaComponent>this.bsModalRef.content).onClose.subscribe(result => {
            this.busquedaBandejaAsistencia = result;
            console.log(this.busquedaBandejaAsistencia);
            this.OnBuscar();
        });
    } */
}
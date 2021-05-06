import { Component, OnInit, SecurityContext } from '@angular/core';
import { BandejaAsistencia } from 'src/app/models/bandejaasistencia';
import { Router } from '@angular/router';
import { Paginacion } from './../../../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ProgramarCapacitacionMockService as ProgramarCapacitacionService} from './../../../../../services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { ProgramarCapacitacion } from 'src/app/models/programarcapacitacion';
import { ModalBusquedaCapacitacionComponent} from '../../modales/bandeja-programacion/modal-busqueda-capacitacion/modal-busqueda-capacitacion.component';
import { CapacitacionService } from 'src/app/services/impl/capacitacion.service';
import { GeneralService } from 'src/app/services/impl/general.service';

@Component({
    selector: 'app-programar-capacitacion',
    templateUrl: './programar-capacitacion.template.html',
    styleUrls: ['./programar-capacitacion.component.scss'],
    providers: [ProgramarCapacitacionService]
})
export class ProgramarCapacitacionComponent implements OnInit {

    ngOnInit() {

        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.listarCapacitaciones();
        
       
        // this.getLista();
    }

    items: ProgramarCapacitacion[];
    busquedaProgramarCapacitacion: ProgramarCapacitacion;
    selectedRow: number;
    selectedObject: ProgramarCapacitacion;
    progCap : ProgramarCapacitacion;
    paginacion: Paginacion;
    loading: boolean;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    bsModalRef: BsModalRef;

    textoBusqueda: string;
    parametroBusqueda: string;
    capacitacion: string;
    instructor: string;
    estadoCapacitacion: string;
    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private service: ProgramarCapacitacionService,
                private servicio: CapacitacionService,
                private modalService: BsModalService,
                private generalService: GeneralService,
                private sanitizer: DomSanitizer) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
        this.parametroBusqueda = 'codigo';
        this.paginacion = new Paginacion({registros: 10});
        defineLocale('es', esLocale);
        this.localeService.use('es'); 
        this.progCap = new ProgramarCapacitacion;
    }
    
    getLista(): void {
        this.loading = true;
        this.service.buscarCapacitacion(this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false; },
            (error) => this.controlarError(error)
        );
    }

    OnPageChanged(event): void {
        
        this.paginacion.pagina = event.page;
        this.listarCapacitaciones();
    }

    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        this.listarCapacitaciones();
    }

    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
    }

    setParametroBusqueda(filter: string) {
        this.parametroBusqueda = filter;
        console.log(this.parametroBusqueda);
    }

    OnBuscar(): void {
        let texto:string = "<strong>Busqueda Por: </strong>";
        console.log(this.parametroBusqueda);
        
        switch (this.parametroBusqueda) {
            
            case 'capacitacion':
                texto = texto + "<br/><strong>Capacitación: </strong>"+this.textoBusqueda;
                break;
            case 'instructor': 
                texto = texto + "<br/><strong>Instructor: </strong>"+this.textoBusqueda;
                break;
            case 'anioPlanificacion': 
                texto = texto + "<br/><strong>Año Planificación: </strong>"+this.textoBusqueda;
                break;
            case 'estado': 
                texto = texto + "<br/><strong>Estado: </strong>"+this.textoBusqueda;
                break;
            case 'avanzada':
                if(this.busquedaProgramarCapacitacion.capacitacion != ""){
                    texto = texto + "<br/><strong>Capacitación: </strong>"+this.busquedaProgramarCapacitacion.capacitacion+" ";
                }
                if((this.busquedaProgramarCapacitacion.fechaInicio != undefined && this.busquedaProgramarCapacitacion.fechaInicio != null) &&
                    (this.busquedaProgramarCapacitacion.fechaFin != undefined && this.busquedaProgramarCapacitacion.fechaFin != null)){
                    texto = texto + "<br/><strong>Fecha Inicio: </strong>"+ this.busquedaProgramarCapacitacion.fechaInicio.getFullYear;
                    texto = texto + "<br/><strong>Fecha Fin: </strong>"+ this.busquedaProgramarCapacitacion.fechaFin.getFullYear;
                }
                if(this.busquedaProgramarCapacitacion.instructor != ""){
                    texto = texto + "<br/><strong>Instructor: </strong>"+this.busquedaProgramarCapacitacion.instructor+" ";
                }
                if(this.busquedaProgramarCapacitacion.anioPlanificacion != ""){
                    texto = texto + "<br/><strong>Año Planificado: </strong>"+this.busquedaProgramarCapacitacion.anioPlanificacion+" ";
                }
                if(this.busquedaProgramarCapacitacion.estado != ""){
                    texto = texto + "<br/><strong>Estado: </strong>"+this.busquedaProgramarCapacitacion.estado+" ";
                }
                break;
        }
        this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
        this.mostrarAlerta = true;
        this.paginacion.pagina = 1;
        this.getLista();
    }

    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    abrirBusqueda(){
        this.parametroBusqueda = "avanzada";
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {        
            },
            class: 'modal-lg'
        }
        this.bsModalRef = this.modalService.show(ModalBusquedaCapacitacionComponent, config);
        (<ModalBusquedaCapacitacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
            this.busquedaProgramarCapacitacion = result;
            console.log(this.busquedaProgramarCapacitacion);
            this.OnBuscar();
        });
    }

    /*
    OnModificar(): void {
        this.router.navigate([`mantenimiento/aulas/editar/${this.selectedObject.codigo}`]);
    }

    onEliminar():void{
        console.log(this.parametroBusqueda);
        this.service.eliminar(this.selectedObject).subscribe(
            (response: Response) => {
                console.log(this.paginacion.totalPaginas.toString());
                this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
                this.getLista();
                this.loading = false;

            },
            (error) => this.controlarError(error)
        );
    }
    */

    listarCapacitaciones(){
        this.loading = true;
        const parametros: {
            capacitacion?: string, 
            instructor?: string,
            pagina?:
             string,
            registros?: string
        } = 
        {   capacitacion: this.capacitacion, 
            instructor: this.instructor,
            pagina: this.paginacion.pagina + '',
            registros: this.paginacion.registros + ''
        };
        switch (this.parametroBusqueda) {
            case 'capacitacion':
                parametros.capacitacion = this.textoBusqueda;
                break;
            case 'instructor':
                parametros.instructor = this.textoBusqueda;
                break;
        }
        
        this.items=[]
        this.servicio.buscarCapacitacion(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
             
                if(this.items.length>0){
                    this.items = this.generalService.agregarItem(response.resultado,response.paginacion);
                   
                }
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false; },
            (error) => this.controlarError(error)
        );
    }

    editarCapacitacion(capacitacion: ProgramarCapacitacion): void {
        
        console.log("Actualizar");
        sessionStorage.setItem('capacitacion', JSON.stringify(capacitacion));
        this.router.navigate([`capacitacion/programarcapacitacion/editar/${capacitacion.idCapacitacion}`]);
    }

    eliminarCapacitacion(itemSeleccionado: ProgramarCapacitacion){
        console.log("Eliminar");
        if(itemSeleccionado.estadoCapacitacion == "R"){
            this.servicio.eliminarCapacitacion(itemSeleccionado).subscribe(
                (response : Response) => {
                    this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
                    this.listarCapacitaciones();
                    this.selectedRow = -1;
                    this.selectedObject = null;
                    this.loading = false;
                }
                
            );
        }


    }

    exportar(){
        console.log("Exportar");
    }

}

import { Component, OnInit, SecurityContext } from '@angular/core';
import { BandejaAsistencia } from 'src/app/models/bandejaasistencia';
import { Router, ActivatedRoute } from '@angular/router';
import { Paginacion } from './../../../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { BandejaAsistenciaMockService as BandejaAsistenciaService} from './../../../../../services/index';
import { DomSanitizer } from '@angular/platform-browser';
import { DetalleAsistencia } from 'src/app/models/detalleasistencia';
import { ModalModificarParticipantesComponent } from '../../modales/detalle-asistencia/modal-modificar-participantes/modal-modificar-participantes.component';
import { Asistencia } from 'src/app/models/asistencia';
import { Sesion } from 'src/app/models/sesion';

@Component({
    selector: 'app-detalle-asistencia',
    templateUrl: './detalle-asistencia.template.html',
    styleUrls: ['./detalle-asistencia.component.scss'],
    providers: [BandejaAsistenciaService]
})
export class DetalleAsistenciaComponent implements OnInit {
    
    

    items: BandejaAsistencia[];
    busquedaDetalleAsistencia: DetalleAsistencia;
    private sub: any;
    selectedFilter: string;
    selectedRow: number;
    selectedObject: Asistencia;

    paginacion: Paginacion;
    loading: boolean;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    bsModalRef: BsModalRef;
    itemCodigo: number = 0;
    item: BandejaAsistencia;
    textoBusqueda: string;

    /** Datos **/
    deshabilitarCaja: boolean;
    valorCurso: string;
    valorSesion: string;
    /** Datos **/
    itemAsistencia:Asistencia;
    idCurso:string;
    codCurso:string;
    nomCurso:string;
    idCapacitacion:number;
    itemColumna:number;
    listSesion:Sesion[];
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private service: BandejaAsistenciaService,
        private modalService: BsModalService,
        private sanitizer: DomSanitizer,
        private route: ActivatedRoute) {
        this.loading = false;
        this.selectedRow = -1;
        this.items = [];
        this.selectedFilter = 'nroFicha';
        this.paginacion = new Paginacion({registros: 10});
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.itemAsistencia= new Asistencia;
        this.idCurso="";
        this.codCurso="";
        this.nomCurso="";
        this.idCapacitacion=0;
        this.itemColumna=0;
        this.listSesion=[];
    }

    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
       /*  this.items = []; */
        
      /*   /** Datos **/
        /* this.deshabilitarCaja = true;
        this.valorCurso = "SGI-Modulo Ambiental";
        this.valorSesion = "Introducción"; */
        /** Datos **/ 
        
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigoCapacitacion'];
          });
          this.itemAsistencia = JSON.parse(sessionStorage.getItem("asistencia"));  
          if(this.itemAsistencia){
            this.idCurso=this.itemAsistencia.idCurso;
            this.codCurso=this.itemAsistencia.codCurso;
            this.nomCurso=this.itemAsistencia.nomCurso;
            this.idCapacitacion=this.itemAsistencia.idCapacitacion;
            this.listSesion=this.itemAsistencia.listSesion;
            /* this.paginacion = new Paginacion(this.listSesion.paginacion); */
            for(let valor of this.listSesion){
               valor.nomCurso=this.nomCurso;
               /*  valor.listEmpleado=this.itemAsistencia.listTrabajador; */
                valor.idCapacitacion=this.itemAsistencia.idCapacitacion;
                this.listSesion=this.listSesion.filter(x=>x=valor);
            }
            this.itemColumna=0;
            
            for(let ind of this.listSesion){
               
                if(this.itemColumna>0){
                    ind.itemColumna=0;
                    ind.itemColumna=this.itemColumna+1;
                    this.itemColumna=ind.itemColumna;
                }else{
                    ind.itemColumna=ind.itemColumna+1;
                    this.itemColumna=ind.itemColumna;
                }
            }
          }
    }

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        this.listSesion;
      }
        OnPageOptionChanged(event): void {
            this.paginacion.registros = event.rows;
            this.paginacion.pagina = 1;
            this.listSesion;
        }
        OnRowClick(index, obj): void {
            this.selectedRow = index;
            this.selectedObject = obj;
            
        }

/*     OnVerDetalle(sesion:Sesion): void {
        sessionStorage.setItem('sesion', JSON.stringify(sesion));
        this.router.navigate([`capacitacion/bandejaasistencia/detalle/sesion/${sesion.idSesion}`]);
    } */

    OnVerDetalle(): void {
        //sessionStorage.setItem('sesion', JSON.stringify(sesion));
        this.router.navigate([`capacitacion/bandejaasistencia/detalle/sesion/1`]);
    }

    cancelar(){
        this.router.navigate(['capacitacion/bandejaasistencia']); 
     }
    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    setFilter(filter: string) {
        this.selectedFilter = filter;
        console.log(this.selectedFilter);
    }

    OnRegresar() {
        this.router.navigate([`capacitacion/bandejaasistencia`]);
    }
}
import { Component, OnInit, SecurityContext } from '@angular/core';
import { BandejaEvaluaciones } from 'src/app/models/bandejaevaluaciones';
import { Router ,ActivatedRoute} from '@angular/router';
import { Paginacion } from './../../../../../models/paginacion';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../../models/response';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import {BandejaEvaluacionesService} from './../../../../../services/impl/bandejaevaluaciones.service';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalRegistrarEvaluacionManualComponent } from 'src/app/modules/capacitacion/bandeja-evaluaciones/modales/detalle-evaluaciones/modal-registrar-evaluacion-manual/modal-registrar-evaluacion-manual.component';
import { DatePipe } from '@angular/common';
import { DetalleEvaluaciones } from 'src/app/models/detalleevaluaciones';
import { Asistencia } from 'src/app/models';
import { EmpleadoAsistencia } from 'src/app/models/empleadoAsistencia';
import { filter } from 'rxjs/internal/operators/filter';


@Component({
    selector: 'app-detalle-evaluaciones',
    templateUrl: './detalle-evaluaciones.template.html',
    styleUrls: ['./detalle-evaluaciones.component.scss'],
    providers: [BandejaEvaluacionesService]
})
export class DetalleEvaluacionesComponent implements OnInit {

   
    items: Asistencia[];
    busquedaDetalleEvaluaciones: DetalleEvaluaciones;

    selectedFilter: string;
    selectedRow: number;
    selectedObject: Asistencia;
    private sub: any;
    paginacion: Paginacion;
    loading: boolean;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    bsModalRef: BsModalRef;

    item: Asistencia;
    textoBusqueda: string;
    /** Datos **/
    deshabilitarCaja:boolean;
    valorCurso:string;
    /** Datos **/
    itemCodigo: number = 0;
    itemEvaluacion:Asistencia= new Asistencia;
    listEmpleado:EmpleadoAsistencia[];
    empleadoEvaluacion:EmpleadoAsistencia = new EmpleadoAsistencia;
    asistencia:Asistencia;
    listaEvaluacion:EmpleadoAsistencia[];
    urlPDF:any;
    parametroBusqueda: string;
    empleado:EmpleadoAsistencia= new EmpleadoAsistencia;
    listaBusqueda:EmpleadoAsistencia[];
    listaAux:EmpleadoAsistencia[];
    mensajeInformacion:string;
    objetoBlob: any;
    nombreTrabajador:string;
    nomEquipo:string;
    parametros: {idCapacitacion?:string,listaEmpl?:any,nomCurso?:string,nombreTrabajador?:string,nomEquipo?:string} = {idCapacitacion:null,listaEmpl:[],nomCurso:null
    ,nombreTrabajador:null,nomEquipo:null};

    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private service: BandejaEvaluacionesService,
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
        this.listEmpleado=[];
        
    }


    ngOnInit() {
        this.listaBusqueda=[];
        this.listaAux=[];
        this.asistencia=new Asistencia;
        this.listaEvaluacion=[];
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.deshabilitarCaja = true;
        this.nombreTrabajador="";
        this.nomEquipo="";
        

        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigoCapacitacion'];
          });
          this.itemEvaluacion = JSON.parse(sessionStorage.getItem("asistencia"));
          if(this.itemEvaluacion){
            this.getLista();
            this.valorCurso=this.itemEvaluacion.nomCurso;
          /*   this.listEmpleado=this.itemEvaluacion.listTrabajador; */
            if(!this.parametroBusqueda){
                this.parametroBusqueda='nombre';
                }
          }
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

    setFilter(filter: string) {
        this.selectedFilter = filter;
        console.log(this.selectedFilter);
    }

    getLista(){
        
        this.loading = true;
        const parametros: {idCapacitacion?:string, nombreTrabajador?:string,nomEquipo?:string} = {idCapacitacion:null,
        nombreTrabajador:null, nomEquipo:null};
        parametros.idCapacitacion=String(this.itemCodigo);
        if(!this.parametroBusqueda){
            this.parametroBusqueda='nombre';
            }
           
           switch (this.parametroBusqueda) {
            case 'nombre':
            this.nombreTrabajador=null;
            parametros.nombreTrabajador=  this.textoBusqueda;
            this.nombreTrabajador=parametros.nombreTrabajador;
            break;
            case 'equipo':
            this.nomEquipo=null;
            parametros.nomEquipo =this.textoBusqueda;
           this.nomEquipo=parametros.nomEquipo;
            break;
    
           }
           this.listEmpleado=[];
        this.service.buscarEmpleado(parametros,this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                
                this.listEmpleado = response.resultado;

                for(let dat of this.listEmpleado){
                    dat.idCapacitacion=this.itemEvaluacion.idCapacitacion;
                    this.listEmpleado=this.listEmpleado.filter(x=>x=dat);
                }
        
                 for(let val of this.listEmpleado){
                    if(val.nombreArchivo!=null && val.nombreArchivo!=""){
                        /* if(val.nota==null){ */
                            val.desactivar=true
                            this.listEmpleado=this.listEmpleado.filter(x=>x=val);
                        /* } */
                        
                    }else{
                        val.desactivar=false;
                        this.listEmpleado=this.listEmpleado.filter(x=>x=val);
                    }
                 }
        
                 this.listaAux=this.listEmpleado;
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

    OnBuscar(): void {
    
        this.paginacion.pagina = 1;
        this.getLista();
        this.textoBusqueda='';
       
    }

    /* abrirModalRegistrarEvaluacionManual(trabajador:EmpleadoAsistencia){
        
        const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
           valorCurso:this.valorCurso,
           valorParticipante:trabajador.nombreTrabajador,
           valorNota:trabajador.nota,
           
          },
          class: 'modal-lx'
        }
    
        this.bsModalRef = this.modalService.show(ModalRegistrarEvaluacionManualComponent, config);
        (<ModalRegistrarEvaluacionManualComponent>this.bsModalRef.content).onClose.subscribe((empleado:EmpleadoAsistencia)=> {
         
            this.empleadoEvaluacion=empleado;
         for(let val of this.listEmpleado){
            if(val.nombreTrabajador==trabajador.nombreTrabajador){
                val.nota=this.empleadoEvaluacion.nota;
                this.listEmpleado=this.listEmpleado.filter(x=>x=val);
                break;
            }
         }
         this.listaAux=this.listEmpleado;
        });
    } */
    abrirModalRegistrarEvaluacionManual(){
        
        const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
           /* valorCurso:this.valorCurso,
           valorParticipante:trabajador.nombreTrabajador,
           valorNota:trabajador.nota, */
           
          },
          class: 'modal-lx'
        }
    
        this.bsModalRef = this.modalService.show(ModalRegistrarEvaluacionManualComponent, config);
        (<ModalRegistrarEvaluacionManualComponent>this.bsModalRef.content).onClose.subscribe((empleado:EmpleadoAsistencia)=> {
         
            this.empleadoEvaluacion=empleado;
         /* for(let val of this.listEmpleado){
            if(val.nombreTrabajador==trabajador.nombreTrabajador){
                val.nota=this.empleadoEvaluacion.nota;
                this.listEmpleado=this.listEmpleado.filter(x=>x=val);
                break;
            }
         } */
         this.listaAux=this.listEmpleado;
        });
    }

    OnRegresar() {
        this.router.navigate([`capacitacion/bandejaevaluaciones`]);
    }

    OnGuardar(){
        
        this.loading = true;
        this.listaEvaluacion=this.listEmpleado;
        for(let nat of this.listaEvaluacion){
            nat.nombreArchivo=null;
            nat.rutaDocumento=null;
            this.listaEvaluacion=this.listaEvaluacion.filter(x=>x=nat);
            
        }
        this.asistencia.listTrabajador=this.listaEvaluacion;
        this.service.actualizar(this.asistencia).subscribe(
            (response: Response) => {
                
                this.asistencia = response.resultado;
                
                this.loading = false; 
                this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                this.router.navigate([`capacitacion/bandejaevaluaciones`]);},
               
            (error) => this.controlarError(error)
        );
    }

    OnExportarPdf(visorPdfSwal1){
        
        
        this.parametros.listaEmpl=[];
        for(let val of this.listEmpleado){
            this.parametros.listaEmpl.push(val.idTrabajador);
        }
        this.parametros.nombreTrabajador=this.nombreTrabajador;
        this.parametros.nomEquipo=this.nomEquipo;
        this.parametros.nomCurso=this.valorCurso;
        let mensaje = this.mensajeInformacion;
        this.parametros.idCapacitacion=String(this.itemCodigo);
        this.service.generarPdf(this.parametros,this.paginacion.pagina, this.paginacion.registros).subscribe((data: Blob) => {
           
            let file = new Blob([data], {type: 'application/pdf'});
            this.objetoBlob = file;
            visorPdfSwal1.show();
            
        },
        (error) => this.controlarError(error)
        );
        this.toastr.info('Documento generado', 'Confirmación', {closeButton: true});
      }

}
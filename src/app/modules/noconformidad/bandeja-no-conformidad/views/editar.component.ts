import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';
import { Subject, forkJoin } from 'rxjs';
import { DatePipe } from '@angular/common';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { NoConformidad } from 'src/app/models/noconformidad';
import { NoConformidadSeguimiento } from 'src/app/models/noconformidadseguimiento';
import { ModalRegistroPlanAccionComponent } from '../modales/modal-plan-accion/modal-registro-plan-accion.component';
import { ModalEjecucionComponent } from '../modales/modal-ejecucion/modal-ejecucion.component';
import { Constante } from 'src/app/models/enums/constante';
import { NoConformidadService } from '../../../../services/impl/noconformidad.service';
import { FormatoCarga } from 'src/app/constants/general/general.constants';
import { Reprogramacion } from 'src/app/models/reprogramacion';
import { Ejecucion } from 'src/app/models/ejecucion';
import { BandejaReprogramacionService } from '../../../../services/impl/bandejareprogramacion.service';
import { GeneralService} from './../../../../services';

@Component({
    selector: 'no-conformidad-editar',
    templateUrl: 'editar.template.html',
    styleUrls: ['editar.styles.scss']
})
export class NoConformidadEditarComponent implements OnInit, OnDestroy {
    public onClose: Subject<NoConformidad>;
    items: NoConformidad;
    i:number;
    seleccionarTabPrincipal: number;
    etapaNC: number;
    bgVerde: string = '#008000';
    bgAmarillo: string = '#f1dd38';
    objBitacora:NoConformidadSeguimiento[];
    selectedRow: number;
    selectedObject: any;
    paginacionPlanAccion: Paginacion;
    paginacionEjecucion: Paginacion;
    paginacionBitacora: Paginacion;
    bsModalRef: BsModalRef;

    fechaAceptacion: Date;
    fechaAprobacionAnalisis: Date;
    fechaAprobacionPlanAccion: Date;
    fechaCumplimiento: Date;
    fechaVerificacion: Date;
    fechaCierre: Date;

    nombreArchivoAdjuntoProblema: string;
    nombreArchivoAdjuntoObservacion: string;
    nombreArchivoAdjuntoAnalisis: string;

    accesoUsuario: string;
    ocultarElemento: boolean;

    /* KEVIN */
    indicador:boolean;
    guardarProblemaObservacion:boolean;
    listaAccionPropuesta: Reprogramacion[]; //modal ejecucion
    /* KEVIN */

    mostrarProblema:boolean;
    mostrarObservacion:boolean;
    mostrarPlanAccion:boolean;
    mostrarEjecucion:boolean;
    mostrarVerificacion:boolean;
    mostrarCierre:boolean;
    mostrarBitacora:boolean;
    mostrarBotonEtapas: boolean;
    mostrarBotonRegresar:boolean;
    habilitarTabs: boolean[];

    idNoConformidad: number;
    datosNoConformidad: NoConformidad;
    objetoProblema: NoConformidad;
    objetoObservacion: NoConformidad;
    objetoVerificacion: NoConformidad;
    objetoCierre: NoConformidad;
    objNoConformidad: NoConformidad;
    objetoNoConformidad: NoConformidad;

    objetoPlanAccion: Reprogramacion[];
    objetoEjecucion: Ejecucion[];

    registroPlanAccion: Reprogramacion;
    registroEjecucion: Ejecucion;
    
    planAccion: Reprogramacion;
    ejecucion: Ejecucion;
    numeroTabSeleccionado: number;

    listaEtapasActivas: NoConformidadSeguimiento[];

    listaPlanAccionRegistro: Reprogramacion[];
    listaEjecucionRegistro: Ejecucion[];
    
    isNuevo: boolean;
    listaFinalPlanAccion: Reprogramacion[];
    listaFinalEjecucion: Ejecucion[];
    //mostrarAccionPropuesta: boolean;
    
    constructor(private modalService: BsModalService,
                private datePipe: DatePipe,
                private localeService: BsLocaleService,
                private toastr: ToastrService,
                private serviceNoConformidad: NoConformidadService,
                private servicePlanAccionEjecucion: BandejaReprogramacionService,
                private generalService: GeneralService,
                private router: Router) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.selectedRow = -1;
        this.paginacionPlanAccion = new Paginacion({registros: 10});
        this.paginacionEjecucion = new Paginacion({registros: 10});
        this.paginacionBitacora = new Paginacion({registros: 10});
        this.items = new NoConformidad();
        this.objBitacora= [];
        
        this.fechaAceptacion = new Date();
        this.fechaAprobacionAnalisis = new Date();
        this.fechaAprobacionPlanAccion = new Date();
        this.fechaCumplimiento = new Date();
        this.fechaVerificacion = new Date();
        this.fechaCierre = new Date();
        this.accesoUsuario = "";
        this.ocultarElemento = true;
        this.seleccionarTabPrincipal = 0;
        this.i=0;
        this.mostrarBotonRegresar = false;
        this.mostrarBotonEtapas = false;
        this.mostrarProblema = true;
        /* KEVIN */
        this.listaFinalPlanAccion=[];
        this.listaFinalEjecucion=[];
        this.mostrarProblema=true;
        this.guardarProblemaObservacion=true;
        this.listaAccionPropuesta=[];
        /* KEVIN */
        this.listaEtapasActivas = [];
        this.registroPlanAccion = new Reprogramacion();
        this.registroEjecucion = new Ejecucion();

        this.objetoProblema = new NoConformidad();
        this.objetoObservacion = new NoConformidad();
        this.objetoVerificacion = new NoConformidad();
        this.objetoCierre = new NoConformidad();
        this.datosNoConformidad = new NoConformidad();
        this.objetoPlanAccion = [];
        this.objetoEjecucion = [];
        this.numeroTabSeleccionado = 0;
        this.habilitarTabs=[];
        this.isNuevo = false;
        //this.mostrarAccionPropuesta = false;
    }

    ngOnInit() {
        this.listaEtapasActivas = [];
        this.objNoConformidad = JSON.parse(sessionStorage.getItem("objNoConformidad"));
        if(this.objNoConformidad){
            this.idNoConformidad = Number.parseInt(this.objNoConformidad.idNoConformidad);
        }
        this.objNoConformidad.fechaIdentificacion = this.datePipe.transform(this.objNoConformidad.fechaIdentificacion, "dd/MM/yyyy");
        this.validarUsuario();
        this.obtenerSeguimiento();
            
        this.habilitarTabs[0]=false; 
        this.habilitarTabs[1]=true; 
        this.habilitarTabs[2]=true; 
        this.habilitarTabs[3]=true;                       
        this.habilitarTabs[4]=true;     
        this.habilitarTabs[5]=true;       
    }
    
    reiniciarValorBoton(){
        this.mostrarProblema = false;
        this.mostrarObservacion = false;
        this.mostrarPlanAccion = false;
        this.mostrarEjecucion = false;
        this.mostrarVerificacion = false;
        this.mostrarCierre = false;
        this.mostrarBitacora = false;
    }

    obtenerTabPrincipal(valorTabSeleccionado){
        if(valorTabSeleccionado >= 0){
            if(valorTabSeleccionado == 0){
                this.mostrarBotonEtapas = false;
                this.mostrarBotonRegresar = true;
            } else {
                this.mostrarBotonRegresar = false;
                this.mostrarBotonEtapas = true;
                if(this.etapaNC == 1){
                    if(this.mostrarProblema){
                        this.obtenerTabEtapas(this.etapaNC-1);
                    }
                }
            }
        }
    }

    obtenerTabEtapas(valorTabSeleccionado) {
        this.numeroTabSeleccionado = valorTabSeleccionado;
        if(this.numeroTabSeleccionado >= 0){
            this.reiniciarValorBoton();
            switch (this.numeroTabSeleccionado) {
                case 0:
                    this.mostrarProblema = true;
                    break;
                case 1:
                    this.mostrarObservacion = true;
                    break;
                case 2:
                    this.mostrarPlanAccion = true;
                    break;
                case 3:
                    this.mostrarEjecucion = true;
                    break;
                case 4:
                    this.mostrarVerificacion = true;
                    break;
                case 5:
                    this.mostrarCierre = true;
                    break;
                case 6:
                    this.mostrarBitacora = true;
                    break;
            }
        }
    }

    /* KEVIN */
    OnIniciarProceso(){
        this.etapaNC=2;
        this.OnRegistrarSeguimiento();
        this.OnGuardar();
        this.obtenerSeguimiento();
        this.mostrarProblema=false;
        this.guardarProblemaObservacion=false;
    }

    OnRechazar(){
        this.etapaNC=this.etapaNC-1;
        this.OnRegistrarSeguimiento();
        this.OnRegresar();     
    }

    OnAprobar(){
        if( this.accesoUsuario=='0'){
            this.OnRegistrarSeguimiento();
            if(this.numeroTabSeleccionado == 3 || this.numeroTabSeleccionado == 4){
                //this.OnGuardarPlanAccionEjecucion();
            } else {
                this.OnGuardar();
            }
            this.obtenerSeguimiento();
            this.OnRegresar();
        }else{
            this.etapaNC=this.etapaNC+1;
            this.OnRegistrarSeguimiento();
            this.OnRegresar();
        }
    }
    
    OnRegistrarSeguimiento(){
        this.objetoNoConformidad = new NoConformidad();       
        switch(this.etapaNC){
            case 1:
                this.objetoNoConformidad.idEtapa="253";
                this.objetoNoConformidad.idNoConformidad=""+this.idNoConformidad;
                this.indicador=false;
                this.serviceNoConformidad.guardarNoConformidadSeguimiento(this.objetoNoConformidad).subscribe(
                    (response: Response) => {
                        this.objetoNoConformidad = response.resultado;               
                    },
                    (error) => this.controlarError(error)
                );                          
                break;           
            case 2:
                this.objetoNoConformidad.idEtapa="254";
                this.objetoNoConformidad.idNoConformidad=""+this.idNoConformidad;
                this.indicador=false;
                this.serviceNoConformidad.guardarNoConformidadSeguimiento(this.objetoNoConformidad).subscribe(
                    (response: Response) => {
                        this.objetoNoConformidad = response.resultado;               
                    },
                    (error) => this.controlarError(error)
                );       
                break;
            case 3:
                this.objetoNoConformidad.idEtapa="256";
                this.objetoNoConformidad.idNoConformidad=""+this.idNoConformidad;
                this.indicador=false;
                this.serviceNoConformidad.guardarNoConformidadSeguimiento(this.objetoNoConformidad).subscribe(
                    (response: Response) => {
                        this.objetoNoConformidad = response.resultado;               
                    },
                    (error) => this.controlarError(error)
                );       
                break;
            case 4:
                this.objetoNoConformidad.idEtapa="257";
                this.objetoNoConformidad.idNoConformidad=""+this.idNoConformidad;
                this.indicador=false;
                this.serviceNoConformidad.guardarNoConformidadSeguimiento(this.objetoNoConformidad).subscribe(
                    (response: Response) => {
                        this.objetoNoConformidad = response.resultado;               
                    },
                    (error) => this.controlarError(error)
                );       
                break;
            case 5:
                this.objetoNoConformidad.idEtapa="258";
                this.objetoNoConformidad.idNoConformidad=""+this.idNoConformidad;
                this.indicador=false;
                this.serviceNoConformidad.guardarNoConformidadSeguimiento(this.objetoNoConformidad).subscribe(
                    (response: Response) => {
                        this.objetoNoConformidad = response.resultado;               
                    },
                    (error) => this.controlarError(error)
                );       
                break;
            case 6:
                this.objetoNoConformidad.idEtapa="259";
                this.objetoNoConformidad.idNoConformidad=""+this.idNoConformidad;
                this.indicador=false;
                this.serviceNoConformidad.guardarNoConformidadSeguimiento(this.objetoNoConformidad).subscribe(
                    (response: Response) => {
                        this.objetoNoConformidad = response.resultado;               
                    },
                    (error) => this.controlarError(error)
                );       
                break;
            default:
            this.objetoNoConformidad.idEtapa="253";
            this.objetoNoConformidad.idNoConformidad=""+this.idNoConformidad;
            this.indicador=true;            
            this.serviceNoConformidad.guardarNoConformidadSeguimiento(this.objetoNoConformidad).subscribe(
                (response: Response) => {
                    this.objetoNoConformidad = response.resultado;               
                },
                (error) => this.controlarError(error)
            );                          
            break;           
        };              
    }
    /* KEVIN */
    
    OnGuardar(){
        
        this.objetoNoConformidad = new NoConformidad();
        if(this.numeroTabSeleccionado >= 0){
            switch(this.numeroTabSeleccionado){
                case 0:
                    this.objetoNoConformidad = this.objetoProblema;
                    break;
                case 1:
                    if(this.ocultarElemento){
                        this.objetoNoConformidad.descripcionAccionInmediata = this.objetoObservacion.descripcionAccionInmediata;
                        this.objetoNoConformidad.descripcionObservacion = this.objetoObservacion.descripcionObservacion;
                        this.objetoNoConformidad.descripcionAnalisisCausa = this.objetoObservacion.descripcionAnalisisCausa;
                    } else {
                        this.objetoNoConformidad.criticaAccionInmediata = this.objetoObservacion.criticaAccionInmediata;
                        this.objetoNoConformidad.criticaAnalisisCausa = this.objetoObservacion.criticaAnalisisCausa;
                    }
                    break;
                case 4:
                    this.objetoNoConformidad = this.objetoVerificacion;
                    break;
                case 5:
                    this.objetoNoConformidad = this.objetoCierre;
                    break;
            }
            this.objetoNoConformidad.idNoConformidad = this.datosNoConformidad.idNoConformidad;
            this.objetoNoConformidad.numeroTab = this.numeroTabSeleccionado;
            if(this.ocultarElemento){
                this.objetoNoConformidad.indicadorUsuario = 0;
            } else {
                this.objetoNoConformidad.indicadorUsuario = 1;
            }
            this.serviceNoConformidad.guardarNoConformidadPorEtapas(this.objetoNoConformidad).subscribe(
                (response: Response) => {
                    
                    this.objetoNoConformidad = response.resultado;
                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                },
                (error) => this.controlarError(error)
            );
        }
    }

    OnGuardarPlanAccionEjecucion(){
        
        this.listaPlanAccionRegistro = [];
        this.listaEjecucionRegistro = [];
        if(this.numeroTabSeleccionado == 2){
            let listaFinal: Reprogramacion[] = this.listaFinalPlanAccion;
            let listaObjeto: Reprogramacion[] = this.objetoPlanAccion;
            let listaTemporal: Reprogramacion[] = listaFinal;
            
            if(listaFinal.length==0){
                for(let i:number=0; listaObjeto.length > i; i++){
                    listaTemporal.push(listaObjeto[i]);
                }
            } else {
                for(let i:number=0; listaObjeto.length > i; i++){
                    if(listaObjeto[i].idPlanAccion==0){
                        listaTemporal.push(listaObjeto[i]);
                    }
                 }
                if(listaObjeto.length > 0){
                    for(let j:number=0; listaObjeto.length > j; j++){
                        for(let i:number=0; listaFinal.length > i; i++){
                            if(listaObjeto[j] == listaFinal[i] && listaFinal[i].idPlanAccion!=0 && listaFinal[i].estadoRegistro!="2"){
                                listaTemporal.splice(i,1);
                            }
                        }
                    }
                }
            }
            this.listaPlanAccionRegistro = listaTemporal;
            this.serviceNoConformidad.guardarPlanAccion(this.idNoConformidad, this.listaPlanAccionRegistro).subscribe(
                (response: Response) => {
                    
                    let objeto: Reprogramacion = response.resultado;
                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    this.listaFinalPlanAccion=[];
                    this.objetoPlanAccion=[];
                    this.obtenerPlanAccion(); 
                },
                (error) => this.controlarError(error)
            ); 
                         
        } else if(this.numeroTabSeleccionado == 3){
            let listaFinal: Ejecucion[] = this.listaFinalEjecucion;
            let listaObjeto: Ejecucion[] = this.objetoEjecucion;
            let listaTemp: Ejecucion[] = listaFinal;

            if(listaFinal.length==0){
                for(let i:number=0; listaObjeto.length > i; i++){
                    listaTemp.push(listaObjeto[i]);                    
                }
            }else{
                for(let i:number=0; listaObjeto.length > i; i++){
                    if(listaObjeto[i].idEjecucion==0){
                        listaTemp.push(listaObjeto[i]);
                    }
                }
                if(listaObjeto.length > 0){
                    for(let j:number=0; listaObjeto.length > j; j++){
                        for(let i:number=0; listaFinal.length > i; i++){
                            if(listaObjeto[j] == listaFinal[i] && listaFinal[i].idEjecucion!=0 && listaFinal[i].estadoRegistro!="2"){
                                listaTemp.splice(i,1);
                            }
                        }
                    }
                }
            }
            this.listaEjecucionRegistro = listaTemp;
            this.serviceNoConformidad.guardarEjecucion(this.idNoConformidad, this.listaEjecucionRegistro).subscribe(
                (response: Response) => {
                    
                    let objeto: Reprogramacion = response.resultado;
                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    this.listaFinalEjecucion=[];
                    this.objetoEjecucion=[];
                    this.obtenerEjecucion();         
                },
                (error) => this.controlarError(error)
            );
        }
    }
    
    obtenerDatosNoConformidad(){
        this.serviceNoConformidad.buscarNoConformidadDatos(this.objNoConformidad.idNoConformidad).subscribe(
            (response: Response) => {
                this.datosNoConformidad = response.resultado;
                if(this.listaEtapasActivas.length >= 0){
                    this.listaEtapasActivas.forEach(obj => {
                        switch(obj.ordenEtapa){
                            case "1":
                                this.objetoProblema.descripcionIdentifProblema = this.datosNoConformidad.descripcionIdentifProblema;
                                break;
                            case "2":
                                this.objetoObservacion.descripcionAccionInmediata = this.datosNoConformidad.descripcionAccionInmediata;
                                this.objetoObservacion.criticaAccionInmediata = this.datosNoConformidad.criticaAccionInmediata;
                                this.objetoObservacion.descripcionObservacion = this.datosNoConformidad.descripcionObservacion;
                                this.objetoObservacion.descripcionAnalisisCausa = this.datosNoConformidad.descripcionAnalisisCausa;
                                this.objetoObservacion.criticaAnalisisCausa = this.datosNoConformidad.criticaAnalisisCausa;
                                break;
                            case "3":
                                this.obtenerPlanAccion();
                                break;
                            case "4":
                                this.obtenerEjecucion();
                                break;
                            case "5":
                                this.objetoVerificacion.comentarioVerificacion = this.datosNoConformidad.comentarioVerificacion;
                                break;
                            case "6":
                                this.objetoCierre.comentarioCierre = this.datosNoConformidad.comentarioCierre;
                                break;
                        }
                    });
                }
            },
            (error) => this.controlarError(error)
        )
    }
    
    obtenerPlanAccion(){
        this.servicePlanAccionEjecucion.buscarDetallePlanAccion(this.idNoConformidad, this.paginacionPlanAccion.pagina, this.paginacionPlanAccion.registros).subscribe(
            (response: Response) => {
                let listaPlanAccion: Reprogramacion[] = response.resultado;
                for(let i:number=0; listaPlanAccion.length > i; i++){
                    listaPlanAccion[i].fechaCumplimiento=new Date(listaPlanAccion[i].fechaCumplimiento);
                }
                this.objetoPlanAccion = listaPlanAccion;                    
                for(let i:number=0; listaPlanAccion.length > i; i++){
                    this.listaFinalPlanAccion.push(listaPlanAccion[i]);
                }
                if(this.objetoPlanAccion.length>0){
                    this.objetoPlanAccion = this.generalService.agregarItem(response.resultado,response.paginacion);
                }
                this.paginacionPlanAccion = new Paginacion(response.paginacion);
            },
            (error) => this.controlarError(error)
        )
    }

    obtenerEjecucion(){
        
        this.servicePlanAccionEjecucion.buscarDetalleEjecucion(this.idNoConformidad, this.paginacionEjecucion.pagina, this.paginacionEjecucion.registros).subscribe(
            (response: Response) => {
                
                let listaEjecucion: Ejecucion[] = response.resultado;
                for(let i:number=0; listaEjecucion.length > i; i++){
                    if(listaEjecucion[i].idEjecucion > 0){
                        listaEjecucion[i].fechaCumplimiento=new Date(listaEjecucion[i].fechaCumplimiento);
                        listaEjecucion[i].fechaEjecucion= new Date(listaEjecucion[i].fechaEjecucion);
                    } else {
                        listaEjecucion[i].fechaCumplimiento=new Date();
                        listaEjecucion[i].fechaEjecucion=new Date();
                    }
                }
                let correlativoPlanAccion = 0;
                let correlativoEjecucion = 0;
                let correlativoFinalPA = 0;
                let correlativoFinalE = 0;
                
                for(let i:number=0; listaEjecucion.length > i; i++){
                    if(listaEjecucion[i].idPlanAccion > 0){
                        for(let j:number=0; listaEjecucion.length > j; j++){
                            if(listaEjecucion[j].idPlanAccion == listaEjecucion[i].idPlanAccion){
                                correlativoEjecucion = correlativoEjecucion + 1;
                            }
                        }
                    }
                    listaEjecucion[i].numeral = correlativoPlanAccion + "." + correlativoEjecucion;
                }

                this.objetoEjecucion = listaEjecucion;
                for(let i:number=0; listaEjecucion.length > i; i++){
                    this.listaFinalEjecucion.push(listaEjecucion[i]);
                }
                if(this.objetoEjecucion.length>0){
                    this.objetoEjecucion = this.generalService.agregarItem(response.resultado,response.paginacion);
                }
                this.paginacionEjecucion = new Paginacion(response.paginacion);
            },
            (error) => this.controlarError(error)
        )
    }

    OnRegistrar(){
        let indice = 0;
        this.isNuevo = true;
        if(this.mostrarPlanAccion){
            this.planAccion = new Reprogramacion();
            this.planAccion.fechaCumplimiento = new Date();
            this.planAccion.descripcionResponsable = "Julio Moyano";
            this.OnRegistrarPlanAccion(indice, this.planAccion);
        } else {
            //this.mostrarAccionPropuesta = true;
            this.ejecucion = new Ejecucion();
            this.ejecucion.fechaCumplimiento = new Date();
            this.ejecucion.fechaEjecucion = new Date();
            this.ejecucion.descripcionResponsable = "Julio Moyano";
            this.OnRegistrarEjecucion(indice, this.ejecucion);
        }
    }

    OnEliminarPlanAccion(indice: number, item: Reprogramacion): void {
        if(item.idPlanAccion != 0){ //solo si es de BD
            for(let i:number=0; this.listaFinalPlanAccion.length > i; i++){
                if(item.idPlanAccion == this.listaFinalPlanAccion[i].idPlanAccion){
                    this.listaFinalPlanAccion[i].estadoRegistro = "0";
                    break;
                }
            }
            this.objetoPlanAccion.splice(indice,1);
        } else {
            this.objetoPlanAccion.splice(indice,1);
        }
        this.toastr.info('Registro eliminado', 'Acción completada!', {closeButton: true});
    }

    OnRegistrarPlanAccion(indice: number, planAccionSeleccionado: Reprogramacion): void {
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title: "Registro Plan de Acción",
                registroPlanAccion: Object.assign({},planAccionSeleccionado)
            },
            class: 'modal-lx'
        }
        const modalPlanAccion = this.modalService.show(ModalRegistroPlanAccionComponent, config);
        (<ModalRegistroPlanAccionComponent>modalPlanAccion.content).onClose.subscribe(result => {
            
            let listaRegistrarPlanAccion:Reprogramacion = result;
            if(this.isNuevo){
                this.objetoPlanAccion.push(listaRegistrarPlanAccion);
                if(this.objetoPlanAccion.length>0){
                    this.objetoPlanAccion = this.generalService.agregarItem(this.objetoPlanAccion,this.paginacionPlanAccion);
                }
                this.isNuevo = false;
            } else {
                this.objetoPlanAccion[indice] = listaRegistrarPlanAccion;
                if(listaRegistrarPlanAccion.idPlanAccion != 0){
                    for(let i:number=0; this.listaFinalPlanAccion.length > i; i++){
                        if(this.listaFinalPlanAccion[i].idPlanAccion == listaRegistrarPlanAccion.idPlanAccion){
                            this.listaFinalPlanAccion[i] = listaRegistrarPlanAccion;
                            break;
                        }
                    }
                }
            }
        });
    }

    OnRegistrarEjecucion(indice: number, ejecucionSeleccionado: Ejecucion): void {
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                title: "Registro Acción Ejecutada",
                registroEjecucion: Object.assign({},ejecucionSeleccionado),
                objetoEjecucion: this.objetoEjecucion
            },
            class: 'modal-lg'
        }
        const modalEjecucion = this.modalService.show(ModalEjecucionComponent, config);
        (<ModalEjecucionComponent>modalEjecucion.content).onClose.subscribe(result => {
            
            let listaRegistrarEjecucion:Ejecucion = result;
            if(this.isNuevo){
                this.objetoEjecucion.push(listaRegistrarEjecucion);
                if(this.objetoEjecucion.length>0){
                    this.objetoEjecucion = this.generalService.agregarItem(this.objetoEjecucion,this.paginacionEjecucion);
                }
                this.isNuevo = false;
            } else {
                this.objetoEjecucion[indice] = listaRegistrarEjecucion;
                if(listaRegistrarEjecucion.idEjecucion != 0){
                    for(let i:number=0; this.listaFinalEjecucion.length > i; i++){
                        if(this.listaFinalEjecucion[i].idEjecucion == listaRegistrarEjecucion.idEjecucion){
                            this.listaFinalEjecucion[i] = listaRegistrarEjecucion;
                            break;
                        }
                    }
                }
            }
        });
    }
    
    obtenerSeguimiento(){
        if (this.objNoConformidad) {
            this.serviceNoConformidad.buscarNoConformidadSeguimiento(this.objNoConformidad.idNoConformidad,this.paginacionBitacora.pagina,this.paginacionBitacora.registros).subscribe(
                (response: Response) => {
                    if (response.resultado.length != 0) {
                        this.listaEtapasActivas = response.resultado;
                        response.resultado.forEach(obj => {
                            switch (obj.ordenEtapa) {
                                case "1":
                                    this.objBitacora[this.i]=obj;
                                    this.i=this.i+1;
                                    this.etapaNC = 1;
                                    this.indicador=false;
                                    this.guardarProblemaObservacion=true;
                                    this.mostrarProblema=true;
                                    this.habilitarTabs[0]=false; 
                                    this.habilitarTabs[1]=true; 
                                    this.habilitarTabs[2]=true; 
                                    this.habilitarTabs[3]=true;                       
                                    this.habilitarTabs[4]=true; 
                                    this.habilitarTabs[5]=true;
                                    break;
                                case "2":
                                    this.objBitacora[this.i]=obj;
                                    this.i=this.i+1;
                                    this.etapaNC = 2;
                                    this.indicador=false;
                                    this.guardarProblemaObservacion=true;
                                    this.mostrarProblema=false;
                                    this.habilitarTabs[0]=false; 
                                    this.habilitarTabs[1]=false; 
                                    this.habilitarTabs[2]=true; 
                                    this.habilitarTabs[3]=true;                       
                                    this.habilitarTabs[4]=true; 
                                    this.habilitarTabs[5]=true;
                                    break;
                                case "3":
                                    this.objBitacora[this.i]=obj;
                                    this.i=this.i+1;
                                    this.etapaNC = 3;
                                    this.indicador=false;
                                    this.guardarProblemaObservacion=true;
                                    this.mostrarProblema=false;
                                    this.habilitarTabs[0]=false; 
                                    this.habilitarTabs[1]=false; 
                                    this.habilitarTabs[2]=false; 
                                    this.habilitarTabs[3]=true;                       
                                    this.habilitarTabs[4]=true; 
                                    this.habilitarTabs[5]=true;
                                    break;
                                case "4":
                                    this.objBitacora[this.i]=obj;
                                    this.i=this.i+1;
                                    this.etapaNC = 4;
                                    this.indicador=false;
                                    this.guardarProblemaObservacion=true;
                                    this.mostrarProblema=false;
                                    this.habilitarTabs[0]=false; 
                                    this.habilitarTabs[1]=false; 
                                    this.habilitarTabs[2]=false; 
                                    this.habilitarTabs[3]=false;                       
                                    this.habilitarTabs[4]=true; 
                                    this.habilitarTabs[5]=true;
                                    break;
                                case "5":
                                    this.objBitacora[this.i]=obj;
                                    this.i=this.i+1;
                                    this.etapaNC = 5;
                                    this.indicador=false;
                                    this.guardarProblemaObservacion=true;
                                    this.mostrarProblema=false;
                                    this.habilitarTabs[0]=false; 
                                    this.habilitarTabs[1]=false; 
                                    this.habilitarTabs[2]=false; 
                                    this.habilitarTabs[3]=false;                       
                                    this.habilitarTabs[4]=false; 
                                    this.habilitarTabs[5]=true;
                                    break;
                                case "6":
                                    this.objBitacora[this.i]=obj;
                                    this.i=this.i+1;
                                    this.etapaNC = 6;
                                    this.indicador=false;
                                    this.guardarProblemaObservacion=true;
                                    this.mostrarProblema=false;
                                    this.habilitarTabs[0]=false; 
                                    this.habilitarTabs[1]=false; 
                                    this.habilitarTabs[2]=false; 
                                    this.habilitarTabs[3]=false;                       
                                    this.habilitarTabs[4]=false; 
                                    this.habilitarTabs[5]=false;
                                    break;
                                default:
                                    this.etapaNC = 0;
                            }
                        });
                    } else {
                        this.indicador=true;
                    }
                    this.paginacionBitacora = new Paginacion(response.paginacion);
                    this.obtenerDatosNoConformidad();
                    if(this.indicador){
                        this.OnRegistrarSeguimiento();
                    }
                },
                (error) => this.controlarError(error)
            );
        }
    }

    validarUsuario(){
        this.accesoUsuario = sessionStorage.getItem("accesoUsuario");
        if(this.accesoUsuario == "0"){
          this.ocultarElemento = true;
        } else {
          this.ocultarElemento = false;
        }
    }

    ngOnDestroy() {
        localStorage.removeItem("objNoConformidad");
    }

    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
    }

    OnPageChanged(event): void {
        this.paginacionPlanAccion.pagina = event.page;
        this.paginacionEjecucion.pagina = event.page;
        this.paginacionBitacora.pagina = event.page;
    }

    OnPageOptionChanged(event): void {
        this.paginacionPlanAccion.registros = event.rows;
        this.paginacionPlanAccion.pagina = 1;
        this.paginacionEjecucion.registros = event.rows;
        this.paginacionEjecucion.pagina = 1;
        this.paginacionBitacora.registros = event.rows;
        this.paginacionBitacora.pagina = 1;
    }

    controlarError(error): void {
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }

    OnRegresar() {
        this.router.navigate([`noconformidad/bandejanoconformidad`]);
    }

    OnAdjuntarArchivo(event:any){
        if(event.target.files.length>0){
            if(FormatoCarga.pdf == event.target.files[0].type || FormatoCarga.word == event.target.files[0].type || FormatoCarga.wordAntiguo == event.target.files[0].type) {
                if(event.target.id == 'fileProblema'){
                    this.objNoConformidad.archivoAdjuntoProblema = event.target.files[0];
                    this.nombreArchivoAdjuntoProblema = event.target.files[0].name;
                } else if(event.target.id == 'fileObservacion'){
                    this.objNoConformidad.archivoAdjuntoObservacion = event.target.files[0];
                    this.nombreArchivoAdjuntoObservacion = event.target.files[0].name;
                } else if (event.target.id == 'fileAnalisis'){
                    this.objNoConformidad.archivoAdjuntoAnalisis = event.target.files[0];
                    this.nombreArchivoAdjuntoAnalisis = event.target.files[0].name;
                }
            } else {
                this.toastr.warning('Solo se permiten archivos PDF o Word', 'Atención', {closeButton: true});
            }
        }
    }
}
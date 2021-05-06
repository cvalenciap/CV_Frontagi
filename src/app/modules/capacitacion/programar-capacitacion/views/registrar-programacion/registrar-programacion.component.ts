import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Paginacion, Instructor, Asistencia, EmpleadoAsistencia } from 'src/app/models';
import { Response } from './../../../../../models/Response';
import { forkJoin } from 'rxjs';
import { AgregarCursoComponents } from 'src/app/modules/capacitacion/modales/agregar-curso.component';
import { AgregarColaboradorComponents } from 'src/app/modules/bandejadocumento/modales/agregar-colaborador.component';
import { BusquedaDocumentoComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-documento.component';
import { AgregarInstructorComponents } from 'src/app/modules/capacitacion/programar-capacitacion/modales/registrar-programacion/modal-agregar-instructor/agregar-instructor.component';

import { ProgramarCapacitacion } from 'src/app/models/programarcapacitacion';
import { BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ProgramarCapacitacionMockService as ProgramarCapacitacionService} from './../../../../../services/index';
import { ModalProgramarSesionComponent } from '../../modales/registrar-programacion/modal-programar-sesion/modal-programar-sesion.component';
import { ModalAgregarPreguntaComponent } from '../../modales/registrar-programacion/modal-agregar-pregunta/modal-agregar-pregunta.component';
import { Curso } from 'src/app/models/curso';
import { Sesion } from 'src/app/models/sesion';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Colaborador } from 'src/app/models/colaborador';
import { CapacitacionService } from 'src/app/services/impl/capacitacion.service';
import { BandejaDocumento } from 'src/app/models/bandejadocumento';
import { DocumentoInternoCap } from 'src/app/models/documentoInternoCap';
import { Documento } from 'src/app/models/documento';
import { FormatoCarga } from 'src/app/constants/general/general.constants';
import { CapacitacionDocumentos } from 'src/app/models/capacitacionDocumentos';
import { PreguntaCurso } from 'src/app/models/preguntacurso';


@Component({
    selector: 'app-registrar-programacion',
    templateUrl: './registrar-programacion.template.html',
    styleUrls: ['./registrar-programacion.component.scss']
})

export class RegistrarProgramacionComponent implements OnInit {

    selectedRow: number;
    selectedObject: any;
    paginacion: Paginacion;
    duracion:string;
    objetoVentana: BsModalRef;
    
    bsModalRef: BsModalRef;
    _dateTimeObj: string = "01/01/2019";
    /** Datos **/
    busquedaProgramarCapacitacion: ProgramarCapacitacion;
    datoCapacitacion: ProgramarCapacitacion;
    datoCurso: Curso;
    datoInstructor: Instructor;
    listaSes: Sesion[];
    codCursoAux: number;
    codPartAux: number;
    codPregAux: number;
    codDocuAux: number;
    codDocuCapaAux: number;
    selectedSesion: any;
    selectedSesionRow: number;
    sesion: Sesion;
    datoSesion: Sesion;
    nuevo: boolean;
    private sub: any;
    itemCodigo: number = 0;
    itemCapacitacion: ProgramarCapacitacion;
    listaParticipante : Colaborador[];
    listaPreguntas : PreguntaCurso[];
    itemParticipante:RutaParticipante=new RutaParticipante;
    itemPregCurso : ProgramarCapacitacion = new ProgramarCapacitacion;
    itemDocumento: Documento = new Documento;
    itemAux : number;
    itemAuxPart : number;
    lstAuxPart : Colaborador[];
    cantidad : number;
    lstPartAux : Colaborador[];
    lstAuxPart2 : Colaborador[];
    asist : Asistencia = new Asistencia();
    lstDocumentos : DocumentoInternoCap[];
    lstAuxDocumento : DocumentoInternoCap[];
    lstAuxDocumento2 : DocumentoInternoCap[];
    docInterno : Documento;
    archivo: any;
    mensajearchivo: string;
    sizeFile:any;
    listaDocCapa : CapacitacionDocumentos[];
    listaDocCapaAux : CapacitacionDocumentos [];
    listaDocCapaAux2 : CapacitacionDocumentos[];
    listaDocCapaAux3 : CapacitacionDocumentos[];
    lstPregCursoAux : PreguntaCurso[];
    lstPregCursoAux2 : PreguntaCurso[];
    lstAuxPregCurso : PreguntaCurso[];
    lstPregInicial : PreguntaCurso[];
    loading: boolean;
    constructor(private modalService: BsModalService,
                private toastr: ToastrService,
                private route: ActivatedRoute,
                private servicio : CapacitacionService,
                private router: Router){
        this.selectedRow = -1;
        this.datoCapacitacion = new ProgramarCapacitacion;
        this.datoCurso = new Curso;
        this.listaSes = [];
        this.codCursoAux = 0;
        this.codPartAux = 0;
        this.codPregAux = 0;
        this.codDocuAux = 0;
        this.codDocuCapaAux = 0;
        this.datoInstructor = new Instructor;
        this.datoSesion = new Sesion;
        this.listaParticipante = [];
        this.itemCapacitacion = new ProgramarCapacitacion;
        this.paginacion = new Paginacion({registros: 10});
        this.itemAux = 0;
        this.itemAuxPart = 0;
        this.lstAuxPart = [];
        this.cantidad = 0;
        this.lstPartAux = [];
        this.lstAuxPart2 = [];
        this.lstDocumentos = [];
        this.docInterno = new Documento;
        this.lstAuxDocumento = [];
        this.lstAuxDocumento2 = [];
        this.listaDocCapa = [];
        this.listaDocCapaAux = [];
        this.listaDocCapaAux2 = [];
        this.listaDocCapaAux3 = [];
        this.lstPregCursoAux = [];
        this.listaPreguntas = [];
        this.lstPregCursoAux2 = [];
        this.lstAuxPregCurso = [];
        this.lstPregInicial = [];
    }
 
    ngOnInit(){
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];
        });
        this.itemCapacitacion = JSON.parse(sessionStorage.getItem("capacitacion"));
        console.log(this.itemCapacitacion);
        
        if(this.itemCodigo){
            this.nuevo = false;
            this.datoCurso.nombreCurso = this.itemCapacitacion.nombreCurso;
            this.datoCurso.duracion = this.itemCapacitacion.curso.duracion;
            this.datoInstructor.v_nominst = this.itemCapacitacion.nombreInstructor;
            this.datoCapacitacion.indEvaluacion = this.itemCapacitacion.indEvaluacion;
            this.datoCapacitacion.estadoCapacitacion = this.itemCapacitacion.estadoCapacitacion;
            this.listaSes = this.itemCapacitacion.listaSesiones;
            this.listaParticipante = this.itemCapacitacion.lstColaborador;
            this.lstDocumentos = this.itemCapacitacion.listaDocumentos;
            this.listaDocCapa = this.itemCapacitacion.listaDocuCapa;
            for (let dat of this.listaParticipante) {
                if (this.itemAuxPart > 0) {
                    dat.itemColumnaPart = 0;
                    dat.itemColumnaPart = this.itemAuxPart + 1;
                    this.itemAuxPart = dat.itemColumnaPart;
                } else {
                    dat.itemColumnaPart = dat.itemColumnaPart + 1;
                    this.itemAuxPart = dat.itemColumnaPart;
                }
            }
            for (let data of this.listaSes) {
                if (this.itemAux > 0) {
                    data.itemColumna = 0;
                    data.itemColumna = this.itemAux + 1;
                    this.itemAux = data.itemColumna;
                } else {
                    data.itemColumna = data.itemColumna + 1;
                    this.itemAux = data.itemColumna;
                }
            }
           if(this.listaParticipante.length>0){
                this.cantidad = this.listaParticipante.length;
           }

           for(let dat of this.lstDocumentos){
            if(this.codDocuAux >0){ 
                    dat.itemColumnaDoc = 0;
                    dat.itemColumnaDoc = this.codDocuAux + 1;
                    this.codDocuAux = dat.itemColumnaDoc;
                } else {
                    dat.itemColumnaDoc = 0;
                    dat.itemColumnaDoc = dat.itemColumnaDoc + 1;
                    this.codDocuAux = dat.itemColumnaDoc;
                }
            }

            for(let dat of this.listaDocCapa){
                if(this.codDocuCapaAux >0){ 
                        dat.itemColumD = 0;
                        dat.itemColumD = this.codDocuCapaAux + 1;
                        this.codDocuCapaAux = dat.itemColumD;
                    } else {
                        dat.itemColumD = 0;
                        dat.itemColumD = dat.itemColumD + 1;
                        this.codDocuCapaAux = dat.itemColumD;
                    }
                }
            
            this.getListaPregCurso();

        } else {
            this.nuevo = true;
            this.itemCapacitacion.estadoCapacitacion == "R"
        }
    }

    OnRowClick(index, obj): void {
        
        this.selectedRow = index;
        this.selectedObject = obj;
    }
    OnBuscarCurso() {
        const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {},
          class: 'modal-lg'
        }
        
        this.objetoVentana = this.modalService.show(AgregarCursoComponents, config);
        (<AgregarCursoComponents>this.objetoVentana.content).onClose.subscribe(result => {
            
            this.listaSes = result.listaSesiones;
            for(let ses of this.listaSes){
                this.datoSesion.fechaInicio = ses.fechaInicio;
                this.datoSesion.fechaFin = ses.fechaFin;
            }
            
            for (let data of this.listaSes) {
                if (this.codCursoAux > 0) {
                    data.itemColumna = 0;
                    data.itemColumna = this.codCursoAux + 1;
                    this.codCursoAux = data.itemColumna;
                } else {
                    data.itemColumna = data.itemColumna + 1;
                    this.codCursoAux = data.itemColumna;
                }
            }
            this.datoCurso = result;
        });
      }
    

    OnAnadirDocumentoInterno(){        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                //modalService:this.modalService
            },
            class: 'modal-lg'
        }
        const modalDocumento = this.modalService.show(BusquedaDocumentoComponent, config);
        
        (<BusquedaDocumentoComponent>modalDocumento.content).onClose.subscribe((documento:Documento) => {
            
            let docInt : DocumentoInternoCap = new DocumentoInternoCap;
            docInt.idDocumento = documento.id;
            docInt.codigoDocumento = documento.codigo;
            docInt.nombreDocumento = documento.descripcion;
            docInt.idRevision = documento.idrevision;
            docInt.fechaRevisionDocu = documento.revision.fechaAprobacion;
            docInt.disponibilidad = 0;
            // this.itemDocumento = documento;
            this.lstDocumentos.push(docInt);
           
            //this.lstDocumentos.push(documento);
            this.codDocuAux=0;

            for(let dat of this.lstDocumentos){
                if(this.codDocuAux >0){ 
                    dat.itemColumnaDoc = 0;
                    dat.itemColumnaDoc = this.codDocuAux + 1;
                    this.codDocuAux = dat.itemColumnaDoc;
                } else {
                    dat.itemColumnaDoc = 0;
                    dat.itemColumnaDoc = dat.itemColumnaDoc + 1;
                    this.codDocuAux = dat.itemColumnaDoc;
                }
            }
        });
    }

    OnProgramarSesion(){
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {      
                idSesion : this.sesion.idSesion,
                nombre : this.sesion.nombreSesion,
                inicio: this.sesion.horaInicio,
                fin: this.sesion.horaFin,
                fecha: this.sesion.fechaSesion,
                duracion: this.sesion.duracion,
                idAula: this.sesion.idAula,
                nombreAula: this.sesion.nombreAula
            },
            class: 'modal-lx'
        }
        
        const modalSesion = this.modalService.show(ModalProgramarSesionComponent, config);
        (<ModalProgramarSesionComponent>modalSesion.content).onClose.subscribe(result => {
            
            this.busquedaProgramarCapacitacion = result;
            for(let dat of this.listaSes){
                if(dat.nombreSesion == result.sesion.nombreSesion){
                    dat.idSesion = result.sesion.idSesion
                    dat.fechaSesion = result.sesion.fechaSesion;
                    dat.horaInicio = result.sesion.horaInicio;
                    dat.horaFin = result.sesion.horaFin;
                    dat.idAula = String(result.aula.nidaula);
                    dat.nombreAula = result.aula.vnomaula;
                    this.listaSes = this.listaSes.filter(x=>x=dat);
                }
            }
        });
    }

    OnAgregarPregunta(){
        
        if(this.listaPreguntas.length>0){
            for(let preg of this.lstPregInicial){
                for(let pregC of this.listaPreguntas){
                    if(preg.idPregunta == pregC.idPregunta){
                        preg.idTipoCurso="1";
                        this.lstPregInicial=this.lstPregInicial.filter(x=>x=preg);
                    }
                }
            }
        }


        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: { 
                lstPreguntas : this.lstPregInicial       
            },
            class: 'modal-lg' 
        }
        const modalPregunta = this.modalService.show(ModalAgregarPreguntaComponent, config);
        (<ModalAgregarPreguntaComponent>modalPregunta.content).onClose.subscribe((capa : ProgramarCapacitacion) => {
            
            this.itemPregCurso = capa;
            this.lstPregCursoAux = this.itemPregCurso.lstPregCurso;
            if(this.lstPregCursoAux.length>0){
                for(let val of this.lstPregCursoAux){
                    val.disPregCapa = 0;
                    this.listaPreguntas.push(val);
                }
            }
            for (let data of this.listaPreguntas) {
                if (this.codPregAux > 0) {
                    data.itemColPreg = 0;
                    data.itemColPreg = this.codPregAux + 1;
                    this.codPregAux = data.itemColPreg;
                } else {
                    data.itemColPreg = 0;
                    data.itemColPreg = data.itemColPreg + 1;
                    this.codPregAux = data.itemColPreg;
                }
            }
            //  this.busquedaProgramarCapacitacion = result;
           
        });
    }

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        // this.getLista();
    }

    OnRegresar() {
        this.router.navigate([`capacitacion/programarcapacitacion`]);
    }

    OnBuscarColaborador() {
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {},
            class: 'modal-lg'
        }
        
        this.objetoVentana = this.modalService.show(AgregarColaboradorComponents, config);
        (<AgregarColaboradorComponents>this.objetoVentana.content).onClose.subscribe((participante:RutaParticipante) => {
            
            this.itemParticipante =participante;
            this.lstPartAux= this.itemParticipante.lstColaborador;
            if(this.lstPartAux.length>0){
                for(let val of this.lstPartAux){
                    val.disponible = 0;
                    val.indEnvio = 0;
                    this.listaParticipante.push(val);
                }
            }
            for (let data of this.listaParticipante) {
                if (this.codPartAux > 0) {
                    data.itemColumnaPart = 0;
                    data.itemColumnaPart = this.codPartAux + 1;
                    this.codPartAux = data.itemColumnaPart;
                    this.cantidad = this.listaParticipante.length;
                } else {
                    data.itemColumnaPart = 0;
                    data.itemColumnaPart = data.itemColumnaPart + 1;
                    this.codPartAux = data.itemColumnaPart;
                    this.cantidad = this.listaParticipante.length;
                }
            }
        });
    }

    OnBuscarInstructor() {
         
        const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {},
          class: 'modal-lg'
        }
        
        this.objetoVentana = this.modalService.show(AgregarInstructorComponents, config);
        (<AgregarInstructorComponents>this.objetoVentana.content).onClose.subscribe(result => {
            
            this.datoInstructor = result;
        });
    }

    seleccionarSesion(index: number, sesion: Sesion) {
        
        this.selectedRow = index;
        this.sesion = sesion;
        this.selectedSesionRow = index;
    }

    eliminarParticipante(indiceParticpante: number, item: Colaborador){
        let indice: number;
        for (let dat of this.listaParticipante) {
            if (dat.descripcionEquipo == item.descripcionEquipo) {
                item.disponible = 2;
                this.lstAuxPart.push(item);
                break;
            }
        }
        this.listaParticipante = this.listaParticipante.filter(x => x != item);
        var itemAux: number = 0;
        for (let dat of this.listaParticipante) {
            
            if (itemAux > 0) {
                dat.itemColumnaPart = 0;
                dat.itemColumnaPart = itemAux + 1;
                itemAux = dat.itemColumnaPart;
                this.cantidad = this.listaParticipante.length;
            } else {
                dat.itemColumnaPart = 0;
                dat.itemColumnaPart = dat.itemColumnaPart + 1;
                itemAux = dat.itemColumnaPart;
                this.cantidad = this.listaParticipante.length;
            }
        }
    }

    guardarCapacitacion(){
        if (this.nuevo) { 
            
            this.datoCapacitacion.listaSesiones = this.listaSes;
            this.datoCapacitacion.curso = this.datoCurso;
            this.datoCapacitacion.instructorr = this.datoInstructor;
            this.datoCapacitacion.lstColaborador  =this.listaParticipante;
            this.datoCapacitacion.listaDocumentos = this.lstDocumentos;
            this.datoCapacitacion.lstPreguntas = this.listaPreguntas;
            this.datoCapacitacion.disponibilidad = 1;
            this.datoCapacitacion.estadoCapacitacion = "R";
            this.datoCapacitacion.listaDocuCapa = this.listaDocCapa;
            const agregarCapacitacion = this.servicio.registrarCapacitacion(this.datoCapacitacion).subscribe(
                (response: Response) => {
                    if(response.estado = 'OK'){
                        if(this.listaDocCapa.length>0){
                            for(let valor of this.listaDocCapa){
                                var ruta;
                                valor.idCapacitacion = this.datoCapacitacion.idCapacitacion
                                ruta=valor.rutaDocumento;
                                valor.rutaDocumento=null;
                                this.servicio.cargarDocumento(ruta, valor).subscribe((response : Response)=>{

                                }, (error) => this.controlarError(error));
                            }
                        } 
                        else {
                            this.toastr.success("Registro Actualizado");
                            this.router.navigate(['capacitacion/programarcapacitacion']);
                        }
                    }
                    this.toastr.success("Registro Actualizado");
                    this.router.navigate(['capacitacion/programarcapacitacion']);
                }, (error) => this.controlarError(error)
            );
        } else {
                
                //Datos Documentos
                this.lstAuxDocumento2 = this.lstDocumentos;
                if(this.lstAuxDocumento.length>0){
                    for(let docu of this.lstAuxDocumento){
                        this.lstAuxDocumento2.push(docu); 
                        this.lstDocumentos = this.lstDocumentos.filter(d=>d!=docu);
                    }
                }
                this.datoCapacitacion.listaDocumentos = this.lstAuxDocumento2;
                //Datos Participantes
                this.lstAuxPart2=this.listaParticipante;
                if(this.lstAuxPart.length>0){
                    for(let dat of this.lstAuxPart){
                        this.lstAuxPart2.push(dat);
                        this.listaParticipante=this.listaParticipante.filter(x=>x!=dat);
                    }
                }
                this.datoCapacitacion.lstColaborador  =this.lstAuxPart2;
                //Datos Capacitacion
                this.datoCapacitacion.idCapacitacion = this.itemCapacitacion.idCapacitacion;
                if(this.datoCurso.idCurso == null ){
                    this.datoCapacitacion.idCurso = this.itemCapacitacion.idCurso;
                } else {
                    this.datoCapacitacion.idCurso = this.datoCurso.idCurso;
                }

                //Datos Sesiones
                this.datoCapacitacion.listaSesiones = this.listaSes;

                //Dato Curso
                this.datoCapacitacion.curso = this.datoCurso;

                //Dato Instructor
                if(this.datoInstructor.n_idinst == null){
                    this.datoCapacitacion.idInstructor = this.itemCapacitacion.idInstructor;
                }else {
                    this.datoCapacitacion.idInstructor = this.datoInstructor.n_idinst
                }

                //Datos generales Capacitacion
                this.datoCapacitacion.disponibilidad = 1;

                //Archivos cargados
                this.listaDocCapaAux2 = this.listaDocCapa;
                if(this.listaDocCapaAux.length>0){
                    for(let docu of this.listaDocCapaAux){
                        this.listaDocCapaAux2.push(docu); 
                        this.listaDocCapa = this.listaDocCapa.filter(d=>d!=docu);
                    }
                }

                //Preguntas Capacitacion
                this.lstAuxPregCurso = this.listaPreguntas;
                if(this.lstPregCursoAux2.length>0){
                    for(let docu of this.lstPregCursoAux2){
                        this.lstAuxPregCurso.push(docu); 
                        this.listaPreguntas = this.listaPreguntas.filter(d=>d!=docu);
                    }
                }
                this.datoCapacitacion.lstPreguntas = this.lstAuxPregCurso;

                this.servicio.actualizarDatosCapacitacion(this.datoCapacitacion).subscribe(
                    (response: Response) => {
                        
                        if(response.estado = 'OK'){
                            if(this.listaDocCapaAux2.length>0){
                                for(let valor of this.listaDocCapaAux2){
                                    var ruta;
                                    valor.idCapacitacion = this.datoCapacitacion.idCapacitacion
                                    ruta=valor.rutaDocumento;
                                    if(valor.disponibilidad != 2){
                                        valor.rutaDocumento=null;
                                    }
                                    this.servicio.cargarDocumento(ruta, valor).subscribe((response : Response)=>{

                                    }, (error) => this.controlarError(error));
                                }
                            } 
                            // else {
                            //     this.toastr.success("Registro Actualizado");
                            //     this.router.navigate(['capacitacion/programarcapacitacion']);
                            // }
                        }
                        this.toastr.success("Registro Actualizado");
                        this.router.navigate(['capacitacion/programarcapacitacion']);
                    }, (error) => this.controlarError(error)
                );


            
        }
    }

    controlarError(error) {
        console.error(error);
    }

    cerrarCapacitacion(){
        console.log(this.listaParticipante); 
    }

    enviarParticipante(){
        
        let lista: EmpleadoAsistencia[] = [];
        for(let val of this.listaParticipante){
            let emp : EmpleadoAsistencia = new EmpleadoAsistencia();
            emp.idTrabajador=String(val.numFicha);
            emp.indEnvio = val.indEnvio;
            lista.push(emp);
        }
        this.asist.listTrabajador = lista;
        this.asist.idCapacitacion = this.itemCapacitacion.idCapacitacion;
        this.asist.listSesion = this.itemCapacitacion.listaSesiones;
        this.asist.indAsistencia = 0;
        this.asist.dispAsistencia = 1;
        this.asist.estCapacitacion = 'P';
       
        let serv = this.servicio.enviarCapacitacion(this.asist).subscribe(
             (response: Response) => {
                this.toastr.success("Se envío capacitación");
                this.router.navigate(['capacitacion/programarcapacitacion']);
        }, (error) => this.controlarError(error));
    }

    eliminarDocInterno(indiceDocu : number, item : DocumentoInternoCap){
        let indice: number;
        for (let dat of this.lstDocumentos) {
            if (dat.nombreDocumento == item.nombreDocumento) {
                item.disponibilidad = 2;
                this.lstAuxDocumento.push(item);
                break;
            }
        }
        this.lstDocumentos = this.lstDocumentos.filter(x => x != item);
        let itemAux: number = 0;
        for (let dat of this.lstDocumentos) {
            
            if (itemAux > 0) {
                dat.itemColumnaDoc = 0;
                dat.itemColumnaDoc = itemAux + 1;
                itemAux = dat.itemColumnaDoc;
            } else {
                dat.itemColumnaDoc = 0;
                dat.itemColumnaDoc = dat.itemColumnaDoc + 1;
                itemAux = dat.itemColumnaDoc;
            }
        }
    }

    OnAdjuntar(file: any) {
        console.log(file);
        
        if (file.target.files.length > 0) {
            if (FormatoCarga.pdf == file.target.files[0].type 
                || FormatoCarga.word == file.target.files[0].type
                || FormatoCarga.wordAntiguo == file.target.files[0].type 
                || FormatoCarga.excel == file.target.files[0].type
                || FormatoCarga.imagen == file.target.files[0].type
                || FormatoCarga.ppt == file.target.files[0].type
                || FormatoCarga.pptAntiguo == file.target.files[0].type
                || FormatoCarga.excelAntiguo == file.target.files[0].type) {
                
                this.archivo = file.target.files[0];
                this.mensajearchivo = file.target.files[0].name;
                this.sizeFile=file.target.files[0].size;
                if(this.sizeFile>10000000){
                    this.toastr.warning('Solo se permite archivo PDF menos de 10mb', 'Atención', { closeButton: true });
                }
                var cap:CapacitacionDocumentos= new CapacitacionDocumentos;
                cap.nombreDocumento=this.mensajearchivo;
                cap.rutaDocumento=this.archivo;
                cap.disponibilidad = 0;
                this.listaDocCapa.push(cap);
                this.codDocuCapaAux = 0;

                for (let data of this.listaDocCapa) {
                    if (this.codDocuCapaAux > 0) {
                        data.itemColumD = 0;
                        data.itemColumD = this.codDocuCapaAux + 1;
                        this.codDocuCapaAux = data.itemColumD;
                    } else {
                        data.itemColumD = 0;
                        data.itemColumD = data.itemColumD + 1;
                        this.codDocuCapaAux = data.itemColumD;
                    }
                }
            }
             else  {
                this.toastr.warning('Archivo no permitido', 'Atención', { closeButton: true });
            }
        }
    }

    onEliminarDocCapac(ind: number, item : CapacitacionDocumentos){
        let indice: number;
        for (let dat of this.listaDocCapa) {
            if (dat.nombreDocumento == item.nombreDocumento) {
                item.disponibilidad = 2;
                this.listaDocCapaAux.push(item);
                break;
            }
        }
        this.listaDocCapa = this.listaDocCapa.filter(x => x != item);
        let itemAux: number = 0;
        for (let dat of this.listaDocCapa) {
            
            if (itemAux > 0) {
                dat.itemColumD = 0;
                dat.itemColumD = itemAux + 1;
                itemAux = dat.itemColumD;
            } else {
                dat.itemColumD = 0;
                dat.itemColumD = dat.itemColumD + 1;
                itemAux = dat.itemColumD;
            }
        }
    }

    onEliminaPregunta(ind: number, item: PreguntaCurso){
        let indice: number;
        for (let dat of this.listaPreguntas) {
            if (dat.pregunta == item.pregunta) {
                item.disPregCapa = 2;
                this.lstPregCursoAux2.push(item);
                break;
            }
        }
        this.listaPreguntas = this.listaPreguntas.filter(x => x != item);
        let itemAux: number = 0;
        for (let dat of this.listaPreguntas) {
            
            if (itemAux > 0) {
                dat.itemColPreg = 0;
                dat.itemColPreg = itemAux + 1;
                itemAux = dat.itemColPreg;
            } else {
                dat.itemColPreg = 0;
                dat.itemColPreg = dat.itemColPreg + 1;
                itemAux = dat.itemColPreg;
            }
        }
    }

    getListaPregCurso(){
        this.loading = true;
        
       const parametros: {idCurso?: string} = {idCurso: this.itemCapacitacion.idCurso};
        this.servicio.buscarPreguntaCursoId(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                
                
                this.lstPregInicial = response.resultado;
                // for (let data of this.lstPregInicial) {
                //     if (this.codPregAux > 0) {
                //         data.itemColPreg = 0;
                //         data.itemColPreg = this.codPregAux + 1;
                //         this.codPregAux = data.itemColPreg;
                //     } else {
                //         data.itemColPreg = 0;
                //         data.itemColPreg = data.itemColPreg + 1;
                //         this.codPregAux = data.itemColPreg;
                //     }
                // }
                console.log(this.lstPregInicial);
            },
              (error) => this.controlarError(error)
            );

           
    }
}
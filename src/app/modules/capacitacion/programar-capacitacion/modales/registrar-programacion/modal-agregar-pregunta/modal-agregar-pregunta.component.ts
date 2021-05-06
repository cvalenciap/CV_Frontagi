import { Component, OnInit, Inject, SecurityContext} from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Subject } from 'rxjs';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../../../models/Response';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { ProgramarCapacitacion } from 'src/app/models/programarcapacitacion';
import { PreguntaCurso } from 'src/app/models/preguntacurso';
import { CapacitacionService } from 'src/app/services/impl/capacitacion.service';
declare var jQuery: any;

@Component({
  selector: 'app-modal-agregar-pregunta',
  templateUrl: './modal-agregar-pregunta.template.html',
  styleUrls: ['./modal-agregar-pregunta.component.scss']
})
export class ModalAgregarPreguntaComponent implements OnInit {

    public onClose: Subject<ProgramarCapacitacion>;
    public interruptorAceptar: boolean;
    selectedRow: number;
    // selectedObject: any;
    paginacion: Paginacion;
    duracion:string;
    busqueda:ProgramarCapacitacion;
    bsConfig: object;
    deshabilitarCaja:boolean;
    textoBusqueda: string;
    parametroBusqueda: string;
    mensajeAlerta:string;
    mostrarAlerta:boolean;
    idCapacitacion : number;
    idCurso : string;
    datoPreg : PreguntaCurso;
    loading: boolean;
    lstPregCurso: PreguntaCurso[];
    filaSeleccionada:number;
    selectedObject: PreguntaCurso;
    lstPregAux : PreguntaCurso[];
    progCapa : ProgramarCapacitacion;
    pregunta : PreguntaCurso = new PreguntaCurso();
    listaBusqueda : PreguntaCurso [];
    listaAux :PreguntaCurso [];
    puntaje:number;
    lstPreguntas : PreguntaCurso [];
    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService,
                private modalService: BsModalService,
                private router: Router,
                private service: CapacitacionService,
                private sanitizer: DomSanitizer) {
                    this.parametroBusqueda = 'codigo';
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
                    this.selectedRow = -1;
                    this.paginacion = new Paginacion({registros: 10});
                    this.datoPreg = new PreguntaCurso();
                    this.lstPregCurso = [];
                    this.lstPregAux = [];
                    this.listaBusqueda = [];
                    this.listaAux = [];
                    this.puntaje = 0;
                    this.lstPreguntas = [];
    }

    ngOnInit() {
        this.busqueda = new ProgramarCapacitacion();
        this.busqueda.codigo = "";
        this.mensajeAlerta = "";
        this.mostrarAlerta = false;
        this.selectedRow = -1;
        this.onClose = new Subject();
        console.log(this.busqueda);
        this.datoPreg.idCurso = this.idCurso;
        this.deshabilitarCaja = true;
        
        this.lstPregCurso = this.lstPreguntas;
        let existe = false;
        let fila = 0, indice = 0;

        var codPregAux=0;
        if(this.lstPreguntas.length>0){
            for(let dat of this.lstPregCurso){
                 
                    if (codPregAux > 0) {
                        dat.itemColPreg = 0;
                        dat.itemColPreg = codPregAux + 1;
                        codPregAux = dat.itemColPreg;
                    } else {
                        dat.itemColPreg = 0;
                        dat.itemColPreg = dat.itemColPreg + 1;
                        codPregAux = dat.itemColPreg;
                    }
                
                if(dat.idTipoCurso == "1"){
                 this.seleccionarPregunta(dat.itemColPreg,dat);
            }
        }
       
    }
          
        // this.getLista();
        if(!this.parametroBusqueda){
            this.parametroBusqueda='pregunta';
        }

    }

    OnRowClick(index, obj): void {
          
        this.selectedRow = index;
        this.selectedObject = obj;
    }

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        //this.getLista();
    }

    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        //this.getLista();
    }

    OnSeleccionar(){
        this.bsModalRef.hide();
    }

    OnRegresar(){
        this.bsModalRef.hide();
    }

    OnBuscar(): void {
        
        const parametros: {tipo?: string, pregunta?: string} = {tipo: null, pregunta:null};
        if(!this.parametroBusqueda){
         this.parametroBusqueda='tipo';
         }
        this.textoBusqueda=this.textoBusqueda.toLocaleUpperCase();
        switch (this.parametroBusqueda) {
            case 'pregunta':
                this.pregunta.pregunta = this.textoBusqueda;

                break;

            case 'tipo':
                this.pregunta.nomTipo = this.textoBusqueda;

                break;
        }
        this.listaBusqueda=[];
        if(this.textoBusqueda==""){
            this.lstPregCurso=this.listaAux;
            
       }else{
        for(let data of this.lstPregCurso){
            if(this.pregunta.nomTipo!=null && this.pregunta.nomTipo!=""){
                if((data.nomTipo.indexOf(this.pregunta.nomTipo)>-1)){
                    this.listaBusqueda.push(data);
                   
                 }
            }else{
                if((data.pregunta.indexOf(this.pregunta.pregunta)>-1)){
                    this.listaBusqueda.push(data);
                  
                }
            }
           }
           this.lstPregCurso=this.listaBusqueda;
       }
       this.textoBusqueda='';
        //this.getLista();
    }

    getLista(){
        this.loading = true;
        
       const parametros: {idCurso?: string} = {idCurso: this.datoPreg.idCurso};
        this.service.buscarPreguntaCursoId(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                
                
                this.lstPregCurso = response.resultado;
                this.listaAux = this.lstPregCurso;
                console.log(this.lstPregCurso);
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

    seleccionarPregunta(index, obj): void {
        this.filaSeleccionada = index;
        let existe = false;
        let fila = 0, indice = 0;
        
        const pregunta : PreguntaCurso = obj;
        this.selectedObject = {
            codCurso : pregunta.codCurso,
            codPregunta : pregunta.codPregunta,
            pregunta : pregunta.pregunta,
            tipo :pregunta.tipo,
            puntaje : pregunta.puntaje,
            disponibilidad : pregunta.disponibilidad,
            nomCurso : pregunta.nomCurso,
            listPregunta : null,
            valorRespuesta : pregunta.valorRespuesta,
            idCurso : pregunta.idCurso,
            disponibilidadCurso : pregunta.disponibilidadCurso,
            idTipoCurso : pregunta.idTipoCurso,
            nomTipo : pregunta.nomTipo,
            idCapacitacion : 0,
            estado : null,
            datosAuditoria: null,
            idPregunta : pregunta.idPregunta,
            itemColPreg : 0,
            disPregCapa : pregunta.disPregCapa
        }

        console.log(this.selectedObject);
        if (this.lstPregAux.length <= 0) {
          this.interruptorAceptar = true;
          this.lstPregAux.push(this.selectedObject);
          this.puntaje = Number(this.selectedObject.puntaje);
          jQuery('#' + this.selectedObject.idPregunta).css( 'background', 'yellow' );
          this.interruptorAceptar = false;
        } else { 
          this.lstPregAux.forEach( function (preg) {
            if (preg.idPregunta === this.selectedObject.idPregunta) {
              existe = true;
              indice = fila;
              
            }
            fila = fila + 1;
          }.bind(this));
    
          if (existe) {
            this.lstPregAux.splice(indice, 1);
            jQuery('#' + this.selectedObject.idPregunta).css( 'background', 'none' );
            this.puntaje = this.puntaje - Number(this.selectedObject.puntaje);
          } else {
            this.lstPregAux.push(this.selectedObject);
            jQuery('#' + this.selectedObject.idPregunta).css( 'background', 'yellow' );
            this.puntaje = this.puntaje + Number(this.selectedObject.puntaje);
          }
        }
        if (this.lstPregAux.length > 0) {
          this.interruptorAceptar = false;
        } else {
          this.interruptorAceptar = true;
        }
    }

    agregar(){
        
        this.progCapa = new ProgramarCapacitacion();
        this.progCapa.lstPregCurso = this.lstPregAux;
        this.progCapa.puntaje = this.puntaje;
        if(this.puntaje>20){
            this.toastr.warning('El puntaje acumulado no debe exceder los 20 puntos.', 'Atención', { closeButton: true });
        }else {
            this.onClose.next(this.progCapa);
            this.bsModalRef.hide();
        }
       
    }
}
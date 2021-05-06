import { FichaAuditor } from 'src/app/models/fichaauditor';
import {NgModule} from '@angular/core';
import { FichaAuditorService } from 'src/app/services/impl/fichaauditor.service';
import { RegistroAuditorDetalle } from './../../../../../models/registroAuditorDetalle';
import { Auditor } from 'src/app/models/auditor';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ModalBusquedaAuditorComponent } from 'src/app/modules/auditoria/planauditoria/modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { Curso } from './../../../../../models/curso';
import { BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalAgregarOpcionesRespuestaComponent } from './modales/modal-agregar-opciones-respuesta/modal-agregar-opciones-respuesta.component';
import { ModalModificarOpcionesRespuestaComponent } from './modales/modal-agregar-opciones-respuesta/modal-modificar-opciones-respuesta.component';
import {Tipo} from '../../../../../models/tipo';
import { PreguntaCursoService } from '../../../../../services';
import { PreguntaCurso, PreguntaDetalle } from 'src/app/models';
import { Response } from '../../../../../models/response';
import { Constante } from 'src/app/models/constante';
import { Parametro } from 'src/app/models/parametro';
import { ModalSeleccionarCursoComponent } from'../bandeja-preguntas/modales/modal-busqueda-seleccionarCurso/modal-busqueda-seleccionarCurso.component';
import { Paginacion } from 'src/app/models/paginacion';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { forkJoin } from 'rxjs';
import { validate } from 'class-validator';

@Component({
    selector: 'app-registro-pregunta',
    templateUrl: 'registro-pregunta-curso.template.html',
    providers: [PreguntaCursoService],
    styleUrls: ['registro-pregunta.component.scss']
    

   // providers: [FichaRegistroAuditorService]
})
export class RegistroPreguntaCursoComponent implements OnInit {
   
    /* datos */
    item: Curso;
    Cursos:Curso[];
    private sub: any;
    bsModalRef:BsModalRef;
    busquedaRegistroCurso: PreguntaCurso;
    mostrarDiv:boolean;
    mostrarAlternativas:boolean;
    mostrarVoF:boolean;
    itemPregunta:PreguntaCurso;
    tipoPregunta:Constante[];
    valor:string;
    loading: boolean;
    codCurso:string;
    pregunta:string;
    tipo:string;
    puntaje:string;
    codDetalle:number;
    preguntaCurso:PreguntaCurso;
    listRespuestas:PreguntaCurso[];
    valorRespuesta:string;
    listPregunta:PreguntaDetalle[];
    selectedRow: number;
    selectedObject: PreguntaCurso;
    paginacion: Paginacion;
    parametroBusqueda: string;
    textoBusqueda: string;
    nomCurso:string;
    idCurso:string;
    items: Curso[];
    preguntaDetalle:PreguntaDetalle;
    disponibilidad:number;
    descPregunta:string;
    valorRespuestaDetalle:String;
    itemCodigo: number = 0;
    idPregunta:string="";
    selectDetalle:PreguntaDetalle= new PreguntaDetalle;
    listRespuestaDetalle:PreguntaDetalle[];
    listaAuxiliar:PreguntaDetalle[];
    mensajes:any[];
    errors:any;
    codAux:number;
      constructor(    
      
      private modalService: BsModalService,
      private fb: FormBuilder,  
      private service: PreguntaCursoService,
      private toastr: ToastrService,
      private router: Router,
      private route: ActivatedRoute,
      private servicioValidacion:ValidacionService
 
    ){
        this.selectedRow = -1;
        this.loading = false;
        this.tipoPregunta=[];
        this.listPregunta=[];
        this.listRespuestaDetalle=[];
        this.listaAuxiliar=[];
        this.itemPregunta= new PreguntaCurso;
        this.codCurso='';
        this.pregunta="";
        this.puntaje='';
        this.tipo='';
        this.valorRespuesta=null;
        this.preguntaCurso= new PreguntaCurso;
        this.paginacion = new Paginacion({registros: 10});
        this.items=[];
        this.nomCurso="";
        this.idCurso="";
        this.disponibilidad=0;
        this.descPregunta="";
        this.valorRespuestaDetalle="";
        this.tipo="";
        this.valor="";
        this.codAux=0;
        this.itemPregunta=null;
        
    }

    ngOnInit() {
        this.onTipo();
        this.mostrarDiv=false;
        this.mostrarAlternativas=false;
        this.mostrarVoF=false;
        //this.mostrarDivEquipos=false;
       

       
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];
          });

        this.itemPregunta = JSON.parse(sessionStorage.getItem("preguntacurso"));   
        
        if(this.itemCodigo){ 
            this.idCurso=this.itemPregunta.idCurso;
            this.idPregunta=this.itemPregunta.codPregunta;
            this.codCurso =  this.itemPregunta.codCurso;
            this.nomCurso =  this.itemPregunta.nomCurso;
            this.tipo=this.itemPregunta.tipo;
            this.abrir();
           this.pregunta  =  this.itemPregunta.pregunta;
            this.puntaje =  this.itemPregunta.puntaje;
            this.listPregunta=this.itemPregunta.listPregunta;
            this.codDetalle=0;
           /*  for(var  i=0; i<this.listPregunta.length;i++){ */
                
               for(let datos of this.listPregunta){
                   if(datos.idDetalle>0){
                    if(this.codDetalle>0){
                        datos.codDetalle=0;
                        datos.codDetalle=this.codDetalle+1;
                        this.codDetalle=datos.codDetalle;
                    }else{
                     datos.codDetalle=datos.codDetalle+1 ;
                     this.codDetalle=datos.codDetalle;
                     this.valorRespuesta=datos.valorRespuesta;
                    }
                    
                   }
                   
                } 
                this.paginacion.totalRegistros=this.listPregunta.length;
                
           /*  } */
           
        } else{
            this.itemCodigo = 0;
        }
      
      }

      


      abrir() {
        
          
        switch (this.tipo) {
            case '700':
                this.mostrarDiv=true;
                this.mostrarAlternativas=true;
                this.mostrarVoF=false;
                if(!this.itemCodigo){
                    this.pregunta="";
                    this.listPregunta=[];
                    this.puntaje="";
                }
                
               // this.mostrarDivEquipos=false;
                break;
            case '701':
                this.mostrarDiv=true;
                this.mostrarAlternativas=false;
                this.mostrarVoF=true;
                if(!this.itemCodigo){
                    this.pregunta="";
                    this.valorRespuesta=null;
                    this.puntaje="";
                }
               
                break;
            case '702':
            this.mostrarDiv=true;
            this.mostrarAlternativas=true;
            this.mostrarVoF=false;
            if(!this.itemCodigo){
                this.pregunta="";
                this.listPregunta=[];
                this.puntaje="";
            }
              
                break;
            default:
                this.mostrarDiv=false;
                
        }        
    }

    onTipo(){
        
        let tipoPregunta =this.service.obtenerTiposPregunta().subscribe(

            (response: Response) => {
                
                this.tipoPregunta = response.resultado;
                this.loading = false; },
                (error) => this.controlarError(error)
        );
    }

    OnGuardar(){
        
        
        this.obtenerPregunta();
        

        forkJoin(validate(this.itemPregunta)).subscribe(([errors]:[any])=>{
            this.mensajes = [];
            
            if(errors.length>0){
                this.validarCampos();
                this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', {closeButton: true});
            }else{
                if(Number(this.puntaje)>20){
                    this.toastr.warning('Mensaje', 'El puntaje no puede ser mayor a 20', {closeButton: true});
                }else{
                    this.loading=true;
                    if(this.itemCodigo){
                        this.service.actualizar(this.itemPregunta).subscribe(
                            (response: Response) => {
                                this.itemPregunta = response.resultado;
                                this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                                this.router.navigate(['mantenimiento/preguntasCurso']); 
                                this.loading=false;
                            },(error) => this.controlarError(error) 
                        );
                    }else{
                        this.service.guardar(this.itemPregunta).subscribe(
                            (response: Response) => {
                                this.itemPregunta = response.resultado;
                                this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                                this.router.navigate(['mantenimiento/preguntasCurso']); 
                                this.loading=false;
                            },(error) => this.controlarError(error));
                    }
                }
                
            }
        
        }); 

        
      
    }

    permitirNumero(evento): void {
        if(!(evento.which>=48 && evento.which<=57))  
           evento.preventDefault();  
    }

    validarCampos(){
        
        this.errors = {};
        this.servicioValidacion.validacionObjeto(this.itemPregunta,this.errors);
      }

      Validar(objectForm) {
        
        this.servicioValidacion.validacionSingular(this.itemPregunta,objectForm,this.errors);
    }

    obtenerPregunta(){
        
        

        this.listRespuestaDetalle=this.listPregunta;
        if(this.itemCodigo){
            if(this.listaAuxiliar.length>0){
                for(let dato of this.listaAuxiliar){
                    
                    this.listRespuestaDetalle.push(dato);
    
                    this.listPregunta=this.listPregunta.filter(x=>x!=dato);
                }
            }
        }
        
        
        
        

        if(this.tipo=="701"){
            if(this.itemCodigo){
              
                for(let dat of this.listRespuestaDetalle){
                    dat.valorRespuesta=this.valorRespuesta;
                    dat.descPregunta=this.pregunta;
                    this.listRespuestaDetalle=this.listRespuestaDetalle.filter(x=>x=dat);
                }
                
                
            }else{
               
                this.selectDetalle= new PreguntaDetalle;
                
                this.selectDetalle.disponibilidad="1";
                this.selectDetalle.valorRespuesta=this.valorRespuesta;
                this.selectDetalle.descPregunta=this.pregunta;
                this.listRespuestaDetalle.push(this.selectDetalle);
            }
        }
      
        this.itemPregunta = new PreguntaCurso();
        this.itemPregunta.codPregunta=this.idPregunta;
        this.itemPregunta.nomCurso=this.nomCurso;
        this.itemPregunta.codCurso = this.idCurso;
        this.itemPregunta.tipo = this.tipo;
        this.itemPregunta.pregunta =this.pregunta;
       /*  if(this.valorRespuesta=="1"){
            this.itemPregunta.valorRespuesta=1;
        }else if(this.valorRespuesta=="0"){
            this.itemPregunta.valorRespuesta=2;
        }else{
            this.itemPregunta.valorRespuesta=0;
        }
     */
        this.itemPregunta.puntaje= this.puntaje;
        this.itemPregunta.listPregunta=this.listRespuestaDetalle;
        console.log(this.itemPregunta);

    }

    OnAgregar(){
        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
                
                codDetalle:this.listPregunta.length+1,
                
            }
        }
  
            this.bsModalRef = this.modalService.show(ModalAgregarOpcionesRespuestaComponent, config);
            (<ModalAgregarOpcionesRespuestaComponent>this.bsModalRef.content).onClose.subscribe((preguntaDetalle:PreguntaDetalle) => {
                this.listPregunta.push(preguntaDetalle);
               /*  this.listRespuestaDetalle=this.listPregunta; */
               this.paginacion.totalRegistros=this.listPregunta.length;
            });
  }

  OnModificar(preguntaDetalle:PreguntaDetalle){
    
    
    this.selectDetalle=preguntaDetalle;
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
           codDetalle:this.selectDetalle.codDetalle,
           descPregunta:this.selectDetalle.descPregunta,
           valorRespuesta:this.selectDetalle.valorRespuesta,
           disponibilidad:this.selectDetalle.disponibilidad,
           nomDisp:this.selectDetalle.nomDisp,
           nomResp:this.selectDetalle.nomResp,
        }
    }

        this.bsModalRef = this.modalService.show(ModalAgregarOpcionesRespuestaComponent, config);
        (<ModalAgregarOpcionesRespuestaComponent>this.bsModalRef.content).onClose.subscribe((preguntaDetalle:PreguntaDetalle) => {
            
            this.selectDetalle.descPregunta=preguntaDetalle.descPregunta;
            this.selectDetalle.valorRespuesta=preguntaDetalle.valorRespuesta;
            this.selectDetalle.nomResp=preguntaDetalle.nomResp;
            this.selectDetalle.disponibilidad=preguntaDetalle.disponibilidad;
            this.selectDetalle.nomDisp=preguntaDetalle.nomDisp;
            this.listPregunta=this.listPregunta.filter(x=>x=this.selectDetalle);
            /* this.listRespuestaDetalle=this.listPregunta; */
            this.paginacion.totalRegistros=this.listPregunta.length;
        });
}
    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
        
    }

    abrirBusqueda(){        
        const config = <ModalOptions>{
            ignoreBackdropClick: true,
            keyboard: false,
            initialState: {
               
            }
        }

            this.bsModalRef = this.modalService.show(ModalSeleccionarCursoComponent, config);
            (<ModalSeleccionarCursoComponent>this.bsModalRef.content).onClose.subscribe((preguntaCurso: PreguntaCurso) => {
                this.preguntaCurso = preguntaCurso;
                
                this.codCurso = this.preguntaCurso.codCurso;
                this.nomCurso=this.preguntaCurso.nomCurso;
                this.idCurso=this.preguntaCurso.idCurso;
     
            });
}

 cancelar(){
    this.router.navigate(['mantenimiento/preguntasCurso']); 
 }


 onEliminar(preguntaDetalle:PreguntaDetalle){
     
     this.selectDetalle=preguntaDetalle;
    
     
     for(let dato of this.listPregunta){
        if(dato.descPregunta==preguntaDetalle.descPregunta){
            if(dato.idDetalle>0){
                this.selectDetalle.disponibilidad="2";
       
                this.listaAuxiliar.push(this.selectDetalle);
                break;
            }
            
        } 
     }
     
     this.listPregunta=this.listPregunta.filter(x=>x!=this.selectDetalle);
     this.paginacion.totalRegistros=this.listPregunta.length;
     this.codAux=0;
     for(let dat of this.listPregunta){
         
       
            if(this.codAux>0){
                dat.codDetalle=0;
                dat.codDetalle=this.codAux+1;
                this.codAux=dat.codDetalle;
            }else{
                dat.codDetalle=0;
                dat.codDetalle=dat.codDetalle+1 ;
                this.codAux=dat.codDetalle;
            }
            
          
     } 

 }

 OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
  }
    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
    }
}
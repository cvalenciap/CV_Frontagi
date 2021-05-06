import { Component, OnInit,ViewChild,ElementRef } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { NgForm, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { DetalleAsistencia } from 'src/app/models/detalleasistencia';
import { EmpleadoAsistencia } from 'src/app/models/empleadoAsistencia';
import { ESTADO_REVISION, FormatoCarga } from 'src/app/constants/general/general.constants';
import { validate } from 'class-validator';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { forkJoin } from 'rxjs';


@Component({
    selector: 'app-modal-modificar-participantes',
    templateUrl: './modal-modificar-participantes.template.html',
    styleUrls: ['./modal-modificar-participantes.component.scss']
  })
  export class ModalModificarParticipantesComponent implements OnInit {

    public onClose: Subject<EmpleadoAsistencia>;
    detalleAsistenciaForm: FormGroup;
    busqueda:DetalleAsistencia;
    bsConfig: object;

    /** Datos **/
    deshabilitarCaja: boolean;
    valorCurso: string;
    valorSesion: string
    valorParticipante: string;
    valorJustificacion: string;
    valorDocumento: string;
    valorAsistencia: string;
    selectEmpleado:EmpleadoAsistencia= new EmpleadoAsistencia;
    listEmpleado:EmpleadoAsistencia;
    archivo: any;
    mensajearchivo: string;
    mensajes: any[];
    errors: any;
    rutaArchivo:any;
    nomArchivo:string;
    SizeFile:any;
    mostrar:boolean;
    mensajeFinal:string;
    valorEliminar:boolean;
    valorMensaje:boolean;
    descEliminar:string;
    desactivar:boolean;
    @ViewChild('filed')
    myInputVariable:ElementRef;
    /** Datos **/

    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService,
                private formBuilder: FormBuilder,
                private servicioValidacion: ValidacionService
            ) {
                    defineLocale('es', esLocale);
                    this.localeService.use('es');
                    this.mostrar=false;
                    this.nomArchivo="";
                    this.valorEliminar=false;
                    this.valorMensaje=false;
                   
    }

    ngOnInit() {
        this.onClose = new Subject();
        
        /* this.createForm(); */
        /* this.busqueda = new DetalleAsistencia(); */

        /** Datos **/
        
        this.deshabilitarCaja = true;
        this.valorCurso;
        this.valorSesion;
        this.selectEmpleado.nombreTrabajador=this.valorParticipante;
        this.selectEmpleado.justificacion=this.valorJustificacion;
        this.selectEmpleado.rutaDocumento=this.rutaArchivo;
        this.selectEmpleado.descEliminar=this.descEliminar;
        this.selectEmpleado.desactivar=this.desactivar;
        if(this.mensajearchivo=="" || this.mensajearchivo==undefined){
            this.mensajearchivo = "No se encuentra ningún archivo seleccionado";
            this.valorMensaje=true;
            this.mensajeFinal=this.mensajearchivo;
            this.mostrar=false;
        }else{

            this.mostrar=true;
        }
        
       
        if(this.selectEmpleado.rutaDocumento!=null){
            this.archivo=this.selectEmpleado.rutaDocumento;
        }
      
    }

   

    OnCancelar(){
        this.bsModalRef.hide();
    }

    controlarError(error) {
        console.error(error);
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }

    OnGrabar(){
        
        

        if(this.SizeFile!=null || this.SizeFile!=undefined){
            if(this.SizeFile<=10000000){
                this.listEmpleado= new EmpleadoAsistencia;
                this.listEmpleado.nombreArchivo=this.selectEmpleado.nombreArchivo;
                this.listEmpleado.justificacion=this.selectEmpleado.justificacion;
                this.listEmpleado.rutaDocumento=this.archivo;
                if(this.listEmpleado.nombreArchivo!=null && this.listEmpleado.nombreArchivo!=""){
                    this.listEmpleado.desactivar=true;
                }else{
                    this.listEmpleado.desactivar=false;
                }
                forkJoin(validate(this.listEmpleado)).subscribe(([errors]:[any])=>{
                    this.mensajes = [];
                    
                    if(errors.length>0){
                        this.validarCampos();
                        this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', {closeButton: true});
                    }else{
                        this.onClose.next(this.listEmpleado);
                        this.bsModalRef.hide();
                    }
                }); 
                
            }else{
                this.toastr.error("Debe adjuntar un documento menor de 10 mb", 'Acción inválida', {closeButton: true});
            }
           
        }else{
            this.listEmpleado= new EmpleadoAsistencia;
           
            if(this.valorEliminar){
                this.listEmpleado.nombreArchivo="";
                this.listEmpleado.descEliminar="2";
            }else if(this.valorMensaje){
                this.listEmpleado.descEliminar="";
                this.listEmpleado.nombreArchivo="";
                this.mostrar=false;
            }else{
                this.listEmpleado.nombreArchivo=this.mensajearchivo;
                this.listEmpleado.descEliminar="";
            }
            if(this.listEmpleado.nombreArchivo!=null && this.listEmpleado.nombreArchivo!=""){
                this.listEmpleado.desactivar=true;
            }else{
                this.listEmpleado.desactivar=false;
            }
            this.listEmpleado.justificacion=this.selectEmpleado.justificacion;
            this.listEmpleado.rutaDocumento=this.archivo;
           
           /*  forkJoin(validate(this.listEmpleado)).subscribe(([errors]:[any])=>{
                this.mensajes = [];
                
                if(errors.length>0){
                    this.validarCampos();
                    this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', {closeButton: true});
                }else{
                    
                    if(this.listEmpleado.nombreArchivo=="" || this.listEmpleado.nombreArchivo==this.mensajeFinal){
                        this.toastr.error("Debe adjuntar un documento PDF", 'Acción inválida', {closeButton: true});   
                    }else{ */
                        if(this.listEmpleado.justificacion!=null && this.listEmpleado.justificacion!=""){
                            if(this.listEmpleado.rutaDocumento!=null){
                                this.onClose.next(this.listEmpleado);
                                this.bsModalRef.hide();
                            }else{
                                this.toastr.error("Debe adjuntar un documento PDF", 'Acción inválida', {closeButton: true});   
                            }
                        }else{
                            if(this.listEmpleado.rutaDocumento==null){
                                this.onClose.next(this.listEmpleado);
                                this.bsModalRef.hide();
                            }else{
                                this.toastr.error("Falta completar la justificación", 'Acción inválida', {closeButton: true}); 
                            }
                        }
                   
             /*        }
                }
            });  */
        }
       
    }

    eliminar(){
        this.mensajearchivo = "No se encuentra ningún archivo seleccionado";
        this.selectEmpleado.justificacion="";
        this.archivo=null;
        this.mostrar=false;
        this.SizeFile=null;
        this.valorEliminar=true;
        
    }
    validarCampos(){
        
        this.errors = {};
        this.servicioValidacion.validacionObjeto(this.listEmpleado,this.errors);
      }

    OnAdjuntar(file: any) {
        console.log(file);
        
        this.SizeFile=file.target.files[0].size;
        if (file.target.files.length > 0) {
            
            if(this.SizeFile>10000000){
                this.toastr.warning('Solo se permite archivo PDF menos de 10mb', 'Atención', { closeButton: true });
                this.SizeFile=null;
                this.archivo=null;
                this.mensajearchivo="No se encuentra ningún archivo seleccionado";
            }else{
                if (FormatoCarga.pdf == file.target.files[0].type) {
                    
                    this.archivo = file.target.files[0];
                    this.mensajearchivo = file.target.files[0].name;
                    this.selectEmpleado.nombreArchivo=this.mensajearchivo;
                }else{
                    this.toastr.warning('Solo se permite archivo PDF', 'Atención', { closeButton: true });
                }  
            }

            
            
        }
        this.myInputVariable.nativeElement.value="";
    }


    validacionSingularDistinta(modelo: any, atributo: string, errorsGlobal: any) {
        validate(modelo).then(errors => {
            
            errorsGlobal[atributo] = "";
            if (errors.length > 0) {
                console.log("error singular", errors);
                errors.map(e => {
                    
                    if (e.property == atributo) {
                        errorsGlobal[e.property] = e.constraints[Object.keys(e.constraints)[0]];
                        return;
                    }
                });
            }
        });
    }
}
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
import { EmpleadoAsistencia } from 'src/app/models/empleadoAsistencia';
import { AsistenciaService } from 'src/app/services/impl/asistencia.service';

@Component({
    selector: 'app-detalle-sesion-empleado',
    templateUrl: './detalle-sesion-empleado.template.html',
    providers: [BandejaAsistenciaService]
})
export class DetalleSesionEmpleado implements OnInit {
    
    

    items: EmpleadoAsistencia[];
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
    selectParticipante:EmpleadoAsistencia;

    /** Datos **/
    deshabilitarCaja: boolean;
    valorCurso: string;
    valorSesion: string;
    /** Datos **/
    itemSesion:Sesion;
    idCurso:string;
    codCurso:string;
    nomCurso:string;
    idSesion:string;
    codSesion:number;
    nomSesion:string;
    idCapacitacion:number;
    itemColumna:number;
    listEmpleado:EmpleadoAsistencia[];
    EditRowID:any='';
    todosCheck:number;
    detalleEmpleado:EmpleadoAsistencia=new EmpleadoAsistencia;
    itemAsistencia:Asistencia=new Asistencia;
    listAsistencia:Asistencia[];
    valor:number;
    empleado:EmpleadoAsistencia= new EmpleadoAsistencia;

    listEmpleadoAux:EmpleadoAsistencia[];
    listEmpleadoDoc:EmpleadoAsistencia[];
    listEmpleadoAuxiliar:EmpleadoAsistencia[];
    mensj:boolean;
    mensj1:boolean;
    
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private service: AsistenciaService,
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
        this.itemSesion= new Sesion;
        this.idCurso="";
        this.codCurso="";
        this.nomCurso="";
        this.idCapacitacion=0;
        this.itemColumna=0;
        this.listEmpleado=[];
        this.idSesion="";
        this.codSesion=0;
        this.nomSesion="";
        this.todosCheck=0;
        this.selectParticipante=new EmpleadoAsistencia;
        this.listAsistencia=[];
        this.valor=null;
        this.listEmpleadoAux=[];
        this.listEmpleadoDoc=[];
        this.listEmpleadoAuxiliar=[];
        this.mensj=false;
        this.mensj1=false;
        
    }

    ngOnInit() {
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";

        
        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigoCapacitacion'];
          });
          this.itemSesion = JSON.parse(sessionStorage.getItem("sesion"));  
          if(this.itemSesion){
            this.nomCurso=this.itemSesion.nomCurso;
            this.idCapacitacion=this.itemSesion.idCapacitacion;
            this.idCurso=this.itemSesion.idCurso;
            this.idSesion=this.itemSesion.idSesion;
            this.codSesion=this.itemSesion.itemColumna;
            this.nomSesion=this.itemSesion.nombreSesion;
           // this.listEmpleado=this.itemSesion.listTrabajador;
          this.getLista();
           
          }
    }

    getLista(){
      
      
      const parametros: {idCurso?: string, idSesion?: string} = {idCurso: null, idSesion:null};
        parametros.idCurso= String(this.idCapacitacion);
        parametros.idSesion=this.idSesion;
         
         
      this.service.buscarEmpleadoSesion(parametros).subscribe(
          (response: Response) => {
              
              this.listEmpleado = response.resultado;

              this.itemColumna=0;
              
              for(let ind1 of this.listEmpleado){
                /* ind1.idSesion=this.itemSesion.idSesion;
                this.listEmpleado=this.listEmpleado.filter(x=>x=ind1); */
                if(ind1.idEstadoAsistencia=="1"){
                
                  this.seleccionarCheck(ind1);
                }
                if(ind1.archivoAntiguo!=null && ind1.archivoAntiguo!=""){
                  ind1.desactivar=true;
                  this.listEmpleado=this.listEmpleado.filter(x=>x=ind1);
                }
              }
  
         
  
              for(let ind of this.listEmpleado){
                  if(this.itemColumna>0){
                      ind.itemColumna=0;
                      ind.itemColumna=this.itemColumna+1;
                      this.itemColumna=ind.itemColumna;
                  }else{
                      ind.itemColumna=ind.itemColumna+1;
                      this.itemColumna=ind.itemColumna;
                  }
              } 
             },
          (error) => this.controlarError(error)
      );
  }

    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
      
    }

    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
     
    }

    OnRowClick(index, obj): void {
        
        this.selectedRow = index;
        this.selectedObject = obj;
        
    }

    OnGuardar(){
      
      this.loading = true;
        this.listEmpleadoAux=[];
        this.listEmpleadoDoc=[];
        this.itemAsistencia.idCapacitacion=this.idCapacitacion;
        this.itemAsistencia.idSesion=this.idSesion;
     
            
            for(let nom of this.listEmpleado){
      
              if(nom.rutaDocumento==null && nom.descEliminar!="2"){
                this.listEmpleadoAux.push(nom);
                
              }else{
                this.listEmpleadoDoc.push(nom);
              }
              
            } 
            


            if(this.listEmpleadoAux.length>0){
              
              this.itemAsistencia.listTrabajador=this.listEmpleadoAux;
    
              this.service.actualizar(this.itemAsistencia).subscribe(
                (response: Response) => {
                  
                  if(response.resultado = 'OK'){

                    if(this.listEmpleadoDoc.length>0){
                      for(let valor of this.listEmpleadoDoc){
                        this.listEmpleadoAuxiliar=[];
                        this.itemAsistencia.archivoAntiguo=valor.archivoAntiguo;
                        this.itemAsistencia.nombreArchivo=valor.nombreArchivo;
                        this.itemAsistencia.descEliminar=valor.descEliminar;
                        this.empleado=valor;
                        var ruta;
                        ruta=valor.rutaDocumento;
                        valor.rutaDocumento=null;
                        this.listEmpleadoAuxiliar.push(valor);
                       
                        this.itemAsistencia.listTrabajador=this.listEmpleadoAuxiliar;
                        this.service.crearDocumento(ruta,this.itemAsistencia).subscribe(
                          (response: Response) => {
                            
                              this.itemAsistencia = response.resultado;
                          
                            
                               /* this.router.navigate([`capacitacion/bandejaasistencia`]); */
                          },(error) => this.controlarError(error) 
                      );
                      }
            
                    }


                  }
                    this.itemAsistencia = response.resultado;
                   this.loading=false;
                    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                    this.router.navigate([`capacitacion/bandejaasistencia`]);
                },(error) => this.controlarError(error) 
            );
            }

       
      
      }
      
    

    cancelar(){
      this.router.navigate([`capacitacion/bandejaasistencia/detalle/${this.idCapacitacion}`]);
     }
     OnVerDetalle(sesion:Sesion){
        
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

    validaSeleccionados():boolean{
        let flag:boolean = true;
        for(let i:number = 0; this.listEmpleado.length > i ; i++){
          if(!this.listEmpleado[i].seleccionado){
            flag = false;
            break;
          }
        }
        return flag;
      }
    seleccionarTodos(){
            
            if(this.todosCheck==1){
              this.todosCheck = 0;
              this.valor=0;
              for(let ind of this.listEmpleado){
                ind.idEstadoAsistencia="0";
                ind.valor=0;
                
                this.listEmpleado=this.listEmpleado.filter(x=>x=ind);
              
            }
              this.listEmpleado.forEach(obj => {
                obj.seleccionado = 0;
              });
            }else{
              this.valor=1;
              this.todosCheck = 1;
              for(let ind of this.listEmpleado){

                if(!ind.desactivar){
                  ind.idEstadoAsistencia="1";
                  ind.valor=1;
                 
                  this.listEmpleado=this.listEmpleado.filter(x=>x=ind);
              }else{
                ind.idEstadoAsistencia="0";
                ind.valor=0;
               
                this.listEmpleado=this.listEmpleado.filter(x=>x=ind);
              }
                  
                
              }
              this.listEmpleado.forEach(obj => {
                if(!obj.desactivar){
                  obj.seleccionado = 1;
                }
               
              });
            }
            
          }

          seleccionarCheck(item:any){
            
            this.selectParticipante=item;
            if(item.seleccionado){
              
              for(let ind of this.listEmpleado){
                if(ind.nombreTrabajador==this.selectParticipante.nombreTrabajador){
                  
                  item.valor=0;
                  ind.idEstadoAsistencia="0";
                  this.listEmpleado=this.listEmpleado.filter(x=>x=ind);
                }
              }
              item.seleccionado = false;
              if(!this.validaSeleccionados()){
                this.todosCheck = 0;
               
              }
            }else{
              item.seleccionado = true;
              
              for(let ind of this.listEmpleado){
                if(ind.nombreTrabajador==this.selectParticipante.nombreTrabajador){
                 
                  item.valor=1;
                  ind.idEstadoAsistencia="1";
                  this.listEmpleado=this.listEmpleado.filter(x=>x=ind);
                }
              }
              if(this.validaSeleccionados()){
                this.todosCheck = 1;
                
              }
              
            }
          }


          OnModificar(asistencia:EmpleadoAsistencia){
            this.selectParticipante=asistencia;
            
            
            if(this.selectParticipante.idEstadoAsistencia==null){
              this.selectParticipante.idEstadoAsistencia=="0";
            }
            const config = <ModalOptions>{
                ignoreBackdropClick: true,
                keyboard: false,
                initialState: {
                  valorCurso:this.nomCurso,
                  valorSesion:this.nomSesion,
                  valorParticipante:this.selectParticipante.nombreTrabajador,
                  valorJustificacion:this.selectParticipante.justificacion,
                  valorAsistencia:this.selectParticipante.idEstadoAsistencia,
                  rutaArchivo:this.selectParticipante.rutaDocumento,
                  mensajearchivo:this.selectParticipante.nombreArchivo,
                  descEliminar:this.selectParticipante.descEliminar,
                  desactivar:this.selectParticipante.desactivar,
                }
            }
        
                this.bsModalRef = this.modalService.show(ModalModificarParticipantesComponent, config);
                (<ModalModificarParticipantesComponent>this.bsModalRef.content).onClose.subscribe((listEmpleado:EmpleadoAsistencia) => {
                    
                  this.detalleEmpleado=listEmpleado;
                    
                    for(let ind of this.listEmpleado){
                      if(ind.nombreTrabajador==this.selectParticipante.nombreTrabajador){
                        ind.rutaDocumento=this.detalleEmpleado.rutaDocumento;
                        ind.nombreArchivo=this.detalleEmpleado.nombreArchivo;
                        ind.justificacion=this.detalleEmpleado.justificacion;
                        ind.idEstadoAsistencia=this.selectParticipante.idEstadoAsistencia;
                        ind.descEliminar=this.detalleEmpleado.descEliminar;
                        ind.desactivar=this.detalleEmpleado.desactivar;
                        this.listEmpleado=this.listEmpleado.filter(x=>x=ind);
                       
                      }
                    }
                    
                });
        }

}
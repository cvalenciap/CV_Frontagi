import { Component, OnInit } from '@angular/core';

//import { DetalleProgramacion } from 'src/app/models/detalleprogramacion';
import { Paginacion, Tipo } from './../../../../../app/models';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {Response} from './../../../../models/response';
//import { EvaluacionEditorMockService as EvaluacionEditorService} from './../../../../services/index';
import { Constante, Estado } from 'src/app/models/enums';
import { EvaluacionEditorService, ParametrosService, GeneralService } from '../../../../services';
  
import { EvaluacionEditor } from 'src/app/models/evaluacioneditor';
import { _getComponentHostLElementNode } from '@angular/core/src/render3/instructions';
import { Pregunta } from 'src/app/models/pregunta';
//import { ModalDetalleProgramacionComponent } from '../../modales/modal-detalle-programacion/modal-detalle-programacion.component';




@Component({
  selector: 'app-registrar-evaluacion',
  templateUrl: './registrar-evaluacion.component.html',
  styleUrls: ['./registrar-evaluacion.component.scss']
})
export class RegistrarEvaluacionComponent implements OnInit {


  fechaProgramacionDefecto:string;
  usuarioCreacionDefecto:string;

  items2: Pregunta[];
  items3: Pregunta[];
   /* datos */
   items: string[];
   /* filtros */
   textoBusqueda: string;
   parametroBusqueda: string;
   /* paginación */
   paginacion: Paginacion;
   /* registro seleccionado */
   selectedRow: number;
   //selectedObject: RutaResponsable;
   /* indicador de carga */
   //loading: boolean; 
   itemCodigo: string;
    /* datos */

    //selectedObject: DetalleProgramacion;
    listaTipos: Tipo[];
    item: EvaluacionEditor;
    private sub: any;
    bsModalRef: BsModalRef;
    rolConstante:any;
    evaluar:boolean;

    evaAud:EvaluacionEditor;


  constructor(
    
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: EvaluacionEditorService,
    private modalService: BsModalService,
    private serviceParametro: ParametrosService,
    private generalService: GeneralService,

  ){ 
     // this.loading = false;
      this.selectedRow = -1;
      this.items = []; 
      this.parametroBusqueda = 'codigo';
      this.paginacion = new Paginacion({registros: 10});

        defineLocale('es', esLocale);
        this.localeService.use('es');
      this.selectedRow = -1;
      this.items2 = [];
  }
   


 


  ngOnInit() {

    this.items2 = [];
    this.rolConstante = {}; 

    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = params['codigo'];  
      
    });
    this.item=new EvaluacionEditor();

    if(this.itemCodigo) {
      console.log('entraaa');
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
        (response: Response) => {
         
        
          this.item = response.resultado;

          console.log(this.item.idEvaluadi);
          
          this.serviceParametro.obtenerParametroPadre(Constante.LISTA_AUDITORES).subscribe(
            (response: Response) => {
              let resultado = response.resultado;
              this.rolConstante = resultado.find((r:any) => r.idconstante == this.item.colaborador.idRolAuditor);
              console.log("resultadoo",resultado); 
            },
            (error) => this.controlarError(error)
          ); 
  
        },
        (error) => this.controlarError(error)
      );
    } 
    
    else {   
      this.item = this.service.crear();
    }
 
    
   this.getLista();

}



getLista(): void {

  //this.loading = true;
  const parametros: {n_rol_auditor?: number,n_idEvaAuditor? :number} = {n_rol_auditor: null,n_idEvaAuditor:null};
  
  this.service.buscarAspectosPorRolCount(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
    (response: Response) => {
 
        this.items3 = response.resultado;  
        
        console.log(this.items3);
        if(this.items3.length>0){
          //this.items2 = this.generalService.agregarItem(response.resultado,response.paginacion);
          parametros.n_rol_auditor = this.item.colaborador.idRolAuditor;
          parametros.n_idEvaAuditor = this.item.idEvaluadi;
          this.service.buscarAspectosPorRolRes(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items2 = response.resultado;   
                if(this.items2.length>0){
                  this.items2 = this.generalService.agregarItem(response.resultado,response.paginacion);
            
                }
                this.paginacion = new Paginacion(response.paginacion);
                //this.loading = false;
               },
            
            (error) => this.controlarError(error)
            );

        }
        else{
          parametros.n_rol_auditor = this.item.colaborador.idRolAuditor;
          this.service.buscarAspectosPorRol(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
        
                this.items2 = response.resultado;        
                if(this.items2.length>0){
                  this.items2 = this.generalService.agregarItem(response.resultado,response.paginacion);       
                }
            
                this.paginacion = new Paginacion(response.paginacion);
                //this.loading = false;
               },
            (error) => this.controlarError(error)
          );

        }
      
      
      },
    
    (error) => this.controlarError(error)
    );
}



OnGuardar() {
          
 //preguntar si es evauar por primera vez
 //this.loading = true;
 const parametros: {n_rol_auditor?: number,n_idEvaAuditor? :number} = {n_rol_auditor: null,n_idEvaAuditor:null};
 this.service.buscarAspectosPorRolCount(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
  (response: Response) => {

      this.items3 = response.resultado;  
      
      console.log(this.items3);
      if(this.items3.length>0){
       //actualiza
      
       this.service.actualizar(this.item, this.items2).subscribe(
        (response: Response) => {
           let respuesta = response.resultado;
            this.toastr.success('Registro Actualizado', 'Acción completada!', {closeButton: true});
            this.router.navigate([`auditoria/evaluacion-editor`]);
        },
          (error) => this.controlarError(error)
      );
   

      }
      else{
      // guarda
       
    this.service.registrar(this.item, this.items2).subscribe(
      (response: Response) => {
         let respuesta = response.resultado;
          this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
          this.router.navigate([`auditoria/evaluacion-editor`]);
      },
        (error) => this.controlarError(error)
    );
 

      }
 
    },
  
  (error) => this.controlarError(error)
  );

    
}

OnImprimir(){
  
 //this.loading = true;
 const parametros: {n_rol_auditor?: number,n_idEvaAuditor? :number} = {n_rol_auditor: null,n_idEvaAuditor:null};
 this.service.ImprimirEvaluacion(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
  (response: Response) => {
   // this.loading = false;
  
    },
  
  (error) => this.controlarError(error)
  );

}

ingresarRespuesta(item: Pregunta,valor: any){

  item.rNum =valor;
 
}


controlarError(error) {
  console.error(error);

}




  



  OnRegresar() {
    this.router.navigate([`auditoria/evaluacion-editor`]);
}

}

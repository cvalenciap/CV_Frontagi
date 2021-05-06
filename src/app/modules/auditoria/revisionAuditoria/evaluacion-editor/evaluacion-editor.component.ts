import { Component, OnInit, Inject,SecurityContext} from '@angular/core';
import { EvaluacionEditor } from './../../../../models/evaluacionEditor';
import { Paginacion } from 'src/app/models';
import { Router } from '@angular/router';
import { Response } from './../../../../models/response';
import { BsLocaleService, BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DomSanitizer } from '@angular/platform-browser';
//import { EvaluacionEditorMockService as EvaluacionEditorService} from './../../../../services/index';
//import { ModalBusquedaAvanzEvaluacionEditorComponent } from '../modal-busqueda-avanz-evaluacion-editor/modal-busqueda-avanz-evaluacion-editor.component';
import { EvaluacionEditorService } from '../../../../services';
import { ModalBusquedaAvanzEvaluacionEditorComponent } from '../modal-busqueda-avanz-evaluacion-editor/modal-busqueda-avanz-evaluacion-editor.component';

  
@Component({
  selector: 'evaluacion-editor',
  templateUrl: './evaluacion-editor.component.html',
  styleUrls: ['./evaluacion-editor.component.scss'],
  providers: [EvaluacionEditorService]
})
export class EvaluacionEditorComponent implements OnInit {
    
  [x: string]: any; 
  items: EvaluacionEditor[];
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: EvaluacionEditor;
  /* indicador de carga */
  loading: boolean;
  opcionBusqueda:string;
  selectedFilter: string;
  busquedaEvaluacionEditor: EvaluacionEditor;
  mensajeAlerta:string;
  mostrarAlerta:boolean;

  selectedCriterioRow:number;
  nuevo:boolean;
 
  busquedaEvaAuditor: EvaluacionEditor;

  constructor(
    LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private service: EvaluacionEditorService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer) {

      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
      this.selectedFilter = 'numeroFicha';
      this.selectedCriterioRow = -1
      this.paginacion = new Paginacion({registros: 10});
     }

  ngOnInit() {
    this.mostrarAlerta = false;  
    this.mensajeAlerta = "";
    this.inicializandoParametros();  
    this.getLista();
  }
   
  inicializandoParametros(){
    this.valorNumeroFicha = "";
    this.valorApellidoPat = "";
    this.valorApellidoMat = "";
    this.valorNombre = "";
}

  getLista(): void {

    this.loading = true;
    const parametros: {numeroFicha?: string, apellidoPaterno?: string, apellidoMaterno?: string, nombre?: string} = {numeroFicha: null, apellidoPaterno: null, apellidoMaterno: null, nombre: null};
    switch (this.selectedFilter) {
            case 'numeroFicha':   
            console.log(this.valorNumeroFicha);

            parametros.numeroFicha =this.valorNumeroFicha;

            
            break;
            case 'apellidoPaterno':     
            parametros.apellidoPaterno = this.valorApellidoPat;
            break;
            case 'apellidoMaterno':     
            parametros.apellidoMaterno = this.valorApellidoMat;
            break;
            case 'nombre':     
            parametros.
            nombre = this.valorNombre;
            break;
            //12/02/2019
            case 'avanzada':
            if(this.busquedaEvaluacionEditor.colaborador.numeroFicha != ""){
                parametros.numeroFicha = this.busquedaEvaluacionEditor.colaborador.numeroFicha;
            }
            if(this.busquedaEvaluacionEditor.colaborador.apellidoPaterno != undefined && this.busquedaEvaluacionEditor.colaborador.apellidoPaterno != null){
                parametros.apellidoPaterno = (this.busquedaEvaluacionEditor.colaborador.apellidoPaterno);
            } 
       
            if(this.busquedaEvaluacionEditor.colaborador.apellidoMaterno != undefined && this.busquedaEvaluacionEditor.colaborador.apellidoMaterno != null){
                parametros.apellidoMaterno = (this.busquedaEvaluacionEditor.colaborador.apellidoMaterno);
            } 
            
            if(this.busquedaEvaluacionEditor.colaborador.nombre != undefined && this.busquedaEvaluacionEditor.colaborador.nombre != null){
                parametros.nombre = (this.busquedaEvaluacionEditor.colaborador.nombre);
            } 
        console.log(parametros);
  
           
    }

    this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
           
            this.items = response.resultado;
            
            this.paginacion = new Paginacion(response.paginacion);
            this.loading = false; },
        (error) => this.controlarError(error)
    );


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
    console.log(index);
    console.log(obj);
 }
 OnBuscar(): void {

    let texto:string = "<strong>Busqueda Por: </strong>";
    
    switch (this.selectedFilter) {        
            case 'numeroFicha':
            texto = texto + "<br/><strong>Número Ficha: </strong>"+this.valorNumeroFicha;
            break;
            case 'apellidoPaterno':
            texto = texto + "<br/><strong>Apellido Paterno: </strong>"+this.valorApellidoPat;
            break;
            case 'apellidoMaterno': 
            texto = texto + "<br/><strong>Apellido Materno: </strong>"+this.valorApellidoMat;
            break;
            case 'nombre':
            texto = texto + "<br/><strong>Nombre : </strong>"+this.valorNombre;
            break;
 
        case 'avanzada':
            if(this.busquedaEvaluacionEditor.colaborador.numeroFicha != ""){
                texto = texto + "<br/><strong>Número Ficha: </strong>"+this.busquedaEvaluacionEditor.colaborador.numeroFicha+" ";
            }
            if(this.busquedaEvaluacionEditor.colaborador.apellidoPaterno != ""){
                texto = texto + "<br/><strong>Apellido Paterno: </strong>"+this.busquedaEvaluacionEditor.colaborador.apellidoPaterno+" ";
            }  
            if(this.busquedaEvaluacionEditor.colaborador.apellidoMaterno != ""){
                texto = texto + "<br/><strong>Apellido Materno: </strong>"+this.busquedaEvaluacionEditor.colaborador.apellidoMaterno+" ";
            }
            if(this.busquedaEvaluacionEditor.colaborador.nombre != ""){
                texto = texto + "<br/><strong>Nombre: </strong>"+this.busquedaEvaluacionEditor.colaborador.nombre+" ";
            }     
            break;
   
    }
    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    this.getLista();
}

setFilter(filter: string) {
    this.selectedFilter = filter;
    console.log(this.selectedFilter);
}
  
onEliminar(itemSeleccionado:EvaluacionEditor):void{
   
    
   console.log(itemSeleccionado);

    this.service.eliminar(itemSeleccionado).subscribe(
        (response: Response) => {
            console.log(this.paginacion.totalPaginas.toString());
            this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
            this.getLista(); 
            this.selectedRow = -1;
            this.selectedObject = null;
            this.loading = false;
        },
        (error) => this.controlarError(error)
    );


  }

//creo q esta demas
  seleccionCriterio(index, obj){
    this.selectedRow = index;
    this.selectedCriterio = obj;
  }

abrirBusqueda(){
    this.selectedFilter = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
           
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalBusquedaAvanzEvaluacionEditorComponent, config);
    (<ModalBusquedaAvanzEvaluacionEditorComponent>this.bsModalRef.content).onClose.subscribe(result => {
        this.busquedaEvaluacionEditor = result;
        console.log(this.busquedaEvaluacionEditor);
        this.OnBuscar();
    });
    
}


OnModificar(itemSeleccionado:EvaluacionEditor): void {    
this.router.navigate([`auditoria/evaluacion-editor/editar/${itemSeleccionado.auditoria.idAuditoria}`]);
}
 
OnEvaluar(): void {
    console.log(this.selectedObject);
    /* this.router.navigate([`auditoria/evaluacion-editor/evaluar/${this.selectedObject.auditoria.idAuditoria}`]); */
    this.router.navigate([`auditoria/evaluacion-editor/evaluar/1`]);
}

controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}


}

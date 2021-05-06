import { Component, OnInit, SecurityContext, ɵConsole } from '@angular/core';
import { Paginacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Response } from './../../../../models/response';  
import { BsLocaleService, BsModalRef,ModalOptions,BsModalService } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { forkJoin } from 'rxjs';
import { BandejaRevisionInforme } from 'src/app/models/bandejarevisioninforme';

import { ModalBusquedaAvazBandjComponent } from '../modal-busqueda-avaz-bandj/modal-busqueda-avaz-bandj.component';



@Component({
  selector: 'bandeja-revision-informe',
  templateUrl: './bandeja-revision-informe.component.html',
  styleUrls: ['./bandeja-revision-informe.component.scss'],
  providers:[]
})
export class BandejaRevisionInformeComponent implements OnInit {

    [x: string]: any; 
   /* datos */
   items: string[];
   /* filtros */
   textoBusqueda: string;
   parametroBusqueda: string;
   /* paginación */
   paginacion: Paginacion;
   /* registro seleccionado */
   selectedRow: number;
   selectedObject: BandejaRevisionInforme;
   /* indicador de carga */
   loading: boolean;
   itemCodigo: number;
    /* datos */
    item: BandejaRevisionInforme;
    private sub: any;
    bsModalRef: BsModalRef;
    listaDocumentosRelacionados=[];
    listaDocRel=[];
    listaAuditores:any[];

    valorNumeroAuditoria:string;
    valorAuditor:string;

    mostrarAlerta:boolean;
    mensajeAlerta:string;
    selectedFilter: string;
    
    opcionBusqueda:string;

    busquedaRevisionInforme: BandejaRevisionInforme;


  constructor(
    LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
      this.selectedFilter = 'numeroFicha';
     // this.selectedCriterioRow = -1
      
      this.selectedFilter = 'numeroAuditor';
       this.parametroBusqueda = 'numeroAuditor';
       this.opcionBusqueda = "";
      this.paginacion = new Paginacion({registros: 10}); }

      ngOnInit() {
        this.listaAuditores = [];
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
        this.inicializandoParametros();
        this.obtenerParametros();
        this.getLista();
      }

      obtenerParametros(){
        const buscaAuditores = this.service.obtenerAuditores();
    
        forkJoin(buscaAuditores)
        .subscribe(([buscaAuditores]:[Response])=>{
          this.listaAuditores = buscaAuditores.resultado;    
        },
        (error) => this.controlarError(error));
    }
  
    inicializandoParametros(){
       /* this.valorNumeroFicha = "";
        this.valorApellidoPat = "";
        this.valorApellidoMat = "";
        this.valorNombre = "";
        */
    }

getLista(): void {
    this.loading = true;
    const parametros: {numeroAuditor?: string, apellidoPat?: string, apellidoMat?: string, nombre?: string} = {numeroAuditor: null, apellidoPat: null, apellidoMat: null, nombre: null};
    switch (this.parametroBusqueda) {

        case 'numeroAuditor':
            parametros.numeroAuditor = this.valorNumeroAuditor;
            break;

        case 'apellidoPat':
            parametros.apellidoPat = this.valorApellidoPat;
            break;

        case 'apellidoMat':
            parametros.apellidoMat = this.valorApellidoMat;
            break;

        case 'nombre': 
            parametros.nombre = this.valorNombre;
            break;      
    }
       
    this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {          
          this.items = response.resultado;
          this.paginacion = new Paginacion(response.paginacion);
          this.loading = false; },
      (error) => this.controlarError(error)
  );
  
  }


  activarOpcion(accion:number){
    this.opcionBusqueda = "";
    switch(accion){
      case 1: this.parametroBusqueda = "numeroAuditoria"; break;
      case 2: this.parametroBusqueda = "auditor"; break;
     
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
}

obtenerValorAuditores(valor:string){
    let valorAuditor= this.listaAuditores.find(item => item.idAuditor == valor);    
    return valorAuditor.nombreAuditor;
}



   OnBuscar(): void {
    let texto:string = "<strong>Busqueda Por: </strong>";
    
    switch (this.selectedFilter) {        
            case 'numeroAuditor':
            texto = texto + "<br/><strong>Número Auditor: </strong>"+this.valorNumeroFicha;
            break;
            case 'apellidoPat':
            texto = texto + "<br/><strong>Apellido Paterno: </strong>"+this.valorApellidoPat;
            break;
            case 'apellidoMat': 
            texto = texto + "<br/><strong>Apellido Materno: </strong>"+this.valorApellidoMat;
            break;
            case 'nombre':
            texto = texto + "<br/><strong>Nombre : </strong>"+this.valorNombre;
            break;

        case 'avanzada':
            if(this.busquedaRevisionInforme.numeroAuditor != ""){
                texto = texto + "<br/><strong>Número Auditor: </strong>"+this.busquedaRevisionInforme.numeroAuditor+" ";
            }
            if(this.busquedaRevisionInforme.apellidoPat != ""){
                texto = texto + "<br/><strong>Apellido Paterno: </strong>"+this.busquedaRevisionInforme.apellidoPat+" ";
            }  
            if(this.busquedaRevisionInforme.apellidoMat != ""){
                texto = texto + "<br/><strong>Apellido Materno: </strong>"+this.busquedaRevisionInforme.apellidoMat+" ";
            }
            if(this.busquedaRevisionInforme.nombre != ""){
                texto = texto + "<br/><strong>Nombre: </strong>"+this.busquedaRevisionInforme.nombre+" ";
            }     
            break;
   
    }
    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    this.getLista();
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
    this.bsModalRef = this.modalService.show(ModalBusquedaAvazBandjComponent, config);
    (<ModalBusquedaAvazBandjComponent>this.bsModalRef.content).onClose.subscribe(result => {
        this.busquedaRevisionInforme = result;        
        this.OnBuscar();
    });
    
}



OnVerificar(obj): void {
    /* this.selectedObject = obj; */
    this.router.navigate([`auditoria/bandeja-revision-informe/verificar/${obj}`]);
}
  
onEliminar():void{    
    this.service.eliminar(this.selectedObject).subscribe(
        (response: Response) => {            
            this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
            this.getLista();
            this.loading = false;
        },
        (error) => this.controlarError(error)
    );
}
controlarError(error) {      
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}


}

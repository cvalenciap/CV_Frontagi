import { Component, OnInit, SecurityContext } from '@angular/core';

import { Paginacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { Router } from '@angular/router';
import { Response } from 'src/app/models/response';  
import { BsLocaleService, ModalOptions, BsModalService } from 'ngx-bootstrap';
import { BandejaRevisionAuditoria } from 'src/app/models/bandejarevisionauditoria';
//import { BandejaRevisionAuditoriaMockService as BandejaRevisionAuditoriaService} from '../../../../services/index
import { DomSanitizer } from '@angular/platform-browser';

@Component({
  selector: 'bandeja-seguimiento-plan-auditoria',
  templateUrl: './bandeja-seguimiento-plan-auditoria.component.html',
  styleUrls: ['./bandeja-seguimiento-plan-auditoria.component.scss']
})
export class BandejaSeguimientoPlanAuditoriaComponent implements OnInit {


   [x: string]: any; 

   fechaRevisionAuditoriaDefecto:string; 
   usuarioCreacionDefecto:string;
   /* datos */
   items: string[];
   /* filtros */
   textoBusqueda: string;
   parametroBusqueda: string;
   /* paginación */
   paginacion: Paginacion;
   /* registro seleccionado */
   selectedRow: number;
   selectedObject: BandejaRevisionAuditoria;

    
   busquedaRevisionAuditoria:BandejaRevisionAuditoria;


   

   /* indicador de carga */
   loading: boolean;
   itemCodigo: number;
  
    item: BandejaRevisionAuditoria;
    private sub: any;

    listaDocumentosRelacionados=[];
    listaDocRel=[];
    opcionBusqueda:string;

  listaAuditores:any[];
  listaEquipos:any[];
  valorAuditor:string;
  valorEquipo:string;

  mostrarAlerta:boolean;
  mensajeAlerta:string;

  constructor(
    LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    //private service: BandejaRevisionAuditoriaService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
 
      this.parametroBusqueda = "auditor";
      this.opcionBusqueda = "";

      this.selectedFilter = 'apellidoPat';

      this.valorAuditor="";
      this.valorEquipo="";
      //this.opcionBusqueda = "";
      this.paginacion = new Paginacion({registros: 10}); }

      ngOnInit() {
        /* this.getLista();
        this.mostrarAlerta = false;  
        this.mensajeAlerta = ""; */

      // this.listaAuditores = [];
        /* this.listaEquipos = [];
        this.inicializandoParametros(); */  
        //this.obtenerParametros();
      }

      inicializandoParametros(){
       // this.valorAuditor = "";
        this.valorApellidoPat = "";
        this.valorApellidoMat = "";
        this.valorNombre = "";
        this.valorEquipo = "";       
    }
    
    
      getLista(): void {
        this.loading = true;
        const parametros: {apellidoPat?: string, apellidoMat?: string, nombre?: string, equipo?: string} = { apellidoPat: null, apellidoMat: null, nombre: null, equipo: null};
        switch (this.parametroBusqueda) {
           /* case 'auditor':
                parametros.auditor = this.valorAuditor;
                break;*/
            case 'apellidoPat':
                parametros.apellidoPat = this.valorApellidoPat;
                break;
    
            case 'apellidoMat':
                parametros.apellidoMat = this.valoreApellidoMat;
                break;
    
            case 'nombre': 
                parametros.nombre = this.valorNombre;
                break;    
                     
            case 'equipo':
                parametros.equipo = this.valorEquipo;
                break;              
        }      
        /* this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false; },
            (error) => this.controlarError(error)
        ); */
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
/*
OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getLista();
}
*/

OnBuscar(): void {

    let texto:string = "<strong>Busqueda Por: </strong>";
    switch (this.selectedFilter) {
        /*case 'auditor':
            texto = texto + "<br/><strong>Auditor: </strong>"+this.obtenerValorAuditor(this.valorAuditor);
            break;*/
            case 'apellidoPat':
            texto = texto + "<br/><strong>Apellido Paterno: </strong>"+this.valorApellidoPat;
            break;
            case 'apellidoMat': 
            texto = texto + "<br/><strong>Apellido Materno: </strong>"+this.valorApellidoMat;
            break;
            case 'nombre':
            texto = texto + "<br/><strong>Nombre : </strong>"+this.valorNombre;
            break;
            case 'numeroAuditoria':
            texto = texto + "<br/><strong>Número Auditoría : </strong>"+this.valorNumeroAuditoria;
            break;
            case 'numeroLV':
            texto = texto + "<br/><strong>Número LV : </strong>"+this.valorNumeroLV;
            break;
            case 'numeroInformeAuditoria':
            texto = texto + "<br/><strong>Número Informe Auditoría : </strong>"+this.valorNumeroInformeAuditoria;
            break;
            case 'equipo':
            texto = texto + "<br/><strong>Equipo: </strong>"+this.obtenerValorEquipo(this.valorEquipo);
            break;
          
        case 'avanzada':
        if(this.busquedaRevisionAuditoria.apellidoPat!= ""){
            texto = texto + "<br/><strong>Apellido Paterno: </strong>"+this.busquedaRevisionAuditoria.apellidoPat+" ";
        }  
        if(this.busquedaRevisionAuditoria.apellidoMat != ""){
            texto = texto + "<br/><strong>Apellido Materno: </strong>"+this.busquedaRevisionAuditoria.apellidoMat+" ";
        }
        if(this.busquedaRevisionAuditoria.nombre != ""){
            texto = texto + "<br/><strong>Nombre: </strong>"+this.busquedaRevisionAuditoria.nombre+" ";
        }   
        if(this.busquedaRevisionAuditoria.numeroAuditoria != ""){
            texto = texto + "<br/><strong>Número Auditoría: </strong>"+this.busquedaRevisionAuditoria.numeroAuditoria+" ";
        }   
        if(this.busquedaRevisionAuditoria.numeroLV != ""){
            texto = texto + "<br/><strong>Numero de Verificación: </strong>"+this.busquedaRevisionAuditoria.numeroLV+" ";
        }   
        if(this.busquedaRevisionAuditoria.numeroInformeAuditoria != ""){
            texto = texto + "<br/><strong>Numero de Informe Auditoría: </strong>"+this.busquedaRevisionAuditoria.numeroInformeAuditoria+" ";
        }       
        
        if(this.busquedaRevisionAuditoria.equipo){ 
                texto = texto + "<br/><strong>Equipo: </strong>"+this.obtenerValorEquipo(this.busquedaRevisionAuditoria.equipo);
        }
         break;
    }  


    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    this.getLista();
  }


OnRevisionListaVer(): void {
  this.router.navigate([`consultaAuditoria/seguimiento-plan-auditoria/listaVer/1`]);
}

onEliminar():void{
    /*console.log(this.parametroBusqueda);*/
    this.service.eliminar(this.selectedObject).subscribe(
        (response: Response) => {
            console.log(this.paginacion.totalPaginas.toString());
            this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
            this.getLista();
            this.loading = false;
        },
        (error) => this.controlarError(error)
    );
}
controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}

OnRegresar() { 
    this.router.navigate([`auditoria/registrar-bandeja-revision/nuevo`]);
}

//busqueda avanzada
/* obtenerParametros(){
   //const buscaAuditores = this.service.obtenerAuditores();
    const buscaEquipos = this.service.obtenerEquipos();   
    forkJoin(buscaEquipos)
    .subscribe(([buscaEquipos]:[Response,Response])=>{      
      //this.listaAuditores = buscaAuditores.resultado;
      this.listaEquipos = buscaEquipos.resultado;         
    },  
    (error) => this.controlarError(error));
} */


obtenerValorEquipo(valor:string){
    let valorEquipo= this.listaEquipos.find(item => item.valorEquipo == valor);
    return valorEquipo.descripcionEquipo; 
}

activarOpcion(accion:number){
    this.opcionBusqueda = "";
    switch(accion){
      case 1: this.parametroBusqueda = "auditor"; break;
      case 2: this.parametroBusqueda = "equipo"; break;
     
    }
  }


  setFilter(filter: string) {
    this.selectedFilter = filter;
    console.log(this.selectedFilter);
}

  /* abrirBusqueda(){
    this.selectedFilter = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalBusquedaAvanzRevisionAuditoriaComponent, config);
    (<ModalBusquedaAvanzRevisionAuditoriaComponent>this.bsModalRef.content).onClose.subscribe(result => {
        this.busquedaRevisionAuditoria = result;
        this.OnBuscar();

    });
  } */

  
}

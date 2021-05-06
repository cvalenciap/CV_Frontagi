import { Component, OnInit,SecurityContext } from '@angular/core';

import { Paginacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Response } from './../../../../models/response';    
import { DeteccionHallazgos } from '../../../../models/deteccionhallazgos';
import { DetalleDeteccionHallazgosService, GeneralService} from './../../../../services';
import { ModalDeteccionHallazgosComponent } from '../registrar-deteccion-hallazgos/modal-deteccion-hallazgos/modal-deteccion-hallazgos.component';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions, } from 'ngx-bootstrap';
//import { ModalDetalleProgramacionComponent } from '../../modales/modal-detalle-programacion/modal-detalle-programacion.component';
import {MatListModule} from '@angular/material/list';
import { RequisitoAuditoria } from 'src/app/models/requisitoauditoria';
import { forkJoin } from 'rxjs';
import { ModalBusquedaAvanzDeteccionesComponent } from '../modal-busqueda-avanz-detecciones/modal-busqueda-avanz-detecciones.component';


import { DomSanitizer } from '@angular/platform-browser';
import { NombreParametro } from 'src/app/constants/general/general.constants';

@Component({
  selector: 'deteccion-hallazgos',
  templateUrl: './deteccion-hallazgos.component.html',
  styleUrls: ['./deteccion-hallazgos.component.scss'],
  providers: [DetalleDeteccionHallazgosService]
})
export class DeteccionHallazgosComponent implements OnInit {
    [x: string]: any;
   
  fechaProgramacionDefecto:string;
  usuarioCreacionDefecto:string;
   /* datos */
   items: DeteccionHallazgos[];
   valorModal: DeteccionHallazgos;

   /* filtros */
   textoBusqueda: string;
   parametroBusqueda: string;
   /* paginación */
   paginacion: Paginacion;
   /* registro seleccionado */
   selectedRow: number;
   selectedObject: DeteccionHallazgos;
   /* indicador de carga */
   loading: boolean;
   itemCodigo: number;
    /* datos */

    item: DeteccionHallazgos;
    private sub: any;
    //bsModalRef: BsModalRef;

   
    listaDocumentosRelacionados=[];
    listaDocRel=[];


    //busqueda avanzada
    listaTipos:any[];
    listaOrigenDetectado:any[];
    listaDetector:any[];
    listaEstado:any[];  

    valorPrograma: string;
    valorTipo:string;
    valorOrigenDet:string;
    valorDetector:string;
    valorEstado:string;

    mostrarAlerta:boolean;
    mensajeAlerta:string;

    

    busquedaDeteccionHallazgos:DeteccionHallazgos;
   

  constructor(
    LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private service: DetalleDeteccionHallazgosService,
    private generalService:GeneralService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer) 
    
    
    {
      this.loading = false;
      this.selectedRow = -1;
      this.items = []; 
      this.parametroBusqueda = 'tipo';  
      this.opcionBusqueda = "";
      this.valorTipo="";
      this.valorOrigenDet="";
      this.valorDetector="";
      this.valorEstado="";     
      this.paginacion = new Paginacion({registros: 10});
    
    }

      ngOnInit() {
        this.getLista();
        this.listaTipos = [];
        this.listaOrigenDetectado = [];
        this.listaDetector = [];
        this.listaEstado = [];
        //this.listaEstado = ['PENDIENTE', 'CERRADO'];
        this.mostrarAlerta = false;
        this.mensajeAlerta = "";
      
        this.obtenerParametros();
      }
      
      OnBuscarParametro():void{
        this.getLista();    
      }

      getLista(): void {
        this.loading = true;
        const parametros: {tipo?: string, origenDet?: string, nombreDetector?: string,apPaternoDetector?: string, apMaternoDetector?: string, estado?: string} = {tipo: null, origenDet: null, nombreDetector: null, apPaternoDetector: null, apMaternoDetector: null, estado: null};
        switch (this.parametroBusqueda) {
            case 'tipo':
                if(this.valorTipo != ""){
                    parametros.tipo = this.valorTipo;   
                }        
                break;
            case 'origenDet': 
                if(this.valorOrigenDet != ""){
                    parametros.origenDet = this.valorOrigenDet;
                }
                break;                
            case 'detector':
                parametros.nombreDetector = "";
                break;       
            case 'estado':
                if(this.valorEstado != ""){
                    parametros.estado = this.valorEstado;
                }
                break;
            case 'avanzada':
                if(this.valorModal.idTipoNoConformidad != ""){
                    parametros.tipo = this.valorModal.idTipoNoConformidad;
                }
                if(this.valorModal.idorigenDeteccion != ""){
                    parametros.origenDet = this.valorModal.idorigenDeteccion;
                }
                if(this.valorModal.estado != ""){
                    parametros.estado = this.valorModal.estado;
                }
                if(this.valorModal.nombreDetector != ""){
                    parametros.nombreDetector = this.valorModal.nombreDetector;
                }
                if(this.valorModal.apPaternoDetector != ""){
                    parametros.apPaternoDetector = this.valorModal.apPaternoDetector;
                }
                if(this.valorModal.apMaternoDetector != ""){
                    parametros.apMaternoDetector = this.valorModal.apMaternoDetector;
                }
        }        
        
        this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
          (response: Response) => {
              this.items = response.resultado;
              this.items.forEach(obj => {
                  obj.fechaDeteccion = new Date(obj.fechaDeteccion);
              })
              this.paginacion = new Paginacion(response.paginacion);
              this.loading = false; },
          (error) => this.controlarError(error)
      );

      
  }

  
  obtenerParametros(){

    let buscaTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTipoNoConformidad);
    let buscaOrigenDeteccion = this.generalService.obtenerParametroPadre(NombreParametro.listaOrigenDeteccion);
    let buscaEstadosDeteccion = this.generalService.obtenerParametroPadre(NombreParametro.listaEstadoDeteccionHallazgos);

    forkJoin(buscaTipos,buscaOrigenDeteccion,buscaEstadosDeteccion)
    .subscribe(([buscaTipos,buscaOrigenDeteccion,buscaEstadosDeteccion]:[Response,Response,Response])=>{
      this.listaTipos = buscaTipos.resultado;
      this.listaOrigenDetectado = buscaOrigenDeteccion.resultado;
      this.listaEstado = buscaEstadosDeteccion.resultado;
      
    },
    (error) => this.controlarError(error));


    // this.service.obtenerEstado().subscribe(
    //     (response: Response) => {
    //         this.listaEstado = response.resultado;},
    //     (error) => this.controlarError(error)
    // );  
}
    

activarOpcion(acc?:number){
    this.opcionBusqueda = "";
    switch(acc){ 
      case 1: this.parametroBusqueda = "tipo"; break;
      case 2: this.parametroBusqueda = "origenDet"; break;
      case 3: this.parametroBusqueda = "detector"; break;
      case 4: this.parametroBusqueda = "estado"; break;     
    }
  }



  abrirBusqueda(){
    this.parametroBusqueda = "tipo";    
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalBusquedaAvanzDeteccionesComponent, config);
    (<ModalBusquedaAvanzDeteccionesComponent>this.bsModalRef.content).onClose.subscribe(result => {
        this.valorModal = result;
        this.parametroBusqueda = "avanzada";

        console.log(this.valorModal);
        this.OnBuscar();
    });

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



OnBuscar(): void {
    
    let texto:string = "<strong>Busqueda Por: </strong>";
    /*
    switch (this.parametroBusqueda) {
        
        case 'tipo':
            texto = texto + "<br/><strong>Tipo: </strong>"+this.obtenerValorTipo(this.valorTipo);
            break;

        case 'estado':
            texto = texto + "<br/><strong>Estado: </strong>"+this.obtenerValorEstado(this.valorEstado);
            break;
        case 'avanzada':
            if(this.busquedaPlan.tipoAuditoria != ""){
                texto = texto + "<br/><strong>Tipo: </strong>"+this.obtenerValorTipo(this.busquedaPlan.tipoAuditoria);
            }

            if(this.busquedaPlan.estadoAuditoria != ""){
                texto = texto + "<br/><strong>Estado: </strong>"+this.obtenerValorEstado(this.busquedaPlan.estadoAuditoria);
            }
    }
    */

    switch (this.parametroBusqueda) {
        case 'tipo':
            if(this.valorTipo != ""){
                texto = texto + "<br/><strong>Tipo: </strong>"+this.obtenerValorTipo(this.valorTipo);   
            }else{
                texto = texto + "<br/><strong>Tipo: </strong>"+"Cualquiera";
            }        
            break;
        case 'origenDet': 
            if(this.valorOrigenDet != ""){
                texto = texto + "<br/><strong>Origen Detección: </strong>"+this.obtenerValorOrigen(this.valorOrigenDet);
            }else{
                texto = texto + "<br/><strong>Origen Detección: </strong>"+"Cualquiera";
            }
            break;                
        case 'detector':
            texto = "";
            break;       
        case 'estado':
            if(this.valorEstado != ""){
                texto = texto + "<br/><strong>Estado: </strong>"+ this.obtenerValorEstado(this.valorEstado);
            }else{
                texto = texto + "<br/><strong>Estado: </strong>"+"Cualquiera";
            }
            break;
        case 'avanzada':
            if(this.valorModal.idTipoNoConformidad != ""){
                texto = texto + "<br/><strong>Tipo: </strong>"+this.obtenerValorTipo(this.valorModal.idTipoNoConformidad); 
            }
            if(this.valorModal.idorigenDeteccion != ""){
                texto = texto + "<br/><strong>Origen Detección: </strong>"+this.obtenerValorOrigen(this.valorModal.idorigenDeteccion); 
            }
            if(this.valorModal.estado != ""){
                texto = texto + "<br/><strong>Estado: </strong>" + this.obtenerValorEstado(this.valorModal.estado);
            }
            if(this.valorModal.nombreDetector != ""){
                texto = texto + "<br/><strong>Nombre Detector: </strong>" + this.valorModal.nombreDetector;
            }
            if(this.valorModal.apPaternoDetector != ""){
                texto = texto + "<br/><strong>Apellido Paterno Detector: </strong>" + this.valorModal.apPaternoDetector;
            }
            if(this.valorModal.apMaternoDetector != ""){
                texto = texto + "<br/><strong>Apellido Materno Detector: </strong>" + this.valorModal.apMaternoDetector;
            }
    }       


    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    this.paginacion.registros = 10;

    this.getLista();

    
/*
    const paramet: {tipo?: string, origenDet?: string, nombreDetector?: string,apPaternoDetector?: string,apMaternoDetector?: string, estado?: string} =
     {tipo: this.valorModal.tipo, origenDet: this.valorModal.origenDet, nombreDetector: this.valorModal.nombreDetector ,apPaternoDetector: this.valorModal.apPaternoDetector, apMaternoDetector:this.valorModal.apMaternoDetector, estado: this.valorModal.estado};


   console.log(paramet);
    this.service.buscarPorParametros(paramet, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
          this.items = response.resultado;
          console.log(this.items);
          this.paginacion = new Paginacion(response.paginacion);
       },
      (error) => this.controlarError(error)
  );
  */


  }

  obtenerValorTipo(valor:string):string{
      let obj = this.listaTipos.find(obj => obj.idconstante == valor);
      return obj.v_valcons;
  }

  obtenerValorOrigen(valor:string):string{
      let obj = this.listaOrigenDetectado.find(obj => obj.idconstante == valor);
      return obj.v_valcons;
  }

  obtenerValorEstado(valor:string):string{
      let obj = this.listaEstado.find(obj => obj.v_campcons1 == valor);
      return obj.v_valcons;
  }


  onEliminar(fila:any){    
    this.items.splice(fila,1);
    this.selectedRow = -1;

    // this.service.eliminar(this.selectedObject).subscribe(
    //     (response: Response) => {
    //         console.log(this.paginacion.totalPaginas.toString());
    //         this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
    //         this.getLista();
    //         this.loading = false;
    //     },
    //     (error) => this.controlarError(error)
    // );


  }


  /*
  onModificar(): void {
    
    
    this.router.navigate([`auditoria/deteccion-hallazgos/editar/${this.selectedObject.idDeteccionHallazgos}`]);



}*/


  OnModificar(item:DeteccionHallazgos): void {


    if(item.valorAmbito == "1"){
        this.router.navigate([`auditoria/deteccion-hallazgos/editar/${this.selectedObject.idDeteccionHallazgo}`]);
    }
    else{
        this.router.navigate([`auditoria/deteccion-hallazgos/editarFuera/${this.selectedObject.idDeteccionHallazgo}`]);
    }
     
}



/*
onEliminar():void{
    //console.log(this.parametroBusqueda);
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
*/
controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}

OnRegresar() { 
    this.router.navigate([`auditoria/registrar-deteccion-hallazgos/nuevo`]);
}

nuevoModal(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:false,
          editar:true
      },
      class: 'modal-fade'
    }
    
    this.bsModalRef = this.modalService.show(ModalDeteccionHallazgosComponent, config);
    (<ModalDeteccionHallazgosComponent>this.bsModalRef.content).onClose.subscribe(result => {
     // let requisitoAuditoriaAux:RequisitoAuditoria = result;
  
      
  });
  }
  



}

import { Component, OnInit } from '@angular/core';

import { BsModalRef, BsModalService, BsLocaleService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../models/response';
import { Router } from '@angular/router';
import { Paginacion } from 'src/app/models';
import { ListaVerificacionResposable } from 'src/app/models/listaVerificacionResponsable';
//import { BandejaRevisionAuditoriaMockService as BandejaRevisionAuditoriaService} from './../../../../services/index';


@Component({
  selector: 'app-lista-verificacion-responsable',
  templateUrl: './lista-verificacion-responsable.component.html',
  styleUrls: ['./lista-verificacion-responsable.component.scss']
})
export class ListaVerificacionResponsableComponent implements OnInit {

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
   selectedObject: ListaVerificacionResposable;
   /* indicador de carga */
   loading: boolean;
   itemCodigo: number;
    /* datos */

    item: ListaVerificacionResposable;
    private sub: any;
    listaDocumentosRelacionados=[];
    listaDocRel=[];
    bsModalRef: BsModalRef;



  constructor(LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,    
    private modalService: BsModalService) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
 
      this.parametroBusqueda = 'usuario';
      //this.opcionBusqueda = "";
      this.paginacion = new Paginacion({registros: 10}
        
        
        ); }

        ngOnInit() {
          this.getLista();
        }
      
        getLista(): void {
          this.loading = true;
          const parametros: {codigo?: string, fecha?: string, descripcion?: string} = {codigo: null, fecha: null, descripcion: null};
          switch (this.parametroBusqueda) {
              case 'codigo':
                  parametros.codigo = this.textoBusqueda;
                  break;
              case 'fecha':
                  parametros.fecha = this.textoBusqueda;
                  break;
              case 'descripcion':
              default:
                  parametros.descripcion = this.textoBusqueda;
          }
        
        /*  this.service.buscarPorListaVerficacion(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false; },
            (error) => this.controlarError(error)
        );*/
  
             
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
      this.paginacion.pagina = 1;
      this.getLista();
  }
  
  OnRevisionListaVer(): void {
      this.router.navigate([`auditoria/bandeja-revision-auditoria/listaVer/${this.selectedObject.id}`]);
  }
  
  OnEnviarInformeAntes(): void { 
      this.router.navigate([`auditoria/bandeja-revision-auditoria/enviarInforme/${this.selectedObject.id}`]);
  }
  
  
  OnEnviarInforme(){
      
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
            nuevo:true
        },
        class: 'modal-lg'
    }
  
  
  }
  
  controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
  
  OnRegresar() { 
      this.router.navigate([`auditoria/bandeja-revision-auditoria`]);
  }

}
   
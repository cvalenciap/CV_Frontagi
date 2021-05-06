import { Component, OnInit } from '@angular/core';
import { ListaVerificacion } from 'src/app/models/listaverificacion';
import { FormBuilder} from '@angular/forms';
import { Paginacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from './../../../../models/response';  
import { BsLocaleService,BsModalRef,ModalOptions, BsModalService } from 'ngx-bootstrap';
import { EnviarInformeComponent } from '../enviar-informe/enviar-informe.component';
import { ModalAprobarEquipoComponent } from '../modal-aprobar-equipo/modal-aprobar-equipo.component';



   
@Component({
  selector: 'app-lista-verificacion-equipo',
  templateUrl: './lista-verificacion-equipo.component.html',
  styleUrls: ['./lista-verificacion-equipo.component.scss']
})
export class ListaVerificacionEquipoComponent implements OnInit {


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
   selectedObject: ListaVerificacion;
   /* indicador de carga */
   loading: boolean;
   mostrarA: boolean;
   itemCodigo: number;
    /* datos */

    //selectedObject: DetalleProgramacion;
    //listaTipos: Tipo[];
    item: ListaVerificacion;
    private sub: any;
    //bsModalRef: BsModalRef;
    listaDocumentosRelacionados=[];
    listaDocRel=[];

    bsModalRef: BsModalRef;

  constructor(LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,   
    private modalService: BsModalService,
    private route: ActivatedRoute,
    private fb: FormBuilder) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
      this.mostrarA = false;
 
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
      
       /* this.service.buscarPorListaVerficacion(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
          (response: Response) => {
              this.items = response.resultado;
              this.paginacion = new Paginacion(response.paginacion);
              this.loading = false; },
          (error) => this.controlarError(error)
      );*/
      this.loading = false;
           
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
 /* const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:true
      },
      class: 'modal-lg'
  }*/

  this.bsModalRef = this.modalService.show(EnviarInformeComponent);
  (<EnviarInformeComponent>this.bsModalRef.content).onClose.subscribe(result => {
   
});

}

controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}


OnRegresar() { 
    this.router.navigate([`auditoria/bandeja-revision-auditoria`]);
}


OnAprobar(){

    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:false,
          editar:true
      },
      class: 'modal-lg-custom'
    }
 
    this.bsModalRef = this.modalService.show(ModalAprobarEquipoComponent,config);
    (<ModalAprobarEquipoComponent>this.bsModalRef.content).onClose.subscribe(result => {
      //let requisitoAuditoriaAux:RequisitoAuditoria = result;
  
  });
  }

  OnHabilitarAL(){
    this.mostrarA = false;
  }
  OnHabilitarRE(){
    this.mostrarA = true;
  }

  


}

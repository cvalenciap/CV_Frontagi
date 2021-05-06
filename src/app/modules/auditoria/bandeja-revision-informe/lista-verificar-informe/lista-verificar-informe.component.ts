import { Component, OnInit } from '@angular/core';

import { Paginacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Response } from './../../../../models/response';  
import { BsLocaleService, BsModalRef } from 'ngx-bootstrap';
import { ListaVerificarInforme } from 'src/app/models/listaverificarinforme';

//import { BandejaRevisionInformeMockService as BandejaRevisionInformeService} from './../../../../services/index';
import { BandejaRevisionInforme } from 'src/app/models/bandejarevisioninforme';


@Component({
  selector: 'app-lista-verificar-informe',
  templateUrl: './lista-verificar-informe.component.html',
  styleUrls: ['./lista-verificar-informe.component.scss']
})
export class ListaVerificarInformeComponent implements OnInit {
   /* datos */
   items: string[];
   /* filtros */
   textoBusqueda: string;
   parametroBusqueda: string;
   /* paginación */  
   paginacion: Paginacion;
   /* registro seleccionado */
   selectedRow: number;
   selectedObject: ListaVerificarInforme;
   /* indicador de carga */
   loading: boolean;
   mostrarA:boolean;
   itemCodigo: number;
    /* datos */
   

 selectedObject2: BandejaRevisionInforme;

    //selectedObject: DetalleProgramacion;
    //listaTipos: Tipo[];
    item: ListaVerificarInforme;
    private sub: any;
    bsModalRef: BsModalRef;
    listaDocumentosRelacionados=[];
    listaDocRel=[];

  constructor(
    LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router
    //private service: BandejaRevisionInformeService
    ) {
    this.loading = false;
    this.mostrarA = false;
    this.selectedRow = -1;
      this.items = [];
 
      this.parametroBusqueda = 'usuario';
      //this.opcionBusqueda = "";
      this.paginacion = new Paginacion({registros: 10}); }

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
          this.loading=false;
          
       /* this.service.buscarPorVerificacionInformeAuditoria(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
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


controlarError(error) {  
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
}


OnRegresar() {
    this.router.navigate([`auditoria/bandeja-revision-informe`]);
}


OnImprimir(): void {
    this.router.navigate([`auditoria/bandeja-revision-informe/verificar/${this.selectedObject2.numeroAuditoria}/imprimir`]);
}
//para obtener datos


OnHabilitarAL(){
  this.mostrarA = false;
}

OnHabilitarRE(){
  this.mostrarA = true;
}

}

import { Component, OnInit } from '@angular/core';


import { Paginacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { Response } from './../../../../models/response';
import { BsLocaleService } from 'ngx-bootstrap';
import { FichaAuditor } from 'src/app/models/fichaauditor';
//import { FichaAuditorService } from 'src/app/services/impl/fichaauditor.service';



   
@Component({
  selector: 'ficha-auditor',
  templateUrl: './ficha-auditor.component.html',
  styleUrls: ['./ficha-auditor.component.scss'],
  providers: []
})
export class FichaAuditorComponent implements OnInit {

  items: FichaAuditor[];
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  selectedObject: FichaAuditor;
  
  /* indicador de carga */
  loading: boolean;
  opcionBusqueda:string;

  constructor(LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
 
      this.parametroBusqueda = 'usuario';
      //this.opcionBusqueda = "";
      this.paginacion = new Paginacion({registros: 10});
     }

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
  
     /* this.service.buscarPorFichaAuditor(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
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
  OnModificar(): void {
      this.router.navigate([`auditoria/ficha-auditor/editar/${this.selectedObject.idFichaAuditor}`]);
  }
  onEliminar():void{
      /*console.log(this.parametroBusqueda);*/
      /*this.service.eliminar(this.selectedObject).subscribe(
          (response: Response) => {
              console.log(this.paginacion.totalPaginas.toString());
              this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
              this.getLista();
              this.loading = false;
          },
          (error) => this.controlarError(error)
      );*/
  }
  controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

}

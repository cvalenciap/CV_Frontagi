import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { Trabajador } from 'src/app/models/trabajador';
import { ToastrService } from 'ngx-toastr';
import { BusquedaColaboradorMockService } from 'src/app/services/mocks/busquedacolaborador.mock';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';
import { GeneralService } from 'src/app/services';

@Component({
  selector: 'app-modal-busqueda-colaborador',
  templateUrl: './modal-busqueda-colaborador.component.html',
  styleUrls: ['./modal-busqueda-colaborador.component.scss']
})
export class ModalBusquedaColaboradorComponent implements OnInit {

  public onClose: Subject<Trabajador>;
  bsConfig: object;
  nuevo:boolean;
  loading:boolean;
  selectedRow:number;
  participantes:Trabajador[];
  paginacion:Paginacion;
  busquedaTrabajador:Trabajador;
  selectedObject: Trabajador;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private service: BusquedaColaboradorMockService,
    private generalService:GeneralService) {
      this.selectedRow = -1;
      this.participantes = [];
      this.paginacion = new Paginacion({registros: 10});

     }

     ngOnInit() {
      this.onClose = new Subject();
      this.busquedaTrabajador = new Trabajador();
      //this.obtenerColaboradores();
    }
  
    buscar(){
      this.obtenerColaboradores();
    }
  
    obtenerColaboradores(){
      this.loading = true;
      const parametros: {nroFicha?: string, nombres?:string, apePaterno?: string, apeMaterno?: string} = {nroFicha: null, apePaterno: null, apeMaterno: null, nombres:null};
      
      if(this.busquedaTrabajador.nroFicha != ""){
        parametros.nroFicha = this.busquedaTrabajador.nroFicha;
      }

      if(this.busquedaTrabajador.apePaternoTrabajador != ""){
        parametros.apePaterno = this.busquedaTrabajador.apePaternoTrabajador;
      }

      if(this.busquedaTrabajador.apeMaternoTrabajador != ""){
        parametros.apeMaterno = this.busquedaTrabajador.apeMaternoTrabajador;
      }

      if(this.busquedaTrabajador.nombreTrabajador != ""){
        parametros.nombres = this.busquedaTrabajador.nombreTrabajador;
      }
      
      this.generalService.buscarTrabajadores(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
          (response: Response) => {
              this.participantes = response.resultado;
              this.paginacion = new Paginacion(response.paginacion);              
              this.loading = false; },
          (error) => this.controlarError(error)
      );
    }
  
    controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
  
    cancelar(){
      this.bsModalRef.hide();
    }
  
    OnRowClick(index, obj): void {
      this.selectedRow = index;
      this.selectedObject = obj;
    }
  
    OnPageChanged(event): void {
      this.paginacion.pagina = event.page;
      this.obtenerColaboradores();
    }
    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        this.obtenerColaboradores();
    }
  
    seleccionarAuditor(){
      this.bsModalRef.hide();
      this.onClose.next(this.selectedObject);
    }

}

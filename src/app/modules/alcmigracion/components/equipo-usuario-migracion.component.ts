import { Component, OnInit, Input, Output, EventEmitter } from '@angular/core';
import {BandejaDocumento} from '../../../models';
import { BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { RegistroElaboracioncomponts } from 'src/app/modules/bandejadocumento/modales/registro-elaboracion.component';
import {Documento} from 'src/app/models/documento';
import {Equipo} from 'src/app/models/equipo';
import {ToastrService} from 'ngx-toastr';
import {Paginacion} from 'src/app/models/paginacion';
import {computeStyle} from '@angular/animations/browser/src/util';
import {forEach} from '@angular/router/src/utils/collection';
import {RegistroElaboracionMigracionComponent} from "../modals/registro-elaboracion-migracion.component";

@Component({
  selector: 'bandeja-documento-equipo-usuario-migracion',
  templateUrl: 'equipo-usuario-migracion.template.html'
})
export class EquipoUsuarioMigracionComponent implements OnInit {

  @Input() activar: boolean;
  listaEquipo: Equipo[];
  loading: boolean;
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  selectedRow: number;
  idDocumento: number;
  idEquipo: number;
  paginacion: Paginacion;
  @Input()
  permisos:any;
  indicadorresp: string;

  constructor(private modalService: BsModalService, private toastr: ToastrService) {}

  ngOnInit() {    
    this.loading = false;
    this.selectedRow = -1;
    this.paginacion = new Paginacion({registros: 10});
    this.listaEquipo = new Array<Equipo>();


    
  }

  /* Código módificado por LARP */
  OnAgregar() {
    this.parametroBusqueda = 'avanzada';
    const config = <ModalOptions> {
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {},
        class: 'modal-lg'
    };
    this.bsModalRef = this.modalService.show(RegistroElaboracionMigracionComponent, config);
    (<RegistroElaboracionMigracionComponent>this.bsModalRef.content).onClose.subscribe(resultado => {
      // this.listaEquipo = resultado;
      if (this.listaEquipo.length <= 0) { 
        this.listaEquipo = resultado;
/*cguerra*/
for(let list of this.listaEquipo){  
  list.indicadorResp= 0;
}
/*cguerra*/
      } else {
        resultado.forEach(function (equipo) {
          if (!this.listaEquipo.find(equipoRemanente => equipoRemanente.id === equipo.id)) {            
              equipo.indicadorResp= 0;            
            this.listaEquipo.push(equipo);
          } else {
            this.toastr.show('No se agrero equipo ' + equipo.descripcion + ' ya se encuentra en la lista.');
          }
        }.bind(this));
      }
    });
  }
  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción',
      'Error', {closeButton: true});
  }

  eliminarEquipo(index: number) {
    if (index >= 0) {
      this.listaEquipo.splice(index, 1);
    }
    this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
  }

  seleccionarFila(index: number) {
    this.selectedRow = index;
  }
  /*  cguerra */ 
  seleccionarCheck(equipo:Equipo){
  for(let list of this.listaEquipo){
      list.indicadorResp = 0;
      if(list.id==equipo.id){
        equipo.indicadorResp = 1;
      }
   }    
  }
/*  cguerra */ 

}

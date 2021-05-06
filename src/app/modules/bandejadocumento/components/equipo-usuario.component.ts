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
import { SessionService } from 'src/app/auth/session.service';
import { Router } from '@angular/router';

@Component({
  selector: 'bandeja-documento-equipo-usuario',
  templateUrl: 'equipo-usuario.template.html'
})
export class EquipoUsuarioComponent implements OnInit {

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
  rutaActual:string;
  rutaAnterior:string;
  rutaAnteriorAnterior:string;
  habilitar: Boolean;

  constructor(private modalService: BsModalService, 
    private toastr: ToastrService,
    public  session: SessionService,
    private router: Router) {
    this.listaEquipo = new Array<Equipo>();
    //cguerra seguridad
    this.rutaActual = this.router.url;
    let item = JSON.parse(sessionStorage.getItem("item"));
    
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
    let nuevo = item.nuevo;
    let edicion = item.edicion    
    if(nuevo==true){
      this.habilitar= true;
    }else{
      this.habilitar= false;
    }
    //cguerra seguridad
  }

  ngOnInit() {
    this.loading = false;
    this.selectedRow = -1;
    this.paginacion = new Paginacion({registros: 10});
    //console.log("this.listaEquipoE",this.listaEquipo);
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
    this.bsModalRef = this.modalService.show(RegistroElaboracioncomponts, config);
    (<RegistroElaboracioncomponts>this.bsModalRef.content).onClose.subscribe(resultado => {
      // this.listaEquipo = resultado;
      if (this.listaEquipo.length <= 0) {
        this.listaEquipo = resultado;
      } else {
        resultado.forEach(function (equipo) {
          if (!this.listaEquipo.find(equipoRemanente => equipoRemanente.id === equipo.id)) {
            this.listaEquipo.push(equipo);
          } else {
            this.toastr.show('No se agrero equipo ' + equipo.descripcion + ' ya se encuentra en la lista.');
          }
        }.bind(this));
      }
      sessionStorage.setItem('listEquipoReturn', JSON.stringify(this.listaEquipo));
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
      sessionStorage.setItem('listEquipoReturn', JSON.stringify(this.listaEquipo));
    }
  }

  seleccionarFila(index: number) {
    this.selectedRow = index;
  }
  /* Código módificado por LARP */
  seleccionarCheck(equipo:Equipo){
    for(let list of this.listaEquipo){
      list.indicadorResponsable = 0;
      if(list.id==equipo.id){
        equipo.indicadorResponsable = 1;
      }
    }
  }

}

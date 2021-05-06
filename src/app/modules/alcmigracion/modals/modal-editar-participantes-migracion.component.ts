import { Component, OnInit, Input } from '@angular/core';
import { BandejaDocumento } from '../../../models';
import { Subject } from 'rxjs';
import { BsModalRef } from 'ngx-bootstrap';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Equipo } from 'src/app/models/equipo';
import { ColaboradoresService, EquiposService } from 'src/app/services';
import { ToastrService } from 'ngx-toastr';
import { Colaborador } from 'src/app/models/colaborador';
import { Paginacion } from 'src/app/models/paginacion';
import { ActivatedRoute } from '@angular/router';
import { DatePipe } from '@angular/common';

@Component({
  selector: 'modal-editar-participantes',
  templateUrl: 'modal-editar-participantes-migracion.template.html',
  providers: [EquiposService, ColaboradoresService]
})
export class EditarParticipantesMigracionComponents implements OnInit {
  public onClose: Subject<RutaParticipante>;
  public objeto: RutaParticipante;
  public loading: boolean;

  @Input()
  listaSeguimiento: BandejaDocumento[];
  fecha: Date;
  comentario: string;
  itemCodigo: number;
  selectedRow: number;
  selectedObject: Colaborador;
  prioridadValidator: boolean = false;
  fechaLiberacionValidator: boolean = false;
  public fechaLiberacion: string;
  fechali: boolean;

  constructor(public bsModalRef: BsModalRef,
    private datePipe: DatePipe, private toastr: ToastrService) {
    this.onClose = new Subject();
    this.limpiar();
  }

  ngOnInit() {    
    this.fechaLiberacion = this.datePipe.transform(this.objeto.fechaLiberacion,"dd/MM/yyyy");    
  }
    
  limpiar() {
    this.selectedRow = -1;
    this.fecha = new Date();
    this.loading = true;
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57)) {
      evento.preventDefault();
    }
  }
  cancelar() {
    this.bsModalRef.hide();
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  seleccionar() {
    let numActualPrioridad
    numActualPrioridad = this.objeto.prioridad;
    this.fechali = false;
    if (!this.fechaLiberacion) {
      this.fechaLiberacionValidator = true;
    } else if (this.fechaLiberacion.toString() == "Invalid Date") {
      this.fechali = true;
    }
    if (!numActualPrioridad && !this.fechaLiberacion) {// si son nulos
      this.toastr.error('Por favor, Ingrese la prioridad y la fecha de liberación.', 'Acción Incorrecta', { closeButton: true });
      (!numActualPrioridad || numActualPrioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
      (!this.fechaLiberacion || this.fechali == true) ? this.fechaLiberacionValidator = true : this.fechaLiberacionValidator = false;
    } else if (!numActualPrioridad) {
      this.toastr.error('Por favor, Ingrese una prioridad válida.', 'Acción Incorrecta', { closeButton: true });
      (!numActualPrioridad || numActualPrioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
    } else if (numActualPrioridad == 0) {
      this.toastr.error('Por favor, Ingrese una prioridad válida.', 'Acción Incorrecta', { closeButton: true });
      (!numActualPrioridad || numActualPrioridad == 0) ? this.prioridadValidator = true : this.prioridadValidator = false;
    } else if (!this.fechaLiberacion) {
      this.toastr.error('Por favor, Ingrese una fecha de liberación válida.', 'Acción Incorrecta', { closeButton: true });
    } else if (this.fechali == true) {//invalid Date
      this.toastr.error('Por favor, Ingrese una fecha de liberación válida.', 'Acción Incorrecta', { closeButton: true });
    } else {
      const objeto: RutaParticipante = new RutaParticipante();
      this.onClose.next(this.objeto);
      this.bsModalRef.hide();
    }
    return;
  }



  obtenerFecha($event) {
    this.fecha = new Date($event);
    this.objeto.fechaLiberacion = this.fecha;
  }



}

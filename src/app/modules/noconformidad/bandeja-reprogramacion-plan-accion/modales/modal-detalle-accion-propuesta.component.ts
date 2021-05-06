import { Component, OnInit, ViewChild } from '@angular/core';
import { BsLocaleService, defineLocale, esLocale ,BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Subject, forkJoin } from 'rxjs';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { Reprogramacion } from 'src/app/models/reprogramacion';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Response } from './../../../../models/response';
import { DatePipe } from '@angular/common';
import { BandejaReprogramacionService } from 'src/app/services';
import { Router, ActivatedRoute } from '@angular/router';
import { FormatoCarga } from 'src/app/constants/general/general.constants';

@Component({
  selector: 'app-modal-detalle-accion-propuesta',
  templateUrl: './modal-detalle-accion-propuesta.template.html',
  styleUrls: ['./modal-detalle-accion-propuesta.component.scss']
})
export class ModalDetalleAccionPropuestaComponent implements OnInit {

  public onClose: Subject<Reprogramacion>;
  loading:boolean = false;
  detalleAccionPropuestaForm: FormGroup;
  listaPlanSeleccion: Reprogramacion;
  reprogramacion: Reprogramacion;
  nombreArchivoAdjunto: string;
  ocultarElemento: boolean;
  deshabilitarCaja: boolean;
  fechaMin: Date;
  fechaMax: Date;

  constructor(public bsModalRef: BsModalRef,
              private modalService: BsModalService,
              private bandejaReprogramacionService: BandejaReprogramacionService,
              private formBuilder: FormBuilder,
              private toastr: ToastrService,
              private datePipe: DatePipe,
              private router: Router,
    ) {
      this.reprogramacion = new Reprogramacion();
      this.listaPlanSeleccion = new Reprogramacion();
  }

  ngOnInit() {
    
    this.loading = false;
    this.onClose = new Subject();
    this.fechaMin = new Date("02/02/2019");
    this.fechaMax = new Date("20/02/2019");
    this.getLista();
  }

  getLista(): void {
    
    this.loading = true;
    if(this.listaPlanSeleccion){
      this.reprogramacion = this.listaPlanSeleccion;
      this.reprogramacion.fechaCumplimiento = new Date(this.reprogramacion.fechaCumplimiento);
      this.reprogramacion.fechaEjecucion = new Date(this.reprogramacion.fechaEjecucion);
    }
  }

  OnCancelar(){
    this.bsModalRef.hide();
  }

  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  adjuntarArchivo(event:any){
    
    if(event.target.files.length>0){
      if(FormatoCarga.pdf == event.target.files[0].type){
        
        this.reprogramacion.archivoAdjunto = event.target.files[0];
        this.nombreArchivoAdjunto = event.target.files[0].name;
      } else {
        this.toastr.warning('Solo se permite archivo PDF', 'Atención', {closeButton: true});
      }
    }
  }

  OnSolicitarReprogramacion(){
    
    this.reprogramacion.valorAccion = "reprogramar";
    this.bandejaReprogramacionService.guardar(this.reprogramacion).subscribe(
      (response: Response) => {
          
          this.reprogramacion = response.resultado;
          this.toastr.success('Reprogramación Solicitada', 'Acción completada!', {closeButton: true});
          this.bsModalRef.hide();
          this.onClose.next(this.reprogramacion);
      },
      (error) => this.controlarError(error)
    );
  }

  OnAprobar(){
    
    this.reprogramacion.valorAccion = "aprobar";
    this.bandejaReprogramacionService.guardar(this.reprogramacion).subscribe(
      (response: Response) => {
          
          this.reprogramacion = response.resultado;
          this.toastr.success('Aprobación Solicitada', 'Acción completada!', {closeButton: true});
          this.bsModalRef.hide();
          this.onClose.next(this.reprogramacion);
      },
      (error) => this.controlarError(error)
    );
  }

  OnRechazar(){
    this.bsModalRef.hide();
  }
}

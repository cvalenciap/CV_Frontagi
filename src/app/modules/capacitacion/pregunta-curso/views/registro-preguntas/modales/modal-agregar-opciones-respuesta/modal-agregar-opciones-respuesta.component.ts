import { Component, OnInit, NgModule } from '@angular/core';
//import { ProgramacionAuditoria } from 'src/app/models/programacionauditoria';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PreguntaDetalle } from 'src/app/models/preguntadetalle';
import { config } from 'rxjs/internal/config';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { forkJoin } from 'rxjs';
import { validate } from 'class-validator';


@Component({
  selector: 'app-modal-agregar-opciones-respuesta',
  templateUrl: './modal-agregar-opciones-respuesta.template.html',
  styleUrls: ['./modal-agregar-opciones-respuesta.component.scss']
})
export class ModalAgregarOpcionesRespuestaComponent implements OnInit {

  public onClose: Subject<PreguntaDetalle>;
  bsConfig: object;

  private items: Array<string>;

  hola: string;
  descPregunta: string;
  datosAuditoria: string;
  valorRespuesta: string;
  preguntaDetalle: PreguntaDetalle;
  codDetalle: number;
  disponibilidad: string;
  selectDetalle: PreguntaDetalle = new PreguntaDetalle;
  listDisponibilidad: any[];
  listRespuesta: any[];
  nomDisp: string;
  nomResp: string;
  mensajes: any[];
  errors: any;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
    private servicioValidacion: ValidacionService) {
    this.items = ['SI', 'NO'];
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.listDisponibilidad = [
      { disponibilidad: '1', nomDisp: 'SI' },
      { disponibilidad: '0', nomDisp: 'NO' }
    ];
    this.listRespuesta = [
      { valorRespuesta: '1', nomResp: 'SI' },
      { valorRespuesta: '0', nomResp: 'NO' }
    ];
  }




  ngOnInit() {
    this.onClose = new Subject();
    //    this.busqueda.numFicha = "";
    console.log(this.hola);
    this.selectDetalle.codDetalle = this.codDetalle;
    this.selectDetalle.descPregunta = this.descPregunta;
    this.selectDetalle.valorRespuesta = this.valorRespuesta;
    this.selectDetalle.disponibilidad = this.disponibilidad;
    if (this.nomDisp != null) {
      this.selectDetalle.nomDisp = this.nomDisp;
    } else {
      this.selectDetalle.nomDisp = null;
    }

    if (this.nomResp != null) {
      this.selectDetalle.nomResp = this.nomResp;
    } else {
      this.selectDetalle.nomResp = null;
    }

    this.descPregunta = "";
    this.datosAuditoria = "";
    this.valorRespuesta = "";
    this.preguntaDetalle = null;

    this.disponibilidad = "";
  }


  guardar() {
    // if(this.busqueda.numFicha=== "" || (this.busqueda.tipo != undefined && this.busqueda.nomRol != null)){
    //   this.bsModalRef.hide();
    //   this.onClose.next(this.busqueda);
    // }

    
    if (this.selectDetalle.nomResp == "SI") {
      this.selectDetalle.valorRespuesta = "1";
    } else if (this.selectDetalle.nomResp == "NO") {
      this.selectDetalle.valorRespuesta = "0";
    }
    if (this.selectDetalle.nomDisp == "SI") {
      this.selectDetalle.disponibilidad = "1";
    } else if (this.selectDetalle.nomDisp == "NO") {
      this.selectDetalle.disponibilidad = "0";
    }

    this.preguntaDetalle = new PreguntaDetalle;
    this.preguntaDetalle.codDetalle = this.selectDetalle.codDetalle;
    this.preguntaDetalle.descPregunta = this.selectDetalle.descPregunta;
    this.preguntaDetalle.valorRespuesta = this.selectDetalle.valorRespuesta;
    this.preguntaDetalle.nomResp = this.selectDetalle.nomResp;
    this.preguntaDetalle.disponibilidad = this.selectDetalle.disponibilidad;
    this.preguntaDetalle.nomDisp = this.selectDetalle.nomDisp;

    forkJoin(validate(this.preguntaDetalle)).subscribe(([errors]: [any]) => {
      this.mensajes = [];

      if (errors.length > 0) {
        this.validarCampos();
        this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
      } else {
        this.onClose.next(this.preguntaDetalle);
        this.bsModalRef.hide();
      }
    });

  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  validarCampos() {
    
    this.errors = {};
    this.servicioValidacion.validacionObjeto(this.preguntaDetalle, this.errors);
  }

  Validar(objectForm) {
    
    this.servicioValidacion.validacionSingular(this.preguntaDetalle, objectForm, this.errors);
  }

  cancelar() {
    this.bsModalRef.hide();
  }
}

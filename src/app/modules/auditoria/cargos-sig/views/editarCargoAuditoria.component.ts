import { defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { Component, OnInit, Inject } from '@angular/core';
import { ConsultaCargosSiService } from 'src/app/services/auditoriacargossig.service';
import { Spinner } from 'ngx-spinner/lib/ngx-spinner.enum';
import { NgxSpinnerService } from 'ngx-spinner';
import { ModalBusquedaResponsableComponent } from '../../registro-area/modal/modal-busqueda-responsable.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';




@Component({
  selector: 'app-editarCargoAuditoria',
  templateUrl: 'editarCargoAuditoria.template.html',
  styleUrls: ['editarCargoAuditoria.component.scss'],
})

export class EditarCargoAuditoriaComponent implements OnInit {

  itemCodigo: number;
  items: any[];
  prueba: string;
  idColaborador: number;
  validacolaborador: boolean;
  prueba2: string;
  participantes: RegistroAuditor[];
  private sub: any;
  colaborador: string;
  validatecargosig: boolean;
  bsModalRef: BsModalRef;
  cargosig: string;
  validatesigla: boolean;
  sigla: string;
  resultado: string;
  indicador: number;
  idCargoSig: number;
  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private spinner: NgxSpinnerService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private servico: ConsultaCargosSiService,
    private route: ActivatedRoute,


  ) {
    this.cargosig = "";
    this.sigla = "";
    this.colaborador = "";
    this.validatesigla = false;
    this.validatecargosig = false;
    this.validacolaborador = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }


  ngOnInit() {

    const parametros = JSON.parse(sessionStorage.getItem("itemModif"));
    if (parametros != null) {
      this.indicador = parametros.indicador;
    }

    if (this.indicador == 1) {
      this.sigla = parametros.sigla;
      this.cargosig = parametros.cargoSig;
      this.colaborador = parametros.colaborador;
      this.idCargoSig = parametros.idCargoSig;
      this.idColaborador = parametros.ficha;
      //this.idColaborador = parametros.
    } else {
      this.sigla = "";
      this.cargosig = "";
      this.colaborador = "";
      this.idCargoSig = 0;
      this.idColaborador = 0;
    }
    this.OnDeleteSession();
  }

  habilitarLimpiar() {

    if (this.cargosig != '') {
      this.validatecargosig = false;
    } else {
      this.validatecargosig = true;
    }

    if (this.sigla != '') {
      this.validatesigla = false;
    } else {
      this.validatesigla = true;
    }
  }

  OnDeleteSession() {
    sessionStorage.removeItem("itemModif");
  }

  OnGuardar() {
    if (this.cargosig.trim() == "") {
      this.validatecargosig = true;
    }
    if (this.sigla.trim() == "") {
      this.validatesigla = true;
    }
    if (this.colaborador.trim() == "") {
      this.validacolaborador = true;
    } else {
      this.validacolaborador = false;
    }
    if (this.cargosig.trim() == "" || this.sigla.trim() == "" || this.colaborador.trim() == "") {
      this.toastr.error("Por favor, completar todos los campos obligatorios (*).", 'Acción inválida', { closeButton: true });
    } else {
      this.spinner.show();

      if (this.indicador == 1) {
        //modificacion
        const parametros: { idCargoSig: number, indicador?: string; cargosig?: string, sigla?: string, nroficha?: number } =
          { idCargoSig: this.idCargoSig, indicador: "1", cargosig: this.cargosig, sigla: this.sigla, nroficha: this.idColaborador };
        this.servico.GuardaConsultaSigModif(parametros).subscribe(
          response => {
            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
            this.router.navigate([`auditoria/registro-cargo-auditoria`]);
            this.spinner.hide();
          },
          (error) => this.controlarError(error)
        );
      } else {
        //Nuevo
        const parametros: { cargosig?: string, sigla?: string, nroficha?: number } = { cargosig: this.cargosig, sigla: this.sigla, nroficha: this.idColaborador };
        this.servico.GuardaConsultaSig(parametros).subscribe(
          response => {
            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
            this.router.navigate([`auditoria/registro-cargo-auditoria`]);
            this.spinner.hide();
          },
          (error) => this.controlarError(error)
        );
      }
    }
  }




  BusquedaColaborador() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalBusquedaResponsableComponent, config);
    (<ModalBusquedaResponsableComponent>this.bsModalRef.content).onClose.subscribe(result => {

      let auditor: RutaParticipante = result;
      this.colaborador = auditor.responsable;
      this.idColaborador = auditor.idColaborador;
      if (this.colaborador != "") {
        this.validacolaborador = false;
      }


    });
  }



  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }


  OnRegresar() {
    this.router.navigate([`auditoria/registro-cargo-auditoria`]);
  }
}


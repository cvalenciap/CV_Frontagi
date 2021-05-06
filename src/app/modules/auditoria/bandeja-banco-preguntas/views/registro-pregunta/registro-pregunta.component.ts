import { defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from './../../../../../models/response';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Pregunta } from 'src/app/models/pregunta';
import { Component, OnInit, Inject } from '@angular/core';
import { BancoPreguntaService, ParametrosService, GeneralService } from './../../../../../services';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { Constante } from 'src/app/models/constante';
import { NombreParametro } from 'src/app/constants/general/general.constants';
import { forkJoin } from 'rxjs';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'app-registro-pregunta',
  templateUrl: 'registro-pregunta.template.html',
  styleUrls: ['registro-pregunta.component.scss'],
  providers: [BancoPreguntaService]
})

export class RegistroPreguntaNuevoComponent implements OnInit {
  private itemCodigo: number;
  private objPregunta: Pregunta;
  private items3: Constante[];
  banderaLider: boolean;
  banderaLiderInterno: boolean;
  banderaInterno: boolean;
  banderaObservador: boolean;
  private sub: any;
  private bsModalRef: BsModalRef;
  rolConstante: any;
  listaRolAuditor: any[];
  param: number;
  itemPregunta: Pregunta;
  iD: number;
  pregunta: string;
  auditorLider: string;
  auditorLiderInterno: string;
  auditorInterno: string;
  auditorObservador: string;
  estado: number;
  rNum: number;
  total: number;
  radioNum: string;
  vRolAuditor: string;
  mensajes: any[];
  errors: any;
  prioridadValidator: boolean = false;
  idPregunta: number;
  idcons: any;
  cont: number;

  constructor(
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private generalService: GeneralService,
    private service: BancoPreguntaService,
    private serviceParametro: ParametrosService,
    private parametroService: ParametrosService,
    private servicioValidacion: ValidacionService,
    private spinner: NgxSpinnerService
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.idcons = "";
    this.cont = 0;
    this.param = 0;
    this.listaRolAuditor = [];
  }

  ngOnInit() {
    this.obtenerParametros();
    this.sub = this.route.params.subscribe(params => {
      this.param = + params['codigo'];
    });
    if (!this.param) {
      this.banderaLider = false;
      this.banderaLiderInterno = false;
      this.banderaInterno = false;
      this.banderaObservador = false;
      this.itemCodigo = 0;
      this.cont = 0;
      this.pregunta = '';
      this.idPregunta = null;
    } else {
      this.CargarDatos();
    }
  }

  CargarDatos(): void {
    let cod = this.param;
    this.spinner.show();
    this.service.obtenerDatosPreguntaxId(cod).subscribe(
      (response: Response) => {
        this.objPregunta = response.resultado;
        this.pregunta = this.objPregunta.pregunta;
        this.idPregunta = this.objPregunta.iD;
        this.tranformarBooleano();
        this.spinner.hide();
      }, (error) => this.controlarError(error));
  }

  tranformarBooleano(): void {
    this.banderaLider = false;
    this.banderaLiderInterno = false;
    this.banderaInterno = false;
    this.banderaObservador = false;

    if (this.objPregunta.auditorLider === '1') {
      this.banderaLider = true;
    };
    if (this.objPregunta.auditorLiderInterno === '1') {
      this.banderaLiderInterno = true;
    };
    if (this.objPregunta.auditorInterno === '1') {
      this.banderaInterno = true;
    };
    if (this.objPregunta.auditorObservador === '1') {
      this.banderaObservador = true;
    };
  }

  OnGuardar() {
    this.objPregunta = new Pregunta();
    this.objPregunta.iD = this.idPregunta;
    if (this.banderaLider) {
      this.objPregunta.auditorLider = "1";
    } else {
      this.objPregunta.auditorLider = "0"
    }
    if (this.banderaLiderInterno) {
      this.objPregunta.auditorLiderInterno = "1"
    }
    else {
      this.objPregunta.auditorLiderInterno = "0"
    }
    if (this.banderaInterno) {
      this.objPregunta.auditorInterno = "1";
    }
    else {
      this.objPregunta.auditorInterno = "0"
    }
    if (this.banderaObservador) {
      this.objPregunta.auditorObservador = "1"
    }
    else {
      this.objPregunta.auditorObservador = "0"
    }
    this.objPregunta.pregunta = this.pregunta;
    if (this.pregunta == null || this.pregunta.trim() == '') {
      this.toastr.warning('Por favor, registrar la pregunta.', 'Advertencia', { closeButton: true });
      (this.pregunta == null || this.pregunta.trim() == '') ? this.prioridadValidator = true : this.prioridadValidator = false;
    }

    else if (this.banderaInterno == false && this.banderaLider == false && this.banderaLiderInterno == false && this.banderaObservador == false) {
      this.toastr.warning('Por favor, seleccione al menos un rol.', 'Advertencia', { closeButton: true });
    }

    else {
      this.spinner.show();
      this.service.guardar(this.objPregunta).subscribe(
        (response: Response) => {
          localStorage.removeItem("objetoRetornoBusqueda");
          this.spinner.hide();
          this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
          this.router.navigate([`auditoria/banco-preguntas`]);
        }, (error) => this.controlarError(error));
    }
  }
  validarCampos() {
    this.errors = {};
    this.servicioValidacion.validacionObjeto(this.objPregunta, this.errors);
  }

  Validar(objectForm) {
    this.servicioValidacion.validacionSingular(this.objPregunta, objectForm, this.errors);
  }

  OnRegresar() {
    this.router.navigate([`auditoria/banco-preguntas`]);
  }

  obtenerClick(event, tipo) {
    switch (tipo) {
      case (1):
        if (this.objPregunta.auditorLider == "0") {
          this.objPregunta.auditorLider = "1"
        }
        else {
          this.objPregunta.auditorLider = "0";
        }
        break;
      case (2):
        if (this.objPregunta.auditorLiderInterno == "0") {

          this.objPregunta.auditorLiderInterno = "1"
        }
        else {
          this.objPregunta.auditorLiderInterno = "0";
        }
        break;
      case (3):
        if (this.objPregunta.auditorInterno == "0") {

          this.objPregunta.auditorInterno = "1"
        }
        else {
          this.objPregunta.auditorInterno = "0";
        }
        break;
    }
  }

  controlarError(error: any) {
    this.spinner.hide();
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  ingresarRol(valor: any) {
    if (valor == 'Auditor Lider') {
      if (!this.banderaLider) {
        let cadena = "";
        this.service.buscarRoles(valor).subscribe(
          (response: Response) => {
            this.items3 = response.resultado;
            cadena = this.items3[0].idconstante + ",";
            if (this.idcons.indexOf(cadena) != -1) {
              this.idcons = this.idcons.replace(cadena, '');
              this.objPregunta.vRolAuditor = this.objPregunta.vRolAuditor.replace(cadena, '');
            }
          },
          (error) => this.controlarError(error)
        );
      }
      else {
        this.service.buscarRoles(valor).subscribe(
          (response: Response) => {
            this.items3 = response.resultado;
            this.idcons = this.idcons + this.items3[0].idconstante + ",";
            this.objPregunta.vRolAuditor = this.idcons;
          },
          (error) => this.controlarError(error)
        );
      }
    }
    if (valor == 'Auditor Interno') {
      if (!this.banderaInterno) {
        let cadena = "";
        this.service.buscarRoles(valor).subscribe(
          (response: Response) => {
            this.items3 = response.resultado;
            cadena = this.items3[0].idconstante + ",";
            if (this.idcons.indexOf(cadena) != -1) {
              this.idcons = this.idcons.replace(cadena, '');
              this.objPregunta.vRolAuditor = this.objPregunta.vRolAuditor.replace(cadena, '');
            }
          },
          (error) => this.controlarError(error)
        );

      }
      else {
        this.service.buscarRoles(valor).subscribe(
          (response: Response) => {
            this.items3 = response.resultado;
            this.idcons = this.idcons + this.items3[0].idconstante + ",";
            this.objPregunta.vRolAuditor = this.idcons;
          },
          (error) => this.controlarError(error)
        );
      }
    }
    if (valor == 'Auditor Lider del Grupo') {
      if (!this.banderaLiderInterno) {
        let cadena = "";
        this.service.buscarRoles(valor).subscribe(
          (response: Response) => {
            this.items3 = response.resultado;
            cadena = this.items3[0].idconstante + ",";
            if (this.idcons.indexOf(cadena) != -1) {
              this.idcons = this.idcons.replace(cadena, '');
              this.objPregunta.vRolAuditor = this.objPregunta.vRolAuditor.replace(cadena, '');
            }
          },
          (error) => this.controlarError(error)
        );
      }
      else {
        this.service.buscarRoles(valor).subscribe(
          (response: Response) => {
            this.items3 = response.resultado;
            this.idcons = this.idcons + this.items3[0].idconstante + ",";
            this.objPregunta.vRolAuditor = this.idcons;
          },
          (error) => this.controlarError(error)
        );

      }
    }
  }

  actualizarRoles(): void {
    this.idcons = "";
    this.objPregunta.vRolAuditor = "";
    if (this.banderaLider) {
      this.objPregunta.auditorLider = '1';
      let auditorLider = 'Auditor Lider';
      let buscaAuditorLider = this.listaRolAuditor.find(obj => obj.v_valcons == auditorLider);
      if (buscaAuditorLider != undefined && buscaAuditorLider != null) {
        this.idcons = this.idcons + buscaAuditorLider.idconstante + ",";
        this.objPregunta.vRolAuditor = this.idcons;
      }
    }
    else {
      this.objPregunta.auditorLider = '0';
    };
    if (this.banderaInterno) {
      this.objPregunta.auditorInterno = '1';
      let auditorInterno = 'Auditor Interno';
      let buscaAuditorInterno = this.listaRolAuditor.find(obj => obj.v_valcons == auditorInterno);
      if (buscaAuditorInterno != undefined && buscaAuditorInterno != null) {
        this.idcons = this.idcons + buscaAuditorInterno.idconstante + ",";
        this.objPregunta.vRolAuditor = this.idcons;
      }
    }
    else {
      this.objPregunta.auditorInterno = '0';
    };
    if (this.banderaLiderInterno) {
      this.objPregunta.auditorLiderInterno = '1'
      let auditorLiderInte = 'Auditor Lider de Grupo';
      let buscaAuditorLiderInte = this.listaRolAuditor.find(obj => obj.v_valcons == auditorLiderInte);
      if (buscaAuditorLiderInte != undefined && buscaAuditorLiderInte != null) {
        this.idcons = this.idcons + buscaAuditorLiderInte.idconstante + ",";
        this.objPregunta.vRolAuditor = this.idcons;
      }
    }
    else {
      this.objPregunta.auditorLiderInterno = '0'
    };
  }

  obtenerParametros() {
    let buscaRolAuditor = this.generalService.obtenerParametroPadre(NombreParametro.listadoRolAuditor);
    forkJoin(buscaRolAuditor)
      .subscribe(([buscaRolAuditor]: [Response]) => {
        this.listaRolAuditor = buscaRolAuditor.resultado;
      },
        (error) => this.controlarError(error));
  }

}

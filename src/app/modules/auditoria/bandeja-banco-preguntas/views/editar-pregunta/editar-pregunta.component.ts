import { Paginacion, Tipo } from './../../../../../../app/models';
import { defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from './../../../../../models/response';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FichaAuditor } from 'src/app/models/fichaauditor';
import { NgModule } from '@angular/core';
import { Auditor } from 'src/app/models/auditor';
import { Component, OnInit, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { Pregunta } from 'src/app/models/pregunta';
import { BancoPreguntaService, GeneralService } from './../../../../../services';
import { Constante } from 'src/app/models/constante';
import { forkJoin } from 'rxjs';
import { NombreParametro } from 'src/app/constants/general/general.constants';


@Component({
  selector: 'app-editar-pregunta',
  templateUrl: 'editar-pregunta.template.html',
  styleUrls: ['editar-pregunta.component.scss'],
  providers: [BancoPreguntaService]

})

export class EditarRegistroPreguntaComponent implements OnInit {

  param: number;
  banderaLider: boolean;
  banderaLiderInterno: boolean;
  banderaInterno: boolean;
  pregunta: string;
  item: Pregunta;
  listaTipos: Tipo[];
  participantes: Auditor[];
  private sub: any;
  bsModalRef: BsModalRef;
  private items3: Constante[];
  idcons: any;
  listaRolAuditor: any[];
  constructor(
    private service: BancoPreguntaService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private generalService: GeneralService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.idcons = "";
    this.listaRolAuditor = [];
  }
  ngOnInit() {
    this.obtenerParametros();
    this.sub = this.route.params.subscribe(params => {
      this.param = + params['codigo'];
    });
    this.pregunta = JSON.parse(sessionStorage.getItem("pregunta"));
    this.item = new Pregunta();
    this.obtenerPregunta();
  }
  CargarDatos(): void {
    let cod = this.param;
    console.log("holaa" + cod);
    this.service.obtenerDatosPreguntaxId(cod).subscribe(
      (response: Response) => {
        console.log("Resultado" + response.resultado);
        this.item = response.resultado;
        this.tranformarBooleano();
        this.item.vRolAuditor = "";
      },
    );
  }
  obtenerPregunta() {
    this.item = new Pregunta();
    this.item.pregunta = this.pregunta;
  }
  tranformarBooleano(): void {
    this.banderaLider = false;
    this.banderaLiderInterno = false;
    this.banderaInterno = false;
    if (this.item.auditorLider === '1') {
      this.banderaLider = true;
    };
    if (this.item.auditorLiderInterno === '1') {
      this.banderaLiderInterno = true;
    };
    if (this.item.auditorInterno === '1') {
      this.banderaInterno = true;
    };
  }
  BusquedaAuditores(): void {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }
  }
  OnRegresar() {
    this.router.navigate([`auditoria/banco-preguntas`]);
  }
  OnGuardar() {
    this.actualizarRoles();
    this.item.vRolAuditor = this.item.vRolAuditor.substring(0, ((this.item.vRolAuditor.length) - 1));
    console.log(this.item.vRolAuditor);
    this.service.actualizar(this.item).subscribe(
      (response: Response) => {
        this.sub = response.resultado;
        this.toastr.success('Registro actulizado', 'Acción completada!', { closeButton: true });
        this.router.navigate([`auditoria/banco-preguntas`]);
      }
    );
  }

  actualizarRoles(): void {
    this.item.vRolAuditor = "";
    this.idcons = "";
    if (this.banderaLider) {
      this.item.auditorLider = '1';
      let auditorLider = 'Auditor Lider';
      let buscaAuditorLider = this.listaRolAuditor.find(obj => obj.v_valcons == auditorLider);
      if (buscaAuditorLider != undefined && buscaAuditorLider != null) {
        console.log(buscaAuditorLider.idconstante);
        this.idcons = this.idcons + buscaAuditorLider.idconstante + ",";
        this.item.vRolAuditor = this.idcons;
      }

    } else {
      this.item.auditorLider = '0';
    };

    if (this.banderaInterno) {
      this.item.auditorInterno = '1';
      let auditorInterno = 'Auditor Interno';
      let buscaAuditorInterno = this.listaRolAuditor.find(obj => obj.v_valcons == auditorInterno);
      if (buscaAuditorInterno != undefined && buscaAuditorInterno != null) {
        console.log(buscaAuditorInterno.idconstante);
        this.idcons = this.idcons + buscaAuditorInterno.idconstante + ",";
        this.item.vRolAuditor = this.idcons;
      }
    } else {
      this.item.auditorInterno = '0';
    };

    if (this.banderaLiderInterno) {
      this.item.auditorLiderInterno = '1'
      let auditorLiderInte = 'Auditor Lider del Grupo';
      let buscaAuditorLiderInte = this.listaRolAuditor.find(obj => obj.v_valcons == auditorLiderInte);
      if (buscaAuditorLiderInte != undefined && buscaAuditorLiderInte != null) {
        console.log(buscaAuditorLiderInte.idconstante);
        this.idcons = this.idcons + buscaAuditorLiderInte.idconstante + ",";
        this.item.vRolAuditor = this.idcons;
      }
    } else {
      this.item.auditorLiderInterno = '0'
    };
  }
  ingresarRol(valor: any) {
    this.service.buscarRoles(valor).subscribe(
      (response: Response) => {
        this.items3 = response.resultado;
        this.idcons = this.idcons + this.items3[0].idconstante + ",";
        this.item.vRolAuditor = this.idcons;
        console.log(this.item.vRolAuditor);
      },
      (error) => this.controlarError(error)
    );
  }

  obtenerParametros() {
    let buscaRolAuditor = this.generalService.obtenerParametroPadre(NombreParametro.listadoRolAuditor);
    forkJoin(buscaRolAuditor).subscribe(([buscaRolAuditor]: [Response]) => {
        this.listaRolAuditor = buscaRolAuditor.resultado;
      },
        (error) => this.controlarError(error));
  }
  controlarError(error) {
    console.error(error);
  }
}
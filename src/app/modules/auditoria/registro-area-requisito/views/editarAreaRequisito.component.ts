//import { Paginacion, Tipo } from './../../../../../../app/models';
import { defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { Router, ActivatedRoute } from '@angular/router';
//import { Response } from './../../../../../models/response';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { FichaAuditor } from 'src/app/models/fichaauditor';
import { NgModule } from '@angular/core';
import { FichaAuditorService } from 'src/app/services/impl/fichaauditor.service';
//import { RegistroAuditorDetalle } from './../../../../../models/registroAuditorDetalle';
import { Auditor } from 'src/app/models/auditor';
import { Component, OnInit, Inject } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { ModalBusquedaAuditorComponent } from 'src/app/modules/auditoria/planauditoria/modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
//import { GeneralService } from './../../../../../services';
//import { FichaRegistroAuditorService } from './../../../../../services';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { ModalBusquedaRequisitoComponent } from '../modal/modal-busqueda-requisito.component';
import { ModalBusquedaCuestionarioComponent } from '../modal/modal-busqueda-cuestionario.component';

//import { GeneralService} from './../../../../../services';
//import {MatTabsModule} from '@angular/material/tabs';


@Component({
  selector: 'app-editarAreaRequisito',
  templateUrl: 'editarAreaRequisito.template.html',
  styleUrls: ['editarAreaRequisito.component.scss'],
 // providers: [GeneralService, FichaRegistroAuditorService]
})

export class EditarAreaRequisitoComponent implements OnInit {

  itemCodigo: number;
  items: any[];
  itemsListaRol: any[];
  itemsListaGrados: any[];
  itemsListaCursosLlevados: any[];
  itemsListaCursosPorLlevar: any[];
  //listaTipos: Tipo[];
  //listaRol: Tipo[];
  //listaEducacion: Tipo[];
  //item: RegistroAuditorDetalle;
  valorRadio : Number = 1;

  prueba: string;
  prueba2: string;
  participantes: RegistroAuditor[];
  private sub: any;
  bsModalRef: BsModalRef;
  constructor(
    //private service: GeneralService,
    //private serviceAuditor: FichaRegistroAuditorService,
    private modalService: BsModalService,
    private fb: FormBuilder,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

/*   CargarInicial() {
    const parametros: { avanzada?: string, numFicha?: string, nombreAuditor?: string, apePaternoAuditor?: string, apeMaternoAuditor?: string } = { numFicha: '', nombreAuditor: '', apePaternoAuditor: '', apeMaternoAuditor: '' };

    this.service.obtenerParametroPadre('Listado Tipo de Auditores').subscribe(
      (response: Response) => {
        this.items = response.resultado;
        console.log(this.items);
      }
    );


    this.service.obtenerParametroPadre('Listado Rol de Auditores').subscribe(
      (response: Response) => {
        this.itemsListaRol = response.resultado;
        console.log(this.itemsListaRol);
      }
    );

    this.service.obtenerParametroPadre('Listado Grados Educativos').subscribe(
      (response: Response) => {
        this.itemsListaGrados = response.resultado;
        console.log(this.itemsListaGrados);
      }
    );

    this.serviceAuditor.obtenerCursosAuditor(this.itemCodigo, 1).subscribe(
      (response: Response) => {
        this.itemsListaCursosLlevados = response.resultado;
        console.log(this.itemsListaCursosLlevados);
      }
    );


  } */

  ngOnInit() {
    this.prueba = "";
    this.prueba2 = "";
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
      //this.obtenerDocumentosRelacionados();
      //this.CargarInicial();
    });
  }
 
  agregarRequisitos() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalBusquedaRequisitoComponent, config);
    (<ModalBusquedaRequisitoComponent>this.bsModalRef.content).onClose.subscribe(result => {

    });
  }

  agregarCuestionario() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalBusquedaCuestionarioComponent, config);
    (<ModalBusquedaCuestionarioComponent>this.bsModalRef.content).onClose.subscribe(result => {

    });
  }


  OnRegresar() {
    this.router.navigate([`auditoria/registro-area-requisito`]);
  }
}


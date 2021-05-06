import { FichaAuditor } from 'src/app/models/fichaauditor';
import {NgModule} from '@angular/core';
import { FichaAuditorService } from 'src/app/services/impl/fichaauditor.service';
import { RegistroAuditorDetalle } from './../../../../../models/registroAuditorDetalle';
import { Auditor } from 'src/app/models/auditor';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ModalBusquedaAuditorComponent } from 'src/app/modules/auditoria/planauditoria/modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { Curso } from './../../../../../models/curso';
import { BsModalService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { ModalAgregarPreguntaRelacionalComponent } from './modales/modal-agregar-pregunta-relacional/modal-agregar-pregunta-relacional.component';
import { ModalModificarPreguntaRelacionadaComponent } from './modales/modal-modificar-pregunta-relacionada/modal-modificar-pregunta-relacionada.component';

@Component({
    selector: 'app-registro-pregunta-relacional',
    templateUrl: 'registro-pregunta-relacional.template.html',   
    styleUrls: ['registro-pregunta-relacional.component.scss']

   // providers: [FichaRegistroAuditorService]
})


export class RegistroNuevaPreguntaRelacionalComponent implements OnInit {
  /* codigo seleccionado */
  itemCodigo: number;
  /* datos */
  item: Curso;
  Cursos:Curso[];
  private sub: any;
  bsModalRef:BsModalRef;
  busquedaRegistroCurso: Curso;
    constructor(    
    
    private modalService: BsModalService,
    private fb: FormBuilder,  
    //private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
   // private service: FichaAuditorService,    
  ){ }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    this.itemCodigo = + params['codigo'];
      
   // this.obtenerDocumentosRelacionados();

  });
  }

  OnBuscarAvanzado(){}
  
  OnAgregar(){
      const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
              hola:"adios"
          },
          class: 'modal-lg'
      }

          this.bsModalRef = this.modalService.show(ModalAgregarPreguntaRelacionalComponent, config);
          (<ModalAgregarPreguntaRelacionalComponent>this.bsModalRef.content).onClose.subscribe(result => {
              this.busquedaRegistroCurso = result;
   //           console.log(this.busquedaRegistroCurso);
              this.OnBuscarAvanzado();
          });
}

OnModificar(){
      const config = <ModalOptions>{
          ignoreBackdropClick: true,
          keyboard: false,
          initialState: {
              hola:"adios"
          },
          class: 'modal-lg'
      }

          this.bsModalRef = this.modalService.show(ModalModificarPreguntaRelacionadaComponent, config);
          (<ModalModificarPreguntaRelacionadaComponent>this.bsModalRef.content).onClose.subscribe(result => {
              this.busquedaRegistroCurso = result;
   //           console.log(this.busquedaRegistroCurso);
              this.OnBuscarAvanzado();
          });
}


  OnRegresar(){ this.router.navigate(['mantenimiento/preguntasCurso']); }

}
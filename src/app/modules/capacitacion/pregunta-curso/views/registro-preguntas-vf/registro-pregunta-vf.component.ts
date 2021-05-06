import {NgModule} from '@angular/core';
import { FichaAuditorService } from 'src/app/services/impl/fichaauditor.service';
import { RegistroAuditorDetalle } from './../../../../../models/registroAuditorDetalle';
import { Auditor } from 'src/app/models/auditor';
import { Component, OnInit, Inject } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BrowserModule } from '@angular/platform-browser';
import { ModalBusquedaAuditorComponent } from 'src/app/modules/auditoria/planauditoria/modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { Curso } from './../../../../../models/curso';

import { BsModalService, BsLocaleService, BsModalRef, ModalOptions, defineLocale, esLocale } from 'ngx-bootstrap';
import { FormGroup, FormBuilder, Validators, FormControl,FormsModule, ReactiveFormsModule  } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
//import { ModalAgregarOpcionesRespuestaComponent } from './modales/modal-agregar-opciones-respuesta/modal-agregar-opciones-respuesta.component';
//import { ModalModificarOpcionesRespuestaComponent } from './modales/modal-agregar-opciones-respuesta/modal-modificar-opciones-respuesta.component';

@Component({
    selector: 'app-registro-pregunta-vf',
    templateUrl: 'registro-pregunta-vf.template.html',   
    styleUrls: ['registro-pregunta-vf.component.scss']

   // providers: [FichaRegistroAuditorService]
})


export class RegistroNuevoCursoVFComponent implements OnInit {
  /* codigo seleccionado */
  itemCodigo: number;
  /* datos */
  item: Curso;
  Cursos:Curso[];
  private listaTipoRespuesta:Array<string>;
  private sub: any;
  bsModalRef:BsModalRef;
  busquedaRegistroCurso: Curso;
  
    constructor(        
    private modalService: BsModalService,
    private fb: FormBuilder,  
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
   // private service: FichaAuditorService,    
  ){
    defineLocale('es', esLocale);
    this.localeService.use('es'); 
    this.listaTipoRespuesta=['Verdadero','Falso'];
   }

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    this.itemCodigo = + params['codigo'];
  
   // this.obtenerDocumentosRelacionados();

  });
  }

  OnBuscarAvanzado(){}
  
//   OnAgregar(){
//       const config = <ModalOptions>{
//           ignoreBackdropClick: true,
//           keyboard: false,
//           initialState: {
//               hola:"adios"
//           },
//           class: 'modal-lg'
//       }

//           this.bsModalRef = this.modalService.show(ModalAgregarOpcionesRespuestaComponent, config);
//           (<ModalAgregarOpcionesRespuestaComponent>this.bsModalRef.content).onClose.subscribe(result => {
//               this.busquedaRegistroCurso = result;
//    //           console.log(this.busquedaRegistroCurso);
//               this.OnBuscarAvanzado();
//           });
// }

// OnModificar(){
//       const config = <ModalOptions>{
//           ignoreBackdropClick: true,
//           keyboard: false,
//           initialState: {
//               hola:"adios"
//           },
//           class: 'modal-lg'
//       }

//           this.bsModalRef = this.modalService.show(ModalModificarOpcionesRespuestaComponent, config);
//           (<ModalModificarOpcionesRespuestaComponent>this.bsModalRef.content).onClose.subscribe(result => {
//               this.busquedaRegistroCurso = result;
//    //           console.log(this.busquedaRegistroCurso);
//               this.OnBuscarAvanzado();
//           });
// }


  OnRegresar(){ this.router.navigate(['mantenimiento/preguntasCurso']); }

}
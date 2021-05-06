import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../../components/common/paginacion/paginacion.module';
import {PreguntaCursoListaComponent} from './views/bandeja-preguntas/lista.component';
import { ModalSeleccionarCursoComponent } from './views/bandeja-preguntas/modales/modal-busqueda-seleccionarCurso/modal-busqueda-seleccionarCurso.component';
import {RegistroNuevoCursoAlternativoComponent} from './views/registro-preguntas/registro-pregunta.component';         
import { ModalAgregarOpcionesRespuestaComponent } from './views/registro-preguntas/modales/modal-agregar-opciones-respuesta/modal-agregar-opciones-respuesta.component';
import { ModalModificarOpcionesRespuestaComponent} from './views/registro-preguntas/modales/modal-agregar-opciones-respuesta/modal-modificar-opciones-respuesta.component';
import { RegistroNuevoCursoVFComponent } from './views/registro-preguntas-vf/registro-pregunta-vf.component';
import {RegistroNuevaPreguntaRelacionalComponent} from './views/registro-pregunta-relacional/registro-pregunta-relacional.component';
import {ModalAgregarPreguntaRelacionalComponent} from  './views/registro-pregunta-relacional/modales/modal-agregar-pregunta-relacional/modal-agregar-pregunta-relacional.component';
import {ModalModificarPreguntaRelacionadaComponent} from './views/registro-pregunta-relacional/modales/modal-modificar-pregunta-relacionada/modal-modificar-pregunta-relacionada.component';
import {ModalVistaPreviaExamenComponent} from './views/bandeja-preguntas/modales/modal-vista-previa/modal-vista-previa.component';
import {RegistroPreguntaCursoComponent} from './views/registro-preguntas/registro-pregunta-curso.component';   
import {TooltipModule} from 'ngx-bootstrap/tooltip';

@NgModule({
    declarations: [
   RegistroNuevoCursoAlternativoComponent,        
   PreguntaCursoListaComponent,
   RegistroNuevoCursoVFComponent,
   RegistroNuevaPreguntaRelacionalComponent,
   ModalSeleccionarCursoComponent,
   ModalAgregarOpcionesRespuestaComponent,
   ModalModificarOpcionesRespuestaComponent,
   ModalAgregarPreguntaRelacionalComponent,
   ModalModificarPreguntaRelacionadaComponent,
   ModalVistaPreviaExamenComponent,
   RegistroPreguntaCursoComponent
    ],
    entryComponents: [
        ModalVistaPreviaExamenComponent,
        ModalSeleccionarCursoComponent,
        ModalAgregarOpcionesRespuestaComponent,
        ModalModificarOpcionesRespuestaComponent,
        ModalAgregarPreguntaRelacionalComponent,
        ModalModificarPreguntaRelacionadaComponent
    ],     
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        BsDropdownModule,
        PaginationModule.forRoot(),
        BsDatepickerModule,
        NgSelectModule,
        ToastrModule,
        SweetAlert2Module,
        SpinKitModule,
        PaginacionModule,
        TooltipModule
    ]
})

export class PreguntaCursoModule { }
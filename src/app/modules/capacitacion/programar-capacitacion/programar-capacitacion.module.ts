import { NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { SpinKitModule } from './../../../components/common/spinkit/spinkit.module';
import { TabsModule } from 'ngx-bootstrap/tabs';
import { PaginacionModule } from './../../../components/common/paginacion/paginacion.module';
import { ProgramarCapacitacionComponent } from './views/bandeja-programacion/programar-capacitacion.component';
import { ModalBusquedaCapacitacionComponent } from './modales/bandeja-programacion/modal-busqueda-capacitacion/modal-busqueda-capacitacion.component';
import { RegistrarProgramacionComponent } from './views/registrar-programacion/registrar-programacion.component';
import { AgregarInstructorComponents } from 'src/app/modules/capacitacion/programar-capacitacion/modales/registrar-programacion/modal-agregar-instructor/agregar-instructor.component';
import { ModalProgramarSesionComponent } from './modales/registrar-programacion/modal-programar-sesion/modal-programar-sesion.component';
import { ModalAgregarAulaComponent } from './modales/registrar-programacion/modal-agregar-aula/modal-agregar-aula.component';
import { ModalAgregarPreguntaComponent } from './modales/registrar-programacion/modal-agregar-pregunta/modal-agregar-pregunta.component';
// import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
@NgModule({
    declarations: [
        ProgramarCapacitacionComponent,
        ModalBusquedaCapacitacionComponent,
        RegistrarProgramacionComponent,
	AgregarInstructorComponents,
        ModalProgramarSesionComponent,
        ModalAgregarAulaComponent,
        ModalAgregarPreguntaComponent
    ],
    entryComponents: [
        ModalBusquedaCapacitacionComponent,
	AgregarInstructorComponents,
        ModalProgramarSesionComponent,
        ModalAgregarAulaComponent,
        ModalAgregarPreguntaComponent
    ],
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        ReactiveFormsModule,
        BsDropdownModule,
        PaginationModule.forRoot(),
        BsDatepickerModule,
        NgSelectModule,
        ToastrModule,
        SweetAlert2Module,
        SpinKitModule,
        PaginacionModule,
        AlertModule.forRoot(),
        TabsModule
    ],
    providers: []
})
export class ProgramarCapacitacionModule {}
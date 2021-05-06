import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
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
// views
 import {BancoPreguntasListaComponent} from './views/bandeja-preguntas/lista.component';
// import {EditarRegistroAuditorNuevoComponent} from './views/editar-ficha/editar-ficha.component';
// import {RegistroAuditorNuevoComponent} from './views/registro-ficha/registro-ficha.component';

//import { ModalBusquedaRegistroAuditorComponent } from   './views/modales/modal-busqueda-registroAuditor/modal-busqueda-registroAuditor.component';
import { DemoMaterialModule } from "../../tabs/tabs.module";
import {RegistroPreguntaNuevoComponent} from './views/registro-pregunta/registro-pregunta.component';
import {EditarRegistroPreguntaComponent} from './views/editar-pregunta/editar-pregunta.component';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { DialogsModule } from '../../dialogs/dialogs.module';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
    declarations: [
        BancoPreguntasListaComponent,
        RegistroPreguntaNuevoComponent,
        EditarRegistroPreguntaComponent
        // registrar,        
        // ModalBusquedaRegistroAuditorComponent
    ],
    entryComponents: [
     //   ModalBusquedaRegistroAuditorComponent        
    ],
    imports: [
        DemoMaterialModule,
        CommonModule,
        RouterModule,
        FormsModule,
        BsDropdownModule,
        ReactiveFormsModule,
        PaginationModule.forRoot(),
        BsDatepickerModule,
        NgSelectModule,
        ToastrModule,
        SweetAlert2Module,
        SpinKitModule,
        PaginacionModule,
        TooltipModule,
        AlertModule.forRoot(),    
        SweetAlert2Module 
    ]
})
export class BancoPreguntaModule { }
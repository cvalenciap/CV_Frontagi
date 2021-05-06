import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../../components/common/paginacion/paginacion.module';
// views
import {RegistroAuditorListaComponent} from './views/bandeja-ficha/lista.component';
import {EditarRegistroAuditorNuevoComponent} from './views/editar-ficha/editar-ficha.component';
import {RegistroAuditorNuevoComponent} from './views/registro-ficha/registro-ficha.component';

import {ModalBusquedaRegistroAuditorComponent} from './views/modales/modal-busqueda-registroAuditor/modal-busqueda-registroAuditor.component';
import {DemoMaterialModule} from '../../tabs/tabs.module';
import {ModalInfoAuditorComponent} from './views/modales/modal-info-auditor/modal-info-auditor.component';
import { AlertModule } from 'ngx-bootstrap';

@NgModule({
  declarations: [
    RegistroAuditorListaComponent,
    EditarRegistroAuditorNuevoComponent,
    RegistroAuditorNuevoComponent,
    ModalBusquedaRegistroAuditorComponent
  ],
  entryComponents: [
    ModalBusquedaRegistroAuditorComponent,
    ModalInfoAuditorComponent
  ],
  imports: [
    DemoMaterialModule,
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    AlertModule.forRoot(),
    PaginationModule.forRoot(),
    BsDatepickerModule,
    NgSelectModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    PaginacionModule
  ]
})
export class RegistroAuditorModule {
}


import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';
//
import {ParametrosRoutes} from './parametros.routes';
//
// views
import {ParametrosListaComponent} from './views/lista.component';
import {ParametrosEditarComponent} from './views/editar.component';
import {EditarParametroComponent} from './views/editarparametro.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { AlertModule } from 'ngx-bootstrap';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
// modules/components
@NgModule({
  declarations: [
    ParametrosListaComponent,
    ParametrosEditarComponent,
    EditarParametroComponent
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
    TabsModule.forRoot(),
    AlertModule.forRoot(),
    TooltipModule
  ]
})
export class ParametrosModule { }




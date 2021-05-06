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
import { AlertModule } from 'ngx-bootstrap';
//
import {JerarquiaRoutes} from './jerarquias.routes';
//
// views
import {JerarquiasListaComponent} from './views/lista.component';
import {JerarquiasEditarComponent} from './views/editar.component';
import {JerarquiasFormularioComponent} from './views/editar_formulario.component';

import {EditarJerarquiaComponent} from './views/editarjerarquia.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import { Arbol } from 'src/app/modules/arbol/arbol.module';
//import { TreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla';
import {TooltipModule} from 'ngx-bootstrap/tooltip';

// modules/components
@NgModule({
  declarations: [
    JerarquiasListaComponent,
    JerarquiasEditarComponent,
    JerarquiasFormularioComponent,
    //,
    //TreeFlatOverviewData,
    EditarJerarquiaComponent
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
    TooltipModule.forRoot(),
    Arbol
  ]/*,
  entryComponents: [TreeFlatOverviewData],
  bootstrap: [TreeFlatOverviewData]*/
})
export class JerarquiasModule { }




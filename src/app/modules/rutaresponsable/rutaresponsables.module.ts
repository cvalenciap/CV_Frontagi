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
import {RutaResponsablesRoutes} from './rutaresponsables.routes';
//
// views
import {RutaResponsablesListaComponent} from './views/lista.component';
import {RutaResponsablesEditarComponent} from './views/editar.component';
import {EditarResponsableComponent} from './views/editarresponsable.component';
import {TabsModule} from 'ngx-bootstrap/tabs';
import {AlertModule} from 'ngx-bootstrap';

// modules/components

@NgModule({
    declarations: [
        RutaResponsablesListaComponent,
        RutaResponsablesEditarComponent,
      EditarResponsableComponent
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
    ]
})
export class RutaResponsablesModule { }



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
import {CursosRoutes} from './curso.routes';
// views
import {CursosListaComponent} from './views/lista-curso.component';
//import {AulasEditarComponent} from './views/editar.component';
// modules/components
//import { ModalBusquedaAulaComponent } from './modales/modal-busqueda-aula.component';
import { AlertModule, TooltipModule } from 'ngx-bootstrap';
import { CursoEditarComponent } from 'src/app/modules/curso/views/editar.component';
import { AgregarSesionComponents } from 'src/app/modules/curso/modals/agregar-sesion.component';

@NgModule({
    declarations: [
        CursosListaComponent,
        CursoEditarComponent,
        AgregarSesionComponents
       // ModalBusquedaAulaComponent
    ],
    entryComponents: [
       // ModalBusquedaAulaComponent
       AgregarSesionComponents
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
        AlertModule.forRoot(),
        TooltipModule
    ]
})
export class CursosModule { }


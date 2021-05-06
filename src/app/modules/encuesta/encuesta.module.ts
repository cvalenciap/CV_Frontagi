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
import {EncuestaRoutes} from './encuesta.routes';
// views
import {EncuestaComponent} from './views/lista.component';
import {EncuestaEditarComponent} from './views/editar.component';
// modules/components
//import { ModalBusquedaAulaComponent } from './modales/modal-busqueda-aula.component';
import { AlertModule, TooltipModule } from 'ngx-bootstrap';
import { VistaPreviaComponent } from 'src/app/modules/encuesta/views/encuesta-vistaprevia.component';
import { BusquedaCursoMantenimientoComponent } from 'src/app/modules/encuesta/modales/busqueda-curso-mantenimiento.component';
import { AgregarPreguntaComponents } from 'src/app/modules/encuesta/modales/agregar-pregunta.component';
@NgModule({
    declarations: [
        EncuestaComponent,
        EncuestaEditarComponent,
        VistaPreviaComponent,
        BusquedaCursoMantenimientoComponent,
        AgregarPreguntaComponents
      ],
    entryComponents: [
      BusquedaCursoMantenimientoComponent,
      AgregarPreguntaComponents
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
export class EncuestaModule { }


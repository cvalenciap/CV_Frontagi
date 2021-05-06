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
import {TabsModule} from 'ngx-bootstrap/tabs';

import { ExamenesListaComponent } from "./views/lista.component";
import { ModalDetalleExamenComponent } from "./modales/modal-detalle-examen/modal-detalle-examen.component";
import { ModalIniciarExamenComponent } from "./modales/modal-iniciar-examen/modal-iniciar-examen.component";
import { ModalPreguntaExamenComponent } from "./modales/modal-iniciar-examen/modal-pregunta-examen.component";
import {ModalEncuestaComponent} from "./modales/modal-encuesta/modal-encuesta.component";


@NgModule({
    declarations: [
        ExamenesListaComponent,
        ModalDetalleExamenComponent,
        ModalIniciarExamenComponent,
        ModalPreguntaExamenComponent,
        ModalEncuestaComponent
    ],
    entryComponents: [
        ModalDetalleExamenComponent,
        ModalIniciarExamenComponent,
        ModalPreguntaExamenComponent,
        ModalEncuestaComponent
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
        ReactiveFormsModule,
        TabsModule
    ]
})
export class BandejaExamenesModule { }
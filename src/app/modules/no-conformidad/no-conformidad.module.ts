import {NgModule} from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BsDropdownModule, PaginationModule, BsDatepickerModule, AlertModule } from 'ngx-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { ToastrModule } from 'ngx-toastr';
import { SweetAlert2Module } from '@toverux/ngx-sweetalert2';
import { BandejaNoConformidadComponent } from './containers/bandeja-no-conformidad/bandeja-no-conformidad.component';
import { FiltroBasicoComponent } from './components/filtro-basico/filtro-basico.component';
import { FiltroAvanzadoComponent } from './components/filtro-avanzado/filtro-avanzado.component';
import { TablaNoConformidadComponent } from './components/tabla-no-conformidad/tabla-no-conformidad.component';
import { PaginacionModule } from 'src/app/components/common/paginacion/paginacion.module';
import { DatosBusquedaBandejaComponent } from './components/datos-busqueda-bandeja/datos-busqueda-bandeja.component';
import { RegistroNoConformidadComponent } from './containers/registro-no-conformidad/registro-no-conformidad.component';
import { MatCheckboxModule, MatFormFieldModule, MatTooltipModule, MatTabsModule } from '@angular/material';
import { FormularioDatosIdentificacionComponent } from './components/formulario-datos-identificacion/formulario-datos-identificacion.component';
import { IngresoTextoGenericoComponent } from './components/ingreso-texto-generico/ingreso-texto-generico.component';
import { FormularioObservacionAnalisisComponent } from './components/formulario-observacion-analisis/formulario-observacion-analisis.component';
import { FormularioPlanAccionComponent } from './components/formulario-plan-accion/formulario-plan-accion.component';
import { FormularioEjecucionComponent } from './components/formulario-ejecucion/formulario-ejecucion.component';
import { FormularioVerificacionEstandarizacionComponent } from './components/formulario-verificacion-estandarizacion/formulario-verificacion-estandarizacion.component';
import { FormularioCierreComponent } from './components/formulario-cierre/formulario-cierre.component';
import { formularioBitacoraComponent } from './components/formulario-bitacora/formulario-bitacora.component';

@NgModule({
    declarations: [
        BandejaNoConformidadComponent,
        FiltroBasicoComponent,
        FiltroAvanzadoComponent,
        TablaNoConformidadComponent,
        DatosBusquedaBandejaComponent,
        IngresoTextoGenericoComponent,
        RegistroNoConformidadComponent,
        FormularioDatosIdentificacionComponent,
        FormularioObservacionAnalisisComponent,
        FormularioPlanAccionComponent,
        FormularioEjecucionComponent,
        FormularioVerificacionEstandarizacionComponent,
        FormularioCierreComponent,
        formularioBitacoraComponent
    ],
    imports: [
        PaginacionModule,
        PaginationModule,
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
        AlertModule.forRoot(),
        MatTabsModule,
        MatCheckboxModule,
        MatFormFieldModule,
        MatTooltipModule
    ],
    providers: []
})
export class NoConformidadModule {}

import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";
import {FormsModule} from "@angular/forms";

import {StarterViewComponent} from "./starterview.component";
import {OutlookViewComponent} from "./outlook.component";
import {LoginComponent} from "./login.component";
import {ResetComponent} from "./reset.component";

import {PeityModule } from '../../components/charts/peity';
import {SparklineModule } from '../../components/charts/sparkline';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';

// Chart.js Angular 2 Directive by Valor Software (npm)
import { ChartsModule } from 'ng2-charts/ng2-charts';

import { FlotModule } from '../../components/charts/flotChart';
import { IboxtoolsModule } from '../../components/common/iboxtools/iboxtools.module';
import { JVectorMapModule } from '../../components/map/jvectorMap';
import { StarterAuditoriaComponent } from "src/app/views/appviews/starter-auditoria.component";
import { StarterMantenimientoComponent } from "src/app/views/appviews/starter-mantenimiento.component";
import { StarterCapacitacionComponent } from "src/app/views/appviews/starter-capacitacion.component";
import { StarterNoConformidadComponent } from "src/app/views/appviews/starter-noconformidad.component";
import { AuthDirectivesModule } from "src/app/auth/auth.directives";



@NgModule({
  declarations: [
    StarterViewComponent,
    OutlookViewComponent,
    LoginComponent,
    ResetComponent,
    StarterAuditoriaComponent,
    StarterMantenimientoComponent,
    StarterCapacitacionComponent,
    StarterNoConformidadComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    RouterModule,
    PeityModule,
    SparklineModule,
    ChartsModule,
    FlotModule,
    SpinKitModule,
    IboxtoolsModule,
    JVectorMapModule,
    AuthDirectivesModule
  ],
  exports: [
    StarterViewComponent,
    StarterAuditoriaComponent,
    StarterMantenimientoComponent,
    StarterCapacitacionComponent,
    StarterNoConformidadComponent,
    OutlookViewComponent,
    LoginComponent,
    ResetComponent
  ],
})

export class AppviewsModule {
}

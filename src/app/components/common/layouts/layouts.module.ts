import {NgModule} from "@angular/core";
import {BrowserModule} from "@angular/platform-browser";
import {RouterModule} from "@angular/router";

import {BsDropdownModule} from 'ngx-bootstrap';
import {AuthDirectivesModule} from '../../../auth/auth.directives';

import {BasicLayoutComponent} from "./basicLayout.component";
import {BlankLayoutComponent} from "./blankLayout.component";
//import {TopNavigationLayoutComponent} from "src/app/components/common/layouts/topNavigationlayout.component";

import {NavigationComponent} from "./../navigation/navigation.component";
import {FooterComponent} from "./../footer/footer.component";
import {TopNavbarComponent} from "./../topnavbar/topnavbar.component";
import {TopNavigationNavbarComponent} from "./../topnavbar/topnavigationnavbar.component";
import {MensajeSistemaComponent} from "./../mensaje-sistema/mensaje-sistema.component";
import { NavigationAuditoriaComponent } from "src/app/components/common/navigation/navigation-auditoria.component";
import { NavigationMantenimientoComponent } from "src/app/components/common/navigation/navigation-mantenimiento.component";
import { NavigationCapacitacionComponent } from "src/app/components/common/navigation/navigation-capacitacion.component";
import { NavigationNoConformidadComponent } from "src/app/components/common/navigation/navigation-noconformidad.component";
import { InicialComponent } from "src/app/components/common/layouts/inicial.component";



@NgModule({
  declarations: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    NavigationAuditoriaComponent,
    //TopNavigationLayoutComponent,
    NavigationMantenimientoComponent,
    NavigationCapacitacionComponent,
    NavigationNoConformidadComponent,
    TopNavbarComponent,
    InicialComponent,
    TopNavigationNavbarComponent,
    MensajeSistemaComponent
  ],
  imports: [
    BrowserModule,
    RouterModule,
    BsDropdownModule.forRoot(),
    AuthDirectivesModule
  ],
  exports: [
    FooterComponent,
    BasicLayoutComponent,
    BlankLayoutComponent,
    NavigationComponent,
    NavigationAuditoriaComponent,
    //TopNavigationLayoutComponent,
    NavigationMantenimientoComponent,
    NavigationCapacitacionComponent,
    NavigationNoConformidadComponent,
    TopNavbarComponent,
    InicialComponent,
    TopNavigationNavbarComponent
  ],
})

export class LayoutsModule {}

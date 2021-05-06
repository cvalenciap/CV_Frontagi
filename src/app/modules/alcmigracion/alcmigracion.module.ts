//Dialog PDF
import {DialogsModule} from '../dialogs/dialogs.module';
import {NgModule/*,CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA*/} from '@angular/core';
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
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { HttpClientModule } from '@angular/common/http';
import { Arbol } from 'src/app/modules/arbol/arbol.module';
import { MatNativeDateModule } from '@angular/material';
import { ReactiveFormsModule } from '@angular/forms';
import { RevisarDocumentoComponent1 } from './views/revisar.component';
import {  RegistrarRevisionDocumentoComponent1 } from './views/registrar-revision-documento.component';


import { BitacoraComponent } from './modals/bitacora.component';
import { ParticipanteNuevoComponent } from './modals/participante-nuevo.component';
import { BusquedaDocumentoComponent } from './modals/busqueda-documento.component';

import { BandejaDocumentosModule } from 'src/app/modules/bandejadocumento/bandejadocumentos.module';
import {TooltipModule} from 'ngx-bootstrap/tooltip';
import { CRegistroDocumentoComponent1 } from 'src/app/modules/alcmigracion/components/components-registro-documento-migracion.component';
import { RevisionComponent1 } from 'src/app/modules/alcmigracion/components/revision-migracion.component';
import { CriticaComponent } from 'src/app/modules/alcmigracion/components/critica-migracion.component';
import { ElaboracionMigracionComponent } from "./components/elaboracion-migracion.component";
import { ConsensoMigracionComponent } from "./components/consenso-migracion.component";
import {AprobacionMigracionComponent} from "./components/apobacion-migracion.component";
import {HomologacionComponent} from "../bandejadocumento/components/homologacion.component";
import {HomologacionMigracionComponent} from "./components/homologacion-migracion.component";
import {RegistroElaboracionMigracionComponent} from "./modals/registro-elaboracion-migracion.component";
import {EquipoUsuarioMigracionComponent} from "./components/equipo-usuario-migracion.component";
import {AgregarUsuarioMigracionComponent} from "./modals/agregar-usuario-migracion.component";
import {DemoMaterialModule1} from "../tabsmigracion/tabsmigracion.module";
import {TabGroupAnimationsExample1} from "../tabsmigracion/views/tab-group-animations-example";
import {BusquedaColaboradorMigracionComponent} from "./modals/busqueda-colaborador-migracion/busqueda-colaborador-migracion.component";
import { HistoricoComponent } from './components/historico.component'
import { HistoricoDetalleComponent } from './components/historico-detalle.component'
import { AlertModule } from 'ngx-bootstrap';
import {ComplementarioMigracionComponent} from "./components/complementario-migracion.component";
import { EditarParticipantesMigracionComponents } from 'src/app/modules/alcmigracion/modals/modal-editar-participantes-migracion.component';

//cguerra ng build
import { ParticipanteComponent } from 'src/app/modules/alcmigracion/components/participante.component';
import { BusquedaAvanzadaComponent } from 'src/app/modules/alcmigracion/modals/busqueda-avanzada.component';
//import { ParticipanteComponent } from 'src/app/modules/revisiondocumento/components/participante.component';

//import { BusquedaAvanzadaComponent } from 'src/app/modules/revisiondocumento/modals/busqueda-avanzada.component';
//cguerra ng build


@NgModule({
  declarations: [
    TabGroupAnimationsExample1,
    // lgomez ini
    BusquedaAvanzadaComponent,
    RevisarDocumentoComponent1,
    RegistrarRevisionDocumentoComponent1,
    ParticipanteComponent,// ParticipanteComponent,
    BitacoraComponent,
    ParticipanteNuevoComponent,
    BusquedaDocumentoComponent,
    CRegistroDocumentoComponent1,
    RevisionComponent1,
    CriticaComponent,
    ElaboracionMigracionComponent,
    ConsensoMigracionComponent,
    AprobacionMigracionComponent,
    HomologacionMigracionComponent,
    EquipoUsuarioMigracionComponent,
    RegistroElaboracionMigracionComponent,
    AgregarUsuarioMigracionComponent,
    BusquedaColaboradorMigracionComponent,
    HistoricoComponent,
    HistoricoDetalleComponent,
    ComplementarioMigracionComponent,
    EditarParticipantesMigracionComponents
  ],
  imports: [
    DialogsModule,
    CommonModule,
    RouterModule,
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
//  TabsModule.forRoot(),
    NgSelectModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    PaginacionModule,
    BrowserModule,
    BrowserAnimationsModule,
    HttpClientModule,
    DemoMaterialModule1,
    MatNativeDateModule,
    ReactiveFormsModule,
    Arbol,
    BandejaDocumentosModule,
    TooltipModule.forRoot(),
    AlertModule.forRoot(),
    //TabsModule1
  ],
  exports: [
    BusquedaDocumentoComponent,
    CRegistroDocumentoComponent1,
    RevisionComponent1,
    CriticaComponent,
    BusquedaAvanzadaComponent,
    ElaboracionMigracionComponent,
    ConsensoMigracionComponent,
    AprobacionMigracionComponent,
    HomologacionMigracionComponent,
    EquipoUsuarioMigracionComponent,
    RegistroElaboracionMigracionComponent,
    AgregarUsuarioMigracionComponent,
    ComplementarioMigracionComponent,
    EditarParticipantesMigracionComponents
  ],
  entryComponents: [
    BusquedaAvanzadaComponent,
    BitacoraComponent,
    ParticipanteNuevoComponent,
    BusquedaDocumentoComponent,
    
    RegistroElaboracionMigracionComponent,
    AgregarUsuarioMigracionComponent,
    BusquedaColaboradorMigracionComponent,
    EditarParticipantesMigracionComponents
  ], // TabGroupAnimationsExample

  bootstrap: [], // TabGroupAnimationsExample
  /*,
    schemas: [ CUSTOM_ELEMENTS_SCHEMA,NO_ERRORS_SCHEMA  ]*/
})
export class RevisionDocumentosModule1 { }


import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {RouterModule} from '@angular/router';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {SpinKitModule} from '../../../components/common/spinkit/spinkit.module';
import {NgSelectModule} from '@ng-select/ng-select';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from '../../../components/common/paginacion/paginacion.module';
import { DemoMaterialModule } from '../../tabs/tabs.module';
import { ListaCargoAuditoriaComponent } from './views/listaCargoAuditoria.component';
import { EditarCargoAuditoriaComponent } from './views/editarCargoAuditoria.component';
import { ModalBusquedaResponsableComponent } from './modal/modal-busqueda-responsable.component';
import { ConsultaCargosSiService } from 'src/app/services/auditoriacargossig.service';
import { ApiService } from 'src/app/services/api.service';
import { AlertModule } from 'ngx-bootstrap';


@NgModule({
    declarations: [
        ListaCargoAuditoriaComponent,
        EditarCargoAuditoriaComponent,
        ModalBusquedaResponsableComponent
    ],
    entryComponents: [
        ModalBusquedaResponsableComponent        
    ],
    imports: [
        DemoMaterialModule,
        CommonModule,
        //ConsultaCargosSig,
        RouterModule,
        AlertModule.forRoot(),   
        FormsModule,
        BsDropdownModule,
        PaginationModule.forRoot(),
        BsDatepickerModule,
        NgSelectModule,
        ToastrModule,
        SweetAlert2Module,
        SpinKitModule,
        PaginacionModule
    ],
    //providers: [ ApiService],
})
export class RegistroCargoAuditoriaModule { }


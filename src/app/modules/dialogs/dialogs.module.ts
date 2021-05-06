import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {LocationStrategy, HashLocationStrategy} from '@angular/common';
import {BsDropdownModule} from 'ngx-bootstrap/dropdown';
import {PaginationModule} from 'ngx-bootstrap/pagination';
import {BsDatepickerModule} from 'ngx-bootstrap/datepicker';
import {IcheckModule} from './../../components/forms/iCheck';
import {SpinKitModule} from './../../components/common/spinkit/spinkit.module';
import {ToastrModule} from 'ngx-toastr';
import {SweetAlert2Module} from '@toverux/ngx-sweetalert2';
import {PaginacionModule} from './../../components/common/paginacion/paginacion.module';

// views
import {BuscarDocumentoComponent} from './buscar-documento/buscar-documento.component';
//NPM PDF
import {PdfJsViewerModule} from 'ng2-pdfjs-viewer';
// modules/components
import {VisorPdfComponent} from './visor-pdf/visor-pdf.component';

@NgModule({
  declarations: [
    //
    // SeleccionarAsuntoComponent,
    /*VisorPdfComponent,*/
    BuscarDocumentoComponent,
    VisorPdfComponent
    
  ],
  imports: [
    CommonModule,
    FormsModule,
    BsDropdownModule,
    PaginationModule.forRoot(),
    BsDatepickerModule,
    IcheckModule,
    ToastrModule,
    SweetAlert2Module,
    SpinKitModule,
    PaginacionModule,
    PdfJsViewerModule
  ],
  exports: [
 //   SeleccionarAsuntoComponent,
    /*VisorPdfComponent,*/
    BuscarDocumentoComponent,
    VisorPdfComponent
  ]
})
export class DialogsModule { }


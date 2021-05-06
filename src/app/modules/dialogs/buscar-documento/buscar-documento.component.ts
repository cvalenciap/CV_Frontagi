import {Component, OnInit} from '@angular/core';
import {esLocale} from 'ngx-bootstrap/locale';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import {defineLocale} from 'ngx-bootstrap/chronos';
import {FiltroDocumento} from '../../../models';

@Component({
  selector: 'buscar-documento',
  templateUrl: 'buscar-documento.template.html',
  styleUrls: ['buscar-documento.component.scss']
})
export class BuscarDocumentoComponent implements OnInit {

  filtrosBusqueda: FiltroDocumento;

  constructor(private localeService: BsLocaleService) {}

  ngOnInit() {
    this.filtrosBusqueda = new FiltroDocumento();
    // var d = new Date();
    // this.filtrosBusqueda.anno= new Date();
    //this.filtrosBusqueda.anno.setDate( this.filtrosBusqueda.anno.getDate());

  }


}


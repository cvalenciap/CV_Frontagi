import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';

@Component({
  selector: 'bandeja-documento-justificativa',
  templateUrl: 'justificativa.template.html'
})
export class JustificativaComponent implements OnInit {

  @Input()
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;

  constructor() {}

  ngOnInit() {
    this.loading = false;
  }
}

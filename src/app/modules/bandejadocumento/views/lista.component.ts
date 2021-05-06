import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { BandejaDocumento } from '../../../models/bandejadocumento';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Constante } from 'src/app/models/enums';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;

@Component({
  selector: 'bandejadocumento-lista',
  templateUrl: 'lista.template.html',
  styleUrls: ['lista.component.scss'],
  providers: []
})

export class BandejaDocumentosComponent implements OnInit {
  items: BandejaDocumento[];
  loading: boolean;
  valor: boolean;
  idProceso: number;
  idAlcance: number;
  idGerencia: number;

  ngAfterViewInit() {
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private serviceParametro: ParametrosService,
    private spinner: NgxSpinnerService) {
    this.loading = false;
    this.valor = false;
    this.items = [];
    sessionStorage.removeItem("rutaAnterior");
  }

  ngOnInit() {
    this.spinner.show();
    localStorage.removeItem("idProcesoSeleccionado");
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idProceso = this.serviceParametro.obtenerIdParametro(resultado, Constante.TIPO_JERARQUIA_PROCESO);
        this.idAlcance = this.serviceParametro.obtenerIdParametro(resultado, Constante.TIPO_JERARQUIA_ALCANCE);
        this.idGerencia = this.serviceParametro.obtenerIdParametro(resultado, Constante.TIPO_JERARQUIA_GERENCIA);
        this.spinner.hide();
      },
      (error) => this.controlarError(error)
    );
  }
  
  onClick(idBoton) {
    sessionStorage.setItem("rutaAnterior", this.router.url);
    localStorage.setItem("indicadordocumento", "1");
    localStorage.setItem("idProcesoSeleccionado", idBoton);
    localStorage.removeItem('nodeSeleccionado');
    localStorage.removeItem("objetoRetornoBusqueda");
    localStorage.removeItem("objetoRetornoBusqAvanz");
    localStorage.removeItem("pagRetorno");
  }

  controlarError(error) {
    this.spinner.hide();
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
}
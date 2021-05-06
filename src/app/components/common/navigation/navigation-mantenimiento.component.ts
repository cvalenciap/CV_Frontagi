import { Component } from '@angular/core';
import { Router } from '@angular/router';
import 'jquery-slimscroll';
import { Constante } from 'src/app/models/enums';
import { ParametrosService } from 'src/app/services';
import { Response } from '../../../models/response';
declare var jQuery: any;

@Component({
  selector: 'navigation-mantenmiento',
  templateUrl: 'navigation-mantenimiento.template.html'
})

export class NavigationMantenimientoComponent {
  [x: string]: any;
  idGerencia: number;
  constructor(private router: Router, private serviceParametro: ParametrosService) { }

  ngAfterViewInit() {
    jQuery('#side-menu-mantenmiento').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_JERARQUIA).subscribe(
      (response: Response) => {
        let resultado = response.resultado;
        this.idGerencia = this.serviceParametro.obtenerIdParametro(
          resultado, Constante.TIPO_JERARQUIA_GERENCIA);
      },
      (error) => this.controlarError(error)
    );
  }
  onClickTraslado(item) {
    localStorage.setItem("indicadordocumento", "1");
    localStorage.setItem("idProcesoSeleccionado", item);
    localStorage.removeItem('nodeSeleccionado');

  }
  activeRoute(routename: string): boolean {
    return this.router.url.indexOf(routename) > -1;
  }

  OnLimpiar() {
    localStorage.removeItem("objetoRetornoBusqueda");
    localStorage.removeItem("ParametroBusqueda");
    localStorage.removeItem("filtroBusqueda");
    localStorage.removeItem("filtrobusquedaDes");
    localStorage.removeItem("indicadorBusqueda");
    localStorage.removeItem("PaginacionRetorno"); //Valor de la pagina      
    localStorage.removeItem("combocantidadRow");
  }

}

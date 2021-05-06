import { Component } from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import { Constante } from 'src/app/models/enums';

declare var jQuery:any;

@Component({
  selector: 'navigation-auditoria',
  templateUrl: 'navigation-auditoria.template.html'
})

export class NavigationAuditoriaComponent {

  constructor(private router: Router) {}

  ngAfterViewInit() {
    jQuery('#side-menu-auditoria').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }

  OnClickAuditoria(){    
    localStorage.setItem("ListaPlantilla",Constante.LISTA_PLANTILLA_AUDITORIA);
  }

}

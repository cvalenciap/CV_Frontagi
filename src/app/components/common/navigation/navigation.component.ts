import { Component } from '@angular/core';
import {Router} from '@angular/router';
import 'jquery-slimscroll';
import { Constante } from 'src/app/models/enums';
import {SessionService} from '../../../auth/session.service';

declare var jQuery:any;

@Component({
  selector: 'navigation',
  templateUrl: 'navigation.template.html',
  styleUrls: ['navigation.component.scss']
})

export class NavigationComponent {

  constructor(private router: Router, public session: SessionService) {}

  ngAfterViewInit() {
    jQuery('#side-menu').metisMenu();

    if (jQuery("body").hasClass('fixed-sidebar')) {
      jQuery('.sidebar-collapse').slimscroll({
        height: '100%'
      })
    }
  }

  activeRoute(routename: string): boolean{
    return this.router.url.indexOf(routename) > -1;
  }

  OnClick(){
    localStorage.removeItem("indCancelacionSustento");
    
    localStorage.removeItem("indicadordocumento");
    localStorage.setItem("indicadordocumento","1");
    localStorage.removeItem("activarBuscador");
    localStorage.setItem("ListaPlantilla",Constante.LISTA_PLANTILLA_DOCUMENTOS);
    localStorage.removeItem("susteso");  
    localStorage.removeItem("iddocumento");
    localStorage.removeItem("tipocopia");
    localStorage.removeItem("numeromotivo");
    localStorage.removeItem("objetoRetornoBusqueda");  
    localStorage.removeItem("objetoRetornoBusqAvanz");
    localStorage.removeItem("idProcesoSeleccionado"); 
    localStorage.removeItem('nodeSeleccionado'); 
    localStorage.removeItem("pagRetorno");
    localStorage.removeItem("objetoRetornoBusquedaSolCopia"); 
    localStorage.removeItem("objetoRetornoBusquedaCopia"); 
    localStorage.removeItem("objetoRetornoBusquedaElaboracion");
    localStorage.removeItem("objetoRetornoBusquedaHomologacion"); 
  }

  OnClickBusqGral(){
    localStorage.setItem("activarBuscador", "1");
    localStorage.removeItem("indicadordocumento");
    localStorage.setItem("indicadordocumento","2");
    localStorage.removeItem("objetoRetornoBusqueda");  
    localStorage.removeItem("objetoRetornoBusqAvanz");
    localStorage.removeItem("pagRetorno");
  }
}

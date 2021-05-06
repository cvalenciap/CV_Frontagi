import { Constante } from 'src/app/models/enums/constante';
import { Component, OnInit } from '@angular/core';
//import { ProgramacionAuditoria } from 'src/app/models/programacionauditoria';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from 'src/app/models/programa';
import { Parametro } from 'src/app/models';
import { ParametrosService } from 'src/app/services';
import { Response } from 'src/app/models/response'; 
@Component({
  selector: 'app-modal-busqueda-copiaImpresa',
  templateUrl: './modal-busqueda-copiaImpresa.component.html',
  styleUrls: ['./modal-busqueda-copiaImpresa.component.scss']
})
export class ModalBusquedaCopiaImpresaComponent implements OnInit {

  public onClose: Subject<Programa>;
  bsConfig: object;
  listaTiposCopia: Parametro; 
  busqueda:Programa;
  tipoCopia:string;
  nombres: string ;
  apellidoPaterno: string ;
  apellidoMaterno: string;
  equipo: string;
  constructor(public bsModalRef: BsModalRef,
    private parametroService: ParametrosService,
    private toastr: ToastrService,
    private localeService: BsLocaleService) { 
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
    this.tipoCopia='';
    }

  ngOnInit() {
    this.onClose = new Subject();
    this.busqueda = new Programa();
    this.busqueda.usuarioCreacion = "";
    console.log(this.busqueda);
    this.obtenerTiposCopia();
  }

  cancelar(){
    this.bsModalRef.hide();
  }

  obtenerTiposCopia() {    
    this.parametroService.obtenerParametroPadre(Constante.TIPO_COPIA).subscribe((response: Response) => {      
    this.listaTiposCopia = response.resultado; 
    this.tipoCopia = this.listaTiposCopia.idconstante+"";
    }, (error) => {
      console.log(error);
    });
  }
  /* Buscar del Modal*/
  OnBuscar(){
    this.busqueda.nombre = this.nombres;
    this.busqueda.apellpatern = this.apellidoPaterno;
    this.busqueda.apellmatern = this.apellidoMaterno;    
    this.busqueda.equipo= this.equipo;
    this.busqueda.tipocopi= this.tipoCopia; 
    this.bsModalRef.hide();
    this.onClose.next(this.busqueda);

    /*if(this.busqueda.usuarioCreacion != "" || (this.busqueda.fechaPrograma != undefined && this.busqueda.fechaPrograma != null)){
     
    } */   
    console.log(this.busqueda);
  }

}

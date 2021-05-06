import { Component, OnInit } from '@angular/core';
import { Subject, forkJoin } from 'rxjs';
import { BandejaRevisionInforme } from 'src/app/models/bandejarevisioninforme';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';


import { Response } from './../../../../models/response';

@Component({
  selector: 'app-modal-busqueda-avaz-bandj',
  templateUrl: './modal-busqueda-avaz-bandj.component.html',
  styleUrls: ['./modal-busqueda-avaz-bandj.component.scss']
})
export class ModalBusquedaAvazBandjComponent implements OnInit {

  public onClose: Subject<BandejaRevisionInforme>;

 
  bsConfig: object;
  listaAuditores:any[];
  busqueda:BandejaRevisionInforme;
  loading:boolean;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService
    ) { 
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
    this.loading = false;
    }

    ngOnInit() {
      this.onClose = new Subject();
      this.busqueda = new BandejaRevisionInforme();
      this.listaAuditores = [];
      this.obtenerParametros();
    }
  
    cancelar(){
      this.bsModalRef.hide();
    }
  

 obtenerParametros(){
     /* const buscaAuditor = this.service.obtenerAuditores();
      forkJoin(buscaAuditor)
      .subscribe(([buscaAuditor]:[Response])=>{
        this.listaAuditores = buscaAuditor.resultado;

      },
      (error) => this.controlarError(error));*/
    }

    controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
  
    buscar(){
      if(this.busqueda.numeroAuditor != "" || this.busqueda.apellidoPat != ""  || this.busqueda.apellidoMat != ""
      || this.busqueda.nombre != ""){
        this.bsModalRef.hide();  
        this.onClose.next(this.busqueda);
      }
    }
  


}

import { Component, OnInit } from '@angular/core';
//import { ProgramacionAuditoria } from 'src/app/models/programacionauditoria';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Programa } from 'src/app/models/programa';

@Component({
  selector: 'app-modal-anadir-copiaImpresa',
  templateUrl: './modal-anadir-copiaImpresa.component.html',
  styleUrls: ['./modal-anadir-copiaImpresa.component.scss']
})
export class ModalAnadirCopiaImpresaComponent implements OnInit {

  public onClose: Subject<Programa>;
  bsConfig: object;

  busqueda:Programa;

  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService) { 
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
    }

  ngOnInit() {
    this.onClose = new Subject();
    this.busqueda = new Programa();
    this.busqueda.usuarioCreacion = "";
    console.log(this.busqueda);
  }

  cancelar(){
    this.bsModalRef.hide();
  }

  buscar(){
    console.log(this.busqueda);
    
    if(this.busqueda.usuarioCreacion != "" || (this.busqueda.fechaPrograma != undefined && this.busqueda.fechaPrograma != null)){
      this.bsModalRef.hide();
      this.onClose.next(this.busqueda);
    }
    
  }

}

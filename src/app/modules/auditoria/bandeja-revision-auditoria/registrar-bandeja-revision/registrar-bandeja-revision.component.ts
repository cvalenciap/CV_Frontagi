import { Component, OnInit } from '@angular/core';

import { Paginacion, Tipo } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService, BsModalRef, defineLocale, esLocale } from 'ngx-bootstrap';
import { BandejaRevisionAuditoria } from 'src/app/models/bandejarevisionauditoria';
import { BandejaRevisionAuditoriaService } from 'src/app/services/impl/bandejaRevisionAuditoria.service';    
import {Response} from '../../../../models/response';

@Component({
  selector: 'registrar-bandeja-revision',
  templateUrl: './registrar-bandeja-revision.component.html',
  styleUrls: ['./registrar-bandeja-revision.component.scss'],
  providers: [BandejaRevisionAuditoria]
})
export class RegistrarBandejaRevisionComponent implements OnInit {

  fechaProgramacionDefecto:string;
  usuarioCreacionDefecto:string;

   /* datos */
   items: string[];
   /* filtros */
   textoBusqueda: string;
   parametroBusqueda: string;
   /* paginación */
   paginacion: Paginacion;
   /* registro seleccionado */
   selectedRow: number;
   //selectedObject: RutaResponsable;
   /* indicador de carga */
   loading: boolean;
   itemCodigo: number;
    /* datos */
    //selectedObject: DetalleProgramacion;
    listaTipos: Tipo[];
    item: BandejaRevisionAuditoria;

    private sub: any;
    bsModalRef: BsModalRef;
  
   
    listaDocumentosRelacionados=[];
    listaDocRel=[];

  constructor(   
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: BandejaRevisionAuditoriaService,
   
  ){  
      this.loading = false;
      this.selectedRow = -1;
      this.items = ['Elaboración de Lista de Verificación','1','1','1','1','1'];
      this.parametroBusqueda = 'codigo';
      this.paginacion = new Paginacion({registros: 10});

      defineLocale('es', esLocale);
      this.localeService.use('es');
      this.selectedRow = -1;
        
      this.listaDocumentosRelacionados=["MAMPRO01","MAMPRO02"];
      this.listaDocRel=["ISO-15001 - 8.5.3 Acción Preventiva",
      "OSHA - 14001 - 8.5.3 Acción Preventiva"]; }

 

obtenerDocumentosRelacionados(){

}

  ngOnInit() {
    this.sub = this.route.params.subscribe(params => {
    this.itemCodigo = + params['codigo'];
      
    this.obtenerDocumentosRelacionados();

  });  

  if (this.itemCodigo) {
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
          (response: Response) => {
            this.item = response.resultado
           
          },
         
      );
  } else {    
      this.item = new BandejaRevisionAuditoria()
  }
  
}

  OnRegresar() {
    this.router.navigate([`auditoria/registrar-bandeja-revision`]);
}


}

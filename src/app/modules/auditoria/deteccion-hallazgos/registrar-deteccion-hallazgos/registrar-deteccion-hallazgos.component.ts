import { Component, OnInit } from '@angular/core';
import { DeteccionHallazgos } from 'src/app/models/deteccionhallazgos';

//import { DetalleProgramacion } from 'src/app/models/detalleprogramacion';
import { Paginacion, Tipo } from './../../../../../app/models';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import {Response} from './../../../../models/response';
import { DeteccionHallazgosMockService as DeteccionHallazgosService} from './../../../../services/index';


//import { ModalDetalleProgramacionComponent } from '../../modales/modal-detalle-programacion/modal-detalle-programacion.component';
import {MatListModule} from '@angular/material/list';
  


@Component({
  selector: 'registrar-deteccion-hallazgos',
  templateUrl: './registrar-deteccion-hallazgos.component.html',
  styleUrls: ['./registrar-deteccion-hallazgos.component.scss']
})
export class RegistrarDeteccionHallazgosComponent implements OnInit {
  

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
    item: DeteccionHallazgos;
    private sub: any;
    bsModalRef: BsModalRef;

   
    listaDocumentosRelacionados=[];
    listaDocRel=[];
  constructor(   
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: DeteccionHallazgosService,

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
      this.listaDocRel=["ISO-15001 - 8.5.3 Acción Preventiva","OSHA - 14001 - 8.5.3 Acción Preventiva"]; }


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
        
          this.item = new DeteccionHallazgos()
         
          
      }
      
    }
       

  OnRegresar() {
    this.router.navigate([`auditoria/deteccion-hallazgos`]);
}

}

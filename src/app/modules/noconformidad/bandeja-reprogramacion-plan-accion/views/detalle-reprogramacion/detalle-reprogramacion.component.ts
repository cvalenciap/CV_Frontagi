import { Component, OnInit } from '@angular/core';
import { Paginacion, Tipo } from './../../../../../../app/models';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Response} from './../../../../../models/response';
import { BandejaReprogramacionService } from './../../../../../services/index';
import { ModalDetalleAccionPropuestaComponent } from '../../modales/modal-detalle-accion-propuesta.component';
import { Reprogramacion } from 'src/app/models/reprogramacion';
import { DetalleReprogramacion } from 'src/app/models/detallereprogramacion';
import { forkJoin } from 'rxjs';
import { DetalleAccionPropuesta } from 'src/app/models/detalleaccionpropuesta';

@Component({
  selector: 'app-detalle-reprogramacion',
  templateUrl: './detalle-reprogramacion.template.html',
  styleUrls: ['./detalle-reprogramacion.component.scss']
})
export class DetalleReprogramacionComponent implements OnInit {

  items: DetalleReprogramacion[];
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Reprogramacion;
  loading: boolean;
  itemId: number;
  
  private sub: any;
  bsModalRef: BsModalRef;
  listaPlanSeleccion: Reprogramacion;
  accesoUsuario: string;
  ocultarElemento: boolean;
  deshabilitarCaja: boolean;
  
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: BandejaReprogramacionService,
              private modalService: BsModalService
    ) {
      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
      this.paginacion = new Paginacion({registros: 10});
      this.listaPlanSeleccion = new Reprogramacion();

      defineLocale('es', esLocale);
      this.localeService.use('es');
      this.selectedRow = -1;
      this.accesoUsuario = "";
      this.ocultarElemento = true;
  }

  ngOnInit() {
    
      this.items = [];
      this.listaPlanSeleccion = new Reprogramacion();
      this.validarUsuario();
      this.sub = this.route.params.subscribe(params => {
        this.itemId = + params['idNoConformidad'];
        this.getLista();
      });
  }

  validarUsuario(){
    
    this.accesoUsuario = sessionStorage.getItem("accesoUsuario");
    if(this.accesoUsuario == "0"){
      this.ocultarElemento = true;
      this.deshabilitarCaja = false;
    } else {
      this.ocultarElemento = false;
      this.deshabilitarCaja = true;
    } 
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getLista();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getLista();
  }

  getLista(): void {
    
    this.loading = true;
    if(this.itemId){
      this.service.buscarDetallePlanAccion(this.itemId, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
          this.items = response.resultado;
          this.paginacion = new Paginacion(response.paginacion);
          this.loading = false; },
          (error) => this.controlarError(error)
      )
    }
  }

  abrirModalDetalleAccionPropuesta(objetoSeleccionado: Reprogramacion){
    
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        listaPlanSeleccion: Object.assign({},objetoSeleccionado),
        ocultarElemento: this.ocultarElemento,
        deshabilitarCaja: this.deshabilitarCaja
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalDetalleAccionPropuestaComponent, config);
    (<ModalDetalleAccionPropuestaComponent>this.bsModalRef.content).onClose.subscribe(result => {
      
      let listaAccionPropuestas:Reprogramacion = result;
      this.getLista();
    });
  }

  OnRegresar() {
    this.router.navigate([`noconformidad/bandejareprogramacion`]);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }
  
  controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
}

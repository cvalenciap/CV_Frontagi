import { Component, OnInit } from '@angular/core';
import { Auditor } from 'src/app/models/auditor';
import { Subject } from 'rxjs';
import { PlanAuditoriaMockService as PlanAuditoriaService} from './../../../../../services/index';
import { BsModalRef, BsModalService, BsLocaleService,defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../../models/response';

@Component({
  selector: 'app-modal-busqueda-detectores',
  templateUrl: './modal-busqueda-detectores.component.html',
  styleUrls: ['./modal-busqueda-detectores.component.scss'],
  providers: [PlanAuditoriaService]
})
export class ModalBusquedaDetectoresComponent implements OnInit {

public onClose: Subject<Auditor>;
  bsConfig: object;
  nuevo:boolean;
  loading:boolean;
  selectedRow:number;
  participantes:Auditor[];
  paginacion:Paginacion;
  auditorBusqueda:Auditor;
  selectedObject: Auditor;
   
  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private planAuditoriaService: PlanAuditoriaService,
    private localeService: BsLocaleService) {
      this.selectedRow = -1;
      this.participantes = [];
      this.paginacion = new Paginacion({registros: 10});
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
     }

  ngOnInit() {
    this.onClose = new Subject();
    this.auditorBusqueda = new Auditor();
    this.obtenerAuditores();
  }

  buscar(){
    this.obtenerAuditores();
  }

  obtenerAuditores(){
    this.loading = true;
    const parametros: {nroFicha?: string, apePaterno?: string, apeMaterno?: string, nombres?:string} = {nroFicha: null, apePaterno: null, apeMaterno: null, nombres:null};
    
    this.planAuditoriaService.buscarAuditoresPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
            this.participantes = response.resultado;
            this.paginacion = new Paginacion(response.paginacion);
            this.loading = false; },
        (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  cancelar(){
    this.bsModalRef.hide();
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.obtenerAuditores();
  }
  OnPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
      this.obtenerAuditores();
  }

  seleccionarAuditor(){
    this.bsModalRef.hide();
    this.onClose.next(this.selectedObject);
  }
  

}

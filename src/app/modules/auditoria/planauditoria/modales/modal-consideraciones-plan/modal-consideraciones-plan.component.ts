import { Component, OnInit } from '@angular/core';
import { ConsideracionPlan } from 'src/app/models/consideracionesplan';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PlanAuditoriaMockService as PlanAuditoriaService } from './../../../../../services/index';
import { PlanAuditoria } from './../../../../../models/planauditoria';
import { Response } from './../../../../../models/response';
import { Paginacion } from 'src/app/models';
import { ModalConfirmacionComponent } from 'src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component';
import { RegistroConsideracion } from 'src/app/models/registroconsideracion';

@Component({
  selector: 'app-modal-consideraciones-plan',
  templateUrl: './modal-consideraciones-plan.component.html',
  styleUrls: ['./modal-consideraciones-plan.component.scss'],
  providers: [PlanAuditoriaService]
})
export class ModalConsideracionesPlanComponent implements OnInit {

  public onClose: Subject<RegistroConsideracion>;
  bsConfig: object;
  nuevo: boolean;
  selectedRow: number;
  selectedObject: ConsideracionPlan;
  items: ConsideracionPlan[];
  planAuditoria: PlanAuditoria;
  paginacion: Paginacion;
  loading: boolean;
  consideracionEntrada: string;
  listaConsAux: ConsideracionPlan[];

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private planAuditoriaService: PlanAuditoriaService,
    private localeService: BsLocaleService) {
    this.selectedRow = -1;
    this.paginacion = new Paginacion({ registros: 10 });

    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.consideracionEntrada = "";
  }

  ngOnInit() {
    this.onClose = new Subject();
    //this.getLista();
  }

  cancelar() {
    this.bsModalRef.hide();
  }
  agregarConsideracion() {
    if (this.consideracionEntrada != "") {
      console.log(this.consideracionEntrada);
      let cantidadItems: number = this.items.length;
      let nroItem: number = cantidadItems + 1;
      let objConsideracion: ConsideracionPlan = new ConsideracionPlan();
      objConsideracion.textoConsideracion = this.consideracionEntrada;
      objConsideracion.estadoRegistro = "1";
      this.items.push(objConsideracion);
      this.listaConsAux.push(objConsideracion);
      this.consideracionEntrada = "";
    }

  }

  quitarConsideracion(indiceConsideracion: number, item: ConsideracionPlan) {
    let consideracionEliminar: ConsideracionPlan;
    let indice: number = 0;
    for (let i: number = 0; i < this.listaConsAux.length; i++) {
      if (this.listaConsAux[i].textoConsideracion == item.textoConsideracion) {
        indice = i;
        break;
      }
    }

    this.items.splice(indiceConsideracion, 1);
    this.listaConsAux[indice].estadoRegistro = "0";
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  getLista() {
    this.planAuditoria = new PlanAuditoria();
    this.loading = true;
    this.planAuditoriaService.buscarConsideraciones(this.planAuditoria.idPlan).subscribe(
      (response: Response) => {
        this.items = <Array<ConsideracionPlan>>response.resultado;
        console.log(this.items);
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false;
      },
      (error) => this.controlarError(error)
    )
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  grabarListaConsideraciones() {
    /*
    const modal = this.modalService.show(ModalConfirmacionComponent, { ignoreBackdropClick: true, keyboard: false });
            (<ModalConfirmacionComponent>modal.content).showConfirmationModal(
                'Confirmación',
                '¿Está seguro que desea guardar el registro?'
            );

            (<ModalConfirmacionComponent>modal.content).onClose.subscribe(result => {
                if (result) {
                    this.guardarConfirmacion();
                }
            });
      */
    this.guardarConfirmacion();
  }

  guardarConfirmacion() {
    let regConsider: RegistroConsideracion = new RegistroConsideracion();
    regConsider.listaConsideracion = this.items;
    regConsider.listaConsideracionAuxiliar = this.listaConsAux,

      this.bsModalRef.hide();
    this.onClose.next(regConsider);
  }

}

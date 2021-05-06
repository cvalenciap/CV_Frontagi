import { Component, OnInit } from '@angular/core';
import { ConsideracionPlan } from 'src/app/models/consideracionesplan';
import { Subject, forkJoin } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { PlanAuditoriaMockService as PlanAuditoriaService, GeneralService} from '../../../../../services/index';
import { PlanAuditoria } from '../../../../../models/planauditoria';
import { Response } from '../../../../../models/response';
import { Paginacion } from 'src/app/models';
import { RegistroConsideracion } from 'src/app/models/registroconsideracion';
import { NombreParametro } from 'src/app/constants/general/general.constants';
import { RequisitoAuditoriaRegistro } from 'src/app/models/requisitoauditoriaregistro';
import { Auditoria } from 'src/app/models/auditoria';
import { CriterioResultado } from 'src/app/models/criterioResultado';

@Component({
  selector: 'app-modal-criterios',
  templateUrl: './modal-criterios.component.html',
  styleUrls: ['./modal-criterios.component.scss'],
  providers: [PlanAuditoriaService]
})
export class ModalCriteriosComponent implements OnInit {

  public onClose: Subject<RegistroConsideracion>;
  bsConfig: object;
  nuevo:boolean;
  selectedRow:number;

  selectedObject:ConsideracionPlan;
  planAuditoria:PlanAuditoria;
  paginacion:Paginacion;
  loading:boolean;
  consideracionEntrada: string;
  listaConsAux:ConsideracionPlan[];
  listaSeleccionCriterios:any[];
  criterioSeleccionado:any;
  item: Auditoria;
  listaCriteriosAuxiliar:CriterioResultado[];

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private planAuditoriaService: PlanAuditoriaService,
    private generalService: GeneralService,
    private localeService: BsLocaleService) {
      this.selectedRow = -1;
      this.paginacion = new Paginacion({registros: 10});
      
      defineLocale('es', esLocale);
      this.localeService.use('es');
      this.consideracionEntrada = "";
     }

  ngOnInit() {
    this.onClose = new Subject();
    this.item = new Auditoria();
    this.item.listaCriterios=[];
    this.buscarParametros();
  }

  cancelar(){
    this.bsModalRef.hide();
  }
  agregarConsideracion(){
    if(this.consideracionEntrada != ""){
      console.log(this.consideracionEntrada);
      //let cantidadItems:number = this.items.length;
      //let nroItem:number = cantidadItems + 1;
      let objConsideracion:ConsideracionPlan = new ConsideracionPlan();
      objConsideracion.textoConsideracion = this.consideracionEntrada;
      objConsideracion.estadoRegistro = "1";
      //this.items.push(objConsideracion);
      this.listaConsAux.push(objConsideracion);
      this.consideracionEntrada = "";
    }
    
  }

  quitarConsideracion(indiceConsideracion:number,item: ConsideracionPlan){
    let consideracionEliminar:ConsideracionPlan;
    let indice:number = 0;
    for(let i:number = 0; i<this.listaConsAux.length;i++){
      if(this.listaConsAux[i].textoConsideracion == item.textoConsideracion){
        indice = i;
        break;
      }
    }
    
    //this.items.splice(indiceConsideracion,1);
    this.listaConsAux[indice].estadoRegistro = "0";
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  getLista(){
    this.planAuditoria = new PlanAuditoria();
    this.loading = true;
    this.planAuditoriaService.buscarConsideraciones(this.planAuditoria.idPlan).subscribe(
      (response: Response) => {
        //this.items = <Array<ConsideracionPlan>>response.resultado;
        
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
    (error) => this.controlarError(error)
    )
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  grabarListaConsideraciones(){
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
    // this.guardarConfirmacion();
  }

 /*  guardarConfirmacion(){
    let regConsider:RegistroConsideracion = new RegistroConsideracion();
    regConsider.listaConsideracion = this.items;
    regConsider.listaConsideracionAuxiliar = this.listaConsAux,

    this.bsModalRef.hide();
    this.onClose.next(regConsider);
  } */

  buscarParametros(){
    let buscaCriterios = this.generalService.obtenerParametroPadre(NombreParametro.listaCriterios);
    forkJoin(buscaCriterios).subscribe(([buscaCriterios]:[Response])=>{
        
        this.listaSeleccionCriterios = buscaCriterios.resultado;
      },
      (error) => this.controlarError(error));
  }

  agregarCriterio() {
    
    if (this.criterioSeleccionado != undefined && this.criterioSeleccionado != null && this.criterioSeleccionado != "") {
      let flag: boolean = false;
      for (let i: number = 0; this.item.listaCriterios.length > i; i++) {
        if (this.criterioSeleccionado.v_campcons1 == this.item.listaCriterios[i].valorCriterio) {
          flag = true;
          break;
        }
      }
      if (!flag) {
        let criterio: CriterioResultado = new CriterioResultado();
        criterio.valorCriterio = this.criterioSeleccionado.v_campcons1;
        criterio.descripcionCriterio = this.criterioSeleccionado.v_valcons;
        criterio.estadoRegistro = "1";
        this.item.listaCriterios.push(criterio);

        let criterioAux = this.listaCriteriosAuxiliar.find(obj => obj.valorCriterio == criterio.valorCriterio);
        if (criterioAux != undefined && criterioAux != null) {
          criterioAux.estadoRegistro = "1";
        } else {
          this.listaCriteriosAuxiliar.push(criterio);
        }
      }
    }
  }
}

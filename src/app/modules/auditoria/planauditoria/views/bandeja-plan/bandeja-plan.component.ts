import { Component, OnInit, SecurityContext } from '@angular/core';
//import { PlanAuditoria } from 'src/app/models/planauditoria';
import { Paginacion } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { forkJoin } from 'rxjs';
import { DomSanitizer } from '@angular/platform-browser';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';


import { PlanAuditoria } from 'src/app/models/planauditoria';
import { Response } from './../../../../../models/response';
import { PlanAuditoriaMockService,PlanAuditoriaService, GeneralService} from './../../../../../services/index';
import { ModalBusquedaPlanComponent } from '../../modales/modal-busqueda-plan/modal-busqueda-plan.component';
import { Auditoria } from 'src/app/models/auditoria';
import { NombreParametro } from 'src/app/constants/general/general.constants';

@Component({
  selector: 'app-bandeja-plan',
  templateUrl: './bandeja-plan.component.html',
  styleUrls: ['./bandeja-plan.component.scss']
})
export class BandejaPlanComponent implements OnInit {

    /* datos */
    items: Auditoria[];
    /* filtros */
    textoBusqueda: string;
    parametroBusqueda: string;
    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
    selectedObject: Auditoria;
    /* indicador de carga */
    loading: boolean;

    opcionBusqueda:string;

    listaTipos:any[];
    listaDetectores:any[];
    listaEstados:any[];

    mostrarAlerta:boolean;
    mensajeAlerta:string;

    valorTipo:string;
    valorDetector:string;
    valorEstado:string;

    busquedaPlan:Auditoria;

    bsModalRef: BsModalRef;

    //Inicio Prototipo
    mostrarA: boolean;
    mostrarB: boolean;
    mostrarC: boolean;
    //Fin Prototipo

  constructor(
    private toastr: ToastrService,
    private router: Router,
    private service: PlanAuditoriaMockService,
    private serviceBD: PlanAuditoriaService,
    private generalService: GeneralService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) {

      this.loading = false;
      this.selectedRow = -1;
      this.items = [];
      this.parametroBusqueda = 'tipo';
      this.opcionBusqueda = "";
      this.paginacion = new Paginacion({registros: 10});
      this.listaTipos = [];
      this.listaDetectores = [];
      this.listaEstados = [];
      this.mostrarA = true;
      this.mostrarB = true;
      this.mostrarC = true;
      
     }

  ngOnInit() {
    this.inicializandoParametros();
    this.obtenerParametros();
    
    this.mostrarAlerta = false;
    this.mensajeAlerta = "";
    
    
    this.getLista();
  }

  getLista(): void {
    this.loading = true;
    const parametros: {tipo?: string, detector?: string, estado?: string} = {tipo: null, detector: null, estado: null};
    switch (this.parametroBusqueda) {
        case 'tipo':
            parametros.tipo = this.valorTipo;
            break;

        case 'estado':
            parametros.estado = this.valorEstado;
            break;
        
        case 'avanzada':
            if(this.busquedaPlan.tipoAuditoria != ""){
                parametros.tipo = this.busquedaPlan.tipoAuditoria;
            }
            if(this.busquedaPlan.estadoAuditoria != ""){
                parametros.estado = this.busquedaPlan.estadoAuditoria;
            }
            
    }
    this.serviceBD.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
            this.items = response.resultado;
            console.log(this.items);

            if(this.items.length>0){
                this.items = this.generalService.agregarItem(response.resultado,response.paginacion);
            }
            
            this.paginacion = new Paginacion(response.paginacion);
            this.loading = false; },
        (error) => this.controlarError(error)
    );
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
OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
}
OnBuscar(): void {

    let texto:string = "<strong>Busqueda Por: </strong>";
    switch (this.parametroBusqueda) {
        case 'tipo':
            texto = texto + "<br/><strong>Tipo: </strong>"+this.obtenerValorTipo(this.valorTipo);
            break;

        case 'estado':
            texto = texto + "<br/><strong>Estado: </strong>"+this.obtenerValorEstado(this.valorEstado);
            break;
        case 'avanzada':
            if(this.busquedaPlan.tipoAuditoria != ""){
                texto = texto + "<br/><strong>Tipo: </strong>"+this.obtenerValorTipo(this.busquedaPlan.tipoAuditoria);
            }

            if(this.busquedaPlan.estadoAuditoria != ""){
                texto = texto + "<br/><strong>Estado: </strong>"+this.obtenerValorEstado(this.busquedaPlan.estadoAuditoria);
            }
    }
    this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    this.mostrarAlerta = true;
    this.paginacion.pagina = 1;
    this.getLista();
  }




  OnModificar(item:Auditoria): void {
      this.router.navigate([`auditoria/plan-auditoria/editar/${item.idAuditoria}`]);
  }
  onEliminar(item:Auditoria):void{
      this.serviceBD.eliminar(item).subscribe(
          (response: Response) => {
              console.log(this.paginacion.totalPaginas.toString());
              this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
              this.getLista();
              this.loading = false;
          },
          (error) => this.controlarError(error)
      );
  }
  controlarError(error) {
      console.error(error);
      this.loading = false;
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  activarOpcion(accion:number){
    this.opcionBusqueda = "";
    switch(accion){
      case 1: this.parametroBusqueda = "tipo"; break;
      case 2: this.parametroBusqueda = "detector"; break;
      case 3: this.parametroBusqueda = "estado"; break;
    }
  }

  abrirBusqueda(){
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalBusquedaPlanComponent, config);
    (<ModalBusquedaPlanComponent>this.bsModalRef.content).onClose.subscribe(result => {
        this.busquedaPlan = result;
        this.OnBuscar();



    });
  }

  obtenerParametros(){
    const buscaTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTipos);
    const buscaEstados = this.generalService.obtenerParametroPadre(NombreParametro.listaEstadosAuditoria);

      forkJoin(buscaTipos,buscaEstados)
      .subscribe(([buscaTipos,buscaEstados]:[Response,Response])=>{
        this.listaTipos = buscaTipos.resultado;
        this.listaEstados = buscaEstados.resultado;
        console.log(this.listaTipos);
        console.log(this.listaEstados);
      },
      (error) => this.controlarError(error));
  }

  inicializandoParametros(){
      this.valorTipo = "";
      this.valorDetector = "";
      this.valorEstado = "";
  }

  obtenerValorTipo(valor:string){
      console.log("Obtener valor tipo");
      console.log(this.listaTipos);
      console.log(valor);
      let valorTipo = this.listaTipos.find(item => item.v_campcons1 == valor);
      return valorTipo.v_valcons;
  }


  obtenerValorEstado(valor:string){
    console.log(valor);
    let valorEstado = this.listaEstados.find(item => item.v_campcons1 == valor);
    return valorEstado.v_valcons;
}

    //Inicio Prototipo
    OnHabilitarAL() {
        this.mostrarA = true;
        this.mostrarB = false;
        this.mostrarC = false;
    }

    OnHabilitarAI() {
        this.mostrarA = true;
        this.mostrarB = true;
        this.mostrarC = false;
    }

    OnHabilitarCO() {
        this.mostrarA = false;
        this.mostrarB = false;
        this.mostrarC = true;
    }

    OnHabilitarRAD() {
        this.mostrarA = true;
        this.mostrarB = false;
        this.mostrarC = false;
    }
    //Fin Prototipo

}

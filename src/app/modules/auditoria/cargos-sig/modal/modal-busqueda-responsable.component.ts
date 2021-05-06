import { Component, OnInit } from '@angular/core';
import { Auditor } from 'src/app/models/auditor';
import { Subject, forkJoin, from } from 'rxjs';
import { PlanAuditoriaMockService,PlanAuditoriaService, FichaRegistroAuditorService} from 'src/app/services';
import { BsModalRef, BsModalService, BsLocaleService,defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Paginacion } from 'src/app/models';
import { Response } from 'src/app/models/response';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { FichaAuditorService } from 'src/app/services/impl/fichaauditor.service';
import { NombreParametro } from 'src/app/constants/general/general.constants';
import { GeneralService } from 'src/app/services';

@Component({
  selector: 'app-modal-busqueda-responsable',
  templateUrl: './modal-busqueda-responsable.component.html',
  styleUrls: ['./modal-busqueda-responsable.component.scss']
})
export class ModalBusquedaResponsableComponent implements OnInit {
  public onClose: Subject<RegistroAuditor>;
  bsConfig: object;
  nuevo:boolean;
  loading:boolean;
  selectedRow:number;
  participantes:RegistroAuditor[];
  paginacion:Paginacion;
  auditorBusqueda:RegistroAuditor;
  selectedObject: RegistroAuditor;
  indicadorBusqueda:string;
  listaRolAuditor:any[];

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private toastr: ToastrService,
    private generalService:GeneralService,
    private planAuditoriaService: PlanAuditoriaMockService,
    private auditorService:FichaRegistroAuditorService,
    private localeService: BsLocaleService) {
      this.selectedRow = -1;
      this.participantes = [];
      this.paginacion = new Paginacion({registros: 10});
      defineLocale('es', esLocale);
    this.localeService.use('es');
     }

  ngOnInit() {
    this.onClose = new Subject();
    this.auditorBusqueda = new RegistroAuditor("","","","",0,"",0,"");
    this.obtenerParametros();
    //this.obtenerAuditores();
  }

  buscar(){

    this.obtenerAuditores();
  }

  obtenerAuditores(){
    this.loading = true;
    const parametros: {nroFicha?: string, nombres?: string, apePaterno?: string, apeMaterno?: string, idRol:string} = {nroFicha: null, nombres: null, apePaterno: null, apeMaterno:null, idRol:null};

    if(this.auditorBusqueda.numFicha != ""){
      parametros.nroFicha = this.auditorBusqueda.numFicha;
    }

    if(this.auditorBusqueda.nombreAuditor != ""){
      parametros.nombres = this.auditorBusqueda.nombreAuditor;
    }

    if(this.auditorBusqueda.apePaternoAuditor != ""){
      parametros.apePaterno = this.auditorBusqueda.apePaternoAuditor;
    }

    if(this.auditorBusqueda.apeMaternoAuditor != ""){
      parametros.apeMaterno = this.auditorBusqueda.apeMaternoAuditor;
    }

    if(this.indicadorBusqueda == "2"){
      parametros.idRol = this.obtenerIdentificadorRol("Auditor Lider");
    }else if(this.indicadorBusqueda == "3"){
      parametros.idRol = this.obtenerIdentificadorRol("Auditor Lider del Grupo");
    }

    this.auditorService.buscarAuditores(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
            this.participantes = response.resultado;
            console.log(this.participantes);
            console.log(response.paginacion);
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
    console.log(this.selectedObject);
    this.bsModalRef.hide();
    this.onClose.next(this.selectedObject);
  }

  obtenerParametros(){


    let buscaRolAuditor = this.generalService.obtenerParametroPadre(NombreParametro.listadoRolAuditor);

    forkJoin(buscaRolAuditor)
      .subscribe(([buscaRolAuditor]:[Response])=>{
        this.listaRolAuditor = buscaRolAuditor.resultado;
      },
      (error) => this.controlarError(error));
  }

  obtenerIdentificadorRol(nombreRol){
    let objeto:any = this.listaRolAuditor.find(obj => obj.v_valcons == nombreRol);
    return objeto.idconstante;
  }

  limpiar(){
    this.auditorBusqueda = new RegistroAuditor("","","","",0,"",0,"");
    this.participantes = [];
    this.selectedRow = -1;
    this.selectedObject = null;
  }

}

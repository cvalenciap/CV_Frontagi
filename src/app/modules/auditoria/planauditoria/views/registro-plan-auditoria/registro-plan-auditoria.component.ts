import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef, BsModalService } from 'ngx-bootstrap';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { RequisitoAuditoria } from './../../../../../models/requisitoauditoria';
import { Paginacion } from 'src/app/models';
//import { PlanAuditoria } from 'src/app/models/planauditoria';
import { Response } from './../../../../../models/response';
import { PlanAuditoriaMockService, PlanAuditoriaService, GeneralService} from './../../../../../services/index';
import { ModalConsideracionesPlanComponent } from '../../modales/modal-consideraciones-plan/modal-consideraciones-plan.component';
import { ConsideracionPlan } from 'src/app/models/consideracionesplan';
import { ModalRegistroRequisitosComponent } from '../../modales/modal-registro-requisitos/modal-registro-requisitos.component';
import { CriterioResultado } from 'src/app/models/criterioResultado';
import { forkJoin } from 'rxjs';
import { ModalConfirmacionComponent } from 'src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component';
import { Auditoria } from 'src/app/models/auditoria';
import { Auditor } from 'src/app/models/auditor';
import { AnadirRequisitosAuditoriaComponent } from '../anadir-requisitos-auditoria/anadir-requisitos-auditoria.component';
import { NombreParametro } from 'src/app/constants/general/general.constants';
import { RequisitoAuditoriaRegistro } from 'src/app/models/requisitoauditoriaregistro';
import { DatePipe } from '@angular/common';
import { ManejadorPlanAuditoria } from 'src/app/models/manejadorPlanAuditoria';
import { ModalBusquedaAuditorComponent } from '../../modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { ModalObservacionPlanComponent } from '../../modales/modal-observar/modal-observacion-plan.component';
import { ModalCriteriosComponent } from '../../modales/modal-criterios/modal-criterios.component';


@Component({
  selector: 'app-registro-plan-auditoria',
  templateUrl: './registro-plan-auditoria.component.html',
  styleUrls: ['./registro-plan-auditoria.component.scss']
}) 
export class RegistroPlanAuditoriaComponent implements OnInit {
  @ViewChild('hijo') componenteHijo:AnadirRequisitosAuditoriaComponent;

  private sub:any;

  itemCodigo:string;

  planAuditoriaForm: FormGroup;
  items: RequisitoAuditoriaRegistro[];
  item: Auditoria;

  anioPrograma:string;
  tipoAuditoria:string;
  checkConfirmar:boolean;

  criterioSeleccionado:any;

  listaSeleccionCriterios:any[];

  listaCriterios:CriterioResultado[];
  listaCriteriosAuxiliar:CriterioResultado[];

  listaConsideracionesAuxiliar:ConsideracionPlan[];

  listaTipos:any[];
  listaAuditores:any[];
  listaObservadores:any[];

  paginacion: Paginacion;
  /* registro seleccionado */
  filaSeleccionada: number;


  selectedRow: number;
  selectedObject: RequisitoAuditoriaRegistro;

  selectedCriterioRow:number;
  selectedCriterio:CriterioResultado;

  loading: boolean;

  parametroBusqueda:string;//parametro enviado por ruta

  bsModalRef:BsModalRef;

  anadirRequisitos:boolean;

  validaCriterio:boolean;

  nuevo:boolean;

  listaComites:any[];
  listaGerencias:any[];
  listaEquipos:any[];
  listaCargos:any[];

  nombreAuditorLider:string;
  nombreObsLiderGrupo:string;

  validaEstadoPlanAuditoria:boolean;
  mostrarA: boolean;
  mostrarB: boolean;
  mostrarC: boolean;
  mostrarD: boolean;
  mostrarE: boolean;
  mostrarBotonA: boolean;
  mostrarBotonB: boolean;


  constructor(private fb: FormBuilder,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private localeService: BsLocaleService,
              private planAuditoriaService: PlanAuditoriaMockService,
              private planAuditoriaServiceBD: PlanAuditoriaService,
              private generalService: GeneralService,
              private modalService: BsModalService,
              private datePipe: DatePipe) {
                this.loading = false;
                this.filaSeleccionada = -1;
                  this.selectedRow = -1;
                  this.selectedCriterioRow = -1
                  this.criterioSeleccionado = "";
                  this.items = [];
                  this.listaComites = [];
                  this.listaGerencias= [];
                  this.listaEquipos= [];
                  this.listaCargos= [];
                  this.parametroBusqueda = 'codigo';
                  this.listaCriterios = [];
                  this.paginacion = new Paginacion({registros: 10});
                  this.anadirRequisitos = false;
                  this.anioPrograma = "";
                  this.tipoAuditoria = "2";
                  defineLocale('es', esLocale);
                  this.localeService.use('es');
                  this.mostrarA = true;
                  this.mostrarB = true;
                  this.mostrarC = true;
                  this.mostrarD = true;
                  this.mostrarE = true;
                  this.mostrarBotonA = true;
                  this.mostrarBotonB = true;
                  this.checkConfirmar = true;
               }

  ngOnInit() {
    
    this.validaCriterio = true;

    this.crearFormulario();
    this.buscarParametros();

    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = params['codigo'];
      
      this.item = new Auditoria();
      if(this.itemCodigo != undefined && this.itemCodigo != null){
        this.nuevo = false;
        console.log(this.itemCodigo);
        this.obtenerDatosCodigo(this.itemCodigo);
      }else{
        this.nuevo = true;
        this.listaCriteriosAuxiliar = [];
        this.listaConsideracionesAuxiliar = [];
        this.item.tipoAuditoria = "2"; //Auditoria externa
        this.nombreAuditorLider = "";
        this.nombreObsLiderGrupo = "";
        this.validaEstadoPlanAuditoria = true;
      }
      //this.obtenerListaConsideraciones();
      
      this.items = [];
     // this.getLista();
  
    });  

      this.componenteHijo.emitEvent.subscribe((res: ManejadorPlanAuditoria) => {
        
      this.anadirRequisitos = res.anadirRequisitos;
      this.componenteHijo.anadirRequisitos = !res.anadirRequisitos;
      let grabacion:boolean = res.grabacion;
      let esNuevo:boolean = res.nuevo;

      if(grabacion){

        let registroDetalleAuditoria: RequisitoAuditoriaRegistro = Object.assign({},this.componenteHijo.auditoriaDetalle);
      registroDetalleAuditoria.fechaDia =  this.datePipe.transform(registroDetalleAuditoria.fecha,"dd/MM/yyyy"); 
      registroDetalleAuditoria.fechaHora =  this.datePipe.transform(registroDetalleAuditoria.fecha,"hh:mm:ss"); 
      if(registroDetalleAuditoria.valorTipoEntidad == "1"){
        let gerencia = this.listaGerencias.find(obj => obj.valorGerencia == registroDetalleAuditoria.valorEntidadGerencia);
        registroDetalleAuditoria.area = gerencia.descripcionGerencia;
      }else if(registroDetalleAuditoria.valorTipoEntidad == "2"){
        let equipo = this.listaEquipos.find(obj => obj.valorEquipo == registroDetalleAuditoria.valorEntidadEquipo);
        registroDetalleAuditoria.area = equipo.descripcionEquipo;
      }else if(registroDetalleAuditoria.valorTipoEntidad == "3"){
        let equipo = this.listaCargos.find(obj => obj.valorCargo == registroDetalleAuditoria.valorEntidadCargo);
        registroDetalleAuditoria.area = equipo.descripcionCargo;
      }else if(registroDetalleAuditoria.valorTipoEntidad == "4"){
        let textoComites:string = "";
        let cant:number = registroDetalleAuditoria.listaComite.length;
        let indice:number = 0;
        if(cant==0){
          textoComites = "";
        }else{
          registroDetalleAuditoria.listaComite.forEach(obj => {
            indice++;
            textoComites = textoComites + obj.descripcionComite
            if(cant>indice){
              textoComites = textoComites + " / ";
            }
          });
        }
        registroDetalleAuditoria.area = textoComites;
        
      }

      let textoRequisitos: string = "";
      let cantReq:number = registroDetalleAuditoria.listaRequisitos.length;
      let indReq:number = 0;
      registroDetalleAuditoria.listaRequisitos.forEach(obj => {
        indReq++;
        textoRequisitos = textoRequisitos + obj.nombre;
        if(cantReq>indReq){
          textoRequisitos = textoRequisitos + " ,";
        }
      });

      registroDetalleAuditoria.requisito = textoRequisitos;

      let textoAuditores:string = "";
      let cantAud:number = registroDetalleAuditoria.listaParticipante.length;
      let indiceAud:number = 0;
      registroDetalleAuditoria.listaParticipante.forEach(obj => {
        indiceAud++;
        textoAuditores = textoAuditores + obj.nombreAuditor;
        if(cantAud > indiceAud){
          textoAuditores = textoAuditores + " / ";
        }
      });

      registroDetalleAuditoria.auditor = textoAuditores;
      console.log("Registro detalle auditoria");
      console.log(registroDetalleAuditoria);
      if(esNuevo){
        this.items.push(registroDetalleAuditoria);
      }else{
        this.items[this.filaSeleccionada] = registroDetalleAuditoria;
      }
      
      }
      
      window.scroll(0,0);
      }
    );
  
    
    

    
    
  }

  crearFormulario(){
    this.planAuditoriaForm = this.fb.group({
      tipoAuditoria: new FormControl(""),
      anioPlan: new FormControl(""),
      nroPlan: new FormControl(""),
      nroAuditoria: new FormControl(""),
      fechaDesdePlan: new FormControl(""),
      fechaHastaPlan: new FormControl(""),
      descripcionPlan: new FormControl(""),
      objetivoPlan: new FormControl(""),
      alcancePlan: new FormControl(""),
      auditorLider: new FormControl(""),
      obsLiderGrupo: new FormControl(""),
      criterioResultado: new FormControl(""),
      pagina: new FormControl("")
    })
  }

  fechaDesdeCambia(event:any){

  }

  fechaHastaCambia(event:any){

  }

  getLista(){
    this.planAuditoriaService.buscarRequisitos(this.item.idAuditoria+"").subscribe(
      (response: Response) => {
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
    (error) => this.controlarError(error)
    )
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

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnRegresar(){
    this.router.navigate([`auditoria/plan-auditoria`]);
  }

  irPlanAuditoria(){
    this.router.navigate([`auditoria/plan-auditoria`]);
  }

  abrirModalConsideraciones(){
    console.log(this.item.listaConsideracionesPlan);
    let listaConsideraciones:ConsideracionPlan[] = [];
    for(let i:number = 0; i<this.item.listaConsideracionesPlan.length; i++){
      listaConsideraciones.push(Object.assign({},this.item.listaConsideracionesPlan[i]));
    }
    let listaConsideracionesAux: ConsideracionPlan[] = [];
    for(let i:number = 0; i<this.listaConsideracionesAuxiliar.length; i++){
      listaConsideracionesAux.push(Object.assign({},this.listaConsideracionesAuxiliar[i]));
    }

      const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
            nuevo:true,
            items: listaConsideraciones,
            listaConsAux: listaConsideracionesAux
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalConsideracionesPlanComponent, config);
    (<ModalConsideracionesPlanComponent>this.bsModalRef.content).onClose.subscribe(result => {

      /*
      for(let i:number = 0; listaConsideracionesAgregados.length>i ; i++){
        this.item.listaConsideracionesPlan.push(listaConsideracionesAgregados[i]);
      }*/

      this.item.listaConsideracionesPlan = result.listaConsideracion;
      this.listaConsideracionesAuxiliar = result.listaConsideracionAuxiliar;

      console.log(result);
  });
  }

  abrirModalCriterios(){
    
    let listaConsideraciones:ConsideracionPlan[] = [];
    for(let i:number = 0; i<this.item.listaConsideracionesPlan.length; i++){
      listaConsideraciones.push(Object.assign({},this.item.listaConsideracionesPlan[i]));
    }
    let listaConsideracionesAux: ConsideracionPlan[] = [];
    for(let i:number = 0; i<this.listaConsideracionesAuxiliar.length; i++){
      listaConsideracionesAux.push(Object.assign({},this.listaConsideracionesAuxiliar[i]));
    }

      const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
            nuevo:true,
            items: listaConsideraciones,
            listaConsAux: listaConsideracionesAux
        },
        class: 'modal-md'
    }
    this.bsModalRef = this.modalService.show(ModalCriteriosComponent, config);
    (<ModalCriteriosComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.item.listaConsideracionesPlan = result.listaConsideracion;
      this.listaConsideracionesAuxiliar = result.listaConsideracionAuxiliar;
  });
  }

  obtenerListaConsideraciones(){
    this.loading = true;
    this.planAuditoriaService.buscarConsideraciones("1").subscribe(
      (response: Response) => {
        this.item.listaConsideracionesPlan = <Array<ConsideracionPlan>>response.resultado;
        this.loading = false; },
    (error) => this.controlarError(error)
    )
  }



  agregarRequisito(){
  this.anadirRequisitos = true;
  this.componenteHijo.anadirRequisitos = true;
  this.componenteHijo.nuevo = true;
  this.componenteHijo.auditoria = this.item;
  this.componenteHijo.metodoIniciarComponente();
  }

  seleccionCriterio(index, obj){
    this.selectedCriterioRow = index;
    this.selectedCriterio = obj;
  }

  agregarCriterio(){
    console.log(this.criterioSeleccionado);
    
    
    if(this.criterioSeleccionado != undefined && this.criterioSeleccionado != null && this.criterioSeleccionado != ""){
      let flag:boolean = false;
      for(let i:number=0; this.item.listaCriterios.length>i; i++){
        if(this.criterioSeleccionado.v_campcons1 == this.item.listaCriterios[i].valorCriterio){
          flag = true;
          break;
        }
      }
      if(!flag){
        let criterio:CriterioResultado = new CriterioResultado();
        criterio.valorCriterio = this.criterioSeleccionado.v_campcons1;
        criterio.descripcionCriterio = this.criterioSeleccionado.v_valcons;
        criterio.estadoRegistro = "1";
        this.item.listaCriterios.push(criterio);

        let criterioAux = this.listaCriteriosAuxiliar.find(obj => obj.valorCriterio == criterio.valorCriterio);
        if(criterioAux != undefined && criterioAux != null){
          criterioAux.estadoRegistro = "1";
        }else{
          this.listaCriteriosAuxiliar.push(criterio);
        }

        
      }

      console.log(this.item.listaCriterios);
      console.log(this.listaCriteriosAuxiliar);
      
      
    }
    
  }

  eliminarCriterio(fila:any){
    
    let indice:number = 0;
    for(let i:number = 0; i<this.listaCriteriosAuxiliar.length; i++){
      if(this.listaCriteriosAuxiliar[i].valorCriterio == this.selectedCriterio.valorCriterio){
        indice = i;
        break;
      }
    }


    this.item.listaCriterios.splice(fila,1);
    this.listaCriteriosAuxiliar[indice].estadoRegistro = "0";
    this.selectedCriterioRow = -1;

    console.log(this.item.listaCriterios);
    console.log(this.listaCriteriosAuxiliar);
  }



  buscarParametros(){
    let buscaCriterios = this.generalService.obtenerParametroPadre(NombreParametro.listaCriterios);
    let buscarTipos = this.generalService.obtenerParametroPadre(NombreParametro.listaTipos);
    let buscarAuditores = this.planAuditoriaService.obtenerAuditores();
    let buscarObservadores = this.planAuditoriaService.obtenerObservadores();
    let buscaEntidades = this.planAuditoriaService.obtenerEntidades();

    forkJoin(buscaCriterios,buscarTipos,buscarAuditores,buscarObservadores,buscaEntidades)
      .subscribe(([buscaCriterios,buscarTipos,buscarAuditores,buscarObservadores,buscaEntidades]:
        [Response,Response,Response,Response,Response])=>{
        
        this.listaSeleccionCriterios = buscaCriterios.resultado;
        this.listaTipos = buscarTipos.resultado;
        this.listaAuditores = buscarAuditores.resultado;
        this.listaObservadores = buscarObservadores.resultado;
        this.listaComites = buscaEntidades.resultado.listaComites;
      this.listaGerencias = buscaEntidades.resultado.listaGerencias;
      this.listaEquipos = buscaEntidades.resultado.listaEquipos;
      this.listaCargos = buscaEntidades.resultado.listaCargos;
      },
      (error) => this.controlarError(error));
  }

  modificarRequisito(indice:number,item:RequisitoAuditoriaRegistro){
    this.filaSeleccionada = indice;
    /*
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:false,
          editar:true
      },
      class: 'modal-lg-custom'
    }

    this.bsModalRef = this.modalService.show(ModalRegistroRequisitosComponent, config);
    (<ModalRegistroRequisitosComponent>this.bsModalRef.content).onCloseRequisito.subscribe(result => {
      let requisitoAuditoriaAux:RequisitoAuditoria = result;

      
  });*/

  this.anadirRequisitos = true;
  this.componenteHijo.anadirRequisitos = true;
  this.componenteHijo.nuevo = false;
  this.componenteHijo.editar = true;
  this.componenteHijo.auditoria = this.item;
  this.componenteHijo.auditoriaDetalle = Object.assign({},item);
  this.componenteHijo.metodoIniciarComponente();
  }  


  obtenerDatosCodigo(codigo:string){
    this.loading = true;
    
    this.planAuditoriaServiceBD.buscarDatosAuditoriaCodigo(codigo).subscribe(
      (response: Response) => {
        
        this.item = response.resultado;
        
        console.log(this.item);

        if(this.item.cicloAuditoria != "2"){
          this.validaEstadoPlanAuditoria = false;
        }else{
          this.validaEstadoPlanAuditoria = true;
        }

        if(response.resultado.fechaInicio != undefined && response.resultado.fechaInicio != null){
          this.item.fechaInicio = new Date(response.resultado.fechaInicio);
        }
        if(response.resultado.fechaFin != undefined && response.resultado.fechaFin != null){
          this.item.fechaFin = new Date(response.resultado.fechaFin);
        }

        this.tipoAuditoria = this.item.tipoAuditoria;

        if(this.item.tipoAuditoria == "1"){
          if(response.resultado.programa != undefined && response.resultado.programa != null){
            if(response.resultado.programa.fechaPrograma != undefined && 
              response.resultado.programa.fechaPrograma != null){
                this.item.programa.fechaPrograma = new Date(response.resultado.programa.fechaPrograma);
                let fechaProg:Date = this.item.programa.fechaPrograma;
                this.anioPrograma = fechaProg.getFullYear()+"";
              }
          }
        }

        if(this.item.idColaborador != undefined && this.item.idColaborador != null){
          this.nombreAuditorLider = this.item.auditorLider;
        }

        if(this.item.idObservador != undefined && this.item.idObservador != null){
          this.nombreObsLiderGrupo = this.item.observadorLiderGrupo;
        }

        
        if(response.resultado.listaCriterios == undefined || response.resultado.listaCriterios == null){
          this.item.listaCriterios = [];
          this.listaCriteriosAuxiliar = [];
        }else{
          this.listaCriteriosAuxiliar = [];
          for(let j:number=0; response.resultado.listaCriterios.length>j ; j++){
            this.listaCriteriosAuxiliar.push(Object.assign({},response.resultado.listaCriterios[j]));
          }
        }
        if(response.resultado.listaConsideracionesPlan == undefined || response.resultado.listaConsideracionesPlan == null){
          this.item.listaConsideracionesPlan = [];
          this.listaConsideracionesAuxiliar = [];
        }else{
          this.listaConsideracionesAuxiliar = [];
          for(let j:number=0; response.resultado.listaConsideracionesPlan.length>j ; j++){
            this.listaConsideracionesAuxiliar.push(Object.assign({},response.resultado.listaConsideracionesPlan[j]));
          }
        }

        if(response.resultado.listaDetalle == undefined && response.resultado.listaDetalle == null){
          this.item.listaDetalle = [];
        }else{
          console.log(this.item.listaDetalle);
          for(let k:number=0; this.item.listaDetalle.length > k; k++){
            this.item.listaDetalle[k].fecha = new Date(this.item.listaDetalle[k].fecha);
            //let registroDetalleAuditoria: RequisitoAuditoriaRegistro = Object.assign({},this.componenteHijo.auditoriaDetalle);
            this.item.listaDetalle[k].fechaDia =  this.datePipe.transform(this.item.listaDetalle[k].fecha,"dd/MM/yyyy"); 
            this.item.listaDetalle[k].fechaHora =  this.datePipe.transform(this.item.listaDetalle[k].fecha,"hh:mm:ss"); 
            if(this.item.listaDetalle[k].valorTipoEntidad == "1"){
              let gerencia = this.listaGerencias.find(obj => obj.valorGerencia == this.item.listaDetalle[k].valorEntidadGerencia);
              this.item.listaDetalle[k].area = gerencia.descripcionGerencia;
              this.item.listaDetalle[k].valorEntidadEquipo = "";
              this.item.listaDetalle[k].valorEntidadCargo = "";
              this.item.listaDetalle[k].valorEntidadComite = "";
            }else if(this.item.listaDetalle[k].valorTipoEntidad == "2"){
              let equipo = this.listaEquipos.find(obj => obj.valorEquipo == this.item.listaDetalle[k].valorEntidadEquipo);
              this.item.listaDetalle[k].area = equipo.descripcionEquipo;
              this.item.listaDetalle[k].valorEntidadGerencia = "";
              this.item.listaDetalle[k].valorEntidadCargo = "";
              this.item.listaDetalle[k].valorEntidadComite = "";
            }else if(this.item.listaDetalle[k].valorTipoEntidad == "3"){
              let equipo = this.listaCargos.find(obj => obj.valorCargo == this.item.listaDetalle[k].valorEntidadCargo);
              this.item.listaDetalle[k].area = equipo.descripcionCargo;
              this.item.listaDetalle[k].valorEntidadGerencia = "";
              this.item.listaDetalle[k].valorEntidadEquipo = "";
              this.item.listaDetalle[k].valorEntidadComite = "";
            }else if(this.item.listaDetalle[k].valorTipoEntidad == "4"){
              let textoComites:string = "";
              let cant:number = this.item.listaDetalle[k].listaComite.length;
              let indice:number = 0;
              if(cant==0){
                textoComites = "";
              }else{
                this.item.listaDetalle[k].listaComite.forEach(obj => {
                  indice++;
                  textoComites = textoComites + obj.descripcionComite
                  if(cant>indice){
                    textoComites = textoComites + " / ";
                  }
                });
              }
              this.item.listaDetalle[k].area = textoComites;
              this.item.listaDetalle[k].valorEntidadGerencia = "";
              this.item.listaDetalle[k].valorEntidadEquipo = "";
              this.item.listaDetalle[k].valorEntidadCargo = "";
              this.item.listaDetalle[k].valorEntidadComite = "";
              console.log(this.item.listaDetalle[k]);
            }


            if(this.item.listaDetalle[k].valorTipoEntidad != "4"){
              if(this.item.listaDetalle[k].listaComite == undefined || this.item.listaDetalle[k].listaComite == null){
                this.item.listaDetalle[k].listaComite = [];
              }
            }
            
            if(this.item.listaDetalle[k].listaRequisitos != undefined && this.item.listaDetalle[k].listaRequisitos != null){
              let textoRequisitos: string = "";
              let cantReq:number = this.item.listaDetalle[k].listaRequisitos.length;
              let indReq:number = 0;
              this.item.listaDetalle[k].listaRequisitos.forEach(obj => {
                indReq++;
                textoRequisitos = textoRequisitos + obj.nombre;
                if(cantReq>indReq){
                  textoRequisitos = textoRequisitos + " ,";
                }
              });
        
              this.item.listaDetalle[k].requisito = textoRequisitos;
            }else{
              this.item.listaDetalle[k].listaRequisitos = [];
              this.item.listaDetalle[k].requisito = "";
            }

            
            
            if(this.item.listaDetalle[k].listaParticipante != undefined && this.item.listaDetalle[k].listaParticipante != null){
              let textoAuditores:string = "";
              let cantAud:number = this.item.listaDetalle[k].listaParticipante.length;
              let indiceAud:number = 0;
              this.item.listaDetalle[k].listaParticipante.forEach(obj => {
                indiceAud++;
                textoAuditores = textoAuditores + obj.nombreAuditor;
                if(cantAud > indiceAud){
                  textoAuditores = textoAuditores + " / ";
                }
              });
        
              this.item.listaDetalle[k].auditor = textoAuditores;
            }else{
              this.item.listaDetalle[k].listaParticipante = [];
              this.item.listaDetalle[k].auditor = "";
            }

            



          }

          for(let n:number=0; this.item.listaDetalle.length>n ; n++){
            this.items.push(Object.assign({},this.item.listaDetalle[n]));
          }

        }


        console.log(this.item);
        this.loading = false; },
    (error) => this.controlarError(error)
    )
  }

  guardar(){
    let guardarAuditoria:Auditoria = Object.assign({},this.item) ;
    guardarAuditoria.listaConsideracionesPlan = this.listaConsideracionesAuxiliar;
    guardarAuditoria.listaCriterios = this.listaCriteriosAuxiliar;
    guardarAuditoria.listaDetalle = this.items;
    if(this.nuevo){
      this.loading = true;
      this.planAuditoriaServiceBD.guardar(guardarAuditoria).subscribe((response:Response) => {
        this.loading = false;
        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`auditoria/plan-auditoria`]);
        
      },
      (error) => this.controlarError(error))
    }else{
      this.planAuditoriaServiceBD.actualizar(guardarAuditoria).subscribe((response:Response) => {
        this.loading = false;
        this.toastr.success('Registro actualizado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`auditoria/plan-auditoria`]);
      },
      (error) => this.controlarError(error))
    }

    
  }

  onEliminar(indice:number,item:any){
    this.items.splice(indice,1);
      this.toastr.info('Registro eliminado', 'Acción completada!', {closeButton: true});
  }

  procesar(){
    let guardarAuditoria:Auditoria = Object.assign({},this.item) ;
    guardarAuditoria.listaConsideracionesPlan = this.listaConsideracionesAuxiliar;
    guardarAuditoria.listaCriterios = this.listaCriteriosAuxiliar;
    guardarAuditoria.listaDetalle = this.items;

    this.loading = true;
    this.planAuditoriaServiceBD.procesar(guardarAuditoria).subscribe((response:Response) => {
      this.loading = false;
      this.toastr.success('Auditoría procesada, Se generó la Lista de Verficación', 'Acción completada!', {closeButton: true});
      this.router.navigate([`auditoria/plan-auditoria`]);
    })
  }

  irRegistroPlanAuditoria(){
    this.anadirRequisitos = false;
    window.scroll(0,0);
  }


  buscarAuditorLider(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:true,
          indicadorBusqueda:"2"
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalBusquedaAuditorComponent, config);
    (<ModalBusquedaAuditorComponent>this.bsModalRef.content).onClose.subscribe(result => {
      
      let auditor:RegistroAuditor = result;
      this.nombreAuditorLider = auditor.nombreAuditor;
      this.item.idColaborador = auditor.codigo+"";
  
    });
  }

  agregarObservacion(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:true,
          indicadorBusqueda:"2"
      },
      class: 'modal-md'
    }

    this.bsModalRef = this.modalService.show(ModalObservacionPlanComponent, config);
    (<ModalObservacionPlanComponent>this.bsModalRef.content).onClose.subscribe(result => {

    
    });
  }


  buscarObsLiderGrupo(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:true,
          indicadorBusqueda:"3"
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalBusquedaAuditorComponent, config);
    (<ModalBusquedaAuditorComponent>this.bsModalRef.content).onClose.subscribe(result => {
      
      let auditor:RegistroAuditor = result;
      this.nombreObsLiderGrupo = auditor.nombreAuditor;
      this.item.idObservador = auditor.codigo+"";
  
    });
  }

  OnHabilitarAL() {
    this.mostrarA = true;
    this.mostrarB = false;
    this.mostrarC = false;
    this.mostrarD = true;
    this.mostrarE = true;
    this.mostrarBotonA = false;
    this.mostrarBotonB = true;
    
  }

  OnHabilitarCO() {
    this.mostrarA = false;
    this.mostrarB = true;
    this.mostrarC = false;
    this.mostrarD = false;
    this.mostrarE = true;
    this.mostrarBotonA = true;
    this.mostrarBotonB = false;
  }

  OnHabilitarRAD() {
    this.mostrarA = false;
    this.mostrarB = false;
    this.mostrarC = true;
    this.mostrarD = false;
    this.mostrarE = true;
    this.mostrarBotonA = false;
    this.mostrarBotonB = false;
  }

  habilitarDigital(): void {
    
    if(this.checkConfirmar==true) {
        this.checkConfirmar=false;
    } else {
        this.checkConfirmar=true;
     
    }
}


}

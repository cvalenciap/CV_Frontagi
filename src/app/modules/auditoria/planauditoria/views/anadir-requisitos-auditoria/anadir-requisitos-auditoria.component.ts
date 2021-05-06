import { Component, OnInit, ViewChild, Output, EventEmitter, ComponentFactoryResolver, ViewContainerRef, ComponentFactory, Input, AfterViewInit, ViewChildren, QueryList } from '@angular/core';
import { BsModalService, BsLocaleService, defineLocale, esLocale, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PlanAuditoriaMockService, PlanAuditoriaService } from 'src/app/services';
import { FormBuilder, FormGroup, FormControl } from '@angular/forms';
import { Paginacion } from 'src/app/models';
import { TreeComponent, TreeModel, TreeNode, ITreeOptions, TREE_ACTIONS, KEYS } from 'angular-tree-component';
import { Subject, forkJoin } from 'rxjs';
import { RequisitoAuditoria } from 'src/app/models/requisitoauditoria';
import { RequisitoAuditoriaRegistro } from 'src/app/models/requisitoauditoriaregistro';
import { Auditor } from 'src/app/models/auditor';
import { Response } from './../../../../../models/response';
import { ModalConfirmacionComponent } from 'src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component';
import { ModalBusquedaAuditorComponent } from '../../modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { Auditoria } from 'src/app/models/auditoria';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { Comite } from 'src/app/models/comite';
import { ManejadorPlanAuditoria } from 'src/app/models/manejadorPlanAuditoria';
import { AuditorAuditoria } from 'src/app/models/auditorauditoria';
import { TimepickerConfig } from 'ngx-bootstrap/timepicker';

@Component({
  selector: 'app-anadir-requisitos-auditoria',
  templateUrl: './anadir-requisitos-auditoria.component.html',
  styleUrls: ['./anadir-requisitos-auditoria.component.scss']
})
export class AnadirRequisitosAuditoriaComponent implements OnInit {
  @ViewChild('tree') treeComponent: TreeComponent;
  @ViewChild('treeDestino') treeDestinoComponent: TreeComponent;
  @Output() emitEvent:EventEmitter<ManejadorPlanAuditoria> = new EventEmitter<ManejadorPlanAuditoria>();

  isMeridian = false;
  showSpinners = false;
  myTime: Date = new Date();
  anadirRequisitos:boolean;
  registroRequisitosForm:FormGroup;
  entidadForm:FormGroup;
  treeModel:TreeModel;
  treeModelDestino:TreeModel;
  arbolAuxiliar:TreeModel;
  nuevo:boolean;
  editar:boolean;
  auditoriaDetalle:RequisitoAuditoriaRegistro;
  auditoria:Auditoria;
  paginacion:Paginacion;
  loading:boolean;
  loadingRequisitos:boolean;
  participantes:Auditor[];
  selectedRow:number;
  selectedObject:Auditor;
  comites:any[];
  selectedRowComite:number;
  selectedComite:any;
  valorComite:any;
  listaComites:Comite[];
  listaGerencias:any[];
  listaEquipos:any[];
  listaCargos:any[];
  comiteSeleccionado:any;
  nodeAux:any;
  listaDestino:any[];
  listaDestinoTreeNode:any[];
  nodosSeleccionadosIds:any[];
  nodosSeleccionados:any[];
  nodosSeleccionadosTemporal:any[];
  nodosSeleccionadosDestino:any[];
  listaArbolPlano:TreeNode[];
  listaRequisitos:any[] = [];
  nodosTemporales:any[] = [];
  listaRequisitosObtenidos:any[] = [];
  desactivaListaComite:boolean;
  listaNodosRequisitoDestino:any[];
  listaNodosNorma:TreeNode[];
  nodoNormaPadre:any;
  listaParticipantesInicialAux:AuditorAuditoria[];


  nodesD = [
    {id: 1, nombre: 'ISO 9001-2015', 
    children: [ 
                { id: 2, nombre: '4.1 Comprension de la Organización y su Contexto ' },
                { id: 3, nombre: '4.2 Comprensión de las necesidades y expectativas de las partes interesadas'},
                { id: 4, nombre: '4.4 Sistema de Gestion de la Calidad y sus Procesos'},
                { id: 5, nombre:'5.2.1 Establecimiento de la Politica de la Calidad' }
              ]
    },
    {id: 6, nombre: 'ISO 14001-2015', 
    children: [ 
                { id: 7, nombre: '4.1 Comprension de la Organización y su Contexto ' },
                { id: 8, nombre: '4.4 Sistema de Gestión Ambiental'}
              ]
    }
  ];

  nodes = [
    {
      id: 1, nombre: 'ISO 9001-2015',
      children: [
        { id: 2, nombre: '4.1 Comprension de la Organización y su Contexto ' },
        { id: 3, nombre: '4.2 Comprensión de las necesidades y expectativas de las partes interesadas' },
        { id: 4, nombre: '4.3 Determinacion del Alcance del Sistema de Gestion de Calidad' },
        { id: 5, nombre: '4.4 Sistema de Gestion de la Calidad y sus Procesos' },
        { id: 6, nombre: '5.1.1 Generalidades' },
        { id: 7, nombre: '5.1.2 Enfoque al Cliente' },
        { id: 8, nombre: '5.2.1 Establecimiento de la Politica de la Calidad' },
        { id: 9, nombre: '5.2.2 Comunicación de la Politica de Calidad' }
      ]
    },
    {
      id: 10, nombre: 'ISO 14001-2015',
      children: [
        { id: 11, nombre: '4.1 Comprension de la Organización y su Contexto'},
        { id: 12, nombre: '4.2 Comprensión de las necesidades y expectativas de las partes interesadas'},
        { id: 13, nombre: '4.3 Determinacion del Alcance del Sistema de Gestion de Calidad' },
        { id: 14, nombre: '4.4 Sistema de Gestión Ambiental' },
        { id: 15, nombre: '5.1 Liderazgo y Compromiso'},
        { id: 16, nombre: '5.2 Política Ambiental'},
        { id: 17, nombre: '5.3 Roles, Responsabilidades y Autoridades en la Organización' }
      ]
    }
  ];

  treeOptions: ITreeOptions = {
    displayField: 'nombre',
    isExpandedField: 'expanded',
    idField: 'uuid',
    hasChildrenField: 'nodes',
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);

        },
        click: (tree, node, $event) => {
          
          if ($event.ctrlKey) {
            TREE_ACTIONS.TOGGLE_ACTIVE_MULTI(tree, node, $event)
            this.nodeAux = node;
          } else {
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
            this.nodeAux = node;
            this.treeModel = tree;
          }
        }
      },
      keys: {
        [KEYS.ENTER]: (tree, node, $event) => {
          node.expandAll();

        }
      }
    },
    nodeHeight: 23,
    allowDrag: (node) => {
      return true;
    },
    allowDrop: (node) => {
      return true;
    },

    levelPadding: 10,
    //useVirtualScroll: true,
    animateExpand: true,
    //scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    //scrollContainer: document.documentElement // HTML

  }


   treeOptionsDestino: ITreeOptions = {
    
    displayField: 'nombre',
     isExpandedField: 'expanded',
     idField: 'uuid',
     hasChildrenField: 'nodes',
     useCheckbox: true, 
     actionMapping: {
       mouse: {
         dblClick: (tree, node, $event) => {
           if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
         },
         click: (tree,node, $event) => {
          if($event.ctrlKey){
            if(node.parent.parent != null){
              TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event)
               // this.nodeAux = node;
               this.treeModelDestino = tree;
            }
            
            //this.nodosSeleccionados = tree.activeNodes;
          }else{
            if(node.parent.parent != null){
              TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
            console.log(tree);
          console.log(node);
          console.log(node.parent.data);
          console.log(node.data);
         // this.nodeAux = node;
          console.log(tree.activeNodes);
            }
            
         // this.nodosSeleccionados = tree.activeNodes;
          }
         }
       },
       keys: {
         [KEYS.ENTER]: (tree, node, $event) => {
           node.expandAll();
           
         }
       }
     },
     nodeHeight: 23,
     levelPadding: 10,
     //useVirtualScroll: true,
     animateExpand: true,
     //scrollOnActivate: true,
     animateSpeed: 30,
     animateAcceleration: 1.2,
     //scrollContainer: document.documentElement // HTML
     
   }

   bsModalRef:BsModalRef;

   listaVerificacionForm:FormGroup;


  constructor(private modalService: BsModalService,
    private toastr: ToastrService,
    private planAuditoriaService: PlanAuditoriaMockService,
    private localeService: BsLocaleService,
    private formBuilder: FormBuilder,
    private service: PlanAuditoriaService,
    private resolver:ComponentFactoryResolver) {
      defineLocale('es', esLocale);
      this.localeService.use('es'); 
      this.anadirRequisitos = false;
      this.loadingRequisitos = false;
      this.loading = false;
      
     }

  ngOnInit() {
    
    this.crearForm();
    this.llenarArbol();
    this.valorComite = "";
    this.auditoriaDetalle = new RequisitoAuditoriaRegistro();
    this.auditoria = new Auditoria();
    this.auditoriaDetalle.listaComite = [];
    this.listaNodosNorma = [];
  }

  llenarArbol(){

    this.listaRequisitos = this.nodes;
    this.listaNodosRequisitoDestino = this.nodesD;
    this.treeModel.update();
    this.treeModelDestino.update();    
    /*this.loadingRequisitos = true;  
    
    console.log(this.auditoria.idAuditoria);
    this.service.buscarRequisitosAuditoria(this.auditoria.idAuditoria+"").subscribe(
      (response: Response) => {
        
        this.listaRequisitos = response.resultado;
        this.treeModel.update();


          for(let i:number=0;i<this.listaRequisitos.length;i++){
          this.listaNodosRequisitoDestino.push({id:this.listaRequisitos[i].id,nombre:this.listaRequisitos[i].nombre, children:[]})
        } 


        this.treeModelDestino.update();

        
        this.loadingRequisitos = false; 
        //const source = interval(1000);
        //const subscribe = source.subscribe(val => this.treeModel.expandAll());
       },
    (error) => this.controlarError(error)
    ) */
  }

/*   ngAfterViewInit() {
    this.treeModel.expandAll()
  } */

  metodoIniciarComponente(){

    this.crearForm();
    this.treeModel = this.treeComponent.treeModel;
    this.treeModelDestino = this.treeDestinoComponent.treeModel;
    this.llenarArbol();
    
    /* console.log("Nuevo: ");
    console.log(this.nuevo);
    console.log("Editar: ")
    console.log(this.editar);

    console.log("Auditoria")
    console.log(this.auditoria);

    console.log("Auditoria Detalle");
    console.log(this.auditoriaDetalle);


    window.scroll(0,0);
    this.selectedRow = -1;
      this.selectedRowComite = -1;
      this.listaRequisitos = [];
      this.listaDestino = [];
      this.listaNodosRequisitoDestino = [];
      this.listaParticipantesInicialAux = [];

      if(this.nuevo){
        this.auditoriaDetalle = new RequisitoAuditoriaRegistro();
        this.auditoriaDetalle.listaComite = [];
        this.auditoriaDetalle.listaParticipante = [];
        
        this.auditoriaDetalle.listaRequisitos = [];
        this.comites = [];
        this.paginacion = new Paginacion({registros: 10});
        
      }else{
        this.listaRequisitosObtenidos = this.auditoriaDetalle.listaRequisitos;
      }

      

    
    this.desactivaListaComite = true;
    this.comiteSeleccionado = "";
    
    
    this.nodosSeleccionados = [];
    this.listaDestinoTreeNode = [];
    this.nodosSeleccionadosIds = [];
    this.nodosSeleccionadosDestino = [];
    this.listaArbolPlano = [];
    //this.getListaAuditores();
    this.obtenerParametros();

    this.treeModel = this.treeComponent.treeModel;
    this.treeModelDestino = this.treeDestinoComponent.treeModel; */
    
  }

  crearForm() {
    
    this.registroRequisitosForm = this.formBuilder.group({
        'descripcionAuditoria': new FormControl({ value: ''}),
        'fechaRequisito': new FormControl({ value: ''}),
        'normaRequisito': new FormControl({ value: ''}),
        'alcanceRequisito': new FormControl({ value: '' }),
        'valorGerencia': new FormControl({ value: '' }),
        'valorEquipo':new FormControl({ value: '' }),
        'valorCargo':new FormControl({ value: '' }),
        'valorComite':new FormControl({ value: '' }),
        'listaRequisito':new FormControl({ value: '' }),
        'listaDestino':new FormControl({ value: '' })        
    });

  }

  

  cancelar(){
    this.anadirRequisitos = false;
    let manejador:ManejadorPlanAuditoria = new ManejadorPlanAuditoria();
    manejador.anadirRequisitos = this.anadirRequisitos;
    manejador.grabacion = false;
    this.emitEvent.emit(manejador);
  }

  obtenerClick(event) {
    this.auditoriaDetalle.valorTipoEntidad = event.target.value;
    if(this.auditoriaDetalle.valorTipoEntidad == "4"){
      this.desactivaListaComite = false;
    }else{
      this.desactivaListaComite = true;
    }
  }

  getListaAuditores(){
    this.loading = true;
    this.planAuditoriaService.buscarAuditores().subscribe(
      (response: Response) => {
        this.participantes = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.loading = false; },
    (error) => this.controlarError(error)
    )
  }

  controlarError(error) {
    
    console.error(error);
    this.loading = false;
    if(this.loadingRequisitos){
      this.loadingRequisitos = false;
    }
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  seleccionComite(index,obj): void{
    this.selectedRowComite = index;
    this.selectedComite = obj;
  }

  eliminarParticipante(indice:number){
    this.auditoriaDetalle.listaParticipante.splice(indice,1);
  }


  buscarAuditor(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          nuevo:true,
          indicadorBusqueda:"1"
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalBusquedaAuditorComponent, config);
    (<ModalBusquedaAuditorComponent>this.bsModalRef.content).onClose.subscribe(result => {
      
      let auditor:RegistroAuditor = result;

      if(!this.validarParticipantes(this.auditoriaDetalle.listaParticipante,auditor)){
        let auditorAuditoria:AuditorAuditoria = new AuditorAuditoria();
          auditorAuditoria.idAuditor = auditor.codigo+"";
          auditorAuditoria.cargoAuditor = auditor.nomRol;
          auditorAuditoria.nombreAuditor = auditor.nombreAuditor;
          auditorAuditoria.responsable = "0";
          auditorAuditoria.idRolAuditor = auditor.codigoRolAuditor;
          this.auditoriaDetalle.listaParticipante.push(auditorAuditoria);
        /*
        let encontro:boolean = false;
        let auditorEncontrado:AuditorAuditoria;
        for(let j:number=0; j<this.listaParticipantesInicialAux.length;j++){
          if(this.listaParticipantesInicialAux[j].idAuditor == auditor.codigo+""){
            auditorEncontrado = this.listaParticipantesInicialAux[j];
            encontro = true;
          }
        }
        if(encontro){
          auditorEncontrado.responsable = "0";
          this.auditoriaDetalle.listaParticipante.push(auditorEncontrado);

        }else{
          let auditorAuditoria:AuditorAuditoria = new AuditorAuditoria();
          auditorAuditoria.idAuditor = auditor.codigo+"";
          auditorAuditoria.cargoAuditor = auditor.nomRol;
          auditorAuditoria.nombreAuditor = auditor.nombreAuditor;
          auditorAuditoria.responsable = "0";
          this.auditoriaDetalle.listaParticipante.push(auditorAuditoria);
        }*/
        
      }
      
      console.log(this.auditoriaDetalle.listaParticipante);

      
  });
  }

  validarParticipantes(lista:AuditorAuditoria[], variable:RegistroAuditor):boolean{
    let valor = lista.find(obj => +obj.idAuditor == variable.codigo);
    if(valor == undefined || valor == null){
      return false;
    }else{
      return true;
    }
  }

  obtenerParametros(){
    let buscaEntidades = this.planAuditoriaService.obtenerEntidades();

    forkJoin(buscaEntidades)
      .subscribe(([buscaEntidades]:[Response])=>{
        this.listaComites = buscaEntidades.resultado.listaComites;
        this.listaGerencias = buscaEntidades.resultado.listaGerencias;
        this.listaEquipos = buscaEntidades.resultado.listaEquipos;
        this.listaCargos = buscaEntidades.resultado.listaCargos;
      },
      (error) => this.controlarError(error));

  }

  agregarComite(){
    console.log(this.valorComite);
    console.log(this.auditoriaDetalle.listaComite)
    if(this.valorComite != undefined && this.valorComite != null){
      if(!this.validarComite(this.auditoriaDetalle.listaComite,this.valorComite)){
        this.auditoriaDetalle.listaComite.push(this.valorComite);
      }
      
    }
    
  }

  validarComite(listaComite:Comite[],valor:Comite):boolean{
    let variable = listaComite.find(obj => obj.valorComite == valor.valorComite);
    if(variable == undefined || variable == null){
      return false;
    }else{
      return true;
    }
  }

  eliminarComite(){
    const modal = this.modalService.show(ModalConfirmacionComponent, { ignoreBackdropClick: true, keyboard: false, class:"modal-center" });
              (<ModalConfirmacionComponent>modal.content).showConfirmationModal(
                  'Confirmación',
                  '¿Está seguro que desea eliminar el registro?'
              );

              (<ModalConfirmacionComponent>modal.content).onClose.subscribe(result => {
                  if (result) {
                      this.auditoriaDetalle.listaComite.splice(this.selectedRowComite,1);
                  }
              });
  }


  darCheck(item:AuditorAuditoria){
    if(item.responsable == "0"){
      console.log("1");
      item.responsable = "1";
    }else if(item.responsable == "1"){
      console.log("0");
      item.responsable = "0";
    }
    
  }

  seleccionarRequisitos(){
    
    this.nodosSeleccionadosTemporal = [];
    this.nodosSeleccionados = this.treeModel.activeNodes;

    if(this.nodosSeleccionados.length > 0){

      for(let i:number = 0; this.nodosSeleccionados.length > i; i++){
        let encontro:boolean = false;
        for(let h:number=0; this.listaNodosNorma.length>h;h++){
         if(this.nodosSeleccionados[i].isDescendantOf(this.listaNodosNorma[h])){
           let nodoNormaPadreAux:TreeNode = this.listaNodosNorma[h];
           this.nodoNormaPadre = this.listaNodosRequisitoDestino.find(obj => obj.id == nodoNormaPadreAux.data.id); 
           encontro = true;
           break;
         }
         
        }

        if(encontro){
          console.log("Llego aqui");
          if(!this.nodosSeleccionados[i].hasChildren){
          

            let flag:boolean = false;
            for(let k:number=0; this.listaDestino.length>k; k++){
              if(this.listaDestino[k].uuid == this.nodosSeleccionados[i].id){
                flag = true;
                break;
              }
            }
            if(!flag){
              this.nodosSeleccionadosTemporal.push(this.nodosSeleccionados[i]);
              this.listaDestinoTreeNode.push(this.nodosSeleccionados[i]);
              this.listaDestino.push(this.nodosSeleccionados[i].data);
              this.nodosSeleccionadosIds.push(this.nodosSeleccionados[i].id);
              this.nodoNormaPadre.children.push(this.nodosSeleccionados[i].data);
              console.log(this.nodosSeleccionados[i].id);
            }
  
            
          }else{
            let nodosHijos:any[] = this.nodosSeleccionados[i].data.children;
            this.seleccionarNodosHijos(nodosHijos);
          }
        }

        
        
      }

      for(let j:number = 0; this.nodosSeleccionadosTemporal.length > j; j++){
        this.nodosSeleccionadosTemporal[j].hide();
      }

      this.treeModelDestino.update();
      


    }
    
  }

  seleccionarNodosHijos(nodosHijos:any[]){
    let listaNodosTreeHijos:TreeNode[] = [];
          for(let j:number=0; nodosHijos.length>j; j++){
            let nodoHijo = nodosHijos[j];
            let nodoTreeHijo:TreeNode = this.treeModel.getNodeById(nodoHijo.uuid);
            console.log("Nodo Hijo");
            console.log(nodoTreeHijo);
            console.log(nodoTreeHijo.isHidden);
            if(!nodoTreeHijo.isHidden){
              if(nodoTreeHijo.hasChildren){
                let nodosHijosHijos:any[] = nodoTreeHijo.data.children;
                this.seleccionarNodosHijos(nodosHijosHijos);
              }else{
                let flag:boolean = false;
                for(let k:number=0; this.listaDestino.length>k; k++){
                  if(this.listaDestino[k].uuid == nodoTreeHijo.id){
                    flag = true;
                    break;
                  }
                }

                if(!flag){
                  this.nodosSeleccionadosTemporal.push(nodoTreeHijo);
                  this.listaDestinoTreeNode.push(nodoTreeHijo);
                  this.listaDestino.push(nodoTreeHijo.data);
                  this.nodosSeleccionadosIds.push(nodoTreeHijo.id);
                  this.nodoNormaPadre.children.push(nodoTreeHijo.data);
                }

                
              }
            }
          }
  }

  quitarRequisitos(){
    console.log(this.treeModelDestino.activeNodes);
    this.nodosSeleccionadosDestino = this.treeModelDestino.activeNodes;
    if(this.nodosSeleccionadosDestino.length > 0){
      console.log("QuitarRequisitos");
      console.log(this.treeModelDestino);
      console.log(this.nodosSeleccionadosDestino);
      for(let i:number = 0; this.nodosSeleccionadosDestino.length > i; i++){

        let nodoSeleccionadoQuitar:TreeNode = this.nodosSeleccionadosDestino[i];
        let idPadre = nodoSeleccionadoQuitar.parent.data.id;
        let objDestino = this.listaDestino.find(obj => obj.id==nodoSeleccionadoQuitar.data.id);
        //let nodoArbol:TreeNode = this.listaArbolPlano.find(obj => obj.data.id == this.nodosSeleccionadosDestino[i].data.id);
        let nodoArbol:TreeNode = this.treeModel.getNodeById(objDestino.uuid);
        nodoArbol.show();

       let nodoNormaDestino:any =  this.listaNodosRequisitoDestino.find(obj => obj.id == idPadre);
       let indice:number=0;
       let encontro:boolean=false;
       for(let j:number=0; j<nodoNormaDestino.children.length;j++){
         if(nodoNormaDestino.children[j].id == this.nodosSeleccionadosDestino[i].data.id){
          encontro = true;
          indice = j;
          break;
         }
       }
       if(encontro){
         nodoNormaDestino.children.splice(indice,1);
       }
       let encontroObj:boolean = false;
       let indiceObj:number = 0;
       for(let k:number=0; k<this.listaDestino.length;k++){
         if(objDestino.id == this.listaDestino[k].id){
          encontroObj = true;
          indiceObj = k;
          break;
         }
       }
       if(encontroObj){
         this.listaDestino.splice(indiceObj,1);
       }
       

       
      }

      this.treeModelDestino.update();

    }
    
    /* SOLUCION CON LISTA
    if(this.listaDestino.length>0){
      let nodosQuitados: any[] = this.registroRequisitosForm.controls['listaDestino'].value;
      console.log(nodosQuitados);
      let listaItem: number[] = [];

      for(let h:number=0; nodosQuitados.length>h; h++){
        let nodoArbol:TreeNode = this.treeModel.getNodeById(nodosQuitados[h].uuid)
        nodoArbol.show();
      }

      
      for(let i:number=0; this.listaDestino.length>i; i++){
        let normaAux = this.listaDestino[i];
        for(let j:number=0;nodosQuitados.length>j;j++){
          let nodoQuitadoAux = nodosQuitados[j]
          if(normaAux.id == nodoQuitadoAux.id){
            listaItem.push(i);
            break;
          }
        }
      }
      for(let k:number=listaItem.length-1;0<=k;k--){
        this.listaDestino.splice(listaItem[k],1);
      }




    }
    */
  }


  seleccionarTodos(){
    this.obtenerListaNodosHojas();
    let nodosSeleccionadosUtiles:any[] = [];
    console.log(this.listaArbolPlano);
    if(this.listaArbolPlano.length > 0){
      for(let h:number=0; this.listaNodosNorma.length>h;h++){
        let listaArbolPlanoNorma:TreeNode[] = [];
        let flagObtuvo:boolean = false;
        for(let j:number=0; j<this.listaArbolPlano.length;j++){
          if(this.listaArbolPlano[j].isDescendantOf(this.listaNodosNorma[h])){
            if(!flagObtuvo){
              let nodoNormaPadreAux:TreeNode = this.listaNodosNorma[h];
              this.nodoNormaPadre = this.listaNodosRequisitoDestino.find(obj => obj.id == nodoNormaPadreAux.data.id); 
              flagObtuvo = true;
            }
            listaArbolPlanoNorma.push(this.listaArbolPlano[j]);
            
          }
        }

        console.log("Nodo norma padre");
        console.log(this.nodoNormaPadre);

        for(let i:number = 0; listaArbolPlanoNorma.length > i; i++){
          if(!listaArbolPlanoNorma[i].hasChildren){
            nodosSeleccionadosUtiles.push(listaArbolPlanoNorma[i]);
            this.listaDestinoTreeNode.push(listaArbolPlanoNorma[i]);
            this.listaDestino.push(listaArbolPlanoNorma[i].data);
            this.nodosSeleccionadosIds.push(listaArbolPlanoNorma[i].id);
            this.nodoNormaPadre.children.push(listaArbolPlanoNorma[i].data);
            console.log(this.listaArbolPlano[i].id);
         }
          
        }

        
      }

      for(let n:number = 0; nodosSeleccionadosUtiles.length > n; n++){
        nodosSeleccionadosUtiles[n].hide();
      }


      this.treeModelDestino.update();
      


    }
  }


  quitarTodos(){
    let listaTodosNodosDestino:any = [];
    
    for(let i:number=0; this.listaNodosRequisitoDestino.length>i; i++){
      this.listaNodosRequisitoDestino[i].children = [];
    }

    for(let h:number=0; this.listaDestino.length>h; h++){
      let nodoArbol:TreeNode = this.treeModel.getNodeById(this.listaDestino[h].uuid)
      nodoArbol.show();
    }
    this.listaDestino = [];

    this.treeModelDestino.update();
 
  }

  obtenerListaNodos(){
    this.listaArbolPlano = [];
    let listaNodosArbol:TreeNode[] = this.treeModel.getVisibleRoots();
    for(let i:number = 0; listaNodosArbol.length > i; i++){
      let nodoArbol:TreeNode = listaNodosArbol[i];
      console.log(nodoArbol.parent);
      console.log(nodoArbol.isRoot);
      this.recorrerNodos(nodoArbol);
    }

    console.log(this.listaArbolPlano);
  }

  recorrerNodos(nodo:TreeNode){

      let encontro:boolean = false;
      if(!nodo.isRoot){
        for(let j:number = 0; this.listaDestino.length > j; j++){
          if(nodo.id == this.listaDestino[j].uuid){
            encontro = true;
            break;
          }
        }
        if(!encontro){
          this.listaArbolPlano.push(nodo);
        }
      }
      
      if(nodo.hasChildren){
        for(let k:number = 0; nodo.data.children.length>k; k++){
          let nodoHijo = nodo.data.children[k];
          this.recorrerNodos(this.treeModel.getNodeById(nodoHijo.uuid));
        }
      }
  }

  obtenerListaNodosHojas(){
    this.listaArbolPlano = [];
    let listaNodosArbol:TreeNode[] = this.treeModel.getVisibleRoots();
    for(let i:number = 0; listaNodosArbol.length > i; i++){
      let nodoArbol:TreeNode = listaNodosArbol[i];
      this.recorrerNodosHojas(nodoArbol);
    }

    console.log(this.listaArbolPlano);
  }

  recorrerNodosHojas(nodo:TreeNode){
    let encontro:boolean = false;
      console.log(nodo.hasChildren)
      
      if(nodo.hasChildren){
        for(let k:number = 0; nodo.data.children.length>k; k++){
          let nodoHijo = nodo.data.children[k];
          this.recorrerNodosHojas(this.treeModel.getNodeById(nodoHijo.uuid));
        }
      }else{
        for(let j:number = 0; this.listaDestino.length > j; j++){
          if(nodo.id == this.listaDestino[j].uuid){
            encontro = true;
            break;
          }
        }
        if(!encontro){
          this.listaArbolPlano.push(nodo);
        }
      }
  }

  guardar(){
    this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
    this.anadirRequisitos = false;
    this.auditoriaDetalle.listaRequisitos = [];
    for(let i:number = 0; i<this.listaDestino.length;i++){
      // AGREGAR NORMA
      let nodoArbol:TreeNode = this.treeModel.getNodeById(this.listaDestino[i].uuid);
      let codigoNorma:any;
      let encontro:boolean = false;
      for(let h:number=0; this.listaNodosNorma.length>h;h++){
        if(nodoArbol.isDescendantOf(this.listaNodosNorma[h])){
          let nodoNormaPadreAux:TreeNode = this.listaNodosNorma[h];
          encontro = true;
          codigoNorma = nodoNormaPadreAux.data.id;
          break;
        }
       }
       if(encontro){
         this.listaDestino[i].idNorma = codigoNorma;
       }
     //FIN AGREGAR NORMA
      this.auditoriaDetalle.listaRequisitos.push(Object.assign({},this.listaDestino[i]));
    }

    let manejador:ManejadorPlanAuditoria = new ManejadorPlanAuditoria();
    manejador.anadirRequisitos = this.anadirRequisitos;
    manejador.grabacion = true;
    manejador.nuevo = this.nuevo;
    this.emitEvent.emit(manejador);
    
  }

  cambioArbol(evento:any){
    
    if(this.treeModel){
      this.treeModel.expandAll()
      this.listaNodosNorma = this.treeModel.roots;
    }

/*     if(!this.nuevo){
      this.convertirRequisitosObtenidos();
    } */
   
  }

  cambioArbolDestino(evento:any){
    
    if(this.treeModelDestino){
      this.treeModelDestino.expandAll();
    }
  }

  convertirRequisitosObtenidos(){
    this.obtenerListaNodosHojas();
    let nodosSeleccionadosUtiles:any[] = [];
    let nodosObtenidosArbol:TreeNode[] = [];
    if(this.listaArbolPlano.length > 0){
      for(let i:number = 0; this.listaArbolPlano.length > i; i++){
        for(let j:number=0; this.listaRequisitosObtenidos.length > j; j++){
          if(this.listaArbolPlano[i].data.id == this.listaRequisitosObtenidos[j].id){
            nodosObtenidosArbol.push(this.listaArbolPlano[i]);
          }
        }
        
      }

      for(let k:number = 0; nodosObtenidosArbol.length > k; k++){
        let encontro:boolean = false;
        for(let h:number=0; this.listaNodosNorma.length>h;h++){
         if(nodosObtenidosArbol[k].isDescendantOf(this.listaNodosNorma[h])){
           let nodoNormaPadreAux:TreeNode = this.listaNodosNorma[h];
           this.nodoNormaPadre = this.listaNodosRequisitoDestino.find(obj => obj.id == nodoNormaPadreAux.data.id); 
           encontro = true;
           break;
         }
         
        }
        if(encontro){
          let flag:boolean = false;
          for(let f:number=0; this.listaDestino.length>f; f++){
            if(this.listaDestino[f].uuid == nodosObtenidosArbol[k].id){
              flag = true;
              break;
            }
          }
          if(!flag){
            nodosSeleccionadosUtiles.push(nodosObtenidosArbol[k]);
            this.listaDestinoTreeNode.push(nodosObtenidosArbol[k]);
            this.listaDestino.push(nodosObtenidosArbol[k].data);
            this.nodosSeleccionadosIds.push(nodosObtenidosArbol[k].id);
            this.nodoNormaPadre.children.push(nodosObtenidosArbol[k].data);
            console.log(nodosObtenidosArbol[k].id);
          }
        }
      }

      for(let a:number = 0; nodosSeleccionadosUtiles.length > a; a++){
        nodosSeleccionadosUtiles[a].hide();
      }

      this.treeModelDestino.update();

    }
    /* SOLUCION CON LISTA DESTINO
    this.obtenerListaNodosHojas();
    let nodosSeleccionadosUtiles:any[] = [];
    if(this.listaArbolPlano.length > 0){
      console.log(this.treeModel);

      for(let i:number = 0; this.listaArbolPlano.length > i; i++){
        if(!this.listaArbolPlano[i].hasChildren){
          for(let j:number = 0; this.listaRequisitosObtenidos.length>j;j++){
            if(this.listaRequisitosObtenidos[j].id == this.listaArbolPlano[i].data.id){
              nodosSeleccionadosUtiles.push(this.listaArbolPlano[i]);
              this.listaDestinoTreeNode.push(this.listaArbolPlano[i]);
              this.listaDestino.push(this.listaArbolPlano[i].data);
              this.nodosSeleccionadosIds.push(this.listaArbolPlano[i].id);
              console.log(this.listaArbolPlano[i].id);
            }
          }
          
          
       }
        
      }

      for(let k:number = 0; nodosSeleccionadosUtiles.length > k; k++){
        nodosSeleccionadosUtiles[k].hide();
      }
      


    }
    */
  }




}

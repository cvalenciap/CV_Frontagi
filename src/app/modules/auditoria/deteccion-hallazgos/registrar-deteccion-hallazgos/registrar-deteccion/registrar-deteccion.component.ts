
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RequisitoAuditoria } from 'src/app/models/requisitoauditoria';
import { Subject, forkJoin, interval } from 'rxjs';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { RequisitoAuditoriaRegistro } from 'src/app/models/requisitoauditoriaregistro';
import { Response } from './../../../../../models/response';
import { Auditor } from 'src/app/models/auditor';
import { Paginacion } from 'src/app/models';
import { DeteccionHallazgosMockService as DeteccionHallazgosService, GeneralService, NormaIncidenciaService, DetalleDeteccionHallazgosService } from './../../../../../services/index';
import { PlanAuditoriaMockService as PlanAuditoriaService } from './../../../../../services/index';
import { ModalConfirmacionComponent } from 'src/app/components/common/modal/modal-confirmacion/modal-confirmacion.component';
//import { ModalBusquedaAuditorComponent } from '../../../modal-busqueda-auditor/modal-busqueda-auditor.component';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { ModalBusquedaAuditorComponent } from '../../../planauditoria/modales/modal-busqueda-auditor/modal-busqueda-auditor.component';
import { ModalBusquedaDetectoresComponent } from '../modal-busqueda-detectores/modal-busqueda-detectores.component';
import { Router, ActivatedRoute } from '@angular/router';
import { DeteccionHallazgos } from 'src/app/models/deteccionhallazgos';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { NombreParametro } from 'src/app/constants/general/general.constants';
import { ModalBusquedaColaboradorComponent } from 'src/app/components/common/modal/modal-busqueda-colaborador/modal-busqueda-colaborador.component';
import { Trabajador } from 'src/app/models/trabajador';
import { AreaService } from 'src/app/services/impl/area.service';
import { Area } from 'src/app/models/area';
import { Requisito } from 'src/app/models/requisito';
import { Constante } from 'src/app/models/enums';


@Component({
  selector: 'app-registrar-deteccion',
  templateUrl: './registrar-deteccion.component.html',
  styleUrls: ['./registrar-deteccion.component.scss'],
  providers: [DeteccionHallazgosService]
})
export class RegistrarDeteccionComponent implements OnInit {

  [x: string]: any;

  @ViewChild('tree') treeComponent: TreeComponent;

  registroRequisitosForm: FormGroup;

  treeModel: TreeModel;
  arbolAuxiliar: TreeModel;

  //public onClose: Subject<RequisitoAuditoria>;
  bsConfig: object;
  nuevo: boolean;
  editar: boolean;
  requisito: RequisitoAuditoriaRegistro;


  deteccionHallazgos: DeteccionHallazgos;


  paginacion: Paginacion;
  loading: boolean;
  participantes: RegistroAuditor[];
  selectedRow: number;
  selectedObject: RegistroAuditor;
  comites: any[];
  selectedRowComite: number;
  selectedComite: any;

  items2: DeteccionHallazgos[];

  // item: DeteccionHallazgos;

  itemCodigo: any;

  listaGerencias: Area[];
  listaEquipos: Area[];
  comiteSeleccionado: any;
  nodeAux: any;
  listaDestino: any[];
  listaDestinoTreeNode: any[];
  nodosSeleccionadosIds: any[];

  listaIncidenciasCombo: any[];

  nodosSeleccionados: any[];

  nodosSeleccionadosTemporal: any[];

  listaArbolPlano: TreeNode[];

  parametroBusqueda: string;

  listaTipoNoConformidad: any[];

  listaNormas: any[];

  mostrarComentario: boolean;

  desactivaRequisitos: boolean;

  public bsModalRef: BsModalRef;

  nodes = [
    {
      id: 1,
      nombre: 'root1',
      children: [
        { id: 2, nombre: 'child1' },
        { id: 3, nombre: 'child2' }
      ]
    },
    {
      id: 4,
      nombre: 'root2',
      children: [
        { id: 5, nombre: 'child2.1' },
        {
          id: 6,
          nombre: 'child2.2',
          children: [
            { id: 7, nombre: 'subsub' }
          ]
        }
      ]
    },
    {
      id: 1,
      nombre: 'root3',
      children: [
        { id: 2, nombre: 'child1' },
        { id: 3, nombre: 'child2' }
      ]
    },
    {
      id: 1,
      nombre: 'root4',
      children: [
        { id: 2, nombre: 'child1' },
        { id: 3, nombre: 'child2' }
      ]
    },
    {
      id: 1,
      nombre: 'root5',
      children: [
        { id: 2, nombre: 'child1' },
        { id: 3, nombre: 'child2' }
      ]
    },
  ];

  listaRequisitos: any[] = [];
  nodosTemporales: any[] = [];
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

          if (!node.hasChildren) {

            if (this.listaDestino.length == 0) {
              TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
              console.log(tree);
              console.log(node);
              console.log(node.hasChildren);
              console.log(node.parent.data);
              console.log(node.data);
              this.nodeAux = node;
              console.log(tree.activeNodes);
            }
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

  constructor(
    private modalService: BsModalService,
    private toastr: ToastrService,
    private planAuditoriaService: PlanAuditoriaService,
    private generalService: GeneralService,
    private service: DetalleDeteccionHallazgosService,
    private areaService: AreaService,
    private normaService: NormaIncidenciaService,
    private localeService: BsLocaleService,
    private formBuilder: FormBuilder,
    private router: Router,
    private route: ActivatedRoute) {
    this.selectedRow = -1;
    this.selectedRowComite = -1;
    this.participantes = [];
    this.comites = [];
    this.listaGerencias = [];
    this.listaEquipos = [];
    this.paginacion = new Paginacion({ registros: 10 });
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }


  ngOnInit() {
    this.mostrarComentario = false;

    this.desactivaRequisitos = true;

    this.deteccionHallazgos = new DeteccionHallazgos();

    this.requisito = new RequisitoAuditoriaRegistro();

    this.listaIncidenciasCombo = [];
    this.obtenerParametrosInc();

    //////////EDITAR/////////////


    this.sub = this.route.params.subscribe(params => {

      this.itemCodigo = params['codigo'];
      if (this.itemCodigo) {

        this.loading = true;
        this.service.buscarPorCodigo(this.itemCodigo).subscribe(
          (response: Response) => {

            this.deteccionHallazgos = response.resultado

            console.log(this.deteccionHallazgos);
            //this.paginacion = new Paginacion(response.paginacion);
            this.loading = false;
          },
          (error) => this.controlarError(error)
        );
      }
      else {

        let tipoDet = localStorage.getItem("tipoDet");
        if (tipoDet == "1") {
          this.deteccionHallazgos.ambito = "Dentro del SGI"
          this.deteccionHallazgos.valorAmbito = "1"
        }
        let origenDeteccion = localStorage.getItem("origenDet");
        //let datoOrigen=this.listaIncidenciasCombo.find(obj=> obj.idconstante==origenDeteccion);
        this.deteccionHallazgos.idorigenDeteccion = origenDeteccion;
      }
      let origenDeteccion = localStorage.getItem("origenDet");
      //let datoOrigen=this.listaIncidenciasCombo.find(obj=> obj.idconstante==origenDeteccion);
      this.deteccionHallazgos.idorigenDeteccion = origenDeteccion;
    });


    console.log(this.itemCodigo);





    this.onClose = new Subject();
    this.crearForm();
    //this.llenarArbol();

    this.participantes = [];
    this.comites = [];
    this.comiteSeleccionado = "";
    this.listaDestino = [];
    this.nodosSeleccionados = [];
    this.listaDestinoTreeNode = [];
    this.nodosSeleccionadosIds = [];
    this.listaArbolPlano = [];


    this.getListaAuditores();
    this.obtenerParametros();



    this.treeModel = this.treeComponent.treeModel;

  }

  obtenerParametrosInc() {
    const parametrosG: { idArea?: string; idCentro?: string; descripcion?: string; abreviatura?: string; tipoArea?: string; idAreaSuperior?: string; } = { idArea: null, idCentro: null, descripcion: null, abreviatura: null, tipoArea: null, idAreaSuperior: null };
    parametrosG.tipoArea = Constante.TIPO_AREA_GERENCIA;
    const parametrosE: { idArea?: string; idCentro?: string; descripcion?: string; abreviatura?: string; tipoArea?: string; idAreaSuperior?: string; } = { idArea: null, idCentro: null, descripcion: null, abreviatura: null, tipoArea: null, idAreaSuperior: null };
    parametrosE.tipoArea = Constante.TIPO_AREA_EQUIPO;
    const buscaIncidenciasCombo = this.generalService.obtenerParametroPadre(NombreParametro.listaOrigenDeteccion);
    const buscaTipoNoConformidad = this.generalService.obtenerParametroPadre(NombreParametro.listaTipoNoConformidad);
    const buscaNormas = this.normaService.obtenerNormas("1");
    const buscarGerencias = this.areaService.buscarArea(parametrosG);
    const buscaEquipos = this.areaService.buscarArea(parametrosE);
    forkJoin(buscaIncidenciasCombo, buscaTipoNoConformidad, buscaNormas, buscarGerencias, buscaEquipos)
      .subscribe(([buscaIncidenciasCombo, buscaTipoNoConformidad, buscaNormas, buscarGerencias, buscaEquipos]: [Response, Response, Response, Response, Response]) => {
        this.listaIncidenciasCombo = buscaIncidenciasCombo.resultado;
        this.listaTipoNoConformidad = buscaTipoNoConformidad.resultado;
        this.listaNormas = buscaNormas.resultado;
        this.listaGerencias = buscarGerencias.resultado;
        this.listaEquipos = buscaEquipos.resultado;

      },
        (error) => this.controlarError(error));
  }

  crearForm() {

    this.registroRequisitosForm = this.formBuilder.group({
      'descripcionAuditoria': new FormControl({ value: '' }),
      'fechaRequisito': new FormControl({ value: '' }),

      'normaRequisito': new FormControl({ value: '' }),

      'alcanceRequisito': new FormControl({ value: '' }),
      'valorGerencia': new FormControl({ value: '' }),
      'valorEquipo': new FormControl({ value: '' }),
      'valorCargo': new FormControl({ value: '' }),
      'valorComite': new FormControl({ value: '' }),
      'listaDestino': new FormControl({ value: '' }),

      'programa': new FormControl({ value: '' }),
      'fechayHora': new FormControl({ value: '' }),

      'tipo': new FormControl({ value: '' }),
      'detector': new FormControl({ value: '' }),
      'origenDeteccion': new FormControl({ value: '' }),
      'tipoNoConformidad': new FormControl({ value: '' }),
      'descripcionHallazgo': new FormControl({ value: '' })




    });
  }

  llenarArbol() {
    this.planAuditoriaService.buscarRequisitosNorma("1").subscribe(
      (response: Response) => {
        this.listaRequisitos = response.resultado;
        const source = interval(1000);
        const subscribe = source.subscribe(val => this.treeModel.expandAll());
      },
      (error) => this.controlarError(error)
    )
  }
  /*
    cancelar(){
      this.bsModalRef.hide();
    }*/

  obtenerClick(event) {
    this.deteccionHallazgos.valorTipoEntidad = event.target.value;
  }

  getListaAuditores() {
    this.planAuditoriaService.buscarAuditores().subscribe(
      (response: Response) => {
        this.participantes = response.resultado;
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

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  seleccionComite(index, obj): void {
    this.selectedRowComite = index;
    this.selectedComite = obj;
  }

  onEliminar() {
    const modal = this.modalService.show(ModalConfirmacionComponent, { ignoreBackdropClick: true, keyboard: false, class: "modal-center" });
    (<ModalConfirmacionComponent>modal.content).showConfirmationModal(
      'Confirmación',
      '¿Está seguro que desea eliminar el registro?'
    );

    (<ModalConfirmacionComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.participantes.splice(this.selectedRow, 1);
      }
    });
  }

  buscarDetector() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {

      },
      class: 'modal-lg-trabajadores'
    }
    let bsModalRef = this.modalService.show(ModalBusquedaColaboradorComponent, config);
    (<ModalBusquedaColaboradorComponent>bsModalRef.content).onClose.subscribe(result => {
      let dato: Trabajador = result;
      this.deteccionHallazgos.detector = dato;
    })
  }

  obtenerParametros() {
    let buscaEntidades = this.planAuditoriaService.obtenerEntidades();

    forkJoin(buscaEntidades)
      .subscribe(([buscaEntidades]: [Response]) => {
        //this.listaGerencias = buscaEntidades.resultado.listaGerencias;
        //this.listaEquipos = buscaEntidades.resultado.listaEquipos;
      },
        (error) => this.controlarError(error));

  }

  agregarComite() {
    console.log(this.requisito.valorEntidadComite);
    if (this.requisito.valorEntidadComite != undefined && this.requisito.valorEntidadComite != null) {
      this.comites.push(this.requisito.valorEntidadComite);
    }

  }

  eliminarComite() {
    const modal = this.modalService.show(ModalConfirmacionComponent, { ignoreBackdropClick: true, keyboard: false, class: "modal-center" });
    (<ModalConfirmacionComponent>modal.content).showConfirmationModal(
      'Confirmación',
      '¿Está seguro que desea eliminar el registro?'
    );

    (<ModalConfirmacionComponent>modal.content).onClose.subscribe(result => {
      if (result) {
        this.comites.splice(this.selectedRowComite, 1);
      }
    });
  }

  seleccionarRequisitos(){
    this.nodosSeleccionadosTemporal = [];
    console.log(this.treeModel.activeNodes);
    this.nodosSeleccionados = this.treeModel.activeNodes;
    if (this.nodosSeleccionados.length > 0) {
      console.log(this.treeModel);

      for (let i: number = 0; this.nodosSeleccionados.length > i; i++) {
        //if(!this.nodosSeleccionados[i].hasChildren){
        let flag: boolean = false;
        for (let k: number = 0; this.listaDestino.length > k; k++) {
          if (this.listaDestino[k].uuid == this.nodosSeleccionados[i].id) {
            flag = true;
            break;
          }
        }
        if (!flag) {
          this.nodosSeleccionadosTemporal.push(this.nodosSeleccionados[i]);
          this.listaDestinoTreeNode.push(this.nodosSeleccionados[i]);
          this.listaDestino.push(this.nodosSeleccionados[i].data);
          this.nodosSeleccionadosIds.push(this.nodosSeleccionados[i].id);
          console.log(this.nodosSeleccionados[i].id);
          if (!this.mostrarComentario) {
            this.mostrarComentario = true;
          }
        }


        /*
        }else{
          let nodosHijos:any[] = this.nodosSeleccionados[i].data.children;
          this.seleccionarNodosHijos(nodosHijos);
        }
        */

      }

      for (let j: number = 0; this.nodosSeleccionadosTemporal.length > j; j++) {
        this.nodosSeleccionadosTemporal[j].hide();
      }



    }

  }

  seleccionarNodosHijos(nodosHijos: any[]) {
    let listaNodosTreeHijos: TreeNode[] = [];
    for (let j: number = 0; nodosHijos.length > j; j++) {
      let nodoHijo = nodosHijos[j];
      let nodoTreeHijo: TreeNode = this.treeModel.getNodeById(nodoHijo.uuid);
      console.log("Nodo Hijo");
      console.log(nodoTreeHijo);
      console.log(nodoTreeHijo.isHidden);
      if (!nodoTreeHijo.isHidden) {
        if (nodoTreeHijo.hasChildren) {
          let nodosHijosHijos: any[] = nodoTreeHijo.data.children;
          this.seleccionarNodosHijos(nodosHijosHijos);
        } else {
          let flag: boolean = false;
          for (let k: number = 0; this.listaDestino.length > k; k++) {
            if (this.listaDestino[k].uuid == nodoTreeHijo.id) {
              flag = true;
              break;
            }
          }

          if (!flag) {
            this.nodosSeleccionadosTemporal.push(nodoTreeHijo);
            this.listaDestinoTreeNode.push(nodoTreeHijo);
            this.listaDestino.push(nodoTreeHijo.data);
            this.nodosSeleccionadosIds.push(nodoTreeHijo.id);
          }


        }
      }
    }
  }

  quitarRequisitos() {
    if (this.listaDestino.length > 0) {
      let nodosQuitados: any[] = this.registroRequisitosForm.controls['listaDestino'].value;
      console.log(nodosQuitados);
      let listaItem: number[] = [];

      for (let h: number = 0; nodosQuitados.length > h; h++) {
        let nodoArbol: TreeNode = this.treeModel.getNodeById(nodosQuitados[h].uuid)
        nodoArbol.show();
      }


      for (let i: number = 0; this.listaDestino.length > i; i++) {
        let normaAux = this.listaDestino[i];
        for (let j: number = 0; nodosQuitados.length > j; j++) {
          let nodoQuitadoAux = nodosQuitados[j]
          if (normaAux.id == nodoQuitadoAux.id) {
            listaItem.push(i);
            break;
          }
        }
      }
      for (let k: number = listaItem.length - 1; 0 <= k; k--) {
        this.listaDestino.splice(listaItem[k], 1);
      }

      console.log("ListaDestino.length: " + this.listaDestino.length);

      if (this.listaDestino.length == 0) {
        this.mostrarComentario = false;
        this.deteccionHallazgos.descripHallazgo = "";
      }




    }
  }

  seleccionarTodos() {
    this.obtenerListaNodosHojas();
    let nodosSeleccionadosUtiles: any[] = [];
    if (this.listaArbolPlano.length > 0) {
      console.log(this.treeModel);

      for (let i: number = 0; this.listaArbolPlano.length > i; i++) {
        if (!this.listaArbolPlano[i].hasChildren) {
          nodosSeleccionadosUtiles.push(this.listaArbolPlano[i]);
          this.listaDestinoTreeNode.push(this.listaArbolPlano[i]);
          this.listaDestino.push(this.listaArbolPlano[i].data);
          this.nodosSeleccionadosIds.push(this.listaArbolPlano[i].id);
          console.log(this.listaArbolPlano[i].id);
        }

      }

      for (let j: number = 0; nodosSeleccionadosUtiles.length > j; j++) {
        nodosSeleccionadosUtiles[j].hide();
      }



    }
  }


  quitarTodos() {
    for (let h: number = 0; this.listaDestino.length > h; h++) {
      let nodoArbol: TreeNode = this.treeModel.getNodeById(this.listaDestino[h].uuid)
      nodoArbol.show();
    }
    this.listaDestino = [];

  }

  obtenerListaNodos() {
    this.listaArbolPlano = [];
    let listaNodosArbol: TreeNode[] = this.treeModel.getVisibleRoots();
    for (let i: number = 0; listaNodosArbol.length > i; i++) {
      let nodoArbol: TreeNode = listaNodosArbol[i];
      console.log(nodoArbol.parent);
      console.log(nodoArbol.isRoot);
      this.recorrerNodos(nodoArbol);
    }

    console.log(this.listaArbolPlano);
  }

  recorrerNodos(nodo: TreeNode) {

    let encontro: boolean = false;
    if (!nodo.isRoot) {
      for (let j: number = 0; this.listaDestino.length > j; j++) {
        if (nodo.id == this.listaDestino[j].uuid) {
          encontro = true;
          break;
        }
      }
      if (!encontro) {
        this.listaArbolPlano.push(nodo);
      }
    }

    if (nodo.hasChildren) {
      for (let k: number = 0; nodo.data.children.length > k; k++) {
        let nodoHijo = nodo.data.children[k];
        this.recorrerNodos(this.treeModel.getNodeById(nodoHijo.uuid));
      }
    }
  }

  obtenerListaNodosHojas() {
    this.listaArbolPlano = [];
    let listaNodosArbol: TreeNode[] = this.treeModel.getVisibleRoots();
    for (let i: number = 0; listaNodosArbol.length > i; i++) {
      let nodoArbol: TreeNode = listaNodosArbol[i];
      this.recorrerNodosHojas(nodoArbol);
    }

    console.log(this.listaArbolPlano);
  }

  recorrerNodosHojas(nodo: TreeNode) {
    let encontro: boolean = false;
    console.log(nodo.hasChildren)

    if (nodo.hasChildren) {
      for (let k: number = 0; nodo.data.children.length > k; k++) {
        let nodoHijo = nodo.data.children[k];
        this.recorrerNodosHojas(this.treeModel.getNodeById(nodoHijo.uuid));
      }
    } else {
      for (let j: number = 0; this.listaDestino.length > j; j++) {
        if (nodo.id == this.listaDestino[j].uuid) {
          encontro = true;
          break;
        }
      }
      if (!encontro) {
        this.listaArbolPlano.push(nodo);
      }
    }
    if (!encontro) {
      this.listaArbolPlano.push(nodo);
    }
  }

  guardar() {

  }

  cancelar() {
    //this.bsModalRef.hide();
    this.router.navigate([`auditoria/deteccion-hallazgos`]);
  }

  abrirBusqueda() {
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-lg'
    }


    this.bsModalRef = this.modalService.show(ModalBusquedaDetectoresComponent, config);
    (<ModalBusquedaDetectoresComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.busquedaPlan = result;
      this.OnBuscar();

    });

  }

  obtenerRequisitosNorma(idNorma: string) {
    this.loading = true;
    this.normaService.buscarRequisitosNorma(idNorma, "1").subscribe(
      (response: Response) => {
        
        console.log('response');
        console.log(response);
        this.listaRequisitos = [response.resultado];
        this.treeComponent.treeModel.update();
        this.loading = false;
      },
      (error) => this.controlarError(error)
    )
  }

  cambiaNorma() {
    let norma: string = this.deteccionHallazgos.norma;
    if (norma != "") {
      this.listaRequisitos = [];
      this.listaDestinoTreeNode = [];
      this.listaDestino = [];
      this.nodosSeleccionadosIds = [];
      this.deteccionHallazgos.descripHallazgo = "";
      this.obtenerRequisitosNorma(norma);
      this.desactivaRequisitos = false;
      this.mostrarComentario = false;
    } else {
      this.listaRequisitos = [];
      this.listaDestinoTreeNode = [];
      this.listaDestino = [];
      this.nodosSeleccionadosIds = [];
      this.nodosSeleccionados = [];
      this.deteccionHallazgos.descripHallazgo = "";
      this.mostrarComentario = false;
      this.desactivaRequisitos = true;

    }
  }

  OnGuardar() {
    console.log("Lista destino");
    console.log(this.listaDestino);

    let deteccionHallazgosRegistro: DeteccionHallazgos = Object.assign({}, this.deteccionHallazgos);

    if (this.listaDestino.length > 0) {
      let requisitoAux: Requisito = new Requisito();
      /*antes requisitoAux.idRequisito = this.listaDestino[0].idRequisito;
      requisitoAux.descripcionReq = this.listaDestino[0].descripcionReq;*/
      deteccionHallazgosRegistro.requisito = requisitoAux;
    }

    if (deteccionHallazgosRegistro.norma == "") {
      deteccionHallazgosRegistro.norma = null;
    }

    if (deteccionHallazgosRegistro.idorigenDeteccion == "") {
      deteccionHallazgosRegistro.idorigenDeteccion = null;
    }

    if (deteccionHallazgosRegistro.idTipoNoConformidad == "") {
      deteccionHallazgosRegistro.idTipoNoConformidad = null;
    }

    if (deteccionHallazgosRegistro.valorEntidadGerencia == "") {
      deteccionHallazgosRegistro.valorEntidadGerencia = null;
    }

    if (deteccionHallazgosRegistro.valorEntidadEquipo == "") {
      deteccionHallazgosRegistro.valorEntidadEquipo = null;
    }

    console.log(deteccionHallazgosRegistro);

    this.service.guardar(deteccionHallazgosRegistro).subscribe(
      (response: Response) => {

        this.loading = false;
        this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
        this.router.navigate([`auditoria/deteccion-hallazgos`]);
      },
      (error) => this.controlarError(error)
    );
  }




}

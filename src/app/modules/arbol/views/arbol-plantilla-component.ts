import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { Response } from '../../../models/response';
import { BandejaDocumentoService } from '../../../services';
import { Paginacion } from '../../../models/paginacion';
import { Arbol } from '../../../models/arbol';
import { ViewChild } from '@angular/core';
import { Input } from '@angular/core';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Subject, forkJoin, interval } from 'rxjs';
import { Output } from '@angular/core';
import { EventEmitter } from '@angular/core';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';

declare var jQuery: any;

@Component({
  selector: 'arbol-plantilla',
  templateUrl: 'arbol-plantilla-template.html',
  styleUrls: ['arbol-plantilla-component.scss']
})

export class ArbolPlantillaCoTreeFlatOverviewData implements OnInit {
  //Arbol
  @Input() activarBotonArbol: boolean;
  @Output() objnode: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('tree') treeComponent: TreeComponent;
  listaJerarquia: any[] = [];
  listaDestino: any[];
  listaDestinoTreeNode: any[];
  nodeAux: any;
  treeModel: TreeModel;
  arbolAuxiliar: TreeModel;
  odeAux: any;
  nodosSeleccionadosIds: any[];
  nodosSeleccionados: any[];
  nodosSeleccionadosTemporal: any[];
  listaArbolPlano: TreeNode[];
  activarBotonesArbol: boolean;
  activeNode: any;
  itemArbolSeleccionadoGlobal: any;
  idArbolSel: number;
  idTipoArbol: number;
  rutaCompletaSelec: string;
  descArbolSel: string;
  listaRequisitos: any[] = [];
  nodosTemporales: any[] = [];

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
  /* Arbol */
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
          localStorage.removeItem("objetoRetornoBusqueda");
          this.idArbolSel = node.data.id;
          this.idTipoArbol = node.data.idTipoDocu;
          this.rutaCompletaSelec = node.data.ruta;
          this.descArbolSel = node.data.nombre;
          let nodes = node.data;
          this.objnode.emit(nodes);
          //Ruta del arbol
          localStorage.setItem("rutadelarbol", this.rutaCompletaSelec);
          if (localStorage.getItem("nodeSeleccionado") == null) {
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
            localStorage.setItem("nodeSeleccionado", node.data.id);
            localStorage.setItem('codeTypeDocument', node.data.idTipoDocu);
            let obtenerListaNodos = this.obtenerListaNodos();
            let nodoActivo = this.listaArbolPlano.find(obj => obj.data.id == this.itemArbolSeleccionadoGlobal);
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, nodoActivo, $event);
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
          } else {
            let obtenerListaNodos = this.obtenerListaNodos();
            let nodoActivo = this.listaArbolPlano.find(obj => obj.data.id == this.itemArbolSeleccionadoGlobal);

            TREE_ACTIONS.TOGGLE_ACTIVE(tree, nodoActivo, $event);
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
            localStorage.setItem("nodeSeleccionado", node.data.id);
            localStorage.setItem('codeTypeDocument', node.data.idTipoDocu);
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
      return false;
    },
    allowDrop: (node) => {
      return false;
    },

    levelPadding: 10,
    animateExpand: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
  }

  /* codigo seleccionado */
  itemCodigo: number;
  listaTipos: Tipo[];
  private sub: any;
  /* indicador de carga */
  loading: boolean;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  /* datos */
  items: Arbol[];
  parametroId: number;
  selectedObject: Arbol;
  listaUltimaCoordinadores: RelacionCoordinador[];
  tipoDocumentoGerencia: number;

  ngAfterViewInit() {
    this.treeModel.expandAll()
    this.treeOptions.actionMapping.click
  }

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: BandejaDocumentoService
  ) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({ registros: 10 });
    this.selectedRow = -1;
    this.items = [];
    this.parametroId;
    this.activarBotonArbol = true;
  }

  ngOnInit() {
    this.getLista();
    this.nodosSeleccionados = [];
    this.listaDestinoTreeNode = [];
    this.listaDestino = [];
    this.nodosSeleccionadosIds = [];
    this.listaArbolPlano = [];
    this.treeModel = this.treeComponent.treeModel;

    if (localStorage.getItem("nodeSeleccionado") != null) {
      this.datoSesion(localStorage.getItem("nodeSeleccionado"));
    }

  }

  getLista(): void {    
    let tipoBandeja = localStorage.getItem("idProcesoSeleccionado");
    let tipoNombreJerarquia = localStorage.getItem("tipoNom");
    localStorage.removeItem("tipoNom");
    if (tipoNombreJerarquia == null || tipoNombreJerarquia == undefined) {
      tipoNombreJerarquia = null;
    }
    let idTipoDocumento = this.tipoDocumentoGerencia != null ? this.tipoDocumentoGerencia.toString() : "";

    const parametros: { codigo?: string, tipo?: string, id?: string, idTipoDocu?: string, tipoJerarquiaNombre?: string } = { codigo: null, tipo: tipoBandeja, id: null, idTipoDocu: idTipoDocumento, tipoJerarquiaNombre: null };
    parametros.tipoJerarquiaNombre = tipoNombreJerarquia;
    this.service.buscarPorParametrosArbol(parametros, 0, 0).subscribe(
      (response: Response) => {
        let listaJerarquiaResultado = response.resultado;
        if (this.listaUltimaCoordinadores != null && this.listaUltimaCoordinadores != undefined) {
          this.OnValidarAlcance(listaJerarquiaResultado);
        } else {
          this.listaJerarquia = listaJerarquiaResultado;
        }
        this.treeComponent.treeModel.update();

/*         if (localStorage.getItem("nodeSeleccionado") != null) {
          const nodo = this.treeComponent.treeModel.getNodeById(this.itemArbolSeleccionadoGlobal);
          nodo.expand();
        } */

        const source = interval(1000);
        const subscribe = source.subscribe();
      },
      (error) => this.controlarError(error)
    );
  }

  datoSesion(node) {
    this.itemArbolSeleccionadoGlobal = node;
    localStorage.removeItem('nodeSeleccionado');
  }

  actualizarArbol() {    
    let obtenerListaNodos = this.obtenerListaNodos();
    let nodoActivo = this.listaArbolPlano.find(obj => obj.data.id == this.itemArbolSeleccionadoGlobal);

    if (nodoActivo != undefined) {
      let idPadre:number= nodoActivo.data.idPadre; 
      let nivelJerarquia:number = nodoActivo.data.nivelJerarquia;
      let nodoPadre;

      for (let index = 1; index < nivelJerarquia; index++) {
        nodoPadre = this.listaArbolPlano.find(obj => obj.data.id == idPadre); 
        TREE_ACTIONS.TOGGLE_EXPANDED(this.treeComponent.treeModel, nodoPadre, null);  
        idPadre = nodoPadre.data.idPadre;      
      }
      TREE_ACTIONS.TOGGLE_ACTIVE(this.treeComponent.treeModel, nodoActivo, null);
      let nodes = nodoActivo.data;
      this.objnode.emit(nodes);

      this.rutaCompletaSelec = nodoActivo.data.ruta;

      localStorage.setItem("rutadelarbol", this.rutaCompletaSelec);
      if (localStorage.getItem("nodeSeleccionado") == null) {
        localStorage.setItem("nodeSeleccionado", nodes.id);
        localStorage.setItem('codeTypeDocument', nodes.idTipoDocu);
         this.obtenerListaNodos();
        let nodoActivo = this.listaArbolPlano.find(obj => obj.data.id == this.itemArbolSeleccionadoGlobal);
      } else {
        this.obtenerListaNodos();
        let nodoActivo = this.listaArbolPlano.find(obj => obj.data.id == this.itemArbolSeleccionadoGlobal);
        localStorage.setItem("nodeSeleccionado", nodes.id);
        localStorage.setItem('codeTypeDocument', nodes.idTipoDocu);
      }

    }
  }

  OnValidarAlcance(listaResultadoAlcance) {
    if (this.listaUltimaCoordinadores.length > 0) {
      for (let i: number = 0; this.listaUltimaCoordinadores.length > i; i++) {
        let objetoCoordinador = this.listaUltimaCoordinadores[i];
        for (let j: number = 0; listaResultadoAlcance.length > j; j++) {
          let objetoListaAlcance = listaResultadoAlcance[j];
          if (objetoCoordinador.idAlcance == objetoListaAlcance.id) {
            this.listaJerarquia.push(objetoListaAlcance);
            break;
          }
        }
      }
    }
  }
  
  OnRegresar() {
    this.router.navigate([`mantenimiento/BandejaDocumentoService`]);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }
  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
  
  seleccionarNodosHijos(nodosHijos: any[]) {
    let listaNodosTreeHijos: TreeNode[] = [];
    for (let j: number = 0; nodosHijos.length > j; j++) {
      let nodoHijo = nodosHijos[j];
      let nodoTreeHijo: TreeNode = this.treeModel.getNodeById(nodoHijo.uuid);
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

  obtenerListaNodos() {    
    this.listaArbolPlano = [];
    let listaNodosArbol: TreeNode[] = this.treeModel.getVisibleRoots();
    for (let i: number = 0; listaNodosArbol.length > i; i++) {
      let nodoArbol: TreeNode = listaNodosArbol[i];
      this.recorrerNodos(nodoArbol);
    }
  }

  recorrerNodos(nodo: TreeNode) {
    let encontro: boolean = false;
    this.listaArbolPlano.push(nodo);

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
  }

  recorrerNodosHojas(nodo: TreeNode) {
    let encontro: boolean = false;

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
  }

}

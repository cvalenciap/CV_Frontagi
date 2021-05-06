import { Component, OnInit, Output, Input, ViewChild } from '@angular/core';
import { FormControl, FormGroup, FormBuilder } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { EventEmitter } from '@angular/core';
import { Subject, forkJoin, interval } from 'rxjs';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { Response } from '../../../models/response';
import { BandejaDocumentoService } from '../../../services';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';

declare var jQuery: any;

@Component({
  selector: 'arbol-proceso',
  templateUrl: 'arbol-proceso-template.html',
  styleUrls: ['arbol-proceso-component.scss']
})
export class ArbolProceso implements OnInit {
  @Input() activarBotonArbol: boolean;
  @Input() idNodoSeleccionado: number;
  @Input() idProceso: number;
  @Output() objnode: EventEmitter<any> = new EventEmitter<any>();
  @ViewChild('tree') treeComponent: TreeComponent;

  listaJerarquia: any[] = [];
  treeModel: TreeModel;
  listaArbolPlano: TreeNode[];
  idArbolSel: number;
  idTipoArbol: number;
  rutaCompletaSelec: string;
  descArbolSel: string;
  loading: boolean;
  listaUltimaCoordinadores: RelacionCoordinador[];
  tipoDocumentoGerencia: number;

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

  treeOptions: ITreeOptions = {
    displayField: 'nombre',
    isExpandedField: 'expanded',
    idField: 'uuid',
    hasChildrenField: 'nodes',
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
        },
        click: (tree, node, $event) => {          
          this.idArbolSel = node.data.id;
          this.idTipoArbol = node.data.idTipoDocu;
          this.rutaCompletaSelec = node.data.ruta;
          this.descArbolSel = node.data.nombre;
          let nodes = node.data;
          this.objnode.emit(nodes);
          let nodoActivo = this.listaArbolPlano.find(obj => obj.data.id == this.idNodoSeleccionado);
          TREE_ACTIONS.TOGGLE_ACTIVE(tree, nodoActivo, $event);
          TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
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

  ngAfterViewInit() {
    this.treeModel.expandAll();
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

    this.activarBotonArbol = true;
  }

  ngOnInit() {    
    this.getLista();
    this.listaArbolPlano = [];
    this.treeModel = this.treeComponent.treeModel;
  }

  getLista(): void {
    let tipoBandeja = this.idProceso;
    let idTipoDocumento = this.tipoDocumentoGerencia != null ? this.tipoDocumentoGerencia.toString() : "";
    const parametros: { codigo?: string, tipo?: string, id?: string, idTipoDocu?: string } =
      { codigo: null, tipo: tipoBandeja.toString(), id: null, idTipoDocu: idTipoDocumento };
    this.service.buscarPorParametrosArbol(parametros, 0, 0).subscribe(
      (response: Response) => {
        let listaJerarquiaResultado = response.resultado;
        if (this.listaUltimaCoordinadores != null && this.listaUltimaCoordinadores != undefined) {
          if (this.listaUltimaCoordinadores.length > 0) {
            for (let i: number = 0; this.listaUltimaCoordinadores.length > i; i++) {
              let objetoCoordinador = this.listaUltimaCoordinadores[i];
              if (objetoCoordinador != null) {
                for (let j: number = 0; listaJerarquiaResultado.length > j; j++) {
                  let objetoLista = listaJerarquiaResultado[j];
                  if (objetoCoordinador.idAlcance == objetoLista.id) {
                    this.listaJerarquia.push(objetoLista);
                    break;
                  }
                }
              }
            }
          }
        } else {
          this.listaJerarquia = listaJerarquiaResultado;
        }

        this.treeComponent.treeModel.nodes = this.listaJerarquia;
        this.treeComponent.treeModel.update();
        const source = interval(1000);
        const subscribe = source.subscribe();

      },
      (error) => this.controlarError(error)
    );
  }

  expandirPadre(node: any) {
    const padre = node.data.idPadre;
    if (padre != null) {
      const nodoPadre = this.listaArbolPlano.find(obj => obj.data.id == padre);
      this.expandirPadre(nodoPadre);
    } else {
      node.expandAll();
    }
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
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

    if (nodo.hasChildren) {
      for (let k: number = 0; nodo.data.children.length > k; k++) {
        let nodoHijo = nodo.data.children[k];
        this.recorrerNodos(this.treeModel.getNodeById(nodoHijo.uuid));
      }
    }
  }

  actualizarArbol() {
    let obtenerListaNodos = this.obtenerListaNodos();
    let nodoActivo = this.listaArbolPlano.find(obj => obj.data.id == this.idNodoSeleccionado);
    TREE_ACTIONS.TOGGLE_ACTIVE(this.treeComponent.treeModel, nodoActivo, null);
  }

}
import { Component, OnInit, ViewChild } from '@angular/core';
import { BsLocaleService, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Constante } from 'src/app/models/constante';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';
import { Norma } from 'src/app/models/norma';
import { Requisito } from 'src/app/models/requisito';
import { TREE_ACTIONS, KEYS, IActionMapping, ITreeOptions, TreeComponent, TreeNode, TreeModel } from 'angular-tree-component';
import { TipoNormasService } from 'src/app/services/impl/tipo-normas.service';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { NormaIncidenciaService } from 'src/app/services';
import { NormaRequisitosService } from 'src/app/services/impl/norma-requisitos.service';
import { TreeOptions } from 'angular-tree-component/dist/models/tree-options.model';
import { NgxSpinnerService } from 'ngx-spinner';

declare var jQuery: any;

@Component({
  selector: 'app-registrar-norma-incidencia',
  templateUrl: './registrar-norma-incidencia.component.html',
  styleUrls: ['./registrar-norma-incidencia.component.scss']
})

export class RegistrarNormaIncidenciaComponent implements OnInit {
  private sub: any;
  idNorma: number;
  listaTiposNormas: Constante[];
  listaNormas: Norma[];
  listaRequisitos: Requisito[];
  listaNodos: any[];
  paginacion: Paginacion;
  modelTipoNorma: Constante;
  modelNorma: Norma;
  headeNorma: Norma;
  norma: Norma;
  modelRequi: Requisito;
  requiSelec: Requisito;
  estado_activo: string;
  auditable: number;
  nivel: number;
  autoIdNorma: number;
  autoIdRequi: number;
  isRoot: boolean;
  hasChildren: boolean;
  isLeaf: boolean;
  isAuditable: boolean;
  habilitarCampos: boolean;
  exiteCampoUno: boolean;
  exiteCampoDos: boolean;
  exiteCampoTre: boolean;
  mostrarTag: boolean;
  treeNode: TreeNode;

  nodes = [
    {
      id: 1,
      name: 'root1',
      children: [
        { id: 2, name: 'child1' },
        {
          id: 3, name: 'child2',
          children: [
            { id: 4, name: 'child1' },
            {
              id: 5, name: 'child2',
              children: [
                { id: 6, name: 'child1' },
                {
                  id: 7, name: 'child2',
                  children: [
                    { id: 8, name: 'child1' },
                    {
                      id: 9, name: 'child2',
                      children: [
                        { id: 8, name: 'child1' },
                        {
                          id: 9, name: 'child2', children: [
                            { id: 8, name: 'child1' },
                            { id: 9, name: 'child2' }
                          ]
                        }
                      ]
                    }
                  ]
                },

              ]
            },

          ]
        }

      ]
    },
    {
      id: 10,
      name: 'root2',
      children: [
        { id: 11, name: 'child2.1' },
        {
          id: 12,
          name: 'child2.2',
          children: [
            { id: 13, name: 'subsub' }
          ]
        }
      ]
    }
  ];

  options: ITreeOptions = {
    displayField: 'v_nom_norma',
    isExpandedField: 'expanded',
    idField: 'idNodo',
    // childrenField: 'requisitos',
    hasChildrenField: 'nodes',
    actionMapping: {
      mouse: {
        dblClick: (tree, node, $event) => {
          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
        },
        click: (tree, node, $event) => {
          this.onNodoHijo(node);
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

  // Referencia de componentes
  @ViewChild('tree') treeComponent: TreeComponent;

  constructor(private localeService: BsLocaleService,
    private service: NormaIncidenciaService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private serviceNR: NormaRequisitosService,
    private serviceTN: TipoNormasService,
    private spinner: NgxSpinnerService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.idNorma = 0;
    this.mostrarTag = false;
    this.sub = this.route.params.subscribe(params => {
      if (params['id'] === undefined) {
        this.idNorma = 0;
      } else {
        this.idNorma = +params['id'];
        this.mostrarTag = true;
      }
    });
    this.listaTiposNormas = [];
    this.listaNormas = [];
    this.listaRequisitos = [];
    this.listaNodos = [];
    this.modelTipoNorma = new Constante();
    this.modelNorma = new Norma();
    this.headeNorma = new Norma();
    this.norma = new Norma();
    this.modelRequi = new Requisito();
    this.requiSelec = new Requisito();
    this.estado_activo = '1';
    this.auditable = 1;
    this.nivel = 1;
    this.autoIdNorma = 0;
    this.autoIdRequi = 0;
    this.isRoot = false;
    this.hasChildren = false;
    this.isLeaf = false;
    this.isAuditable = false;
    this.habilitarCampos = false;
    this.exiteCampoUno = false;
    this.exiteCampoDos = false;
    this.exiteCampoTre = false;
    this.onObtenerTiposNormas();
    this.cargarArbol();
  }

  onObtenerTiposNormas() {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.serviceTN.obtenerTipoNormas(this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaTiposNormas = response.resultado;
        this.modelTipoNorma = this.listaTiposNormas[1];
      },
      (error) => this.controlarError(error)
    );
  }

  cargarArbol() {
    //this.spinner.show();
    this.onObtenerNormas();
    this.onObtenerNormaRequisitos();
    //this.spinner.hide();
  }

  onObtenerNormas() {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.service.listarNormasAuditoria(this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaNormas = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        if (this.listaNormas) {
          //const maxIdNorma = Math.max(...this.listaNormas.map(x => x.n_id_normas), 0);
          if (this.idNorma != 0) {
            this.norma = this.listaNormas.find(x => x.n_id_normas === this.idNorma);
          }
        }
      },
      (error) => this.controlarError(error)
    );
  }

  onObtenerNormaRequisitos() {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.serviceNR.obtenerNormaRequisitos(this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaRequisitos = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        if (this.listaRequisitos) {
          const maxIdRequisito = Math.max(...this.listaRequisitos.map(x => x.n_id_requisito), 0);
          if (this.idNorma != 0) {
            this.listaNodos.push(this.norma);
            const requisitos = this.listaRequisitos.filter(x => x.n_id_normas === this.norma.n_id_normas);
            for (let i = 0; i < requisitos.length; i++) {
              if (requisitos[i].n_nivel_req === 1 && requisitos[i].n_auditable === 0
              ) {
                requisitos[i].v_nom_norma = requisitos[i].v_num_req + ' ' + requisitos[i].v_nom_req;
                const index = this.listaNodos.length - 1;
                this.listaNodos[index].children = this.listaNodos[index].children ? this.listaNodos[index].children : [];
                this.listaNodos[index].children.push(requisitos[i]);
                const ichild = this.listaNodos[index].children.length - 1;
                this.onCargarNodosHijos(this.listaNodos[index].children[ichild], i);
              }
            }
            this.treeComponent.treeModel.update();
            this.treeComponent.treeModel.expandAll();
          }
        }
      },
      (error) => this.controlarError(error)
    );
  }

  onCargarNodosHijos(data: any, i: number) {
    const hijos: any[] = this.listaRequisitos.filter(x => x.n_id_req_padre === data.n_id_requisito);
    if (hijos) {
      for (let i = 0; i < hijos.length; i++) {
        hijos[i].v_nom_norma = hijos[i].v_num_req + ' ' + hijos[i].v_nom_req;
        data.children = data.children ? data.children : [];
        data.children.push(hijos[i]);
        const index = data.children.length - 1;
        this.onCargarNodosHijos(data.children[index], i);
      }
    }
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  OnRegresar() {
    localStorage.setItem('codigoTipo', this.modelTipoNorma.v_valcons);
    this.router.navigate([`auditoria/norma-incidencia`]);
  }

  onsoloNumeros(e: any) {
    const tecla = (document.all) ? e.keyCode : e.which; // 2
    if (tecla === 8) { return true; } // 3
    const patron = /\d/; // Solo acepta números// 4
    const keyCode = String.fromCharCode(tecla); // 5
    return patron.test(keyCode); // 6
  }

  agregarNodo() {
    this.onSeteaRequisito();
    if (this.isRoot && this.hasChildren) {
      //this.treeNode.data.children.push(this.modelRequi);
      this.modelRequi.n_id_requisito = this.onAutoIdRequisito();
      this.onAutoIdNivel(this.treeNode);
      this.listaNodos[this.treeNode.index].children.push(this.modelRequi);
      this.isRoot = false;
    } else if (!this.hasChildren && this.isLeaf) {
      this.modelRequi.n_id_requisito = this.onAutoIdRequisito();
      this.onAutoIdNivel(this.treeNode);
      this.treeNode.data.children = this.treeNode.data.children ? this.treeNode.data.children : [];
      this.treeNode.data.children.push(this.modelRequi);
    } else if (this.hasChildren && !this.isLeaf) {
      this.modelRequi.n_id_requisito = this.onAutoIdRequisito();
      this.onAutoIdNivel(this.treeNode);
      this.treeNode.data.children = this.treeNode.data.children ? this.treeNode.data.children : [];
      this.treeNode.data.children.push(this.modelRequi);
    } else {
      this.onDefaultNorma();
      this.onDefaultRequisito();
      this.listaNodos.push(this.modelNorma);
      const index = this.listaNodos.length - 1;
      this.listaNodos[index].children = this.listaNodos[index].children ? this.listaNodos[index].children : [];
      this.listaNodos[index].children.push(this.modelRequi);
    }
    this.hasChildren = false;
    this.isLeaf = false;
    this.onUpdateExpandArbol();
  }

  onAutoIdNivel(node: TreeNode) {
    if (node.level === this.nivel) {
      this.modelRequi.n_nivel_req = node.level;
    } else {
      const nivel = node.level;
      this.modelRequi.n_nivel_req = nivel;
    }
  }

  onUpdateExpandArbol() {
    this.onResetModelos();
    this.treeComponent.treeModel.update();
    this.treeComponent.treeModel.expandAll();
  }

  onResetModelos() {
    this.modelNorma = new Norma();
    this.modelRequi = new Requisito();
    this.habilitarCampos = false;
  }

  onAutoIdNorma(): number {
    return this.autoIdNorma += 1;
  }

  onDefaultNorma() {
    this.modelNorma.n_id_normas = this.onAutoIdNorma();
    this.modelNorma.v_nom_norma = this.modelNorma.v_nom_norma.trim();
    this.modelNorma.v_tipo = this.modelTipoNorma.v_valcons;
    this.modelNorma.v_st_reg = this.estado_activo;
  }

  onAutoIdRequisito(): number {
    return this.autoIdRequi += 1;
  }

  onDefaultRequisito() {
    this.modelRequi.n_id_requisito = this.onAutoIdRequisito();
    this.modelRequi.n_id_normas = this.modelNorma.n_id_normas;
    this.modelRequi.v_num_req = this.modelRequi.v_num_req.trim();
    this.modelRequi.v_nom_req = this.modelRequi.v_nom_req.trim();
    this.modelRequi.n_nivel_req = this.nivel;
    this.modelRequi.n_id_req_padre = null;
    this.modelRequi.n_auditable = this.auditable;
    this.modelRequi.v_desc_req = null;
    this.modelRequi.v_st_reg = this.estado_activo;
    this.modelRequi.v_nom_norma = this.modelRequi.v_num_req + ' ' + this.modelRequi.v_nom_req;
  }

  onSeteaRequisito() {
    this.modelRequi.n_id_normas = this.modelNorma.n_id_normas;
    this.modelRequi.v_num_req = this.modelRequi.v_num_req.trim();
    this.modelRequi.v_nom_req = this.modelRequi.v_nom_req.trim();
    this.modelRequi.n_id_req_padre = null;
    this.modelRequi.n_auditable = this.auditable;
    this.modelRequi.v_desc_req = null;
    this.modelRequi.v_st_reg = this.estado_activo;
    this.modelRequi.v_nom_norma = this.modelRequi.v_num_req + ' ' + this.modelRequi.v_nom_req;
  }

  onNodoHijo(node: TreeNode) {
    this.treeNode = node;
    this.habilitarCampos = true;
    this.hasChildren = node.hasChildren;
    this.isLeaf = node.isLeaf;
    if (node.isRoot) {
      this.headeNorma = node.data;
      this.onSetearNormaParent(this.headeNorma);
      const maxNumReq = Math.max(...node.data.children.map(x => Number(x.v_num_req)), 0);
      this.modelRequi.v_num_req = (maxNumReq + 1).toString();
      this.isRoot = node.isRoot;
      this.requiSelec = new Requisito();
      this.isAuditable = false;
    } else {
      const norma = this.listaNodos.find(x => x.n_id_normas === node.data.n_id_normas);
      this.onSetearNormaParent(norma);
      node.data.children = node.data.children ? node.data.children : [];
      const indexPadre = node.data.children.length + 1;
      this.modelRequi.v_num_req = node.data.v_num_req + '.' + indexPadre;
      this.onCargarDatos(node.data);
    }
  }

  onSetearNormaParent(norma: Norma) {
    this.modelNorma.v_nom_norma = norma.v_nom_norma;
    this.modelNorma.n_id_normas = norma.n_id_normas;
    this.modelNorma.v_tipo = norma.v_tipo;
    this.modelNorma.v_st_reg = norma.v_st_reg;
  }

  onCargarDatos(requisito: Requisito) {
    this.requiSelec = { ...requisito };
    this.isAuditable = this.requiSelec.n_auditable === 1 ? true : false;
  }

}

import { Component, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { RelacionCoordinador } from 'src/app/models/relacioncoordinador';
import { BsDaterangepickerDirective } from 'ngx-bootstrap/datepicker';
import { FormGroup, FormBuilder, Validators, FormControl } from '@angular/forms';
import { Response } from './../../../models/response';
import { ViewChild } from '@angular/core';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent, TreeModel, TreeNode } from 'angular-tree-component';
import { Constante } from 'src/app/models/enums/constante';

@Component({
  selector: 'arbol-relacion',
  templateUrl: './arbol-relacion.template.html'
})
export class ModalArbolRelacionComponent implements OnInit {
    @ViewChild('tree') treeComponent: TreeComponent;
    public onClose: Subject<RelacionCoordinador>;
    nodosJerarquia: any[];
    treeModel: TreeModel;
    listaArbol: any[];
    objetoArbolSeleccionado: any;
    tipoBandeja: string;
    activarSeleccionar: boolean;
    
    nodes = [
      {
        id: 1,
        nombre: 'root1',
        children: [
          { id: 2, nombre: 'child1' },
          { id: 3, nombre: 'child2' }
        ]
      }
    ];

    treeOptions: ITreeOptions = {
      displayField: 'nombre',
      isExpandedField: 'expanded',
      idField: 'uuid',
      actionMapping: {
        mouse: {
          dblClick: (tree, node, $event) => {
            if (node.hasChildren) {
              TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);
            }
          },
          click: (tree,node, $event) => {
            if(node.data.children == null){
              TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
              this.obtenerDatosJerarquia(node.data.id);
            }
          }
        },
        keys: {
          [KEYS.ENTER]: (tree, node, $event) => {
            node.expandAll();
          }
        },
      },
      nodeHeight: 23,
      allowDrag: (node) => {
        return true;
      },
      allowDrop: (node) => {
        return true;
      },
      levelPadding: 10,
      animateExpand: true,
      animateSpeed: 30,
      animateAcceleration: 1.2
    }
  
    constructor(public bsModalRef: BsModalRef,
                private toastr: ToastrService,
                private localeService: BsLocaleService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
    }
  
    ngOnInit() {
      
      this.objetoArbolSeleccionado = [];
      this.listaArbol = [];
      this.activarSeleccionar = true;
      this.listaArbol = this.nodosJerarquia;
      this.treeModel = this.treeComponent.treeModel;
      this.treeModel.update();
      this.onClose = new Subject();
    }

    obtenerDatosJerarquia(codigo: string){
      
      this.objetoArbolSeleccionado = [];
      if(this.listaArbol.length > 0){
        for(let i:number=0; this.listaArbol.length > i; i++){
          let objetoArbol = this.listaArbol[i];
          if(objetoArbol.id == codigo){
            this.objetoArbolSeleccionado = objetoArbol;
            this.activarSeleccionar = false;
            break;
          } else {
            if(objetoArbol.children != null){
              let encontrado: boolean = false;
              for(let j:number=0; objetoArbol.children.length > j; j++){
                let objetoHijo = objetoArbol.children[j];
                if(objetoHijo.id == codigo){
                  this.objetoArbolSeleccionado = objetoHijo;
                  encontrado = true;
                  break;
                } else {
                  if(objetoHijo.children != null){
                    for(let k:number=0; objetoHijo.children.length > k; k++){
                      let objetoHijo2 = objetoHijo.children[k];
                      if(objetoHijo2.id == codigo){
                        this.objetoArbolSeleccionado = objetoHijo2;
                        encontrado = true;
                        break;
                      }
                    }
                    if(encontrado){
                      break;
                    }
                  }
                }
              }
              if(encontrado){
                this.activarSeleccionar = false;
                break;
              }
            }
          }
        }
      }
    }

    OnSeleccionar(){
      
      let objeto: RelacionCoordinador = new RelacionCoordinador();
      if(this.objetoArbolSeleccionado.id != null){
        if(this.tipoBandeja == Constante.TIPO_JERARQUIA_GERENCIA){
          objeto.idGerencia = this.objetoArbolSeleccionado.id;
          objeto.descripcionGerencia = this.objetoArbolSeleccionado.nombre;
        } else if (this.tipoBandeja == Constante.TIPO_JERARQUIA_ALCANCE){
          objeto.idAlcance = this.objetoArbolSeleccionado.id;
          objeto.descripcionAlcance = this.objetoArbolSeleccionado.nombre;
          if(objeto.idAlcance == 0){
            objeto.indicadorSinAlcance = 1;
          } else {
            objeto.indicadorSinAlcance = 0;
          }
        }
      }
      this.onClose.next(objeto);
      this.bsModalRef.hide();
    }

    cambiarLista(){
      this.treeModel.expandAll();
    }
  
    OnCancelar(){
      this.bsModalRef.hide();
    }

    controlarError(error) {
      console.error(error);
      this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
}
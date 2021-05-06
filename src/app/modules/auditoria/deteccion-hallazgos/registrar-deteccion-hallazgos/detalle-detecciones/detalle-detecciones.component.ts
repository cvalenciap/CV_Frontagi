
import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { BsLocaleService, BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ListaVerificacionMockService as ListaVerificacionService } from './../../../../../services/index';
//import { ListaVerificacion } from 'src/app/models/listaverificacion';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent } from 'angular-tree-component';
import { interval } from 'rxjs';

import { ListaVerificacionAuditor } from 'src/app/models/listaverificacionauditor';
import { ModalRechazoListaComponent } from '../../../listaverificacion/modales/modal-rechazo-lista/modal-rechazo-lista.component';
declare var jQuery: any;



@Component({
  selector: 'app-detalle-detecciones',
  templateUrl: './detalle-detecciones.component.html',
  styleUrls: ['./detalle-detecciones.component.scss']
})
export class DetalleDeteccionesComponent implements OnInit {


  @ViewChild('tree') treeComponent: TreeComponent;
  listaVerificacionForm: FormGroup;
  loading: boolean;
  private sub: any;
  itemCodigo: string;
  itemEstado: string;
  item: ListaVerificacionAuditor;
  listaAuditados: any[];
  selectedAuditadoRow: number;
  selectedAuditado: any;
  textoDetalle: string;
  nodosRequisitos: string;
  datoRequisito: any;
  mostrarDatosRequisito: boolean;
  textoPreguntas: string;
  suscripcion: any;
  bsModalRef: BsModalRef;

  selectedRow: number;

  nodes = [
    {
      id: 1,
      nombre: 'root1',
      children: [
        { id: 2, nombre: 'child1' },
        { id: 3, nombre: 'child2' },
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

          if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);

        },
        click: (tree, node, $event) => {
          if (!node.isRoot) {
            this.obtenerDatosRequisito(node.data.id);
            TREE_ACTIONS.TOGGLE_ACTIVE(tree, node, $event);
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
    //useVirtualScroll: true,
    animateExpand: true,
    //scrollOnActivate: true,
    animateSpeed: 30,
    animateAcceleration: 1.2,
    //scrollContainer: document.documentElement // HTML    
  }

  constructor(
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: ListaVerificacionService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) {

    this.selectedRow = -1;
  }

  ngAfterViewInit() {
    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

  ngOnInit() {

    this.item = new ListaVerificacionAuditor();
    this.mostrarDatosRequisito = false;
    this.listaAuditados = [];


    this.sub = this.route.params.subscribe(params => {

      this.itemCodigo = params['codigo'];
      this.itemEstado = params['estado'];
      this.obtenerDatos(this.itemCodigo);
      this.obtenerNodosRequisitos();
    });

    this.crearFormulario();

    this.textoDetalle = "La Organización debe de llevar a cabo Auditorías Internas a Intervlos planificado \nB)S ha implementado y se mantiene de manera eficaz, se debe planificar un programa de Auditoría"
  }


  crearFormulario() {
    this.listaVerificacionForm = this.formBuilder.group({
      descripcionAuditoria: new FormControl(""),
      nrolv: new FormControl(""),
      tipoListaVerificacion: new FormControl(""),
      descripcionEntidad: new FormControl(""),
      auditor: new FormControl("")
    })
  }

  seleccionAuditado(index, obj) {
    this.selectedAuditadoRow = index;
    this.seleccionAuditado = obj;
  }

  obtenerDatos(codigo: string) {
    this.service.buscarPorCodigo(this.itemCodigo).subscribe(
      (response: Response) => {
        this.item = response.resultado;
      }
    )
  }

  obtenerNodosRequisitos() {
    this.loading = true;
    this.service.obtenerRequisitosAuditoria(1).subscribe(
      (response: Response) => {

        this.nodosRequisitos = response.resultado;
        this.treeComponent.treeModel.update();
        this.loading = false;
      },
      (error) => this.controlarError(error),
    );

  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  obtenerDatosRequisito(codigo: string) {
    this.loading = true;
    this.service.obtenerDatosRequisitos(codigo).subscribe(
      (response: Response) => {
        this.datoRequisito = response.resultado;
        this.convertirTexto(this.datoRequisito.preguntasRequisito);
        this.mostrarDatosRequisito = true;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    )
  }

  convertirTexto(lista: any[]) {
    this.textoPreguntas = "";
    let i: number = 1;
    lista.forEach(obj => {
      this.textoPreguntas = this.textoPreguntas + i + ".- " + obj.descripcionPregunta + "\n";
      i++;
    });
  }

  expandirArbol() {
    this.treeComponent.treeModel.expandAll();
  }

  rechazar() {

    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {

      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalRechazoListaComponent, config);
    (<ModalRechazoListaComponent>this.bsModalRef.content).onClose.subscribe(result => {
      if (result) {

        this.toastr.success('Registro rechazado', 'Acción completada!', { closeButton: true });
        this.router.navigate([`auditoria/lista-verificacion`]);
      }
    });

  }

  aprobar() {

  }

  grabar() {

  }

  OnRegresar() {
    this.router.navigate([`auditoria/lista-verificacion`]);
  }


}

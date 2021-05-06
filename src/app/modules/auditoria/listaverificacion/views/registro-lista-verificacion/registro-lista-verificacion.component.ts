import { Component, OnInit, ViewChild, AfterContentInit } from '@angular/core';
import { BsLocaleService, BsModalService, ModalOptions, BsModalRef } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ListaVerificacionMockService,ListaVerificacionService, PlanAuditoriaMockService} from './../../../../../services/index';
//import { ListaVerificacion } from 'src/app/models/listaverificacion';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Response } from './../../../../../models/response';
import { ITreeOptions, TREE_ACTIONS, KEYS, TreeComponent, TreeModel } from 'angular-tree-component';
import { interval, forkJoin } from 'rxjs';
import { ModalRechazoListaComponent } from '../../modales/modal-rechazo-lista/modal-rechazo-lista.component';
import { ListaVerificacionAuditor } from 'src/app/models/listaverificacionauditor';
import { ModalBusquedaColaboradorComponent } from 'src/app/components/common/modal/modal-busqueda-colaborador/modal-busqueda-colaborador.component';
import { Trabajador } from 'src/app/models/trabajador';
import { ListaVerificacionAuditado } from 'src/app/models/listaverificacionauditado';
declare var jQuery:any;

@Component({
  selector: 'app-registro-lista-verificacion',
  templateUrl: './registro-lista-verificacion.component.html',
  styleUrls: ['./registro-lista-verificacion.component.scss']
})
export class RegistroListaVerificacionComponent implements OnInit{
  

  @ViewChild('tree') treeComponent: TreeComponent;

  listaVerificacionForm:FormGroup;

  loading:boolean;

  private sub: any;
  itemCodigo:string;
  itemEstado:string;

  cuestionarioRequisito:string;
  cuestionario:string;
  descripcionAuditoria:string;
  tipoLV:string;
  area:string;
  jefeEquipo:string;

  item:ListaVerificacionAuditor;

  listaAuditados:ListaVerificacionAuditado[];
  listaAuditadosAux:ListaVerificacionAuditado[];

  selectedAuditadoRow:number;
  selectedAuditado:any;

  textoDetalle:string;

  nodosRequisitos:any[];

  datoRequisito:any;

  mostrarDatosRequisito:boolean;

  textoPreguntas:string;

  suscripcion:any;

  listaComites:any[];
  listaGerencias:any[];
  listaEquipos:any[];
  listaCargos:any[];

  tipoRol:string // 1:Auditor 2:Auditor Lider

  bsModalRef:BsModalRef;

  treeModel:TreeModel;

  nodes = [
    {id: 1, nombre: 'ISO 9001-2015', 
    children: [ 
                { id: 2, nombre: '4.2 Comprensión de las necesidades y expectativas de las partes interesadas'},
                { id: 3, nombre: '4.4 Sistema de Gestion de la Calidad y sus Procesos'},
                { id: 4, nombre:'5.2.1 Establecimiento de la Politica de la Calidad' }
              ]
    },
    {id: 5, nombre: 'ISO 14001-2015', 
    children: [ 
                { id: 7, nombre: '4.4 Sistema de Gestión Ambiental'}
              ]
    },
    {id: 8, nombre: 'ISO 9001-2015 / ISO 14001-2015', 
    children: [{ id: 9, nombre: '4.1 Comprension de la Organización y su Contexto'}]
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
          if (!node.isRoot) {
            //this.obtenerDatosRequisito(node.data.id);
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


  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: ListaVerificacionMockService,
    private serviceBD: ListaVerificacionService,
    private planAuditoriaService: PlanAuditoriaMockService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { }

    ngAfterViewInit() {
      this.treeModel.expandAll()
    }

  ngOnInit() {

    //<button *ngIf="tipoRol == '2' && (item.estadoListaVerificacion == '3' || item.estadoListaVerificacion == '4')"
    //<button *ngIf="tipoRol == '2' && (item.estadoListaVerificacion == '3' || item.estadoListaVerificacion == '4')"
    //<button *ngIf="tipoRol == '1' && !(item.estadoListaVerificacion == '3' || item.estadoListaVerificacion == '4')"
    //<button *ngIf="tipoRol == '1' && !(item.estadoListaVerificacion == '3' || item.estadoListaVerificacion == '4')"

    this.tipoRol = localStorage.getItem('tipoRol');
    
    this.selectedAuditadoRow = -1;
    this.item = new ListaVerificacionAuditor();
    this.mostrarDatosRequisito = true;
    this.treeModel = this.treeComponent.treeModel;
    this.nodosRequisitos = [];
    this.nodosRequisitos = this.nodes;
    this.cuestionarioRequisito="La Norma ISO 9001:2015 elaborada por la Organización Internacional para la Estandarización (International Standarization Organization o ISO por sus siglas en inglés), determina los requisitos para un Sistema de Gestión de la Calidad, que pueden utilizarse para su aplicación interna por las organizaciones, sin importar si el producto y/o servicio lo brinda una organización pública o empresa privada.";
    this.cuestionario = "¿En que documento podremos ver la interacion de procesos de toda su jurisdicción?"+'\n'+
                        "¿De que manera aseguran la disponibilidad de recursos necesarios para el sistema de gestion de calidad?"+'\n'+
                        "¿Qui criterios de evalución han usado?"+'\n'+
                        "¿Cuantas personas conforman su equipo?"+'\n'+
                        "¿Cree usted que promueve la interación del proceso?";
    this.descripcionAuditoria = "Auditoria Interna de la Gerencia de Finanzas II";
    this.tipoLV ="Normal";
    this.area="EQUIPO PLANEAMIENTO FÍSICO Y PRE INVERSIÓN";
    this.jefeEquipo = "GUILLERMO CUADROS CAPILLA";
    this.listaAuditados = [];
    this.listaAuditadosAux = [];
    this.listaGerencias = [];
    this.listaEquipos = [];
    this.listaCargos = [];
    this.listaComites = [];
    this.obtenerParametros();
    


     this.sub = this.route.params.subscribe(params => {
        this.itemCodigo = params['codigo'];
       

        //this.obtenerDatos(this.itemCodigo);

        console.log(this.itemCodigo);



        //this.obtenerNodosRequisitos();
    }); 

    this.crearFormulario();
    this.treeModel.expandAll()
    this.textoDetalle = "La Organización debe de llevar a cabo Auditorías Internas a Intervlos planificado \nB)S ha implementado y se mantiene de manera eficaz, se debe planificar un programa de Auditoría"
  }


  crearFormulario(){
    this.listaVerificacionForm = this.formBuilder.group({
      descripcionAuditoria: new FormControl(""),
      nrolv: new FormControl(""),
      tipoListaVerificacion: new FormControl(""),
      descripcionEntidad: new FormControl(""),
      auditor: new FormControl("")
    })
  }

  seleccionarAuditado(index, obj){
    this.selectedAuditadoRow = index;
    this.selectedAuditado = obj;
  }

  /* obtenerDatos(codigo:string){
    this.serviceBD.buscarPorCodigo(codigo).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        
        console.log(this.nodosRequisitos);
        console.log(this.item);
        if(this.item.valorEntidad == "1"){
          let gerencia = this.listaGerencias.find(obj => obj.valorGerencia == this.item.codigoGerencia);
          this.item.descripcionEntidad = gerencia.descripcionGerencia;
        }else if(this.item.valorEntidad == "2"){
          let equipo = this.listaEquipos.find(obj => obj.valorEquipo == this.item.codigoEquipo);
          this.item.descripcionEntidad = equipo.descripcionEquipo;
        }else if(this.item.valorEntidad == "3"){
          let cargo = this.listaCargos.find(obj => obj.valorCargo == this.item.codigoCargo);
          this.item.descripcionEntidad = cargo.descripcionCargo;
        }else if(this.item.valorEntidad == "4"){
          let comite = this.listaComites.find(obj => obj.valorComite == this.item.codigoComite);
          this.item.descripcionEntidad = comite.descripcionComite;
        }

        if(this.item.listaAuditadosLV.length>0){
          for(let i:number = 0; this.item.listaAuditadosLV.length>i; i++){
            this.listaAuditados.push(Object.assign({},this.item.listaAuditadosLV[i]));
          }

          for(let i:number = 0; this.item.listaAuditadosLV.length>i; i++){
            this.listaAuditadosAux.push(Object.assign({},this.item.listaAuditadosLV[i]));
          }
        }
        

      
        //Llenar ARBOL
        this.nodosRequisitos = this.item.listaNodosRequisitoLV;
        this.treeModel.update();


      }
    )
  } */

  obtenerNodosRequisitos(){
    this.loading = true;
    this.service.obtenerRequisitosAuditoria(1).subscribe(
      (response:Response) => {
        this.nodosRequisitos = response.resultado;
        this.treeComponent.treeModel.update();
        const source = interval(500);
        const subscribe = source.subscribe(val => this.treeComponent.treeModel.expandAll());
        this.loading = false;
    },
    (error) => this.controlarError(error),
    );
    
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  obtenerDatosRequisito(codigo: string){
   let objetoRequisito = this.item.listaRequisitosLV.find(obj => obj.idLVRequisito == +codigo)
   this.datoRequisito = objetoRequisito;
   //console.log(this.datoRequisito);
   this.mostrarDatosRequisito = true;
  }

  convertirTexto(lista:any[]){
    this.textoPreguntas = "";
    let i:number = 1;
    lista.forEach(obj => {
      this.textoPreguntas = this.textoPreguntas + i + ".- " + obj.descripcionPregunta + "\n";
      i++;
  });
  }

  expandirArbol(){
    this.treeComponent.treeModel.expandAll();
  }

  rechazar(){
    
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalRechazoListaComponent, config);
    (<ModalRechazoListaComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.loading = true;
      this.item.sustentoRechazo = result;
      this.serviceBD.rechazarListaVerificacion(this.item).subscribe((response:Response) => {
        this.loading = false;
        this.toastr.success('Lista de Verificación Rechazada', 'Acción completada!', {closeButton: true});
        this.router.navigate([`auditoria/lista-verificacion`]);
      },
      (error) => this.controlarError(error))

    });
  
  }

  aprobar(){
    this.loading = true;
      this.serviceBD.aprobarListaVerificacion(this.item).subscribe((response:Response) => {
        this.loading = false;
        this.toastr.success('Lista de Verificación Aprobada', 'Acción completada!', {closeButton: true});
        this.router.navigate([`auditoria/lista-verificacion`]);
      },
      (error) => this.controlarError(error))
  }

  aprobarGrabaciones(){
    this.loading = true;
    this.item.listaAuditadosLV = this.listaAuditadosAux;
    this.item.estadoListaVerificacion = "3";
    this.serviceBD.actualizarListaVerificacion(this.item).subscribe((response:Response) => {
      this.loading = false;
      this.toastr.success('Lista de Verificación En Revisión', 'Acción completada!', {closeButton: true});
      this.router.navigate([`auditoria/lista-verificacion`]);
    },
    (error) => this.controlarError(error))
  }

  grabar(){
    this.loading = true;
    this.item.listaAuditadosLV = this.listaAuditadosAux;
    this.item.estadoListaVerificacion = "2";
    this.serviceBD.actualizarListaVerificacion(this.item).subscribe((response:Response) => {
      this.loading = false;
      this.toastr.success('Registro actualizado', 'Acción completada!', {closeButton: true});
      this.router.navigate([`auditoria/lista-verificacion`]);
    },
    (error) => this.controlarError(error))

  }

  verDocumento(){

  }

  OnRegresar(){
    this.router.navigate([`auditoria/lista-verificacion`]);
  }

  irListaVerificacion(){
    this.router.navigate([`auditoria/lista-verificacion`]);
  }

  cambiarLista(){
    this.treeModel.expandAll();
  }


  agregarAuditado(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          
      },
      class: 'modal-lg-trabajadores'
    }

    this.bsModalRef = this.modalService.show(ModalBusquedaColaboradorComponent, config);
    (<ModalBusquedaColaboradorComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let dato:Trabajador = result;
      if(!this.validaAuditados(this.listaAuditados,dato)){

        let auditado = this.listaAuditadosAux.find(obj => obj.trabajador.idTrabajador == dato.idTrabajador);
        if(auditado != undefined && auditado != null){
          auditado.estadoRegistro = "1";
          this.listaAuditados.push(auditado);
        }else{
          let listaVerificacionAuditado:ListaVerificacionAuditado = new ListaVerificacionAuditado();
          listaVerificacionAuditado.trabajador = dato;
          listaVerificacionAuditado.estadoRegistro = "1";
          this.listaAuditados.push(listaVerificacionAuditado);
          this.listaAuditadosAux.push(listaVerificacionAuditado);
        }

        

        console.log(this.listaAuditados);
        console.log(this.listaAuditadosAux);
      }

      
  });
  }

  validaAuditados(lista:ListaVerificacionAuditado[],dato:Trabajador):boolean{
   let variable =  lista.find(obj => obj.trabajador.idTrabajador == dato.idTrabajador);
   if(variable == undefined || variable == null){
     return false;
   }else{
     return true;
   }
  }

  eliminarAuditado(indiceAuditado:number,item:ListaVerificacionAuditado){

    let indice:number;

    for(let i:number = 0; i<this.listaAuditadosAux.length;i++){
      if(this.listaAuditadosAux[i].trabajador.idTrabajador == item.trabajador.idTrabajador){
        indice = i;
        break;
      }
    }

    if(indice != undefined){
      this.listaAuditados.splice(indiceAuditado,1);
      this.listaAuditadosAux[indice].estadoRegistro = "0";
      this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
      this.selectedAuditadoRow = -1;
    }


    console.log(this.listaAuditados);
    console.log(this.listaAuditadosAux);

    

    
  }



  obtenerParametros(){
    //let buscaEstados = this.service.obtenerEstados();
   
    let buscaEntidades = this.planAuditoriaService.obtenerEntidades();

    forkJoin(buscaEntidades).subscribe(
      ([buscaEntidades]:[Response]) => {
      this.listaComites = buscaEntidades.resultado.listaComites;
      this.listaGerencias = buscaEntidades.resultado.listaGerencias;
      this.listaEquipos = buscaEntidades.resultado.listaEquipos;
      this.listaCargos = buscaEntidades.resultado.listaCargos;
    },
    (error) => this.controlarError(error)); 
  }



}

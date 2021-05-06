import { Component, OnInit, ViewChild } from '@angular/core';
import { FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { BsLocaleService, BsModalService, defineLocale, esLocale, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from './../../../../../models/response';
import { RegistroHallazgoMockService, RegistroHallazgosService, ListaVerificacionService, PlanAuditoriaMockService, GeneralService} from './../../../../../services/index';
import { Hallazgo } from 'src/app/models/hallazgo';
import { Auditor } from 'src/app/models/auditor';
import { TREE_ACTIONS, KEYS, ITreeOptions, TreeComponent, TreeModel } from 'angular-tree-component';
import { forkJoin, interval } from 'rxjs';
import { RequisitoHallazgo } from 'src/app/models/requisitoHallazgo';
import { MensajeGeneral, FormatoCarga, NombreParametro } from 'src/app/constants/general/general.constants';
import { Trabajador } from 'src/app/models/trabajador';
import { ModalBusquedaColaboradorComponent } from 'src/app/components/common/modal/modal-busqueda-colaborador/modal-busqueda-colaborador.component';
import { ListaVerificacionAuditor } from 'src/app/models/listaverificacionauditor';
import { ListaVerificacionAuditado } from 'src/app/models/listaverificacionauditado';
import { HallazgoRequisito } from 'src/app/models/hallazgoRequisito';
import { ModalRechazoRevisionHallazgosComponent } from '../../modales/modal-rechazo-revision-hallazgos/modal-rechazo-revision-hallazgos.component';
declare var jQuery:any;

@Component({
  selector: 'app-registro-hallazgos',
  templateUrl: './registro-hallazgos.component.html',
  styleUrls: ['./registro-hallazgos.component.scss']
})
export class RegistroHallazgosComponent implements OnInit {

  @ViewChild('tree') treeComponent: TreeComponent;

  registroHallazgoForm: FormGroup;

  loading:boolean;
  cuestionarioRequisito:string;
  cuestionario:string;
  descripcionAuditoria:string;
  tipoLV:string;
  area:string;
  valorCali:string;

  item:ListaVerificacionAuditor;
  itemCodigo:string;
  itemEstado:string;

  listaAuditores:Auditor[];
  listaCriterios:any[];
  listanormas:any[];
  listaTiposHallazgos:any[];


  listaAuditados:ListaVerificacionAuditado[];
  listaAuditadosAux:ListaVerificacionAuditado[];

  textoAuditores:string;

  nodosRequisitos:any[];
  datoRequisito:any;
  textoPreguntas:string;
  mostrarDatosRequisito:boolean;
  mostrarCamposNoConforme:boolean;

  selectedAuditado:any;
  selectedAuditadoRow:number;

  nombreArchivoEvidencia:string;

  textoDescripcion:string;

  private sub:any;

  textoRequisitoRelacionado:string;

  prueba:any;

  tipoRol:string;

  treeModel:TreeModel;


  listaComites:any[];
  listaGerencias:any[];
  listaEquipos:any[];
  listaCargos:any[];

  datatemp : any[];

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
     actionMapping: {
       mouse: {
         dblClick: (tree, node, $event) => {
           if (node.hasChildren) TREE_ACTIONS.TOGGLE_EXPANDED(tree, node, $event);

         },
         click: (tree,node, $event) => {
          if(!node.isRoot){
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
    private service: RegistroHallazgoMockService,
    private serviceBD: RegistroHallazgosService,
    private serviceLV:ListaVerificacionService,
    private planAuditoriaService:PlanAuditoriaMockService,
    private generalService:GeneralService,
    private modalService: BsModalService,
    private formBuilder: FormBuilder) { 
      this.crearFormulario();
      this.listaCriterios = [];
      this.listanormas = [];
      this.listaTiposHallazgos = [];
      this.valorCali = null;
      this.selectedAuditadoRow = -1;
      defineLocale('es', esLocale);
      this.localeService.use('es');
    }

    ngAfterViewInit() {
      // Add slimscroll to element
     /*  jQuery('.full-height-scroll').slimscroll({
        height: '100%'
      }); */

      this.treeModel.expandAll()
    }

  ngOnInit() {
    this.tipoRol = localStorage.getItem("tipoRolRH");
    this.item = new ListaVerificacionAuditor();
    this.treeModel = this.treeComponent.treeModel;
    this.textoRequisitoRelacionado = "";
    this.mostrarCamposNoConforme = false;
    this.textoDescripcion = "Descripción";
    this.nodosRequisitos = [];
    this.nodosRequisitos = this.nodes;
    this.listaAuditados = [];
    this.listaAuditadosAux = [];
    this.listaGerencias = [];
    this.listaEquipos = [];
    this.listaCargos = [];
    this.listaComites = [];
    this.mostrarDatosRequisito = true;

    
    this.cuestionarioRequisito="La Norma ISO 9001:2015 elaborada por la Organización Internacional para la Estandarización (International Standarization Organization o ISO por sus siglas en inglés), determina los requisitos para un Sistema de Gestión de la Calidad, que pueden utilizarse para su aplicación interna por las organizaciones.";
    this.cuestionario = "¿En que documento podremos ver la interacion de procesos de toda su jurisdicción?"+'\n'+
                        "¿De que manera aseguran la disponibilidad de recursos necesarios para el sistema de gestion de calidad?"+'\n'+
                        "¿Qui criterios de evalución han usado?"+'\n'+
                        "¿Cuantas personas conforman su equipo?"+'\n'+
                        "¿Cree usted que promueve la interación del proceso?";
    this.descripcionAuditoria = "Auditoria Interna de la Gerencia de Finanzas II";
    this.tipoLV ="ELIAS MINAYA MENDEZ";
    this.area="EQUIPO PLANEAMIENTO FÍSICO Y PRE INVERSIÓN";

    this.obtenerEntidades();

    this.sub = this.route.params.subscribe(params => {
        this.itemCodigo = params['codigo'];
       

        //this.obtenerDatos(this.itemCodigo);
        //this.obtenerAuditores();
        //this.obtenerNodosRequisitos();
        this.obtenerParametros(this.itemCodigo);

        console.log(this.itemCodigo);


    });
    
  }

  crearFormulario(){
    this.registroHallazgoForm = this.formBuilder.group({
      descripcionAuditoria:new FormControl(''),
      nrolv:new FormControl(''),
      descripcionEntidad:new FormControl(''),
      responsable:new FormControl(''),
      auditores:new FormControl('')
    })
  }

  /* obtenerDatos(codigo:string){
    this.serviceLV.buscarPorCodigo(codigo).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        
        this.item.listaRequisitosLV.forEach(obj => {
          if(obj.hallazgo != null && obj.hallazgo != undefined){
            if(obj.hallazgo.fechaHallazgo != null && obj.hallazgo.fechaHallazgo!= undefined){
              obj.hallazgo.fechaHallazgo = new Date(obj.hallazgo.fechaHallazgo);
            }
          }
        });
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

  obtenerAuditores(){
    this.service.obtenerAuditoresHallazgo("1").subscribe(
      (response:Response) => {
        
        this.listaAuditores = response.resultado;
        console.log(this.listaAuditores);
        this.convertirTextoAuditores(this.listaAuditores);
      }
    )
  }

  obtenerNodosRequisitos(){
    this.loading = true;
    this.service.obtenerRequisitosAuditoria("1").subscribe(
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

  obtenerDatosRequisito(codigo: string){
    /*
    this.loading = true;
    this.service.obtenerDatosRequisitos(codigo).subscribe(
      (response:Response) => {
        this.datoRequisito = response.resultado;
        this.datoRequisito.listaAuditados = [];
        console.log(this.datoRequisito);
        this.convertirTexto(this.datoRequisito.preguntasRequisito);
        this.convertirTextoRequisitoRelacionado(this.datoRequisito.listaRequisitosRelacionados);
        this.mostrarDatosRequisito = true;
        if(this.datoRequisito.calificacion == "1"){
          this.mostrarCamposNoConforme = true;
          this.textoDescripcion = "Descripción del Hallazgo";
        }else{
          this.mostrarCamposNoConforme = false;
          this.textoDescripcion = "Descripción";
        }
        this.loading = false;
      },
      (error) => this.controlarError(error)
    )
    */
   let objetoRequisito = this.item.listaRequisitosLV.find(obj => obj.idLVRequisito == +codigo)
   if(objetoRequisito.hallazgo == undefined || objetoRequisito.hallazgo == null){
     objetoRequisito.hallazgo = new HallazgoRequisito();
   }
   this.datoRequisito = objetoRequisito;
   if(this.datoRequisito.valorCalificacion == "01"){
    this.mostrarCamposNoConforme = true;
    this.textoDescripcion = "Descripción del Hallazgo";
  }else{
    this.mostrarCamposNoConforme = false;
    this.textoDescripcion = "Descripción";
  }
   
   console.log(this.datoRequisito);
   this.mostrarDatosRequisito = true;
  }

  convertirTexto(lista:any[]){
    this.textoPreguntas = "";
    let i:number = 1;
    lista.forEach(obj => {
      this.textoPreguntas = this.textoPreguntas + i + ".- " + obj.descripcionPregunta + "\n";
      i++;
    });

    console.log(this.textoPreguntas);
  }

  convertirTextoAuditores(lista:any[]){
    let cantidad:number = lista.length;
    let i:number = 0;
    this.textoAuditores = "";
    lista.forEach(obj => {
      i++;
      this.textoAuditores = this.textoAuditores + " " + obj.nombreAuditor;
      if(cantidad>i){
        this.textoAuditores = this.textoAuditores + " / "
      }
      console.log(obj.nombreAuditor);
    })
  }

  convertirTextoRequisitoRelacionado(lista:any[]){
    this.textoRequisitoRelacionado = "";
    lista.forEach(obj => {
      this.textoRequisitoRelacionado = this.textoRequisitoRelacionado + obj.descripcion + "\n";
    })
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error(MensajeGeneral.mensajeErrorServicio, 'Error', {closeButton: true});
  }
  
  obtenerParametros(codigo: string) {
    //const buscaCriterios = this.service.obtenerCriterios();
    this.listaCriterios = [
      { valorCriterio: "01", descripcionCriterio: "Conforme" },
      { valorCriterio: "02", descripcionCriterio: "No Conforme" }

    ];

    this.listanormas = [
      { valorCriterio: "01", descripcionCriterio: "ISO 9001-2015" },
      { valorCriterio: "02", descripcionCriterio: "ISO 14001-2015" }

    ];

    //let buscaCriterios = this.serviceBD.obtenerCriterios(codigo);
    let buscaTiposHallazgos = this.generalService.obtenerParametroPadre(NombreParametro.listaTiposHallazgos);

    /* forkJoin(buscaCriterios, buscaTiposHallazgos)
      .subscribe(([buscaCriterios, buscaTiposHallazgos]: [Response, Response]) => { */
    forkJoin(buscaTiposHallazgos).subscribe(([buscaTiposHallazgos]: [Response]) => {
        //this.listaCriterios = buscaCriterios.resultado;
        this.listaTiposHallazgos = buscaTiposHallazgos.resultado;
      },
        (error) => this.controlarError(error));

  }

  obtenerEntidades(){
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

  activarCriterio(){
    let index:string;
    //this.datoRequisito.valorCriterio = index;
    if(this.valorCali == "02"){
      this.mostrarCamposNoConforme = true;
      this.textoDescripcion = "Descripción del Hallazgo"
      //this.datoRequisito.hallazgo.tipoHallazgo = "";
    }else{
      this.mostrarCamposNoConforme = false;
      this.textoDescripcion = "Descripción";
    }

/*     if(this.datoRequisito.valorCalificacion == "01"){
      this.mostrarCamposNoConforme = true;
      this.textoDescripcion = "Descripción del Hallazgo"
      this.datoRequisito.hallazgo.tipoHallazgo = "";
    }else{
      this.mostrarCamposNoConforme = false;
      this.textoDescripcion = "Descripción";
    } */
  }

  seleccionarAuditado(index:number,obj:any){
    this.selectedAuditadoRow = index;
    this.selectedAuditado = obj;
  }

  adjuntarArchivo(event:any){
    if(event.target.files.length>0){
      if(FormatoCarga.word == event.target.files[0].type || FormatoCarga.wordAntiguo == event.target.files[0].type){
      this.datoRequisito.archivoEvidencia = event.target.files[0];
      this.nombreArchivoEvidencia = event.target.files[0].name;
      }else{
        this.toastr.warning('Solo se permite archivo Word', 'Atención', {closeButton: true});
      }
    }
  }

  copiarTexto(inputElement){
    inputElement.select();
    document.execCommand('copy');
    inputElement.setSelectionRange(0, 0);
  }

  onRegresar(){
    this.router.navigate([`auditoria/revision-hallazgos`]);
  }

  irRegistroHallazgos(){
    this.router.navigate([`auditoria/revision-hallazgos`]);
  }

  agregarAuditado(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          
      },
      class: 'modal-lg-trabajadores'
    }

    const modal = this.modalService.show(ModalBusquedaColaboradorComponent, config);
    (<ModalBusquedaColaboradorComponent>modal.content).onClose.subscribe(result => {
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

  grabar(){
    this.item.listaAuditadosLV = this.listaAuditadosAux;
    this.item.estadoRevisionHallazgos = "2";
    this.serviceBD.actualizarRevisionHallazgos(this.item).subscribe((response:Response) => {
      this.loading = false;
      this.toastr.success('Registro actualizado', 'Acción completada!', {closeButton: true});
      this.router.navigate([`auditoria/revision-hallazgos`]);
    },
    (error) => this.controlarError(error))
    
  }

  aprobarGrabacion(){
    this.item.listaAuditadosLV = this.listaAuditadosAux;
    this.item.estadoRevisionHallazgos = "3";
    this.serviceBD.actualizarRevisionHallazgos(this.item).subscribe((response:Response) => {
      this.loading = false;
      this.toastr.success('Registro aprobado', 'Acción completada!', {closeButton: true});
      this.router.navigate([`auditoria/revision-hallazgos`]);
    },
    (error) => this.controlarError(error))
  }

  aprobar(){
    this.loading = true;
      this.serviceBD.aprobarRevisionHallazgos(this.item).subscribe((response:Response) => {
        this.loading = false;
        this.toastr.success('Revisión de Hallazgo Aprobado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`auditoria/revision-hallazgos`]);
      },
      (error) => this.controlarError(error))
  }

  rechazar(){
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
          
      },
      class: 'modal-lg'
    }
    let modal = this.modalService.show(ModalRechazoRevisionHallazgosComponent, config);
    (<ModalRechazoRevisionHallazgosComponent>modal.content).onClose.subscribe(result => {
      this.loading = true;
      this.item.sustentoRechazo = result;

      
      this.serviceBD.rechazarRevisionHallazgos(this.item).subscribe((response:Response) => {
        this.loading = false;
        this.toastr.success('Revisión de Hallazgo Rechazado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`auditoria/revision-hallazgos`]);
      },
      (error) => this.controlarError(error))
      

    });
  }

  cambiarLista(){
    this.treeModel.expandAll();
  }



}

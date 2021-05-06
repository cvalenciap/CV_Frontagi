import { Component, OnInit } from '@angular/core';
//import { DetalleProgramacion } from 'src/app/models/detalleprogramacion';
import { Paginacion, Tipo, Parametro } from './../../../../../../app/models';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { ProgramacionAuditoriaMockService, ProgramacionAuditoriaService } from './../../../../../services/index';
//import { ProgramacionAuditoria } from 'src/app/models/programacionauditoria';

import { Programa } from 'src/app/models/programa';
import { Auditoria } from 'src/app/models/auditoria';
import { forkJoin } from 'rxjs';
import { Response } from './../../../../../models/response';
import { Norma } from 'src/app/models/norma';
import { GeneralService } from 'src/app/services/impl/general.service';
import { NombreParametro } from 'src/app/constants/general/general.constants';
import { ModalObservacionProgramacionComponent } from '../../modales/modal-detalle-programacion/modal-observacion-programacion.component';
import { ModalDetalleProgramacionComponent } from '../../modales/modal-detalle-programacion/modal-detalle-programacion.component';



@Component({
  selector: 'app-registro-programacion',
  templateUrl: './registro-programacion.component.html',
  styleUrls: ['./registro-programacion.component.scss']
})
export class RegistroProgramacionComponent implements OnInit {

  fechaProgramacionDefecto: string;
  usuarioCreacionDefecto: string;
  items: Auditoria[];
  listaAuditoriasEliminadas: Auditoria[];
  listaAuditoriasNuevas: Auditoria[];
  textoBusqueda: string;
  parametroBusqueda: string;
  paginacion: Paginacion;
  selectedRow: number;
  loading: boolean;
  itemCodigo: number;
  indicadorProcesado: boolean;
  listaNormas: any[];
  listaMeses: any[];
  listaMesesPrueba: Parametro[];
  listaGerencias: any[]
  listaEquipos: any[]
  listaCargos: any[]
  listaComites: any[]
  selectedObject: Auditoria;
  listaTipos: Tipo[];
  item: Programa;
  private sub: any;
  bsModalRef: BsModalRef;
  fechaCreaDoc1: Date;
  fechaCreaDoc2: Date;
  //item: DocumentoMigracion;

  nuevo: boolean;
  observaciones: string;
  observaciones1: string;
  observaciones2: string;
  observaciones3: string;
  observaciones4: string;
  observaciones5: string;

  //Inicio Prototipo
  mostrarA: boolean;
  mostrarB: boolean;
  mostrarC: boolean;
  mostrarD: boolean;
  mostrarBotonA: boolean;
  mostrarBotonB: boolean;

  todosCheckEne: boolean;
  todosCheckFeb: boolean;
  todosCheckMar: boolean;
  todosCheckAbr: boolean;
  todosCheckMay: boolean;
  todosCheckJun: boolean;
  todosCheckJul: boolean;
  todosCheckAgo: boolean;
  todosCheckSet: boolean;
  todosCheckOct: boolean;
  todosCheckNov: boolean;
  todosCheckDic: boolean;

  checkEne: boolean;
  checkFeb: boolean;
  checkMar: boolean;
  checkAbr: boolean;
  checkMay: boolean;
  checkJun: boolean;
  checkJul: boolean;
  checkAgo: boolean;
  checkSet: boolean;
  checkOct: boolean;
  checkNov: boolean;
  checkDic: boolean;

  //Fin Prototipo

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: ProgramacionAuditoriaMockService,
    private serviceBD: ProgramacionAuditoriaService,
    private generalService: GeneralService,
    private modalService: BsModalService
  ) {

    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.listaMeses = [];
    this.listaNormas = [];
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({ registros: 10 });
    this.observaciones = null;
    this.observaciones1 = null;
    this.observaciones2 = null;
    this.observaciones3 = null;
    this.observaciones4 = null;
    this.observaciones5 = null;

    this.mostrarA = true;
    this.mostrarB = true;
    this.mostrarC = true;
    this.mostrarD = true;
    this.mostrarBotonA = true;
    this.mostrarBotonB = true;

    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;

  }

  ngOnInit() {
    /*  this.item = new Programa();
     this.items = [];
 
     this.obtenerParametros();
 
     this.sub = this.route.params.subscribe(params => {
       
       this.itemCodigo = + params['codigo'];
     });
 
     if (this.itemCodigo) {
       
       this.nuevo = false;
       this.loading = true;
       this.listaAuditoriasEliminadas = [];
       this.listaAuditoriasNuevas = [];
       this.serviceBD.buscarPorCodigo(this.itemCodigo).subscribe(
         (response: Response) => {
           this.item = response.resultado
           if (this.item.fechaPrograma != null && this.item.fechaPrograma != undefined) {
             this.item.fechaPrograma = new Date(this.item.fechaPrograma);
           }
           // 
           if (this.item.procesoPrograma == "2") {
             this.indicadorProcesado = true;
           } else {
             this.indicadorProcesado = false;
           }
           console.log(this.item);
           this.serviceBD.buscarDetalleProgramacion(this.item.idPrograma).subscribe(
             (response: Response) => {
               this.items = response.resultado;
               console.log(this.items);
               for (let i: number = 0; this.items.length > i; i++) {
 
                 if (this.items[i].gerencia != undefined && this.items[i].gerencia != null) {
                   console.log(this.items[i].gerencia);
                   console.log(this.listaGerencias);
                   let obj = this.listaGerencias.find(obj => obj.valorGerencia == this.items[i].gerencia);
                   console.log(obj);
                   this.items[i].descripcionEntidad = obj.descripcionGerencia;
                 } else if (this.items[i].equipo != undefined && this.items[i].equipo != null) {
                   let obj = this.listaEquipos.find(obj => obj.valorEquipo == this.items[i].equipo);
                   this.items[i].descripcionEntidad = obj.descripcionEquipo;
                 } else if (this.items[i].cargo != undefined && this.items[i].cargo != null) {
                   let obj = this.listaCargos.find(obj => obj.valorCargo == this.items[i].cargo);
                   this.items[i].descripcionEntidad = obj.descripcionCargo;
                 } else if (this.items[i].comite != undefined && this.items[i].comite != null) {
                   let obj = this.listaComites.find(obj => obj.valorComite == this.items[i].comite);
                   this.items[i].descripcionEntidad = obj.descripcionComite;
                 } else {
                   this.items[i].descripcionEntidad = "";
                 }
 
 
                 let textoNormas: string = "";
                 let cantidadNormas: number = this.items[i].listaNormas.length;
                 let contador: number = 0;
                 this.items[i].listaNormas.forEach(obj => {
                   contador++;
                   textoNormas = textoNormas + "" + obj.descripcionNorma;
                   if (contador < cantidadNormas) {
                     textoNormas = textoNormas + " / ";
                   }
                 });
 
                 this.items[i].descripcionNorma = textoNormas;
 
                 this.items.forEach(objeto => {
                   let objetoMes = this.listaMeses.find(obj => obj.v_campcons1 == objeto.mes);
                   objeto.descripcionMes = objetoMes.v_valcons;
                 })
 
               }
               // this.paginacion = new Paginacion(response.paginacion);
               this.loading = false;
             },
             (error) => this.controlarError(error)
           )
         },
         //    (error) => this.controlarError(error)
       );
     } else {
       //this.item = this.service.crear();
       //this.item.tipo = this.listaTipos[0];
       this.nuevo = true;
       this.item = new Programa();
       this.item.fechaPrograma = new Date();
       this.item.datosAuditoria.usuarioCreacion = "CWONG";
       this.indicadorProcesado = false;
 
       
       this.loading = true;
       this.service.buscarDetalleProgramacion(this.item.idPrograma).subscribe(
         (response: Response) => {
           this.items = response.resultado;
           for(let i:number=0; this.items.length> i; i++){
             this.items[i].descripcionEntidad = (this.items[i].gerencia != undefined)?this.items[i].gerencia:
                                               ((this.items[i].equipo != undefined)?this.items[i].equipo:
                                               ((this.items[i].cargo != undefined)?this.items[i].cargo:
                                               ((this.items[i].comite != undefined)?this.items[i].comite:"")));
             for(let j:number=0; this.listaNormas.length > j; j++){
               if(this.listaNormas[j].valorNorma == this.items[i].idNorma){
                 this.items[i].descripcionNorma = this.listaNormas[j].descripcionNorma;
                 break;
               }
             }                              
           }
           this.paginacion = new Paginacion(response.paginacion);
           this.loading = false; },
       (error) => this.controlarError(error)
       )
       
 
     } */

  }

  /*   OnPageChanged(event): void {
      this.paginacion.pagina = event.page;
      this.getLista();
    }
    OnPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
      this.getLista();
    } */

  OnBuscar(): void {
    /* this.paginacion.pagina = 1;
    this.getLista(); */
  }
  OnModificar(): void {
    //this.router.navigate([`mantenimiento/rutaresponsables/editar/${this.selectedObject.id}`]);
  }

  /*   getLista(): void {
      this.loading = true;
      this.service.buscarDetalleProgramacion(this.item.idPrograma).subscribe(
        (response: Response) => {
          this.items = response.resultado;
          this.paginacion = new Paginacion(response.paginacion);
          this.loading = false;
        },
        (error) => this.controlarError(error)
      )
    } */


  OnGuardar() {
    /*
        if (this.nuevo) {
          this.serviceBD.registrar(this.item, this.items).subscribe(
            (response: Response) => {
              let respuesta = response.resultado;
              this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
              this.router.navigate([`auditoria/programacion`]);
            },
            (error) => this.controlarError(error)
          );
        } else {
          this.item.procesoPrograma = "1";
          this.serviceBD.modificar(this.item, this.listaAuditoriasEliminadas, this.listaAuditoriasNuevas).subscribe(
            (response: Response) => {
              let respuesta = response.resultado;
              this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
              this.router.navigate([`auditoria/programacion`]);
            },
            (error) => this.controlarError(error)
          )
        } */

  }
  OnRegresar() {
    this.router.navigate([`auditoria/programacion`]);
  }

  /*  irProgramacion() {
     this.router.navigate([`auditoria/programacion`]);
   }
 
   onEliminar(indice: number, item: Auditoria): void {
 
     if (!this.nuevo) {
       let index: number;
       let encontro: boolean = false;
       for (let i: number = 0; i < this.listaAuditoriasNuevas.length; i++) {
         let auditoriaObj = this.listaAuditoriasNuevas[i];
 
         if (auditoriaObj.descripcionEntidad == (item.descripcionEntidad) && (auditoriaObj.mes == item.mes)) {
 
           let listaNormas: Norma[] = auditoriaObj.listaNormas;
 
           let contador: number = 0;
           for (let j: number = 0; j < listaNormas.length; j++) {
 
             for (let k: number = 0; k < item.listaNormas.length; k++) {
               if (listaNormas[j].idNorma == item.listaNormas[k].idNorma) {
                 contador++;
                 break;
               }
             }
           }
           if (contador == item.listaNormas.length) {
             encontro = true;
           }
 
         }
         if (encontro) {
           index = i;
           break;
         }
       }
 
 
       if (encontro) {
         let auditoriaNueva = this.listaAuditoriasNuevas[index];
         this.listaAuditoriasNuevas.splice(index, 1);
       } else {
         this.listaAuditoriasEliminadas.push(item);
       }
     }
 
 
 
 
 
 
     this.items.splice(indice, 1);
 
     this.toastr.info('Registro eliminado', 'Acción completada!', { closeButton: true });
   } */

  /*  OnRowClick(index, obj): void {
     this.selectedRow = index;
     this.selectedObject = obj;
   } */


  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  /* agregarDetalle() {

    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }
    let bsModalRef = this.modalService.show(ModalObservacionProgramacionComponent, config);
    (<ModalObservacionProgramacionComponent>bsModalRef.content).onClose.subscribe(result => {
      
      let listaAuditorias: Auditoria[] = result;

      for (let i: number = 0; listaAuditorias.length > i; i++) {

        let valorEntidad: any;
        if (listaAuditorias[i].gerencia != undefined && listaAuditorias[i].gerencia != "") {

          let objeto = this.listaGerencias.find(obj => obj.valorGerencia == listaAuditorias[i].gerencia);
          valorEntidad = objeto.descripcionGerencia;
        } else if (listaAuditorias[i].equipo != undefined && listaAuditorias[i].equipo != "") {
          let objeto = this.listaEquipos.find(obj => obj.valorEquipo == listaAuditorias[i].equipo);
          valorEntidad = objeto.descripcionEquipo;
        } else if (listaAuditorias[i].cargo != undefined && listaAuditorias[i].cargo != "") {
          let objeto = this.listaCargos.find(obj => obj.valorCargo == listaAuditorias[i].cargo);
          valorEntidad = objeto.descripcionCargo;
        } else if (listaAuditorias[i].comite != undefined && listaAuditorias[i].comite != "") {
          let objeto = this.listaComites.find(obj => obj.valorComite == listaAuditorias[i].comite);
          valorEntidad = objeto.descripcionComite;
        } else {
          valorEntidad = "";
        }


        listaAuditorias[i].descripcionEntidad = valorEntidad;

        let textoNormas: string = "";
        let cantidadNormas: number = listaAuditorias[i].listaNormas.length;
        let contador: number = 0;
        listaAuditorias[i].listaNormas.forEach(obj => {
          contador++;
          textoNormas = textoNormas + "" + obj.descripcionNorma;
          if (contador < cantidadNormas) {
            textoNormas = textoNormas + " / ";
          }
        });

        listaAuditorias[i].descripcionNorma = textoNormas;

        for (let h: number = 0; this.listaMeses.length > h; h++) {
          if (this.listaMeses[h].v_campcons1 == listaAuditorias[i].mes) {
            listaAuditorias[i].descripcionMes = this.listaMeses[h].v_valcons;
            break;
          }
        }
      }

      console.log(this.listaAuditoriasNuevas);
      for (let k: number = 0; listaAuditorias.length > k; k++) {
        this.items.push(listaAuditorias[k]);
        if (!this.nuevo) {
          this.listaAuditoriasNuevas.push(listaAuditorias[k]);
        }

      }


    });

  } */

  /*   procesar() {
      this.item.procesoPrograma = "2";
      this.serviceBD.modificar(this.item, this.listaAuditoriasEliminadas, this.listaAuditoriasNuevas).subscribe(
        (response: Response) => {
          let respuesta = response.resultado;
          this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
          this.router.navigate([`auditoria/programacion`]);
        },
        (error) => this.controlarError(error)
      )
    } */

  /*  obtenerParametros() {
     let buscaNormas = this.serviceBD.obtenerNormas();
     let buscaMeses = this.service.obtenerMeses();
     let buscaEntidades = this.service.obtenerEntidades();
     let buscaMesesP = this.generalService.obtenerParametroPadre(NombreParametro.listaMeses);
 
     forkJoin(buscaNormas, buscaMeses, buscaEntidades, buscaMesesP)
       .subscribe(([buscaNormas, buscaMeses, buscaEntidades, buscaMesesP]: [Response, Response, Response, Response]) => {
         let listaNormasAux = buscaNormas.resultado;
         let listaMesesAux = buscaMesesP.resultado;
 
         for (let i: number = 0; listaNormasAux.length > i; i++) {
           this.listaNormas.push(Object.assign({}, listaNormasAux[i]));
         }
         for (let i: number = 0; listaMesesAux.length > i; i++) {
           this.listaMeses.push(Object.assign({}, listaMesesAux[i]));
         }
         
         this.listaGerencias = buscaEntidades.resultado.listaGerencias;
         this.listaEquipos = buscaEntidades.resultado.listaEquipos;
         this.listaCargos = buscaEntidades.resultado.listaCargos;
         this.listaComites = buscaEntidades.resultado.listaComites;
 
 
         this.listaMesesPrueba = buscaMesesP.resultado;
         console.log(this.listaMesesPrueba);
       },
         (error) => this.controlarError(error));
 
   } */

  //Inicio Prototipo
  agregar() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalDetalleProgramacionComponent, config);
    (<ModalDetalleProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let programacion: any = result;
    });
  }

  agregar1() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalDetalleProgramacionComponent, config);
    (<ModalDetalleProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let programacion: any = result;
    });
  }

  agregar2() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalDetalleProgramacionComponent, config);
    (<ModalDetalleProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let programacion: any = result;
    });
  }

  agregar3() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalDetalleProgramacionComponent, config);
    (<ModalDetalleProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let programacion: any = result;
    });
  }

  agregar4() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalDetalleProgramacionComponent, config);
    (<ModalDetalleProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let programacion: any = result;
    });
  }

  agregar5() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }

    this.bsModalRef = this.modalService.show(ModalDetalleProgramacionComponent, config);
    (<ModalDetalleProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let programacion: any = result;
    });
  }


  abrirObservaciones() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lm'
    }

    this.bsModalRef = this.modalService.show(ModalObservacionProgramacionComponent, config);
    (<ModalObservacionProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.observaciones = result;
    });
  }

  abrirObservaciones1() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lm'
    }

    this.bsModalRef = this.modalService.show(ModalObservacionProgramacionComponent, config);
    (<ModalObservacionProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.observaciones1 = result;
    });
  }

  abrirObservaciones2() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lm'
    }

    this.bsModalRef = this.modalService.show(ModalObservacionProgramacionComponent, config);
    (<ModalObservacionProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.observaciones2 = result;
    });
  }

  abrirObservaciones3() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lm'
    }

    this.bsModalRef = this.modalService.show(ModalObservacionProgramacionComponent, config);
    (<ModalObservacionProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.observaciones3 = result;
    });
  }

  abrirObservaciones4() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lm'
    }

    this.bsModalRef = this.modalService.show(ModalObservacionProgramacionComponent, config);
    (<ModalObservacionProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.observaciones4 = result;
    });
  }

  abrirObservaciones5() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lm'
    }

    this.bsModalRef = this.modalService.show(ModalObservacionProgramacionComponent, config);
    (<ModalObservacionProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      this.observaciones5 = result;
    });
  }


  OnHabilitarAL() {
    this.mostrarA = true;
    this.mostrarB = false;
    this.mostrarC = false;
    this.mostrarD = true;
    this.mostrarBotonA = false;
    this.mostrarBotonB = true;

  }

  OnHabilitarCO() {
    this.mostrarA = false;
    this.mostrarB = true;
    this.mostrarC = false;
    this.mostrarD = false;
    this.mostrarBotonA = true;
    this.mostrarBotonB = false;
  }

  OnHabilitarRAD() {
    this.mostrarA = false;
    this.mostrarB = false;
    this.mostrarC = true;
    this.mostrarD = false;
    this.mostrarBotonA = false;
    this.mostrarBotonB = false;
  }

  seleccionarTodosEne() {
    if (this.todosCheckEne) {
      this.todosCheckEne = false;
      this.checkEne = false;
    } else {
      this.todosCheckEne = true;
      this.checkEne = true;
    }
  }

  seleccionarTodosFeb() {
    if (this.todosCheckFeb) {
      this.todosCheckFeb = false;
      this.checkFeb = false;
    } else {
      this.todosCheckFeb = true;
      this.checkFeb = true;
    }
  }

  seleccionarTodosMar() {
    if (this.todosCheckMar) {
      this.todosCheckMar = false;
      this.checkMar = false;
    } else {
      this.todosCheckMar = true;
      this.checkMar = true;
    }
  }

  seleccionarTodosAbr() {
    if (this.todosCheckAbr) {
      this.todosCheckAbr = false;
      this.checkAbr = false;
    } else {
      this.todosCheckAbr = true;
      this.checkAbr = true;
    }
  }

  seleccionarTodosMay() {
    if (this.todosCheckMay) {
      this.todosCheckMay = false;
      this.checkMay = false;
    } else {
      this.todosCheckMay = true;
      this.checkMay = true;
    }
  }

  seleccionarTodosJun() {
    if (this.todosCheckJun) {
      this.todosCheckJun = false;
      this.checkJun = false;
    } else {
      this.todosCheckJun = true;
      this.checkJun = true;
    }
  }

  seleccionarTodosJul() {
    if (this.todosCheckJul) {
      this.todosCheckJul = false;
      this.checkJul = false;
    } else {
      this.todosCheckJul = true;
      this.checkJul = true;
    }
  }

  seleccionarTodosAgo() {
    if (this.todosCheckAgo) {
      this.todosCheckAgo = false;
      this.checkAgo = false;
    } else {
      this.todosCheckAgo = true;
      this.checkAgo = true;
    }
  }

  seleccionarTodosSet() {
    if (this.todosCheckSet) {
      this.todosCheckSet = false;
      this.checkSet = false;
    } else {
      this.todosCheckSet = true;
      this.checkSet = true;
    }
  }

  seleccionarTodosOct() {
    if (this.todosCheckOct) {
      this.todosCheckOct = false;
      this.checkOct = false;
    } else {
      this.todosCheckOct = true;
      this.checkOct = true;
    }
  }

  seleccionarTodosNov() {
    if (this.todosCheckNov) {
      this.todosCheckNov = false;
      this.checkNov = false;
    } else {
      this.todosCheckNov = true;
      this.checkNov = true;
    }
  }

  seleccionarTodosDic() {
    if (this.todosCheckDic) {
      this.todosCheckDic = false;
      this.checkDic = false;
    } else {
      this.todosCheckDic = true;
      this.checkDic = true;
    }
  }

  //Fin Prototipo



}

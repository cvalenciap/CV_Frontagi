import { Component, OnInit } from '@angular/core';
import { Subject, Observable, forkJoin } from 'rxjs';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
//import { DetalleProgramacion } from 'src/app/models/detalleprogramacion';
import { DetalleProgramacionRegistro } from 'src/app/models/detalleprogramacionregistro';
import { ProgramacionAuditoriaMockService, ProgramacionAuditoriaService } from './../../../../../services/index';
import { ToastrService } from 'ngx-toastr';
import { Response } from './../../../../../models/response';
import { NgForm, FormGroup, FormBuilder, FormControl } from '@angular/forms';
import { Norma } from './../../../../../models/norma';
import { Mes } from './../../../../../models/mes';
import { Auditoria } from 'src/app/models/auditoria';
import { GeneralService } from 'src/app/services/impl/general.service';
import { NombreParametro } from 'src/app/constants/general/general.constants';

@Component({
  selector: 'app-modal-detalle-programacion',
  templateUrl: './modal-detalle-programacion.component.html',
  styleUrls: ['./modal-detalle-programacion.component.scss'],
  providers: [ProgramacionAuditoriaService]
})
export class ModalDetalleProgramacionComponent implements OnInit {

  public onClose: Subject<Auditoria[]>;
  bsConfig: object;
  detalleProgramacionRegistro: DetalleProgramacionRegistro;
  nuevo: boolean = false;
  edicion: boolean = false;
  listaNormas: Norma[];
  listaMeses: any[];
  listaGerencias: any[];
  listaEquipos: any[];
  listaCargos: any[];
  listaComites: any[];
  detalleProgramacionForm: FormGroup;
  detalleProgramacion: Auditoria;

  constructor(public bsModalRef: BsModalRef,
    private modalService: BsModalService,
    private programacionService: ProgramacionAuditoriaMockService,
    private programacionServiceBD: ProgramacionAuditoriaService,
    private generalService: GeneralService,
    private formBuilder: FormBuilder,
    private toastr: ToastrService
  ) { }

  ngOnInit() {
    this.onClose = new Subject();
    this.createForm();
    this.obtenerParametros();
    if (this.nuevo) {
      this.detalleProgramacionRegistro = new DetalleProgramacionRegistro();
    } else if (this.edicion) {

    }
  }

  createForm() {
    
    this.detalleProgramacionForm = this.formBuilder.group({
      'valorGerencia': new FormControl({ value: '' }),
      'valorEquipo': new FormControl({ value: '' }),
      'valorCargo': new FormControl({ value: '' }),
      'valorComite': new FormControl({ value: '' }),
      'normasSeleccionadas': new FormControl({ value: '' }),
      'listaDestino': new FormControl({ value: '' }),
      'mesesSeleccionados': new FormControl({ value: '' }),
      'listaMesesDestino': new FormControl({ value: '' })
    });
  }

  cancelar() {
    this.bsModalRef.hide();
  }

  obtenerClick(event) {
    this.detalleProgramacionRegistro.valorTipoEntidad = event.target.value;
  }

  obtenerParametros() {
    this.listaNormas = [];
    this.listaMeses = [];
    this.listaMeses = [
      { v_valcons: "ISO 9001" },
      { v_valcons: "ISO 14001" },
      { v_valcons: "OHSAS 18001" },
      { v_valcons: "ISO/IEC 27001" },
      { v_valcons: "ISO/IEC 17025" },
      { v_valcons: "ISO/IEC 17029" },
      { v_valcons: "ISO/IEC 17030" }
    ];
    let buscaNormas = this.programacionServiceBD.obtenerNormas();
    let buscaEntidades = this.programacionService.obtenerEntidades();
    let buscaMesesPr = this.generalService.obtenerParametroPadre(NombreParametro.listaMeses)

    forkJoin(buscaNormas, buscaEntidades, buscaMesesPr)
      .subscribe(([buscaNormas, buscaEntidades, buscaMesesPr]: [Response, Response, Response]) => {
        for (let i: number = 0; buscaNormas.resultado.length > i; i++) {
          this.listaNormas.push(Object.assign({}, buscaNormas.resultado[i]));
        }
        /*         for(let j:number=0; buscaMesesPr.resultado.length>j ; j++){
                  this.listaMeses.push(Object.assign({},buscaMesesPr.resultado[j]));
                } */
        this.listaGerencias = buscaEntidades.resultado.listaGerencias;
        this.listaEquipos = buscaEntidades.resultado.listaEquipos;
        this.listaCargos = buscaEntidades.resultado.listaCargos;
        this.listaComites = buscaEntidades.resultado.listaComites;

        console.log(this.listaMeses);
      },
        (error) => this.controlarError(error));



  }

  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  guardar() {
    let listaDetalleProgramacion: Auditoria[] = [];
    switch (this.detalleProgramacionRegistro.valorTipoEntidad) {
      case "1":
        listaDetalleProgramacion = this.crearListaDetalle(this.detalleProgramacionRegistro.valorEntidadGerencia.valorGerencia);
        break;
      case "2":
        listaDetalleProgramacion = this.crearListaDetalle(this.detalleProgramacionRegistro.valorEntidadEquipo.valorEquipo);
        break;
      case "3":
        listaDetalleProgramacion = this.crearListaDetalle(this.detalleProgramacionRegistro.valorEntidadCargo.valorCargo);
        break;
      case "4":
        listaDetalleProgramacion = this.crearListaDetalle(this.detalleProgramacionRegistro.valorEntidadComite.valorComite);
        break;
    }

    console.log(listaDetalleProgramacion);

    this.bsModalRef.hide();
    this.onClose.next(listaDetalleProgramacion);
  }

  crearListaDetalle(valorEntidad: any): Auditoria[] {
    let listaDetalleProgramacion: Auditoria[] = [];
    console.log(this.detalleProgramacionRegistro.listaMeses);
    for(let j:number = 0; this.detalleProgramacionRegistro.listaMeses.length > j; j++){
      
      let auditoriaAux:Auditoria = new Auditoria();
      //HABIA ERROR DE DATOS
      switch (this.detalleProgramacionRegistro.valorTipoEntidad) {
        case "1":
          auditoriaAux.gerencia = valorEntidad;
          break;
        case "2":
          auditoriaAux.equipo = valorEntidad;
          break;
        case "3":
          auditoriaAux.cargo = valorEntidad;
          break;
        case "4":
          auditoriaAux.comite = valorEntidad;
          break;

      }

      auditoriaAux.listaNormas = this.detalleProgramacionRegistro.listaNormas;
      auditoriaAux.mes = this.detalleProgramacionRegistro.listaMeses[j].v_valcons;
      listaDetalleProgramacion.push(auditoriaAux);
    }
    return listaDetalleProgramacion;
  }

  seleccionarNormas() {
    if (this.listaNormas.length > 0) {
      let normasSeleccionadas: Norma[] = this.detalleProgramacionForm.controls['normasSeleccionadas'].value;
      let listaItem: number[] = [];
      
      for(let i:number=0; this.listaNormas.length>i; i++){
        let normaAux = this.listaNormas[i];
        for (let j: number = 0; normasSeleccionadas.length > j; j++) {
          let normaSeleccionadaAux = normasSeleccionadas[j]
          /*if(normaAux.idNorma == normaSeleccionadaAux.idNorma){
            listaItem.push(i);
            break;
          }*/
        }
      }
      for (let k: number = listaItem.length - 1; 0 <= k; k--) {
        this.listaNormas.splice(listaItem[k], 1);
      }

      for (let h: number = 0; normasSeleccionadas.length > h; h++) {
        this.detalleProgramacionRegistro.listaNormas.push(normasSeleccionadas[h]);
      }
    }



  }

  seleccionarTodos() {
    if (this.listaNormas.length > 0) {
      for (let i: number = 0; this.listaNormas.length > i; i++) {
        this.detalleProgramacionRegistro.listaNormas.push(this.listaNormas[i]);
      }

      this.listaNormas.splice(0, this.listaNormas.length);
    }


  }

  quitarNormas() {
    if (this.detalleProgramacionRegistro.listaNormas.length > 0) {
      let normasQuitadas: Norma[] = this.detalleProgramacionForm.controls['listaDestino'].value;
      let listaItem: number[] = [];
      
      for(let i:number=0; this.detalleProgramacionRegistro.listaNormas.length>i; i++){
        let normaAux = this.detalleProgramacionRegistro.listaNormas[i];
        for (let j: number = 0; normasQuitadas.length > j; j++) {
          let normaQuitadaAux = normasQuitadas[j]
          /*antes if(normaAux.idNorma == normaQuitadaAux.idNorma){
            listaItem.push(i);
            break;
          } */
          if (normaAux.n_id_normas == normaQuitadaAux.n_id_normas) {
            listaItem.push(i);
            break;
          }
        }
      }
      for (let k: number = listaItem.length - 1; 0 <= k; k--) {
        this.detalleProgramacionRegistro.listaNormas.splice(listaItem[k], 1);
      }

      for (let h: number = 0; normasQuitadas.length > h; h++) {
        this.listaNormas.push(normasQuitadas[h]);
      }
    }

  }

  quitarTodo() {
    if (this.detalleProgramacionRegistro.listaNormas.length > 0) {
      for (let i: number = 0; this.detalleProgramacionRegistro.listaNormas.length > i; i++) {
        this.listaNormas.push(this.detalleProgramacionRegistro.listaNormas[i]);
      }

      this.detalleProgramacionRegistro.listaNormas.splice(0, this.detalleProgramacionRegistro.listaNormas.length);
    }

  }

  seleccionarMeses() {
    if (this.listaMeses.length > 0) {
      let mesesSeleccionados: any[] = this.detalleProgramacionForm.controls['mesesSeleccionados'].value;
      console.log(mesesSeleccionados);
      console.log(this.listaMeses);
      let listaItem: number[] = [];
      
      for(let i:number=0; this.listaMeses.length>i; i++){
        let mesAux = this.listaMeses[i];
        for (let j: number = 0; mesesSeleccionados.length > j; j++) {
          let mesSeleccionadoAux = mesesSeleccionados[j]
          if (mesAux.v_valcons == mesSeleccionadoAux.v_valcons) {
            listaItem.push(i);
            break;
          }
        }
      }
      for (let k: number = listaItem.length - 1; 0 <= k; k--) {
        this.listaMeses.splice(listaItem[k], 1);
      }

      for (let h: number = 0; mesesSeleccionados.length > h; h++) {
        this.detalleProgramacionRegistro.listaMeses.push(mesesSeleccionados[h]);
      }
    }

  }

  seleccionarTodosMeses() {
    if (this.listaMeses.length > 0) {
      for (let i: number = 0; this.listaMeses.length > i; i++) {
        this.detalleProgramacionRegistro.listaMeses.push(this.listaMeses[i]);
      }

      this.listaMeses.splice(0, this.listaMeses.length);
    }

  }

  quitarNormasMeses() {
    if (this.detalleProgramacionRegistro.listaMeses.length > 0) {
      let mesesQuitados: any[] = this.detalleProgramacionForm.controls['listaMesesDestino'].value;
      let listaItem: number[] = [];
      
      for(let i:number=0; this.detalleProgramacionRegistro.listaMeses.length>i; i++){
        let mesAux = this.detalleProgramacionRegistro.listaMeses[i];
        for (let j: number = 0; mesesQuitados.length > j; j++) {
          let mesSeleccionadoAux = mesesQuitados[j]
          if (mesAux.v_valcons == mesSeleccionadoAux.v_valcons) {
            listaItem.push(i);
            break;
          }
        }
      }
      for (let k: number = listaItem.length - 1; 0 <= k; k--) {
        this.detalleProgramacionRegistro.listaMeses.splice(listaItem[k], 1);
      }

      for (let h: number = 0; mesesQuitados.length > h; h++) {
        this.listaMeses.push(mesesQuitados[h]);
      }
    }

  }

  quitarTodosMeses() {
    if (this.detalleProgramacionRegistro.listaMeses.length > 0) {
      for (let i: number = 0; this.detalleProgramacionRegistro.listaMeses.length > i; i++) {
        this.listaMeses.push(this.detalleProgramacionRegistro.listaMeses[i]);
      }

      this.detalleProgramacionRegistro.listaMeses.splice(0, this.detalleProgramacionRegistro.listaMeses.length);
    }

  }

  validarCampos(): boolean {
    let valida: boolean = true;
    if (this.detalleProgramacionRegistro.valorTipoEntidad != "0") {
      switch (this.detalleProgramacionRegistro.valorTipoEntidad) {
        case "1":
          if (this.detalleProgramacionRegistro.valorEntidadGerencia == "") {
            valida = false;
          }
          break;
        case "2":
          if (this.detalleProgramacionRegistro.valorEntidadEquipo == "") {
            valida = false;
          }
          break;
        case "3":
          if (this.detalleProgramacionRegistro.valorEntidadCargo == "") {
            valida = false;
          }
          break;
        case "4":
          if (this.detalleProgramacionRegistro.valorEntidadComite == "") {
            valida = false;
          }
          break;
      }
      if (valida) {
        if (this.detalleProgramacionRegistro.listaMeses.length == 0) {
          valida = false;
        }

        if (this.detalleProgramacionRegistro.listaNormas.length == 0) {
          valida = false;
        }
      }
    } else {
      valida = false;
    }
    return valida;
  }

}

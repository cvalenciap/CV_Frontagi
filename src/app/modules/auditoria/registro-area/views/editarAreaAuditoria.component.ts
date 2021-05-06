//import { Paginacion, Tipo } from './../../../../../../app/models';
import { defineLocale, esLocale, BsLocaleService, ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Component, OnInit } from '@angular/core';
import { AreaAuditoria } from 'src/app/models/area-auditoria';
import { Router } from '@angular/router';
import { AreaParametros } from 'src/app/models/areas-parametro';
import { AreaCargoAuditoria } from 'src/app/models/areacargo-auditoria';
import { AreaCargoSig } from 'src/app/models/areacargo-sig';
import { AreaAlcanceAuditoria } from 'src/app/models/areaalcance-auditoria';
import { AreaAlcance } from 'src/app/models/area-alcance';
import { ToastrService } from 'ngx-toastr';
import { ModalBusquedaResponsableComponent } from '../modal/modal-busqueda-responsable.component';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { AreaAuditoriaService } from 'src/app/services/areaauditoria.service';

@Component({
  selector: 'app-editarAreaAuditoria',
  templateUrl: 'editarAreaAuditoria.template.html',
  styleUrls: ['editarAreaAuditoria.component.scss'],
})

export class EditarAreaAuditoriaComponent implements OnInit {

  areaAuditoria: AreaAuditoria;
  areaParametros: AreaParametros;
  lstGerencias: AreaAuditoria[];
  lstEquipos: AreaAuditoria[];
  lstCargos: AreaCargoSig[];
  lstAreaCargoAuditoria: AreaCargoAuditoria[];
  lstAlcances: AreaAlcance[];
  lstAreaAlcancesAuditoria: AreaAlcanceAuditoria[];
  modeloGerencia: AreaAuditoria;
  modeloEquipo: AreaAuditoria;
  modeloComite: string;
  modeloSiglaComite: string;
  modeloSigla: string;
  modeloCargo: AreaCargoSig;
  modeloAlcance: AreaAlcance;
  checkGerencia: Boolean;
  checkEquipo: Boolean;
  checkComite: Boolean;
  gerenciaSeleccionada: string;
  cargoSeleccionado: AreaCargoAuditoria;
  alcanceSeleccionado: AreaAlcanceAuditoria;
  indiceCargo: number;
  indiceAlcance: number;
  nuevo: Boolean;
  valorRadio: number;
  responsable: string;
  guardaAreaAuditoria: AreaAuditoria;
  bsModalRef: BsModalRef;
  nuevoResponsable: string;
  nuevaficha: number;
  selectedRow: number;

  constructor(
    private localeService: BsLocaleService,
    private router: Router,
    private toastr: ToastrService,
    private modalService: BsModalService,
    private servicio: AreaAuditoriaService
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
  }


  ngOnInit() {
    this.areaParametros = JSON.parse(localStorage.getItem('areaParametros'));
    this.indiceCargo = null;
    this.indiceAlcance = null;
    this.lstAreaAlcancesAuditoria = [];
    this.lstAreaCargoAuditoria = [];
    this.cargarDatos();
  }

  cargarDatos() {
    this.guardaAreaAuditoria = new AreaAuditoria();
    this.lstCargos = this.areaParametros.lstCargoSig;
    this.lstAlcances = this.areaParametros.lstAlcances;
    if (sessionStorage.getItem('itemAreaAudiMod')) {
      this.areaAuditoria = JSON.parse(sessionStorage.getItem('itemAreaAudiMod'));
      this.guardaAreaAuditoria = this.areaAuditoria;
      if (this.areaAuditoria.n_id_tipo === 1) {
        this.gerenciaSeleccionada = this.areaAuditoria.v_nom_area;
        this.lstAreaAlcancesAuditoria =
          this.areaParametros.lstAreaAlcanceAuditoria.filter(s => s.n_id_area === this.areaAuditoria.n_id_area);
        this.modeloGerencia = this.areaAuditoria;
      } else if (this.areaAuditoria.n_id_tipo === 2) {
        this.lstGerencias = this.areaParametros.lstAreaAuditoria.filter(s => s.n_id_tipo === 1);
        this.gerenciaSeleccionada = this.lstGerencias.find(s => s.n_cod_area === this.areaAuditoria.n_cod_area_padre).v_nom_area;
        this.lstAreaCargoAuditoria =
          this.areaParametros.lstAreaCargoAuditoria.filter(s => s.n_id_area === this.areaAuditoria.n_id_area);
        this.lstAreaAlcancesAuditoria =
          this.areaParametros.lstAreaAlcanceAuditoria.filter(s => s.n_id_area === this.areaAuditoria.n_id_area);
        this.modeloEquipo = this.areaAuditoria;
      } else if (this.areaAuditoria.n_id_tipo === 3) {
        this.modeloComite = this.areaAuditoria.v_nom_area;
        this.modeloSiglaComite = this.areaAuditoria.v_sigla;
        this.nuevoResponsable = this.areaAuditoria.responsable;
        this.nuevaficha = this.areaAuditoria.n_ficha;
      }
      this.responsable = this.areaAuditoria.responsable;
      this.onInhabilitar(this.areaAuditoria.n_id_tipo);
      this.nuevo = false;
      sessionStorage.removeItem('itemAreaAudiMod');
    } else {
      this.lstAreaAlcancesAuditoria = [];
      this.lstAreaCargoAuditoria = [];
      this.guardaAreaAuditoria.n_id_area = null;
      this.checkGerencia = true;
      this.valorRadio = 1;
      this.responsable = '';
      this.areaAuditoria = new AreaAuditoria();
      this.modeloComite = '';
      this.modeloSiglaComite = '';
      this.lstGerencias = this.areaParametros.lstAreaAuditoria.filter(s => s.v_nom_area.startsWith('GERENCIA'));
      this.lstEquipos = this.areaParametros.lstAreaAuditoria.filter(s => s.v_nom_area.startsWith('EQUIPO'));
      this.nuevo = true;
    }
  }

  onSelectGerencia(value: AreaAuditoria) {
    this.lstAreaAlcancesAuditoria = [];
    this.responsable = '';
    if (this.checkGerencia === true) {
      if ((this.quitarTextoBlanco(value.responsable)).trim() !== '') {
        this.responsable = value.responsable;
        this.lstAreaAlcancesAuditoria = this.areaParametros.lstAreaAlcanceAuditoria.filter(s => s.n_id_area === value.n_id_area);
        this.guardaAreaAuditoria.n_cod_area = value.n_cod_area;
        this.guardaAreaAuditoria.n_cod_area_padre = value.n_cod_area_padre;
        this.guardaAreaAuditoria.n_id_area = value.n_id_area;
        this.guardaAreaAuditoria.n_ficha = value.n_ficha;
        this.guardaAreaAuditoria.n_id_tipo = value.n_id_tipo;
        this.guardaAreaAuditoria.responsable = value.responsable;
        this.guardaAreaAuditoria.v_nom_area = value.v_nom_area;
        this.guardaAreaAuditoria.v_sigla = value.v_sigla;
      } else {
        this.toastr.error('La Gerencia seleccionada no tiene Responsable asignado', 'Error', { closeButton: true });
      }
    } else if (this.checkEquipo === true) {
      this.responsable = '';
      this.modeloEquipo = null;
      this.modeloAlcance = null;
      this.modeloCargo = null;
      this.lstEquipos = [];
      this.lstAreaCargoAuditoria = [];
      this.lstEquipos = this.areaParametros.lstAreaAuditoria.filter(s => s.n_cod_area_padre === value.n_cod_area);
    }
  }

  onSelectEquipo(value: AreaAuditoria) {
    this.lstAreaAlcancesAuditoria = [];
    this.lstAreaCargoAuditoria = [];
    this.responsable = '';
    if ((this.quitarTextoBlanco(value.responsable)).trim() !== '') {
      this.lstAreaCargoAuditoria = this.areaParametros.lstAreaCargoAuditoria.filter(s => s.n_id_area === value.n_id_area);
      this.responsable = this.lstEquipos.find(s => s.n_id_area === value.n_id_area).responsable;
      this.lstAreaAlcancesAuditoria = this.areaParametros.lstAreaAlcanceAuditoria.filter(s => s.n_id_area === value.n_id_area);
      this.guardaAreaAuditoria.n_cod_area = value.n_cod_area;
      this.guardaAreaAuditoria.n_cod_area_padre = value.n_cod_area_padre;
      this.guardaAreaAuditoria.n_ficha = value.n_ficha;
      this.guardaAreaAuditoria.n_id_area = value.n_id_area;
      this.guardaAreaAuditoria.n_id_tipo = value.n_id_tipo;
      this.guardaAreaAuditoria.responsable = value.responsable;
      this.guardaAreaAuditoria.v_nom_area = value.v_nom_area;
      this.guardaAreaAuditoria.v_sigla = value.v_sigla;
    } else {
      this.toastr.error('El Equipo seleccionado no tiene Responsable asignado', 'Error', { closeButton: true });
    }
  }

  onAgregarCargo() {
    if (this.lstAreaCargoAuditoria.find(s => s.n_id_cargo_sig === this.modeloCargo.idCargoSig)) {
      this.toastr.warning('No es posible agregar el mismo cargo', 'Aviso', { closeButton: true });
    } else {
      const nuevoCargo = new AreaCargoAuditoria();
      nuevoCargo.n_id_area = this.modeloEquipo.n_id_area;
      nuevoCargo.n_id_cargo_sig = this.modeloCargo.idCargoSig;
      nuevoCargo.v_nom_cargo_sig = this.modeloCargo.nombreCargoSig;
      nuevoCargo.v_sigla = this.modeloCargo.sigla;
      this.lstAreaCargoAuditoria.push(nuevoCargo);
    }
  }

  onQuitarCargo() {
    if (this.lstAreaCargoAuditoria.length === 0) {
      this.toastr.warning('No hay más cargos para eliminar', 'Aviso', { closeButton: true });
    } else {
      if (this.indiceCargo === null) {
        this.toastr.warning('Debe seleccionar el cargo a eliminar', 'Aviso', { closeButton: true });
      } else {
        this.lstAreaCargoAuditoria.splice(this.indiceCargo, 1);
        this.selectedRow = -1
        this.indiceCargo = null;
      }
    }
  }

  onAgregarAlcance() {
    if (this.lstAreaAlcancesAuditoria.find(s => s.v_cod_alca === this.modeloAlcance.v_valcons)) {
      this.toastr.warning('No es posible agregar el mismo alcance', 'Aviso', { closeButton: true });
    } else {
      const nuevoAlcance = new AreaAlcanceAuditoria();
      nuevoAlcance.n_id_alc_area = null;
      if (this.valorRadio === 1) {
        nuevoAlcance.n_id_area = this.modeloGerencia.n_id_area;
      } else if (this.valorRadio === 2) {
        nuevoAlcance.n_id_area = this.modeloEquipo.n_id_area;
      }
      nuevoAlcance.v_cod_alca = this.modeloAlcance.v_valcons;
      nuevoAlcance.v_abre_alca = this.modeloAlcance.v_abrecons;
      this.lstAreaAlcancesAuditoria.push(nuevoAlcance);
    }
  }

  onQuitarAlcance() {
    if (this.lstAreaAlcancesAuditoria.length === 0) {
      this.toastr.warning('No hay más alcances para eliminar', 'Aviso', { closeButton: true });
    } else {
      if (this.indiceAlcance === null) {
        this.toastr.warning('Debe seleccionar el alcance a eliminar', 'Aviso', { closeButton: true });
      } else {
        this.lstAreaAlcancesAuditoria.splice(this.indiceAlcance, 1);
        this.indiceAlcance = null;
        this.selectedRow = -1
      }
    }
  }

  OnRowClickCargo(indice: number, areaCargoSeleccionado: AreaCargoAuditoria) {
    this.cargoSeleccionado = new AreaCargoAuditoria;
    this.cargoSeleccionado = areaCargoSeleccionado;
    this.indiceCargo = indice;
    this.selectedRow = indice;
  }

  OnRowClickAlcance(indice: number, areaAlcanceSeleccionado: AreaAlcanceAuditoria) {
    this.alcanceSeleccionado = new AreaAlcanceAuditoria;
    this.alcanceSeleccionado = areaAlcanceSeleccionado;
    this.indiceAlcance = indice;
    this.selectedRow = indice;
  }

  onChangeTipo(valor: number) {
    if (valor === 1) {
      this.checkGerencia = true;
      this.checkEquipo = false;
      this.checkComite = false;
      this.valorRadio = 1;
      this.onLimpiarCampos();
    } else if (valor === 2) {
      this.checkGerencia = false;
      this.checkEquipo = true;
      this.checkComite = false;
      this.valorRadio = 2;
      this.onLimpiarCampos();
    } else if (valor === 3) {
      this.checkGerencia = false;
      this.checkEquipo = false;
      this.checkComite = true;
      this.valorRadio = 3;
      this.onLimpiarCampos();
    }
  }

  onLimpiarCampos() {
    this.modeloGerencia = null;
    this.guardaAreaAuditoria = new AreaAuditoria();
    this.guardaAreaAuditoria.n_id_area = null;
    this.modeloEquipo = null;
    this.modeloComite = '';
    this.modeloSiglaComite = '';
    this.modeloSigla = null;
    this.modeloAlcance = null;
    this.modeloCargo = null;
    this.lstEquipos = [];
    this.responsable = '';
    this.lstAreaAlcancesAuditoria = [];
    this.lstAreaCargoAuditoria = [];
  }

  OnGuardar() {
    if ((this.valorRadio === 1 || this.valorRadio === 2) && (this.quitarTextoBlanco(this.guardaAreaAuditoria.responsable)).trim() === '') {
      this.toastr.error('No exíste Responsable para el área seleccionada.', 'Error', { closeButton: true });
    } else {
      if (this.nuevo) {
        if (this.valorRadio === 1 || this.valorRadio === 2) {
          if (!this.guardaAreaAuditoria.n_cod_area) {
            this.toastr.error('Debe Seleccionar una Gerencia o Equipo.', 'Error', { closeButton: true });
          } else {
            this.servicio.guardarAreas(this.guardaAreaAuditoria, this.lstAreaAlcancesAuditoria, this.lstAreaCargoAuditoria).subscribe(
              (response: any) => {
                if (response.resultado === 0) {
                  this.toastr.success('Registro almacenado.', 'Acción completada!', { closeButton: true });
                  this.router.navigate([`/auditoria/registro-area-auditoria/`]);
                } else {
                  this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
                }
              },
              (error) => {
                this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
              }
            );
          }
        } else {
          if ((this.quitarTextoBlanco(this.modeloComite)).trim() === '') {
            this.toastr.warning('Debe Ingresar el nombre del Comité', 'Aviso', { closeButton: true });
            this.modeloComite = '';
          } else if ((this.quitarTextoBlanco(this.modeloSiglaComite)).trim() === '') {
            this.modeloSiglaComite = '';
            this.toastr.warning('Debe Ingresar las siglas del Comité', 'Aviso', { closeButton: true });
          } /* 
          else if (this.areaParametros.lstAreaAuditoria.find(
            s => s.v_nom_area === (this.quitarTextoBlanco(this.modeloComite.toUpperCase())).trim())) {
            this.toastr.warning('El comité ingresado ya existe', 'Aviso', { closeButton: true });
          } else if (this.areaParametros.lstAreaAuditoria.find(
            s => s.v_sigla === (this.quitarTextoBlanco(this.modeloSiglaComite.toUpperCase())).trim())) {
            this.toastr.warning('Las siglas ingresadas ya existen', 'Aviso', { closeButton: true });
          } */
          else if (!this.nuevoResponsable) {
            this.toastr.warning('Debe seleccionar un Responsable', 'Aviso', { closeButton: true });
          } else {
            this.guardaAreaAuditoria.n_ficha = this.nuevaficha;
            this.guardaAreaAuditoria.responsable = this.nuevoResponsable;
            this.guardaAreaAuditoria.n_id_tipo = 3;
            this.guardaAreaAuditoria.v_nom_area = this.modeloComite.toUpperCase();
            this.guardaAreaAuditoria.v_sigla = this.modeloSiglaComite.toUpperCase();
            this.servicio.guardarAreas(this.guardaAreaAuditoria, this.lstAreaAlcancesAuditoria, this.lstAreaCargoAuditoria).subscribe(
              (response: any) => {
                if (response.resultado === 0) {
                  this.toastr.success('Registro almacenado.', 'Acción completada!', { closeButton: true });
                  this.router.navigate([`/auditoria/registro-area-auditoria/`]);
                } else {
                  this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
                }
              },
              (error) => {
                this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
              }
            );
          }
        }
      } else {
        if (this.valorRadio === 1 || this.valorRadio === 2) {
          this.servicio.guardarAreas(this.areaAuditoria, this.lstAreaAlcancesAuditoria, this.lstAreaCargoAuditoria).subscribe(
            (response: any) => {
              if (response.resultado === 0) {
                this.toastr.success('Registro almacenado.', 'Acción completada!', { closeButton: true });
                this.router.navigate([`/auditoria/registro-area-auditoria/`]);
              } else {
                this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
              }
            },
            (error) => {
              this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
            }
          );
        } else {
          if ((this.quitarTextoBlanco(this.modeloComite)).trim() === '') {
            this.toastr.warning('Debe Ingresar el nombre del Comité', 'Aviso', { closeButton: true });
            this.modeloComite = '';
          } else if ((this.quitarTextoBlanco(this.modeloSiglaComite)).trim() === '') {
            this.toastr.warning('Debe Ingresar las siglas del Comité', 'Aviso', { closeButton: true });
            this.modeloSiglaComite = '';
          } else if (!this.nuevoResponsable) {
            this.toastr.warning('Debe seleccionar un Responsable', 'Aviso', { closeButton: true });
          } else {
            this.guardaAreaAuditoria = this.areaAuditoria;
            this.guardaAreaAuditoria.v_nom_area = this.modeloComite.toUpperCase();
            this.guardaAreaAuditoria.v_sigla = this.modeloSiglaComite.toUpperCase();
            this.guardaAreaAuditoria.n_ficha = this.nuevaficha;
            this.guardaAreaAuditoria.responsable = this.nuevoResponsable;
            this.servicio.guardarAreas(this.guardaAreaAuditoria, this.lstAreaAlcancesAuditoria, this.lstAreaCargoAuditoria).subscribe(
              (response: any) => {
                if (response.resultado === 0) {
                  this.toastr.success('Registro almacenado.', 'Acción completada!', { closeButton: true });
                  this.router.navigate([`/auditoria/registro-area-auditoria/`]);
                } else {
                  this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
                }
              },
              (error) => {
                this.toastr.error('Ocurrio un error al realizar el registro.', 'Error!', { closeButton: true });
              }
            );
          }
        }
      }
    }
  }

  OnRegresar() {
    this.router.navigate([`auditoria/registro-area-auditoria`]);
  }

  onInhabilitar(indicador: number) {
    if (indicador === 1) {
      this.valorRadio = 1
      this.checkGerencia = true;
      this.checkEquipo = false;
      this.checkComite = false;
      document.getElementById('tipoEquipo').setAttribute('disabled', 'disabled');
      document.getElementById('tipoComite').setAttribute('disabled', 'disabled');
    } else if (indicador === 2) {
      this.valorRadio = 2;
      this.checkGerencia = false;
      this.checkEquipo = true;
      this.checkComite = false;
      document.getElementById('tipoGerencia').setAttribute('disabled', 'disabled');
      document.getElementById('tipoComite').setAttribute('disabled', 'disabled');
    } else if (indicador === 3) {
      this.valorRadio = 3;
      this.checkGerencia = false;
      this.checkEquipo = false;
      this.checkComite = true;
      document.getElementById('tipoGerencia').setAttribute('disabled', 'disabled');
      document.getElementById('tipoEquipo').setAttribute('disabled', 'disabled');
    }
  }

  BusquedaColaborador() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ModalBusquedaResponsableComponent, config);
    (<ModalBusquedaResponsableComponent>this.bsModalRef.content).onClose.subscribe(result => {
      const responsable: RutaParticipante = result;
      this.nuevoResponsable = responsable.responsable;
      this.responsable = responsable.responsable;
      this.nuevaficha = responsable.idColaborador;
    });
  }

  quitarTextoBlanco(valor) {
    return valor.replace(/\s+/g, ' ');
  }



}


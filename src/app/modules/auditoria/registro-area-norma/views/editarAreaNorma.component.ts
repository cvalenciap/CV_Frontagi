import { defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { FormBuilder } from '@angular/forms';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, Inject } from '@angular/core';
import { RegistroAuditor } from 'src/app/models/registroAuditor';
import { ModalBusquedaNormaComponent } from '../modal/modal-busqueda-norma.component';
import { AreaParametros } from 'src/app/models/areas-parametro';
import { AreaAuditoria } from 'src/app/models/area-auditoria';
import { AreaNormaLista } from 'src/app/models/areanorma-lista';
import { AreaNormaDet } from 'src/app/models/areanorma-det';
import { Norma } from 'src/app/models/norma';

@Component({
  selector: 'app-editarAreaNorma',
  templateUrl: 'editarAreaNorma.template.html',
  styleUrls: ['editarAreaNorma.component.scss']
})

export class EditarAreaNormaComponent implements OnInit {


  areaParametros: AreaParametros;
  lstGerencias: AreaAuditoria[];
  lstEquipos: AreaAuditoria[];
  lstComite: AreaAuditoria[];
  lstAreaNormaDet: AreaNormaDet[];
  lstAreaNormas: AreaNormaLista[];
  modeloGerencia: AreaAuditoria;
  modeloComite: AreaAuditoria;

  valorRadio: Number = 1;
  listaNormasSeleccionadas: Norma[];
  bsModalRef: BsModalRef;

  constructor(
    private modalService: BsModalService,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }


  ngOnInit() {
    this.inicializarVariables();
    this.areaParametros = JSON.parse(localStorage.getItem('areaParametros'));
    this.lstGerencias = this.areaParametros.lstAreaAuditoria.filter(s => s.n_id_tipo === 1 && s.v_st_reg === 1);
    this.lstEquipos = this.areaParametros.lstAreaAuditoria.filter(s => s.n_id_tipo === 2 && s.v_st_reg === 1)
    this.lstComite = this.areaParametros.lstAreaAuditoria.filter(s => s.n_id_tipo === 3 && s.v_st_reg === 1);
    this.lstAreaNormaDet = this.areaParametros.lstAreaNormaDet.filter(s => s.v_st_reg === '1');
    console.log(this.lstAreaNormaDet);
  }

  onSelectGerencia(item: AreaAuditoria) {
    console.log(item);
    this.lstAreaNormas = [];
    const areaSeleccionada = new AreaNormaLista();
    let listaAreas = []
    areaSeleccionada.areaAuditoria = item;
    areaSeleccionada.normas = this.lstAreaNormaDet.filter(s => s.n_id_area === item.n_id_area);
    this.lstAreaNormas.push(areaSeleccionada);
    listaAreas = this.lstEquipos.filter(s => s.n_cod_area_padre === item.n_cod_area);
    for (let i = 0; i < listaAreas.length; i++) {
      const newAreaSeleccionada = new AreaNormaLista();
      newAreaSeleccionada.areaAuditoria = listaAreas[i];
      newAreaSeleccionada.normas = this.lstAreaNormaDet.filter(s => s.n_id_area === listaAreas[i].n_id_area);
      this.lstAreaNormas.push(newAreaSeleccionada);
    }
    console.log(this.lstAreaNormas);
  }

  inicializarVariables() {
    this.lstGerencias = [];
    this.lstComite = [];
    this.lstAreaNormas = [];
    this.listaNormasSeleccionadas = [];
  }


  cargarDatos() {

  }

  busquedaNormas() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-sm'
    }

    this.bsModalRef = this.modalService.show(ModalBusquedaNormaComponent, config);
    (<ModalBusquedaNormaComponent>this.bsModalRef.content).onClose.subscribe(result => {
      console.log(result);
      let normas: Norma[] = result;
      for (let i = 0; i < normas.length; i++) {
        this.listaNormasSeleccionadas.push(normas[i]);
      }
      console.log(this.listaNormasSeleccionadas);
    });
  }


  OnRegresar() {
    this.router.navigate([`auditoria/registro-area-norma`]);
  }
}


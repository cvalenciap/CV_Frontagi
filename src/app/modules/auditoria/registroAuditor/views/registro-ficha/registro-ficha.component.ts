import { Response } from './../../../../../../app/models';
import { BsModalRef, BsModalService, defineLocale, esLocale, ModalOptions } from 'ngx-bootstrap';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { Component, OnInit, ViewChild } from '@angular/core';
import { ModalInfoAuditorComponent } from '../modales/modal-info-auditor/modal-info-auditor.component';
import { FichaAuditorApiService } from '../../../../../services/impl/ficha-auditor-api.service';
import { ToastrUtilService } from '../../../../../services/util/toastr-util.service';
import { FichaAudi } from '../../../../../models/interfaces/ficha-audi';
import { GenericParam } from '../../../../../models/interfaces/generic-param';
import { CursoNorma } from '../../../../../models/interfaces/curso-norma';
import { CursoAuditor } from '../../../../../models/interfaces/curso-auditor';
import AgcUtil from '../../util/agc-util';
import { SwalComponent } from '@toverux/ngx-sweetalert2';
import { Router } from '@angular/router';
import { ConstantesFichaAuditor } from 'src/app/models/enums/constantes-ficha-auditor.enum';


@Component({
  selector: 'app-registro-ficha',
  templateUrl: 'registro-ficha.template.html',
  styleUrls: ['registro-ficha.component.scss']

  // providers: [FichaRegistroAuditorService]
})

export class RegistroAuditorNuevoComponent implements OnInit {

  itemCodigo: number;
  loading: boolean = false;
  /* datos */
  tiposAuditoria: GenericParam[] = [];
  listaRol: GenericParam[] = [];
  listaEducacion: GenericParam[] = [];
  listaNormas: GenericParam[] = [];

  infoAuditor: FichaAudi = {
    ficha: null,
    nomAudi: '',
    apePaterno: '',
    apeMaterno: '',
    auditor: '',
    annoExp: '',
    nomCargo: '',
    equipo: {
      descripcion: ''
    },
    gerencia: {
      descripcion: ''
    }
  };

  cursosNorma: CursoNorma[] = [];
  cursosCompletados: CursoAuditor[] = [];
  cursosPendientes: CursoAuditor[] = [];

  fichaAudiRequest: FichaAudi = {};
  rolAux: GenericParam = null;
  tipoEducacionAux: GenericParam = null;
  tipoAuditoria: string = '1';

  cursoNormaAux: GenericParam = null;
  indObliCursoNorma: number = null;
  selectedCursoNorma: CursoNorma = null;
  selectedRowCursoNorma: number = -1;

  cursoCompletadoAux: string = null;
  indObliCursoComp: number = null;
  selectedCursoComp: CursoAuditor = null;
  selectedRowCursoComp: number = -1;

  cursoPendienteAux: string = null;
  indObliCursoPend: number = null;
  selectedCursoPend: CursoAuditor = null;
  selectedRowCursoPend: number = -1;

  bsModalRef: BsModalRef;

  @ViewChild('swalEliminarCursoNorma') swalEliminarCursoNorma: SwalComponent;
  @ViewChild('swalEliminarCursoComp') swalEliminarCursoComp: SwalComponent;
  @ViewChild('swalEliminarCursoPend') swalEliminarCursoPend: SwalComponent;
  @ViewChild('swalGuardarFichaAudi') swalGuardarFichaAudi: SwalComponent;

  valorTipo: string;
  valorRadio: Number = 1;

  listaMensaje: string[] = [];

  constructor(
    private modalService: BsModalService,
    private localeService: BsLocaleService,
    private toastrUtil: ToastrUtilService,
    private router: Router,
    private fichaAuditorApi: FichaAuditorApiService
  ) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.obtenerParametros();
  }

  BusquedaAuditores() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
        nuevo: true
      },
      class: 'modal-lg'
    };

    this.bsModalRef = this.modalService.show(ModalInfoAuditorComponent, config);
    (<ModalInfoAuditorComponent>this.bsModalRef.content).onClose$.subscribe(result => {
      this.infoAuditor = result;
    });
  }

  private buscarIndiceCursoComp(nomCurso: string): number {
    let indice: number = -1;
    for (let i = 0; i < this.cursosCompletados.length; i++) {
      const element = this.cursosCompletados[i];
      if (element.nomCurso.trim().toUpperCase() === nomCurso.trim().toUpperCase()) {
        indice = i;
        break;
      }
    }
    return indice;
  }

  private buscarIndiceCursoNorma(nomCurso: string): number {
    let indice: number = -1;
    for (let i = 0; i < this.cursosNorma.length; i++) {
      const element = this.cursosNorma[i];
      if (element.nomNorma === nomCurso) {
        indice = i;
        break;
      }
    }
    return indice;
  }

  private buscarIndiceCursoPend(nomCurso: string): number {
    let indice: number = -1;
    for (let i = 0; i < this.cursosPendientes.length; i++) {
      const element = this.cursosPendientes[i];
      if (element.nomCurso === nomCurso) {
        indice = i;
        break;
      }
    }
    return indice;
  }

  private async enviarDatosApi() {
    this.loading = true;
    await this.fichaAuditorApi.guardarFichaAuditor(this.fichaAudiRequest).toPromise()
      .then((response: Response) => {
        if (response.estado === 'OK') {
          this.loading = false;
          sessionStorage.setItem('flagRegFichaAudi', 'REGISTRADO');
          this.toastrUtil.showSuccess(ConstantesFichaAuditor.MENSAJE_OK);
          this.router.navigateByUrl('/auditoria/registro-auditor');
        } else {
          console.error(response.error);
          this.toastrUtil.showError(response.error.mensaje);
          this.loading = false;
        }
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(err);
        this.loading = false;
      });
  }

  private guardarFichaAudiExterno() {
    this.fichaAudiRequest.tipoAuditor = {
      codigo: this.tipoAuditoria
    };
    this.fichaAudiRequest.idUsuaCrea = AgcUtil.camposAuditoria().idUsuaCrea;
    console.log(this.fichaAudiRequest);
    this.enviarDatosApi();
  }

  private guardarFichaAudiInterno() {
    this.fichaAudiRequest = {
      tipoAuditor: {
        codigo: this.tipoAuditoria
      },
      ficha: this.infoAuditor.ficha,
      nomAudi: this.infoAuditor.nomAudi,
      apePaterno: this.infoAuditor.apePaterno,
      apeMaterno: this.infoAuditor.apeMaterno,
      fecIngreso: this.infoAuditor.fecIngreso,
      annoExp: this.infoAuditor.annoExp.split(' ')[0].trim(),
      nomCargo: this.infoAuditor.nomCargo,
      equipo: {
        codigo: this.infoAuditor.equipo.codigo,
        descripcion: this.infoAuditor.equipo.descripcion
      },
      gerencia: {
        codigo: this.infoAuditor.gerencia.codigo,
        descripcion: this.infoAuditor.gerencia.descripcion
      },
      rolAuditor: {
        codigo: this.rolAux.codigo,
        descripcion: this.rolAux.descripcion
      },
      tipoEducacion: {
        codigo: this.tipoEducacionAux.codigo,
        descripcion: this.tipoEducacionAux.descripcion
      },
      cursosNorma: this.cursosNorma,
      cursosCompletados: this.cursosCompletados,
      cursosPendientes: this.cursosPendientes,
      idUsuaCrea: AgcUtil.camposAuditoria().idUsuaCrea
    };
    console.log(this.fichaAudiRequest);
    this.enviarDatosApi();
  }

  private limpiarCursoComp(): void {
    this.cursoCompletadoAux = null;
    this.indObliCursoComp = null;
  }

  private limpiarCursoNorma(): void {
    this.cursoNormaAux = null;
    this.indObliCursoNorma = null;
  }

  private limpiarCursoPend(): void {
    this.cursoPendienteAux = null;
    this.indObliCursoPend = null;
  }

  private limpiarRowCursoComp(): void {
    this.selectedRowCursoComp = -1;
    this.selectedCursoComp = null;
  }

  private limpiarRowCursoNorma(): void {
    this.selectedRowCursoNorma = -1;
    this.selectedCursoNorma = null;
  }

  private limpiarRowCursoPend(): void {
    this.selectedRowCursoPend = -1;
    this.selectedCursoPend = null;
  }

  private mostrarMensajesError(): void {
    for (let i = 0; i < this.listaMensaje.length; i++) {
      this.toastrUtil.showWarning(this.listaMensaje[i]);
    }
    this.listaMensaje.length = 0;
  }

  public mostrarModalEliminarCursoComp(): void {
    if (this.selectedCursoComp === null) {
      this.toastrUtil.showWarning('Debe seleccionar el curso que desea eliminar');
    } else {
      this.swalEliminarCursoComp.show();
    }
  }

  public mostrarModalEliminarCursoNorma(): void {
    if (this.selectedCursoNorma === null) {
      this.toastrUtil.showWarning('Debe seleccionar la norma que desea eliminar');
    } else {
      this.swalEliminarCursoNorma.show();
    }
  }

  public mostrarModalEliminarCursoPend(): void {
    if (this.selectedCursoPend === null) {
      this.toastrUtil.showWarning('Debe seleccionar el curso que desea eliminar');
    } else {
      this.swalEliminarCursoPend.show();
    }
  }

  public mostrarModalGuardar(): void {
    switch (this.tipoAuditoria) {
      case ConstantesFichaAuditor.AUDITOR_INTERNO:
        this.validarGuardarAudiInterno();
        break;
      case ConstantesFichaAuditor.AUDITOR_EXTERNO:
        this.validarGuardarAudiExterno();
        break;
    }
    if (this.listaMensaje.length === 0) {
      this.swalGuardarFichaAudi.show();
    } else {
      this.mostrarMensajesError();
    }
  }

  public async obtenerParametros() {
    await this.fichaAuditorApi.obtenerParametros().toPromise()
      .then((response: Response) => {
        if (response.estado === 'OK') {
          const resultado: any = response.resultado;
          this.listaRol = resultado.roles;
          this.listaEducacion = resultado.educacion;
          this.listaNormas = resultado.normas;
          this.tiposAuditoria = resultado.tipoAuditoria;
        } else {
          console.error(response.error);
          this.toastrUtil.showError(response.error.mensaje);
        }
      })
      .catch(err => {
        console.error(err);
        this.toastrUtil.showError(err);
      });
  }

  public onAgregarCursoComp(): void {
    if (AgcUtil.validarCampoTexto(this.cursoCompletadoAux)) {
      if (this.indObliCursoComp != null) {
        if (this.buscarIndiceCursoComp(this.cursoCompletadoAux.trim()) === -1) {
          const cursoAuditor: CursoAuditor = {
            nomCurso: this.cursoCompletadoAux.trim(),
            indObli: this.indObliCursoComp
          };
          this.cursosCompletados.push(cursoAuditor);
        } else {
          this.toastrUtil.showWarning('El curso ingresado ya se encuentra en la lista');
        }
      } else {
        this.toastrUtil.showWarning('Por favor, seleccione los campos Curso y Obligatorio');
      }
    } else {
      this.toastrUtil.showWarning('Por favor, seleccione los campos Curso y Obligatorio');
    }
    this.limpiarCursoComp();
  }

  public onAgregarCursoNorma(): void {
    if (AgcUtil.validarCampoObjeto(this.cursoNormaAux)) {
      if (this.indObliCursoNorma != null) {
        if (this.buscarIndiceCursoNorma(this.cursoNormaAux.descripcion) === -1) {
          const cursoNorma: CursoNorma = {
            idNorma: this.cursoNormaAux.codigo,
            nomNorma: this.cursoNormaAux.descripcion,
            indObli: this.indObliCursoNorma
          };
          this.cursosNorma.push(cursoNorma);
        } else {
          this.toastrUtil.showWarning('La norma seleccionada ya se encuentra en la lista');
        }
      } else {
        this.toastrUtil.showWarning('Por favor, seleccione los campos Curso y Obligatorio');
      }
    } else {
      this.toastrUtil.showWarning('Por favor, seleccione los campos Curso y Obligatorio');
    }
    this.limpiarCursoNorma();
  }

  public onAgregarCursoPend(): void {
    if (AgcUtil.validarCampoObjeto(this.cursoPendienteAux)) {
      if (this.indObliCursoPend != null) {
        if (this.buscarIndiceCursoPend(this.cursoPendienteAux) === -1) {
          const cursoPend: CursoAuditor = {
            nomCurso: this.cursoPendienteAux,
            indObli: this.indObliCursoPend
          };
          this.cursosPendientes.push(cursoPend);
        } else {
          this.toastrUtil.showWarning('El curso ingresado ya se encuentra en la lista');
        }
      } else {
        this.toastrUtil.showWarning('Por favor, seleccione los campos Norma y Obligatorio');
      }
    } else {
      this.toastrUtil.showWarning('Por favor, seleccione los campos Norma y Obligatorio');
    }
    this.limpiarCursoPend();
  }

  public onChangeTipoAuditoria(data: any) {
    this.fichaAudiRequest = {};
    this.infoAuditor = {
      ficha: null,
      nomAudi: '',
      apePaterno: '',
      apeMaterno: '',
      auditor: '',
      annoExp: '',
      nomCargo: '',
      equipo: {
        descripcion: ''
      },
      gerencia: {
        descripcion: ''
      }
    };
  }

  public onCursoCompSelected(index: number, item: CursoAuditor): void {
    if (this.selectedRowCursoComp === index) {
      this.limpiarCursoComp();
    } else {
      this.selectedRowCursoComp = index;
      this.selectedCursoComp = item;
    }
  }

  public onCursoNormaSelected(index: number, item: CursoNorma): void {
    if (this.selectedRowCursoNorma === index) {
      this.limpiarRowCursoNorma();
    } else {
      this.selectedRowCursoNorma = index;
      this.selectedCursoNorma = item;
    }
  }

  public onCursoPendSelected(index: number, item: CursoAuditor): void {
    if (this.selectedRowCursoPend === index) {
      this.limpiarCursoPend();
    } else {
      this.selectedRowCursoPend = index;
      this.selectedCursoPend = item;
    }
  }

  public onGuardar(): void {
    switch (this.tipoAuditoria) {
      case ConstantesFichaAuditor.AUDITOR_INTERNO:
        this.guardarFichaAudiInterno();
        break;
      case ConstantesFichaAuditor.AUDITOR_EXTERNO:
        this.guardarFichaAudiExterno();
        break;
    }
  }

  public onEliminarCursoComp(): void {
    if (this.selectedCursoComp !== null) {
      const indiceEliminar: number = this.buscarIndiceCursoComp(this.selectedCursoComp.nomCurso);
      this.cursosCompletados.splice(indiceEliminar, 1);
      this.limpiarRowCursoComp();
    }
  }

  public onEliminarCursoNorma(): void {
    if (this.selectedCursoNorma !== null) {
      const indiceEliminar: number = this.buscarIndiceCursoNorma(this.selectedCursoNorma.nomNorma);
      this.cursosNorma.splice(indiceEliminar, 1);
      this.limpiarRowCursoNorma();
    }
  }

  public onEliminarCursoPend(): void {
    if (this.selectedCursoPend !== null) {
      const indiceEliminar: number = this.buscarIndiceCursoPend(this.selectedCursoPend.nomCurso);
      this.cursosPendientes.splice(indiceEliminar, 1);
      this.limpiarRowCursoPend();
    }
  }

  OnRegresar() {
    this.router.navigateByUrl('/auditoria/registro-auditor');
  }

  public validarGuardarAudiExterno(): void {
    if (!AgcUtil.validarCampoTexto(this.fichaAudiRequest.nomEmpre)) {
      this.listaMensaje.push('Por favor, ingrese el nombre de la empresa');
    }
    if (!AgcUtil.validarCampoTexto(this.fichaAudiRequest.nomAudi)) {
      this.listaMensaje.push('Por favor, ingrese el nombre del colaborador');
    }
    if (!AgcUtil.validarCampoTexto(this.fichaAudiRequest.apePaterno)) {
      this.listaMensaje.push('Por favor, ingrese el apellido paterno del colaborador');
    }
    if (!AgcUtil.validarCampoTexto(this.fichaAudiRequest.apeMaterno)) {
      this.listaMensaje.push('Por favor, ingrese el apellido materno del colaborador');
    }
  }

  public validarGuardarAudiInterno(): void {
    if (this.infoAuditor.ficha === null) {
      this.listaMensaje.push('Por favor, seleccione un colaborador');
    }
    if (!AgcUtil.validarCampoObjeto(this.rolAux)) {
      this.listaMensaje.push('Por favor, seleccione un Rol');
    }
    if (!AgcUtil.validarCampoObjeto(this.tipoEducacionAux)) {
      this.listaMensaje.push('Por favor, seleccione el tipo de Educacion');
    }
    if (this.cursosNorma.length === 0) {
      this.listaMensaje.push('Por favor, ingrese normas en la pestaña cursos');
    }
    if (this.cursosCompletados.length === 0) {
      this.listaMensaje.push('Por favor, ingrese los cursos llevados, en la pestaña cursos');
    }
    if (this.cursosPendientes.length === 0) {
      this.listaMensaje.push('Por favor, ingrese los cursos por llevar, en la pestaña cursos');
    }
  }

}


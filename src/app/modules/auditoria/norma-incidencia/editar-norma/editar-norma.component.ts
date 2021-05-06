import { Component, OnInit, OnDestroy } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { Paginacion } from 'src/app/models';
import { Norma } from 'src/app/models/norma';
import { NormaIncidenciaService } from 'src/app/services';
import { TipoNormasService } from 'src/app/services/impl/tipo-normas.service';
import { ToastrService } from 'ngx-toastr';
import { Constante } from 'src/app/models/constante';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { BsLocaleService } from 'ngx-bootstrap';
import { Response } from './../../../../models/response';
import { NgxSpinnerService } from 'ngx-spinner';
import { DatosAuditoria } from 'src/app/models/datosAuditoria';

@Component({
  selector: 'app-editar-norma',
  templateUrl: './editar-norma.component.html',
  styleUrls: ['./editar-norma.component.scss']
})
export class EditarNormaComponent implements OnInit, OnDestroy {

  private sub: any;
  paginacion: Paginacion;
  idNorma: number;
  norma: Norma;
  listaNormas: Norma[];
  listaTiposNormas: Constante[];
  modelTipoNorma: Constante;
  validateNombre: boolean;
  usuario: any;
  estado: string;

  constructor(private localeService: BsLocaleService,
    private router: Router,
    private route: ActivatedRoute,
    private service: NormaIncidenciaService,
    private serviceTN: TipoNormasService,
    private toastr: ToastrService,
    private spinner: NgxSpinnerService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.norma = new Norma();
    this.modelTipoNorma = new Constante();
    this.listaNormas = [];
    this.listaTiposNormas = [];
    this.sub = this.route.params.subscribe(params => {
      this.idNorma = +params['id'];
    });
    this.onInicializarListas();
    this.validateNombre = false;
    this.usuario = JSON.parse(sessionStorage.getItem('currentUser'));
  }

  onRegresar() {
    this.router.navigate([`auditoria/norma-incidencia`]);
  }

  onInicializarListas() {
    this.onObtenerNormas();
    setTimeout(() => {
      this.onObtenerTiposNormas();
    }, 400);
  }

  onObtenerNormas() {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.service.listarNormasAuditoria(this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaNormas = response.resultado;
        this.norma = this.listaNormas.find(x => x.n_id_normas === this.idNorma);
        this.estado = this.norma.v_st_reg === '1' ? 'Activo' : 'Eliminado';
        this.paginacion = new Paginacion(response.paginacion);
      },
      (error) => this.controlarError(error)
    );
  }

  onObtenerTiposNormas() {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.serviceTN.obtenerTipoNormas(this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaTiposNormas = response.resultado;
        this.modelTipoNorma = new Constante();
        this.modelTipoNorma = this.listaTiposNormas.find(x => x.v_valcons === this.norma.v_tipo);
      },
      (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  onValidarCampo(): boolean {
    this.validateNombre = false;
    if (this.norma.v_nom_norma === '' ||
      this.norma.v_nom_norma === null ||
      this.norma.v_nom_norma === undefined) {
      this.toastr.error('Por favor, completar todos los campos obligatorios (*).', 'Acción inválida', { closeButton: true });
      this.validateNombre = true;
    }
    return this.validateNombre;
  }

  onGuadar() {
    if (!this.onValidarCampo()) {
      this.spinner.show();
      this.norma.datosAuditoria = new DatosAuditoria();
      this.norma.datosAuditoria.usuarioModificacion = this.usuario.codUsuario;
      this.service.updateNormasAuditoria(this.norma).subscribe(
        (response: Response) => {
          if (response.resultado === 0) {
            this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
            this.router.navigate([`auditoria/norma-incidencia`]);
          }
          this.spinner.hide();
        },
        (error) => this.controlarError(error)
      );
    }
  }

  ngOnDestroy() {
    this.sub.unsubscribe();
  }

}

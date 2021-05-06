import { Component, OnInit, SecurityContext } from '@angular/core';
import { BsLocaleService, BsModalService } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { NormaIncidenciaService, GeneralService } from 'src/app/services';
import { DomSanitizer } from '@angular/platform-browser';
import { Constante } from 'src/app/models/constante';
import { Paginacion } from 'src/app/models';
import { Response } from './../../../../models/response';
import { Norma } from 'src/app/models/norma';
import { TipoNormasService } from 'src/app/services/impl/tipo-normas.service';

@Component({
  selector: 'app-lista-normas-incidencias',
  templateUrl: './lista-normas-incidencias.component.html',
  styleUrls: ['./lista-normas-incidencias.component.scss']
})
export class ListaNormasIncidenciasComponent implements OnInit {

  parametroBusqueda: number;
  listaTiposNormas: Constante[];
  listaFiltros: { key: number, value: string }[];
  paginacion: Paginacion;
  modelTipoNorma: Constante;
  mostrarAlerta: boolean;
  mensajeAlerta: string;
  listaNormas: Norma[];
  maxIdNorma: number;

  constructor(LocaleService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private service: NormaIncidenciaService,
    private serviceTN: TipoNormasService,
    private modalService: BsModalService,
    private generalService: GeneralService,
    private sanitizer: DomSanitizer) { }

  ngOnInit() {
    /* this.valorTipo = '';
     this.valorNormas = '';*/
    this.onListaFiltros();
    this.onObtenerTiposNormas();
    this.mensajeAlerta = '';
    this.mostrarAlerta = false;
    const codigoTipo = localStorage.getItem('codigoTipo');
    if (codigoTipo !== null) {
      this.onObtenerNormas();
    }
    localStorage.removeItem('codigoTipo');
  }

  onLimpiar() {
    this.listaNormas = []
  }

  onListaFiltros() {
    this.listaFiltros = [
      { key: 1, value: 'Tipo' },
      { key: 2, value: 'Normas' },
      { key: 3, value: 'Busqueda Avanzada' }
    ];
    this.parametroBusqueda = this.listaFiltros[0].key;
  }

  onObtenerTiposNormas() {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.serviceTN.obtenerTipoNormas(this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaTiposNormas = response.resultado;
      },
      (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    // this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  activarOpcion(accion: number) {
    switch (accion) {
      case 1:
        this.parametroBusqueda = this.listaFiltros[0].key;
        if (this.modelTipoNorma) {
          if (this.modelTipoNorma.v_valcons === '0') { // incidencias
            this.listaNormas = [];
          } else if (this.modelTipoNorma.v_valcons === '1') { // normas
            this.onObtenerNormas();
          }
        } else {
          this.listaNormas = [];
        }
        break;
      case 2:
        this.parametroBusqueda = this.listaFiltros[1].key;
        this.onObtenerNormas();
        break;
      case 3:
        this.parametroBusqueda = this.listaFiltros[2].key;
        break;

    }
  }

  onObtenerNormas() {
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.service.listarNormasAuditoria(this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        this.listaNormas = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        if (this.listaNormas) {
          this.maxIdNorma = Math.max(...this.listaNormas.map(x => x.n_id_normas), 0);
        }
      },
      (error) => this.controlarError(error)
    );
  }


  onBuscar() {
    if (this.modelTipoNorma) {
      if (this.modelTipoNorma.v_valcons === '0') { // incidencias
        this.listaNormas = [];
      } else if (this.modelTipoNorma.v_valcons === '1') { // normas
        this.onObtenerNormas();
      }
    } else {
      this.listaNormas = [];
    }
    this.onMostrarMensajeFiltros();
  }

  onModificar(item: Norma) {
    this.router.navigate([`auditoria/norma-incidencia/editar/${item.n_id_normas}`]);
  }

  onEliminar(obj: Norma): void {
    obj.v_st_reg = '0';
    this.service.updateNormasAuditoria(obj).subscribe(
      (response: Response) => {
        if (response.resultado === 0) {
          this.toastr.error('Registro eliminado', 'Acción completada!', { closeButton: true });
          this.onObtenerNormas();
        }
      },
      (error) => this.controlarError(error)
    );
  }

  onMostrarMensajeFiltros() {
    this.mostrarAlerta = false;

    let texto = "<strong>Búsqueda Por:</strong>"
    if (this.modelTipoNorma) {
      if (this.modelTipoNorma.v_valcons === '0') { // incidencias
        texto = texto + "<br/><strong>Descripción: </strong>" + this.modelTipoNorma.v_descons;
        this.mostrarAlerta = true;
      } else if (this.modelTipoNorma.v_valcons === '1') { // normas
        texto = texto + "<br/><strong>Descripción: </strong>" + this.modelTipoNorma.v_descons;
        this.mostrarAlerta = true;
      }
    } else {
      this.mostrarAlerta = false;
    }

    if (this.mostrarAlerta) {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
    }

  }

}

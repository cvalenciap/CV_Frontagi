import { Component, OnInit, SecurityContext } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../../services';
import { BandejaDocumento } from '../../../../models/bandejadocumento';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DomSanitizer } from '@angular/platform-browser';
import { PlantillaService } from 'src/app/services/impl/plantilla.service';
import { Plantilla } from 'src/app/models/plantilla';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Parametro } from 'src/app/models';
import { SessionService } from 'src/app/auth/session.service';

declare var jQuery: any;

@Component({
  selector: 'consultas',
  templateUrl: 'consultas.template.html',
  providers: [BandejaDocumentoService]
})
export class BandejaSolicitudConsultasComponent implements OnInit {

  loading: boolean;
  paginacion: Paginacion;
  selectedRow: number;
  activar: boolean;
  bsModalRef: BsModalRef;
  selectedFilter: string;
  busquedaBandejaDocumento: BandejaDocumento;
  textoBusqueda: string;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  deshabilitarBuscar: boolean;
  selectedObject: Plantilla;
  items: Plantilla[];
  reserva: Plantilla[];
  listaTemp: Plantilla[];
  prueba: string[];
  busqueda: boolean;
  public listaTipoPlantilla: Array<Parametro>;
  public listaTipoPlantillaReserva: Array<Parametro>;
  indicador: boolean;
  contador: number;
  ListaModulo: string;
  textoBusquedaPa: string;
  textoBusquedaIni: string;
  valorPaginacion: number;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private parametroService: ParametrosService,
    private route: ActivatedRoute,
    private service: PlantillaService,
    private modalService: BsModalService,
    private sanitizer: DomSanitizer,
    public session: SessionService) {
    this.loading = false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.paginacion = new Paginacion({ registros: 10 });
    this.selectedRow = -1;
    this.items = [];
    this.reserva = [];
    this.listaTemp = [];
    this.contador = 0;
    this.busqueda = false;
    this.indicador = true;
    this.prueba = [];
    this.selectedFilter = 'tipo';
    this.deshabilitarBuscar = true;
    this.valorPaginacion = 0;
  }

  ngOnInit() {
    
    this.textoBusqueda = "";
    this.OnBuscar();
  }

  getLista(): void {
    this.loading = true;
    const parametros: { desplan: string } = { desplan: null };
    if (this.textoBusqueda != "") { parametros.desplan = this.textoBusqueda; }      
    this.textoBusquedaIni = this.textoBusqueda;    

    this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {        
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.valorPaginacion = 0;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
  }

  limpiar() {
    this.textoBusqueda = "";
    this.paginacion.pagina = 1;
    this.valorPaginacion = 0;
    this.OnBuscar();
    this.mostrarAlerta = false;
    this.deshabilitarBuscar = true;
  }

  setFilter(filter: string) {
    this.selectedFilter = filter;
  }

  habilitarBuscar(): void {
    if (this.textoBusqueda != '') {
      this.deshabilitarBuscar = false;
      this.indicador = false;
    }
    else
      this.deshabilitarBuscar = true;
  }
  

  OnBuscar(): void {
    this.contador = 0;
    this.valorPaginacion = 1;
    this.listaTemp = [];
    let texto: string = "<strong>Busqueda Por: </strong>";
    texto = texto + "<br/><strong>Descripción: </strong>" + this.textoBusqueda;

    if (this.textoBusqueda.trim() != '') {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    } else {
      this.textoBusqueda = '';
      this.mostrarAlerta = false;
    }
    
    this.getLista();
   
  }

  OnRegresar() {
    this.router.navigate(['documento/consultas']);
    localStorage.setItem("ListaPlantilla", this.ListaModulo);
  }

  OnCargar() {
    this.router.navigate([`documento/consultas/bandeja-documento-modales-subir-archivo`]);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }
  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });

  }

  obtenerParametrosPaginacion(){
    this.textoBusquedaPa = this.textoBusquedaIni;
    this.textoBusqueda = this.textoBusquedaPa;
  }

  OnPageChanged(event): void {
    
    this.paginacion.pagina = event.page;
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    }
    this.OnBuscar();
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    if (this.valorPaginacion == 0) {
      this.obtenerParametrosPaginacion();
    }
    this.OnBuscar();
  }


  onEliminar(plantilla: Plantilla) {
    
    this.service.Eliminar(plantilla).subscribe(
      (response: Response) => {
        
        if (response.resultado) {
          this.indicador = true;
          this.getLista();
          this.toastr.success('Descarga de Videos y Plantillas del Sistema', 'Registro Eliminado');
        }
      },
      (error) => this.controlarError(error)
    );
  }

  abrir(enlace) {
    location.href = enlace;
  }

}
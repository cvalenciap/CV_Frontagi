import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../../services';
import { Response } from '../../../../models/response';
import { Paginacion } from '../../../../models/paginacion';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Jerarquia } from 'src/app/models/jerarquia';
import { Parametro, RevisionDocumento } from 'src/app/models';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { BusquedaProgramacionComponent } from 'src/app/modules/bandejadocumento/programacion/modales/busqueda-programacion.component';
import { DatePipe } from '@angular/common';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { SessionService } from 'src/app/auth/session.service';
import { RetornosBusqueda } from 'src/app/models/retornosBusqueda';
import { PaginacionSetComponent } from 'src/app/components/common/paginacion/paginacion-set.component';
import { ViewChild } from '@angular/core';

declare var jQuery: any;

@Component({
  selector: 'programacion-lista',
  templateUrl: 'lista.template.html',
  providers: [BandejaDocumentoService]
})
export class ProgramacionListaComponent implements OnInit {
  @ViewChild('pageOption') pageOption: PaginacionSetComponent;
  items: any;
  textoBusqueda: string;
  parametroBusqueda: string;
  paginacion: Paginacion;
  selectedRow: number;
  selectedObject: Jerarquia;
  loading: boolean;
  deshabilitarBuscar: boolean;
  mensajeInformacion: string;
  mostrarInformacion: boolean;
  mensajeAlerta: string;
  mostrarAlerta: boolean;
  textoMenu: string;
  listaEstados: any;
  parametroBusquedaAnterior: string;
  textoBusquedaAnterior: string;
  textoMenuAnterior: string;
  bsModalRef: BsModalRef;
  descripcionMostrar: string;
  RevisionDocumento: any;
  objetoBusqAvanz: RevisionDocumento;
  deshabilitarTextoBuscar: boolean;
  tipoBusqueda: number;
  objetoRetornoBusqueda:RetornosBusqueda;
  valorPaginacion: number;
  parametroBusquedaPa: string;
  textoBusquedaPa: string;
  IndicadorPagina: number;
  paginaRetorno: number;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private service: RevisionDocumentoService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService,
    private datePipe: DatePipe,
    public session: SessionService
  ) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.parametroBusquedaAnterior = this.parametroBusqueda;
    this.paginacion = new Paginacion({ registros: 10 });
    this.deshabilitarBuscar = true;
    this.mostrarAlerta = false;
    this.mostrarInformacion = false;
    this.textoMenu = null;
    this.objetoBusqAvanz = new RevisionDocumento();
    this.deshabilitarTextoBuscar = false;
    this.objetoRetornoBusqueda = new RetornosBusqueda();
    this.valorPaginacion = 0;
    this.IndicadorPagina = 0;
  }

  ngOnInit() {
    
    if (localStorage.getItem("objetoRetornoBusqueda")!=undefined || localStorage.getItem("objetoRetornoBusqueda")!=null) {
      
      this.objetoRetornoBusqueda = JSON.parse(localStorage.getItem("objetoRetornoBusqueda"));
            
      if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
        this.OnBuscarRetorno();
      } else if(this.objetoRetornoBusqueda.tipoBusqueda == 2){
        this.busquedaAvanzadaRetorno();
      }
      
      if (this.paginacion.registros > 10) {
        this.paginaRetorno = this.paginacion.pagina;
        this.pageOption.change(this.paginacion.registros);
        if (this.paginaRetorno > 1) {
          this.OnPageChangedReturn(this.paginaRetorno, this.paginacion.registros);
        }
      } else {
        this.OnPageChangedReturn(this.paginacion.pagina, this.paginacion.registros);
      }

    }else{
      this.textoBusqueda = '';
      this.parametroBusqueda = 'codigo';
      this.tipoBusqueda = 1;
      this.mostrarAlerta = false;
      this.OnBuscar();
    }

  }

  busquedaSimple() {
    this.paginacion.pagina = 1;
    this.valorPaginacion = 1;
    this.tipoBusqueda = 1;
    this.OnBuscar();
  }

  OnBuscar() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    if (this.textoBusqueda.trim() != '') {
      switch (this.parametroBusqueda) {
        case 'codigo':
          texto = texto + "<br/><strong>Número de Programación: </strong>" + this.textoBusqueda;
          break;
      }
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;

    } else {

      this.textoBusqueda = '';
      this.mostrarAlerta = false;

    }

    this.getLista(null);
  }

  OnBuscarRetorno() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusqueda = this.objetoRetornoBusqueda.textoBusqueda;
    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;
    this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;

    if (this.textoBusqueda.trim() != '') {
      switch (this.parametroBusqueda) {
        case 'codigo':
          texto = texto + "<br/><strong>Número de Programación: </strong>" + this.textoBusqueda;
          break;
      }
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;

    } else {

      this.textoBusqueda = '';
      this.mostrarAlerta = false;

    }

    this.getLista(null);
  }

  getLista(objetoBusqAvanz: RevisionDocumento): void {
    this.objetoRetornoBusqueda = new RetornosBusqueda();

    this.loading = true;
    const parametros: { codigo?: string, anio?: string, estados?: string } = { codigo: null, anio: null, estados: null };

    this.objetoRetornoBusqueda.pagina = this.paginacion.pagina;
    this.objetoRetornoBusqueda.registros = this.paginacion.registros;
    this.objetoRetornoBusqueda.tipoBusqueda = this.tipoBusqueda;
    this.objetoRetornoBusqueda.parametroBusqueda = this.parametroBusqueda;

    if (objetoBusqAvanz) {

      if (this.objetoBusqAvanz.codigo) { parametros.codigo = this.objetoBusqAvanz.codigo; this.objetoRetornoBusqueda.objetoRevisionDocumento.codigo = this.objetoBusqAvanz.codigo;}
      if (this.objetoBusqAvanz.anio) { parametros.anio = this.objetoBusqAvanz.anio.toString();this.objetoRetornoBusqueda.objetoRevisionDocumento.anio = this.objetoBusqAvanz.anio}
      if (this.objetoBusqAvanz.estados) { 
        parametros.estados = this.objetoBusqAvanz.estados.toString();
        this.objetoRetornoBusqueda.objetoRevisionDocumento.estados = this.objetoBusqAvanz.estados;
        this.objetoRetornoBusqueda.objetoRevisionDocumento.desestado = this.objetoBusqAvanz.desestado
      }

     } else {
      if (this.parametroBusqueda === 'codigo') { parametros.codigo = this.textoBusqueda; this.objetoRetornoBusqueda.textoBusqueda = this.textoBusqueda;}
    }

    localStorage.removeItem("objetoRetornoBusqueda"); 
    localStorage.setItem("objetoRetornoBusqueda", JSON.stringify(this.objetoRetornoBusqueda));

    this.service.buscarParametrosProgramacion(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {
        let listaProgramacion: RevisionDocumento[] = response.resultado;
        listaProgramacion.forEach(documento => {
          if (documento.fecCreProg != null) {
            documento.fecCreProg = this.datePipe.transform(documento.fecCreProg, "dd/MM/yyyy");
            documento.fechModProg = this.datePipe.transform(documento.fechModProg, "dd/MM/yyyy");
          } else {
            documento.fecCreProg = " ";
            documento.fechModProg = " ";
          }
        });
        this.items = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        this.valorPaginacion = 0;
        this.IndicadorPagina = 0;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );

  }

  abrirBusquedaAvanzada() {
    this.mostrarInformacion = false;
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      initialState: {
      },
      class: 'modal-md'
    }
    this.bsModalRef = this.modalService.show(BusquedaProgramacionComponent, config);
    (<BusquedaProgramacionComponent>this.bsModalRef.content).onClose.subscribe(result => {
      let objeto: RevisionDocumento = result;
      this.paginacion.pagina = 1;
      this.tipoBusqueda = 2;
      this.objetoBusqAvanz = objeto;
      this.busquedaAvanzada();
    });
  }

  busquedaAvanzada() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    if (this.objetoBusqAvanz.codigo) {
      texto = texto + "<br/><strong>Número de Programación: </strong>" + this.objetoBusqAvanz.codigo + " ";
    }
    if (this.objetoBusqAvanz.anio) {
      texto = texto + "<br/><strong>Año: </strong>" + this.objetoBusqAvanz.anio + " ";
    }
    if (this.objetoBusqAvanz.estados) {
      texto = texto + "<br/><strong>Estado: </strong>" + this.objetoBusqAvanz.desestado + " ";
    }

    if (this.objetoBusqAvanz.codigo == undefined && this.objetoBusqAvanz.anio == 0 && this.objetoBusqAvanz.estados == 0) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }

    this.getLista(this.objetoBusqAvanz);
  }

  busquedaAvanzadaRetorno() {
    let texto: string = "<strong>Busqueda Por: </strong>";

    this.objetoBusqAvanz = new RevisionDocumento();

    this.objetoBusqAvanz.codigo = this.objetoRetornoBusqueda.objetoRevisionDocumento.codigo;
    this.objetoBusqAvanz.anio = this.objetoRetornoBusqueda.objetoRevisionDocumento.anio;
    this.objetoBusqAvanz.estados = this.objetoRetornoBusqueda.objetoRevisionDocumento.estados;

    this.paginacion.pagina = this.objetoRetornoBusqueda.pagina;
    this.paginacion.registros = this.objetoRetornoBusqueda.registros;
    this.tipoBusqueda = this.objetoRetornoBusqueda.tipoBusqueda;
    this.parametroBusqueda = this.objetoRetornoBusqueda.parametroBusqueda;

    if (this.objetoBusqAvanz.codigo) {
      texto = texto + "<br/><strong>Número de Programación: </strong>" + this.objetoBusqAvanz.codigo + " ";
    }
    if (this.objetoBusqAvanz.anio) {
      texto = texto + "<br/><strong>Año: </strong>" + this.objetoBusqAvanz.anio + " ";
    }
    if (this.objetoBusqAvanz.estados) {
      texto = texto + "<br/><strong>Estado: </strong>" + this.objetoBusqAvanz.desestado + " ";
      this.objetoBusqAvanz.desestado = this.objetoRetornoBusqueda.objetoRevisionDocumento.desestado; 
    }

    if (this.objetoBusqAvanz.codigo == undefined && this.objetoBusqAvanz.anio == 0 && this.objetoBusqAvanz.estados == 0) {
      this.mostrarAlerta = false;
    } else {
      this.mensajeAlerta = this.sanitizer.sanitize(SecurityContext.HTML, texto);
      this.mostrarAlerta = true;
    }

    this.getLista(this.objetoBusqAvanz);
  }
  

  ingresoTexto(event) {
    const key = window.event ? event.which : event.keyCode;
    if (this.parametroBusqueda === 'codigo') {
      if (key < 48 || key > 57) {
        event.preventDefault();
      }
    }
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    if(this.tipoBusqueda==1){
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      if (this.IndicadorPagina == 0) {
        this.IndicadorPagina = 0;
        this.OnBuscar();
      }
    }else if(this.tipoBusqueda==2){
      if (this.IndicadorPagina == 0) {
        this.IndicadorPagina = 0;
        this.busquedaAvanzada();
      }
    }
    
  } 

  OnPageChangedReturn(pagina:number, registros:number): void {
    this.paginacion.registros = registros;
    this.paginacion.pagina = pagina;
    if (this.objetoRetornoBusqueda.tipoBusqueda == 1) {
      this.OnBuscar();
    } else if (this.objetoRetornoBusqueda.tipoBusqueda == 2) {
      this.busquedaAvanzada();
    }
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.IndicadorPagina=1;

    if(this.tipoBusqueda==1){
      if (this.valorPaginacion == 0) {
        this.obtenerParametrosPaginacion();
      }
      this.OnBuscar();
    }else if(this.tipoBusqueda==2){
      this.busquedaAvanzada();
    }
  }

  obtenerParametrosPaginacion(){
    
    this.parametroBusquedaPa = this.objetoRetornoBusqueda.parametroBusqueda;
    this.textoBusquedaPa = this.objetoRetornoBusqueda.textoBusqueda;
    
    this.parametroBusqueda = this.parametroBusquedaPa;
    this.textoBusqueda = this.textoBusquedaPa;

  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }

  OnModificar(idProg, idEstProg): void {
    this.router.navigate([`documento/programacion/programacion/editar/${idProg}/${idEstProg}`]);
  }

  OnEliminar(paramDelete: string) {
    
    this.service.eliminarProgramacion(paramDelete).subscribe(
      (response: Response) => {
        if (response.resultado) {
          if (paramDelete) {
            this.items = this.items.filter(item => item.id != Number(paramDelete));
            this.OnBuscar();
          } else {
            this.items = [];
            this.paginacion = new Paginacion({ registros: 10 });
          }
          this.toastr.success('Revisión de Documentos - Programación', 'Registro Eliminado');
        }
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );
    this.mostrarInformacion = false;
  }

  OnLimpiar() {
    localStorage.removeItem("objetoRetornoBusqueda");
    this.textoBusqueda = '';
    this.valorPaginacion = 0;
    this.paginacion.pagina = 1;
    this.IndicadorPagina = 0;
    this.parametroBusqueda = 'codigo';
    this.tipoBusqueda = 1;
    this.OnBuscar();
    this.mostrarAlerta = false;
    this.mensajeAlerta = '';
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  permitirNumero(evento): void {
    if (!(evento.which >= 48 && evento.which <= 57))
      evento.preventDefault();
  }

  habilitarBuscar(): void {
    if (this.textoBusqueda) {
      this.deshabilitarBuscar = false;
    } else {
      this.deshabilitarBuscar = true;
    }
  }

  habilitarBuscarNumero(): void {
    if (this.textoBusqueda != null) {
      if (this.textoBusqueda != "") {
        this.deshabilitarBuscar = false;
      } else {
        this.deshabilitarBuscar = true;
      }
    } else {
      this.deshabilitarBuscar = true;
    }
  }

  obtenerTextoEstado(): void {
    this.textoMenu = this.listaEstados.find(resultado => (resultado.id + "") == this.textoBusqueda).valor;
  }

}
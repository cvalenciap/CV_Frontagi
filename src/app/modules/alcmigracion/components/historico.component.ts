import { Component, OnInit, Input } from '@angular/core';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';

import { BandejaDocumentoService } from '../../../services';
import { Programa } from 'src/app/models/programa';
import { DocumentoMigracion } from 'src/app/models/documentomigracion';

@Component({
  selector: 'historico-documento',
  templateUrl: 'historico.template.html'
})
export class HistoricoComponent implements OnInit {
  selectedRow: number;
  loading: boolean;
  valorBusqueda: string;
  opcionBusqueda: string;
  textoInformativo: string;
  paginacion: Paginacion;
  items: DocumentoMigracion[]; 

  constructor(private sanitizer: DomSanitizer, 
              private service: BandejaDocumentoService,
              private toastr: ToastrService,
              private router: Router) {
    this.selectedRow = -1;
    this.loading = false;
    this.opcionBusqueda = 'codigo';
    this.textoInformativo = "";
    this.paginacion = new Paginacion({ registros: 10 });
    this.items = [];
  }

  ngOnInit() {

  }

  OnVerElementoOpcionBusqueda(opcion: string): void {
    this.opcionBusqueda = opcion;
    this.valorBusqueda = null;
  }
  filterBy(prop: string) {    
    return this.items.sort((a, b) => a[prop] > b[prop] ? 1 : a[prop] === b[prop] ? 0 : -1);
  }
  OnBuscar(): void {    
    this.selectedRow = -1;
    if(this.valorBusqueda){
      const parametros: { codigo?: string, titulo?: string} = { codigo: null, titulo: null };
      parametros.codigo = this.opcionBusqueda == "codigo" ? this.valorBusqueda : null;
      parametros.titulo = this.opcionBusqueda == "titulo" ? this.valorBusqueda : null;

      this.service.buscarPorParametrosHistory(parametros,this.paginacion.pagina,this.paginacion.registros).subscribe(
        (response: Response) => {
          this.items = response.resultado;
          
          this.paginacion = new Paginacion(response.paginacion);
          this.loading = false;
          this.OnVerCriterioBusqueda();
      },
      (error) => this.controlarError(error)
      );      
    }    
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }

  OnVerCriterioBusqueda(): void {
    this.textoInformativo = "<strong>Búsqueda Por:</strong>"
    if (this.opcionBusqueda == "codigo") {
      this.textoInformativo = this.textoInformativo + "<br/><strong>" + "Código" + ": </strong>" + this.valorBusqueda;
    }
    if (this.opcionBusqueda == "titulo") {
      this.textoInformativo = this.textoInformativo + "<br/><strong>" + "Titulo" + ": </strong>" + this.valorBusqueda;
    }
    this.textoInformativo = this.sanitizer.sanitize(SecurityContext.HTML, this.textoInformativo);
  }

  OnVerDetalle(objetoSeleccionado: Programa): void{
    sessionStorage.setItem('objDocumento', JSON.stringify(objetoSeleccionado));
    this.router.navigate([`documento/migracion/historico-documento-detalle`]);
  }

  OnPageOptionChanged(event): void {
    this.paginacion.registros = 100; //event.rows;
    this.paginacion.pagina = 1;
    this.OnBuscar();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.OnBuscar();
  }
  
  OnRowClick(index): void {
    this.selectedRow = index;
  }

}
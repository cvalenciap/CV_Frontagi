import {Component, OnInit,ViewChild} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {JerarquiasService} from '../../../services';
import {Tipo} from '../../../models/tipo';
import {Estado} from '../../../models/enums/estado';
import {Jerarquia} from '../../../models/jerarquia';
import {Response} from '../../../models/response';
//busqueda avanzada
import {FiltroDocumento} from '../../../models';
//buscar documento
import {BuscarDocumentoComponent} from '../../dialogs/buscar-documento/buscar-documento.component';

@Component({
  selector: 'jerarquia-editar-jerarquia',
  templateUrl: 'editarjerarquia.template.html',
  providers: [JerarquiasService]
})
export class EditarJerarquiaComponent implements OnInit {

  /* codigo seleccionado*/
  itemCodigo: number;
  /* datos */
  listaTipos: Tipo[];
  item: Jerarquia;
  filtroAvanzado: FiltroDocumento;
  private sub: any;

  /* cuadro de dialogo Busqueda Avanzada */
  @ViewChild(BuscarDocumentoComponent) busquedaAvanzada;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: JerarquiasService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.filtroAvanzado = new FiltroDocumento();
  }

  ngOnInit() {

    // this.service.obtenerTipos(null,null).subscribe(
    //   (response: Response) => this.listaTipos = response.resultado
    //   //(error) => this.controlarError(error)
    // );

    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
    });
    if (this.itemCodigo) {
      this.service.buscarPorCodigo(this.itemCodigo).subscribe(
        (response: Response) => this.item = response.resultado,
        //    (error) => this.controlarError(error)
      );
    } else {
      this.item = this.service.crear();
      //this.item.tipo = this.listaTipos[0];
    }
  }
  //Busqueda Avanzada
  OnBusquedaAvanzada() {
    this.filtroAvanzado = this.busquedaAvanzada.filtrosBusqueda;
    console.log(this.filtroAvanzado);
  }
  OnGuardar() {
    
    this.service.guardar(this.item).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`documento/jerarquias`]);
      }
      //  (error) => this.controlarError(error)
    );
  }
  OnRegresar() {
    this.router.navigate([`documento/jerarquias/registrar`]);
  }
  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
}



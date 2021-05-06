import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {RutaResponsablesService} from '../../../services';
import {Tipo} from '../../../models/tipo';
import {Estado} from '../../../models/enums/estado';
import {RutaResponsable} from '../../../models/rutaresponsable';
import {Response} from '../../../models/response';
//FeriadosMockService as
@Component({
  selector: 'rutaresponsable-editar',
  templateUrl: 'editarresponsable.template.html',
  providers: [RutaResponsablesService]
})
export class EditarResponsableComponent implements OnInit {

  /* codigo seleccionado*/
  itemCodigo: number;
  /* datos */
  listaTipos: Tipo[];
  item: RutaResponsable;
  private sub: any;

  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: RutaResponsablesService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
  }

  ngOnInit() {
    this.service.obtenerTipos().subscribe(
      (response: Response) => this.listaTipos = response.resultado
      //(error) => this.controlarError(error)
    );

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
  OnGuardar() {
    this.service.guardar(this.item).subscribe(
      (response: Response) => {
        this.item = response.resultado;
        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
        this.router.navigate([`mantenimiento/rutaresponsable`]);
      }
      //  (error) => this.controlarError(error)
    );
  }
  OnRegresar() {
    this.router.navigate([`mantenimiento/rutaresponsables/registrar`]);
  }
  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
}


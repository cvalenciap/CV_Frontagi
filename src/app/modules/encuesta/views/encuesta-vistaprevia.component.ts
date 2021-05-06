import { Component, OnInit } from '@angular/core';

//import { DetalleProgramacion } from 'src/app/models/detalleprogramacion';
//import { Paginacion, Tipo } from './../../../../../app/models';
import { BsLocaleService, defineLocale, esLocale, BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { Router, ActivatedRoute } from '@angular/router';
import { Response } from '../../../models/response';
//import { EvaluacionEditorMockService as EvaluacionEditorService} from './../../../../services/index';
import { EvaluacionEditor } from 'src/app/models/evaluacioneditor';
import { Paginacion, Tipo } from 'src/app/models';
import { EncuestaService } from 'src/app/services';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { Subject } from 'rxjs';
import { DetalleEncuesta } from 'src/app/models/detalle-encuesta';
//import { ModalDetalleProgramacionComponent } from '../../modales/modal-detalle-programacion/modal-detalle-programacion.component';

@Component({
  selector: 'app-encuesta-vistaprevia',
  templateUrl: './encuesta-vistaprevia.component.html',
  styleUrls: ['./encuesta-vistaprevia.component.scss']
})
export class VistaPreviaComponent implements OnInit {
  public onClose: Subject<RutaParticipante>;

  fechaProgramacionDefecto: string;
  usuarioCreacionDefecto: string;

  /* datos */
  items: string[];
  /* filtros */
  textoBusqueda: string;
  parametroBusqueda: string;
  /* paginación */
  paginacion: Paginacion;
  /* registro seleccionado */
  selectedRow: number;
  //selectedObject: RutaResponsable;
  /* indicador de carga */
  loading: boolean;
  itemCodigo: number;
  itemEncu: any;
  codigoEncu: any;
  textoEncu: any;
  listaPreguntas: DetalleEncuesta[];
  /* datos */

  //selectedObject: DetalleProgramacion;
  listaTipos: Tipo[];
  item: DetalleEncuesta;
  private sub: any;


  constructor(
    public bsModalRef: BsModalRef,
    private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: EncuestaService,
    private modalService: BsModalService
  ) {
    this.loading = false;
    this.selectedRow = -1;
    this.onClose = new Subject();
    this.items = ['Elaboración de Lista de Verificación', '1', '1', '1', '1', '1'];
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({ registros: 10 });
    this.listaPreguntas= [];

    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
  }

  ngOnInit() {
    
    const parametros: {inidencu?: number} = {inidencu: null};
    parametros.inidencu = this.itemEncu;
    
    this.service.buscarPorParametrosDet(parametros,this.paginacion.pagina,this.paginacion.registros).subscribe(
      (response: Response) => {
        //this.item = response.resultado;
        this.listaPreguntas = response.resultado;
        this.paginacion = new Paginacion(response.paginacion);
        console.log(this.listaPreguntas);
      },
      //    (error) => this.controlarError(error)
    );


  }
  //  }
  OnRegresar() {
    this.router.navigate([`auditoria/evaluacion-editor`]);
  }

}

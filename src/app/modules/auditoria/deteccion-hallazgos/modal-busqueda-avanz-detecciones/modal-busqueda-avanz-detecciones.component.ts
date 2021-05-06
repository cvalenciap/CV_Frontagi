import { Component, OnInit } from '@angular/core';
import { DeteccionHallazgos } from 'src/app/models/deteccionhallazgos';
import { Subject, forkJoin } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { DetalleDeteccionHallazgosService, GeneralService} from './../../../../services';
import { Response } from './../../../../models/response';
import { NombreParametro } from 'src/app/constants/general/general.constants';


@Component({
  selector: 'app-modal-busqueda-avanz-detecciones',
  templateUrl: './modal-busqueda-avanz-detecciones.component.html',
  styleUrls: ['./modal-busqueda-avanz-detecciones.component.scss'],
  providers: [DetalleDeteccionHallazgosService]
})
export class ModalBusquedaAvanzDeteccionesComponent implements OnInit {


  public onClose: Subject<DeteccionHallazgos>;
  bsConfig: object;
  valorpase: any;
  valorTipo: string;
  valorOrigenDet: string;
  valorEstado: string;
  valorDetectorNombre: string;
  valorDetectorApMaterno: string;
  valorDetectorApPaterno: string;
  listaTipos:any[];
  listaOrigenDet:any[];
  listaEstado:any[];
  listaEstados:any[];
 
  busqueda:DeteccionHallazgos;
  loading:boolean;

 
  constructor(public bsModalRef: BsModalRef,
    private toastr: ToastrService,
    private localeService: BsLocaleService,
    private service: DetalleDeteccionHallazgosService,
    private generalService:GeneralService) { 
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
    this.loading = false;
    this.listaTipos = [];
    this.listaOrigenDet = [];    
    this.listaEstado = ['PENDIENTE', 'CERRADO'];
    }
    
  ngOnInit() {
    this.valorDetectorNombre="";
    this.valorDetectorApPaterno="";
    this.valorDetectorApMaterno="";
    this.valorEstado="";
    this.valorOrigenDet="";
    this.valorTipo="";
    this.onClose = new Subject();
    this.busqueda = new DeteccionHallazgos();
    this.busqueda.idorigenDeteccion = "";
    this.busqueda.idTipoNoConformidad = "";
    this.busqueda.nombreDetector = "";
    this.busqueda.apPaternoDetector = "";
    this.busqueda.apMaternoDetector = "";

    this.obtenerParametros();
  }


  cancelar(){
    this.bsModalRef.hide();
  }

  obtenerParametros(){
    const buscaListaTipoNoConformidad = this.generalService.obtenerParametroPadre(NombreParametro.listaTipoNoConformidad)
    const buscaOrigenDeteccion = this.generalService.obtenerParametroPadre(NombreParametro.listaOrigenDeteccion);

    forkJoin(buscaListaTipoNoConformidad,buscaOrigenDeteccion)
    .subscribe(([buscaListaTipoNoConformidad,buscaOrigenDeteccion]:[Response,Response])=>{
      this.listaTipos = buscaListaTipoNoConformidad.resultado;
      this.listaOrigenDet = buscaOrigenDeteccion.resultado;     
    },
    (error) => this.controlarError(error)); 
  }    

  controlarError(error) {    
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  buscar(){
    if(!(this.busqueda.idTipoNoConformidad == "" && this.busqueda.idorigenDeteccion == "" && this.busqueda.estado == "" && 
    this.busqueda.nombreDetector == "" && this.busqueda.apPaternoDetector == "" && this.busqueda.apMaternoDetector == "")){
      this.bsModalRef.hide(); 
      this.onClose.next(this.busqueda);  
    }

      

  }


}

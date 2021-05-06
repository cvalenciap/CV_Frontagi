import { Component, OnInit, Input } from '@angular/core';
import { validate } from 'class-validator';
import {BandejaDocumento} from '../../../models';
import { Paginacion } from '../../../models/paginacion';
import { RutaResponsable } from 'src/app/models/rutaresponsable';
import { RutaParticipante } from 'src/app/models/rutaParticipante';
import { ParametrosService, RutaResponsablesService, JsonService, ValidacionService } from 'src/app/services';
import { Constante, Estado } from 'src/app/models/enums';
import { ActivatedRoute } from '@angular/router';
import { Response } from '../../../models/response';
import { Fase } from 'src/app/models/fase';

@Component({
  selector: 'fase-registro',
  templateUrl: 'fase-registro.template.html'
})
export class FaseRegistroComponent implements OnInit {
  @Input() permisos: any;
  @Input() 
  //listaSeguimiento: RutaParticipante[];
  loading: boolean;
  paginacion: Paginacion;
 //Id de las Etapas
  /*idElaboracion: number;
  idConsenso: number;
  idAprobacion: number;
  idHomologacion: number;*/
  itemCodigo: number;
  private sub: any;
  item: RutaResponsable;
  errors:any;
  //idFase: number;
  //comentario: string;
  fase: Fase;
  valor:Fase=new Fase;
   /* Lista de Estados */
   listaEstados: [
    { id: 1, valor: 'ACTIVO' },
    { id: 0, valor: 'INACTIVO' }
  ];
   /* Participantes   */
   listaParticipantes: RutaParticipante[];
  constructor( private serviceParametro: ParametrosService,
    private route: ActivatedRoute,
    private serviceRuta: RutaResponsablesService,
    private servicioValidacion:ValidacionService) {
    this.paginacion = new Paginacion({registros: 10},);
    this.fase = new Fase();
    //this.listaSeguimiento = [];
  }

  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se present� un error inesperado en la �ltima acci�n', 'Error', {closeButton: true});
  } 


  ngOnInit() {
    
    this.loading = false;
   /*  this.valor=JSON.parse(sessionStorage.getItem("retornoDatos")); */
    
    /* sessionStorage.removeItem("retornoDatos"); */
    /* if(this.valor!=undefined){
      this.fase.comentario=this.valor.comentario;
    } */
    this.listaParticipantes = new Array<RutaParticipante>();
    this.errors = {};
    //this.items = [];
    //FASE Inicio
    /*this.listaEstados = [
      { id: 1, valor: 'ACTIVO' },
      { id: 0, valor: 'INACTIVO' }
    ];*/

/*this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
  (response: Response) => {
    let resultado = response.resultado;
    this.idElaboracion = this.serviceParametro.obtenerIdParametro(
      resultado, Constante.ETAPA_RUTA_ELABORACION);
    this.idConsenso = this.serviceParametro.obtenerIdParametro(
      resultado, Constante.ETAPA_RUTA_CONSENSO);
    this.idAprobacion = this.serviceParametro.obtenerIdParametro(
      resultado, Constante.ETAPA_RUTA_APROBACION);
    this.idHomologacion = this.serviceParametro.obtenerIdParametro(
      resultado, Constante.ETAPA_RUTA_HOMOLOGACION);
    this.idFase = this.idElaboracion;
  },
  (error) => this.controlarError(error)
);*/
/*this.sub = this.route.params.subscribe(params => {
  this.itemCodigo = + params['id'];
});
if (this.itemCodigo) {
  this.serviceRuta.buscarPorCodigo(this.itemCodigo).subscribe(
    (response: Response) => {
      this.item = response.resultado[0];          
    },
    (error) => this.controlarError(error)
  );
  } else {
  this.item = this.serviceRuta.crear();      
}
if (this.item == null) this.item = new RutaResponsable();*/
//FASE Fin


//console.log("BITACORA")
//console.log(this.item.listaElaboracion);
  }

  Validar(objectForm) {
    
    this.servicioValidacion.validacionSingular(this.fase,objectForm,this.errors);
    sessionStorage.setItem('datosFase', JSON.stringify(this.fase));
  }
}
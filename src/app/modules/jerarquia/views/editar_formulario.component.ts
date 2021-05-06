import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { JerarquiasService, ParametrosService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { Jerarquia } from '../../../models/jerarquia';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { Parametro } from '../../../models/parametro';
import { ViewChild } from '@angular/core';
import { ArbolPlantillaCoTreeFlatOverviewData } from 'src/app/modules/arbol/views/arbol-plantilla-component';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { Output, EventEmitter } from '@angular/core';
import { Constante } from 'src/app/models/enums/constante';
import { OnDestroy } from '@angular/core/src/metadata/lifecycle_hooks';
import { Input } from '@angular/core';
import { validate } from 'class-validator';
import { debuglog } from 'util';
import { Breakpoints } from '@angular/cdk/layout/typings/breakpoints';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'jerarquia-editar-formulario',
  templateUrl: 'editar_formulario.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [JerarquiasService]
})
export class JerarquiasFormularioComponent implements OnInit, OnDestroy {

  @ViewChild(ArbolPlantillaCoTreeFlatOverviewData) child: ArbolPlantillaCoTreeFlatOverviewData;


  valorcheck: boolean;
  mostrarindicadesc: boolean;
  desaEditar:boolean;
  inhabilitardescarga: boolean;
  /* indicador de carga */
  loading: boolean;  
  /* Jerarquia seleccionada */
  itemCodigo: number;
  /* Lista de Tipos de Jerarquia */
  listaTipos: Parametro[];
  /* Lista Tipo de Documentos */
  listaTipoDocumento: Parametro[];
  /* datos */
  item: Jerarquia;
  /* Lista de Estados */
  listaEstados: any;
  /* Indicador para registrar carpeta tipo documento */
  indCarpetaDocumento: boolean;
  /* Indicador para visular el combo tipos documentos */
  verComboTipoDocumento: boolean;
  /* Indicador para visualizar chek tipo documento */
  verCheckTipoDocumento: boolean;
  descripcionComboTipoDocumento: string;
  
  /* Ruta + descripcion */
  rutaYdescripcion: string = null;
  /* Nombre */
  nombreNodo:string;
  /* Manejo de validaciones */
  // errors:any;
  inhabilitar:false;
  mostrar:boolean;
  listHijos:Jerarquia[];
  listDoc:Jerarquia[];
  rutaAntigua:string;
  mostrarAbre:boolean;
  inhabilitarAbre:boolean;
  inhabilitarAbreB:boolean;
  abrJeraB:string;
  @Output() emitirEvento: EventEmitter<boolean> = new EventEmitter<boolean>();
 
  @Input() errors: any;

  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: JerarquiasService,
    private serviceDocumento: BandejaDocumentoService,
    private serviceParametro: ParametrosService,
    private spinner: NgxSpinnerService) {
    this.loading = false;
    this.item = new Jerarquia();
    this.item.nivel = 1;
    this.item.ruta = "";
    this.descripcionComboTipoDocumento = "";
    this.item.idTipoDocu = null;    
    this.indCarpetaDocumento = false;
    this.verComboTipoDocumento = false;
    this.verCheckTipoDocumento = true;
    this.errors = {};
    this.desaEditar=true;
    this.inhabilitarAbre=false;
    this.mostrarindicadesc=false;
    defineLocale('es', esLocale);
    this.localeService.use('es');
    localStorage.removeItem("idProcesoSeleccionado");
  }

  ngOnInit() {
    
  
    this.mostrar=true;
    this.nombreNodo="";
    this.inhabilitar=false;
    // metodo que recupera Lista tipos de Jerarquia
    let pag : Paginacion = new Paginacion({registros: 1000});
    this.loading=true;
    this.service.obtenerTipos(pag,null).subscribe(
      (response: Response) => {
        this.listaTipos = response.resultado;
        this.loading = false;
      },
      (error) => this.controlarError(error)
    );


    // metodo que recupera Lista tipos de Documento
    this.serviceParametro.obtenerParametroPadre(Constante.TIPO_DOCUMENTO).subscribe(
      (response: Response) => {
        this.listaTipoDocumento = response.resultado;
      },
      (error) => this.controlarError(error)
    );

    this.listaEstados = [
      { id: 1, valor: 'ACTIVO' },
      { id: 0, valor: 'INACTIVO' }
    ];

    this.route.params.subscribe(params => {
      this.itemCodigo = + params['id'];
      this.item.idJerarquia = this.itemCodigo;
      if (this.item.idJerarquia == 122) {
        this.mostrarAbre = true;
      } else {
        this.mostrarAbre = false;
      }
    });

  }

  ngOnDestroy(): void {
    localStorage.removeItem("idProcesoSeleccionado");
  }

  OnRegresar() {
    this.router.navigate(['documento/jerarquias']);    
  }

  controlarError(error) {
    error=null;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  capturaNodo(objnode): void {
    
    // Seteo los valores
    
    this.listHijos = [];
    this.listDoc = [];
    this.OnClear();
    this.mostrar = true;
    this.item.estado = objnode.estado;
    this.item.ruta = objnode.ruta;
    //cguerra
    this.item.indicadorDescargas = objnode.indicadorDescargas;  
    if(this.item.indicadorDescargas==0){
      this.valorcheck = false;
      this.mostrarindicadesc= true;
      this.verComboTipoDocumento= false;
    }else if(this.item.indicadorDescargas ==1){
      this.valorcheck = true;
      this.mostrarindicadesc= true;
      this.verComboTipoDocumento= false;
    }else if(this.item.indicadorDescargas==null){
      this.mostrarindicadesc= false;
    }    
    
    let rutaFinal = objnode.ruta;
    if(rutaFinal !=null){
      this.desaEditar=false;
    }
    
    //cguerra
    this.rutaAntigua = objnode.ruta;
    this.item.nivel = objnode.nivelJerarquia;
    this.item.abrJera = objnode.abrJera;
    this.item.idPadre = objnode.id;
    this.item.idTipoDocu = objnode.idTipoDocu ? objnode.idTipoDocu : null;
    this.rutaYdescripcion = objnode.ruta;
    this.nombreNodo = objnode.nombre;
    this.item.nomAnterior = objnode.nombre;
    var array1 = this.rutaYdescripcion.split("\\");
    var dato = null;
    this.item.detAnterior = null;
    var cont = 2;

    for (let i: number = 0; i < array1.length; i++) {
      if (i < cont) {
        if (dato != null) {
          var result = dato + '\\' + array1[i] + '\\';
          dato = result;
          this.item.detAnterior = dato;
        } else {
          var result = ''.concat(array1[i]);
          dato = result;
        }
      }
    }

    if (this.item.idTipoDocu > 0) {
      this.verComboTipoDocumento = true;
      this.mostrarindicadesc=false;
      this.verCheckTipoDocumento = false;
      this.mostrar = false;
      this.item.valModificar = true;
      this.item.descripcion = this.nombreNodo;
    }

    // Evaluo si el nodo no es de tipo documento
    if (this.item.idTipoDocu > 0) {
      this.emitirEvento.emit(true);
    } else {
      this.emitirEvento.emit(false);
    }

    this.obtenerNodosDoc(this.rutaAntigua, this.item.idJerarquia);

  }

  OnClear(): void {
    this.item = new Jerarquia();
    this.item.nivel = 1;
    this.indCarpetaDocumento = false; 
    this.mostrarindicadesc=false;
    this.item.idJerarquia = this.itemCodigo;
    this.rutaYdescripcion = "";
    this.verComboTipoDocumento = false;
    this.verCheckTipoDocumento = true;
    this.descripcionComboTipoDocumento = "";
  }

  OnIngresaTexto(event): void {
    
    if(!this.item.valModificar){
    let cadena = this.item.descripcion;
    let cadena2 = cadena.trim();

    if (cadena2.length == 0 && event.keyCode == 32) {
      this.item.descripcion = "";
    } else {
        this.rutaYdescripcion = this.item.ruta + String.fromCharCode(92) + this.item.descripcion;
      }
     
      
    }else{
      this.nombreNodo=this.item.descripcion;
      let ind:any;
      let contador:any;
      contador=this.item.nivel;
      var array=this.rutaYdescripcion.split("\\");
      
      var dato:any;
      dato=null
      for(let i:number=0; i<array.length;i++){
        if(i!=contador){
          if(dato!=null){
            var result =dato+'\\'+array[i];
            dato=result;
            this.item.nombre=result;
          }else{
            var result =''.concat(array[i]);
            dato=result;
            this.item.nombre=result;
          }
        }
      }
      this.item.ruta=this.rutaYdescripcion;
      this.rutaYdescripcion=this.item.nombre+'\\'+this.item.descripcion;
    }
     
  }

  OnObtenerBeanJerarquia(): Jerarquia {
    
    this.item.ruta = this.rutaYdescripcion ? this.rutaYdescripcion.trim() : "";
    this.indCarpetaDocumento ? this.item.descripcion = this.descripcionComboTipoDocumento : null;
    this.item.listHijos=this.listHijos;
    this.item.listDoc=this.listDoc;
    this.item.nomNodo=this.nombreNodo;
    //cguerra
    if(this.valorcheck){
      this.item.indicadorDescargas = 1;
    }else{
      this.item.indicadorDescargas = 0
    }

     
    //cguerra
    
    if (this.item.idJerarquia != 122) {
      this.item.abrJera = "";
    }    
    
    return this.item;
  }

  OnMetodoEvaluaCheck(): void {
    
    this.errors = {};

    this.item.idTipoDocu = 0;
    this.item.descripcion = "";
    this.rutaYdescripcion = this.item.ruta;
    this.descripcionComboTipoDocumento = "";
    if (this.indCarpetaDocumento) {
      this.verComboTipoDocumento = true;
      this.inhabilitarAbreB =this.item.mensajeDoc;
      this.abrJeraB = this.item.abrJera;
      this.item.abrJera = "";
      this.inhabilitarAbre = false;
      this.mostrar = false;
    } else {
      this.verComboTipoDocumento = false;
      this.item.abrJera = this.abrJeraB;
      this.inhabilitarAbre = this.inhabilitarAbreB;
      this.mostrar = true;
      
    }

  }

  OnMetodoEvaluaCheck1(): void {
    
    this.errors = {};
    this.valorcheck;
  }


  obtenerNodosDoc(ruta:string,idTipo:number){
    
    const parametros: {ruta?:string,idTipo?:string} = {ruta:null,idTipo:null};
    parametros.ruta=ruta;
    parametros.idTipo=String(idTipo);
    this.loading=true;
    this.service.obteneDocJerarquia(parametros).subscribe(
      (response: Response) => {
        this.loading=false;
        this.listDoc = response.resultado;
        if(this.listDoc[0].cantidadDocumentos==0){
          this.item.mensajeDoc=false;
          this.inhabilitarAbre = false;
        }else{
          this.item.mensajeDoc=true;
          this.inhabilitarAbre = true;
        }
      },
      (error) => this.controlarError(error)
    );
  }

  OnModificar(){
    
    this.item.descripcion=this.nombreNodo;
    this.item.ruta=this.rutaYdescripcion;
    this.item.valModificar=true;
    this.item.abrJera = this.item.abrJera;
    this.obtenerNodosDoc(this.rutaAntigua, this.item.idJerarquia);
    return this.item;
  }

  OnMetodoEvaluaCombo(evento): void {
    
    this.listaTipoDocumento.map(e => {
      if(e.idconstante == evento){ 
        this.descripcionComboTipoDocumento = e.v_valcons;
      }
    });

    if(!this.item.valModificar){

    
    this.item.descripcion = this.descripcionComboTipoDocumento;    
    this.rutaYdescripcion = this.item.ruta + String.fromCharCode(92) + this.descripcionComboTipoDocumento;
    }else{
      
      this.item.descripcion = this.descripcionComboTipoDocumento;   
      this.nombreNodo=this.item.descripcion;
      let ind:any;
      let contador:any;
      contador=this.item.nivel;
      var array=this.rutaYdescripcion.split("\\");
      
      var dato:any;
      dato=null
      for(let i:number=0; i<array.length;i++){
        if(i!=contador){
          if(dato!=null){
            var result =dato+'\\'+array[i];
            dato=result;
            this.item.nombre=result;
          }else{
            var result =''.concat(array[i]);
            dato=result;
            this.item.nombre=result;
          }
          
         
        }
       
      }
      this.item.ruta=this.rutaYdescripcion;
      this.rutaYdescripcion=this.item.nombre+'\\'+this.item.descripcion;
     
    }

    if(this.errors){
      let object: any = {};
      Object.defineProperty(object, "name", { value: "descripcion" });
      this.OnValidacion(this.item, object);
    }
  }

  OnValidar(objectForm): void{
    
    this.OnValidacion(this.item, objectForm);
  }

  OnValidacion(modelo: any, objectForm: any) {
        
    validate(modelo).then(errors => {
      
      this.errors = {};
      if (errors.length > 0) {
        errors.map(e => {
          if (e.property == objectForm.name) {
            Object.defineProperty(this.errors, e.property, { value: e.constraints[Object.keys(e.constraints)[0]] });
          }
        });
      }

    });
  }

  OnEstado(objectForm): void {
    
    this.item.estado;
    if (this.item.estado.includes(Estado.INACTIVO)) {
      this.obtenerNodosDoc(this.rutaAntigua, this.item.idJerarquia);
    }
  }

}
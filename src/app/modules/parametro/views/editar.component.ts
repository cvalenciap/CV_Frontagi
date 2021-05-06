import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {ParametrosService} from '../../../services';
import {Tipo} from '../../../models/tipo';
import {Estado} from '../../../models/enums/estado';
import {Parametro} from '../../../models/parametro';
import {Response} from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { ConstanteDetalle } from 'src/app/models/ConstanteDetalle';
import { NgxSpinnerService } from 'ngx-spinner';
import { ValidacionService } from 'src/app/services/util/validacion.service';
import { forkJoin } from 'rxjs';
import { validate } from 'class-validator';

@Component({
  selector: 'parametro-editar',
  templateUrl: 'editar.template.html',
  styleUrls: ['lista.component.scss'],
  providers: [ParametrosService]
})
export class ParametrosEditarComponent implements OnInit {

  //
  /* datos */
  items: Parametro[];
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
  /* datos */
  parametro:Parametro;
  parametroEditar:Parametro;
  parametroTemp:Parametro[];
  selectedObject: Parametro;
  listaTipos: Tipo[];
  item: Parametro;  
  nombreParametro:string;
  descripcionParametro:string;
  private sub: any;
  v_descons:string;
  v_nomcons:string;
  v_nomconsInicial:string;
  listaParametrosPadre:Parametro[]; 
  listaParametrosPadre3:Parametro[];
  listaParametrosEliminar:Parametro[];
  listaEliminado:Parametro[];
 listaFinalFinal: ConstanteDetalle[];
 ValidarNombre:boolean;
 nombreParametroRepetido:boolean;
 ValidarDescripcion:boolean;
objPadre:Parametro;
listaAux:Parametro[];
mensajes:any[];
errors:any;
listaParametrosInicial: Parametro[];
parametroEnviar:Parametro=new Parametro();
  constructor(private localeService: BsLocaleService,
              private toastr: ToastrService,
              private router: Router,
              private route: ActivatedRoute,
              private service: ParametrosService,
              private spinner: NgxSpinnerService,
              private servicioValidacion:ValidacionService) {
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];   
    this.listaParametrosPadre=[];
    this.listaParametrosPadre3=[];
  this.listaFinalFinal=[];
    this.listaAux=[];
    this.listaParametrosEliminar=[];
    this.parametroTemp=[];
    this.v_descons='';
    this.v_nomcons='';
    this.v_nomconsInicial='';
    this.parametroBusqueda = 'codigo';
    this.paginacion = new Paginacion({registros: 10});
    this.nombreParametro='';
    this.nombreParametroRepetido=false;
    this.descripcionParametro='';
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.selectedRow = -1;
  }
  ////
  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getLista();
  }
  OnPageOptionChanged(event): void {
    this.paginacion.registros = event.rows;
    this.paginacion.pagina = 1;
    this.getLista();
  }

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getLista();
  } 
  OnModificar(parametro: Parametro): void {
    
    sessionStorage.setItem('parametro', JSON.stringify(parametro));
    sessionStorage.setItem('parametroEditar', JSON.stringify(this.parametroEditar));
    sessionStorage.setItem('listaParametrosPadre3', JSON.stringify(this.listaParametrosPadre3));
    sessionStorage.setItem('listaEliminado', JSON.stringify(this.listaEliminado));
    sessionStorage.setItem('listaAux', JSON.stringify(this.listaAux));
    if(!parametro.idconstante){
    this.router.navigate([`mantenimiento/parametros/editar/agregar/${parametro.idconstantesuper}`]);
    }else{
    this.router.navigate([`mantenimiento/parametros/editar/agregar/${parametro.idconstante}`]);}
  }
  OnAgregar(): void {
    
    this.objPadre.v_nomcons=this.v_nomcons;
    this.objPadre.v_descons=this.v_descons;
    this.objPadre.idconstante=this.parametro.idconstante;

    sessionStorage.setItem('listaAux', JSON.stringify(this.listaAux));
    sessionStorage.setItem('parametroEditar', JSON.stringify(this.parametroEditar));
    sessionStorage.setItem('listaParametrosPadre3', JSON.stringify(this.listaParametrosPadre3));
    sessionStorage.setItem('listaEliminado', JSON.stringify(this.listaEliminado));  
    if(this.itemCodigo){
      sessionStorage.setItem('objPadre', JSON.stringify(this.objPadre));      
      sessionStorage.setItem('parametro', JSON.stringify(this.parametro));
      this.router.navigate([`mantenimiento/parametros/editar/agregar/${this.parametro.idconstante}`]);
    }else{        
      sessionStorage.setItem('objPadre', JSON.stringify(this.objPadre));
    this.router.navigate([`mantenimiento/parametros/registrar/agregar`]);}
  }

  getLista(): void {    
    
    const parametros: {idconstante?: string, n_discons?: string,v_padre?: string, v_nomcons?: 
      string, v_descons?:string,idconstantesuper?:string} = {idconstante: null, n_discons: null,v_padre: null, 
      v_nomcons: null,  v_descons:null,idconstantesuper:null};
    this.listaParametrosPadre3 = [];
    if(this.itemCodigo){
      parametros.idconstantesuper=String(this.itemCodigo);
      this.spinner.show();  
    this.service.buscarPorParametrosDetalle(parametros,this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => { 
         
        this.listaAux=response.resultado;
        if(response.resultado.length==0){       
            let listaFinalAgregar: Parametro[] = JSON.parse(sessionStorage.getItem("listaFinalAgregar"));
            if(listaFinalAgregar != null || listaFinalAgregar != undefined){
              this.listaParametrosPadre3 = listaFinalAgregar;
              for (let i: number = 0; this.listaParametrosPadre3.length > i; i++) {
                if(this.listaParametrosPadre3[i].idconstante){
                  for (let j: number = 0; this.listaParametrosPadre.length > j; j++) {
                    if(this.listaParametrosPadre3[i].idconstante==this.listaParametrosPadre[j].idconstante){
                          this.listaParametrosPadre.splice(j,1,this.listaParametrosPadre3[i])
                    }
                }
              }else{              
                this.listaParametrosPadre.push(this.listaParametrosPadre3[i]);  }
              }
            }
            sessionStorage.removeItem("isNuevo");
            sessionStorage.removeItem("parametroLista");          
        }else{
        //  this.parametroTemp=response.resultado;
         
        let lista: Parametro[]=[];
        lista=response.resultado;
        for (let i: number = 0; i < lista.length; i++) { 
          let listaresultado:Parametro=lista[i];
          this.listaParametrosPadre.push(listaresultado);
        } 
        let listaFinalAgregar: Parametro[] = JSON.parse(sessionStorage.getItem("listaFinalAgregar"));
        let parametroLista: Parametro = JSON.parse(sessionStorage.getItem("parametroLista"));
        let isNuevo:boolean = JSON.parse(sessionStorage.getItem("isNuevo"));
        
        let detalle: Parametro[]=JSON.parse(sessionStorage.getItem("listaEliminadoDet"));
        /* if(detalle!=null){
          this.listaEliminado=detalle;
          } */
          if(detalle != null || detalle != undefined){
            this.listaParametrosEliminar=detalle;
          }

        if (isNuevo){
          if(listaFinalAgregar != null || listaFinalAgregar != undefined){
            this.listaParametrosPadre3 = listaFinalAgregar;
            
            for (let i: number = 0; this.listaParametrosPadre3.length > i; i++) {
              if(this.listaParametrosPadre3[i].idconstante){
                for (let j: number = 0; this.listaParametrosPadre.length > j; j++) {
                  if(this.listaParametrosPadre3[i].idconstante==this.listaParametrosPadre[j].idconstante){
                        this.listaParametrosPadre.splice(j,1,this.listaParametrosPadre3[i])
                  }
              }
            }else{              
              this.listaParametrosPadre.push(this.listaParametrosPadre3[i]);  
              /* if(this.listaEliminado.length>0){
                for (let i: number = 0; this.listaEliminado.length > i; i++) {
                  this.listaEliminado[i];
                      this.listaParametrosPadre=this.listaParametrosPadre.filter(x=>x!=this.listaEliminado[i]);
                    
                           
                }
              } */
            }
              
            }
          }
          if(this.listaParametrosEliminar.length>0){
            for(let dat: number = 0; this.listaParametrosEliminar.length > dat; dat++){
              for (let i: number = 0; this.listaParametrosPadre.length > i; i++) {
                if(this.listaParametrosEliminar[dat]==this.listaParametrosPadre[i]){
                  
                  console.log("let");
                  this.listaParametrosPadre.splice(i,1);
                  
                }         
            }
            }

          }
          
          sessionStorage.removeItem("isNuevo");
          sessionStorage.removeItem("parametroLista");
        }   
      } 
      this.spinner.hide();      
    } );
  }else{
    let listaFinalAgregar: Parametro[] = JSON.parse(sessionStorage.getItem("listaFinalAgregar"));
    if(listaFinalAgregar != null || listaFinalAgregar != undefined){
      this.listaParametrosPadre3 = listaFinalAgregar;
      for (let i: number = 0; this.listaParametrosPadre3.length > i; i++) {
                      
        this.listaParametrosPadre.push(this.listaParametrosPadre3[i]);  }
      
    }
    for(let num of this.listaParametrosPadre){
      num.idconstante=0;
      num.idconstantesuper=0;
      this.listaParametrosPadre=this.listaParametrosPadre.filter(x=>x=num);
    }
    sessionStorage.removeItem("isNuevo");
    sessionStorage.removeItem("parametroLista"); 
  }
  
  }
  ngOnInit() {
    
    this.listaEliminado = [];
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
    });

    this.parametro = JSON.parse(sessionStorage.getItem("parametro"));
    this.objPadre = JSON.parse(sessionStorage.getItem("objPadre"));
    if (this.parametro == undefined) {
      this.parametro = new Parametro;
    }

    if (this.itemCodigo) {
      this.parametroEditar = this.parametro;
      if (this.objPadre.v_nomcons == "") {
        this.v_descons = this.parametro.v_descons;
        this.v_nomcons = this.parametro.v_nomcons;
      } else {
        this.v_descons = this.objPadre.v_descons;
        this.v_nomcons = this.objPadre.v_nomcons;
      }
      this.getLista();
    } else {
      this.parametroEditar = this.objPadre;
      this.v_descons = this.objPadre.v_descons;
      this.v_nomcons = this.objPadre.v_nomcons;
      this.getLista();
    }
    this.v_nomconsInicial = this.v_nomcons;
  }

   
  OnGuardar() {
    
    this.nombreParametroRepetido = false;
    const parametros: { idconstante?: string, n_discons?: string, v_padre?: string, v_nomcons?: string, v_descons?: string } =
      { idconstante: null, n_discons: null, v_padre: null, v_nomcons: null, v_descons: null };


    this.service.buscarPorParametrosMant(parametros, 0, 0).subscribe(
      (parametros: Response) => {

        this.listaParametrosInicial = parametros.resultado;
        
        if (this.v_nomcons.trim() == '') {
          this.ValidarNombre = true;
          this.nombreParametroRepetido=false;
          this.v_nomcons = this.v_nomcons.trim();
        } else {
          this.ValidarNombre = false;
          for (let index = 0; index < this.listaParametrosInicial.length; index++) {
    
            if (this.v_nomcons == this.listaParametrosInicial[index].v_nomcons) {
              if (this.v_nomcons != this.v_nomconsInicial) {
                this.ValidarNombre = true;
                this.nombreParametroRepetido=true;
                break;
              }
            }
      
          }
        }
    
        if (this.v_descons.trim() == '') {
          this.ValidarDescripcion = true;
          this.v_descons = this.v_descons.trim();
        } else {
          this.ValidarDescripcion = false;
        }
    
        if (this.ValidarNombre || this.ValidarDescripcion) {
        }
        if (this.itemCodigo) {
          this.listaParametrosPadre3 = this.listaParametrosPadre;
    
          if (this.listaParametrosPadre3.length > 0) {
            for (let data of this.listaParametrosPadre3) {
              data.dispEstado = "1";
              this.listaParametrosPadre3 = this.listaParametrosPadre3.filter(x => x = data);
            }
          }
          if (this.listaEliminado.length > 0) {
            for (let dat of this.listaEliminado) {
              this.listaParametrosPadre3.push(dat);
            }
          }
        } else {
          this.listaParametrosPadre3 = this.listaParametrosPadre;
          if (this.listaParametrosPadre3.length > 0) {
            for (let data of this.listaParametrosPadre3) {
              data.dispEstado = "1";
              this.listaParametrosPadre3 = this.listaParametrosPadre3.filter(x => x = data);
            }
          }
        }
    
        var parametro: Parametro = new Parametro;
    
        let listaDetalleEnviar: ConstanteDetalle[] = [];
        for (let val of this.listaParametrosPadre3) {
          let listaFinal: ConstanteDetalle = new ConstanteDetalle();
          listaFinal.idconstante = val.idconstante;
          listaFinal.idconstantesuper = val.idconstantesuper;
          listaFinal.v_nomcons = val.v_nomcons;
          listaFinal.v_descons = val.v_descons;
          listaFinal.v_abrecons = val.v_abrecons;
          listaFinal.v_valcons = val.v_valcons;
          listaFinal.v_campcons1 = val.v_campcons1;
          listaFinal.v_campcons2 = val.v_campcons2;
          listaFinal.v_campcons3 = val.v_campcons3;
          listaFinal.v_campcons4 = val.v_campcons4;
          listaFinal.v_campcons5 = val.v_campcons5;
          listaFinal.v_campcons6 = val.v_campcons6;
          listaFinal.v_campcons7 = val.v_campcons7;
          listaFinal.v_campcons8 = val.v_campcons8;
          listaFinal.dispEstado = val.dispEstado;
          listaDetalleEnviar.push(listaFinal);
        }
    
        parametro.v_nomcons = this.v_nomcons;
        parametro.v_descons = this.v_descons;
        parametro.listaDetalle = listaDetalleEnviar;
    
        if (this.itemCodigo) {
          parametro.idconstante = this.itemCodigo;
        } else {
          parametro.idconstante = null;
        }
        this.parametroEnviar = parametro;
    
        forkJoin(validate(this.parametroEnviar)).subscribe(([errors]: [any]) => {
          this.mensajes = [];
    
          if (this.nombreParametroRepetido) {
            this.toastr.error("Nombre de parametro ya existe en el sistema", 'Acción inválida', { closeButton: true });
          } else {
            if (errors.length > 0) {
              this.validarCampos();
              this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', { closeButton: true });
            } else {
              this.spinner.show();
              this.service.guardarParametro(parametro).subscribe(
                (response: Response) => {
                  this.item = response.resultado;
                  this.spinner.hide();
                  localStorage.removeItem("listaParametroInicial");  
                  this.toastr.success('Registro almacenado', 'Acción completada!', { closeButton: true });
                  this.router.navigate([`mantenimiento/parametros`]);
                }
    
              );
            }
          }
        });

      },(error) => this.controlarError(error)
    );


  }



  validarCampos(){
    this.errors = {};
    this.servicioValidacion.validacionObjeto(this.parametroEnviar,this.errors);
  }

  Validar(objectForm) {
    
    this.servicioValidacion.validacionSingular(this.parametroEnviar,objectForm,this.errors);
}

  OnRegresar() {
    sessionStorage.removeItem("listaFinalAgregar");
    this.router.navigate([`mantenimiento/parametros`]);
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }


  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }


  onEliminar(parametro: Parametro):void{
    
        var para:Parametro=new Parametro;
        para=parametro;
        for (let i: number = 0; this.listaParametrosPadre.length > i; i++) {
          if(parametro.idconstante==null || parametro.idconstante==0){
            this.listaParametrosPadre=this.listaParametrosPadre.filter(x=>x!=parametro)
                  break;
            }else{
              if(this.listaParametrosPadre[i]==parametro){
                this.listaParametrosPadre=this.listaParametrosPadre.filter(x=>x!=parametro);
                para.dispEstado="2";
                
                this.listaEliminado.push(para);
            }
            }      
        } 
       
    
  }

 





}



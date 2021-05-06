import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { ParametrosService } from '../../../services';
import { Tipo } from '../../../models/tipo';
import { Estado } from '../../../models/enums/estado';
import { Parametro } from '../../../models/parametro';
import { Response } from '../../../models/response';

@Component({
  selector: 'parametro-editar',
  templateUrl: 'editarparametro.template.html',
  providers: [ParametrosService]
})
export class EditarParametroComponent implements OnInit {

  /* codigo seleccionado*/
  itemCodigo: number;
  itemCodigoValor: number;
  /* datos */
  listaTipos: Tipo[];
  item: Parametro;
  parametro: Parametro;
  parametroLista: Parametro;
  parametroEditar: Parametro;
  listaParametrosPadre: Parametro;
  private sub: any;
  isNuevo: boolean;
  contador: number;
  valido: boolean;
  ValidarDescripcion: boolean;
  ValidarAbreviacion: boolean;
  ValidarValor: boolean;
  listaAuxiliarDet: Parametro[];
  listaParametrosPadre3: Parametro[];
  listaEliminadoDetalle: Parametro[];
  objPadre: Parametro;
  mensajes: any[];
  errors: Parametro = new Parametro;
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: ParametrosService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    this.parametroLista = new Parametro();
    this.isNuevo = true;
    this.contador = 0;
    this.valido = true;
  }

  ngOnInit() {
    
    this.listaParametrosPadre3 = [];
    // this.objPadre = new Parametro;
    this.objPadre = JSON.parse(sessionStorage.getItem("objPadre"));
    this.sub = this.route.params.subscribe(params => {
      this.itemCodigo = + params['codigo'];
      this.itemCodigoValor = params['codigo'];
    });
    /*   sessionStorage.setItem('listaParametrosEliminar', JSON.stringify(this.listaParametrosEliminar)); */
    this.listaEliminadoDetalle = JSON.parse(sessionStorage.getItem("listaEliminado"));
    this.parametro = JSON.parse(sessionStorage.getItem("parametro"));
    this.listaParametrosPadre3 = JSON.parse(sessionStorage.getItem("listaParametrosPadre3"));
    this.parametroEditar = JSON.parse(sessionStorage.getItem("parametroEditar"));
    this.listaAuxiliarDet = JSON.parse(sessionStorage.getItem("listaAux"));
    if (this.parametro == undefined) {
      this.parametro = new Parametro;
    }

    if (this.parametro.idconstantesuper || this.parametro.codigo) {
      this.parametroLista = this.parametro;
    }

  }
  OnGuardar() {
    
    this.listaParametrosPadre3;
    this.ValidarValor = true;

    if (this.parametroLista.v_valcons.trim() == '') {
      this.ValidarValor = true;
      this.errors.v_valcons = "Se requiere ingresar un valor del parámetro, este campo admite un maximo de 100 caracteres";
    } else {
      this.ValidarValor = false;
    }

    if (this.parametroLista.v_abrecons.trim() == '') {
      this.ValidarAbreviacion = true;
      this.errors.v_abrecons = "Se requiere ingresar una abreviatura del parámetro, este campo admite un maximo de 20 caracteres";
    } else {
      this.ValidarAbreviacion = false;
    }

    if (this.parametroLista.v_descons.trim() == '') {
      this.ValidarDescripcion = true;
      this.errors.v_descons = "Se requiere ingresar una descripción del parámetro, este campo admite un maximo de 255 caracteres";
    } else {
      this.ValidarDescripcion = false;
    }

    if (this.ValidarValor || this.ValidarDescripcion || this.ValidarAbreviacion) {
      // this.router.navigate([`documento/consultas/bandeja-documento-modales-subir-archivo`]);
      this.toastr.error('Debe ingresar  los campos obligatorios', 'Faltan Datos', { closeButton: true });
    } else {

      if (this.parametroLista.idconstante == null || this.parametroLista.idconstante == 0) {
        if (this.listaAuxiliarDet.length > 0) {
          for (let i: number = 0; this.listaAuxiliarDet.length > i; i++) {
            if (this.parametroLista.v_valcons == this.listaAuxiliarDet[i].v_valcons) {
              this.valido = false;
              this.toastr.error('Dato Repetido', 'Nombre Existente', { closeButton: true });
              break;
            } else {
              this.valido = true;
            }
            if (this.parametroLista.v_abrecons == this.listaAuxiliarDet[i].v_abrecons) {
              this.valido = false;
              this.toastr.error('Dato Repetido', 'Abreviatura Existente', { closeButton: true });

              break;
            } else {
              this.valido = true;
            }
          }
        } else {
          for (let i: number = 0; this.listaParametrosPadre3.length > i; i++) {
            if (this.parametroLista.codigo != this.listaParametrosPadre3[i].codigo) {
              if (this.parametroLista.v_valcons == this.listaParametrosPadre3[i].v_valcons) {
                this.valido = false;
                this.toastr.error('Dato Repetido', 'Nombre Existente', { closeButton: true });
                break;
              } else {
                this.valido = true;
              }
              if (this.parametroLista.v_abrecons == this.listaParametrosPadre3[i].v_abrecons) {
                this.valido = false;
                this.toastr.error('Dato Repetido', 'Abreviatura Existente', { closeButton: true });

                break;
              } else {
                this.valido = true;
              }
            }

          }
        }


      } else {
        for (let i: number = 0; this.listaAuxiliarDet.length > i; i++) {
          if (this.parametroLista.idconstante != this.listaAuxiliarDet[i].idconstante) {

            if (this.parametroLista.v_valcons == this.listaAuxiliarDet[i].v_valcons) {

              this.valido = false;
              this.toastr.error('Dato Repetido', 'Nombre Existente', { closeButton: true });
              break;
            }
            if (this.parametroLista.v_abrecons == this.listaAuxiliarDet[i].v_abrecons) {
              this.valido = false;
              this.toastr.error('Dato Repetido', 'Abreviatura Existente', { closeButton: true });
              break;

            }

          } else {
            this.valido = true;
          }



        }
        for (let i: number = 0; this.listaParametrosPadre3.length > i; i++) {

          if (this.parametroLista.v_valcons == this.listaParametrosPadre3[i].v_valcons) {
            this.valido = false;
            this.toastr.error('Dato Repetido', 'Nombre Existente', { closeButton: true });
            break;
          } else {
            this.valido = true;
          }
          if (this.parametroLista.v_abrecons == this.listaParametrosPadre3[i].v_abrecons) {
            this.valido = false;
            this.toastr.error('Dato Repetido', 'Abreviatura Existente', { closeButton: true });

            break;
          } else {
            this.valido = true;
          }


        }
      }

      if (this.valido) {
        if (this.parametroLista.codigo) {
          for (let i: number = 0; this.listaParametrosPadre3.length > i; i++) {
            if (this.listaParametrosPadre3[i].codigo == this.parametroLista.codigo) {
              this.listaParametrosPadre3.splice(i, 1, this.parametro);
            }
          }
        } else {
          if (this.parametroLista != null) {
            this.contador = this.contador + 1;
            if (this.listaParametrosPadre3.length > 0) {
              this.parametroLista.codigo = this.listaParametrosPadre3[this.listaParametrosPadre3.length - 1].codigo + 1;
            } else { this.parametroLista.codigo = this.contador; }
            this.parametroLista.idconstantesuper = this.parametroEditar.idconstante;
            this.listaParametrosPadre3.push(this.parametroLista);
          }
        }
        
        this.isNuevo = true;
        sessionStorage.setItem('listaFinalAgregar', JSON.stringify(this.listaParametrosPadre3));
        sessionStorage.setItem('parametroLista', JSON.stringify(this.parametroLista));
        //  sessionStorage.setItem('isNuevo', JSON.stringify(this.isNuevo));
        //sessionStorage.setItem('objPadre', JSON.stringify(this.objPadre));
        this.OnRegresar();
      }
    }
  }
  OnRegresar() {
    
    sessionStorage.setItem('listaEliminadoDet', JSON.stringify(this.listaEliminadoDetalle));
    if (this.itemCodigo) {
      sessionStorage.setItem('listaFinalAgregar', JSON.stringify(this.listaParametrosPadre3));
      sessionStorage.setItem('isNuevo', JSON.stringify(this.isNuevo));
      sessionStorage.setItem('parametro', JSON.stringify(this.parametroEditar));
      sessionStorage.setItem('objPadre', JSON.stringify(this.objPadre));
      this.router.navigate([`mantenimiento/parametros/editar/${this.parametroEditar.idconstante}`]);
    } else {
      // sessionStorage.setItem('listaFinalAgregar', JSON.stringify(this.listaParametrosPadre3));
      this.parametro = new Parametro();
      sessionStorage.setItem('parametro', JSON.stringify(this.parametro));
      sessionStorage.setItem('objPadre', JSON.stringify(this.objPadre));
      sessionStorage.setItem('listaFinalAgregar', JSON.stringify(this.listaParametrosPadre3));
      sessionStorage.setItem('isNuevo', JSON.stringify(this.isNuevo));
      this.router.navigate([`mantenimiento/parametros/registrar`]);
    }

  }
  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }
}



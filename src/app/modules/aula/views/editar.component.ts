import {Component, OnInit} from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import {AulasService} from '../../../services';
import {Tipo} from '../../../models/tipo';
import {Estado} from '../../../models/enums/estado';
import {Aula} from '../../../models/aula';
import {Response} from '../../../models/response';
import { ParametrosService } from 'src/app/services/impl/parametros.service';
import { Constante } from 'src/app/models/enums/constante';
import { Parametro } from 'src/app/models';
import { forkJoin } from 'rxjs';
import { validate } from 'class-validator';
import { Console } from '@angular/core/src/console';
import { ValidacionService } from 'src/app/services/util/validacion.service';
@Component({
    selector: 'aulas-editar',
    templateUrl: 'editar.template.html',
    providers: [AulasService]
})
export class AulasEditarComponent implements OnInit {
    tipoAccion:string;
    itemCodigo: number = 0;
    listaTipos: Tipo[];
    itemAula: Aula;
    aula:Aula;
    listaDisponible:any = [
      { id: 1, valor: 'Si' },
      { id: 0, valor: 'No' }
    ];
    codaula: string;
    nomaula: string;
    idsede: number;
    capaula: number;
    disaula: number;
    private sub: any;
    mensajes:any[];
    aulaVal:Aula;
    errors:any;
    hdisponible:boolean;

    listaSede: Parametro[];

    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private route: ActivatedRoute,
                private service: AulasService,
                private parametroService: ParametrosService,
                private servicioValidacion:ValidacionService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
        this.itemAula = new Aula();
        this.errors = {};
        this.codaula='';
        this.nomaula='';
        this.idsede = null;
        this.capaula = null;
        this.disaula = 1;
        this.hdisponible = true;
     }

    ngOnInit() {
        
        this.obtenerSede();

        this.sub = this.route.params.subscribe(params => {
            this.itemCodigo = + params['codigo'];
          });

        this.aula = JSON.parse(sessionStorage.getItem("aula"));   
        
        if(this.itemCodigo){ 
            this.hdisponible = false
            this.tipoAccion = 'Modificar Aula';
            this.codaula =  this.aula.vcodaula;
            this.nomaula =  this.aula.vnomaula;
            this.idsede  =  this.aula.nidsede;
            this.capaula =  this.aula.ncapaula;
            this.disaula =  this.aula.ndisaula;
        } else{
            this.hdisponible = true
            this.tipoAccion = 'Registrar Aula';
            this.itemCodigo = 0;
        }
    }

    permitirNumero(evento): void {
        if(!(evento.which>=48 && evento.which<=57))  
           evento.preventDefault();  
    }

    OnGuardar() {
        
        this.obtenerAula();
        console.log(this.itemAula);

        if(this.itemAula.vnomaula.trim().length == 0){
            this.itemAula.vnomaula = null;
        }

        if(this.itemAula.vcodaula.trim().length == 0){
            this.itemAula.vcodaula = null;
        }

        forkJoin(validate(this.itemAula)).subscribe(([errors]:[any])=>{
            this.mensajes = [];
            if(errors.length>0){
                this.validarCampos();
                this.toastr.error("Existen campos obligatorios por completar", 'Acción inválida', {closeButton: true});
            }else{
                this.service.guardar(this.itemAula).subscribe(
                    (response: Response) => {
                        this.itemAula = response.resultado;
                        this.toastr.success('Registro almacenado', 'Acción completada!', {closeButton: true});
                        this.router.navigate([`mantenimiento/aulas`]);
                    },(error) => this.controlarError(error));
            }
        }); 
    }
  
    validarCampos(){
        this.errors = {};
        this.servicioValidacion.validacionObjeto(this.itemAula,this.errors);
      }

    Validar(objectForm) {
        
        this.servicioValidacion.validacionSingular(this.itemAula,objectForm,this.errors);
    }

    obtenerAula(){
        
        this.itemAula = new Aula();
        this.itemAula.nidaula = this.itemCodigo;
        this.itemAula.vcodaula = this.codaula;
        this.itemAula.vnomaula = this.nomaula;
        this.itemAula.nidsede = this.idsede;
        this.itemAula.ncapaula = this.capaula;
        this.itemAula.ndisaula = this.disaula;
    }

    OnRegresar() {
        this.router.navigate([`mantenimiento/aulas`]);
    }
    controlarError(error) {
         this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
  
    obtenerSede() {
        this.parametroService.obtenerParametroPadre(Constante.SEDE).subscribe(
        (response: Response) => {
           this.listaSede = response.resultado;
        }, (error) => this.controlarError(error));
      }

}

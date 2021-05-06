
import { Component, OnInit, Inject } from '@angular/core';
import { Router } from '@angular/router';
import { Response } from '../../../models/response';
import { Paginacion } from '../../../models/paginacion';
import { RutaResponsable } from '../../../models/rutaresponsable';
import { ToastrService } from 'ngx-toastr';
import {BsLocaleService} from 'ngx-bootstrap/datepicker';
import { RutaResponsablesService } from '../../../services';
//import { RutaResponsablesMockService as RutaResponsableService} from '../../../services';
import { DomSanitizer } from '@angular/platform-browser';
import { SecurityContext } from '@angular/core';

@Component({
    selector: 'rutaresponsable-lista',
    templateUrl: 'lista.template.html',/*,
    styleUrls: ['lista.component.scss'],*/
    providers: [RutaResponsablesService]
})
export class RutaResponsablesListaComponent implements OnInit {

    /* datos */
    items: RutaResponsable[];
    /* filtros */
    textoBusqueda: string;
    parametroBusqueda: string;
    /* paginación */
    paginacion: Paginacion;
    /* registro seleccionado */
    selectedRow: number;
    selectedObject: RutaResponsable;
    /* indicador de carga */
    loading: boolean;
    /* Deshabilitar Busqueda*/
    deshabilitarBuscar: boolean;
    /* Texto de Mensaje*/
    mensajeInformacion:string;
    /* Validacion si existe un Mensaje a mostrar pantalla: SI(TRUE) / NO(FALSE)*/
    mostrarInformacion:boolean;
    /* Texto de Alerta*/
    mensajeAlerta:string;
    /* Validacion si existe una Alerta a mostrar en pantalla: SI(TRUE) / NO(FALSE)*/
    mostrarAlerta:boolean;
    /* Texto del menu seleccionado*/
    textoMenu:string;
    /* Filtros Anteriores */
    parametroBusquedaAnterior: string;
    textoBusquedaAnterior: string;
    textoMenuAnterior:string;
    /* Lista de Estados */
    listaEstados: [
        {id:1, valor:'ACTIVO'},
        {id:0, valor:'INACTIVO'}
    ];

    constructor(private localeService: BsLocaleService,
                private toastr: ToastrService,
                private router: Router,
                private service: RutaResponsablesService,
                private sanitizer: DomSanitizer) {                
        this.loading = false;
        this.selectedRow = -1;
        
        this.items = [];
        this.parametroBusqueda = 'descripcion';
        this.parametroBusquedaAnterior = this.parametroBusqueda;
        this.paginacion = new Paginacion({registros: 10});
        this.deshabilitarBuscar = true;
        this.mostrarAlerta = false;
        this.mostrarInformacion = false;
        this.textoMenu = null;

    }
    ngOnInit() {
        this.getLista();
        this.listaEstados = [
            {id:1, valor:'ACTIVO'},
            {id:0, valor:'INACTIVO'}
        ];
        this.mostrarAlerta = false;
        this.mostrarInformacion = false;
    }
    getLista(): void {
        this.loading = true;
        const parametros: {codigo?: string, estado?: string, descripcion?: string} = 
            {codigo: null, estado: null, descripcion: null};
        let texto:String = "<strong>Búsqueda Por:</strong>";
        switch (this.parametroBusqueda) {
        case 'codigo':
            texto = texto + "<br/><strong>Código: </strong>"+this.textoBusqueda;   
            parametros.codigo = this.textoBusqueda;
            break;
        case 'estado':
            texto = texto + "<br/><strong>Estado: </strong>"+this.textoMenu;
            parametros.estado = this.textoBusqueda;
            break;
        case 'descripcion':
        default:
            texto = texto + "<br/><strong>Descripción: </strong>"+this.textoBusqueda;
            parametros.descripcion = this.textoBusqueda;
        }
        if(!(this.parametroBusqueda=='descripcion' && this.textoBusqueda==null)) {
            this.mostrarInformacion=true;
            this.mensajeInformacion=this.sanitizer.sanitize(SecurityContext.HTML, texto);
        }
        this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
            (response: Response) => {
                this.items = response.resultado;
                this.paginacion = new Paginacion(response.paginacion);
                this.loading = false; },
            (error) => this.controlarError(error)
        );
        this.parametroBusquedaAnterior = this.parametroBusqueda;
        this.textoBusquedaAnterior = this.textoBusqueda;
        this.textoMenuAnterior = this.textoMenu;
    }
    OnPageChanged(event): void {
        this.paginacion.pagina = event.page;
        if(this.parametroBusqueda != this.parametroBusquedaAnterior) {
            this.parametroBusqueda = this.parametroBusquedaAnterior;
        }
        if(this.textoBusqueda != this.textoBusquedaAnterior) {
            this.textoBusqueda = this.textoBusquedaAnterior;
        }
        if(this.textoMenu != this.textoMenuAnterior) {
            this.textoMenu = this.textoMenuAnterior;
        }
        this.getLista();
    }
    OnPageOptionChanged(event): void {
        this.paginacion.registros = event.rows;
        this.paginacion.pagina = 1;
        if(this.parametroBusqueda != this.parametroBusquedaAnterior) {
            this.parametroBusqueda = this.parametroBusquedaAnterior;
        }
        if(this.textoBusqueda != this.textoBusquedaAnterior) {
            this.textoBusqueda = this.textoBusquedaAnterior;
        }
        if(this.textoMenu != this.textoMenuAnterior) {
            this.textoMenu = this.textoMenuAnterior;
        }
        this.getLista();
    }
    OnRowClick(index, obj): void {
        this.selectedRow = index;
        this.selectedObject = obj;
    }
    OnBuscar(): void {
        this.paginacion.pagina = 1;
        this.mostrarAlerta = false;
        this.mostrarInformacion = false;
        this.getLista();
    }
    OnModificar(): void {
        //this.router.navigate(['mantenimiento/rutaresponsables/editar/${this.selectedObject.codigo}']);
        this.router.navigate(['mantenimiento/rutaresponsables/editar/'+this.selectedObject.id]);
    }
    onEliminar():void{
        /*console.log(this.parametroBusqueda);*/
        this.service.eliminar(this.selectedObject).subscribe(
            (response: Response) => {
                //console.log(this.paginacion.totalPaginas.toString());
                this.toastr.error('Registro eliminado', 'Acción completada!', {closeButton: true});
                this.getLista();
                this.loading = false;
            },
            (error) => this.controlarError(error)
        );
    }
    controlarError(error) {
        console.error(error);
        this.loading = false;
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
    }
    habilitarBuscar(): void {
        if(this.textoBusqueda!='')
          this.deshabilitarBuscar=false;
        else
          this.deshabilitarBuscar=true;
    }
    obtenerTextoEstado(): void {
        this.textoMenu=this.listaEstados.find(resultado=>(resultado.id+"")==this.textoBusqueda).valor;
      }
}
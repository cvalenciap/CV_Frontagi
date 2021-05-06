import { Component, OnInit } from '@angular/core';
import { Paginacion, Response } from 'src/app/models';
import { ToastrService } from 'ngx-toastr';
import { forkJoin } from 'rxjs';
import { AgrupacionHallazgoMockService as AgrupacionHallazgoService} from './../../../../../services/index';
import { Reasignacion } from 'src/app/models/reasignacion';
import { ListaVerificacionNoConformidad } from 'src/app/models/listaVerificacionNoConformidad';

@Component({
  selector: 'app-bandeja-agrupacion-hallazgos',
  templateUrl: './bandeja-agrupacion-hallazgos.component.html',
  styleUrls: ['./bandeja-agrupacion-hallazgos.component.scss']
})
export class BandejaAgrupacionHallazgosComponent implements OnInit {

  items: ListaVerificacionNoConformidad[];
  valorTipoNoConformidad:string;
  parametroBusqueda:string;
  paginacion:Paginacion;

  listaTiposNoConformidad:any[];
  listaEquipos:any[];

  filaSeleccionada:number;
  objetoSeleccionado:ListaVerificacionNoConformidad;
  loading:boolean;

  datosReasignacion:Reasignacion;

  todosCheck:boolean;

  constructor(private toastr: ToastrService,
    private service: AgrupacionHallazgoService) { 
    this.loading = false;
      this.filaSeleccionada = -1;
      this.items = [];
      this.parametroBusqueda = 'tipoNoConformidad';
      this.paginacion = new Paginacion({registros:10});
      this.valorTipoNoConformidad = "";
      this.todosCheck = false;
  }

  ngOnInit() {
    this.datosReasignacion = new Reasignacion();
    this.listaTiposNoConformidad = [];
    this.listaEquipos = [];
    this.obtenerParametros();
    this.getLista();
  }

  OnPageChanged(event): void {
    this.paginacion.pagina = event.page;
    this.getLista();
  }
  OnPageOptionChanged(event): void {
      this.paginacion.registros = event.rows;
      this.paginacion.pagina = 1;
      this.getLista();
  }
  OnRowClick(index, obj): void {
      this.filaSeleccionada = index;
      this.objetoSeleccionado = obj;
  }

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getLista();
  }
  obtenerParametros(){
    const buscaEquipos = this.service.obtenerEquipos();
    const buscaTipos = this.service.obtenerTipoNoConformidad();

    forkJoin(buscaEquipos,buscaTipos).subscribe(([buscaEquipos,buscaTipos]:[Response,Response]) => {
      this.listaEquipos = buscaEquipos.resultado;
      this.listaTiposNoConformidad = buscaTipos.resultado;
    },
    (error) => this.controlarError(error)); 
  }

  controlarError(error) {
    console.error(error);
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }


  getLista(){
    this.loading = true;
    const parametros: {tipo?: string} = {tipo: null};
    switch (this.parametroBusqueda) {
        case 'tipoNoConformidad':
            parametros.tipo = this.valorTipoNoConformidad;
            break;
    }
    this.service.buscarPorParametros(parametros,this.paginacion.pagina, this.paginacion.registros).subscribe(
      (response: Response) => {        
        this.items = response.resultado;
        let lista:ListaVerificacionNoConformidad[] = response.resultado;
        lista.forEach( obj => {
          obj.seleccionado = false;
        });
          this.paginacion = new Paginacion(response.paginacion);
          this.loading = false; 
        
      },
      (error) => this.controlarError(error)
    )
  }

  generarLista(){
    
  }

  seleccionarCheck(item:any){    
    if(item.seleccionado){
      item.seleccionado = false;
      if(!this.validaSeleccionados()){
        this.todosCheck = false;
      }
    }else{
      item.seleccionado = true;
      if(this.validaSeleccionados()){
        this.todosCheck = true;
      }
      
    }
  }

  seleccionarTodos(){

    if(this.todosCheck){
      this.todosCheck = false;
      this.items.forEach(obj => {
        obj.seleccionado = false;
      });
    }else{
      this.todosCheck = true;
      this.items.forEach(obj => {
        obj.seleccionado = true;
      });
    }

    

    
  }

  validaSeleccionados():boolean{
    let flag:boolean = true;
    for(let i:number = 0; this.items.length > i ; i++){
      if(!this.items[i].seleccionado){
        flag = false;
        break;
      }
    }
    return flag;
  }

  activarOpcion(accion:number){
    switch(accion){
      case 1: this.parametroBusqueda = "tipoNoConformidad"; break;
    }
  }



}

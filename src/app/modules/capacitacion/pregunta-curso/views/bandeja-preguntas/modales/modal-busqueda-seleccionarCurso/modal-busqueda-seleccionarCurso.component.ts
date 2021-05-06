import { Component, OnInit, NgModule  } from '@angular/core';
//import { ProgramacionAuditoria } from 'src/app/models/programacionauditoria';
import { Subject } from 'rxjs';
import { BsModalRef, BsLocaleService, defineLocale, esLocale } from 'ngx-bootstrap';
import { ToastrService } from 'ngx-toastr';
import { PreguntaCurso } from 'src/app/models';
import { PreguntaCursoService } from 'src/app/services';
import { Paginacion } from 'src/app/models/paginacion';
import { Response } from 'src/app//models/response';
import { Router } from '@angular/router';
@Component({
  selector: 'app-modal-busqueda-seleccionarCurso',
  templateUrl: './modal-busqueda-seleccionarCurso.template.html',
  styleUrls: ['./modal-busqueda-seleccionarCurso.component.scss'],
  providers: [PreguntaCursoService]
})
export class ModalSeleccionarCursoComponent implements OnInit {

  public onClose: Subject<PreguntaCurso>;
  bsConfig: object;
  loading: boolean;
  parametroBusqueda: string;
  textoBusqueda: string;
  busqueda:PreguntaCurso;
  hola:string;
  items: PreguntaCurso[];
  selectedRow: number;
  selectedObject: PreguntaCurso;
  paginacion: Paginacion;
  codCurso:string;
  nomCurso:string;
  preguntaCurso:PreguntaCurso;
  filaSeleccionada:number;
  constructor(public bsModalRef: BsModalRef,
    private router: Router,
    private toastr: ToastrService,
    private service: PreguntaCursoService,
    private localeService: BsLocaleService) { 
      defineLocale('es', esLocale);
    this.localeService.use('es'); 
    this.loading = false;
    this.selectedRow = -1;
    this.items = [];
    this.paginacion = new Paginacion({registros: 10});
    this.codCurso="";
    this.nomCurso="";
    this.selectedObject=new PreguntaCurso;
    this.preguntaCurso= new PreguntaCurso;
    }
    ngOnInit() {
      this.onClose = new Subject();
      this.busqueda = new PreguntaCurso();
  //    this.busqueda.numFicha = "";
      console.log(this.hola);
      console.log(this.busqueda);

    }
  

  getLista(): void {
    
    this.loading = true;
     
    const parametros: {codCurso?: string, nomCurso?: string} = {codCurso: null, nomCurso:null};
    if(this.codCurso!=null){
      parametros.codCurso=this.codCurso;
    }
    if(this.nomCurso!=null){
      parametros.nomCurso=this.nomCurso;
    }
    
        
        this.items=[];
     this.service.buscarPorCurso(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
        (response: Response) => {
            
            this.items = response.resultado;
            this.paginacion = new Paginacion(response.paginacion);
            this.loading = false; },
          (error) => this.controlarError(error)
        );
      }

controlarError(error) {
  console.error(error);
  this.loading = false;
  this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
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
      this.selectedRow = index;
      this.selectedObject = obj;
      
  }
  

  OnBuscar(): void {
    this.paginacion.pagina = 1;
    this.getLista();
/*     this.codCurso="";
    this.nomCurso=""; */
}

OnLimpiar(){
    this.codCurso="";
    this.nomCurso="";
}
 
seleccionarCurso(indice: number, preguntaCurso: PreguntaCurso){
  
  this.selectedRow = indice;
  this.preguntaCurso = preguntaCurso;
  this.filaSeleccionada = indice;
  /* if (this.filaSeleccionada < 0 || this.preguntaCurso == null) {
    this.interruptorAceptar = true;
  } else {
    this.interruptorAceptar = false;
  } */
}
  guardar(){
   
   

  this.onClose.next(this.preguntaCurso);
  this.bsModalRef.hide();
   
  }


  cancelar(){
    this.bsModalRef.hide();
  }  
}

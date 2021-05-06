import { Component, OnInit, Input } from '@angular/core';
import { Subject } from 'rxjs';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { ValidacionService, ParametrosService } from 'src/app/services';
import { Critica } from '../../../models/critica';
import { BsModalRef, BsModalService, ModalOptions } from 'ngx-bootstrap';
import { BusquedaColaboradorMigracionComponent } from '../modals/busqueda-colaborador-migracion/busqueda-colaborador-migracion.component';
import { Colaborador } from '../../../models/colaborador';
import { ViewChild } from '@angular/core';
//import { TabGroupAnimationsExample1 } from 'src/app/modules/tabsmigracion/views/tab-group-animations-example';
import { Documento } from 'src/app/models';
import { DocumentoMigracion } from 'src/app/models/documentomigracion';
import { Constante } from 'src/app/models/enums';
import { Response } from '../../../models/response';

@Component({
  selector: 'bandeja-documento-critica-migracion',
  templateUrl: 'critica-migracion.template.html'
})
export class CriticaComponent implements OnInit {
  item: DocumentoMigracion;
  public critica: Critica;
  public loading: boolean;
  public codigoFase: string;
  public observacion: string;
  public fechaCritica: string;
  public bsModalRef: BsModalRef;
  public colaborador: Colaborador;
  public codigoColaborador: number;
  public nombreColaborador: string
  public MuesElabor: boolean;
  public MuesConce: boolean;
  public MuesAprob: boolean;
  public MuesHomo: boolean;
  public listaTipoFases: any[];
  public numeroficha: string;  
  //@ViewChild('tab') tab: TabGroupAnimationsExample1;
  constructor(private revisionService: BandejaDocumentoService, private toastr: ToastrService,
    private servicioValidacion: ValidacionService,
    private modalService: BsModalService,
    private serviceParametro: ParametrosService) {
    this.MuesElabor = true;
    this.MuesConce = true;
    this.MuesAprob = true;
    this.MuesHomo = true; 
  }

  ngOnInit() {
    this.inicializarVariables();
    this.obtenerCritica();
    this.obtenerFases();
  }

  obtenerFases(){   
    this.serviceParametro.obtenerParametroPadre(Constante.ETAPA_RUTA).subscribe(
        (response: Response) => {
          this.listaTipoFases = response.resultado;
        },
        (error) => this.controlarError(error)
    );
}

  inicializarVariables() {  
    this.codigoFase = '';
    this.observacion = '';
    this.loading = true;
  }

  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }


  public obtenerColaborador() {
    const config = <ModalOptions>{
      ignoreBackdropClick: true,
      keyboard: false,
      class: 'modal-lg'
    };

    this.bsModalRef = this.modalService.show(BusquedaColaboradorMigracionComponent, config);
    (<BusquedaColaboradorMigracionComponent>this.bsModalRef.content).onClose.subscribe((colaborador: Colaborador) => {      
      this.colaborador = colaborador;      
      this.numeroficha   = this.colaborador.numeroFicha;
      this.codigoColaborador = this.colaborador.idColaborador;
      this.nombreColaborador = this.colaborador.nombre + ' ' + this.colaborador.apellidoPaterno + ' ' + this.colaborador.apellidoMaterno;
    });
 
    this.obtenerCritica();
  }

  OnLimpiarCampos() {
    this.nombreColaborador = null;
    this.codigoFase=null;
    this.observacion= "";
    this.fechaCritica= null;
  }
  
  public obtenerCritica(): Critica {    
    this.critica = new Critica();
    this.critica.fechaFase = new Date(this.fechaCritica); // "yyyy-MM-dd'T'HH:mm:ss.SSSZ"
    this.critica.codigoColaboradorFase = Number(this.codigoColaborador);
    this.critica.nombreColaboradorFase = this.nombreColaborador;
    this.critica.codigoFase = Number(this.codigoFase);
    this.critica.observacion = this.observacion;    
    this.critica.numeroFicha =this.numeroficha ;
    return this.critica;
  }

}


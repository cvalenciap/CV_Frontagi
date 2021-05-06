import { Component, OnInit, Input } from '@angular/core';
import {BandejaDocumento} from '../../../models';
import { RegistroElaboracioncomponts } from 'src/app/modules/bandejadocumento/modales/registro-elaboracion.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { RevisionDocumentoMockService as RevisionDocumentosService} from '../../../services';
import {Response} from '../../../models/response';
import { REVISION } from '../constanteRevision';
import { Paginacion } from '../../../models/paginacion';
import {ParticipanteNuevoComponent } from 'src/app/modules/revisiondocumento/modals/participante-nuevo.component';
@Component({
  selector: 'revision-documento-participante',
  templateUrl: 'participante.template.html'
})
export class ParticipanteComponent implements OnInit {

  constanteRevision:any;
  selectedRow: number;
  //@Input()
  listaSeguimiento: BandejaDocumento[];
  @Input()
  tipoParticipante:string;
  items:any[];
  loading: boolean;
  parametroBusqueda: string;
  bsModalRef: BsModalRef;
  paginacion: Paginacion;
  constructor(private modalService: BsModalService,private service: RevisionDocumentosService)
    /*private router: Router,
    private service: PlanAuditoriaService,
    private sanitizer: DomSanitizer,
    private modalService: BsModalService) */{
      this.loading = false;
   //  this.selectedRow = -1;
     // this.items = [];
      this.parametroBusqueda = 'tipo';
    this.constanteRevision = REVISION;
    this.selectedRow = -1;
    this.paginacion = new Paginacion({registros: 10});
     }

  ngOnInit() {
    this.loading = false;
    this.getParticipantes();
  }
 
 

  OnNuevo(){
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
          tipoParticipante: this.tipoParticipante
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ParticipanteNuevoComponent, config);
    (<ParticipanteNuevoComponent>this.bsModalRef.content).onClose.subscribe(result => {
        //this.busquedaPlan = result;
        //this.OnBuscar();
    });
    
  }

  getParticipantes():void{
    this.service.obtenerParticipantes().subscribe(
      (response: Response) => {
        this.items = response.resultado;
        //this.paginacion = new Paginacion(response.paginacion);
        //this.loading = false; 
      },
      (error) => this.controlarError(error)
    );
  }

  controlarError(error) {
    console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  OnRowClick(index, obj): void {
    this.selectedRow = index;
    //this.selectedObject = obj;
  }
}


import { Component, OnInit, Input } from '@angular/core';
//import {BandejaDocumento, Paginacion,RevisionDocumento} from '../../../models';
import { Subject } from 'rxjs';
//import { Response } from '../../../models/response';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from 'src/app/services/impl/bandejadocumentos.service';
import { validate } from 'class-validator';
import { Constante } from 'src/app/models/enums/constante';
import { ValidacionService } from 'src/app/services';
import { Constante as constanteRevision } from 'src/app/models/constante';
import { BandejaDocumento, Paginacion, RevisionDocumento, Documento } from 'src/app/models';
import { Response } from 'src/app/models/response';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { ID_FASE } from 'src/app/constants/general/general.constants';
import { ActivatedRoute } from '@angular/router';
import { Equipo } from 'src/app/models/equipo';
import { SessionService } from 'src/app/auth/session.service';


@Component({
  selector: 'copia-impresa-bitacora',
  templateUrl: 'bitacora.template.html'
})
export class BitacoraComponent implements OnInit {
  public onClose: Subject<boolean>;
  @Input() activar: boolean;
  listaSeguimiento: BandejaDocumento[];
  loading: boolean;
  parametros: Map<string, any>;
  textoBusqueda: string;
  listaRevisionOrigen: RevisionDocumento[];
  listaRevision: RevisionDocumento[];
  parametroBusqueda: string;
  paginacion: Paginacion;
  placeholder: any;
  idDocumento: number;
  listaParametrosPadre: any[];
  txtDescripcionRevision: string;
  valorMotivoRevision: number;
  revision: RevisionDocumento;
  itemCodigo: number;
  errors: any;
  invalid: boolean;
  selectedRow: number;
  rutadocumentoCopia: string;
  objetoBlob: any
  valor:boolean;
  /*Lista Grilla Principal */
  RevisionDocumento: any;
  item: RevisionDocumento;
  items: RevisionDocumento[];
  selectedObject: RevisionDocumento;
  listaEquipo: Equipo[];
  nitemfooter: number;
  nomdestinatariofooter: string;
  lista: RevisionDocumento[];
  /*Lista Grilla Principal */
  private sub: any;


  constructor(private revisionService: BandejaDocumentoService, private toastr: ToastrService,
    private servicioValidacion: ValidacionService,
    private service: RevisionDocumentoService,
    private session: SessionService,
    private route: ActivatedRoute) {
    this.onClose = new Subject();
    this.paginacion = new Paginacion({ pagina: 1, registros: 10 });
    this.parametros = new Map<string, any>();
    this.parametroBusqueda = "codigo";
    this.placeholder = { "codigo": "Ejem.:1234", "nombreCompleto": "Ejm.: Instructivo de clase" };
    this.revision = new RevisionDocumento();
    this.revision.estado = new constanteRevision();
    this.errors = {};
    this.valor=true;

  }

  ngOnInit() {    
    this.loading = false;    
    this.paginacion = new Paginacion({ registros: 10 });
    this.items = new Array<RevisionDocumento>();
  }
  cargarTipoMotivacion() {
    this.revisionService.obtenerParametroPadre(Constante.ESTADO_MOTIVO_REVIS).subscribe(
      (response: Response) => {
        this.listaParametrosPadre = response.resultado;
      }
    );
  }
  controlarError(error) {
    this.loading = false;
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
  }
  obtenerRequestRevision(estado: number): RevisionDocumento {
    if (!this.revision.id) {
      let constante: constanteRevision = new constanteRevision();
      constante.idconstante = estado;
      this.revision.estado = this.revision.id ? this.revision.estado : constante;
    }
    this.revision.tabName = "revision";
    return this.revision;
  }
  cambiar() {
    console.log("motivo revi cambio " + this.revision.idmotirevi);
  }
  OnRowClick(index, obj): void {
    this.selectedRow = index;
    this.selectedObject = obj;
  }
  Validar(objectForm) {
    console.log("entroi al validar", this.revision);
    this.servicioValidacion.validacionSingular(this.revision, objectForm, this.errors);
  }

  OnFooter(item: RevisionDocumento, visorPdfSwal) {
    
    //Captura de Datos del Registro para el Footer
    let rutacopiacontrolada = item.rutaDocumentoCopiaCont;
    if(rutacopiacontrolada!=null){
      this.nitemfooter = Number(item.nrum);
      this.nomdestinatariofooter = item.nomapellidoparterDestina;//name 
      let idrevi = item.id;
      let iddocu = item.documento.id;
      
      this.service.ServicioFooter(this.nitemfooter, this.nomdestinatariofooter,iddocu,idrevi).subscribe((data: Blob) => {
      this.objetoBlob = new Blob([data], { type: 'application/pdf' });
      visorPdfSwal.show();          
      });
    }else {
      this.toastr.error('No tiene ningún documento para mostrar.', 'Atención', {closeButton: true});
    }
  }

}

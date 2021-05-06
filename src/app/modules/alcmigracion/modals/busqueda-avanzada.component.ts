import { Component, OnInit } from '@angular/core';
import { BsModalRef } from 'ngx-bootstrap';
import { Subject } from 'rxjs';
import { REVISION } from 'src/app/modules/revisiondocumento/constanteRevision';
import { RevisionDocumentoMockService, BandejaDocumentoService, ValidacionService } from 'src/app/services';
import {Response} from '../../../models/response';
import { RevisionDocumento, Paginacion, ParametrosRevision } from 'src/app/models';
import { RevisionDocumentoService } from 'src/app/services/impl/revisiondocumentos.service';
import { DatePipe } from '@angular/common';
import { Constante } from 'src/app/models/enums';
import { validate } from 'class-validator';
import { ToastrService } from 'ngx-toastr';


@Component({
  selector: 'app-buscador-documento',
  templateUrl: './busqueda-avanzada.component.html'
})
export class BusquedaAvanzadaComponent implements OnInit {
  public onClose: Subject<Response>;
  constanteRevision: any;
  txtTitulo: string;
  fechaInicio: string;
  fechaFinal: string;
  paginacion: Paginacion;
  parametros: Map<string, any>;
  slEstado: string;
  txtNombreCompleto: string;
  txtCodigo: string;
  listaParametrosPadre: any[];
  errors: any;
  parametrosRevision: ParametrosRevision;
  mensajes: any[];
 
  constructor(public bsModalRef: BsModalRef,private serviceMock: RevisionDocumentoMockService,private servicioValidacion:ValidacionService,
    private service: RevisionDocumentoService,private datePipe: DatePipe,private documentService: BandejaDocumentoService,
    private toastr: ToastrService) {
    this.onClose = new Subject();
    this.constanteRevision = REVISION;
    this.parametros = new Map<string,any>();
    this.slEstado = "";
    this.parametrosRevision = new ParametrosRevision();
    this.errors = {};
   }

  ngOnInit() {    
    this.cargarEstadoSolicitud();
    this.onClose = new Subject();
  }

  Validar(objectForm) {    
    this.servicioValidacion.validacionSingular(this.parametrosRevision,objectForm,this.errors);
  }

  onBuscar(){
    
    validate(this.parametrosRevision).then( errors => {
      this.errors = {};
      if (errors.length > 0) {        
        this.mensajes = errors.map(e => {
          this.errors[e.property] = e.constraints[Object.keys(e.constraints)[0]];
          return this.errors[e.property];
        });
        this.toastr.error(`${this.mensajes.join('. ')}`, 'Acción inválida', {closeButton: true});
      }else{
        this.parametros.set("codigoDoc",this.parametrosRevision.codigoDoc);
        this.parametros.set("tituloDoc",this.parametrosRevision.tituloDoc);
        
        //this.parametros.set("nombreCompleto",this.txtNombreCompleto);
        //this.slEstado = this.slEstado?","+this.slEstado+",":'';
        //this.parametros.set("estado",this.slEstado);
        this.parametros.set("fechaInicio",this.datePipe.transform(this.parametrosRevision.fechaInicio,"dd/MM/yyyy"));
        this.parametros.set("fechaFinal",this.datePipe.transform(this.parametrosRevision.fechaFinal,"dd/MM/yyyy"));
        
        this.service.listarRevisionDocumentos(this.parametros,1,this.paginacion.registros).subscribe(
          (response: Response) => {
            this.onClose.next(response);
            this.bsModalRef.hide();
          (error) => this.controlarError(error)
        }
        );
      }
 
    });
    
      
  }
      controlarError(error) {
        alert(error);
      }

      cargarEstadoSolicitud(){
        this.documentService.obtenerParametroPadre(Constante.ESTADO_SOLICITUD).subscribe(
          (response:Response)=>{
            this.listaParametrosPadre = response.resultado;
          }
        );
      }
}

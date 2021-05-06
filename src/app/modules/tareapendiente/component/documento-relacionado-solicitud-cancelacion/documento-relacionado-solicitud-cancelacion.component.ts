import {AfterViewInit, Component, Input, OnInit} from '@angular/core';
import {Documento, Paginacion, Response} from '../../../../models';
import {TareaService} from '../../../../services/impl/tarea.service';
import { SolicitudDocumentoComplementario } from 'src/app/models/solicituddocumentocomplementario';
import { Cancelacion } from 'src/app/models/cancelacion';
import { ToastrService } from 'ngx-toastr';
import { Router } from '@angular/router';
import { SessionService } from 'src/app/auth/session.service';

@Component({
  selector: 'app-documento-relacionado-solicitud-cancelacion',
  templateUrl: './documento-relacionado-solicitud-cancelacion.component.html',
  styleUrls: ['./documento-relacionado-solicitud-cancelacion.component.scss']
})
export class DocumentoRelacionadoSolicitudCancelacionComponent implements OnInit {
  public documento: Documento;
  public documentosComplementarios: Documento[];
  public documentosComplementan:Documento[];

  public documentosComplementariosSolicitud:SolicitudDocumentoComplementario[];

  public selectedRow: number;
  public paginacion: Paginacion;
  public item: any;
  public nombreArchivoRevision: any;

  public docComplSolic:SolicitudDocumentoComplementario[];

  public docPadresComplementarios:Documento[];

  editar:boolean;
  indCancelacion:string;

  tabName:any;
  urlPDF:any;

  cambioDocumento:boolean;
  rutaActual:string;
  rutaAnterior:string;
  rutaAnteriorAnterior:string;

  constructor(private tareaService: TareaService,
    private toastr:ToastrService,
    private router: Router,
    private session: SessionService
    ) {
    this.paginacion = new Paginacion({registros: 10});
    this.tabName = "relationship";
    
    this.rutaActual = this.router.url;
    let item = JSON.parse(sessionStorage.getItem("item"));
    this.rutaAnterior = item.rutaAnterior;
    this.rutaAnteriorAnterior = item.rutaAnteriorAnterior;
  }

  ngOnInit() {
    this.indCancelacion = localStorage.getItem("indCancelacion");
    this.cambioDocumento = false;
    this.editar = false;
    this.documentosComplementariosSolicitud = [];
    this.tareaService.documento.subscribe( documento => this.documento = documento);
    this.tareaService.cambioDocumentoInput.subscribe(cambioDocumento => this.cambioDocumento = cambioDocumento);
    console.log("documentoInicial");
    console.log(this.documento);
    this.documentosComplementarios = this.documento.listaComplementario;
    this.documentosComplementan = [];
    this.docComplSolic = [];
    console.log('Documento seleccionado [documento-relacionado] => ', this.documentosComplementarios);
  }

  OnRowClick(numero: number, item: any) {}

  OnPageChanged(event) {}

  OnPageOptionChanged(event) {}

  convertirDocumentosComplementarios(){
    console.log("Documento llego aqui");
    console.log(this.documento);

    
    this.documentosComplementariosSolicitud = [];
    console.log(this.docComplSolic);
    console.log(this.documentosComplementarios);
    if(this.editar && !this.cambioDocumento){
      if(this.documentosComplementarios.length > this.docComplSolic.length){
        for(let doc of this.documentosComplementarios){
          let band:boolean = false;
          for(let docComp of this.docComplSolic){
            if(doc.id == docComp.idDocumento){
              let solicitudDocCompl:SolicitudDocumentoComplementario = new SolicitudDocumentoComplementario();
              solicitudDocCompl.idDocumento = doc.id;
              solicitudDocCompl.documento = doc;
              solicitudDocCompl.indicadorSolicitud = docComp.indicadorSolicitud;
              this.documentosComplementariosSolicitud.push(solicitudDocCompl);
              band = true;
              break;
            }
          }
          if(!band){
            let solicitudDocCompl:SolicitudDocumentoComplementario = new SolicitudDocumentoComplementario();
            solicitudDocCompl.idDocumento = doc.id;
            solicitudDocCompl.documento = doc;
            solicitudDocCompl.indicadorSolicitud = "0";
            this.documentosComplementariosSolicitud.push(solicitudDocCompl);
          }
        }
      }else{
        for(let docComp of this.docComplSolic){
          for(let doc of this.documentosComplementarios){
            if(docComp.idDocumento == doc.id){
              docComp.documento = doc;
              break;
            }
          }
        }

        for(let docComplSolic of this.docComplSolic){
          console.log("Aquiii");
          this.documentosComplementariosSolicitud.push(Object.assign({},docComplSolic));
        }

      }
      
    }else{
      this.documentosComplementariosSolicitud = [];

      for(let doc of this.documentosComplementarios){
        if(doc.tipoComplementario.v_descons == "Complementarios"){
          let solicitudDocCompl:SolicitudDocumentoComplementario = new SolicitudDocumentoComplementario();
          solicitudDocCompl.idDocumento = doc.id;
          solicitudDocCompl.documento = doc;
          solicitudDocCompl.indicadorSolicitud = "0";
          this.documentosComplementariosSolicitud.push(solicitudDocCompl);
        }
        
      }
    }

    

  }

  agregarDocumentosComplementarios(){
    for(let doc of this.documentosComplementarios){
      if(doc.tipoComplementario.v_descons == "Complementarios"){
        let solicitudDocCompl:SolicitudDocumentoComplementario = new SolicitudDocumentoComplementario();
        solicitudDocCompl.idDocumento = doc.id;
        solicitudDocCompl.documento = doc;
        solicitudDocCompl.indicadorSolicitud = "0";
        this.documentosComplementariosSolicitud.push(solicitudDocCompl);
      }
      
    }
  }

  obtenerPadresComplementarios(document:Documento){
    this.tareaService.obtenerDocumentosJerarquicos(document.id).subscribe(
      (response: Response) => {
        this.docPadresComplementarios = response.resultado;
        
      },
      (error) => this.controlarError(error)
    ); 
  }

  darCheck(item:SolicitudDocumentoComplementario){
    if(item.indicadorSolicitud == "0"){
      item.indicadorSolicitud = "1";
    }else if(item.indicadorSolicitud == "1"){
      item.indicadorSolicitud = "0";
    }
    
  }

  enviarDatosCancelacion(cancelacion:Cancelacion){
    this.editar = true;
    this.docComplSolic = cancelacion.listaSolicitudesDocComp;

  }

  buscarRutaDocumento(documento:Documento,visorPdfSwal:any,event:any){
    console.log("id para ruta");
    console.log(documento.id);
    this.tareaService.obtenerRutaDocCopiaControlada(documento.id).subscribe(
      (response: Response) => {
        let ruta:string = response.resultado;
        if(ruta!=null){
          this.urlPDF = ruta;
          visorPdfSwal.show();
          event.stopPropagation();
        }else{
          this.toastr.error('El documento no cuenta con el archivo para visualización', 'Error', {closeButton: true});
        }
      },
      (error) => this.controlarError(error)
    ); 
  }

  controlarError(error) {
    console.error(error);
    this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

}

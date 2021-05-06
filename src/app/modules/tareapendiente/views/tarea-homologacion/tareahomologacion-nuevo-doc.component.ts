import { Component, OnInit, ViewChild, Input, ElementRef } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import { BsLocaleService } from 'ngx-bootstrap/datepicker';
import { defineLocale } from 'ngx-bootstrap/chronos';
import { esLocale } from 'ngx-bootstrap/locale';
import { ToastrService } from 'ngx-toastr';
import { BandejaDocumentoService } from '../../../../services';
import { Tipo } from '../../../../models/tipo';
import { Estado } from '../../../../models/enums/estado';
import { BandejaDocumento } from '../../../../models/bandejadocumento';
import { Response } from '../../../../models/response';
//importamos  consulta de codigo anterior 
import { ConsultaCodigoAnteriorcomponents } from 'src/app/modules/bandejadocumento/modales/consulta-codigo-anterior.component';
import { ModalOptions, BsModalService, BsModalRef } from 'ngx-bootstrap';
import { DocGoogleDocs } from 'src/app/modules/google-docs/views/doc-google-docs.component';
import { NgxSpinnerService } from 'ngx-spinner';

@Component({
  selector: 'tareahomologacion-nuevo-doc',
  templateUrl: 'tareahomologacion-nuevo-doc.template.html',
  //styleUrls:['tareaelaboracion-nuevo-doc.component.scss']
})
export class ContenedorNuevoDocGoogleDocsHomologComponent implements OnInit {

  idfinal: string;
  idDocGoogleDrive: string;
  idDocumento: number;
  idRevi: number;
  private sub: any;
  dataFase: any;
  doc: any[] = [];
  comboRevision: any;
  descripcionRevision: any;
  listaEquipo: any[] = [];
  lstElaboracion: any[] = [];
  lstConsenso: any[] = [];
  lstAprobacion: any = [];
  lstHomologacion: any[] = [];
  tipoDocumentoCrear: string;

  @ViewChild("idDocGoogle") idDocGoogle: DocGoogleDocs;
  @ViewChild("idRevision") idRevision: DocGoogleDocs;

  // @ViewChild('tabsDetalle') tabsDetalle: TabsetComponent;
  constructor(private localeService: BsLocaleService,
    private toastr: ToastrService,
    private router: Router,
    private route: ActivatedRoute,
    private service: BandejaDocumentoService,
    private spinner: NgxSpinnerService,
    private modalService: BsModalService) {
    defineLocale('es', esLocale);
    this.localeService.use('es');
    //this.parametroBusqueda = 'tipo';
    ///this.activar= false;
    //this.consulta=true;


  }
  ngOnInit() {
    
    this.doc = JSON.parse(sessionStorage.getItem("listaDocumentos"));
    this.idDocGoogleDrive = localStorage.getItem("idDocuGoogleDrive");
    this.sub = this.route.params.subscribe(params => {
      //this.idDocGoogleDrive = params['idDocGoogleDrive'];
      this.idRevi = params['idRevision'];
      this.idDocumento = params['idDocumento'];
      //if (!this.idDocGoogleDrive) {

      let tipoDocCrear;

      tipoDocCrear = localStorage.getItem("crearTipoDoc");
      if (tipoDocCrear == 'crearDocWord') {
        this.tipoDocumentoCrear = "word";
      } else if (tipoDocCrear == 'crearDocExcel') {
        this.tipoDocumentoCrear = "excel";
      }

      if (!this.idDocGoogleDrive) {
        //const parametros: {codigo?: string, titulo?: string, numero?: string,idFase?:string} = {codigo: null, titulo: null, numero: null,idFase:String(ID_FASE.ELABORACION)};
        //this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(
        //const parametros: {idrevi?: string} = {idrevi: null};
        this.idDocGoogle.urlRuta = "assets/html/loading.html";
        this.service.crearDocumentoGoogleDrive(this.idRevi, this.tipoDocumentoCrear).subscribe(
          (response: Response) => {
            let resultado = response.resultado;
            this.idDocGoogleDrive = response.resultado.idDocGoogleDrive;
            if (this.idDocGoogleDrive) {
              localStorage.setItem("idDocuGoogleDrive", this.idDocGoogleDrive);
            }
            //this.idDocGoogle.idDocGoogle = response.resultado.idDocGoogleDrive;
            this.idDocGoogle.actualizarUrlGoogleDrive(response.resultado.idDocGoogleDrive);
            console.log("RESULTADO", this.idDocGoogle.idDocGoogle);
            //(response: Response) => {
            /*
              /*let listaderevisiondoc:RevisionDocumento[] = response.resultado;
              listaderevisiondoc.forEach(documento => {
                /*if (documento.fechaPlazoAprob != null){
                  documento.fechaPlazoAprob= this.datePipe.transform(documento.fechaPlazoAprob,"dd/MM/yyyy");
                }else {
                  documento.fechaPlazoAprob = " ";
                }
                if (documento.fecha != null){
                  documento.fecha= this.datePipe.transform(documento.fecha,"dd/MM/yyyy");
                }else {
                  documento.fecha = " ";
                }
              });*/
            /*this.items = response.resultado;
            this.paginacion = new Paginacion(response.paginacion);
            this.loading = false;*/
          },
          (error) => this.controlarError(error)
        );
      } else {

        //this.idDocGoogle.actualizarUrlGoogleDrive(this.idDocGoogleDrive);
        this.spinner.show()
        let tipoDocBD = this.idDocGoogleDrive.substr(-4, 4);   //word  o excel
        localStorage.setItem("tipoDocBD", tipoDocBD);
        this.idfinal = this.idDocGoogleDrive.substr(0, 44);   //id
        this.idDocGoogle.actualizarUrlGoogleDrive(this.idfinal);
        this.spinner.hide()

      }
    });



    //Busca si el registro seleccionado tiene id de documento gogle drive
    /*const parametros: {codigo?: string, titulo?: string, numero?: string,idFase?:string} = {codigo: null, titulo: null, numero: null,idFase:String(ID_FASE.ELABORACION)};
    this.service.buscarPorParametros(parametros, this.paginacion.pagina, this.paginacion.registros).subscribe(      
        (response: Response) => {
          
            let listaderevisiondoc:RevisionDocumento[] = response.resultado;
            listaderevisiondoc.forEach(documento => {
              if (documento.fechaPlazoAprob != null){
                documento.fechaPlazoAprob= this.datePipe.transform(documento.fechaPlazoAprob,"dd/MM/yyyy");
              }else {
                documento.fechaPlazoAprob = " ";
              }
              if (documento.fecha != null){
                documento.fecha= this.datePipe.transform(documento.fecha,"dd/MM/yyyy");
              }else {
                documento.fecha = " ";
              }
            });
            this.items = response.resultado;
            this.paginacion = new Paginacion(response.paginacion);
            this.loading = false;
        },
        (error) => this.controlarError(error)
    );*/




    /*
    this.service.obtenerTipos().subscribe(
        (response: Response) => this.listaTipos = response.resultado,            
    );

    this.sub = this.route.params.subscribe(params => {
        this.itemCodigo = + params['codigo'];
    });
    if (this.itemCodigo) {
        this.service.buscarPorCodigo(this.itemCodigo).subscribe(
            (response: Response) => this.item = response.resultado,
            
        );
    } else {
    }
    */
  }
  //Buscar del Modal Consulta por codigo anterior
  OnBuscar() {
    /*
    this.parametroBusqueda = "avanzada";
    const config = <ModalOptions>{
        ignoreBackdropClick: true,
        keyboard: false,
        initialState: {
        },
        class: 'modal-lg'
    }
    this.bsModalRef = this.modalService.show(ConsultaCodigoAnteriorcomponents, config);
    (<ConsultaCodigoAnteriorcomponents>this.bsModalRef.content).onClose.subscribe(result => {
    });
    */
  }

  OnRegresar() {
    
    this.dataFase = JSON.parse(sessionStorage.getItem("datosFase"));
    this.comboRevision = JSON.parse(sessionStorage.getItem("revisionIdmotivo"));
    this.descripcionRevision = JSON.parse(sessionStorage.getItem("revisionDescripcion"));
    this.listaEquipo = JSON.parse(sessionStorage.getItem("listEquipoReturn"));
    this.lstElaboracion = JSON.parse(sessionStorage.getItem("listElaboracion"));
    this.lstConsenso = JSON.parse(sessionStorage.getItem("listConseso"));
    this.lstAprobacion = JSON.parse(sessionStorage.getItem("listAprobacion"));
    this.lstHomologacion = JSON.parse(sessionStorage.getItem("listHomologacion"));


    sessionStorage.setItem('comboRevision', JSON.stringify(this.comboRevision));
    sessionStorage.setItem('descripcionRevision', JSON.stringify(this.descripcionRevision));
    sessionStorage.setItem('listaEquipoAux', JSON.stringify(this.listaEquipo));
    sessionStorage.setItem('listaElaboracionAux', JSON.stringify(this.lstElaboracion));
    sessionStorage.setItem('listaConsensoAux', JSON.stringify(this.lstConsenso));
    sessionStorage.setItem('listaAprobacionAux', JSON.stringify(this.lstAprobacion));
    sessionStorage.setItem('listaHomologacionAux', JSON.stringify(this.lstHomologacion));

    sessionStorage.setItem('FaseDatos', JSON.stringify(this.dataFase));
    sessionStorage.setItem('tabDocumentos', JSON.stringify(this.doc));
    sessionStorage.setItem('retornoLista', JSON.stringify(this.doc));

    if (this.idDocGoogleDrive != null && this.idDocGoogleDrive != undefined) {
      localStorage.setItem("idDocuGoogleDrive", this.idDocGoogleDrive);
    }
    let valor = 0;
    this.service.desBloquear(valor).subscribe(
      (response: Response) => {
        this.router.navigate([`documento/tareapendiente/HomologarRevisionRegistro`]);
      },
      (error) => this.controlarError(error)
    );
  }
  controlarError(error) {
    //console.error(error);
    // this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', {closeButton: true});
  }

  selectFile() {
    //this.fileRevision.nativeElement.click();

  }
  archivoCambio() {
    //this.nombreArchivoRevision = this.fileRevision.nativeElement.value;
  }
}

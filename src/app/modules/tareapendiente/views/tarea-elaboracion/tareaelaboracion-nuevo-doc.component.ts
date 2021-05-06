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
    selector: 'tareaelaboracion-nuevo-doc',
    templateUrl: 'tareaelaboracion-nuevo-doc.template.html',

})
export class ContenedorNuevoDocGoogleDocsComponent implements OnInit {
    idDocGoogleDrive: string;
    a:String;
    idRevi: number;
    idDocumento: number;
    private sub: any;
    dataFase:any;
    idfinal: string;
    doc:any[]=[];
    comboRevision:any;
    descripcionRevision:any;
    listaEquipo:any[]=[];
    lstElaboracion:any[]=[];
    lstConsenso:any[]=[];
    lstAprobacion:any=[];
    lstHomologacion:any[]=[];
    tipoDocumentoCrear: string;

    @ViewChild("idDocGoogle") idDocGoogle: DocGoogleDocs;
    @ViewChild("idRevision") idRevision: DocGoogleDocs;
    constructor(private localeService: BsLocaleService,
        private toastr: ToastrService,
        private router: Router,
        private route: ActivatedRoute,
        private service: BandejaDocumentoService,        
        private spinner: NgxSpinnerService,
        private modalService: BsModalService) {
        defineLocale('es', esLocale);
        this.localeService.use('es');
    }

    ngOnInit() {
        
        
        this.doc=JSON.parse(sessionStorage.getItem("listDoc"));
       /*  sessionStorage.removeItem("Fase");
        sessionStorage.removeItem("listDoc"); */
        this.idDocGoogleDrive = localStorage.getItem("idDocuGoogleDrive");
        this.sub = this.route.params.subscribe(params => {
            //this.idDocGoogleDrive = params['idDocGoogleDrive'];
            this.idRevi = params['idRevision'];
            this.idDocumento = params['idDocumento'];
            //if (!this.idDocGoogleDrive) {
                
            if (this.idDocGoogleDrive == undefined || this.idDocGoogleDrive == null) {
                this.idDocGoogle.urlRuta = "assets/html/loading.html";
                this.spinner.show()

                let tipoDocCrear;

                tipoDocCrear = localStorage.getItem("crearTipoDoc");
                if (tipoDocCrear == 'crearDocWord') {
                    this.tipoDocumentoCrear = "word";
                  }else if (tipoDocCrear == 'crearDocExcel'){
                    this.tipoDocumentoCrear = "excel";
                }

                this.service.crearDocumentoGoogleDrive(this.idRevi, this.tipoDocumentoCrear).subscribe(
                    (response: Response) => {
                        this.spinner.hide()                       
                        let resultado = response.resultado;                        
                        this.idDocGoogleDrive = response.resultado.idDocGoogleDrive;
                        let tipoDocBD = this.idDocGoogleDrive.substr(-4,4);//word o exel
                        localStorage.setItem("tipoDocBD", tipoDocBD);                   
                        this.idfinal = this.idDocGoogleDrive.substr(0,44);   //id                                             
                        if (this.idfinal) {
                            //localStorage.setItem("idDocuGoogleDrive", this.idDocGoogleDrive);
                            localStorage.setItem("idDocuGoogleDrive", this.idfinal);
                        }
                        this.spinner.show()
                        //this.idDocGoogle.actualizarUrlGoogleDrive(response.resultado.idDocGoogleDrive);
                        this.idDocGoogle.actualizarUrlGoogleDrive(this.idfinal);
                        this.spinner.hide()
                    },
                    (error) => this.controlarError(error)
                );
            } else {
                
                this.spinner.show()
                let tipoDocBD = this.idDocGoogleDrive.substr(-4,4);   //word  o excel
                localStorage.setItem("tipoDocBD", tipoDocBD);                   
                this.idfinal = this.idDocGoogleDrive.substr(0,44);   //id
                this.idDocGoogle.actualizarUrlGoogleDrive(this.idfinal );
                this.spinner.hide()
            }
        });
    }

    OnBuscar() {
    }

    OnRegresar() {
        
        this.dataFase=JSON.parse(sessionStorage.getItem("datosFase"));
        this.comboRevision=JSON.parse(sessionStorage.getItem("revisionIdmotivo"));
        this.descripcionRevision=JSON.parse(sessionStorage.getItem("revisionDescripcion"));
        this.listaEquipo=JSON.parse(sessionStorage.getItem("listEquipoReturn"));
        this.lstElaboracion=JSON.parse(sessionStorage.getItem("listElaboracion"));
        this.lstConsenso=JSON.parse(sessionStorage.getItem("listConseso"));
        this.lstAprobacion=JSON.parse(sessionStorage.getItem("listAprobacion"));
        this.lstHomologacion=JSON.parse(sessionStorage.getItem("listHomologacion"));
        

        sessionStorage.setItem('comboRevision', JSON.stringify(this.comboRevision));
        sessionStorage.setItem('descripcionRevision', JSON.stringify(this.descripcionRevision));
        sessionStorage.setItem('listaEquipoAux', JSON.stringify(this.listaEquipo));
        sessionStorage.setItem('listaElaboracionAux', JSON.stringify(this.lstElaboracion));
        sessionStorage.setItem('listaConsensoAux', JSON.stringify(this.lstConsenso));
        sessionStorage.setItem('listaAprobacionAux', JSON.stringify(this.lstAprobacion));
        sessionStorage.setItem('listaHomologacionAux', JSON.stringify(this.lstHomologacion));

        sessionStorage.setItem('FaseDatos', JSON.stringify(this.dataFase));
        sessionStorage.setItem('tabDocumentos', JSON.stringify(this.doc));
        if (this.idDocGoogleDrive != null && this.idDocGoogleDrive != undefined) {
            localStorage.setItem("idDocuGoogleDrive", this.idDocGoogleDrive);
        }
        let valor=0; 
         this.service.desBloquear(valor).subscribe(
            (response: Response) => {
                
                //this.item = response.resultado;
                //this.toastr.success('Se ha bloqueado el acceso del documento','Acción completada!',{closeButton:true});
                this.router.navigate([`documento/tareapendiente/ElaborarRevisionRegistro`]);
            },
            (error) => this.controlarError(error)
        );

       
    }
    controlarError(error) {
        console.error(error);
        this.toastr.error('Se presentó un error inesperado en la última acción', 'Error', { closeButton: true });
    }
    selectFile() {
    }
    archivoCambio() {
    }
}

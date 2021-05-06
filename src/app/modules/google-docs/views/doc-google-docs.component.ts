import { Component, ViewChild, OnInit, Input, Output, EventEmitter,ElementRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { DomSanitizer, SafeResourceUrl, SafeUrl } from '@angular/platform-browser';


@Component({
  selector: 'doc-google-docs',
  templateUrl: 'doc-google-docs.template.html'//,
  //styleUrls: ['doc-google-docs.template.scss'],
})
export class DocGoogleDocs implements OnInit {
  @ViewChild('iframe') iframe: ElementRef;

  idDocGoogle: string;
  rutaMostrarDocPre: string;
  rutaMostrarExclPre: string;
  rutaMostrarDocPost: string;
  rutaCompleta: string;
  rutaCompletaExcel: string;
  urlRuta: string;//SafeResourceUrl;  
  urlRutaExcel: SafeResourceUrl;  
  constructor(private sanitizer: DomSanitizer /*private _jsonService:JsonService,private route: ActivatedRoute*/)  
  {
  
  }
 
  actualizarUrlGoogleDrive(idDocGoogle) {
    this.rutaMostrarDocPre = "https://docs.google.com/document/d/";
    this.rutaMostrarExclPre = 'https://docs.google.com/spreadsheets/d/';

    this.rutaMostrarDocPost = "/edit";
    this.rutaCompleta = this.rutaMostrarDocPre + idDocGoogle + this.rutaMostrarDocPost;
    this.rutaCompletaExcel = this.rutaMostrarExclPre + idDocGoogle + this.rutaMostrarDocPost;       
    let tipoDocCrear;
    tipoDocCrear = localStorage.getItem("crearTipoDoc");
    /*Nuevo */
    
    if (tipoDocCrear == 'crearDocWord') {
      this.urlRuta = this.rutaCompleta;
      localStorage.removeItem("crearTipoDoc")
    } else if (tipoDocCrear == 'crearDocExcel') {
      this.urlRuta = this.rutaCompletaExcel;
      localStorage.removeItem("crearTipoDoc")
    }  
    /*Modificado*/
    let tipoDoCBD = localStorage.getItem("tipoDocBD");
    if (tipoDoCBD == "word") {
      this.urlRuta = this.rutaCompleta;
      localStorage.removeItem("tipoDocBD")
    } else if (tipoDoCBD == "exel") {
      this.urlRuta = this.rutaCompletaExcel;
      localStorage.removeItem("tipoDocBD")
    }
    this.iframe.nativeElement.src = this.urlRuta;
  }
  ngOnInit(): void {
    this.setIframeReady(this.iframe);
    console.log(this.iframe);    
  }

  private setIframeReady(iframe: ElementRef): void {
    const win: Window = iframe.nativeElement.contentWindow;  
  this.iframe.nativeElement.src = this.urlRuta;
  
  }

}

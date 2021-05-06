import { Component, OnInit, Input } from '@angular/core';
import { environment } from '../../../../environments/environment';
import { ElementRef } from '@angular/core';

@Component({
  selector: 'visor-pdf',
  templateUrl: 'visor-pdf.template.html'
})
export class VisorPdfComponent implements OnInit {

  @Input('url') url: string;
  @Input('file') file: any;
  @Input('VisualizaPrint') VisualizaPrint: any;  
  @Input() download: boolean= false;

  fullUrl: any;
  valorFinal:boolean;
  constructor(private elRef: ElementRef
  ) {
  }

  ngOnInit() {
        
    if (this.url != undefined && this.url != null) {
      if (this.url.includes('http://')) {
        this.fullUrl = this.url;
      } else {
        this.fullUrl = `${environment.serviceFileServerEndPoint}/${this.url}`;
      }
    } else {
      this.fullUrl = this.file;
    }
    if(this.VisualizaPrint!=undefined || this.VisualizaPrint!=null){
      this.valorFinal = this.VisualizaPrint;
    }else{
      this.valorFinal= false;
    }
  }
}



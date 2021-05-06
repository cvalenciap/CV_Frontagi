

import { Component, OnInit, ElementRef ,ViewChild} from '@angular/core';  
//import * as jspdf from 'jspdf';  

@Component({
  selector: 'app-impresion-informe',
  templateUrl: './impresion-informe.component.html',
  styleUrls: ['./impresion-informe.component.scss']
})




export class ImpresionInformeComponent  {



 src = "https://vadimdez.github.io/ng2-pdf-viewer/assets/pdf-test.pdf";
 
  constructor() { }

  ngOnInit() {
  }


@ViewChild('content') content:ElementRef;


}


  

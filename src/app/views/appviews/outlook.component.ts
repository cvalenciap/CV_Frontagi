import { Component, AfterViewInit } from '@angular/core';
//import 'jquery-slimscroll';

declare var jQuery:any;

@Component({
  selector: 'outlook',
  templateUrl: 'outlook.template.html'
})
export class OutlookViewComponent implements AfterViewInit {

  ngAfterViewInit() {
    // Add slimscroll to element
    jQuery('.full-height-scroll').slimscroll({
      height: '100%'
    });
  }

}

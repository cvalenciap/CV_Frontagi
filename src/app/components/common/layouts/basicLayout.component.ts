import { Component } from '@angular/core';
import { detectBody } from '../../../app.helpers';
import { TopNavbarComponent } from 'src/app/components/common/topnavbar/topnavbar.component';
import { ViewChild } from '@angular/core';

declare var jQuery:any;

@Component({
  selector: 'basic',
  templateUrl: 'basicLayout.template.html',
  host: {
    '(window:resize)': 'onResize()'
  }
})
export class BasicLayoutComponent {

  @ViewChild("top") topNavBar:TopNavbarComponent;
  idModulo:string;


  public ngOnInit():any {
    
    if(localStorage.getItem('idModulo')==undefined || localStorage.getItem('idModulo') == null){
      this.idModulo = "1";
    }else{
      this.idModulo = localStorage.getItem('idModulo');
    }
    
    detectBody();    
    this.topNavBar.emitEvent.subscribe(obj =>
      {
        this.idModulo = obj;
        localStorage.setItem('idModulo', this.idModulo);
      }
    );
  }

  public onResize(){
    detectBody();
  }

}

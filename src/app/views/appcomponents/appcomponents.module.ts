import {NgModule} from '@angular/core';
import {CommonModule} from '@angular/common';
import {RouterModule} from '@angular/router';
import {SpinKitModule} from '../../components/common/spinkit/spinkit.module';

// routes
import {ROUTES} from './appcomponents.routes';
// views
import {SpinkitDemoComponent} from './spinkit.component';


@NgModule({
  declarations: [
    SpinkitDemoComponent
  ],
  imports: [
    CommonModule,
    SpinKitModule,
    RouterModule.forRoot(ROUTES)
  ]
})
export class AppComponentsModule { }
